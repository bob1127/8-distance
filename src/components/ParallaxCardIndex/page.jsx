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
import Link from "next/link";
const ParallaxCard = ({
  i,
  title,
  description,
  defaultLabel,
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
        <div className="w-[100vw] mx-auto px-6 pb-10">
          {/* Title + Description + 控制按鈕 */}
          <div className="my-8 text-center md:text-left flex flex-col md:flex-row justify-between relative">
            <div>
              {" "}
              <h2 className=" text-[30px] md:text-3xl md:text-[53px] font-light text-black mb-2">
                {title}
              </h2>
              <p className="text-gray-600 text-md tracking-widest mt-2  md:mt-6 ml-2 mb-4">
                {description}
              </p>
            </div>
            {/* 左右箭頭控制 */}
            <div className="flex justify-center md:justify-end gap-4 mt-4">
              <button
                ref={prevRef}
                className="
      swiper-button-prev-custom
      flex items-center justify-center
      border border-black rounded-[15px] !h-[40px] p-0 m-0
      aspect-square w-[130px] 
      hover:bg-stone-800 hover:text-white
      text-black transition
      [&.swiper-button-disabled]:opacity-40
      [&.swiper-button-disabled]:cursor-not-allowed
    "
              >
                ←
              </button>
              <button
                ref={nextRef}
                className="
      swiper-button-next-custom
      hover:bg-stone-800 hover:text-white
      flex items-center justify-center
      border border-black rounded-[15px] !h-[40px] p-0 m-0
      aspect-square w-[130px] 
      text-black transition
      [&.swiper-button-disabled]:opacity-40
      [&.swiper-button-disabled]:cursor-not-allowed
    "
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
                <SwiperSlide
                  key={idx}
                  className="!m-0 !p-0 group overflow-hidden"
                  style={{ height: "auto" }}
                >
                  <motion.a
                    href={img.href || "#"}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: idx * 0.05,
                    }}
                    className={`
      block w-full
      border-t  border-black
      ${idx === 0 ? "" : "border-r"}
    `}
                  >
                    {/* 固定比例容器：保證有高度，避免整張卡片被壓扁 */}
                    <div className="relative w-full overflow-hidden aspect-[4/3] lg:aspect-[10/7.5]">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* 文字區：放在比例容器外面，避免絕對定位造成高度為 0 */}
                    <div className="px-2 pt-5 xl:pt-8 pb-5 xl:pb-14 bg-white">
                      <div className="flex items-center justify-center py-2">
                        <h2 className="text-[20px] m-0 font-normal">
                          PORTFOLIO
                        </h2>
                      </div>
                      <div className="text-slate-900 text-sm text-center">
                        {img.caption}
                      </div>
                    </div>
                  </motion.a>
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
