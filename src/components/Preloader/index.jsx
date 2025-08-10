"use client";

import { useRef } from "react";
import BackgroundSlider from "@/components/BackgroundSlider";

export default function Home() {
  const videoRef = useRef(null);
  const taglineRef = useRef([]);

  const backgroundImages = [
    "https://www.rebita.co.jp/wp-content/uploads/2025/06/kaika_mv-1920x1280.jpg",
    "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
    "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
    "https://www.rebita.co.jp/wp-content/uploads/2025/06/12kanda_mv2-1920x1281.png",
  ];

  return (
    <div className="relative min-h-screen">
      {/* 直接固定定位版本 */}
      <div
        ref={videoRef}
        className="!w-full !translate-y-[270px] relative overflow-hidden z-0"
      >
        <BackgroundSlider images={backgroundImages} duration={5} />
        <div className="absolute bottom-6 right-6 z-20 text-white text-sm flex items-center space-x-4">
          <button className="px-3 py-1 bg-black/60 hover:bg-black/80 rounded">
            Prev
          </button>
          <span className="text-white">1 | {backgroundImages.length}</span>
          <button className="px-3 py-1 bg-black/60 hover:bg-black/80 rounded">
            Next
          </button>
        </div>
      </div>

      {/* Tagline */}
      <div className="absolute top-[8%] ml-[100px] text-black text-4xl font-bold z-40 flex">
        <div className="flex flex-col">
          <h1
            className="text-[50px] font-normal mt-9 tracking-widest"
            ref={(el) => (taglineRef.current[0] = el)}
          >
            We are building the
          </h1>
          <h1
            className="text-[50px] font-normal tracking-widest"
            ref={(el) => (taglineRef.current[1] = el)}
          >
            fundamentals of your life
          </h1>
        </div>
      </div>
    </div>
  );
}
