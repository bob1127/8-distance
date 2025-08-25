"use client";

import GsapText from "../../components/RevealText/index";
import ThreeJs from "../../components/ThreeSlider/index";
import { projects } from "../../components/ParallaxCard/data";
import { TextGenerateEffect } from "../../components/ui/text-generate-effec-home";
import ScrollCard from "../../components/ParallaxCard/page";
import { Card, CardBody } from "@nextui-org/react";

import { useScroll, AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
      {/* HERO */}
      <section className="section-hero py-20">
        <Image
          src="/images/awards-logo.png"
          alt="award-icon"
          placeholder="empty"
          loading="lazy"
          width={700}
          height={700}
          className="max-w-[350px] mx-auto"
        />
        <div className="description flex flex-col max-w-[600px] mx-auto">
          <p className="tracking-wider leading-relaxed text-center">
            法國設計獎
          </p>
          <h1 className="text-rose-500 text-[20px] text-center">Gold.Winner</h1>
          <p className="tracking-wider leading-relaxed text-center">
            榮獲國際大獎的肯定
          </p>
        </div>
        <Marquee>
          <div>
            <div className="text-[70px] flex justify-center items-center font-bold ">
              榮獲國際大獎的肯定{" "}
              <Image
                src="/images/awards-logo.png"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              />
              法國設計獎{" "}
              <Image
                src="/images/awards-logo.png"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              />
              Gold.Winner
            </div>
          </div>
        </Marquee>
      </section>

      {/* Parallax 區 */}
      <main ref={container} className="relative">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <ScrollCard
              total={projects.length}
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>

      {/* 文字 + 圖 */}
      <section className="section-award-item max-w-[1920px] mx-auto w-[80%]">
        <div className="flex py-[10vh] flex-col lg:flex-row">
          <div className="w-1/2 items-center flex justify-center">
            <div className="w-full">
              <Image
                src="/images/捌程-2024法國設計獎電子證書-員林胡宅.png"
                placeholder="empty"
                loading="lazy"
                className="w-[90%]"
                alt=""
                width={500}
                height={800}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="description max-w-[600px] p-10">
              <TextGenerateEffect words={"榮獲國際大獎的肯定\n"} />
              <br />
              <p className="text-[.9rem] tracking-widest">
                能夠榮獲國際大獎的肯定，對我們而言意義非凡。這份榮耀凝聚了團隊成員們的心血與智慧，是大家攜手努力的成果。這份肯定更是驅動我們不斷向前的動力，期許未來能持續精進設計，為大家帶來更多卓越的作品！特別感謝我們的業主，您們的信任與支持是我們最大的力量。每一次的交流與啟發，都成為我們克服挑戰、實現創意的寶貴泉源。謝謝您們與我們一同成就這份殊榮。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 其他專案：點擊打開 Popup（fixed + 上一/下一張） */}
      <section className="section-others-project mb-20 w-full">
        <Swiper
          modules={[Pagination, A11y, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
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
              className="mx-2 overflow-hidden group relative duration-1000 cursor-pointer"
              onClick={() => openPopupAt(idx)}
            >
              <div className="title absolute top-5 left-5 z-[2]">
                <span className="text-white text-[.9rem]">{slide.title}</span>
              </div>

              <div className="title absolute bottom-5 flex right-5 z-[2] pointer-events-none">
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

              <div className="absolute z-[1] w-full h-full inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out" />

              <Card
                className="border-white !rounded-[0px] pb-4 w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px] border relative bg-no-repeat bg-center bg-cover shadow-none overflow-hidden transition-transform duration-1000 ease-in-out group-hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <CardBody className="flex relative flex-col h-full w-full px-0" />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ======= 固定定位 Popup（支援上一/下一張、滑動、鍵盤） ======= */}
      <AnimatePresence>
        {popupOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.button
              aria-label="Close "
              onClick={closePopup}
              className="!fixed inset-0 z-[1000] bg-black/65 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />

            {/* Popup 容器：固定置中 */}
            <motion.div
              className="!fixed inset-0 z-[1001] flex items-center justify-center p-3 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-modal="true"
              role="dialog"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <motion.div
                className="relative w-full max-w-5xl"
                initial={{ scale: 0.92, y: 12, filter: "blur(6px)" }}
                animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ scale: 0.96, y: 8, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
              >
                {/* 關閉按鈕 */}
                <button
                  onClick={closePopup}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-[1003] 
                       inline-flex h-10 w-10 items-center justify-center rounded-full 
                       bg-white/95 text-black shadow-lg border border-black/10 
                       hover:scale-105 active:scale-95 transition"
                  aria-label="Close image"
                >
                  ✕
                </button>

                {/* 左右切換按鈕 */}
                <button
                  onClick={prev}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-[1003] 
                       h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 text-black 
                       shadow-md border border-black/10 hover:bg-white active:scale-95 transition"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-[1003] 
                       h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 text-black 
                       shadow-md border border-black/10 hover:bg-white active:scale-95 transition"
                  aria-label="Next"
                >
                  →
                </button>

                {/* 標題 + 計數 */}
                <div className="mb-2 text-center text-white/90 text-sm sm:text-base z-[1002] relative">
                  {staticSlides[activeIndex]?.title} ・ {activeIndex + 1}/
                  {staticSlides.length}
                </div>

                {/* 圖片容器：限制高度避免超出螢幕 */}
                <div className="relative w-full rounded-xl bg-black/30 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={staticSlides[activeIndex]?.image}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="relative w-full max-h-[90vh]"
                    >
                      <Image
                        src={staticSlides[activeIndex]?.image || ""}
                        alt={staticSlides[activeIndex]?.title || "preview"}
                        width={1600}
                        height={900}
                        className="w-auto max-w-full max-h-[90vh] object-contain mx-auto"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
