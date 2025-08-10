"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressCircle from "@/components/ProgressCircle";

export default function BackgroundSlider({ images = [], duration = 5 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length, duration]);

  return (
    <section className="section-hero relative w-full aspect-[500/700] sm:aspect-[500/700] md:aspect-[1024/920] xl:aspect-[1920/768] 2xl:aspect-[1920/768] overflow-hidden">
      {images.map((bg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: i === currentIndex ? 1 : 0,
            scale: i === currentIndex ? 1.15 : 1,
          }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 20, ease: "linear" },
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}

      {/* 黑色遮罩 */}
      <div className="bg-black opacity-40 w-full h-full absolute top-0 left-0 z-10" />

      {/* 進度圓圈 */}
      <div className="relative h-full">
        <ProgressCircle key={currentIndex} duration={duration} />
      </div>
    </section>
  );
}
