import "./globals.css";

import React from "react";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
// ✅ 1. 引入官方 GA 元件
import { GoogleAnalytics } from "@next/third-parties/google";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu";
import ConditionalNav from "@/components/ConditionalNav";
import RenderFooter from "../components/RenderFooter";

export const metadata: Metadata = {
  title: "捌程室內設計｜商業空間與住宅設計",
  description:
    "捌程室內設計專注於舊屋翻新、住宅裝修與商業空間的室內設計整合服務。",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // ✅ 新增：Google Search Console 驗證碼
  verification: {
    google: "4yjtPLWmt76_lnwovuoyAcDOY-5DczM40fP_Czmk5O8",
  },
  // ✅ 新增：Open Graph 設定，確保社群分享與搜尋引擎抓取正確的網站名稱
  openGraph: {
    title: "捌程室內設計｜商業空間與住宅設計",
    description:
      "捌程室內設計專注於舊屋翻新、住宅裝修與商業空間的室內設計整合服務。",
    siteName: "捌程室內設計",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="zh-Hant">
        <head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/@tailwindcss/typography@0.5.10/dist/typography.min.css"
          />
          <link
            rel="dns-prefetch"
            href="https://s3-ap-northeast-1.amazonaws.com"
          />
          <link
            rel="preconnect"
            href="https://s3-ap-northeast-1.amazonaws.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="https://cdn-go.justfont.com" />
          <link
            rel="preconnect"
            href="https://cdn-go.justfont.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="https://ds.justfont.com" />
          <link
            rel="preconnect"
            href="https://ds.justfont.com"
            crossOrigin=""
          />

          <style id="portal-font-fix">{`
            .portal-root, .portal-root * {
              font-family: var(--app-font) !important;
              font-weight: 300 !important;
              font-synthesis-weight: auto;
            }
          `}</style>

          {/* ✅ 新增：Google 結構化資料 (JSON-LD)，明確告訴 Google 網站的正式名稱 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "捌程室內設計",
                url: "https://www.8distance.com/",
              }),
            }}
          />
        </head>

        <body className="antialiased bg-white text-gray-900">
          {/* --- justfont 腳本 --- */}
          <Script
            id="jf-core"
            strategy="beforeInteractive"
            src="https://s3-ap-northeast-1.amazonaws.com/justfont-user-script/jf-65752.js"
          />
          {/* --- 字體預熱 --- */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              fontFamily: "var(--app-font)",
              fontWeight: 300,
            }}
          >
            設計流程說明 初次溝通 材質與色彩確認 工程監督與進度追蹤 合約服務
            完工驗收 售後服務 期數 金額 月付
          </span>

          {/* --- 右側工具列 --- */}
          <div className="hidden md:block fixed z-50 right-4 top-[85%] -translate-y-1/2">
            <div className="flex flex-col items-end">
              {/* ✅ 修改：Line 按鈕加入 ID 與預設隱藏樣式 */}
              <a
                id="lineBtnDesktop"
                href="https://page.line.me/655cyzya?oat_content=url&amp;openQrModal=true"
                className="
                  block mt-3 
                  transition-all duration-300 
                  opacity-0 pointer-events-none
                "
              >
                <Image
                  src="/images/圓形line@-icon.webp"
                  className="w-[65px] h-[65px]"
                  alt="圓形Line@ icon"
                  title="圓形Line@ icon"
                  width={200}
                  height={200}
                  loading="lazy"
                />
              </a>

              <button
                id="goTopBtnDesktop"
                type="button"
                aria-label="回到頂部"
                title="回到頂部"
                className="
                  mt-3 grid place-items-center rounded-full
                  w-[65px] h-[65px] bg-white/100 text-[#c69c6d]
                  shadow-lg backdrop-blur
                  transition-all duration-300
                  opacity-0 pointer-events-none
                  hover:bg-black/15 
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4.5a.75.75 0 0 1 .53.22l6.5 6.5a.75.75 0 1 1-1.06 1.06L12.75 6.94V19.5a.75.75 0 0 1-1.5 0V6.94l-5.22 5.34a.75.75 0 0 1-1.06-1.06l6.5-6.5A.75.75 0 0 1 12 4.5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <Script id="gotop-init" strategy="afterInteractive">
            {`
              (function() {
                var desktopBtn = document.getElementById('goTopBtnDesktop');
                var lineBtn = document.getElementById('lineBtnDesktop'); // ✅ 取得 Line 按鈕
                var mobileBtn = document.getElementById('goTopBtnMobile');

                function smoothTop() {
                  try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
                  catch (e) {
                    var c = document.documentElement.scrollTop || document.body.scrollTop;
                    if (c > 0) {
                      var s = setInterval(function() {
                        c = document.documentElement.scrollTop || document.body.scrollTop;
                        if (c <= 0) return clearInterval(s);
                        window.scrollTo(0, c - Math.max(10, c * 0.1));
                      }, 16);
                    }
                  }
                }

                var threshold = 240;
                var ticking = false;

                // ✅ 抽離出共用的切換函式
                function toggleVisible(el, isShow) {
                  if (!el) return;
                  if (isShow) {
                    el.classList.remove('opacity-0', 'pointer-events-none');
                    el.classList.add('opacity-100');
                  } else {
                    el.classList.add('opacity-0', 'pointer-events-none');
                    el.classList.remove('opacity-100');
                  }
                }

                function onScroll() {
                  var y = window.scrollY || document.documentElement.scrollTop || 0;
                  if (!ticking) {
                    window.requestAnimationFrame(function() {
                      var show = y > threshold;
                      toggleVisible(desktopBtn, show);
                      toggleVisible(lineBtn, show); // ✅ 同時控制 Line 按鈕
                      ticking = false;
                    });
                    ticking = true;
                  }
                }

                // 綁定事件
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll(); // 初始化檢查一次

                if (desktopBtn) desktopBtn.addEventListener('click', smoothTop);
                if (mobileBtn) mobileBtn.addEventListener('click', smoothTop);
              })();
            `}
          </Script>

          <div className="fixed inset-x-0 top-0 z-[9999]">
            <ConditionalNav />
          </div>

          <ExoApeOverlayMenu>
            <main className="relative z-10 min-h-screen">{children}</main>
            <RenderFooter />
          </ExoApeOverlayMenu>

          {/* ✅ 2. 放在這裡，傳入你的 ID */}
          <GoogleAnalytics gaId="G-358VC8JS8P" />
        </body>
      </html>
    </ViewTransitions>
  );
}
