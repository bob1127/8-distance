// components/LogoIntro.jsx
"use client";
import { useEffect, useRef } from "react";

export default function LogoIntro({ onDone, drawSeconds = 3.6 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // 強制 reflow
    path.getBoundingClientRect();

    // 繪製動畫（時間拉長）
    path.style.transition = `stroke-dashoffset ${drawSeconds}s ease-in-out`;
    path.style.strokeDashoffset = "0";

    const timer = setTimeout(() => {
      onDone && onDone();
    }, drawSeconds * 1000 + 100);
    return () => clearTimeout(timer);
  }, [onDone, drawSeconds]);

  return (
    <div className="!fixed inset-0 h-screen flex items-center justify-center bg-white !z-[99999999999999999999999]">
      <div className="flex flex-col items-center">
        <svg
          width="80"
          height="200"
          viewBox="0 0 93 152"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="logo"
        >
          <path
            ref={pathRef}
            d="M2.5 74V15L82.5 60.5L14.5 96.5V147.5L82.5 111.5L42.5 88.5M14.5 65V5L87 45L2.5 88.5V136.5L53 107.344"
            stroke="black"
            strokeWidth="5"
            fill="none"
          />
        </svg>

        {/* 品牌文字：與繪製同步淡入上浮 */}
        <div
          className="mt-6 text-[18px] md:text-[22px] tracking-[0.35em] text-black/85 select-none animate-fadeUp"
          style={{ animationDuration: `${drawSeconds * 0.7}s` }}
        >
          捌程室內設計
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation-name: fadeUp;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
