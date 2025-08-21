// components/ResponsiveOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu"; // 路徑依專案調整

type Props = {
  children: React.ReactNode;
};

/**
 * 手機 (<= 767px) 才啟用 Overlay，桌機直接回傳 children。
 * 初始在 SSR 階段一律視為桌機，避免 Nav fixed 受 transform 影響。
 */
export default function ResponsiveOverlay({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  if (!isMobile) {
    // 桌機：不包 overlay
    return <>{children}</>;
  }

  // 手機：包 overlay
  return <ExoApeOverlayMenu>{children}</ExoApeOverlayMenu>;
}
