"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const heroImgRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef([]);
  const videoFramesRef = useRef({ frame: 0 });
  const lenisRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  // QA 內容（自行替換）
  const qaItems = [
    {
      q: "你們提供哪些設計服務？",
      a: "住宅、商業空間、老屋翻新、室內軟裝與工程統籌等整體規劃，亦可依需求客製化。",
    },
    {
      q: "諮詢流程怎麼進行？",
      a: "初步諮詢→現勘/丈量→提案與估價→簽約→細部設計→工程執行→完工交付；期間有任何問題都可隨時聯繫窗口。",
    },
    {
      q: "工期通常需要多久？",
      a: "視案件規模而定，平均 6~12 週。老屋翻新與特殊工法會較長，我們會提供甘特圖與里程碑追蹤。",
    },
    {
      q: "預算可以彈性調整嗎？",
      a: "可以。我們會就需求與材質等級提供多組方案，並清楚列出增減項目與對應費用。",
    },
  ];

  return (
    <div>
      <section className="flex flex-row py-[150px]">
        {/* 左側：QA Accordion */}
        <div className=" max-w-[1300px] mx-auto xl:w-[80%] md:w-[90%] px-6 w-full">
          <div className="title w-full flex justify-start ">
            <h1 className=" text-3xl md:tetx-4xl xl:text-7xl">常見問題</h1>
          </div>
          <div className=" w-full flex flex-row ">
            <QAAccordion items={qaItems} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===================== Components ===================== */

function QAAccordion({ items }) {
  return (
    <div className="mx-auto w-full ">
      {/* 下底線風格：使用 divide-y */}
      <div className="divide-y divide-neutral-300/80">
        {items.map((it, i) => (
          <QAItem key={i} index={i} q={it.q} a={it.a} />
        ))}
      </div>
    </div>
  );
}

function QAItem({ index, q, a }) {
  const [open, setOpen] = useState(false);
  const contentId = `qa-content-${index}`;

  const transition = {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1], // 柔順
  };

  return (
    <div className="group">
      {/* 標題列（下底線由外層 divide-y 提供） */}
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left focus:outline-none"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 className="pr-6 text-[17px] leading-6 font-medium text-neutral-900 group-hover:text-neutral-700">
          {q}
        </h3>

        {/* + / − 圖示 */}
        <span className="ml-4 inline-flex h-5 w-5 items-center justify-center relative">
          {/* 橫線 */}
          <span className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-neutral-900" />
          {/* 直線（展開時縮成 0） */}
          <motion.span
            className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-neutral-900"
            animate={{ scaleY: open ? 0 : 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </button>

      {/* 內容：Framer Motion 平滑收折 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: transition, opacity: { duration: 0.25 } }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-6 text-[15px] leading-relaxed text-neutral-600">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
