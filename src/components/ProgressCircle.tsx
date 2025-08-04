"use client";

import { motion } from "framer-motion";

export default function ProgressCircle({
  duration = 5,
}: {
  duration?: number;
}) {
  const radius = 24;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-row max-w-[300px] justify-center items-center">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        className="absolute top-[80%] right-1/5 translate-x-1/2 z-[50] rounded-full "
      >
        {/* 背景灰色圓 */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#ccc"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* 白色進度動畫圈 */}
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#fff"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration, ease: "linear" }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      <div>
        <p className="text-white text-md z-[999999]">WELCOME</p>
      </div>
    </div>
  );
}
