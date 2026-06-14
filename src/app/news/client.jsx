"use client";

import AnimatedHeading from "@/components/AnimatedHeading";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";

const PAGE_SIZE = 6;
const spring = { type: "spring", stiffness: 70, damping: 22, mass: 0.9 };

// ✅ 讓 Link 可以被 framer-motion 動畫化
const MotionLink = motion(Link);

/* ======= 列表群組動畫 ======= */
const listVariants = (reduce) => ({
  hidden: { opacity: 0, y: 60, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      staggerChildren: reduce ? 0 : 0.085,
      delayChildren: reduce ? 0 : 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

/* ======= 單一卡片動畫 ======= */
const cardVariants = {
  hidden: { opacity: 0, y: 72, filter: "blur(12px)", scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { ...spring, duration: 0.9 },
  },
  exit: {
    opacity: 0,
    y: 64,
    filter: "blur(6px)",
    scale: 0.985,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ======= 連結產生邏輯 ======= */
const buildNewsHref = (n) => {
  const slug =
    typeof n?.slug === "string" && n.slug.trim()
      ? n.slug.trim()
      : typeof n?.work_name === "string" && n.work_name.trim()
        ? n.work_name.trim()
        : "";
  if (slug) return `/news/${encodeURIComponent(slug)}`;
  if (n?.id != null) return `/news/${n.id}`;
  return "#";
};

export default function NewsClient({ items = [] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const currentItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [page, items]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig transition={spring} reducedMotion="user">
        <div className="antialiased tracking-widest [font-variant-numeric:tabular-nums]">
          {/* ===== 標題 ===== */}
          <section
            className="mt-[150px] mx-auto w-full max-w-[1920px]"
            style={{ fontFamily: "inherit" }}
          >
            <AnimatedHeading
              text="最新動態"
              lineColor="#000"
              lineLength={120}
              lineThickness={1}
              yOffsetEm={0.08}
              duration={1.0}
              delay={0.12}
              firstVisitDelay={2}
              startDelay={0}
              resetOnExit={true}
            />
          </section>

          {/* ===== 清單 ===== */}
          <section className="py-[20px]" style={{ fontFamily: "inherit" }}>
            <div
              className="mx-auto w-full md:w-[90%] px-5 sm:px-0 xl:w-[85%] max-w-[1920px]
                         grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ fontFamily: "inherit" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${page}`}
                  className="contents"
                  variants={listVariants(reduce)}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {currentItems.map((n, i) => (
                    <MotionLink
                      href={buildNewsHref(n)}
                      key={`${page}-${i}-${n.title}`}
                      className="block will-change-transform"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        transform: "translateZ(0)",
                        fontFamily: "inherit",
                      }}
                      aria-label={`${n.title}${n.work ? `｜${n.work}` : ""}`}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <motion.article
                        layout
                        className="flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitFontSmoothing: "antialiased",
                          willChange: "transform, opacity, filter",
                          fontFamily: "inherit",
                        }}
                      >
                        {/* === 圖片區 === */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={spring}
                            className="w-full h-full"
                          >
                            <Image
                              src={n.img || "/images/placeholder-16x9.jpg"}
                              alt={n.alt || n.title}
                              title={n.titleAttr || n.title}
                              fill
                              className="object-cover w-full"
                              sizes="(max-width: 1024px) 50vw, 33vw"
                              priority={i < 3}
                            />
                          </motion.div>
                        </div>

                        {/* === 文字區 === */}
                        <div className="pt-5" style={{ fontFamily: "inherit" }}>
                          <div className="flex justify-between">
                            {n.date && (
                              <div className="flex items-center gap-2 text-black">
                                <b className="text-[14px]">發布日期：</b>
                                <time
                                  className="text-[14px]"
                                  dateTime={n.publishISO || ""}
                                >
                                  {n.date}
                                </time>
                              </div>
                            )}
                            {n.work && (
                              <span className="text-[13px] text-neutral-700 mt-1">
                                {n.work}
                              </span>
                            )}
                          </div>

                          <div className="py-3">
                            <h2 className="text-[18px] font-medium leading-tight text-black">
                              {n.title}
                            </h2>
                            {n.desc && (
                              <p className="text-[14px] text-gray-600 line-clamp-2">
                                {n.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    </MotionLink>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ===== 分頁 ===== */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </section>
        </div>
        {/* ================= /字體鎖定 ================= */}
      </MotionConfig>
    </LazyMotion>
  );
}

/* ===== 分頁器保持不變（僅加 inherit） ===== */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = (s, e) => {
    for (let i = s; i <= e; i++) pages.push(i);
  };

  if (totalPages <= 7) {
    range(1, totalPages);
  } else {
    const l = Math.max(2, page - 1);
    const r = Math.min(totalPages - 1, page + 1);
    pages.push(1);
    if (l > 2) pages.push("...");
    range(l, r);
    if (r < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  const itemBase =
    "inline-flex items-center justify-center min-w-9 h-9 rounded-full text-sm transition select-none";
  const btnBase =
    "px-3 h-9 rounded-full hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      className="mt-10 flex flex-wrap gap-2 justify-center"
      style={{ fontFamily: "inherit" }}
    >
      <motion.button
        className={btnBase}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="上一頁"
        whileTap={{ scale: 0.96 }}
      >
        上一頁
      </motion.button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="inline-flex items-center justify-center w-9 h-9 text-gray-400"
            style={{ fontFamily: "inherit" }}
          >
            …
          </span>
        ) : (
          <motion.button
            key={`p-${p}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            whileTap={{ scale: 0.96 }}
            className={[itemBase, p === page ? "bg-black text-white" : ""].join(
              " ",
            )}
            style={{ fontFamily: "inherit" }}
          >
            {p}
          </motion.button>
        ),
      )}

      <motion.button
        className={btnBase}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="下一頁"
        whileTap={{ scale: 0.96 }}
        style={{ fontFamily: "inherit" }}
      >
        下一頁
      </motion.button>
    </div>
  );
}
