// app/home/home.jsx
"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import IntroOverlay from "@/components/IntroOverlayOnce";
import Nav from "../components/PageTransition/Nav";
import { ReactLenis } from "@studio-freight/react-lenis";
import LatestNewsCarousel from "../components/LatestNewsCarousel";
import TestimonialsEmbla from "../components/TestimonialsEmbla";
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- 輔助：解析 YouTube ID (保留但暫不使用) ---------------- */
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/* ---------------- HERO 智慧載入影片 (修正版：強制寬度滿版) ---------------- */
function SmartHeroVideo({
  videoUrl,
  className = "w-full h-full",
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    }
  }, [videoUrl]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
      <div className="absolute inset-0 z-[5] bg-transparent pointer-events-auto" />
      {videoUrl && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-[2] h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
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
function HomeClient({ specialPosts = [], frontData = {}, worksData = {} }) {
  const containerRef = useRef(null);

  const getHeroVideo = (frontData) => {
    const first = Array.isArray(frontData?.front_carouse_video)
      ? frontData.front_carouse_video.find((v) => v?.video_url)
      : null;

    const videoUrl = first?.video_url || "";
    return { videoUrl };
  };

  const { videoUrl } = getHeroVideo(frontData);

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
          <SmartHeroVideo videoUrl={videoUrl} />
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
