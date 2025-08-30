// components/LogoIntro.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * 開場 Logo 動畫（不出現起始黑點、筆畫連貫）
 * - 使用 pathOffset 由 1→0，避免起點黑點
 * - 筆畫之間有「微重疊」以保持連貫感
 * - 點背景或按 ESC 可提前關閉
 */
export default function LogoIntro({
  show = true,
  onFinish = () => {},
  lockScroll = true,
}) {
  const [open, setOpen] = useState(show);

  // 單筆描繪秒數、重疊量（越大越連貫）
  const SEG_DUR = 0.55;
  const OVERLAP = 0.12; // 下一筆比上一筆早 OVERLAP 秒開始
  const STEP = Math.max(0.05, SEG_DUR - OVERLAP);

  // 你的 SVG 筆畫（照你貼的路徑/直線順序）
  const segments = useMemo(
    () => [
      { type: "line", props: { x1: 37, y1: 97, x2: 37, y2: 3 } },
      {
        type: "line",
        props: { x1: 154.26, y1: 71.7029, x2: 37.7029, y2: 2.73971 },
      },
      {
        type: "path",
        props: {
          d: "M166.5 192.5L41.9998 261.5L41.9998 167.5M4 243L134.5 172",
        },
      },
      {
        type: "line",
        props: { x1: 159.437, y1: 98.7383, x2: 42.7383, y2: 167.462 },
      },
      { type: "line", props: { x1: 3, y1: 113, x2: 3, y2: 3 } },
      { type: "line", props: { x1: 3, y1: 244, x2: 3, y2: 146 } },
      {
        type: "line",
        props: { x1: 2.84386, y1: 146.383, x2: 129.3, y2: 80.1561 },
      },
      {
        type: "line",
        props: { x1: 159.248, y1: 98.6532, x2: 3.65319, y2: 2.75197 },
      },
      {
        type: "line",
        props: { x1: 167.245, y1: 191.642, x2: 88.6421, y2: 142.755 },
      },
    ],
    []
  );

  // 總時間（最後加上淡出餘裕）
  const TOTAL = segments.length * STEP + 0.6;

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), TOTAL * 1000);
    return () => clearTimeout(t);
  }, [TOTAL]);

  // ESC 關閉
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 鎖捲動
  useEffect(() => {
    if (!lockScroll) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) onFinish();
  }, [open, onFinish]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          onClick={() => setOpen(false)}
        >
          <motion.svg
            viewBox="0 0 170 265"
            width="200"
            height="312"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => e.stopPropagation()}
          >
            {segments.map((seg, i) => {
              const delay = i * STEP;
              // 關鍵：用 pathOffset 由 1→0，避免起點黑點；pathLength 固定為 1
              const common = {
                initial: { pathLength: 1, pathOffset: 1, opacity: 1 },
                animate: { pathLength: 1, pathOffset: 0, opacity: 1 },
                transition: { duration: SEG_DUR, delay, ease: "easeInOut" },
              };
              return seg.type === "path" ? (
                <motion.path key={i} d={seg.props.d} {...common} />
              ) : (
                <motion.line key={i} {...seg.props} {...common} />
              );
            })}
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
