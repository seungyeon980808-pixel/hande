"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "통합 대시보드", href: "#" },
  { label: "시간표", href: "/timetable" },
  { label: "업무 취합", href: "/" },
  { label: "나의 툴박스", href: "/tools" },
  { label: "자료실", href: "#" },
  { label: "업무 매뉴얼", href: "/manuals" },
];

export function AppFrame({
  children,
  active = "업무 취합",
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="app-shell">
      <div className="layout">
        <aside className="sidebar">
          <Link href="#" className="brand" style={{ display: "block", textDecoration: "none" }}>
            수합의 정석 <small>한글·엑셀 파일 자동 취합</small>
          </Link>

          <div className="nav-label">업무 메뉴</div>
          {nav.map((item) => (
            <Link
              key={item.label}
              className={`nav-item ${item.label === active ? "active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
