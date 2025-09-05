"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

/**
 * 使用方式：
 * <TestimonialsEmbla testimonials={testimonials} title="客戶好評" />
 * 需要先安裝：npm i embla-carousel-react
 *
 * testimonials: Array<{ content: string; name: string; role?: string }>
 */
export default function TestimonialsEmbla({
  testimonials = [],
  title = "客戶好評",
  autoPlayDelay = 4000, // ms
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const autoPlayTimerRef = useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
    dragFree: false,
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const startAutoPlay = useCallback(() => {
    if (!emblaApi) return;
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      if (
        !isHoveringRef.current &&
        !isDraggingRef.current &&
        !document.hidden
      ) {
        emblaApi.scrollNext();
      }
    }, autoPlayDelay);
  }, [emblaApi, autoPlayDelay]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

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
      .on("pointerDown", () => {
        isDraggingRef.current = true;
        stopAutoPlay();
      })
      .on("pointerUp", () => {
        isDraggingRef.current = false;
        startAutoPlay();
      });

    startAutoPlay();
    return () => stopAutoPlay();
  }, [emblaApi, onSelect, startAutoPlay, stopAutoPlay]);

  const scrollTo = useCallback(
    (idx) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi]
  );

  if (!testimonials?.length) return null;

  return (
    <section className="section-others-project mb-10 px-4 py-10 sm:px-0 overflow-hidden w-full">
      <div className="title flex justify-center mb-8">
        <h2 className="text-2xl">{title}</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => {
          isHoveringRef.current = true;
          stopAutoPlay();
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          startAutoPlay();
        }}
      >
        {/* Viewport */}
        <div
          className="embla__viewport overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          {/* Container */}
          <div className="embla__container flex gap-4 md:gap-4">
            {testimonials.map((item, idx) => (
              <div key={idx} className="embla__slide testi-slide shrink-0">
                <div className="overflow-hidden bg-slate-50 px-6 py-8 relative duration-700 h-full">
                  <div className="flex flex-col h-full">
                    <p className="text-neutral-700 text-sm md:text-base flex-1 leading-relaxed mb-4">
                      “{item.content}”
                    </p>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        {item.name}
                      </h3>
                      {item.role && (
                        <span className="text-sm text-neutral-500">
                          {item.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination：黑點→active 膠囊（根據 scrollSnapList 的「頁」數量） */}
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
        :global(.embla__container) {
          gap: 0 !important; /* 覆蓋掉 flex gap */
          margin-left: -16px; /* 等同原本 gap-4 的 16px */
          min-width: 0; /* 防止子項目溢出 */
        }
        :global(.embla__slide) {
          padding-left: 16px; /* 用內距補回間距 */
          box-sizing: border-box;
          min-width: 0;
        }
        /* 隱藏 WebKit 捲軸 */
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }

        /* 依斷點調整每張寬度（對應 Swiper 的 slidesPerView 1 / 2 / 2.5 / 2.5 / 3.5） */
        .testi-slide {
          flex: 0 0 100%;
        }
        @media (min-width: 640px) {
          /* >= 640: 2 張 */
          .testi-slide {
            flex: 0 0 50%;
          }
        }
        @media (min-width: 768px) {
          /* >= 768: 2.5 張（露出半張） */
          .testi-slide {
            flex: 0 0 calc(100% / 2.5);
          }
        }
        @media (min-width: 1024px) {
          /* >= 1024: 仍 2.5 張 */
          .testi-slide {
            flex: 0 0 calc(100% / 2.5);
          }
        }
        @media (min-width: 1280px) {
          /* >= 1280: 3.5 張（露出半張） */
          .testi-slide {
            flex: 0 0 calc(100% / 3.5);
          }
        }

        /* pagination 樣式：黑點／active 膠囊 */
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
