// /pages/youtube-lite.jsx
"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 使用方式：
 * 1) 到 items 陣列填入 { type: 'video' | 'short', id: 'YouTubeID', title?: string }
 * 2) Tab「一般影片 / Shorts」切換；卡片進視窗時會 fade-up
 * 3) 仍採輕量載入：點擊縮圖才建立 iframe
 */

/* ---------------- Lite YouTube (只在互動後載入 iframe) ---------------- */
function LiteYouTube({ id, title = "YouTube", ratio = "16/9", params = "" }) {
  const [isIframe, setIsIframe] = useState(false);
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  const warmedUp = useRef(false);

  // 預連線（滑過/點擊時）
  const warmConnections = useCallback(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    [
      ["preconnect", "https://www.youtube-nocookie.com"],
      ["preconnect", "https://www.google.com"],
      ["preconnect", "https://i.ytimg.com"],
      ["preconnect", "https://www.gstatic.com"],
    ].forEach(([rel, href]) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  const onPlay = () => {
    warmConnections();
    setIsIframe(true);
  };

  // maxres 失敗 fallback 到 hqdefault
  const onThumbError = () => {
    if (!thumb.includes("hqdefault.jpg")) {
      setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    }
  };

  const iframeSrc = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1${
    params ? `&${params}` : ""
  }`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio: ratio }}
      onPointerOver={warmConnections}
    >
      {!isIframe ? (
        <button
          type="button"
          aria-label={`播放：${title}`}
          className="group absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          onClick={onPlay}
        >
          {/* 縮圖（提供精簡且有意義的 alt，避免冗贅字） */}
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={onThumbError}
          />
          {/* 半透明遮罩 */}
          <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
          {/* 播放鍵 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid place-items-center rounded-full w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur transition group-hover:scale-105 will-change-transform">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-red-600"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* 左上角角標（可移除） */}
          <span className="absolute left-3 top-3 text-xs font-medium text-white/90 bg-black/40 rounded px-2 py-1">
            {title}
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={`YouTube：${title}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}

/* ---------------- 卡片：依類型設定比例 ---------------- */
function YouTubeCard({ type, id, title }) {
  if (type === "short")
    return <LiteYouTube id={id} title={title} ratio="9/16" params="" />;
  return <LiteYouTube id={id} title={title} ratio="16/9" params="" />;
}

/* ---------------- 可及性良好的 Tabs ----------------
   - role="tablist" / role="tab" / role="tabpanel"
   - aria-controls / aria-labelledby 成對
   - 鍵盤：← → Home End
---------------------------------------------------- */
function TabButton({ id, panelId, active, onClick, children, tabRef }) {
  return (
    <button
      id={id}
      ref={tabRef}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={panelId}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        active
          ? "bg-black text-white shadow"
          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function YouTubeLitePage() {
  /* 你的資料：只要填 id 與 type */
  const items = [
    {
      type: "video",
      id: "TEtt8264gek",
      title: "台中太子咸亨尚宅｜奢華風老屋翻新",
    },
    { type: "video", id: "-fBFYVZc6TY", title: "東區饒宅A2 Before / After" },
    {
      type: "video",
      id: "TEtt8264gek",
      title: "台中太子咸亨尚宅｜奢華風老屋翻新",
    },
    { type: "video", id: "-fBFYVZc6TY", title: "東區饒宅A2 Before / After" },
    {
      type: "video",
      id: "TEtt8264gek",
      title: "台中太子咸亨尚宅｜奢華風老屋翻新",
    },
    { type: "video", id: "-fBFYVZc6TY", title: "東區饒宅A2 Before / After" },
    {
      type: "video",
      id: "TEtt8264gek",
      title: "台中太子咸亨尚宅｜奢華風老屋翻新",
    },
    { type: "video", id: "-fBFYVZc6TY", title: "東區饒宅A2 Before / After" },
    { type: "short", id: "pIP-0R6dwQA", title: "饒宅A2-主臥更衣室" },
    { type: "short", id: "lgWPWpyFf78", title: "主臥室 梳化區" },
    { type: "short", id: "04dUVWjuQQo", title: "饒宅A1 客房 -床頭背板" },
    { type: "short", id: "AMyjIadRzm4", title: "饒宅A1 小孩房-床頭收納" },
    { type: "short", id: "yzLepUCNyRM", title: "饒宅A2-電視櫃" },
  ];

  const [tab, setTab] = useState("video"); // 'video' | 'short'
  const prefersReduced = useReducedMotion();

  const videos = useMemo(
    () => items.filter((i) => i.type === "video"),
    [items]
  );
  const shorts = useMemo(
    () => items.filter((i) => i.type === "short"),
    [items]
  );

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5, ease: "easeOut" },
    },
  };

  // Tabs 可鍵盤操作
  const videoTabRef = useRef(null);
  const shortTabRef = useRef(null);
  const tabs = [
    {
      key: "video",
      label: "一般影片",
      tabId: "tab-video",
      panelId: "panel-video",
      ref: videoTabRef,
    },
    {
      key: "short",
      label: "Shorts",
      tabId: "tab-short",
      panelId: "panel-short",
      ref: shortTabRef,
    },
  ];

  const onTabsKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.key === tab);
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % tabs.length;
      setTab(tabs[next].key);
      tabs[next].ref.current?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + tabs.length) % tabs.length;
      setTab(tabs[prev].key);
      tabs[prev].ref.current?.focus();
      e.preventDefault();
    } else if (e.key === "Home") {
      setTab(tabs[0].key);
      tabs[0].ref.current?.focus();
      e.preventDefault();
    } else if (e.key === "End") {
      setTab(tabs[tabs.length - 1].key);
      tabs[tabs.length - 1].ref.current?.focus();
      e.preventDefault();
    }
  };

  return (
    <>
      <Head>
        <title>YouTube 高效能嵌入</title>
        <meta
          name="description"
          content="使用輕量載入的高效能 YouTube / Shorts 嵌入頁面。"
        />
        {/* 預連線（互動時也會再補強） */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </Head>

      <main className="mx-auto w-[92%] pt-[150px] max-w-[1200px] py-10">
        <header className="mb-6 md:mb-8"></header>

        {/* Tabs（ARIA 完整） */}
        <div
          role="tablist"
          aria-label="影片類型"
          aria-orientation="horizontal"
          className="flex items-center justify-center gap-3 mb-6"
          onKeyDown={onTabsKeyDown}
        >
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              id={t.tabId}
              panelId={t.panelId}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
              tabRef={t.ref}
            >
              {t.label}
            </TabButton>
          ))}
        </div>

        {/* Panels：同時存在，未選擇的以 hidden 隱藏，符合 aria-controls / labelledby */}
        <section
          id="panel-video"
          role="tabpanel"
          aria-labelledby="tab-video"
          hidden={tab !== "video"}
          aria-hidden={tab !== "video"}
          tabIndex={0}
          className={tab === "video" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, idx) => (
              <motion.article
                key={`${v.id}-video-${idx}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col gap-3 will-change-transform"
              >
                <YouTubeCard type={v.type} id={v.id} title={v.title} />
                <h2 className="text-base font-medium">
                  {v.title || "YouTube 影片"}
                </h2>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          id="panel-short"
          role="tabpanel"
          aria-labelledby="tab-short"
          hidden={tab !== "short"}
          aria-hidden={tab !== "short"}
          tabIndex={0}
          className={tab === "short" ? "block" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shorts.map((v, idx) => (
              <motion.article
                key={`${v.id}-short-${idx}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col gap-3 will-change-transform"
              >
                <YouTubeCard type={v.type} id={v.id} title={v.title} />
                <h2 className="text-base font-medium">
                  {v.title || "YouTube Shorts"}
                </h2>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
