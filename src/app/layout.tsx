import "./globals.css";
import "yakuhanjp";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import AppShell from "../components/AppShell";

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
        <body>
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ViewTransitions>
  );
}
