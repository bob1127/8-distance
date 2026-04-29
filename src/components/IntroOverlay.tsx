// src/components/IntroOverlay.jsx

"use client";

import { useEffect, useState } from "react";
import LogoIntro from "@/components/LogoIntro";

export default function IntroOverlay() {
  const [show, setShow] = useState(true);

  // 🔒 控制頁面在 overlay 顯示時不能滾動（含隱藏右側 scrollbar）
  useEffect(() => {
    if (!show || typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    const scrollY = window.scrollY || window.pageYOffset || 0;

    // 記錄原本的樣式，等等要還原
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    // 鎖住滾動 + 固定 body
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;

      // 還原到原本滾動位置
      window.scrollTo(0, scrollY);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 w-full h-screen !z-[999999999999999999] bg-white"
      // 不要 pointer-events-none，避免滑鼠穿透
      aria-hidden="true"
    >
      <LogoIntro
        onDone={() => setShow(false)}
        logoMin={140}
        logoMax={220}
        prefVW={14}
        prefVmin={22}
        scale={1.0}
        mobileBoost={1.2}
        tabletBoost={1.2}
        // drawSeconds={2.2}
        // fadeOutSeconds={0.8}
        // fadeOverlapSeconds={0.3}
      />
    </div>
  );
}
