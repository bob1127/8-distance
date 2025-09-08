"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

/**
 * 使用方式：
 * <LatestNewsEmbla slides={staticSlides} title="最新動態" />
 */
export default function LatestNewsEmbla({ slides = [], title = "最新動態" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // 只有 1 張時就不要 loop/autoplay
  const enableLoop = slides.length > 1;

  // Autoplay 外掛（用 ref 確保是同一個實例）
  const autoplay = useRef(
    Autoplay({
      delay: 4000, // 自動播放間隔（毫秒）
      stopOnMouseEnter: true, // 滑入暫停
      stopOnInteraction: false,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: enableLoop,
      dragFree: false,
      skipSnaps: false,
      // loop 搭配 containScroll 容易互相干擾，這裡拿掉 containScroll
    },
    enableLoop ? [autoplay.current] : []
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi
      .on("select", onSelect)
      .on("reInit", () => {
        setScrollSnaps(emblaApi.scrollSnapList());
        onSelect();
      })
      // 拖曳時暫停，放手後繼續
      .on("pointerDown", () => autoplay.current?.stop())
      .on("pointerUp", () => autoplay.current?.play());

    // 視窗尺寸變化時重新初始化，避免部分寬度下不動
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (idx) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi]
  );

  return (
    <section className="section-others-project mb-10 px-4 sm:px-0 w-full">
      <div className="title flex justify-center mb-8">
        <h2 className="text-2xl">{title}</h2>
      </div>

      {/* 置中容器 */}
      <div className="relative mx-auto w-full px-0 sm:px-4">
        {/* Viewport */}
        <div
          className="embla__viewport overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          {/* Container（保持你的版面設定） */}
          <div className="embla__container flex w-full gap-0 md:gap-4">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="
               
                  embla__slide shrink-0
                  flex-[0_0_100%]           /* mobile 單張 */
                  md:flex-[0_0_50%]         /* >=768px 一排兩張 */
                  lg:flex-[0_0_33.333%]     /* >=1024px 三張 */
                  xl:flex-[0_0_25%]         /* >=1280px 四張 */
                "
              >
                <Link href="#">
                  <div className="overflow-hidden bg-slate-50 px-4 pb-10 pt-5 relative duration-700">
                    <div
                      className="
                        border-white rounded-none pb-4 w-full
                        h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px]
                        border bg-no-repeat bg-center bg-cover shadow-none transition-transform duration-700
                      "
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    <div className="p-8">
                      <h3 className="text-base md:text-lg font-medium text-neutral-900 line-clamp-2">
                        義大利 A Design Award 銀獎 ｜ AFTER SCHOOL
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <p>
                          很高興受到 A Design 評審的青睞，下課後 After School
                          作品獲得銀獎，我們會持續精進……
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination：黑點→active 膠囊 */}
        <div className="embla__dots mt-6 flex items-center justify-center gap-3">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`pill-bullet ${
                i === selectedIndex ? "is-active" : ""
              }`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* 隱藏 WebKit 捲軸 */
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }

        /* 手機只顯示 1 個 item（避免看到半張） */
        @media (max-width: 767.98px) {
          .embla__container {
          }
          .embla__slide {
            flex: 0 0 100% !important;
          }
        }

        /* pagination 樣式（黑點 / active 膠囊） */
        .pill-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 0.8;
          transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
        }
        .pill-bullet:hover {
          opacity: 1;
        }
        .pill-bullet.is-active {
          width: 36px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 1;
        }
        @media (min-width: 768px) {
          .pill-bullet {
            width: 6px;
            height: 6px;
          }
          .pill-bullet.is-active {
            width: 44px;
            height: 6px;
          }
        }
      `}</style>
    </section>
  );
}
