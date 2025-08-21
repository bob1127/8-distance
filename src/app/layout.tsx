// app/layout.tsx
import "./globals.css";
import "yakuhanjp";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Nav from "../components/PageTransition/Nav";
import Footer from "../components/Footer/Footer1";
import PageTransition from "../components/PageTransition/PageTransition";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu";

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
        <body className="antialiased bg-white text-gray-900">
          {/* ✅ Nav 固定在視窗頂；用 md:block 隱藏手機（避免被 overlay 接管的手機導覽衝突） */}
          <div className="hidden md:block fixed inset-x-0 top-0 z-[99999999]">
            <Nav />
          </div>

          {/* ✅ 手機才需要 overlay 動畫；桌機只是單純的容器 */}
          <ExoApeOverlayMenu>
            <PageTransition>{children}</PageTransition>
            <Footer />
          </ExoApeOverlayMenu>
        </body>
      </html>
    </ViewTransitions>
  );
}
