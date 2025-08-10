"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import SpecialOffers from "../components/SpecialOffers";
import ParallaxCard from "../components/ParallaxCardIndex/page";
import { useScroll } from "framer-motion";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import ThreeDSlider from "../components/3DSlider.jsx";
import GsapText from "../components/RevealText/index";
import Preloader01 from "../components/Preloader01/index";
import Preloader from "../components/Preloader/index";
import AnimatedLink from "../components/AnimatedLink";
import HoverItem from "../components/Slider/Slider.jsx";
import Video from "../components/Video";
import Script from "next/script";
import { Compare } from "../components/ui/compare";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { projects as projectsData } from "@/components/ParallaxCard/data";

import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient({ specialPosts }) {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // first => <Preloader01/>（有動畫） | repeat => <Preloader/>（無動畫）
  const [preloaderType, setPreloaderType] = useState(null); // 'first' | 'repeat' | null
  const didInit = useRef(false); // 防止 React 18 開發模式雙跑

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (didInit.current) return;
    didInit.current = true;

    const LS_KEY = "visited";
    const SS_KEY = "visited_session";

    const hadVisited =
      !!window.localStorage.getItem(LS_KEY) ||
      !!window.sessionStorage.getItem(SS_KEY);

    if (hadVisited) {
      setPreloaderType("repeat");
    } else {
      setPreloaderType("first");
      // 第一次：同時寫入 localStorage + sessionStorage
      try {
        window.localStorage.setItem(LS_KEY, "1");
      } catch {}
      try {
        window.sessionStorage.setItem(SS_KEY, "1");
      } catch {}
    }
  }, []);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "寬越設計｜室內設計首選品牌",
    url: "https://www.kuankoshi.com/",
    description:
      "寬越設計提供專業室內設計服務，專精於住宅、商業空間與老屋翻新。從50萬小資裝潢到千萬豪宅設計，皆有豐富經驗與客製提案。",
    publisher: {
      "@type": "Organization",
      name: "寬越設計",
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
    if (typeof window === "undefined") return;
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

  // 可選：兩個 Preloader 動畫結束時呼叫，做進場後初始化
  const handlePreloaderFinish = () => {
    requestAnimationFrame(() => {
      initGSAPAnimations();
    });
  };

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
          className="relative w-full aspect-[16/11] md:aspect-[1920/1080] border-3 border-green-300 min-h-[90vh] sm:min-h-[85vh] md:min-h-[100vh] lg:min-h-[1000px] xl:min-h-[1000px]"
        >
          {/* 首訪顯示 Preloader01（有動畫），之後顯示 Preloader（無動畫） */}
          {preloaderType === "first" && (
            <Preloader01 onFinish={handlePreloaderFinish} />
          )}
          {preloaderType === "repeat" && (
            <Preloader onFinish={handlePreloaderFinish} />
          )}

          <div></div>
        </div>

        <section id="dark-section" className="section-padding">
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

              <section className="section-portfolio pb-20">
                <div className="flex">
                  <div className="w-[900px] border">
                    <Link href="/KuankoshiProjectInner">
                      <HoverItem />
                    </Link>
                  </div>
                  <div className="w-[900px] border">
                    <Link href="/KuankoshiProjectInner">
                      <HoverItem />
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-[900px] border">
                    <Link href="/KuankoshiProjectInner">
                      <HoverItem />
                    </Link>
                  </div>
                  <div className="w-[900px] border">
                    <Link href="/KuankoshiProjectInner">
                      <HoverItem />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="section_our_commit py-20 w-[80%] ">
                <div className="title">
                  <h2>NEWS</h2>
                  <p>最新消息</p>
                </div>
                <div className="flex w-full mt-10">
                  <div className="left w-[30%] pr-5">
                    <div className="sticky top-20">
                      <img
                        src="https://i0.wp.com/tjda.com/wp/wp-content/uploads/2024/11/14_Hibiya_02.jpg?fit=2880%2C1920&quality=85&strip=all&ssl=1"
                        className="w-[90%] h-auto"
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="right w-[70%] ">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="item w-full group hover:border-gray-600 transition duration-300 border-t-1 border-gray-200 py-10"
                      >
                        <div className="tag flex justify-between">
                          <span className="text-gray-300 transition duration-300 group-hover:text-gray-800">
                            (0{n})
                          </span>
                          <div>
                            <span className="bg-[#cad1d6] group-hover:bg-[#389dea] group-hover:text-white transition duration-300 text-[13px] font-normal text-gray-400 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>
                        <div className="content flex justify-between">
                          <div className="flex flex-col">
                            <h2 className="font-normal text-gray-300 group-hover:text-gray-900 transition duration-300">
                              紐約建築設計獎-2024
                            </h2>
                            <span className="text-[14px] text-gray-300 group-hover:text-gray-900 transition duration-300">
                              NY ARCHITECTURAL DESIGN AWARDS 紐約建築設計獎-2024
                              ​金獎
                            </span>
                          </div>
                          <div className="img h-full mt-7 justify-center flex items-center">
                            <img
                              src="https://static.wixstatic.com/media/b69ff1_5832419ae5d64e72afacdadad35c78bd~mv2.jpg/v1/fill/w_787,h_444,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E5%B0%81%E9%9D%A2%20%E6%8B%B7%E8%B2%9D.jpg"
                              className="max-w-[150px] opacity-35 group-hover:opacity-100 transition duration-300"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                <div className=" w-[95%] flex mx-auto">
                  <div className="left w-[40%] flex justify-start pl-10 items-center">
                    <div className="flex flex-col">
                      <div className="title">
                        <div className="flex flex-row">
                          <b className="text-[15.5px] mr-2">+景觀設計</b>
                          <b className="text-[15.5px] mr-2">+室內設計</b>
                        </div>
                      </div>
                      <img
                        src="https://i0.wp.com/tjda.com/wp-content/uploads/2024/01/05_plus-shift_pj_cover.jpg?fit=2880%2C1920&quality=85&strip=all&ssl=1"
                        className="w-[300px] mt-4"
                        alt=""
                      />
                      <div className="info py-4">
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

                  <div className="right w-[60%] flex justify-center items-center">
                    <div className="max-w-[900px]">
                      <h2 className="font-normal text-2xl">捌程室內設計</h2>
                      <p className="text-[15px] leading-relaxed tracking-wide">
                        程是一間室內與景觀設計的專業公司...
                      </p>
                      <p className="text-[15px] mt-4 leading-relaxed tracking-wide">
                        程是一間室內與景觀設計的專業公司...
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <main ref={container} className="relative">
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
              </main>

              <section className="section-others-project w-full">
                <Swiper
                  modules={[Pagination, A11y, Autoplay]}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  loop
                  speed={1200}
                  spaceBetween={16}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    0: { slidesPerView: 1.2 },
                    480: { slidesPerView: 2 },
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
                      className="mx-2 overflow-hidden group relative duration-1000"
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
                </Swiper>
              </section>
            </div>
          </div>
        </section>

        {/* 下方 ThreeDSlider 保持 */}
      </div>
    </ReactLenis>
  );
}
