// app/components/RenderFooter.jsx
"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "../components/Footer/Footer1";

export default function RenderFooter() {
  const pathname = usePathname() || "";
  // 只隱藏 /works；其餘（包含 /works/... 子頁）都照常渲染
  if (pathname === "/works") return null;
  return <SiteFooter />;
}
