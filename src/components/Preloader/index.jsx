"use client";

import { useRef } from "react";
import BackgroundSlider from "@/components/BackgroundSlider";

export default function Home() {
  const videoRef = useRef(null);
  const taglineRef = useRef([]);

  const backgroundImages = [
    "/images/index/b69ff1_8d67d2bc26bd45529c4848f4343ccecc~mv2.jpg.avif",
    "/images/index/b69ff1_dfadbd53c3e2460c85392dc940a6c899~mv2.jpg.avif",
    "/images/index/b69ff1_5fbc029839a748f18ca1e1ac09bd662e~mv2.jpg.avif",
    "/images/index/b69ff1_2e8beb67f7c64ad9aaab0271e8d9a385~mv2.jpg.avif",
    "/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif",
    "/images/index/b69ff1_dbf0d0c42626415881135b9768235d8f~mv2.jpg.avif",
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
            8-DISTANCE
          </h1>
          <h1
            className="text-[50px] font-normal tracking-widest"
            ref={(el) => (taglineRef.current[1] = el)}
          >
            捌程室內設計
          </h1>
        </div>
      </div>
    </div>
  );
}
