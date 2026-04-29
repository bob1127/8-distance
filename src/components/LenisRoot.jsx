// components/LenisRoot.jsx
"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

/**
 * 手機與 prefers-reduced-motion 自動停用平滑滾動
 * - <768px：停用
 * - prefers-reduced-motion: reduce：停用
 * 備註：若要改門檻，調整 BREAKPOINT 即可
 */
const BREAKPOINT = 768; // <768px 視為手機 → 停用

export default function LenisRoot({ children }) {
  const [enabled, setEnabled] = useState(false); // 初始 false，避免 hydration mismatch

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mMobile = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const mReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      // 非手機且非減少動效 → 啟用
      setEnabled(!mMobile.matches && !mReduced.matches);
    };

    apply();
    mMobile.addEventListener("change", apply);
    mReduced.addEventListener("change", apply);

    return () => {
      mMobile.removeEventListener("change", apply);
      mReduced.removeEventListener("change", apply);
    };
  }, []);

  // 停用時清掉 lenis 相關 class，避免殘留影響滾動
  useEffect(() => {
    const el = document.documentElement;
    if (!el) return;
    if (!enabled) {
      el.classList.remove("lenis", "lenis-smooth");
      // 確保原生滾動
      el.style.scrollBehavior = "auto";
    } else {
      // 交由 Lenis 控制，避免 CSS 自行干預
      el.style.scrollBehavior = "auto";
    }
    return () => {
      el.style.scrollBehavior = "";
    };
  }, [enabled]);

  if (!enabled) {
    // 手機 / 減少動效 → 直接回傳 children（原生滾動）
    return <>{children}</>;
  }

  // 桌機 → 啟用 Lenis（參數偏輕量）
  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        syncTouch: false, // 觸控別過度處理，桌機滑鼠滾輪才平滑
        lerp: 0.08, // 比 0.1 再輕一點
        // 也可加 duration / easing 進一步微調
      }}
    >
      {children}
    </ReactLenis>
  );
}
