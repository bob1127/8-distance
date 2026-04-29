// src/components/AnimatedLine.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

type Props = {
  width?: number | string; // px or "100%"
  height?: number; // 可小數，如 0.5
  color?: string;
  delay?: number; // seconds
  duration?: number; // seconds
  origin?: "left" | "right" | "center";
  radius?: number; // 圓角（僅用於非 hairline）
  className?: string;
};

export default function AnimatedLine({
  width = "100%",
  height = 1,
  color = "#1b1b1b",
  delay = 3,
  duration = 1.8,
  origin = "right",
  radius = 0,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const t = typeof height === "number" ? height : 1;
  const isHairline = t > 0 && t < 1;

  const transformOrigin =
    origin === "left"
      ? "left center"
      : origin === "right"
      ? "right center"
      : "center center";

  const commonMotion = {
    initial: { scaleX: 0, opacity: 0.7 },
    whileInView: { scaleX: 1, opacity: 1 },
    viewport: { once: true, amount: 0.9 },
    transition: {
      duration: reduce ? 0 : duration,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  } as const;

  if (isHairline) {
    // ✅ 髮絲線：用 1px border-top，再以 scaleY 壓縮
    // 這比用背景塊縮放更容易得到真正的 0.5px 視覺
    return (
      <motion.span
        aria-hidden="true"
        className={className}
        {...commonMotion}
        style={{
          display: "inline-block",
          width,
          height: t, // 容器 CSS 高度 = 目標厚度（可小數）
          position: "relative",
          transformOrigin,
          willChange: "transform, opacity",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            // 以 border 畫 1px 線
            height: 0,
            borderTop: `1px solid ${color}`,
            // 壓縮到目標厚度（例如 0.5）
            transform: `scaleY(${t}) translateZ(0)`,
            transformOrigin: "center top",
            // 防鋸齒
            backfaceVisibility: "hidden",
          }}
        />
      </motion.span>
    );
  }

  // 一般粗細（>= 1px）：用實心背景，支援圓角
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      {...commonMotion}
      style={{
        display: "inline-block",
        width,
        height: Math.max(1, Math.round(t)),
        backgroundColor: color,
        borderRadius: radius,
        transformOrigin,
        willChange: "transform, opacity",
      }}
    />
  );
}
