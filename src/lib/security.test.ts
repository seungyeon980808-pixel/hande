import { describe,expect,it } from "vitest";
import { newToken,safeFileName,tokenHash } from "./security";
describe("security helpers",()=>{it("creates non-reversible token hashes",()=>{const token=newToken();expect(token.length).toBeGreaterThan(32);expect(tokenHash(token)).toMatch(/^[a-f0-9]{64}$/);expect(tokenHash(token)).not.toContain(token)});it("removes path and reserved filename characters",()=>{expect(safeFileName("../../교무/계획:1.hwpx")).toBe("교무_계획_1.hwpx")})});
