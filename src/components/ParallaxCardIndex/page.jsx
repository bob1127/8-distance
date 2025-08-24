"use client";

import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import gsap from "gsap";
import styles from "./style.module.scss";

const ParallaxCard = ({
  i,
  title,
  description,
  images,
  progress,
  range,
  targetScale,
  total,
}) => {
  const container = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const isLast = i === total - 1;
  const scaleMotion = useTransform(progress, range, [1, targetScale]);
  const scale = isLast ? 1 : scaleMotion;

  return (
    <div ref={container} className={`${styles.cardContainer} py-16 relative`}>
      {/* 背景區 - Parallax */}
      <motion.div className={`${styles.cardBackground}`} style={{ scale }} />

      {/* 正文內容 */}
      <div className={`${styles.cardContent} relative z-10 w-full`}>
        <div className="w-[100vw] mx-auto px-6">
          {/* Title + Description + 控制按鈕 */}
          <div className="my-8 text-center md:text-left flex flex-row justify-between relative">
            <div>
              {" "}
              <h2 className="text-3xl md:text-[53px] font-light text-black mb-2">
                {title}
              </h2>
              <p className="text-gray-600 text-md tracking-widest mt-6 ml-2 mb-4">
                {description}
              </p>
            </div>
            {/* 左右箭頭控制 */}
            <div className="flex justify-center md:justify-end gap-4 mt-4">
              <button
                ref={prevRef}
                className="swiper-button-prev-custom  w-[80px] border rounded-[20px] text-black flex items-center justify-center  px-4 py-2 border-black transition"
              >
                ←
              </button>
              <button
                ref={nextRef}
                className="swiper-button-next-custom w-[80px] border rounded-[20px] text-black flex items-center justify-center  px-4 py-2 border-black transition"
              >
                →
              </button>
            </div>
          </div>

          {/* 輪播區 */}
          <div className="-mx-6 ">
            <Swiper
              speed={800}
              spaceBetween={0}
              breakpoints={{
                0: { slidesPerView: 1.2 },
                640: { slidesPerView: 3.2 },
                1024: { slidesPerView: 4.3 },
                1440: { slidesPerView: 4.5 },
              }}
              autoplay={{ delay: 3500 }}
              modules={[Pagination, Autoplay, Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (typeof window !== "undefined") {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              onSlideChange={(swiper) => {
                const slide = swiper.slides[swiper.activeIndex];
                gsap.fromTo(
                  slide,
                  { scale: 0.95, opacity: 0.7 },
                  { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
                );
              }}
            >
              {images?.map((img, idx) => (
                <SwiperSlide key={idx} className="!m-0 !p-0 group overflow-">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: idx * 0.05,
                    }}
                    className={`relative w-full aspect-video border-t border-b border-black ${
                      idx === 0
                        ? "border-l"
                        : idx === images.length - 1
                        ? "border-r"
                        : "border-r"
                    }`}
                  >
                    <div className="overflow-hidden w-full h-[400px]">
                      {" "}
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full group-hover:scale-105 transition duration-400 scale-100  object-cover"
                      />
                    </div>

                    <div className="absolute bottom-0 mb-5 left-0 w-full text-slate-900 text-sm text-center py-1">
                      {img.caption}
                    </div>
                    <div className="flex flex-col items-center justify-center py-5">
                      <h2 className="text-[20px] font-normal">PORTFOLIO</h2>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxCard;
