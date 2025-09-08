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

  // 主畫廊圖片
  const galleryImages = [
    { src: "/images/project-01/img06.jpg", alt: "" },
    { src: "/images/project-01/img08.jpg", alt: "" },
    {
      src: "/images/project-01/img05.jpg",
      alt: "和風の木格子を使ったカフェ空間",
    },
    { src: "/images/project-01/img04.jpg", alt: "" },
    { src: "/images/project-01/img01.jpg", alt: "" },
    { src: "/images/project-01/img03.jpg", alt: "" },
    // 也可把側欄圖片加進來，確保 openGalleryAt 都能找到
  ];

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const openGalleryAt = (src) => {
    const idx = galleryImages.findIndex((p) => p.src === src);
    setGalleryStartIndex(Math.max(0, idx));
    setGalleryOpen(true);
  };

  // HERO 旋轉背景
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

  // ✅ 側邊欄資料（可自行替換圖片與文字）
  const sidebarCases = [
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
    {
      title: "總太東方",
      subtitle: "Modern Oriental",
      src: "/images/index/老屋翻新-李宅.webp",
      href: "/project/renovation-li", // ← 你的內頁路徑
    },
  ];

  return (
    <>
      <div className="bg-[#f1f1f1] overflow-hidden">
        <section className="relative pt-[150px] pb-[100px]">
          {/* 背景圖 */}
          <div className="absolute inset-0">
            <Image
              src="/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif"
              alt="背景圖"
              fill
              priority={false}
              className="object-cover"
            />
            {/* 可選：加一層遮罩提升可讀性 */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* 內容 */}
          <div className="relative z-10">
            <div className="title py-20 flex justify-center text-2xl text-white">
              心域之所 - 三房兩廳現代輕暖境域 台中磐鈺晰晰裏山
            </div>
          </div>
        </section>

        {/* ====== Info 條塊（照你上一版） ====== */}
        <section className="info bg-[#f4ede9]">
          <div className="w-[95%] max-w-[1200px] mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-5 text-gray-800">
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  作品名稱
                </div>
                <div className="mt-1 text-[18px] leading-none">心域之所</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  風格
                </div>
                <div className="mt-1 text-[18px] leading-none">現代風格</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  原況格局
                </div>
                <div className="mt-1 text-[18px] leading-none">—</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  所在地區
                </div>
                <div className="mt-1 text-[18px] leading-none">中部</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  格局
                </div>
                <div className="mt-1 text-[18px] leading-none">三房兩廳</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  空間性質
                </div>
                <div className="mt-1 text-[18px] leading-none">作品集</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  建設公司
                </div>
                <div className="mt-1 text-[18px] leading-none">堃鉦建設</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  坪數
                </div>
                <div className="mt-1 text-[18px] leading-none">20</div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-[13px] tracking-widest text-gray-500">
                  色系方案
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ background: "#EEE3D3" }}
                  />
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ background: "#F6EFE7" }}
                  />
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ background: "#6B4A3A" }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-700/60" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
              <div>
                <div className="text-[13px] tracking-widest text-gray-500 mb-3">
                  簡介
                </div>
                <p className="whitespace-pre-line leading-8 text-gray-800/90">
                  漫走於世界地圖每個角落的流光婉轉，
                  將對世界的初心融入居家美學， 賦予這個家獨一無二的故事與靈魂。
                </p>
              </div>
              <div>
                <div className="text-[13px] tracking-widest text-gray-500 mb-3">
                  得獎紀錄
                </div>
                <ul className="space-y-2 text-gray-800/90">
                  {/* 留白或填入清單 */}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ====== 主卡片區 + Sticky 側邊欄 ====== */}
        <section className="section-grid-item mt-[10vh] px-4 py-8">
          {/* xl 以上變 4 欄：前三欄維持原布局，右側多一欄作為 sticky 側邊欄 */}
          <div className="max-w-[1920px] w-[98%] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {/* LEFT */}
            <div className="h-full gap-4 flex flex-col xl:col-span-1">
              {/* 卡片 A */}
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
                <div className="relative w-full h-full min-h-[600px]">
                  <Image
                    src="/images/project-01/img06.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>

              {/* 卡片 B */}
              <div
                className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                onClick={() => openGalleryAt("/images/project-01/img08.jpg")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openGalleryAt("/images/project-01/img08.jpg")
                }
              >
                <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="relative w-full h-full min-h-[600px]">
                  <Image
                    src="/images/project-01/img08.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="flex flex-col gap-4 xl:col-span-1">
              <div
                className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                onClick={() => openGalleryAt("/images/project-01/img05.jpg")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openGalleryAt("/images/project-01/img05.jpg")
                }
              >
                <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="relative w-full h-full min-h-[360px]">
                  <Image
                    src="/images/project-01/img05.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>
              <div
                className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                onClick={() => openGalleryAt("/images/project-01/img04.jpg")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openGalleryAt("/images/project-01/img04.jpg")
                }
              >
                <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="relative w-full h-full min-h-[600px]">
                  <Image
                    src="/images/project-01/img04.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT（原第三欄） */}
            <div className="h-full xl:col-span-1">
              <div
                className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                onClick={() => openGalleryAt("/images/project-01/img01.jpg")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openGalleryAt("/images/project-01/img01.jpg")
                }
              >
                <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="relative w-full h-full min-h-[760px]">
                  <Image
                    src="/images/project-01/img01.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>
              <div
                className="card-item group hover:shadow-xl w-full border relative overflow-hidden cursor-zoom-in"
                onClick={() => openGalleryAt("/images/project-01/img03.jpg")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  openGalleryAt("/images/project-01/img03.jpg")
                }
              >
                <div className="mask pointer-events-none z-10 opacity-20 absolute inset-0 bg-black group-hover:opacity-50 duration-500" />
                <div className="relative w-full h-full min-h-[460px]">
                  <Image
                    src="/images/project-01/img03.jpg"
                    alt="card-img"
                    fill
                    className="object-cover group-hover:scale-110 duration-700"
                  />
                </div>
              </div>
            </div>

            {/* ✅ NEW：Sticky 側邊欄（第 4 欄） */}
            {/* ✅ NEW：Sticky 側邊欄（第 4 欄；md 起就會出現） */}
            {/* ✅ NEW：Sticky 側邊欄（第 4 欄；md 起就會出現） */}
            <aside className="md:col-span-1 h-full xl:col-span-1">
              <div className="sticky top-24">
                <div className="h-screen overflow-y-auto pr-2 space-y-4">
                  {sidebarCases.map((c) => {
                    const href = c.href ?? "#";
                    return (
                      <Link key={c.src} href={href}>
                        {/* 改小：固定高度 or 比例 */}
                        <div className="relative w-full mb-5 h-[400px] overflow-hidden ">
                          {/* 置中文字 */}
                          <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-3 pointer-events-none">
                            <div className="max-w-[90%]">
                              <h4 className="text-white text-base md:text-lg font-semibold leading-tight">
                                {c.title}
                              </h4>
                              {c.subtitle && (
                                <p className="text-white/90 text-xs md:text-sm mt-1">
                                  {c.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* 遮罩 */}
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.25)] to-transparent" />
                          {/* 圖片 */}
                          <Image
                            src={c.src}
                            alt={c.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-[1.05]"
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
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
    </>
  );
};

export default Photos;

/* ====== Optional: Demo 區塊（若不需要可刪） ====== */
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
