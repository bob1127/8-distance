"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import AnimatedHeading from "@/components/AnimatedHeading";
import {
  LazyMotion,
  domMax,
  motion,
  MotionConfig,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { refreshJustFontDelayed } from "@/lib/justfont";

/* === 動畫設定 === */
const spring = { type: "spring", stiffness: 70, damping: 22, mass: 0.9 };
const cardVariants = {
  hidden: { opacity: 0, y: 96, filter: "blur(10px)", scale: 0.985 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { ...spring, delay },
  }),
};

const listVariants = (reduce) => ({
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      staggerChildren: reduce ? 0 : 0.06,
      delayChildren: reduce ? 0 : 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

/* ====== 偏好減少動態 ====== */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: coarse)").matches;

/* === 單一卡片動畫化 === */
function BlogCard({ item, index, formatWan }) {
  const delay = (index % 6) * 0.06;

  // 欄位存在性判斷
  const hasLocation =
    (item.city && String(item.city).trim()) ||
    (item.district && String(item.district).trim());

  const hasBudget =
    item.budgetWan !== null &&
    item.budgetWan !== undefined &&
    !Number.isNaN(item.budgetWan);

  const hasArea =
    item.areaPing !== null &&
    item.areaPing !== undefined &&
    !Number.isNaN(item.areaPing);

  const hasTypeStyle =
    (item.type && String(item.type).trim()) ||
    (item.style && String(item.style).trim());

  return (
    <motion.a
      href={item.link}
      className="block will-change-transform"
      style={{ transform: "translateZ(0)" }}
      variants={cardVariants}
      custom={delay}
    >
      <div className="item overflow-hidden relative group transition-all duration-300">
        <div className="img mx-5 overflow-hidden mt-2 relative aspect-[3/3.5]">
          <Image
            src={item.image}
            alt={item.imageAlt || item.title}
            title={item.imageTitle || item.imageAlt || item.title}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw)"
            priority={false}
          />
        </div>
        <div className="px-6 pt-6 pb-7 flex flex-col gap-2 ">
          <h2 className="text-[18px] font-medium line-clamp-2">{item.title}</h2>

          {item.description && (
            <p
              className="
                hidden
                md:block md:text-[14px] md:text-gray-700
                md:overflow-hidden
                md:max-h-0 md:opacity-0
                md:group-hover:max-h-40 md:group-hover:opacity-100
                md:transition-all md:duration-300 md:ease-out
              "
            >
              {item.description}
            </p>
          )}

          {(hasLocation || hasBudget || hasArea || hasTypeStyle) && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-gray-600">
              {hasLocation && (
                <div>
                  <b className="tracking-widest mr-1">地點</b>
                  {item.city || ""} {item.district || ""}
                </div>
              )}
              {hasBudget && (
                <div>
                  <b className="tracking-widest mr-1">預算</b>
                  {formatWan(item.budgetWan)}
                </div>
              )}
              {hasArea && (
                <div>
                  <b className="tracking-widest mr-1">坪數</b>
                  {item.areaPing} 坪
                </div>
              )}
              {hasTypeStyle && (
                <div>
                  <b className="tracking-widest mr-1">類型</b>
                  {item.type || ""} {item.type && item.style ? "／" : ""}
                  {item.style || ""}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}

/* === 主元件 === */
export default function BlogListClient({ items = [], banner = null }) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(1);

  useEffect(() => {
    refreshJustFontDelayed([0, 400, 1200, 2500, 4000]);
  }, []);

  useEffect(() => {
    refreshJustFontDelayed([0, 400, 1200]);
  }, [page]);

  // Lenis 滾動控制
  useEffect(() => {
    const unlock = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
    unlock();
    return unlock;
  }, []);

  const lenisRef = useRef(null);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      prefersReducedMotion() ||
      isCoarsePointer()
    )
      return;
    let stopped = false;
    let rafId = 0;
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.12,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;
    const raf = (t) => {
      if (stopped) return;
      lenis.raf(t);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);
    return () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      try {
        lenis.destroy();
      } catch {}
      lenisRef.current = null;
    };
  }, []);

  // 處理 items
  const cases = useMemo(() => {
    const numOrNull = (v) => {
      if (v === null || v === undefined) return null;
      if (typeof v === "string" && v.trim() === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    return (Array.isArray(items) ? items : []).map((x, i) => ({
      ...x,
      title: x.title ?? "未命名文章",
      description: x.description ?? "",
      city: x.city ?? "",
      district: x.district ?? "",
      budgetWan: numOrNull(x.budgetWan),
      areaPing: numOrNull(x.areaPing),
      type: x.type ?? "",
      style: x.style ?? "",
      date: x.date ?? "",
      image: x.image || "/images/placeholder.jpg",
      imageAlt: x.imageAlt ?? x.title ?? "",
      imageTitle: x.imageTitle ?? "",
      link: x.link ?? "#",
      id: x.id ?? i,
    }));
  }, [items]);

  const formatWan = (n) =>
    n == null
      ? "—"
      : new Intl.NumberFormat("zh-TW").format(Number(n || 0)) + " 萬";

  const PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(cases.length / PER_PAGE));
  const pageSafe = Math.max(1, Math.min(totalPages, page));
  const start = (pageSafe - 1) * PER_PAGE;
  const pageItems = cases.slice(start, start + PER_PAGE);

  // 點擊頁碼後回到頂部
  const listRef = useRef(null);
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /**
   * 1. 電腦版分頁邏輯 (Desktop)
   * 顯示完整邏輯：首頁 ... 前頁 當前 後頁 ... 末頁
   */
  const getDesktopPagination = () => {
    const items = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (pageSafe <= 4) {
        for (let i = 1; i <= 5; i++) items.push(i);
        items.push("...");
        items.push(totalPages);
      } else if (pageSafe >= totalPages - 3) {
        items.push(1);
        items.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) items.push(i);
      } else {
        items.push(1);
        items.push("...");
        items.push(pageSafe - 1);
        items.push(pageSafe);
        items.push(pageSafe + 1);
        items.push("...");
        items.push(totalPages);
      }
    }
    return items;
  };

  /**
   * 2. 手機版分頁邏輯 (Mobile)
   * 緊湊模式：只顯示最多 5 個頁碼，以當前頁為中心滑動
   * 例如：[3] 4 5 6 7
   */
  const getMobilePagination = () => {
    // 如果總頁數少，直接全部顯示
    if (totalPages <= 5) {
      const items = [];
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    // 計算顯示範圍 (保證顯示 5 個)
    let start = Math.max(1, pageSafe - 2);
    let end = Math.min(totalPages, start + 4);

    // 如果靠近末端，往回補齊 5 個
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const items = [];
    for (let i = start; i <= end; i++) items.push(i);
    return items;
  };

  return (
    <LazyMotion features={domMax}>
      <MotionConfig transition={spring} reducedMotion="user">
        <div className="blog-list-page bg-[#f6f6f7] w-full overflow-visible">
          {/* Banner */}
          <section>
            <div className="overflow-hidden relative h-[97vh]">
              <Image
                src={banner?.imageUrl || "/images/img02.png"}
                alt={banner?.imageAlt || ""}
                title={banner?.imageTitle || ""}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </section>

          {/* 標題 */}
          <section className="flex justify-center py-8">
            <MotionConfig reducedMotion="never">
              <AnimatedHeading
                text="設計靈感"
                lineColor="#2b3742"
                lineLength={120}
                lineThickness={1}
                yOffsetEm={0.08}
                duration={1.0}
                delay={3.2}
                firstVisitDelay={0}
                startDelay={0}
                resetOnExit={true}
              />
            </MotionConfig>
          </section>

          {/* 清單 */}
          <section
            ref={listRef}
            className="pb-20 max-w-[1920px] w-[97%] mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pageSafe}
                className="blog-grid grid pl-0 lg:pr-6 2XL:pr-10 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4"
                variants={listVariants(reduce)}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
              {pageItems.map((item, i) => (
                <BlogCard
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  formatWan={formatWan}
                />
              ))}
              </motion.div>
            </AnimatePresence>

            {/* 🔥 分頁功能區域 */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 md:gap-3 select-none">
                {/* 上一頁按鈕 */}
                <button
                  disabled={pageSafe <= 1}
                  onClick={() => handlePageChange(Math.max(1, pageSafe - 1))}
                  className="w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-2 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-gray-700 transition-colors"
                  aria-label="上一頁"
                >
                  <svg
                    className="w-4 h-4 md:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden md:inline">上一頁</span>
                </button>

                {/* --- 手機版頁碼 (md:hidden) --- */}
                <div className="flex md:hidden items-center gap-1">
                  {getMobilePagination().map((item) => (
                    <button
                      key={`mobile-p-${item}`}
                      onClick={() => handlePageChange(item)}
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                        ${
                          pageSafe === item
                            ? "bg-[#2b3742] text-white shadow-sm"
                            : "bg-transparent text-gray-600 hover:bg-black/5"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* --- 電腦版頁碼 (hidden md:flex) --- */}
                <div className="hidden md:flex items-center gap-1.5">
                  {getDesktopPagination().map((item, idx) => {
                    if (item === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="px-1 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`
                          min-w-[36px] h-[36px] flex items-center justify-center rounded-lg text-sm border transition-all
                          ${
                            pageSafe === item
                              ? "bg-[#2b3742] text-white border-[#2b3742]"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }
                        `}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                {/* 下一頁按鈕 */}
                <button
                  disabled={pageSafe >= totalPages}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, pageSafe + 1))
                  }
                  className="w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-2 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-gray-700 transition-colors"
                  aria-label="下一頁"
                >
                  <svg
                    className="w-4 h-4 md:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="hidden md:inline">下一頁</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
