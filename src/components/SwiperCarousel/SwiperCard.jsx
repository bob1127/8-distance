"use client";

import React, { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay, Navigation } from "swiper/modules";
import FacebookReelsSection from "@/components/FacebookReelsSection";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function SwiperCardAbout() {
  const swiperRef = useRef(null);

  const reels = useMemo(
    () => [
      { url: "https://www.facebook.com/reel/1108853487853555?locale=zh_TW" },
      { url: "https://www.facebook.com/reel/792758949760796?locale=zh_TW" },
      { url: "https://www.facebook.com/reel/1108853487853555?locale=zh_TW" },
      { url: "https://www.facebook.com/reel/792758949760796?locale=zh_TW" },
      { url: "https://www.facebook.com/reel/1108853487853555?locale=zh_TW" },
      { url: "https://www.facebook.com/reel/792758949760796?locale=zh_TW" },
    ],
    []
  );

  const stopAutoplay = () => {
    try {
      swiperRef.current?.autoplay?.stop();
    } catch {}
  };
  const startAutoplay = () => {
    try {
      swiperRef.current?.autoplay?.start();
    } catch {}
  };

  return (
    <div className="relative w-full m-0 p-0">
      {/* 左右箭頭（用 CSS 選擇器給 Navigation 綁定） */}
      <button
        type="button"
        aria-label="上一張"
        className="js-prev hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path
            d="M15 6l-6 6 6 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="下一張"
        className="js-next hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Swiper
        modules={[Pagination, A11y, Autoplay, Navigation]}
        onSwiper={(sw) => (swiperRef.current = sw)}
        slidesPerView="auto" // ✅ 一次顯示多個
        spaceBetween={12}
        centeredSlides={false}
        loop
        loopAdditionalSlides={reels.length}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false, // 我們在卡片 hover 時手動 stop
        }}
        speed={600}
        navigation={{ prevEl: ".js-prev", nextEl: ".js-next" }}
        observer
        observeParents
        className="m-0 p-4 h-auto sm:h-[540px] !overflow-hidden"
      >
        {reels.map((item, idx) => (
          <SwiperSlide key={idx} style={{ width: "auto" }}>
            {/* 每張卡片固定尺寸；hover 暫停、離開恢復 */}
            <div
              className="
                relative 
                w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px]
                h-[380px] sm:h-[420px] md:h-[460px] lg:h-[520px]
              "
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
              onTouchStart={stopAutoplay}
              onTouchEnd={startAutoplay}
            >
              <FacebookReelsSection
                items={[item]} // 每個 slide 一支影片
                autoPlayOnHover
                autoPlayOnTap
                cardClassName="w-full h-full aspect-[9/16] rounded-2xl overflow-hidden"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
