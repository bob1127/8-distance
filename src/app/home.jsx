"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import SpecialOffers from "../components/SpecialOffers";
// import ThreedSlider from "../components/ThreeDSlider/ThreeSlider"
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
// import ThreeDBanner from "../components/ThreeDBanner/index";
import ThreeDSlider from "../components/3DSlider.jsx";
// import InfiniteScroll from "../components/InfiniteScroll/page.jsx";
import GsapText from "../components/RevealText/index";
import Preloader from "../components/Preloader/index";
// import HomeSlider from "../components/HeroSliderHome/page.jsx";
import AnimatedLink from "../components/AnimatedLink";
import HoverItem from "../components/Slider/Slider.jsx";
import Video from "../components/Video";

import Script from "next/script";
import LogoLoader from "../components/Loderanimation.jsx";
// import Marquee from "react-fast-marquee";
import { Compare } from "../components/ui/compare";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
gsap.registerPlugin(ScrollTrigger);

export default function HomeClient({ specialPosts }) {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
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
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          },
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
            {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            },
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

  useEffect(() => {
    const firstVisit = localStorage.getItem("visited");
    if (firstVisit) {
      setLoading(false);
    }
  }, []);

  const handleLogoFinish = () => {
    localStorage.setItem("visited", "true");
    setLoading(false);

    requestAnimationFrame(() => {
      initGSAPAnimations(); // 🟢 初始化動畫
    });
  };

  // useEffect(() => {
  //   let ctx;

  //   const onTransitionComplete = () => {
  //     ctx = initGSAPAnimations();
  //   };

  //   window.addEventListener("pageTransitionComplete", onTransitionComplete);

  //   if (!sessionStorage.getItem("transitioning")) {
  //     if (!loading) {
  //       ctx = initGSAPAnimations();
  //     }
  //   } else {
  //     sessionStorage.removeItem("transitioning");
  //   }

  //   return () => {
  //     if (ctx) ctx.revert();
  //     window.removeEventListener(
  //       "pageTransitionComplete",
  //       onTransitionComplete
  //     );
  //   };
  // }, [initGSAPAnimations, loading]);
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

  return (
    <ReactLenis root>
      <Script
        id="home-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData),
        }}
      />
      {loading ? (
        <LogoLoader onFinish={handleLogoFinish} />
      ) : (
        // 🔽 你原本的 JSX 區塊，保持不變

        <div className="overflow-hidden ">
          <div
            id="dark-section"
            className="relative w-full overflow-hidden aspect-[16/9] md:aspect-[1920/768] min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] xl:min-h-[75vh] "
          >
            <div className="absolute w-full h-full z-30 left-0 top-0 bg-black/30"></div>
            <div className="txt absolute  max-w-[550px] left-[13%] top-[40%] -translate-y-1/2 z-50">
              <GsapText
                text=" 捌程景觀及室內設計"
                id="hero-title-1"
                className="block !text-white !text-[clamp(1.8rem,5vw,3rem)] !font-mode leading-tight"
              />

              <p className="text-white">8distance</p>
            </div>
            <div className="bottom w-[80%] max-w-[600px] absolute left-[13%] bottom-8 z-50">
              <div className="flex justify-between">
                <AnimatedLink href="/ServiceProcess">
                  {" "}
                  <p className="text-gray-300 text-[14px]">室內設計作品</p>
                </AnimatedLink>
                <p className="text-gray-300 text-[14px]">室內設計作品</p>
                <p className="text-gray-300 text-[14px]">室內設計作品</p>{" "}
                <p className="text-gray-300 text-[14px]">室內設計作品</p>
              </div>
            </div>
            <Preloader />
          </div>

          {/* <section className="section-padding">
            <div className="flex flex-col justify-center items-center  px-4 sm:px-8">
              <GsapText
                text="從小資日常到質感夢想宅"
                id="headline"
                className="text-[5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] leading-snug font-medium text-white text-center"
              />
              <GsapText
                text="一起打造家的每一種可能"
                id="headline"
                className="text-[4.5vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[1.6vw] leading-snug font--normal text-white text-center"
              />
            </div>
            <div className="flex  flex-col md:flex-row max-w-[1400px] mx-auto w-[90%] gap-10 mt-10 md:mt-[50px]">
     
              <div className="flex flex-col w-full">
                <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-black opacity-0 z-10" />
                    <Image
                      src="/images/小資專案/小資專案.webp"
                      alt="About Image 1"
                      fill
                      loading="lazy"
                      placeholder="empty"
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          <section id="dark-section" className=" section-padding  ">
            <div
              id="dark-section"
              className="flex flex-col justify-center  w-full mx-auto"
            >
              <div className="flex  flex-col  w-full   justify-center  mx-auto items-cente items-center  mt-4">
                <div className="flex flex-col mb-5 justify-center items-center  px-4 sm:px-8">
                  <GsapText
                    text="最新作品"
                    id="headline"
                    className="text-[5vw] font-mode sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] leading-snug  text-white text-center"
                  />

                  <h2 className="font-normal  text-[20px]">PORTFOLIO</h2>

                  {/* <span className=" leading-loose font--normal max-w-3xl text-base sm:text-md text-center text-gray-800 ">
                    寬越設計從 50
                    萬小資方案到千萬豪宅規劃皆具經驗，無論是小坪數輕裝潢，或全室訂製系統與高端設計，我們都能為每個預算量身打造舒適、實用且富有美感的生活空間。
                  </span> */}
                </div>

                <section className="section-portfolio pb-20">
                  <div className="flex">
                    <div className="w-[900px] border">
                      {" "}
                      <Link href="/KuankoshiProjectInner">
                        <HoverItem />
                      </Link>
                    </div>
                    <div className="w-[900px] border">
                      {" "}
                      <Link href="/KuankoshiProjectInner">
                        {" "}
                        <HoverItem />
                      </Link>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[900px] border">
                      {" "}
                      <Link href="/KuankoshiProjectInner">
                        {" "}
                        <HoverItem />
                      </Link>
                    </div>
                    <div className="w-[900px] border">
                      {" "}
                      <Link href="/KuankoshiProjectInner">
                        {" "}
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
                      <div className="item w-full group hover:border-gray-600 transition duration-300 border-t-1 border-gray-200 py-10">
                        <div className="tag flex justify-between">
                          {" "}
                          <span className="text-gray-300 transition duration-300 group-hover:text-gray-800">
                            (01)
                          </span>{" "}
                          <div>
                            <span className="bg-[#cad1d6] group-hover:bg-[#389dea] group-hover:text-white transition duration-300 text-[13px] font-normal text-gray-400 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>
                        <div className="content flex  justify-between">
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
                      <div className="item w-full group hover:border-gray-600 transition duration-300 border-t-1 border-gray-200 py-10">
                        <div className="tag flex justify-between">
                          {" "}
                          <span className="text-gray-300 transition duration-300 group-hover:text-gray-800">
                            (01)
                          </span>{" "}
                          <div>
                            <span className="bg-[#cad1d6] group-hover:bg-[#389dea] group-hover:text-white transition duration-300 text-[13px] font-normal text-gray-400 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>
                        <div className="content flex  justify-between">
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
                      <div className="item w-full group hover:border-gray-600 transition duration-300 border-t-1 border-gray-200 py-10">
                        <div className="tag flex justify-between">
                          {" "}
                          <span className="text-gray-300 transition duration-300 group-hover:text-gray-800">
                            (01)
                          </span>{" "}
                          <div>
                            <span className="bg-[#cad1d6] group-hover:bg-[#389dea] group-hover:text-white transition duration-300 text-[13px] font-normal text-gray-400 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>
                        <div className="content flex  justify-between">
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
                      <div className="item w-full group hover:border-gray-600 transition duration-300 border-t-1 border-gray-200 py-10">
                        <div className="tag flex justify-between">
                          {" "}
                          <span className="text-gray-300 transition duration-300 group-hover:text-gray-800">
                            (01)
                          </span>{" "}
                          <div>
                            <span className="bg-[#cad1d6] group-hover:bg-[#389dea] group-hover:text-white transition duration-300 text-[13px] font-normal text-gray-400 px-4 py-1 rounded-[20px]">
                              TAG
                            </span>
                          </div>
                        </div>
                        <div className="content flex  justify-between">
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
                    <div className="left w-[40%] flex   justify-start pl-10 items-center">
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
                        ></img>
                        <div className="info py-4">
                          <div className="flex my-2 flex-col">
                            <b className="text-gray-300 font-bold text-[12px]">
                              LOCATION
                            </b>
                            <span className="font-normal text-gray-700 text-[14px]">
                              台中市-TAICHUNG
                            </span>
                          </div>
                          <div className="flex my-2 flex-col">
                            <b className="text-gray-300 font-bold text-[12px]">
                              ADDRESS
                            </b>
                            <span className="font-normal text-gray-700 text-[14px]">
                              台中市五權三街273號
                            </span>
                          </div>
                          <div className="flex my-2 flex-col">
                            <b className="text-gray-300 font-bold text-[12px]">
                              LOCATION
                            </b>
                            <span className="font-normal text-gray-700 text-[14px]">
                              台中市-TAICHUNG
                            </span>
                          </div>
                          <div className="flex my-2 flex-col">
                            <b className="text-gray-300 font-bold text-[12px]">
                              ADDRESS
                            </b>
                            <span className="font-normal text-gray-700 text-[14px]">
                              台中市五權三街273號
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right w-[60%] flex justify-center items-center">
                      <div className="max-w-[900px]">
                        <h2 className="font-normal text-2xl">捌程室內設計</h2>
                        <p className="text-[15px] leading-relaxed tracking-wide">
                          程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合。每個空間會因為不同的人所屬,而有著獨有的設計。程,以人為本為中心,創造功能合理、舒適優美、滿足物質和精神生活需要的室內環境,打造属於每個案件的獨有設計是捌程的理念,細心、用心與完美是捌程的宗旨!
                        </p>
                        <p className="text-[15px] mt-4 leading-relaxed tracking-wide">
                          程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合。每個空間會因為不同的人所屬,而有著獨有的設計。程,以人為本為中心,創造功能合理、舒適優美、滿足物質和精神生活需要的室內環境,打造属於每個案件的獨有設計是捌程的理念,細心、用心與完美是捌程的宗旨!
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section-others-project w-full">
                  <Swiper
                    modules={[Pagination, A11y, Autoplay]}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
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
                        className="mx-2  overflow-hidden group relative duration-1000 "
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
                            className="border-white !rounded-[0px]  pb-4 w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px] border relative bg-no-repeat bg-center bg-cover shadow-none overflow-hidden transition-transform duration-1000 ease-in-out hover:scale-110"
                            style={{ backgroundImage: `url(${slide.image})` }}
                          >
                            <CardBody className="flex relative flex-col h-full w-full px-0"></CardBody>
                          </Card>
                        </AnimatedLink>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
                {/* <div className="text w-[95%] lg:w-1/2 p-8 flex flex-col justify-center items-center">
            <TextGenerateEffect words="宜居" />
            <p>不與人同的作為</p>
          </div> */}
              </div>
            </div>
          </section>

          {/* 下方 ThreeDSlider 保持 */}
        </div>
      )}
    </ReactLenis>
  );
}
