// 편집기(vendor/rhwp-studio) 빌드 산출물을 public/rhwp 로 옮긴다.
//
// dist 에는 없고 public/rhwp 에만 있는 것들(fonts, icons, favicon, sw.js)을
// 지우지 않도록, assets 는 통째로 갈아 끼우고 나머지는 덮어쓰기만 한다.
// 빌드마다 파일 해시가 바뀌므로 손으로 복사하면 옛 번들이 남거나 참조가 깨진다.
import { cp, mkdir, readdir, rm, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "vendor/rhwp-studio/dist");
const target = path.join(root, "public/rhwp");

const distAssets = path.join(dist, "assets");
const targetAssets = path.join(target, "assets");

await rm(targetAssets, { recursive: true, force: true });
await mkdir(targetAssets, { recursive: true });
await cp(distAssets, targetAssets, { recursive: true });

for (const entry of await readdir(dist, { withFileTypes: true })) {
  if (entry.name === "assets") continue;
  await cp(path.join(dist, entry.name), path.join(target, entry.name), { recursive: true });
}

// index.html 이 실제로 존재하는 번들을 가리키는지 확인한다. 참조가 깨지면 빈 화면이 된다.
const html = await readFile(path.join(target, "index.html"), "utf8");
const referenced = [...html.matchAll(/assets\/([A-Za-z0-9_.-]+\.(?:js|css))/g)].map(match => match[1]);
const present = new Set(await readdir(targetAssets));
const missing = referenced.filter(name => !present.has(name));
if (missing.length) {
  console.error("index.html 이 없는 파일을 가리킵니다:", missing.join(", "));
  process.exit(1);
}
console.log(`편집기 배포 완료 — 번들 ${referenced.length}개 참조 확인`);
