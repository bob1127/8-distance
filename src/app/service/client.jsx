"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { createPortal } from "react-dom";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCard";
import { ReactLenis } from "@studio-freight/react-lenis";
import Image from "next/image";
import Link from "next/link";
/** 只讓膠囊本身可點，其餘整層都讓事件穿透 */
function FixedSwitchPortal({ showSwitch, activeTab, onSwitch }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {showSwitch && (
        <motion.div
          key="switch"
          className="fixed z-[9999999] left-0 bottom-[6%] w-full pointer-events-none" // ← 讓整層穿透
          style={{ pointerEvents: "none" }} // ← 雙保險
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        >
          {/* 這層也保持穿透，避免寬度整條都擋住 */}
          <div
            className="relative w-full pointer-events-none"
            style={{ pointerEvents: "none" }}
          >
            {/* 只有膠囊本體可點擊 */}
            <div className="switch-bar max-w-[260px] bg-[#f5f5f7] mx-auto px-2 py-2 flex rounded-[30px] shadow-sm border border-black/5 pointer-events-auto">
              <div className="relative grid w-full grid-cols-2 gap-1">
                {[
                  { key: "service", label: "服務項目" },
                  { key: "charge", label: "收費標準" },
                ].map((t) => {
                  const isActive = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => onSwitch(t.key)}
                      className="relative z-10 inline-flex items-center justify-center h-10 rounded-[22px] font-medium"
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="seg-pill"
                            className="absolute inset-0 rounded-[22px] bg-orange-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <motion.span
                        className={`relative z-10 px-4 text-[15px] ${
                          isActive ? "text-orange-500" : "text-gray-800"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        {t.label}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function ServiceClient() {
  const serviceRef = useRef(null);
  const chargeRef = useRef(null);

  const [activeTab, setActiveTab] = useState("service");
  const [showSwitch, setShowSwitch] = useState(true);

  // 滾動方向：下隱上現
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 10;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const curr = window.scrollY;
        const delta = curr - lastY;
        if (Math.abs(delta) > THRESHOLD) {
          setShowSwitch(delta <= 0);
          lastY = curr;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 平滑滾動
  const scrollToRef = (ref) => {
    if (!ref?.current) return;
    setShowSwitch(true);
    const targetY =
      ref.current.getBoundingClientRect().top + window.scrollY - 80;
    animate(window.scrollY, targetY, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
  };

  const handleSwitch = (tab) => {
    setActiveTab(tab);
    scrollToRef(tab === "service" ? serviceRef : chargeRef);
  };

  return (
    <ReactLenis root>
      {/* 固定在視窗上的 Switch（Portal 到 body，且只讓膠囊可點） */}
      <FixedSwitchPortal
        showSwitch={showSwitch}
        activeTab={activeTab}
        onSwitch={handleSwitch}
      />

      <div className="relative">
        {/* Hero */}
        {/* <section className="section-hero pt-20">
          <div className="relative py-10">
            <SwiperCarousel />
            <div className="title absolute z-50 left-[10%] top-1/2">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#1A237E] via-[#7B1FA2] to-[#E91E63] bg-clip-text text-transparent">
                設計・規劃・實現
              </h1>
              <p className="text-[#1A237E] text-md font-bold">
                從設計靈感的誕生，到規劃每一個細節，
                <br />
                最終實現獨一無二、專屬於您的生活場景。
              </p>
            </div>
          </div>
        </section> */}
        <div className="xl:aspect-[16/7.5] aspect-[16/14] sm:aspect-[16/10] relative overflow-hidden">
          <div className="txt absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col justify-center items-center">
              {" "}
              <h2 className="text-white text-2xl">設計內容</h2>
              <Link href="/3d">
                <div className="border border-white rounded-[20px] w-[200px] py-2 text-center text-white">
                  INFO
                </div>
              </Link>
            </div>
          </div>
          <Image
            src="/images/7cf01af6-3902-4896-8049-90ebdb7df94c.png"
            fill
            className="w-full object-cover"
          ></Image>
        </div>
        {/* 服務項目（流程區） */}
        <section ref={serviceRef} className="section-process my-20">
          <div className="title flex justify-center items-center flex-col w-[90%] max-w-[1200px] mx-auto">
            <span className="text-[14px] text-gray-600">PROCESS</span>
            <h2 className="font-normal">設計流程</h2>
          </div>

          <div className="grid w-[90%] max-w-[1200px] mx-auto grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="item justify-center items-center flex my-5"
              >
                <div className="w-[100px] mx-3 h-[100px] flex items-center justify-center rounded-[22px]">
                  <svg
                    className="w-3/4 h-3/4 text-[#f64568]"
                    viewBox="0 0 200 200"
                    aria-hidden="true"
                    role="img"
                  >
                    <g
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    >
                      <path d="M0 0v200c55.228 0 100-44.772 100-100S55.228 0 0 0z"></path>
                      <path d="M100 100c0 55.228 44.772 100 100 100V0C144.772 0 100 44.772 100 100z"></path>
                    </g>
                  </svg>
                </div>

                <div className="txt w-2/3 p-5">
                  <b className="text-[18px]">STEP-0{i + 1}</b>
                  <p>初次溝通（面談與線上）</p>
                  <span className="text-[14px] tracking-wider text-gray-600 mt-2">
                    首先須了解業主之各項基本需求、喜好及現況條件，並解說整體的完整作業流程。
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 收費標準 */}
        <section ref={chargeRef} className="section-charge my-20">
          <div className="title flex justify-center items-center flex-col max-w-[1200px] mx-auto">
            <span className="text-[14px] text-gray-600">CHARGE</span>
            <h2 className="font-normal">收費標準</h2>
          </div>

          <div className="grid max-w-[1200px] mx-auto grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="item justify-center items-center flex my-5"
              >
                <div className="w-[100px] mx-3 h-[100px] flex items-center justify-center rounded-[22px]">
                  <svg
                    className="w-48 h-48 text-rose-500"
                    viewBox="10 10 180 180"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="currentColor">
                      <path d="M130 40c0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30z"></path>
                      <path d="M130 160c0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30z"></path>
                      <path d="M160 70c-7.7 0-14.8 2.9-20.1 7.7-42.2 30.2-79.9 0-79.9 0-5.2-4.8-12.3-7.7-20-7.7-16.6 0-30 13.4-30 30s13.4 30 30 30c7.4 0 14.1-2.7 19.3-7 41.3-26.5 80.6-.7 80.6-.7 5.3 4.8 12.4 7.7 20.1 7.7 16.6 0 30-13.4 30-30s-13.4-30-30-30z"></path>
                    </g>
                  </svg>
                </div>

                <div className="txt w-2/3 p-5">
                  <b className="text-[18px]">STEP-0{i + 1}</b>
                  <p>初次溝通（面談與線上）</p>
                  <span className="text-[14px] tracking-wider text-gray-600 mt-2">
                    首先須了解業主之各項基本需求、喜好及現況條件，並解說整體的完整作業流程。
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
