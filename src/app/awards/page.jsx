"use client";

import GsapText from "../../components/RevealText/index";
import ThreeJs from "../../components/ThreeSlider/index";
import { projects } from "../../components/ParallaxCard/data";
import { TextGenerateEffect } from "../../components/ui/text-generate-effec-home";
import ScrollCard from "../../components/ParallaxCard/page";
import { Card, CardBody } from "@nextui-org/react";
import AwardsLightbox from "../../components/AwardsLightbox";
import { useScroll, AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Lenis smooth scroll（含清理）
  useEffect(() => {
    const lenis = new Lenis();
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const staticSlides = [
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400141.jpg",
      link: "/project/small-budget",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400165.jpg",
      link: "/project/commercial-space",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400219.jpg",
      link: "/project/renovation",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400237.jpg",
      link: "/project/nordic-style",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400300.jpg",
      link: "/project/luxury-modern",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400347.jpg",
      link: "/project/luxury-modern",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400428.jpg",
      link: "/project/luxury-modern",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400432.jpg",
      link: "/project/luxury-modern",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400453.jpg",
      link: "/project/luxury-modern",
    },
    {
      title: "員林胡宅獎盃",
      image: "/images/員林胡宅獎盃/A7400462.jpg",
      link: "/project/luxury-modern",
    },
  ];

  // ===== Popup 狀態（支援上一張/下一張） =====
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPopupAt = useCallback((idx) => {
    setActiveIndex(idx);
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + staticSlides.length) % staticSlides.length);
  }, [staticSlides.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % staticSlides.length);
  }, [staticSlides.length]);

  // 鎖滾動 + ESC/左右方向鍵
  useEffect(() => {
    if (!popupOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closePopup();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [popupOpen, closePopup, prev, next]);

  // 觸控滑動（左/右）
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchEndX.current - touchStartX.current;
    const threshold = 40; // 滑動觸發距離
    if (delta > threshold) {
      // 往右滑 → 前一張
      prev();
    } else if (delta < -threshold) {
      // 往左滑 → 下一張
      next();
    }
  };

  return (
    <>
      <section
        className="flex flex-row justify-center items-center py-10 pt-[150px] bg-gradient-to-r from-[#E4C887] via-[#D9C7A3] to-[#BFAF9B]
 to-[#F5E6C5]"
      >
        <div className="title text-center px-4">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-wide">
            得獎捷報｜德國 iF 設計大獎 2025 Winner
          </h1>
          <span>最新消息</span>
        </div>
      </section>
      <section className="max-w-[1300px]  px-6 mx-auto py-10">
        <div className="info sm:w-[90%] w-full xl:w-[80%] mx-auto border-l-3 border-black pl-3 sm:pl-5">
          <p className="leading-loose tracking-wider">
            GOOD DESIGN AWARD
            日本設計大賞，背後其實有著不為人知的「盗版」設計歷史淵源！第二次世界大戰之後，日本製造業為快速奮起振翅，大量參考使用歐美的設計理念、模仿各式各樣的規則產品，涵蓋交通工具乃至品牌識別，而此行為在戰後剛開始的出口蓬果中也是受到國際與社會抨擊。
          </p>
          <p className="leading-loose tracking-wider">
            此大賞創始於 1957
            年，為了啟發原創設計和讓人們了解「設計」這個概念能夠帶給社會的力量和效應。由日本通商產業省（簡稱通產省）以「優良設計商品選定製度（Good
            Design Selection System，俗稱G
            Mark制度）」評選出各領域的設計佳作，持續協助通設計讓人們的生活、社會變得更加美好。
          </p>
        </div>
        <div className="design-img flex justify-center mt-8">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLnfdRcSlLiJlYda6-xhiy5e3t2nQPXrKM5w&s"
            priority
            className="max-w-[600px]"
            width={1000}
            height={400}
          ></Image>
        </div>
      </section>
      <section className="overflow-hidden px-6">
        <div className="grid grid-cols-1 max-w-[1920px] mx-auto awrads-image">
          <div className="awards-item w-full overflow-hidden aspect-[16/9] relative">
            <AwardsLightbox
              base="/images/員林胡宅獎盃/"
              thumb="A7400023.jpg"
              startIndex={0}
            />
          </div>
        </div>
      </section>
      <section
        className="section-awards-info py-10 md:py-16"
        aria-labelledby="award-title"
      >
        <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          {/* 1欄 → 2欄 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* 圖片 */}
            <figure className="w-full">
              <div className="relative mx-auto w-full max-w-[720px]">
                <Image
                  src="/images/捌程-2024法國設計獎電子證書-員林胡宅.png"
                  alt="2024 法國設計獎電子證書｜員林胡宅"
                  width={1600}
                  height={1000}
                  priority
                  className="w-full h-auto rounded-xl shadow-md ring-1 ring-black/5"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
                />
              </div>
              {/* 可選：圖片說明 */}
              {/* <figcaption className="mt-3 text-sm text-gray-500 text-center">2024 法國設計獎 電子證書</figcaption> */}
            </figure>

            {/* 文字資訊 */}
            <div className="flex flex-col items-start md:items-center justify-center">
              <h1 id="award-title" className="sr-only">
                得獎資訊
              </h1>

              {/* 使用語意化 dl 列出欄位 */}
              <dl className="w-full space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:gap-3">
                  <dt className="text-xl md:text-2xl font-semibold text-gray-900">
                    得獎作品：
                  </dt>
                  <dd className="text-lg md:text-xl text-gray-700 mt-1 sm:mt-0">
                    員林胡宅
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-center  sm:gap-3">
                  <dt className="text-xl md:text-2xl font-semibold text-gray-900">
                    設計師：
                  </dt>
                  <dd className="text-lg md:text-xl text-gray-700 mt-1 sm:mt-0">
                    Jen
                  </dd>
                </div>
              </dl>

              {/* 按鈕群組：小螢幕自動換行，桌機橫排 */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/portfolio-inner"
                  className="inline-flex items-center justify-center rounded-md bg-[#dea155] px-4 py-2 text-white text-base md:text-lg font-medium shadow-sm hover:brightness-105 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dea155]/40"
                >
                  獲獎連結
                </Link>
                <Link
                  href="/note"
                  className="inline-flex items-center justify-center rounded-md bg-[#dea155] px-4 py-2 text-white text-base md:text-lg font-medium shadow-sm hover:brightness-105 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dea155]/40"
                >
                  更多作品
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 最新動態 */}
      <section className="section-others-project mb-10 overflow-hidden px-4 sm:px-0 w-full">
        <div className="title flex justify-start max-w-[1920px] sm:w-[90%] w-full px-6 mx-auto lg:w-[80%]">
          <h2 className="text-2xl">相關文章</h2>
        </div>

        <Swiper
          modules={[Pagination, A11y, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          speed={1200}
          spaceBetween={16}
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
          <Link href="#">
            {staticSlides.map((slide, idx) => (
              <SwiperSlide
                key={idx}
                className="overflow-hidden relative duration-700 p-8"
              >
                <div className="overflow-hidden">
                  <Card
                    className="border-white !rounded-[0px] pb-4 w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px] border bg-no-repeat bg-center bg-cover shadow-none transition-transform duration-700"
                    style={{
                      backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPgbDskuTRRNHXb9zwmbzpjucaZzGWawpHdg&s')`,
                    }}
                  />
                  <div className="py-8">
                    <h3 className="text-base md:text-lg font-medium text-neutral-900 line-clamp-2">
                      得獎捷報 ｜ 德國iF設計大獎2025 Winner
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <p>2025-02-26</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Link>

          <div className="custom-pagination flex justify-center gap-3 mt-6"></div>
        </Swiper>
      </section>
    </>
  );
}
