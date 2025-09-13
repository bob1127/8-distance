"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

function safeISO(dt) {
  try {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

export default function TimelineM062u03Client({ items = [] }) {
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const [listH, setListH] = useState(0);
  const [isMdUp, setIsMdUp] = useState(false);

  // 量測高度 & 斷點判定（不影響已 SSR 的內容）
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const updateH = () => setListH(el.offsetHeight);
    updateH();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateH)
        : null;
    ro?.observe(el);

    const mq = window.matchMedia("(min-width: 768px)");
    const setMq = () => setIsMdUp(mq.matches);
    setMq();
    mq.addEventListener?.("change", setMq);

    const onResize = () => updateH();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", updateH);

    return () => {
      ro?.disconnect();
      mq.removeEventListener?.("change", setMq);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", updateH);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 10%", "end 55%"],
  });

  const fillHeight = useTransform(scrollYProgress, [0, 1], [0, listH]);
  const fillOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  // 線條粗細：手機 2→6px；桌機 2→10px（變粗仍置中/靠左）
  const fillWidthMobile = useTransform(scrollYProgress, [0, 1], [2, 6]);
  const fillWidthDesktop = useTransform(scrollYProgress, [0, 1], [2, 10]);
  const negMarginDesktop = useTransform(
    fillWidthDesktop,
    (w) => `-${Number(w) / 2}px`
  );

  // ⚠️ SEO：不要在 SSR 輸出 opacity:0；把 initial 關掉
  const fadeUp = {
    initial: false,
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    viewport: { once: true, amount: 0.55 },
  };

  return (
    <section
      id="timeline-m062u03"
      className="w-full font-sans md:px-10"
      aria-label="公司歷程"
    >
      <div ref={wrapRef} className="relative max-w-7xl mx-auto py-10">
        <div ref={listRef} className="relative pb-24">
          {/* 底線：手機靠左、桌機置中 */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 h-full bg-neutral-200 dark:bg-neutral-800"
            style={{
              width: 2,
              left: isMdUp ? "50%" : "1.25rem",
              transform: isMdUp ? "translateX(-50%)" : "none",
            }}
          />

          {/* 填滿線：滾動變粗 */}
          <div
            aria-hidden
            className="absolute top-0 overflow-visible"
            style={{
              height: listH ? `${listH}px` : undefined,
              left: isMdUp ? "50%" : "1.25rem",
              transform: isMdUp ? "translateX(-50%)" : "none",
            }}
          >
            <motion.div
              style={{
                height: fillHeight,
                opacity: fillOpacity,
                width: isMdUp ? fillWidthDesktop : fillWidthMobile,
                marginLeft: isMdUp ? negMarginDesktop : 0,
                borderRadius: 999,
              }}
              className="bg-gradient-to-b from-gray-300 via-gray-100 to-white dark:from-gray-500 dark:via-gray-300 dark:to-gray-100 shadow-[0_0_12px_rgba(209,213,219,0.45)]"
            />
          </div>

          {/* ✅ 語意化列表（SEO）：改用 <ol>/<li> */}
          <ol className="space-y-16 md:space-y-24">
            {items.map((it, i) => {
              const leftSide = i % 2 === 0;
              const dateText = it.date || it.event_date || it.time || null;
              const dateISO = dateText ? safeISO(dateText) : undefined;

              return (
                <li
                  key={`${i}-${it.title}`}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 pt-16"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {/* 閃爍原點（灰白） */}
                  <span
                    aria-hidden
                    className="absolute top-6 rounded-full border-4 border-white dark:border-neutral-900 blink-dot"
                    style={{
                      width: 16,
                      height: 16,
                      left: isMdUp ? "50%" : "1.25rem",
                      transform: isMdUp ? "translateX(-50%)" : "none",
                    }}
                  />

                  {/* 左欄（桌機用於交錯；手機不顯示） */}
                  <div
                    className={`hidden md:block ${
                      leftSide ? "text-right md:pr-16" : "md:pr-8"
                    }`}
                  >
                    {leftSide ? (
                      <motion.div
                        initial={fadeUp.initial}
                        whileInView={fadeUp.withinView}
                        transition={fadeUp.transition}
                        viewport={fadeUp.viewport}
                        className="md:ml-auto"
                      >
                        {dateText && (
                          <time
                            className="block text-sm text-neutral-500 mb-1"
                            dateTime={dateISO}
                          >
                            {dateText}
                          </time>
                        )}
                        <h3
                          className="font-bold text-neutral-700 dark:text-neutral-200 mb-3 text-[clamp(1rem,2vw,1.25rem)]"
                          itemProp="name"
                        >
                          {it.title}
                        </h3>
                        {it.text && (
                          <p className="text-neutral-700/90 dark:text-neutral-300 mb-5 text-[clamp(.9rem,1.6vw,1rem)] leading-relaxed">
                            {it.text}
                          </p>
                        )}
                        {it.img && (
                          <Image
                            src={it.img}
                            alt={it.title}
                            width={960}
                            height={540}
                            loading="lazy"
                            placeholder="empty"
                            className="rounded-2xl object-cover w-full h-[420px] xl:h-[460px] shadow-lg"
                          />
                        )}
                      </motion.div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* 右欄（手機全顯示；桌機顯示另一半） */}
                  <div
                    className={`md:pl-16 ${
                      leftSide ? "md:order-2" : "md:order-1"
                    } ${!isMdUp ? "pl-12" : ""}`}
                  >
                    {(!isMdUp || !leftSide) && (
                      <motion.div
                        initial={false} // ⚠️ 同樣關閉 initial
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, amount: 0.55 }}
                      >
                        {dateText && (
                          <time
                            className="block text-sm text-neutral-500 mb-1"
                            dateTime={dateISO}
                          >
                            {dateText}
                          </time>
                        )}
                        <h3
                          className="font-bold text-neutral-700 dark:text-neutral-200 mb-3 text-[clamp(1rem,2vw,1.25rem)]"
                          itemProp="name"
                        >
                          {it.title}
                        </h3>
                        {it.text && (
                          <p className="text-neutral-700/90 dark:text-neutral-300 mb-5 text-[clamp(.9rem,1.6vw,1rem)] leading-relaxed">
                            {it.text}
                          </p>
                        )}
                        {it.img && (
                          <Image
                            src={it.img}
                            alt={it.title}
                            width={960}
                            height={540}
                            loading="lazy"
                            placeholder="empty"
                            className="rounded-2xl object-cover w-full h-[240px] sm:h-[300px] md:h-[420px] xl:h-[460px] shadow-lg"
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* 閃爍原點（灰白系） */}
      <style jsx>{`
        .blink-dot {
          background: #e5e7eb; /* gray-200 */
          box-shadow: 0 0 0 0 rgba(209, 213, 219, 0);
          animation: blinkGrey 1.4s ease-in-out infinite;
        }
        @keyframes blinkGrey {
          0% {
            background: #e5e7eb;
            box-shadow: 0 0 0 0 rgba(209, 213, 219, 0);
          }
          50% {
            background: #f8fafc;
            box-shadow: 0 0 14px 3px rgba(209, 213, 219, 0.6);
          }
          100% {
            background: #e5e7eb;
            box-shadow: 0 0 0 0 rgba(209, 213, 219, 0);
          }
        }
      `}</style>
    </section>
  );
}
