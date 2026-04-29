"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

function safeISO(dt) {
  try {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

// 取得描述文字
const getDesc = (it) => String(it?.description ?? it?.desc ?? it?.text ?? "");

// 偵測是否包含 HTML
const looksLikeHTML = (s) => /<\s*br\s*\/?>|<\/?[a-z][\s\S]*>/i.test(s);

export default function TimelineM062u03Client({ items = [] }) {
  const listRef = useRef(null);
  const [listH, setListH] = useState(0);
  const [isMdUp, setIsMdUp] = useState(false);

  // 量測高度 & 斷點 (保留此邏輯是為了讓中間的黑線長度正確)
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

  // 中線 X 位置
  const axisLeft = isMdUp ? "50%" : "1.25rem";
  const axisTransform = "translateX(-50%)";

  // 共用的描述渲染
  const Desc = ({ it, className = "" }) => {
    const desc = getDesc(it);
    if (!desc) return null;

    if (looksLikeHTML(desc)) {
      return (
        <p
          className={`text-neutral-800/90 mb-5 text-[clamp(.9rem,1.6vw,1rem)] leading-relaxed ${className}`}
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      );
    }
    return (
      <p
        className={`text-neutral-800/90 mb-5 text-[clamp(.9rem,1.6vw,1rem)] leading-relaxed whitespace-pre-line ${className}`}
      >
        {desc}
      </p>
    );
  };

  return (
    <section
      id="timeline-m062u03"
      className="w-full font-sans md:px-10"
      aria-label="公司歷程"
    >
      <div className="relative max-w-[1920px] xl:max-w-7xl mx-auto py-10">
        <div ref={listRef} className="relative pb-24">
          {/* 靜態灰黑底線 (取代原本的動態線) */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bg-black/80"
            style={{
              width: 2,
              height: listH ? `${listH}px` : "100%", // 確保線條長度跟內容一樣
              left: axisLeft,
              transform: axisTransform,
            }}
          />

          {/* 列表 */}
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
                  {/* 原點 */}
                  <span
                    aria-hidden
                    className="absolute top-6 rounded-full border-[3px] border-white bg-black"
                    style={{
                      width: 14,
                      height: 14,
                      left: axisLeft,
                      transform: axisTransform,
                      boxShadow: "0 0 12px rgba(0,0,0,0.25)",
                    }}
                  />

                  {/* 左欄（桌機交錯；手機不顯示左欄） */}
                  <div
                    className={`hidden md:block ${
                      leftSide ? "text-right" : "md:pr-8"
                    }`}
                  >
                    {leftSide ? (
                      <div>
                        {dateText && (
                          <time
                            className="block text-sm text-neutral-500 mb-1"
                            dateTime={dateISO}
                          >
                            {dateText}
                          </time>
                        )}
                        <h3
                          className="font-bold text-neutral-900 mb-3 text-[clamp(1rem,2vw,1.25rem)]"
                          itemProp="name"
                        >
                          {it.title}
                        </h3>

                        <Desc it={it} />
                        {it.img && (
                          <Image
                            src={it.img}
                            alt={it.title}
                            width={960}
                            height={540}
                            loading="lazy"
                            placeholder="empty"
                            className="rounded-2xl object-cover w-full h-[420px] xl:h-[460px] shadow-2xl"
                          />
                        )}
                      </div>
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
                      <div>
                        {dateText && (
                          <time
                            className="block text-sm text-neutral-500 mb-1"
                            dateTime={dateISO}
                          >
                            {dateText}
                          </time>
                        )}
                        <h3
                          className="font-bold text-neutral-900 mb-3 text-[clamp(1rem,2vw,1.25rem)]"
                          itemProp="name"
                        >
                          {it.title}
                        </h3>
                        <Desc it={it} />
                        {it.img && (
                          <Image
                            src={it.img}
                            alt={it.title}
                            width={960}
                            height={540}
                            loading="lazy"
                            placeholder="empty"
                            className="rounded-2xl object-cover w-full h-[240px] sm:h-[300px] md:h-[420px] xl:h-[460px] shadow-2xl"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
