"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Marquee from "react-fast-marquee";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import GsapText from "../../components/RevealText/index";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

// ✅ 引入你的 MiniMapGallery（依實際路徑調整）
import MiniMapGallery from "../../components/MiniMapGallery";

gsap.registerPlugin(CustomEase);

const Photos = () => {
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const galleryImages = [
    { src: "/images/project-01/img06.jpg", alt: "關於寬越設計的設計理念" },
    { src: "/images/project-01/img08.jpg", alt: "Blog-001 另一角度" },
    {
      src: "/images/project-01/img05.jpg",
      alt: "和風の木格子を使ったカフェ空間",
    },
    { src: "/images/project-01/img04.jpg", alt: "都會極簡甜點店" },
    { src: "/images/project-01/img01.jpg", alt: "Blog-001 專案大圖" },
  ];

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const openGalleryAt = (src) => {
    const idx = galleryImages.findIndex((p) => p.src === src);
    setGalleryStartIndex(Math.max(0, idx));
    setGalleryOpen(true);
  };

  const backgroundImages = [
    "/images/project-01/img03.jpg",
    "/images/hero-img/img06.png",
    "/images/hero-img/img07.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/project-01/img03.jpg"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Changelog",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Card grid component
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Startup template Aceternity
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Random file upload lol
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Salman Bhai Fan Club registrations open
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.title + index} card={card} index={index} />
  ));
  return (
    <ReactLenis root>
      <div className="bg-[#F1F1F1]">
        {/* ====== Hero 區（原樣保留） ====== */}
        <section className="section-hero relative mt-[28vh] h-[70vh]">
          <div className="white-section border rounded-tr-[60px] bg-[#F1F1F1] absolute top-[-90px] left-0 w-[88%] h-full "></div>

          <section className="section-hero w-full aspect-[500/500] relative  h-full md:aspect-[1024/576] xl:aspect-[1920/700] color-section">
            {/* 旋轉徽章 */}
            <div className="absolute left-1/2 bottom-[-110px]  w-[200px] h-[200px] flex items-center justify-center transform -translate-x-1/2">
              <div className="absolute inset-0 animate-spin-slow flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 100, 100 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                    />
                  </defs>
                  <text fill="#ffffff" fontSize="12" fontWeight="bold">
                    <textPath href="#circlePath" startOffset="0">
                      設計靈感 • 美好生活 • 空間美學 • 設計靈感 • 美好生活 •
                      空間美學 •
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="circle bg-[#F1F1F1] w-[100px] h-[100px] flex justify-center items-center text-[1.2rem] font-bold rounded-full ">
                ORIGINAL
              </div>
            </div>

            <style jsx>{`
              .animate-spin-slow {
                animation: spin 20s linear infinite;
              }
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>

            {/* 背景輪播 */}
            <div className="relative w-full h-full overflow-hidden">
              {backgroundImages.map((bg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: i === currentIndex ? 1 : 0,
                    scale: i === currentIndex ? 1.15 : 1,
                  }}
                  transition={{
                    opacity: { duration: 1.5, ease: "easeInOut" },
                    scale: { duration: 20, ease: "linear" },
                  }}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                  style={{ backgroundImage: `url(${bg})` }}
                />
              ))}
            </div>

            {/* 遮罩 + 文字 */}
            <div className="bg-black opacity-40 w-full h-full absolute top-0 left-0 z-10" />
            <div className="hero-title w-1/2 absolute left-[4%] top-[90%] z-20">
              <div className="text-center px-4">
                <GsapText
                  text="最新消息"
                  id="gsap-intro"
                  fontSize="2.8rem"
                  fontWeight="200"
                  color="#fff"
                  lineHeight="60px"
                  className="text-center tracking-widest !text-white inline-block mb-0 h-auto"
                />
              </div>
              <div className="text-center px-4">
                <GsapText
                  text="NEWS"
                  id="gsap-intro"
                  fontSize="1.2rem"
                  fontWeight="200"
                  color="#fff"
                  lineHeight="30px"
                  className="text-center !text-white tracking-widest inline-block mb-0 h-auto"
                />
              </div>
            </div>
          </section>
        </section>

        {/* ====== 卡片區：onClick 一律改用 openGalleryAt ====== */}
        <section className="section-grid-item mt-[10vh] px-4 py-8">
          <div className="max-w-[1920px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {/* LEFT */}
            <div className="h-full gap-4 flex flex-col">
              {/* 卡片 A */}
              <div>
                <div
                  className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                  onClick={() => openGalleryAt("/images/project-01/img06.jpg")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    openGalleryAt("/images/project-01/img06.jpg")
                  }
                >
                  <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-300" />
                  <div className="card-content pointer-events-none duration-300 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                    <h3 className="text-white text-[1.5rem] font-bold">
                      Blog-001
                    </h3>
                    <span className="text-xs font-light mt-2 text-white">
                      關於寬越設計的設計理念
                    </span>
                  </div>
                  <div className="relative w-full h-full min-h-[600px]">
                    <Image
                      src="/images/project-01/img06.jpg"
                      alt="card-img"
                      fill
                      className="object-cover group-hover:scale-125 duration-3000"
                    />
                  </div>
                </div>
              </div>

              {/* 卡片 B */}
              <div>
                <div>
                  <div
                    className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                    onClick={() =>
                      openGalleryAt("/images/project-01/img08.jpg")
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      openGalleryAt("/images/project-01/img08.jpg")
                    }
                  >
                    <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                    <div className="card-content pointer-events-none duration-700 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                      <h3 className="text-white text-[1.5rem] font-bold">
                        Blog-001
                      </h3>
                      <span className="text-xs font-light mt-2 text-white">
                        關於寬越設計的設計理念
                      </span>
                    </div>
                    <div className="relative w-full h-full min-h-[600px]">
                      <Image
                        src="/images/project-01/img08.jpg"
                        alt="card-img"
                        fill
                        className="object-cover group-hover:scale-125 duration-3000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle */}
            <div className="flex flex-col gap-4">
              <div className="card-item group hover:shadow-xl aspect-square w-full border relative overflow-hidden">
                <div className="mask z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="card-content duration-700 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-white text-[1.5rem] font-bold">
                    Blog-002
                  </h3>
                  <span className="text-xs font-light mt-2 text-white">
                    和風の木格子を使ったカフェ空間
                  </span>
                </div>
                <Image
                  src="/images/project-01/img05.jpg"
                  alt="card-img-2"
                  fill
                  className="object-cover group-hover:scale-125 duration-3000 cursor-zoom-in"
                  onClick={() => openGalleryAt("/images/project-01/img05.jpg")}
                />
              </div>

              <div className="card-item group hover:shadow-xl aspect-square w-full border relative overflow-hidden">
                <div className="mask z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="card-content duration-700 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-white text-[1.5rem] font-bold">
                    Blog-003
                  </h3>
                  <span className="text-xs font-light mt-2 text-white">
                    都會極簡甜點店
                  </span>
                </div>
                <Image
                  src="/images/project-01/img04.jpg"
                  alt="card-img-3"
                  fill
                  className="object-cover group-hover:scale-125 duration-3000 cursor-zoom-in"
                  onClick={() => openGalleryAt("/images/project-01/img04.jpg")}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="h-full">
              <div className="card-item group hover:shadow-xl w-full border relative overflow-hidden">
                <div className="mask z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="card-content duration-700 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-white text-[1.5rem] font-bold">
                    Blog-001
                  </h3>
                  <span className="text-xs font-light mt-2 text-white">
                    關於寬越設計的設計理念
                  </span>
                </div>
                <div className="relative w-full h-full min-h-[600px]">
                  <Image
                    src="/images/project-01/img01.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-125 duration-3000 cursor-zoom-in"
                    onClick={() =>
                      openGalleryAt("/images/project-01/img01.jpg")
                    }
                  />
                </div>
              </div>

              <div className="card-item group hover:shadow-xl w-full border relative overflow-hidden mt-4">
                <div className="mask z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="card-content duration-700 group-hover:opacity-100 opacity-100 sm:opacity-0 absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-white text-[1.5rem] font-bold">
                    Blog-001
                  </h3>
                  <span className="text-xs font-light mt-2 text-white">
                    關於寬越設計的設計理念
                  </span>
                </div>
                <div className="relative w-full h-full min-h-[600px]">
                  <Image
                    src="/images/project-01/img03.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-125 duration-3000 cursor-zoom-in"
                    onClick={() =>
                      openGalleryAt("/images/project-01/img03.jpg")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 下方輪播（原樣） */}
        <section className="flex py-[140px] bg-custom-gradient">
          <div className="w-[30%] flex items-center justify-end">
            <div className="card-text flex flex-col justify-center items-center">
              <h2 className="text-[9.5vmin] text-[#F1F1F1] rotate-[90deg] tracking-wide">
                IDEA
              </h2>
              <div className="project-amount text-white my-5 bg-black flex justify-center items-center rounded-full w-8 h-8">
                23
              </div>
              <span
                className="text-[1.4rem] text-[#F1F1F1] mt-10"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                }}
              >
                創意想法案件
              </span>
            </div>
          </div>
          <div className="w-[90%] overflow-hidden">
            <Carousel items={cards} />
            <div className="pt-8">
              <span className="text-[.85rem] text-gray-400">
                界裡還有許多充滿趣味的店舗設計想法。使用海外材料和個性化的色彩設計的空間中，充滿了商店設計的靈感。
                <br />
                我們可以以輕鬆旅行的心情，去發現新的設計。
              </span>
            </div>
          </div>
        </section>
      </div>

      {mounted && galleryOpen
        ? createPortal(
            <MiniMapGallery
              images={galleryImages}
              currentIndex={galleryStartIndex}
              onClose={() => setGalleryOpen(false)}
            />,
            document.body
          )
        : null}
    </ReactLenis>
  );
};

export default Photos;

const DummyContent = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-medium font-sans max-w-3xl mx-auto">
        <span className="font-bold text-[20px] text-neutral-700 dark:text-neutral-200">
          {title}
        </span>{" "}
        {description}
      </p>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          height={500}
          width={500}
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
        />
      )}
    </div>
  );
};

const data = [
  {
    category: "建築老屋",
    title: "老屋翻新-外觀拉皮",
    src: "/images/project-01/img06.jpg",
    content: (
      <div className="">
        <div className="p-8 ">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-4">
              翻新35年老透天，打造現代俐落街景
            </h2>
            <p>從老舊磁磚屋到質感現代建築，一場建築的重生旅程。</p>
          </div>
          <Image
            src="/images/project-01/img06.jpg"
            alt="AI Example"
            width={1500}
            height={800}
            className="mt-4  w-full md:w-[80%]   rounded-lg"
          />
        </div>
      </div>
    ),
  },
  {
    category: "建築老屋",
    title: "老屋翻新-外觀拉皮",
    src: "/images/blog/建築老屋/img01.png",
    content: (
      <div className="">
        <div className="p-8 ">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-4">
              翻新35年老透天，打造現代俐落街景
            </h2>
            <p>從老舊磁磚屋到質感現代建築，一場建築的重生旅程。</p>
          </div>
          <Image
            src="/images/blog/建築老屋/img01.png"
            alt="AI Example"
            width={1500}
            height={800}
            className="mt-4  w-full md:w-[80%]   rounded-lg"
          />
        </div>
      </div>
    ),
  },
  {
    category: "建築老屋",
    title: "老屋翻新-外觀拉皮",
    src: "/images/blog/建築老屋/img01.png",
    content: (
      <div className="">
        <div className="p-8 ">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-4">
              翻新35年老透天，打造現代俐落街景
            </h2>
            <p>從老舊磁磚屋到質感現代建築，一場建築的重生旅程。</p>
          </div>
          <Image
            src="/images/blog/建築老屋/img01.png"
            alt="AI Example"
            width={1500}
            height={800}
            className="mt-4  w-full md:w-[80%]   rounded-lg"
          />
        </div>
      </div>
    ),
  },
  {
    category: "建築老屋",
    title: "老屋翻新-外觀拉皮",
    src: "/images/blog/建築老屋/img01.png",
    content: (
      <div className="">
        <div className="p-8 ">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-4">
              翻新35年老透天，打造現代俐落街景
            </h2>
            <p>從老舊磁磚屋到質感現代建築，一場建築的重生旅程。</p>
          </div>
          <Image
            src="/images/blog/建築老屋/img01.png"
            alt="AI Example"
            width={1500}
            height={800}
            className="mt-4  w-full md:w-[80%]   rounded-lg"
          />
        </div>
      </div>
    ),
  },
  {
    category: "建築老屋",
    title: "老屋翻新-外觀拉皮",
    src: "/images/blog/建築老屋/img01.png",
    content: (
      <div className="">
        <div className="p-8 ">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-4">
              翻新35年老透天，打造現代俐落街景
            </h2>
            <p>從老舊磁磚屋到質感現代建築，一場建築的重生旅程。</p>
          </div>
          <Image
            src="/images/blog/建築老屋/img01.png"
            alt="AI Example"
            width={1500}
            height={800}
            className="mt-4  w-full md:w-[80%]   rounded-lg"
          />
        </div>
      </div>
    ),
  },
];
