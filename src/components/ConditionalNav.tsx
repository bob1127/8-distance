"use client";

import { usePathname } from "next/navigation";
import Nav from "../components/PageTransition/Nav";

export default function ConditionalNav() {
  const pathname = usePathname();

  // 首頁 ("/") 不渲染 Nav，其餘頁面顯示
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="hidden md:block fixed inset-x-0 top-0 z-[9999]">
      <Nav />
    </div>
  );
}
