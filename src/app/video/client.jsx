"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

/* ---------------- 工具與 LiteYouTube (保持不變) ---------------- */
function extractYouTubeId(input) {
  if (!input) return "";
  const s = String(input).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "");
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {}
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  if (m) return m[0];
  return "";
}

function mapItem(row, idx, type) {
  const id =
    extractYouTubeId(row?.video_param) ||
    extractYouTubeId(row?.url) ||
    extractYouTubeId(row?.link);
  if (!id && !row?.title) return null;
  return {
    type,
    id: id || "",
    title: row?.title || `Video #${idx + 1}`,
    thumb: row?.image_url || null,
    sort: Number(row?.sort_order ?? idx),
    imgAlt: row?.image_alt || row?.title || "影片縮圖",
    imgTitle: row?.title || "YouTube 影片",
  };
}

const getYouTubeUrl = (type, id) =>
  type === "short"
    ? `https://www.youtube.com/shorts/${id}`
    : `https://www.youtube.com/watch?v=${id}`;

function buildThumbChain(id) {
  if (!id) return [];
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  ];
}

function LiteYouTube({
  id,
  title = "YouTube",
  ratio = "16/9",
  params = "",
  thumbUrl,
  imgAlt,
  imgTitle,
  autoplayOnMount = false,
}) {
  const [isIframe, setIsIframe] = useState(autoplayOnMount ? true : false);
  const chain = useMemo(() => buildThumbChain(id), [id]);
  const [thumbIdx, setThumbIdx] = useState(0);
  const thumbCandidate = thumbUrl || chain[thumbIdx];
  const warmedUp = useRef(false);

  useEffect(() => {
    setThumbIdx(0);
  }, [id, thumbUrl]);

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
    if (!id) return;
    warmConnections();
    setIsIframe(true);
  };

  const iframeSrc = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1` +
      (params ? `&${params}` : "")
    : "";

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: ratio }}
      onPointerOver={warmConnections}
      onFocus={warmConnections}
    >
      {!isIframe || !iframeSrc ? (
        <button
          type="button"
          aria-label={`播放：${title}`}
          className="group absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          onClick={onPlay}
          disabled={!id}
          title={imgTitle || title}
        >
          {thumbCandidate && (
            <img
              src={thumbCandidate}
              alt={imgAlt || title}
              title={imgTitle || title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={() => {
                if (!thumbUrl && chain.length > 0) {
                  setThumbIdx((idx) => Math.min(idx + 1, chain.length - 1));
                }
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
          <div className="absolute inset-0 grid place-items-center">
            <span
              className={[
                "inline-grid place-items-center rounded-full transition w-16 h-16 shadow-lg",
                id
                  ? "bg-white/90 group-hover:bg-white"
                  : "bg-white/50 cursor-not-allowed",
              ].join(" ")}
            >
              {id ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              ) : (
                <span className="text-xs font-bold text-gray-600">No Link</span>
              )}
            </span>
          </div>
          <span className="absolute left-3 top-3 text-xs font-medium text-white/90 bg-black/40 px-2 py-1">
            {title}
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={`YouTube：${title}`}
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}

function YouTubeCard({
  type,
  id,
  title,
  thumb,
  imgAlt,
  imgTitle,
  autoplayOnMount = false,
}) {
  const isShort = type === "short";
  return (
    <LiteYouTube
      id={id}
      title={title}
      ratio={isShort ? "9/16" : "16/9"}
      thumbUrl={thumb}
      imgAlt={imgAlt}
      imgTitle={imgTitle}
      autoplayOnMount={autoplayOnMount}
    />
  );
}

function Pagination({ currentPage, totalPages, onChange, disabled }) {
  if (!totalPages || totalPages <= 1) return null;
  const go = (p) => {
    if (disabled) return;
    onChange?.(Math.min(Math.max(1, p), totalPages));
  };
  const makeRange = () => {
    const pages = [];
    const maxButtons = 5;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const start = Math.max(2, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages - 1, start + maxButtons - 1);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
    return pages;
  };
  const items = makeRange();
  return (
    <nav
      className={`mt-8 flex items-center justify-center gap-2 select-none ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      role="navigation"
      aria-label="分頁"
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-40"
      >
        上一頁
      </button>
      {items.map((it, idx) =>
        it === "…" ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={`p-${it}`}
            type="button"
            onClick={() => go(it)}
            aria-current={currentPage === it ? "page" : undefined}
            className={[
              "min-w-9 h-9 px-3 rounded-lg border text-sm",
              currentPage === it
                ? "bg-black text-white border-black"
                : "bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            {it}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-40"
      >
        下一頁
      </button>
    </nav>
  );
}

function SliderCarousel({
  items = [],
  onPlayIndex,
  playingIndex,
  autoplayInterval = 5000,
}) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);
  const [isHovered, setIsHovered] = useState(false);
  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth - 5;
    setCanPrev(el.scrollLeft > 5);
    setCanNext(el.scrollLeft < maxScroll);
  }, []);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    window.addEventListener("resize", updateButtons);
    el.addEventListener("scroll", updateButtons, { passive: true });
    return () => {
      window.removeEventListener("resize", updateButtons);
      el.removeEventListener("scroll", updateButtons);
    };
  }, [updateButtons]);
  const scrollByPage = (dir) => {
    trackRef.current?.scrollBy({
      left: dir * trackRef.current.clientWidth,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (items.length <= 1 || playingIndex !== -1 || isHovered) return;
    const timer = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10)
        el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [items.length, playingIndex, isHovered, autoplayInterval]);
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-2 mx-auto w-full touch-pan-x"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((it, idx) => (
          <article key={`slider-${idx}`} className="snap-start shrink-0 w-full">
            <div
              className="relative w-full overflow-hidden bg-black rounded-lg"
              style={{ aspectRatio: "16/9" }}
            >
              {playingIndex === idx && it.id ? (
                <YouTubeCard
                  type="video"
                  id={it.id}
                  title={it.title}
                  autoplayOnMount
                />
              ) : (
                <button
                  type="button"
                  className="group/btn absolute inset-0 w-full h-full focus:outline-none"
                  onClick={() => it.id && onPlayIndex(idx)}
                >
                  <img
                    src={it.src || it.thumb}
                    alt={it.imgAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 transition group-hover/btn:bg-black/20" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span
                      className={[
                        "inline-grid place-items-center rounded-full transition w-14 h-14 shadow",
                        it.id
                          ? "bg-white/90 group-hover/btn:bg-white"
                          : "bg-white/60 cursor-not-allowed",
                      ].join(" ")}
                    >
                      {it.id ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                        </svg>
                      ) : (
                        <span className="text-[10px] font-bold">No Link</span>
                      )}
                    </span>
                  </div>
                </button>
              )}
            </div>
            {it.title && (
              <h2 className="mt-3 text-sm md:text-base font-medium line-clamp-2">
                {it.title}
              </h2>
            )}
          </article>
        ))}
      </div>
      <button
        onClick={() => scrollByPage(-1)}
        className={`hidden md:grid absolute left-4 top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow place-items-center z-10 ${
          !canPrev ? "opacity-0" : "opacity-100"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        onClick={() => scrollByPage(1)}
        className={`hidden md:grid absolute right-4 top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow place-items-center z-10 ${
          !canNext ? "opacity-0" : "opacity-100"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Client Component                                              */
/* ------------------------------------------------------------------ */
export default function YouTubeLiteClient({
  sliderItems = [],
  initialNormal = [],
  initialShorts = [],
  initialPagination = {},
  initialTab = "normal",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("category") || initialTab);
  const [normalList, setNormalList] = useState(initialNormal);
  const [shortsList, setShortsList] = useState(initialShorts);
  const [normalMeta, setNormalMeta] = useState(
    initialPagination?.normal || { current_page: 1, total_pages: 1 }
  );
  const [shortsMeta, setShortsMeta] = useState(
    initialPagination?.shorts || { current_page: 1, total_pages: 1 }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);

  // ✅ 修復關鍵：建立一個對照表
  const topCarouselRaw = useMemo(() => {
    const normT = (s) => (s || "").toString().trim().toLowerCase();
    // 這裡我們從所有目前有的列表裡找 ID
    const allVideos = [
      ...normalList,
      ...shortsList,
      ...initialNormal,
      ...initialShorts,
    ];
    const lookup = new Map(allVideos.map((v) => [normT(v.title), v.id]));

    return sliderItems.map((item) => {
      if (item.id) return item;
      const foundId = lookup.get(normT(item.title));
      return foundId ? { ...item, id: foundId } : item;
    });
  }, [sliderItems, normalList, shortsList, initialNormal, initialShorts]);

  const handleTabChange = (key) => {
    setTab(key);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", key);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`, { scroll: false });
    handlePageChange(1, key);
  };

  const handlePageChange = async (targetPage, targetCategory = tab) => {
    setIsLoading(true);
    if (targetCategory === tab) window.scrollTo({ top: 0, behavior: "smooth" });
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", targetCategory);
    newParams.set("page", targetPage.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });

    try {
      const res = await fetch(
        `https://api.8distance.com/api/videos?category=${targetCategory}&page=${targetPage}`
      );
      const json = await res.json();
      if (targetCategory === "normal") {
        const rawList =
          json?.data || json?.normal?.data || json?.videos?.normal || [];
        setNormalList(
          rawList.map((r, i) => mapItem(r, i, "video")).filter(Boolean)
        );
        setNormalMeta(
          json?.pagination?.normal || {
            ...normalMeta,
            current_page: targetPage,
          }
        );
      } else {
        const rawList =
          json?.data || json?.shorts?.data || json?.videos?.shorts || [];
        setShortsList(
          rawList.map((r, i) => mapItem(r, i, "short")).filter(Boolean)
        );
        setShortsMeta(
          json?.pagination?.shorts || {
            ...shortsMeta,
            current_page: targetPage,
          }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="mb-10 max-w-[1200px] mx-auto pt-[24px] px-8">
        <SliderCarousel
          items={topCarouselRaw}
          playingIndex={playingIndex}
          onPlayIndex={setPlayingIndex}
        />
      </section>
      <div className="flex items-center justify-center gap-3 mb-6 px-8">
        {[
          { key: "normal", label: "一般影片" },
          { key: "shorts", label: "Shorts" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              tab === t.key
                ? "bg-black text-white"
                : "bg-white text-gray-700 border",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section
        className={`max-w-[1200px] mx-auto px-8 transition-opacity ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tab === "normal" ? normalList : shortsList).map((v, idx) => (
            <motion.article
              key={`${v.id}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-3"
            >
              <YouTubeCard
                type={v.type}
                id={v.id}
                title={v.title}
                thumb={v.thumb}
              />
              <h2 className="text-base font-medium">
                <a
                  href={getYouTubeUrl(v.type, v.id)}
                  target="_blank"
                  className="hover:underline"
                >
                  {v.title}
                </a>
              </h2>
            </motion.article>
          ))}
        </div>
        <Pagination
          currentPage={
            (tab === "normal" ? normalMeta : shortsMeta).current_page
          }
          totalPages={(tab === "normal" ? normalMeta : shortsMeta).total_pages}
          onChange={handlePageChange}
          disabled={isLoading}
        />
      </section>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
