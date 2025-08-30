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
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCard";
import FacebookReelsSection from "@/components/FacebookReelsSection";

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
    "/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif",
    "/images/index/b69ff1_2e8beb67f7c64ad9aaab0271e8d9a385~mv2.jpg.avif",
    "/images/index/b69ff1_dbf0d0c42626415881135b9768235d8f~mv2.jpg.avif",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  return (
    <ReactLenis root>
      <div className="bg-[#f1f1f1]">
        {/* ====== Hero 區（原樣保留） ====== */}
        <section className="section-hero relative mt-[28vh] h-[70vh]">
          <div className="white-section border rounded-tr-[60px] bg-[#ffc59c] absolute top-[-90px] left-0 w-[88%] h-full "></div>

          <section className="section-hero w-full aspect-[500/500] relative  h-full md:aspect-[1024/576] xl:aspect-[1920/700] color-section">
            {/* 旋轉徽章 */}
            <div className="absolute z-40 left-1/2 bottom-[-110px]  w-[200px] h-[200px] flex items-center justify-center transform -translate-x-1/2">
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
                      設計靈感 • 空間美學 • 設計靈感 • 美好生活 • 空間美學 •
                      設計靈感
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="circle bg-[#ffc59c]  text-white text-md w-[100px] h-[100px] flex justify-center items-center text-[1.2rem] font-bold rounded-full ">
                design
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
            <div className="bg-black opacity-10 w-full h-full absolute top-0 left-0 z-10" />
            <div className="hero-title w-1/2 absolute left-[4%] top-[90%] z-20">
              <div className="text-center px-4">
                <GsapText
                  text="作品展示"
                  id="gsap-intro"
                  fontSize="2rem"
                  fontWeight="200"
                  color="#fff"
                  lineHeight="60px"
                  className="text-center tracking-widest !text-white inline-block mb-0 h-auto"
                />
              </div>
              <div className="text-center px-4">
                <GsapText
                  text="PORTFOLIO"
                  id="gsap-intro"
                  fontSize="1rem"
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
        <section className="flex pl-20 flex-col py-[140px] bg-custom-gradient">
          <div className="flex flex-col  justify-center items-center">
            <h3 className="text-4xl text-white">對我們作品有興趣嗎？</h3>
            <button className="bg-[#f7a438] mt-3 text-stone-800 rounded-[30px] font-bold px-4 border border-gray-300 py-1">
              協助貸款
            </button>

            <input
              type="text"
              placeholder="歡迎聯繫我們"
              className="rounded-[40px] py-2 w-[800px] mt-10 px-5"
            />
          </div>
          <div className="FB-reels mt-10 flex">
            <div className="w-[10%]  flex items-center justify-end">
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
              <SwiperCarousel />
              <div className="pt-8">
                <span className="text-[.85rem] text-gray-400">
                  界裡還有許多充滿趣味的店舗設計想法。使用海外材料和個性化的色彩設計的空間中，充滿了商店設計的靈感。
                  <br />
                  我們可以以輕鬆旅行的心情，去發現新的設計。
                </span>
              </div>
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
