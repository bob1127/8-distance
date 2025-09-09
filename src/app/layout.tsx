// src/app/layout.tsx
import "./globals.css";
import "yakuhanjp";
import React from "react";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Script from "next/script";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "../components/Footer/Footer1";
import PageTransition from "../components/PageTransition/PageTransition";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu";
import Image from "next/image";
import IntroOverlay from "@/components/IntroOverlay"; // ⬅️ 新增這行
import ConditionalNav from "@/components/ConditionalNav";
import Link from "next/link";
export const metadata: Metadata = {
  title: "捌程室內設計｜商業空間與住宅設計",
  description:
    "捌程室內設計專注於舊屋翻新、住宅裝修與商業空間的室內設計整合服務。",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const lineSeed = localFont({
  src: [
    {
      path: "./fonts/WOFF2/LINESeedTW_OTF_Rg.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-line-seed",
  fallback: [
    "PingFang TC",
    "Noto Sans TC",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "sans-serif",
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="zh-Hant" className={lineSeed.variable}>
        <body
          className={`antialiased bg-white text-gray-900 ${lineSeed.className}`}
        >
          {/* ✅ Client-only Intro 放這裡，不讓 layout 變成 Client */}
          <IntroOverlay />

          <ExoApeOverlayMenu>
            <div className="hidden md:block fixed inset-x-0 top-0 z-[9999]">
              <ConditionalNav />
            </div>
            {children}
            <Footer />
          </ExoApeOverlayMenu>

          {/* ====== Mobile 底部長條（40% / 40% / 20%） ====== */}
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-50">
            <div className="bg-white/95 backdrop-blur border-t border-black/10 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] px-3 pb-[env(safe-area-inset-bottom)]">
              <div className="flex h-16 items-center">
                {/* 左 40%：LINE */}
                <Link
                  href="https://page.line.me/655cyzya?oat_content=url&openQrModal=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="basis-[40%] flex items-center justify-center gap-2"
                  aria-label="加入 LINE 聯繫"
                >
                  <Image
                    src="/images/圓形line@ icon.png"
                    alt="LINE"
                    width={200}
                    height={200}
                    className="w-8 h-8"
                    priority={false}
                  />
                  <span className="text-xs font-medium">LINE</span>
                </Link>

                {/* 中 40%：表單 */}
                <Link
                  href="/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="basis-[40%] flex items-center justify-center gap-2"
                  aria-label="前往聯絡表單"
                >
                  <Image
                    src="/images/圓形表單icon.png"
                    alt="表單"
                    width={200}
                    height={200}
                    className="w-8 h-8"
                  />
                  <span className="text-xs font-medium">表單</span>
                </Link>

                {/* 右 20%：回頂部（用現有 Client Component） */}
                <div className="basis-[20%] flex items-center justify-center">
                  <BackToTopButton />
                </div>
              </div>
            </div>
          </div>

          {/* ====== Tablet/Desktop 右側直欄（沿用你的原本行為） ====== */}
          <div className="hidden sm:flex fixed right-8 bottom-[15%] z-50 flex-col items-center gap-3">
            {/* Line Icon */}
            <Link
              href="https://page.line.me/655cyzya?oat_content=url&openQrModal=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/0"
            >
              <Image
                src="/images/圓形line@ icon.png"
                alt="line-icon"
                width={200}
                height={200}
                className="max-w-[50px] w-auto h-auto"
              />
            </Link>

            {/* 表單 */}
            <Link href="/contact" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/圓形表單icon.png"
                alt="form-icon"
                width={200}
                height={200}
                className="max-w-[50px] w-auto h-auto"
              />
            </Link>

            {/* 回頂部（沿用你的 Client Component） */}
            <BackToTopButton />
          </div>

          {/* Tawk.to（下調 z-index） */}
          {/* <Script
            id="tawk-embed"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  window.Tawk_API = window.Tawk_API || {};
                  window.Tawk_LoadStart = new Date();
                  window.Tawk_API.onLoad = function () {
                    try {
                      var root = document.getElementById('tawkchat-container');
                      if (root) root.style.zIndex = '1';
                      var ifr = document.querySelector('iframe[title="chat widget"]');
                      if (ifr) ifr.style.zIndex = '1';
                    } catch (e) {}
                  };
                  var s1 = document.createElement("script"),
                      s0 = document.getElementsByTagName("script")[0];
                  s1.async = true;
                  s1.src = "https://embed.tawk.to/68b2c125109d7be2aa210cc6/1j3t44v66";
                  s1.charset = "UTF-8";
                  s1.setAttribute("crossorigin", "*");
                  s0.parentNode.insertBefore(s1, s0);
                })();
              `,
            }}
          /> */}
        </body>
      </html>
    </ViewTransitions>
  );
}
