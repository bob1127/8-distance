// app/home/home.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroOverlay from "@/components/IntroOverlayOnce";
import Nav from "../components/PageTransition/Nav";
import { ReactLenis } from "@studio-freight/react-lenis";
import { refreshJustFontDelayed } from "@/lib/justfont";
import LatestNewsCarousel from "../components/LatestNewsCarousel";
import TestimonialsEmbla from "../components/TestimonialsEmbla";
import { buildHeroSlides } from "@/lib/heroCarousel";
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const HERO_ROTATE_MS = 15000;

function youtubeEmbedSrc(videoId, startSeconds = 0) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
  });
  if (startSeconds > 0) {
    params.set("start", String(Math.floor(startSeconds)));
  }
  return `https://www.youtube.com/embed/${videoId}?${params}`;
}

/* ---------------- HERO 輪播：依後台 sort_order，支援 mp4 + YouTube ---------------- */
function HeroVideoCarousel({
  slides = [],
  poster,
  className = "w-full h-full",
  loadDelayMs = 0,
  minWidthForVideo = 768,
  rotateMs = HERO_ROTATE_MS,
}) {
  const wrapRef = useRef(null);
  const videoRefsMap = useRef({});
  const youtubeProgressRef = useRef({});
  const youtubeActiveSinceRef = useRef(null);
  const [shouldMountVideo, setShouldMountVideo] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [youtubeMountKeys, setYoutubeMountKeys] = useState(() => new Set());
  const [youtubeEmbedStart, setYoutubeEmbedStart] = useState({});

  const count = slides.length;
  const safeIndex = count > 0 ? activeIndex % count : 0;
  const active = count > 0 ? slides[safeIndex] : null;
  const defaultPoster = poster || "/images/placeholder.jpg";
  const showMedia = shouldMountVideo && canAutoplay && !!active;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || count === 0) return;

    let timeoutId;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          timeoutId = setTimeout(() => setShouldMountVideo(true), loadDelayMs);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loadDelayMs, count]);

  useEffect(() => {
    const isSmall = window.innerWidth < minWidthForVideo;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData =
      navigator.connection &&
      (navigator.connection.saveData ||
        navigator.connection.effectiveType === "2g");

    if (isSmall || prefersReduced || saveData) {
      setShouldMountVideo(false);
      setCanAutoplay(false);
      return;
    }
    setCanAutoplay(true);
  }, [minWidthForVideo]);

  useEffect(() => {
    if (!shouldMountVideo || !canAutoplay || count <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % count);
    }, rotateMs);
    return () => clearInterval(timer);
  }, [shouldMountVideo, canAutoplay, count, rotateMs]);

  /* 切換時暫停非 active 的 mp4，保留 currentTime；回來時從原處續播 */
  useEffect(() => {
    if (!showMedia) return;

    slides.forEach((slide, idx) => {
      const v = videoRefsMap.current[slide.key];
      if (slide.type !== "mp4" || !v) return;
      if (idx === safeIndex) {
        v.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      } else {
        v.pause();
      }
    });
  }, [safeIndex, showMedia, slides]);

  /* 離開 YouTube 時累計已播秒數，下次嵌入用 start= 接續 */
  useEffect(() => {
    const prev = youtubeActiveSinceRef.current;
    if (prev?.key) {
      const elapsed = (Date.now() - prev.at) / 1000;
      youtubeProgressRef.current[prev.key] =
        (youtubeProgressRef.current[prev.key] || 0) + elapsed;
    }

    if (active?.type === "youtube" && active.youtubeId) {
      youtubeActiveSinceRef.current = { key: active.key, at: Date.now() };
      setYoutubeMountKeys((s) => new Set(s).add(active.key));
      setYoutubeEmbedStart((starts) => ({
        ...starts,
        [active.key]: youtubeProgressRef.current[active.key] || 0,
      }));
    } else {
      youtubeActiveSinceRef.current = null;
    }
  }, [safeIndex, active?.key, active?.type, active?.youtubeId]);

  const slideLayerClass = (isActive) =>
    `absolute inset-0 overflow-hidden transition-opacity duration-700 ${
      isActive
        ? "opacity-100 z-10"
        : "pointer-events-none opacity-0 invisible z-0"
    }`;

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden bg-black ${className}`}
    >
      <Image
        src={active?.poster || defaultPoster}
        alt="Hero Background"
        fill
        priority
        sizes="100vw"
        className={`object-cover z-[1] transition-opacity duration-700 ${
          showMedia ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 每支影片只掛載一次，切換時 pause/hide，回來從原處續播 */}
      {showMedia && (
        <div className="absolute inset-0 z-[2] overflow-hidden">
          {slides.map((slide, idx) => {
            const isActive = idx === safeIndex;

            if (slide.type === "youtube" && slide.youtubeId) {
              if (!youtubeMountKeys.has(slide.key)) return null;
              const startAt = youtubeEmbedStart[slide.key] || 0;
              return (
                <div
                  key={slide.key}
                  className={slideLayerClass(isActive)}
                  aria-hidden={!isActive}
                >
                  <iframe
                    key={`${slide.key}-${Math.floor(startAt)}`}
                    title={slide.title || "Hero video"}
                    src={youtubeEmbedSrc(slide.youtubeId, startAt)}
                    className="pointer-events-none absolute left-1/2 top-1/2 min-h-[100%] min-w-[100%] w-[300%] h-[300%] max-w-none -translate-x-1/2 -translate-y-1/2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              );
            }

            return (
              <video
                key={slide.key}
                ref={(el) => {
                  if (el) videoRefsMap.current[slide.key] = el;
                  else delete videoRefsMap.current[slide.key];
                }}
                className={`${slideLayerClass(isActive)} h-full w-full object-cover`}
                src={slide.url}
                muted
                playsInline
                preload="auto"
                loop={count === 1}
                aria-hidden={!isActive}
              />
            );
          })}
        </div>
      )}

      <div className="absolute inset-0 z-[5] bg-transparent pointer-events-auto" />
    </div>
  );
}

/* ---------------- CategoryTile (保持不變) ---------------- */
function CategoryTile({
  imgSrc,
  title = "",
  subtitle = "",
  alt = "",
  imgTitle = "",
  className = "h-[52vw] md:h-[46vw] lg:h-[40vw] 2xl:h-[26vw] min-h-[360px]",
}) {
  const rootRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgInnerRef = useRef(null);
  const scrimRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.set(imgWrapRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(imgInnerRef.current, { scale: 0.98, force3D: true, z: 0 });
    gsap.set(scrimRef.current, { xPercent: 0, opacity: 0.7 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: "top 85%",
        end: "bottom 60%",
        once: true,
      },
    });

    tl.to(imgWrapRef.current, {
      clipPath: "inset(0% -1px 0% 0%)",
      duration: 1.3,
      ease: "power4.out",
    })
      .to(
        imgInnerRef.current,
        {
          keyframes: [
            { scale: 1.08, duration: 1.2, ease: "power3.out" },
            { scale: 1.0, duration: 0.5, ease: "power2.out" },
          ],
        },
        0,
      )
      .to(
        scrimRef.current,
        { xPercent: 100, opacity: 0, duration: 1.4, ease: "power3.out" },
        0.04,
      );

    return () => tl.kill();
  }, []);

  const easingStyle = {
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  };

  return (
    <div
      ref={rootRef}
      className={`group relative w-full overflow-hidden bg-black ${className}`}
      style={{ contain: "paint", WebkitFontSmoothing: "antialiased" }}
    >
      <div
        ref={imgWrapRef}
        className="absolute -inset-px will-change-[clip-path]"
      >
        <div
          ref={imgInnerRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            outline: "1px solid transparent",
          }}
        >
          <Image
            src={imgSrc}
            alt={alt || title || "works"}
            title={imgTitle || alt || title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={easingStyle}
            priority={false}
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

      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-95 transition-opacity duration-700"
        style={{
          ...easingStyle,
          background:
            "radial-gradient(115% 115% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          ...easingStyle,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          ...easingStyle,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
        <div
          className="text-center translate-y-1 group-hover:translate-y-0 transition-transform duration-700"
          style={easingStyle}
        >
          {!!title && (
            <h2
              className="m-0 text-white font-extrabold tracking-tight
               [font-size:clamp(32px,5vw,43px)]
               transition-colors duration-300 group-hover:text-[#c69c6d]"
            >
              {title}
            </h2>
          )}
          {!!subtitle && (
            <p className="mt-2 text-white text-[15px] md:text[18px] font-semibold transition-colors duration-300 group-hover:text-[#c69c6d]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 主首頁 ---------------- */
const HERO_POSTER =
  "/images/index/b69ff1_8d67d2bc26bd45529c4848f4343ccecc~mv2.jpg.avif";

function HomeClient({ specialPosts = [], frontData = {}, worksData = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    refreshJustFontDelayed([0, 500, 1500, 3000, 5000]);
  }, []);

  const heroSlides = buildHeroSlides(frontData);
  const poster =
    HERO_POSTER ||
    heroSlides[0]?.poster ||
    "/images/placeholder.jpg";

  const tiles = Array.isArray(worksData.works_classifications)
    ? worksData.works_classifications.map((w) => {
        const rawSeg =
          (w.url_slug && w.url_slug.trim()) ||
          (w.slug && w.slug.trim()) ||
          (w.title && w.title.trim()) ||
          String(w.id);

        return {
          img: w.image_url,
          imgAlt: w.image_alt,
          imgTitle: w.image_title,
          titleTw: w.title,
          titleEn:
            w.title_en ||
            {
              住宅空間: "Residential Space",
              老屋翻新: "Old House Renovation",
              商業空間: "Commercial Space",
            }[w.title] ||
            "",
          href: `/works/${encodeURIComponent(rawSeg)}`,
        };
      })
    : [];

  return (
    <ReactLenis root>
      <IntroOverlay />
      <div ref={containerRef} className="main bg-[#f5f5f7]">
        {/* HERO 區塊 */}
        <section className="relative h-screen z-50 overflow-hidden bg-black">
          <HeroVideoCarousel
            slides={heroSlides}
            poster={poster}
            minWidthForVideo={0}
            loadDelayMs={0}
          />
          <div className="sr-only">
            <h1>捌程室內設計 8distance・台中室內設計推薦・商空規劃</h1>
          </div>
        </section>

        {/* Sticky Nav */}
        <div className="xl:block sticky top-0 hidden z-[9999] bg-white/80 backdrop-blur">
          <Nav forceShow />
        </div>

        <section className="section-portfolio w-full !h-auto pb-5 xl:pb-20">
          <div className="grid relative grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 w-full gap-0 bg-black">
            {tiles.map((t, idx) => (
              <div key={`tile-${idx}`} className="m-0 p-0">
                <a href={t.href || "/works"}>
                  <CategoryTile
                    className="h-[700px]"
                    imgSrc={t.img}
                    alt={t.imgAlt}
                    imgTitle={t.imgTitle}
                    title={t.titleTw}
                    subtitle={t.titleEn}
                  />
                </a>
              </div>
            ))}
          </div>
        </section>

        <TestimonialsEmbla testimonials={[]} />
        <LatestNewsCarousel slides={[]} />
      </div>
    </ReactLenis>
  );
}

export default dynamic(() => Promise.resolve(HomeClient), { ssr: false });
