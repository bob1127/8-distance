"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function StaffCard({ imgSrc, title, name, description }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="relative w-full max-w-[430px] h-[550px] overflow-hidden bg-[#f7f7f8] group"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* 背景圖：加 scale 動畫 */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: isHover ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Image
          src={imgSrc}
          alt={name}
          placeholder="empty"
          loading="lazy"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* 黑色漸層背景 */}
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#1d2420] to-transparent z-10"
        initial={{ height: "33%" }}
        animate={{ height: isHover ? "60%" : "33%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* 文字內容 */}
      <div className="relative z-20 h-full flex items-end px-5 pb-5 pointer-events-none">
        <motion.div
          layout
          animate={{ y: isHover ? -20 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full"
        >
          <h2 className="text-[#eeeeef] text-[22px] font-normal mb-1">
            {title}
          </h2>
          <span className="text-white text-[15px]">{name}</span>

          <motion.div
            layout
            animate={{ opacity: isHover ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-2"
          >
            <span className="text-[14px] text-slate-50 leading-relaxed block">
              {description}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
