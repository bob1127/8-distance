// src/app/layout.tsx
import "./globals.css";
import "yakuhanjp";
import React from "react";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Script from "next/script";
import Nav from "../components/PageTransition/Nav";
import Footer from "../components/Footer/Footer1";
import PageTransition from "../components/PageTransition/PageTransition";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu";
import Image from "next/image";
import IntroOverlay from "@/components/IntroOverlay"; // ⬅️ 新增這行

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
              <Nav />
            </div>
            <PageTransition>{children}</PageTransition>
            <Footer />
          </ExoApeOverlayMenu>

          <div className="fixed right-8 bottom-[15%]">
            <a
              href="https://page.line.me/655cyzya?oat_content=url&openQrModal=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/icon/line.png"
                alt="line-icon"
                width={200}
                height={200}
                className="max-w-[50px] w-auto h-auto"
              />
            </a>
          </div>

          {/* Tawk.to（下調 z-index） */}
          <Script
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
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
