"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

export default function LatestNewsEmbla({ title = "最新動態" }) {
  const [slides, setSlides] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // 抓 API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.ld-8distance.com/api/front");
        const json = await res.json();
        if (Array.isArray(json.front_latest_news)) {
          setSlides(
            json.front_latest_news
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((it) => ({
                title: it.title ?? "",
                description: it.description ?? "",
                image: it.image_url ?? "",
                href: "#",
              }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch latest news:", err);
      }
    }
    fetchData();
  }, []);

  const enableLoop = slides.length > 1;

  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: enableLoop,
      dragFree: false,
      skipSnaps: false,
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
      .on("pointerDown", () => autoplay.current?.stop())
      .on("pointerUp", () => autoplay.current?.play());

    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (idx) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi]
  );

  if (!slides.length) return null;

  return (
    <section className="section-others-project mb-10 px-4 sm:px-0 w-full">
      <div className="title flex justify-center mb-8">
        <h2 className="text-2xl">{title}</h2>
      </div>

      <div className="relative mx-auto w-full px-0 sm:px-4">
        <div
          className="embla__viewport overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="embla__container flex w-full gap-0 md:gap-4">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="
                  embla__slide shrink-0
                  flex-[0_0_100%]
                  md:flex-[0_0_50%]
                  lg:flex-[0_0_33.333%]
                  xl:flex-[0_0_25%]
                "
              >
                <Link href={slide.href}>
                  <article className="overflow-hidden bg-slate-50 px-4 pb-10 pt-5 relative duration-700">
                    <div className="w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] relative">
                      <Image
                        src={slide.image || "/images/placeholder-16x9.jpg"}
                        alt={slide.title || "latest news"}
                        fill
                        className="object-cover"
                        sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-base md:text-lg font-medium text-neutral-900 line-clamp-2">
                        {slide.title}
                      </h3>
                      {slide.description && (
                        <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
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
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 767.98px) {
          .embla__slide {
            flex: 0 0 100% !important;
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
