"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic"; // ⬅️ 新增：關閉 SSR 用
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";

import ParallaxCard from "../components/ParallaxCardIndex/page";
import { useScroll } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";

import GsapText from "../components/RevealText/index";
import Preloader01 from "../components/Preloader01/index";
import Preloader from "../components/Preloader/index";
import AnimatedLink from "../components/AnimatedLink";
import HoverItem from "../components/Slider/Slider.jsx";
import Video from "../components/Video";
import Script from "next/script";

import { Card, CardBody } from "@nextui-org/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { projects as projectsData } from "@/components/ParallaxCardIndex/data";
import AnimatedListFeed from "@/components/AnimatedListFeed";
import "swiper/css";
import "swiper/css/pagination";

const notifications = [
  {
    name: "Payment received",
    description:
      "我們家有長輩和小孩，設計師特地為我們規劃了許多安全又貼心的設計，像是圓弧邊角、防滑地板等。整個過程中，服務態度始終如一，有任何問題都能迅速回應，真的很負責。",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];
gsap.registerPlugin(ScrollTrigger);

function HomeClient({ specialPosts }) {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const container = useRef(null);
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
  useEffect(() => {
    const items = gsap.utils.toArray(".news-item");

    items.forEach((item) => {
      const underline = item.querySelector(".news-underline");
      const thumb =
        item.querySelector(".news-thumb img") || // 支援 Next <Image />
        item.querySelector(".news-thumb");
      const title = item.querySelector(".news-title");
      const sub = item.querySelector(".news-sub");

      if (!underline) return;

      // 初始
      gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      if (thumb) gsap.set(thumb, { opacity: 0.3 });
      if (title) gsap.set(title, { opacity: 0.3 });
      if (sub) gsap.set(sub, { opacity: 0.3 });

      const enter = () => {
        gsap.to(underline, { scaleX: 1, duration: 1.5, ease: "power3.out" });
        if (thumb)
          gsap.to(thumb, { opacity: 1, duration: 0.5, ease: "power2.out" });
        if (title)
          gsap.to(title, { opacity: 1, duration: 0.5, ease: "power2.out" });
        if (sub)
          gsap.to(sub, { opacity: 1, duration: 0.5, ease: "power2.out" });
      };

      const leave = () => {
        gsap.to(underline, { scaleX: 0, duration: 0.6, ease: "power3.in" });
        if (thumb)
          gsap.to(thumb, { opacity: 0.3, duration: 0.5, ease: "power2.in" });
        if (title)
          gsap.to(title, { opacity: 0.3, duration: 0.5, ease: "power2.in" });
        if (sub)
          gsap.to(sub, { opacity: 0.3, duration: 0.5, ease: "power2.in" });
      };

      ScrollTrigger.create({
        trigger: item,
        start: "top 40%",
        end: "bottom 30%",
        onEnter: enter,
        onEnterBack: enter,
        onLeave: leave,
        onLeaveBack: leave,
      });
    });

    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
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
    {
      image: "/images/index/住宅空間-程宅.webp",
    },
    {
      image: "/images/index/住宅空間-程宅.webp",
    },
  ];
  const slidesB = [
    {
      image: "/images/index/商業空間-桃園招待所.webp",
    },
    {
      image: "/images/index/商業空間-桃園招待所.webp",
    },
  ];

  const slidesC = [
    {
      image: "/images/index/純設計案-和美.webp",
    },
    {
      image: "/images/index/純設計案-和美.webp",
    },
  ];

  const slidesD = [
    {
      image: "/images/index/老屋翻新-李宅.webp",
    },
    {
      image: "/images/index/老屋翻新-李宅.webp",
    },
  ];
  // 客戶好評區塊

  return (
    <ReactLenis root>
      <Script
        id="home-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />

      <div className="">
        <div
          id="dark-section"
          className="relative w-full aspect-[500/700] sm:aspect-[500/700] md:aspect-[1024/576] xl:aspect-[1920/768] 2xl:aspect-[1920/1080] !overflow-hidden  "
        >
          <Preloader01 />
        </div>

        <div className="">
          <div
            id="dark-section"
            className="flex flex-col justify-center w-full mx-auto"
          >
            <div className="flex flex-col w-full justify-center mx-auto items-center mt-4">
              <div className="flex flex-col mb-5 justify-center items-center px-4 sm:px-8">
                <GsapText
                  text="最新作品"
                  id="headline"
                  className="text-[5vw] font-mode sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] leading-snug text-white text-center"
                />
                <h2 className="font-normal text-[20px]">PORTFOLIO</h2>
              </div>

              <section className="section-portfolio w-full pb-5 xl:pb-20">
                <div className="grid relative grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-full ">
                  <div className=" border ">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesC}
                        overlayTitle="建築設計 "
                        overlaySubtitle="ARCHITECTURE"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]" // ✅ 加回 hover 效果
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold  transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className=" border ">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesD}
                        overlayTitle="老屋改造 "
                        overlaySubtitle="RENOVATION"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]" // ✅ 加回 hover 效果
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold  transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className=" border ">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesA}
                        overlayTitle="住宅空間"
                        overlaySubtitle="RESIDENTIAL"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]" // ✅ 加回 hover 效果
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold  transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                  <div className=" border ">
                    <Link href="/note">
                      <HoverItem
                        slides={slidesB}
                        overlayTitle="商業空間 "
                        overlaySubtitle="COMMERCIAL"
                        overlayDesc="專屬你的生活動線與材質表情。"
                        showOverlay
                        intervalMs={5000}
                        overlayContainerClass="top-[45%] group-hover:top-[40%]" // ✅ 加回 hover 效果
                        overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold  transition-all duration-300"
                        overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
                        overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
                      />
                    </Link>
                  </div>
                </div>
              </section>
              <section className="section_our_commit flex lg:flex-row flex-col py-5 2xl:py-20 w-[80%] ">
                <div className="flex  lg:flex-row flex-col w-full mt-10">
                  <div className="title lg:pr-3">
                    <h2 className="m-0">NEWS</h2>
                    <p>最新消息</p>
                  </div>
                  <div className="left  w-full lg:w-[30%] pr-5">
                    <div className="sticky top-20">
                      <img
                        src="/images/員林胡宅獎盃/A7400023.webp"
                        className="w-[90%] h-auto"
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="right lg:mt-0 mt-4 w-full lg:w-[70%] ">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="news-item relative w-full py-10" // ⬅️ 移除 group / hover / border 類別
                      >
                        {/* 頂部動畫線：scaleX 0→1 等同寬度 0→100% */}
                        <div className="news-underline pointer-events-none absolute left-0 top-0 w-full !h-[1px] bg-gray-400 block origin-left scale-x-0" />

                        <div className="tag flex justify-between">
                          <span className="text-gray-400">(0{n})</span>
                          <div>
                            <span className="bg-[#E1A95F] text-[13px] font-normal text-gray-600 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>

                        <div className="flex lg:flex-row flex-col justify-between">
                          <div className="flex flex-col">
                            <h2 className="news-title font-normal text-gray-900">
                              法國設計GOLD.WINNER
                            </h2>
                            <span className="news-sub text-[14px] text-gray-800">
                              員林胡宅獎杯
                            </span>
                          </div>
                          <div className="img h-full mt-7 justify-start items-start lg:justify-center flex lg:items-center">
                            <img
                              src="/images/員林胡宅獎盃/A7400023.webp"
                              className="news-thumb max-w-full lg:max-w-[150px]" // ⬅️ 不放任何 opacity 類別，由 GSAP 控制
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section
                ref={container}
                className="section-portfolio w-full  relative"
              >
                <div className="">
                  {(projects || []).map((project, i) => {
                    const targetScale = 1 - (projects.length - i) * 0.05;
                    return (
                      <ParallaxCard
                        key={`card-${i}`}
                        i={i}
                        total={projects.length}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                        {...project}
                      />
                    );
                  })}
                </div>
              </section>
              <section className="section-video !w-full">
                <div className="w-full ">
                  <Video
                    src="https://videos.files.wordpress.com/Kut81xya/0_pc.mp4"
                    poster="/images/video-poster.jpg"
                    caption=""
                  />
                </div>
              </section>

              <section className="section-company-intro w-full py-20">
                <div className=" w-[95%] flex lg:flex-row flex-col mx-auto">
                  <div className="left w-full lg:w-[40%] flex justify-start pl-10 items-center">
                    <div className="flex flex-col w-full">
                      <div className="title">
                        <div className="flex flex-row">
                          <b className="text-[15.5px] mr-2">+景觀設計</b>
                          <b className="text-[15.5px] mr-2">+室內設計</b>
                        </div>
                      </div>
                      <div className="aspect-[4/3] w-full lg:w-[85%] relative overflow-hidden">
                        <Image
                          src="https://i0.wp.com/tjda.com/wp-content/uploads/2024/01/05_plus-shift_pj_cover.jpg?fit=2880%2C1920&quality=85&strip=all&ssl=1"
                          className="object-cover "
                          alt=""
                          fill
                        />
                      </div>
                      <div className="info grid lg:grid-cols-1 grid-cols-2 py-4">
                        {[
                          ["LOCATION", "台中市-TAICHUNG"],
                          ["ADDRESS", "台中市五權三街273號"],
                          ["LOCATION", "台中市-TAICHUNG"],
                          ["ADDRESS", "台中市五權三街273號"],
                        ].map(([k, v], idx) => (
                          <div className="flex my-2 flex-col" key={idx}>
                            <b className="text-gray-300 font-bold text-[12px]">
                              {k}
                            </b>
                            <span className="font-normal text-gray-700 text-[14px]">
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <AnimatedListFeed
                      items={notifications}
                      heightClassName="h-[420px]"
                    />
                  </div>

                  <div className="right w-full px-3 sm:px-8 lg:px-0 lg:w-[60%] flex justify-center items-center">
                    <div className="max-w-[600px]">
                      <h2 className="font-normal text-2xl">捌程室內設計</h2>
                      <p className="text-[14px] lg:text-[15px] leading-relaxed tracking-widest">
                        捌程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合。每個空間會因為不同的人所屬,而有著獨有的設計。程,以人為本為中心,創造功能合理、舒適優美、滿足物質和精神生活需要的室內環境,打造属於每個案件的獨有設計是捌程的理念,細心、用心與完美是捌程的宗旨!
                      </p>
                      <p className="text-[14px] lg:text-[15px] mt-4 leading-relaxed tracking-widest">
                        ,以人為本為中心,創造功能合理、舒適優美、滿足物質和精神生活需要的室內環境,打造属於每個案件的獨有設計是捌程的理念,細心、用心與完美是捌程的宗旨!
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section-others-project mb-10 overflow-hidden w-full">
                <Swiper
                  modules={[Pagination, A11y, Autoplay]}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  loop
                  speed={1200}
                  spaceBetween={16}
                  pagination={{
                    el: ".custom-pagination",
                    clickable: true,
                    renderBullet: (index, className) => {
                      return `
        <span class="${className} custom-bullet">
          <svg class="bullet-svg" width="22" height="22" viewBox="0 0 22 22">
            <circle class="bg" cx="11" cy="11" r="9" />
            <circle class="progress" cx="11" cy="11" r="9" />
            <circle class="dot" cx="11" cy="11" r="4" />
          </svg>
        </span>
      `;
                    },
                  }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 2.5 },
                    1280: { slidesPerView: 3.5 },
                  }}
                  className="m-0 p-0 !overflow-visible sm:!overflow-hidden"
                >
                  {staticSlides.map((slide, idx) => (
                    <SwiperSlide
                      key={idx}
                      className="px-3 overflow-hidden group relative duration-1000"
                    >
                      <div className="title absolute top-5 left-5 z-[999]">
                        <span className="text-white text-[.9rem]">
                          {slide.title}
                        </span>
                      </div>
                      <div className="title absolute bottom-5 flex right-5 z-[999]">
                        <button className="relative h-12 bg-transparent px-4 group-hover:text-white text-neutral-950">
                          <span className="relative inline-flex overflow-hidden">
                            <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[110%] text-transparent group-hover:skew-y-12">
                              View More
                            </div>
                            <div className="absolute translate-y-[110%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                              View More
                            </div>
                          </span>
                        </button>
                        <button className="relative opacity-10 group-hover:opacity-100 duration-500 inline-flex h-12 w-12 items-center justify-center overflow-hidden border font-medium text-neutral-200">
                          <div className="translate-x-0 transition group-hover:translate-x-[300%]">
                            ➔
                          </div>
                          <div className="absolute -translate-x-[300%] transition group-hover:translate-x-0">
                            ➔
                          </div>
                        </button>
                      </div>

                      <AnimatedLink href={slide.link}>
                        <div className="absolute z-50 w-full h-full inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out" />
                        <Card
                          className="border-white !rounded-[0px] pb-4 w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px] border relative bg-no-repeat bg-center bg-cover shadow-none overflow-hidden transition-transform duration-1000 ease-in-out hover:scale-110"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        >
                          <CardBody className="flex relative flex-col h-full w-full px-0" />
                        </Card>
                      </AnimatedLink>
                    </SwiperSlide>
                  ))}
                  <div className="custom-pagination flex justify-center gap-3 mt-6"></div>
                </Swiper>
              </section>
            </div>
          </div>
        </div>

        {/* 下方 ThreeDSlider 保持 */}
      </div>
    </ReactLenis>
  );
}

// ⬇️ 這行讓整個頁面元件只在 Client 端渲染（無 SSR），確保第一次就能讀 storage 判斷
export default dynamic(() => Promise.resolve(HomeClient), { ssr: false });
