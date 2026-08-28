import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "학교업무 한곳",
  description: "교직원을 위한 간단한 문서 취합 시스템",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <Script id="lan-random-uuid" strategy="beforeInteractive">{`if(!crypto.randomUUID){crypto.randomUUID=()=>{const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;return Array.from(b,(v,i)=>(i===4||i===6||i===8||i===10?"-":"")+v.toString(16).padStart(2,"0")).join("")}}`}</Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
