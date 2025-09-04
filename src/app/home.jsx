// app/(或 pages 專案就放對應路徑)/home-client.jsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import Nav from "../components/PageTransition/Nav";
import ParallaxCard from "../components/ParallaxCardIndex/page";
import { useScroll } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import LatestNewsCarousel from "../components/LatestNewsCarousel";
import AnimatedLink from "../components/AnimatedLink";
import HoverItem from "../components/Slider/Slider.jsx";
import Video from "../components/Video";
import Script from "next/script";
import TestimonialsEmbla from "../components/TestimonialsEmbla";
import { Card } from "@nextui-org/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { projects as projectsData } from "@/components/ParallaxCardIndex/data";
import AnimatedListFeed from "@/components/AnimatedListFeed";
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

function HomeClient({ specialPosts }) {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);

  // ✅ 所有 hooks 必須放在元件裡
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const container = useRef(null);
  const heroSectionRef = useRef(null);
  const arrowRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // === 單一 boot 狀態，同步初始化（此元件已關 SSR，這裡一定拿得到 window） ===
  const [boot, setBoot] = useState(() => {
    const LS_KEY = "visited";
    const SS_KEY = "visited_session";

    let hadVisited = false;
    try {
      hadVisited =
        !!window.localStorage.getItem(LS_KEY) ||
        !!window.sessionStorage.getItem(SS_KEY);
    } catch {
      hadVisited = false;
    }

    if (hadVisited) return { type: "repeat", show: false };
    try {
      window.localStorage.setItem(LS_KEY, "1");
    } catch {}
    try {
      window.sessionStorage.setItem(SS_KEY, "1");
    } catch {}
    return { type: "first", show: true }; // 無痕第一次也會是這個分支
  });

  // 8 秒保險
  useEffect(() => {
    if (boot.type !== "first" || !boot.show) return;
    const t = setTimeout(() => setBoot((s) => ({ ...s, show: false })), 8000);
    return () => clearTimeout(t);
  }, [boot.type, boot.show]);

  // 顯示 preloader 期間鎖 body 捲動
  useEffect(() => {
    if (boot.show) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [boot.show]);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "捌程室內設計｜室內設計首選品牌",
    url: "https://www.kuankoshi.com/",
    description:
      "捌程室內設計提供專業室內設計服務，專精於住宅、商業空間與老屋翻新。從50萬小資裝潢到千萬豪宅設計，皆有豐富經驗與客製提案。",
    publisher: {
      "@type": "Organization",
      name: "捌程室內設計",
      url: "https://www.kuankoshi.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kuankoshi.com/images/favicon.ico",
      },
    },
    mainEntity: [
      {
        "@type": "CreativeWork",
        name: "小資裝修專案",
        url: "https://www.kuankoshi.com/#special",
        description: "50-100萬裝潢專案，為首購族量身打造，兼具美感與實用性",
      },
      {
        "@type": "CreativeWork",
        name: "商業空間設計",
        url: "https://www.kuankoshi.com/project?cat=commercial-public",
        description: "量身打造品牌商業空間，從品牌精神出發整合設計與施工",
      },
      {
        "@type": "CreativeWork",
        name: "老屋翻新工程",
        url: "https://www.kuankoshi.com/project?cat=renovation-restoration",
        description: "結合現代美感與結構優化，翻轉老屋新生命",
      },
    ],
  };

  const initGSAPAnimations = useCallback(() => {
    if (window.innerWidth < 580) return;

    const ctx = gsap.context(() => {
      const images = document.querySelectorAll(".animate-image-wrapper");

      images.forEach((image, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "top center",
            toggleActions: "play none none none",
            id: "imageReveal-" + i,
          },
        });

        tl.fromTo(
          image.querySelector(".overlay"),
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          }
        )
          .to(image.querySelector(".overlay"), {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          })
          .fromTo(
            image.querySelector(".image-container"),
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "power3.inOut",
            },
            "-=0.5"
          );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return ctx;
  }, []);

  const handlePreloaderFinish = () => {
    setBoot((s) => ({ ...s, show: false }));
    requestAnimationFrame(() => {
      initGSAPAnimations();
    });
  };

  // ✅ Hero 區塊下方箭頭動畫（尊重 reduce-motion）
  useEffect(() => {
    if (!arrowRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        arrowRef.current,
        { y: 0, opacity: 0.6 },
        {
          y: 14,
          opacity: 1,
          duration: 1.2,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const staticSlides = [
    {
      title: "小資裝修專案",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kumu_mv-1920x1280.jpg",
      link: "/project/small-budget",
    },
    {
      title: "商業空間設計",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kaika_mv-1920x1280.jpg",
      link: "/project/commercial-space",
    },
    {
      title: "老屋翻新工程",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
      link: "/project/renovation",
    },
    {
      title: "北歐簡約風",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
      link: "/project/nordic-style",
    },
    {
      title: "現代輕奢宅",
      image: "https://www.rebita.co.jp/images/index/solutioncard_bg_2.jpg",
      link: "/project/luxury-modern",
    },
  ];

  const projects = projectsData ?? [];
  const slidesA = [
    { image: "/images/index/住宅空間-程宅.webp" },
    { image: "/images/index/住宅空間-程宅.webp" },
  ];
  const slidesB = [
    { image: "/images/index/商業空間-桃園招待所.webp" },
    { image: "/images/index/商業空間-桃園招待所.webp" },
  ];
  const slidesC = [
    { image: "/images/index/純設計案-和美.webp" },
    { image: "/images/index/純設計案-和美.webp" },
  ];
  const slidesD = [
    { image: "/images/index/老屋翻新-李宅.webp" },
    { image: "/images/index/老屋翻新-李宅.webp" },
  ];

  // 客戶好評
  const testimonials = [
    {
      name: "王先生",
      role: "住宅業主",
      content:
        "我們家有長輩和小孩，設計師特地為我們規劃了許多安全又貼心的設計，像是圓弧邊角、防滑地板等。整個過程中，服務態度始終如一，有任何問題都能迅速回應，真的很負責。 ",
      avatar: "/images/testimonials/user1.jpg",
    },
    {
      name: "林小姐",
      role: "咖啡廳老闆",
      content:
        "從一開始的諮詢到最後的驗收，每個環節都讓人感到安心。設計師不僅專業，還會細心聆聽我們的需求，把家裡的每一個小角落都規劃得超乎想像！真的非常感謝團隊的用心。 ",
      avatar: "/images/testimonials/user2.jpg",
    },
    {
      name: "張經理",
      role: "辦公室管理者",
      content:
        "從第一次接觸開始，設計師就很有耐心傾聽需求，過程中不厭其煩地解釋每一個細節，讓我們對新家的樣貌逐漸清晰。施工團隊也相當專業，每個步驟都會主動回報，讓人很安心。最後成果比想像還要更好，住進來後的舒適感，真的讓人覺得一切都值得。 ",
      avatar: "/images/testimonials/user3.jpg",
    },
    {
      name: "張經理",
      role: "辦公室管理者",
      content:
        "家裡坪數不大，原本很擔心空間不足，沒想到設計師透過巧妙的動線規劃和收納設計，讓每個角落都能發揮作用。成品不僅美觀，實際使用起來也非常便利。每天回家都覺得空間更寬敞、明亮，這份貼心的設計感受得到專業與細心。 ",
      avatar: "/images/testimonials/user3.jpg",
    },
    {
      name: "張經理",
      role: "辦公室管理者",
      content:
        "設計不只是漂亮而已，更兼顧了我們日常生活的需求。家裡收納空間變多，但卻不會讓人覺得壓迫。整體氛圍輕盈舒適，家人每天回家都心情很好。謝謝設計師將功能性和美感結合，真的超乎預期！ ",
      avatar: "/images/testimonials/user3.jpg",
    },
    {
      name: "張經理",
      role: "辦公室管理者",
      content:
        "設計師真的超有耐心，從討論到完工一路陪著我們，很多細節都幫忙想到！住進來後覺得家變得更舒服，每天回家都好放鬆，真的很感謝這個團隊 ❤️  ",
      avatar: "/images/testimonials/user3.jpg",
    },
    {
      name: "張經理",
      role: "辦公室管理者",
      content:
        "從簽約到交屋，進度掌握得很不錯，每個階段都會主動跟我們確認，像是水電和木工的時間都有提前告知，完全不會突然通知就開工。整體來說，比我們原先預期的還快一點。團隊分工清楚，讓我們不用每天盯著工地，也能隨時知道最新狀況，對忙碌的上班族來說真的很方便。",
      avatar: "/images/testimonials/user3.jpg",
    },
  ];
  const CIRC = 2 * Math.PI * 9; // r=9 -> 圓周長，給進度環用
  const paginationRef = useRef(null);
  return (
    <ReactLenis root>
      <Script
        id="home-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />

      {/* HERO 區塊 */}
      <section
        ref={heroSectionRef}
        className="section-hero-video relative h-screen overflow-hidden"
      >
        <video
          src="https://videos.files.wordpress.com/FkZ9MbMc/e9a696e9a081e5bdb1e78987.mp4"
          loop
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* 文字與按鈕 overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h2 className="mb-4 text-3xl md:text-4xl text-slate-50 font-semibold">
            8-DISTANCE
          </h2>
          <h1 className="mb-3 text-xl md:text-2xl text-slate-50 font-medium">
            室內設計・商業空間・建築設計
          </h1>
          <p className="mb-6 text-sm md:text-base text-slate-50">
            室內設計・商業空間・建築設計
          </p>
        </div>

        {/* Scroll Arrow */}
        <button
          ref={arrowRef}
          onClick={() => {
            document.getElementById("dark-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          aria-label="Scroll down"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-white/90 hover:text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>

      {/* 你原本的 Nav（如果首頁不想顯示，請改成 ConditionalNav 做路徑判斷） */}
      {/* 讓 Nav 捲到上緣時黏住；回捲時回原位 */}
      <div className="sm:block sticky top-0 hidden  z-[9999] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Nav />
      </div>

      <div>
        <div>
          <div
            id="dark-section"
            className="flex flex-col justify-center w-full mx-auto"
          >
            <div className="flex flex-col w-full justify-center mx-auto items-center mt-4">
              {/* 四格入口 */}
              <section className="section-portfolio w-full pb-5 xl:pb-20">
                <div className="grid relative grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-full">
                  <div className="">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesC}
                        overlayTitle="建築設計 "
                        overlaySubtitle="ARCHITECTURE"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]"
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className="">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesD}
                        overlayTitle="老屋改造 "
                        overlaySubtitle="RENOVATION"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]"
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className="">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesA}
                        overlayTitle="住宅空間"
                        overlaySubtitle="RESIDENTIAL"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]"
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className="">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesB}
                        overlayTitle="商業空間 "
                        overlaySubtitle="COMMERCIAL"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]"
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                </div>
              </section>
              <TestimonialsEmbla testimonials={testimonials} />
              <LatestNewsCarousel slides={staticSlides} />/
            </div>
          </div>
        </div>

        {/* 下方 ThreeDSlider 保持 */}
      </div>
    </ReactLenis>
  );
}

// 只在 Client 端渲染（無 SSR）
export default dynamic(() => Promise.resolve(HomeClient), { ssr: false });
