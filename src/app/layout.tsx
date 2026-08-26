import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "학교업무 한곳",
  description: "교직원을 위한 간단한 문서 취합 시스템",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
