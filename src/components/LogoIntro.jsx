/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useRef } from "react";

export default function LogoIntro({
  onDone,
  drawSeconds = 2.2, // 慢慢長出（揭露）時間
  fadeOutSeconds = 0.8, // 淡出時間
  fadeOverlapSeconds = 0.3, // 揭露尾段與淡出重疊

  // ===== 尺寸控制（桌機基準）=====
  logoMin = 120, // 最小高度（px）
  logoMax = 280, // 最大高度（px）
  prefVW = 14, // 以 viewport 寬度計算（% of width）
  prefVmin = 22, // 以較短邊計算（% of vmin）
  scale = 1.0, // 全域倍率：想更大就 1.1~1.25

  // ===== 手機/平板加成（會疊乘在上面）=====
  mobileBoost = 1.22, // ≤480px
  tabletBoost = 1.1, // 481~768px
}) {
  const containerRef = useRef(null);
  const imgWrapRef = useRef(null);
  const rafRef = useRef(0);
  const timers = useRef([]);

  // 對齊跨瀏覽器的視窗單位：--vw / --vmin
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const setUnits = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      el.style.setProperty("--vw", `${w / 100}px`);
      el.style.setProperty("--vmin", `${Math.min(w, h) / 100}px`);
    };
    setUnits();
    window.addEventListener("resize", setUnits, { passive: true });
    window.addEventListener("orientationchange", setUnits);
    return () => {
      window.removeEventListener("resize", setUnits);
      window.removeEventListener("orientationchange", setUnits);
    };
  }, []);

  // 100dvh 兼容
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.CSS && CSS.supports && CSS.supports("height: 100dvh")) {
      el.style.minHeight = "100dvh";
    } else {
      const set = () => (el.style.minHeight = `${window.innerHeight}px`);
      set();
      window.addEventListener("resize", set);
      window.addEventListener("orientationchange", set);
      return () => {
        window.removeEventListener("resize", set);
        window.removeEventListener("orientationchange", set);
      };
    }
  }, []);

  // 時序：先做「慢慢長出」（clip-path + scale），再與淡出重疊
  useEffect(() => {
    const wrap = containerRef.current;
    const imgWrap = imgWrapRef.current;
    if (!wrap || !imgWrap) return;

    // reset
    wrap.style.opacity = "1";
    imgWrap.style.setProperty("--reveal", "0"); // 0 → 1
    imgWrap.style.setProperty("--grow", "0.985"); // 0.985 → 1
    imgWrap.style.opacity = "1";

    const t0 = performance.now();
    const dur = Math.max(1, drawSeconds * 1000);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = easeOutCubic(p);
      imgWrap.style.setProperty("--reveal", String(e));
      const grow = 0.985 + (1 - 0.985) * e;
      imgWrap.style.setProperty("--grow", String(grow));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        imgWrap.style.setProperty("--reveal", "1");
        imgWrap.style.setProperty("--grow", "1");
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // 在揭露結束前一點開始淡出整個容器（重疊）
    const startFadeAtMs = Math.max(0, dur - fadeOverlapSeconds * 1000);
    const t1 = window.setTimeout(() => {
      wrap.style.transition = `opacity ${fadeOutSeconds}s cubic-bezier(0.22, 1, 0.36, 1)`;
      wrap.style.opacity = "0";
    }, startFadeAtMs);

    const t2 = window.setTimeout(() => {
      onDone && onDone();
    }, startFadeAtMs + fadeOutSeconds * 1000 + 60);

    timers.current.push(t1, t2);
    return () => {
      cancelAnimationFrame(rafRef.current);
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [drawSeconds, fadeOutSeconds, fadeOverlapSeconds, onDone]);

  // 偏好高度（桌機基準）：取 vmin 與 vw 的較大值，clamp 上下限，再乘全域 scale
  const preferHeightExpr = `max(calc(var(--vmin, 1vmin) * ${prefVmin}), calc(var(--vw, 1vw) * ${prefVW}))`;
  const baseHeight = `clamp(${logoMin}px, ${preferHeightExpr}, ${logoMax}px)`;

  return (
    <div
      ref={containerRef}
      className="logo-intro"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        zIndex: 999999999,
        pointerEvents: "none",
        minHeight: "100svh",
        willChange: "opacity",
        // 預設倍率（桌機）
        "--boost": 1,
        "--scale": scale,
        // 讓高度表達式能在 CSS 中重用
        "--baseH": baseHeight,
      }}
    >
      {/* 用一張圖：/images/logo/logo-y.png */}
      <div
        ref={imgWrapRef}
        style={{
          // 最終高度 = baseHeight * scale * boost(由媒體查詢覆寫)
          height: "calc(var(--baseH) * var(--scale) * var(--boost))",
          width: "auto",
          lineHeight: 0,
          willChange: "clip-path, transform, opacity",
          // 「慢慢長出」：由下往上揭露 + 微縮放到 1
          clipPath: "inset(calc((1 - var(--reveal, 0)) * 100%) 0 0 0)",
          WebkitClipPath: "inset(calc((1 - var(--reveal, 0)) * 100%) 0 0 0)",
          transform: "scale(var(--grow, 0.985)) translateZ(0)",
          transition: "filter 0.2s ease",
        }}
      >
        <img
          src="/images/logo/logo-y.png"
          alt="品牌標誌"
          style={{ height: "100%", width: "auto", display: "block" }}
          draggable={false}
        />
      </div>

      {/* 嵌入式樣式（避免 Tailwind 任意值警告） */}
      <style jsx>{`
        /* 平板加成（可依需要調範圍） */
        @media (max-width: 768px) {
          .logo-intro {
            --boost: ${tabletBoost};
          }
        }
        /* 手機加成 */
        @media (max-width: 480px) {
          .logo-intro {
            --boost: ${mobileBoost};
          }
        }
      `}</style>
    </div>
  );
}
