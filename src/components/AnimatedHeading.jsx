// /components/AnimatedHeading.jsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function AnimatedHeading({
  text = "影音內容",
  id,
  className = "",
  lineColor = "#2b3742",
  lineMax = 120,
  lineVw = 18,
  lineMin = 36,
  lineThickness = 1,
  yOffsetEm = 0.08,
  duration = 1.0,
  delay = 0.12,
  ease = [0.45, 0, 0.1, 1],
  firstVisitDelay = 2.0,
  startDelay = 0.0,
  resetOnExit = false,
}) {
  const hControls = useAnimation();
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const timerRef = useRef(null);
  const playedRef = useRef(false);
  const wrapRef = useRef(null);

  const setHidden = () => {
    hControls.set({ opacity: 0, scale: 0.98 });
    leftControls.set({ scaleX: 0, opacity: 0 });
    rightControls.set({ scaleX: 0, opacity: 0 });
  };

  useEffect(() => {
    setHidden();
    return () => clearTimeout(timerRef.current);
  }, []);

  const doPlay = () => {
    if (playedRef.current) return;
    playedRef.current = true;

    hControls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
    });

    const lineAnim = {
      scaleX: 1,
      opacity: 1,
      transition: { duration, delay, ease },
    };
    leftControls.start(lineAnim);
    rightControls.start(lineAnim);
  };

  const play = () => {
    if (playedRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doPlay, Math.max(0, firstVisitDelay * 1000));
  };

  const responsiveWidth = `clamp(${lineMin}px, ${lineVw}vw, ${lineMax}px)`;
  const translateY = `calc(-50% + ${yOffsetEm}em)`;

  return (
    <motion.div
      ref={wrapRef}
      className={`relative flex justify-center w-[90%] md:w-full mx-auto ${className}`}
      onViewportEnter={play}
      viewport={{ amount: 0.15, once: true }}
    >
      <div className="relative inline-flex items-center justify-center">
        {/* 左線 */}
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={leftControls}
          style={{
            backgroundColor: lineColor,
            width: responsiveWidth,
            height: lineThickness,
            top: "50%",
            transform: `translateY(${translateY})`,
            right: "100%",
            transformOrigin: "right center",
          }}
          className="absolute"
        />

        {/* 右線 */}
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={rightControls}
          style={{
            backgroundColor: lineColor,
            width: responsiveWidth,
            height: lineThickness,
            top: "50%",
            transform: `translateY(${translateY})`,
            left: "100%",
            transformOrigin: "left center",
          }}
          className="absolute"
        />

        {/* --- 文字修改區 --- */}
        <motion.h1
          animate={hControls}
          className="
            text-xl sm:text-2xl lg:text-3xl 
            font-semibold tracking-wide text-center relative 
            
            px-4 sm:px-6           /* 保持左右間距 */
            
            w-auto                 /* 自動寬度 */
            max-w-[70vw]           /* ✅ 限制最大寬度為 70vw，預留 30% 給左右線條，避免線條消失 */
            sm:max-w-none          /* 桌機版通常空間夠，可以解除這個限制 */
            
            whitespace-normal      /* ✅ 允許自動換行 */
            leading-snug           /* 行高稍微緊湊一點，換行後比較好看 */
          "
        >
          {text}
        </motion.h1>
      </div>
    </motion.div>
  );
}