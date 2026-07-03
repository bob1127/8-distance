"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AnimatedHeading from "@/components/AnimatedHeading";
import Image from "next/image";

export default function TestimonialsEmbla({
  title = "業主好評",
  autoPlayDelay = 4000, // ms
}) {
  const [testimonials, setTestimonials] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const autoPlayTimerRef = useRef(null);

  // 抓 API 資料
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.8distance.com/api/front", {
          cache: "no-store",
        });
        const json = await res.json();
        if (Array.isArray(json.front_customer_review)) {
          setTestimonials(
            json.front_customer_review
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((it) => ({
                name: it.name,
                role: it.position,
                content: it.comment,
                image: it.image_url,
                date: it.date || "",
              }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    }
    fetchData();
  }, []);

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
      <div className="title flex justify-center mb-0 sm:mb-8">
        {/* ✅ 這裡改成使用外部傳入的 title */}
        <AnimatedHeading
          text={title}
          lineColor="#2b3742"
          lineLength={120}
          lineThickness={1}
          yOffsetEm={0.08}
          duration={1.0}
          delay={0.12}
          firstVisitDelay={2}
          startDelay={0}
          resetOnExit={true}
        />
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
          className="embla__viewport px-5 overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          {/* Container */}
          <div className="embla__container flex gap-4 md:gap-4">
            {testimonials.map((item, idx) => (
              <div key={idx} className="embla__slide testi-slide shrink-0">
                <div className="overflow-hidden group px-6 py-8 relative duration-700 h-full">
                  <div className="flex flex-col">
                    <div className="h-[150px]">
                      <p className="text-neutral-800 mt-4 text-[14px] flex-1 leading-relaxed cjk-normal">
                        “{item.content}”
                      </p>

                      <div>
                        {item.role && (
                          <span className="text-[14px] text-neutral-500 cjk-normal">
                            {item.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-8">
                      <b>{item.name}</b>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-400 w-full mt-4 mb-5"></div>
                  {/* 
                  <div className="flex pb-8 justify-between">
                    <span className="text-[12px]">Date:</span>
                    <span className="text-[12px]">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("zh-TW")
                        : "2025.04.03"}
                    </span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
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
        /* 只影響本元件的中文渲染，避免某些字重看起來變粗 */
        .cjk-normal {
          font-weight: 400 !important;
          font-style: normal !important;
          font-synthesis: none !important;
          -webkit-font-synthesis: none !important;
          -moz-font-synthesis: none !important;
        }

        :global(.embla__container) {
          gap: 0 !important;
          margin-left: -16px;
          min-width: 0;
        }
        :global(.embla__slide) {
          padding-left: 16px;
          box-sizing: border-box;
          min-width: 0;
        }
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }

        .testi-slide {
          flex: 0 0 100%;
        }
        @media (min-width: 640px) {
          .testi-slide {
            flex: 0 0 50%;
          }
        }
        @media (min-width: 768px) {
          .testi-slide {
            flex: 0 0 calc(100% / 2);
          }
        }
        @media (min-width: 1024px) {
          .testi-slide {
            flex: 0 0 calc(100% / 3);
          }
        }
        @media (min-width: 1280px) {
          .testi-slide {
            flex: 0 0 calc(100% / 4);
          }
        }

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
