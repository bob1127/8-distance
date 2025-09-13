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

  // ≥2 張才有意義的 loop/autoplay
  const canLoop = reels.length > 1;

  return (
    // 🔑 阻擋 Lenis 接管觸控，讓 Swiper 在手機可滑動
    <div
      className="relative w-full m-0 p-0"
      data-lenis-prevent
      data-lenis-prevent-touch
    >
      {/* 箭頭（桌機顯示） */}
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
        onInit={(sw) => sw.autoplay?.start()} // iOS 有時不自啟
        onTouchStart={() => swiperRef.current?.autoplay?.stop()} // 用 Swiper 的事件，不用逐卡片掛
        onTouchEnd={() => swiperRef.current?.autoplay?.start()}
        slidesPerView="auto"
        spaceBetween={12}
        centeredSlides={false}
        // 讓觸控真的能傳到 Swiper（避免預設阻止）
        allowTouchMove
        simulateTouch
        touchEventsTarget="container"
        touchStartPreventDefault={false}
        passiveListeners={false}
        // 巢狀在其他可滾動容器內更穩定
        nested
        grabCursor
        // 只有張數夠才 loop/自動播，並避免「not enough for loop」警告
        loop={canLoop}
        watchOverflow
        loopedSlides={Math.min(reels.length, 6)}
        loopAdditionalSlides={Math.min(reels.length, 6)}
        autoplay={
          canLoop
            ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        speed={600}
        navigation={{ prevEl: ".js-prev", nextEl: ".js-next" }}
        observer
        observeParents
        className="m-0 p-4 h-auto sm:h-[540px] !overflow-visible"
      >
        {reels.map((item, idx) => (
          <SwiperSlide key={idx} style={{ width: "auto" }}>
            {/* 不再在卡片上掛 onTouchStart/End（避免 autoplay 永遠停住） */}
            <div
              className="
                relative 
                w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px]
                h-[380px] sm:h-[420px] md:h-[460px] lg:h-[520px]
              "
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
