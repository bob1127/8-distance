"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PropTypes from "prop-types";

const Video = ({ src, poster, caption }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // 取得容器捲動位置
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // 頂部到消失過程
  });

  // 將 scrollYProgress (0 → 1) 映射為透明度 (0 → 0.8)
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  const handleMouseEnter = () => videoRef.current?.pause();
  const handleMouseLeave = () => videoRef.current?.play();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden"
    >
      {/* 背景影片 */}
      <div
        className="absolute inset-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* 遮罩（依 scroll 動態變化透明度） */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-black pointer-events-none z-10"
      />

      {/* Caption 文字（可選） */}
      {caption && (
        <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-50 text-white text-sm px-4 py-2 rounded">
          {caption}
        </div>
      )}
    </div>
  );
};

Video.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  caption: PropTypes.string,
};

Video.defaultProps = {
  poster: "",
  caption: "",
};

export default Video;
