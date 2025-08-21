// app/layout.tsx  (或 layout.jsx)
import "./globals.css";
import "yakuhanjp";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Nav from "../components/PageTransition/Nav";
import Footer from "../components/Footer/Footer1";
import PageTransition from "../components/PageTransition/PageTransition";

// ✅ 手機 Overlay 菜單（裝著整頁內容，讓 GSAP 動畫能作用在整頁）
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu"; // ← 依你的實際路徑調整

export const metadata: Metadata = {
  title: "寬越設計｜商業空間與住宅設計",
  description: "寬越設計專注於舊屋翻新、住宅裝修與商業空間的室內設計整合服務。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="zh-Hant">
        {/* 建議放上全域類，例如字體/底色/抗鋸齒 */}
        <body className="antialiased bg-white text-gray-900">
          {/* ✅ 手機版由 ExoApeOverlayMenu 負責頂欄與 overlay 動畫，
              並把整個頁面內容（含桌機 Nav / 內容 / Footer）包進去 */}
          <ExoApeOverlayMenu>
            {/* 桌機導覽：避免手機和 overlay 的漢堡列重疊，md↑ 顯示 */}
            <div className="hidden !fixed left-0 top-0 w-full z-[99999999] md:block">
              <Nav />
            </div>

            {/* 頁面轉場 + 主要內容 */}
            <PageTransition>{children}</PageTransition>

            {/* 頁尾（跟著整頁一起被 overlay 動） */}
            <Footer />
          </ExoApeOverlayMenu>
        </body>
      </html>
    </ViewTransitions>
  );
}
