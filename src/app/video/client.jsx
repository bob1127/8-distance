// /pages/youtube-lite.jsx
"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { motion, useReducedMotion } from "framer-motion";

/**
 * 使用方式：
 * 1) 在 items 陣列填入 { type: 'video' | 'short', id: 'YouTubeID', title?: string }
 * 2) 'video' -> 16:9，'short' -> 9:16
 * 3) 點擊縮圖才載入真正的 iframe，初載超輕量
 */

// 單支輕量 YouTube 元件（互動後才載入 iframe）
function LiteYouTube({
  id,
  title = "YouTube video",
  ratio = "16/9",
  params = "",
}) {
  const [isIframe, setIsIframe] = useState(false);
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  const warmedUp = useRef(false);

  // 滑過或點擊時預連線，降低延遲
  const warmConnections = useCallback(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    const hints = [
      ["preconnect", "https://www.youtube-nocookie.com"],
      ["preconnect", "https://www.google.com"],
      ["preconnect", "https://i.ytimg.com"],
      ["preconnect", "https://www.gstatic.com"],
    ];
    for (const [rel, href] of hints) {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  const onPlay = () => {
    warmConnections();
    setIsIframe(true);
  };

  // 縮圖 fallback：maxres 失敗時改 hqdefault
  const onThumbError = () => {
    if (!thumb.includes("hqdefault.jpg")) {
      setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    }
  };

  // 組合 iframe src（使用 nocookie 網域）
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
          aria-label="Play video"
          className="group absolute inset-0 w-full h-full"
          onClick={onPlay}
        >
          {/* 縮圖 */}
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
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
              >
                <path d="M8 5v14l11-7z"></path>
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
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}

// 依類型設定比例
function YouTubeCard({ type, id, title }) {
  if (type === "short")
    return <LiteYouTube id={id} title={title} ratio="9/16" params="" />;
  return <LiteYouTube id={id} title={title} ratio="16/9" params="" />;
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      className="text-stone-800 hover:text-black transition duration-300"
    >
      {children}
    </button>
  );
}

export default function YouTubeLitePage() {
  // 在這裡填入你的影片（只要寫 id）
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

  const filtered = useMemo(
    () => items.filter((i) => i.type === tab),
    [items, tab]
  );

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <Head>
        <title>YouTube 高效能嵌入</title>
        <meta
          name="description"
          content="使用輕量載入的高效能 YouTube / Shorts 嵌入頁面。"
        />
        {/* 基本預連線（互動時還會再動態補強） */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </Head>

      <main className="mx-auto w-[92%] pt-[150px] max-w-[1200px] py-10">
        <header className="mb-6 md:mb-8"></header>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="影片類型"
          className=" items-center mx-auto w-full flex justify-center gap-3 mb-6"
        >
          <TabButton active={tab === "video"} onClick={() => setTab("video")}>
            Video
          </TabButton>
          <span>|</span>
          <TabButton active={tab === "short"} onClick={() => setTab("short")}>
            Shorts Video
          </TabButton>
        </div>

        {/* 影片格狀排版：手機單欄、md 兩欄、lg 三欄 */}
        <section
          key={tab}
          className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((v, idx) => (
            <motion.article
              key={`${v.id}-${idx}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col gap-3 will-change-transform"
            >
              <YouTubeCard type={v.type} id={v.id} title={v.title} />
              <h2 className="text-base font-medium">
                {v.title ||
                  (v.type === "short" ? "YouTube Shorts" : "YouTube 影片")}
              </h2>
            </motion.article>
          ))}
        </section>
      </main>
    </>
  );
}
