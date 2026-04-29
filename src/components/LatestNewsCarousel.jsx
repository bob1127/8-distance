// ✅ app/components/LatestNewsEmbla.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import AnimatedHeading from "@/components/AnimatedHeading";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

/* ===== HTML 解碼與去標籤 ===== */
function decodeHtmlOnce(s = "") {
  return String(s)
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}
function robustDecodeHtml(html = "") {
  let out = String(html ?? "");
  for (let i = 0; i < 3; i++) {
    const prev = out;
    out = decodeHtmlOnce(out);
    if (out === prev) break;
  }
  return out;
}
function htmlToPlainText(html = "", maxLen = 120) {
  let s = robustDecodeHtml(html);
  s = s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\s+/g, " ").trim();
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen - 1) + "…";
  return s;
}

/* ===== 日期格式化 YYYY.MM.DD ===== */
function formatDateYMD(d) {
  if (!d) return "—";
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) {
    return String(d).slice(0, 10).replaceAll("-", ".").replaceAll("/", ".");
  }
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/* ===== Reveal 圖片動畫 ===== */
function RevealImage({
  src,
  alt,
  title,
  aspectClass = "aspect-[1/1] md:aspect-[4/3]",
  priority = false,
  sizes = "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw",
}) {
  const rootRef = useRef(null);
  const clipRef = useRef(null);
  const imgRef = useRef(null);
  const scrimRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.set(clipRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(imgRef.current, { scale: 0.98, willChange: "transform" });
    gsap.set(scrimRef.current, {
      xPercent: 0,
      opacity: 0.7,
      willChange: "transform, opacity",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: "top 85%",
        end: "bottom 60%",
        once: true,
        toggleActions: "play none none none",
      },
    });

    tl.to(clipRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.35,
      ease: "power4.out",
    });
    tl.to(
      imgRef.current,
      {
        keyframes: [
          { scale: 1.08, duration: 1.45, ease: "power3.out" },
          { scale: 1.0, duration: 0.6, ease: "power2.out" },
        ],
      },
      0
    );
    tl.to(
      scrimRef.current,
      { xPercent: 100, opacity: 0, duration: 1.4, ease: "power3.out" },
      0.04
    );

    return () => tl.kill();
  }, []);

  return (
    <div ref={rootRef} className="w-full relative overflow-hidden">
      <div className={`${aspectClass} relative aspect-[4/3]`}>
        <div ref={clipRef} className="absolute inset-0 will-change-[clip-path]">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src={src || "/images/placeholder-16x9.jpg"}
              alt={alt || title || "news"}
              title={title || alt || "news"}
              fill
              className="object-cover "
              sizes={sizes}
              priority={priority}
            />
          </div>
          <div
            ref={scrimRef}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 60%)",
              mixBlendMode: "soft-light",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ===== 主元件 ===== */
export default function LatestNewsEmbla({ title = "最新動態" }) {
  const [slides, setSlides] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // ✅ 1. 設定 Slide 之間的間距 (Gap)
  const slideSpacing = "1rem"; // 16px

  // 這裡確保容器寬度正確，但不包含 padding，以免影響 embla 計算
  const container = "w-full mx-auto px-0 sm:w-[100%] 2xl:w-[100%]";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.8distance.com/api/front");
        const json = await res.json();
        if (Array.isArray(json.front_latest_news)) {
          const sorted = json.front_latest_news
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

          setSlides(
            sorted.map((it, idx) => {
              const title = htmlToPlainText(it.title ?? "", 80);
              const desc = htmlToPlainText(it.description ?? "", 60);
              const work = htmlToPlainText(it.work_name ?? "", 40);
              const link =
                work && work.length > 0
                  ? `/news/${encodeURIComponent(work)}`
                  : `/news/${it.sort_order ?? idx}`;

              return {
                title,
                description: desc,
                image: it.image_url ?? "",
                workName: work,
                publishDate: it.publish_date ?? "",
                sortOrder: it.sort_order,
                href: link,
              };
            })
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
    Autoplay({ delay: 4000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: enableLoop, containScroll: "trimSnaps" },
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
    emblaApi.on("select", onSelect).on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });

    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);

    const onVis = () => {
      if (document.visibilityState === "hidden") autoplay.current?.stop();
      else autoplay.current?.reset();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (i) => emblaApi && emblaApi.scrollTo(i);

  if (!slides.length) return null;

  return (
    <section className="section-others-project pb-10 w-full overflow-hidden">
      {/* 標題 */}
      <div className={container}>
        <div className="title flex justify-center mb-0 sm:mb-8">
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
      </div>

      {/* 輪播 */}
      <div className={`${container} relative`}>
        {/* ✅ 2. Viewport 移除 padding，改用 overflow-hidden 確保邊界乾淨 */}
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          {/* ✅ 3. Container 使用負 Margin-left 技巧 */}
          <div
            className="embla__container flex"
            style={{ marginLeft: `calc(${slideSpacing} * -1)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="embla__slide shrink-0 min-w-0
                !flex-[0_0_100%] 
                sm:!flex-[0_0_50%] 
                lg:!flex-[0_0_33.3333%] 
                2xl:!flex-[0_0_25%]"
                // ✅ 4. Slide 使用 padding-left 創造間距
                style={{ paddingLeft: slideSpacing }}
              >
                <a href={slide.href} className="block p-4   h-full">
                  <article className="overflow-hidden pb-10 pt-5 relative duration-700 rounded h-full flex flex-col">
                    <RevealImage
                      src={slide.image}
                      alt={slide.title}
                      title={slide.title}
                      aspectClass="aspect-[1/1] md:aspect-[4/3]"
                      sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      priority={idx < 2}
                    />
                    {/* 內容區塊 - 移除 padding-right，間距已由外層 Slide padding 控制 */}
                    <div className="pt-8 pb-5 border-gray-400 border-b flex-grow">
                      <h3 className="text-base md:text-lg font-medium text-[#c69c6d] line-clamp-2">
                        {slide.title}
                      </h3>
                      {slide.description && (
                        <p className="mt-2 text-sm text-neutral-900 line-clamp-3">
                          {slide.description}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between mt-3 ">
                      <span className="text-[13px]">
                        DATE:{formatDateYMD(slide.publishDate)}
                      </span>
                      <span className="text-[13px]">
                        {slide.workName || "—"}
                      </span>
                    </div>
                  </article>
                </a>
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
        .pill-bullet {
          width: 8px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 0.8;
          transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pill-bullet.is-active {
          width: 36px;
          background: #111;
          opacity: 1;
        }
        @media (min-width: 768px) {
          .pill-bullet {
            width: 6px;
            height: 6px;
          }
          .pill-bullet.is-active {
            width: 44px;
          }
        }
      `}</style>
    </section>
  );
}
