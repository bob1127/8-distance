// app/blog/[slug]/client.jsx
"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";

/* ====== Lightbox ====== */
import Lightbox from "yet-another-react-lightbox";
import {
  Captions,
  Download,
  Fullscreen,
  Zoom,
  Thumbnails,
} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

/* ====== GSAP & Smooth Scroll ====== */
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/* ====== Swiper ====== */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

/* ====== 設定 ====== */
const API_HOST = "https://api.8distance.com";
const VIEW_COUNT_API = "https://api.8distance.com/api/page-views";
// 定義 CKEditor CSS 連結
const CKEDITOR_CSS_URL =
  "https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css";

/* ====== 小工具 ====== */
const hasText = (v) =>
  typeof v === "string" ? v.trim().length > 0 : v !== null && v !== undefined;

const toNumberOrNull = (v) => {
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const formatWan = (n) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("zh-TW").format(Number(n || 0)) + " 萬";

function absolutizeUrl(u = "") {
  const s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  if (s.startsWith("/")) return API_HOST + s;
  return API_HOST + "/" + s.replace(/^\.?\//, "");
}
function normalizeDetailHtml(html = "") {
  return String(html)
    .replaceAll("\\u003C", "<")
    .replaceAll("\\u003E", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "'")
    .replaceAll("&#39;", "'");
}

function htmlHasMeaningfulContent(html = "") {
  return (
    String(html)
      .replace(/<img[^>]*>/g, "img")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, "").length > 0
  );
}

gsap.registerPlugin(ScrollTrigger);

function normalizeUrl(u) {
  try {
    const abs = new URL(absolutizeUrl(u));
    abs.search = "";
    abs.hash = "";
    return abs.toString();
  } catch {
    return absolutizeUrl(u).split("?")[0].split("#")[0];
  }
}

function formatDateDisplay(d) {
  if (!d) return "—";
  if (/^\d{4}[\.\-\/]\d{1,2}[\.\-\/]\d{1,2}$/.test(String(d))) {
    return String(d).replaceAll("/", ".").replaceAll("-", ".");
  }
  const t = new Date(d);
  if (isNaN(t.getTime())) return String(d);
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${t.getFullYear()}.${mm}.${dd}`;
}

const buildBlogHref = (slugOrId = "") =>
  `/blog/${encodeURIComponent(String(slugOrId || ""))}`;

/* ====== Components ====== */

const RevealImage = React.memo(function RevealImage({
  src,
  alt,
  title,
  aspectClass = "aspect-[16/10]",
  priority = false,
  sizes = "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw",
}) {
  const rootRef = useRef(null);
  const clipRef = useRef(null);
  const imgRef = useRef(null);
  const scrimRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.set(clipRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(imgRef.current, { scale: 0.98, willChange: "transform" });
    gsap.set(scrimRef.current, {
      xPercent: 0,
      opacity: 0.7,
      willChange: "transform, opacity",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: "top 85%",
        end: "bottom 60%",
        once: true,
        toggleActions: "play none none none",
      },
    });

    tl.to(clipRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.35,
      ease: "power4.out",
    });
    tl.to(
      imgRef.current,
      {
        keyframes: [
          { scale: 1.08, duration: 1.45, ease: "power3.out" },
          { scale: 1.0, duration: 0.6, ease: "power2.out" },
        ],
      },
      0
    );
    tl.to(
      scrimRef.current,
      { xPercent: 100, opacity: 0, duration: 1.4, ease: "power3.out" },
      0.04
    );

    return () => tl.kill();
  }, []);

  return (
    <div ref={rootRef} className="w-full relative overflow-hidden">
      <div className={`${aspectClass} relative`}>
        <div ref={clipRef} className="absolute inset-0">
          <div ref={imgRef} className="absolute inset-0">
            <Image
              src={src || "/images/placeholder-16x9.jpg"}
              alt={alt || title || "news"}
              title={title || alt || "news"}
              fill
              className="object-cover"
              sizes={sizes}
              priority={priority}
            />
          </div>
          <div
            ref={scrimRef}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 60%)",
              mixBlendMode: "soft-light",
            }}
          />
        </div>
      </div>
    </div>
  );
});

const CarouselPagination = ({ swiper, count }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!swiper) return;
    setCurrentIndex(swiper.realIndex);
    const onSlideChange = () => {
      setCurrentIndex(swiper.realIndex);
    };
    swiper.on("slideChange", onSlideChange);
    return () => {
      swiper.off("slideChange", onSlideChange);
    };
  }, [swiper]);

  if (!swiper || count <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => swiper.slideToLoop(i)}
          className={[
            "h-2 rounded-full bg-black/80 opacity-80 transition-all duration-300",
            i === currentIndex ? "w-9 md:w-11 opacity-100" : "w-2 md:w-[6px]",
          ].join(" ")}
        />
      ))}
    </div>
  );
};

function mapBlogsForCarousel(json) {
  const list = Array.isArray(json?.blogs)
    ? json.blogs
    : Array.isArray(json)
    ? json
    : [];

  const toDateStr = (d) => {
    if (!d) return "";
    const t = new Date(d);
    if (!isNaN(t.getTime())) {
      const mm = String(t.getMonth() + 1).padStart(2, "0");
      const dd = String(t.getDate()).padStart(2, "0");
      return `${t.getFullYear()}.${mm}.${dd}`;
    }
    return String(d).slice(0, 10).replaceAll("-", ".");
  };

  return list
    .map((b, idx) => {
      const title = b?.title || b?.name || `文章 ${idx + 1}`;
      const rawImg =
        b?.image ||
        b?.cover_image ||
        b?.image_url ||
        b?.thumbnail_url ||
        "/images/placeholder.jpg";
      const img = absolutizeUrl(rawImg);
      const slug = String(b?.url_slug ?? b?.slug ?? b?.id ?? "").trim();
      const url = slug ? buildBlogHref(slug) : "#";
      const desc = b?.description || b?.excerpt || "";
      const date = toDateStr(b?.date || b?.published_at || b?.created_at);

      return { date, title, desc, img, url };
    })
    .filter((x) => x.title && x.url);
}

/* ====== 主組件 Client ====== */
export default function Client({ post }) {
  const {
    id,
    title,
    description,
    city,
    district,
    budgetWan,
    areaPing,
    type,
    style,
    image,
    imageAlt,
    imageTitle,
    date,
    details = [],
  } = post || {};

  const budgetNum = toNumberOrNull(budgetWan);
  const areaNum = toNumberOrNull(areaPing);
  const hasLocation = hasText(city) || hasText(district);
  const hasTypeStyle = hasText(type) || hasText(style);

  const containerRef = useRef(null);
  const container =
    "max-w-[1920px] w-full mx-auto sm:w-[95%] lg:w-[85%] 2xl:w-[75%]";

  /* 🔥 新增：動態載入 CKEditor CSS (Scoped to this page only) 🔥 */
  useEffect(() => {
    const linkId = "ckeditor-content-styles";

    // 檢查是否已存在，避免重複加入
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = CKEDITOR_CSS_URL;
      document.head.appendChild(link);
    }

    // Cleanup function: 當組件卸載 (離開此頁) 時，移除該 CSS
    return () => {
      const link = document.getElementById(linkId);
      if (link) {
        link.remove();
      }
    };
  }, []);

  /* 觀看數統計 */
  useEffect(() => {
    if (!id) return;
    const trackView = async () => {
      try {
        const storageKey = `viewed_article_${id}`;
        const now = new Date();
        const todayStr = `${now.getFullYear()}/${
          now.getMonth() + 1
        }/${now.getDate()}`;
        const lastViewedDate = localStorage.getItem(storageKey);
        if (lastViewedDate === todayStr) return;

        await fetch(VIEW_COUNT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "blogs", views: { [String(id)]: 1 } }),
        });
        localStorage.setItem(storageKey, todayStr);
      } catch (err) {
        console.error("View tracking error:", err);
      }
    };
    trackView();
  }, [id]);

  /* GSAP 進場 */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const imgs = document.querySelectorAll(".animate-image-wrapper");
      imgs.forEach((image, i) => {
        gsap.fromTo(
          image,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "top center",
              toggleActions: "play none none none",
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  /* Lightbox */
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const root = containerRef.current || document;
    const list = [];
    if (image) {
      list.push({
        src: normalizeUrl(image),
        title: imageAlt || imageTitle || title || "",
        description: "",
        download: `${title || "image"}.jpg`,
      });
    }

    const imgs = Array.from(root.querySelectorAll(".ck-content img"));
    imgs.forEach((img) => {
      const src = normalizeUrl(
        img.getAttribute("src") || img.getAttribute("data-src")
      );
      if (!src) return;

      const caption =
        img.getAttribute("alt") || img.getAttribute("title") || "";
      if (!list.some((s) => s.src === src)) {
        list.push({
          src,
          title: caption,
          download: caption ? `${caption}.jpg` : "image.jpg",
        });
      }
      img.classList.add("cursor-zoom-in");
    });
    setSlides(list);

    const ckContent = root.querySelector(".ck-content");
    if (!ckContent) return;

    const handleClick = (e) => {
      const img = e.target.closest("img");
      if (!img || !ckContent.contains(img)) return;
      const clickedSrc = normalizeUrl(img.getAttribute("src"));
      const idx = list.findIndex((s) => s.src === clickedSrc);
      if (idx >= 0) {
        e.preventDefault();
        setLbIndex(idx);
        setLbOpen(true);
      }
    };
    ckContent.addEventListener("click", handleClick, true);
    return () => ckContent.removeEventListener("click", handleClick, true);
  }, [details, image]);

  /* 底部推薦資料 */
  const [recommended, setRecommended] = useState([]);
  const [loadingRec, setLoadingRec] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("https://api.8distance.com/api/blogs", {
          signal: ac.signal,
          cache: "force-cache",
        });
        if (res.ok) {
          const json = await res.json();
          setRecommended(mapBlogsForCarousel(json).slice(0, 12));
        }
      } catch {
        setRecommended([]);
      } finally {
        if (!ac.signal.aborted) setLoadingRec(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const [swiperInstance, setSwiperInstance] = useState(null);

  // 全域樣式 (Style JSX)
  // 這些 CSS 只會作用在 .ck-content 內部，因此不會污染其他頁面
  const globalStyles = `
    /* ====== CKEditor 內容自適應優化 (Scoped to .ck-content) ====== */
    
    /* 1. 圖片與基本設定 */
    .ck-content img {
      max-width: 100%;
      height: auto !important;
      display: block;
    }
    
    .ck-content figure.image {
      max-width: 100%;
      margin: 1.5em auto;
      clear: both;
      display: table; /* 修正 CKEditor 預設 */
    }

    .ck-content figure.table {
      margin: 1.5em auto;
      width: 100%;
      overflow-x: auto; /* 保留以防表格內容真的需要橫向滾動 */
    }
   
    .ck-content table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    /* 2. 表格 RWD 核心代碼：手機版將表格變為上下堆疊 */
    @media (max-width: 768px) {
      /* 強制將表格元素轉換為區塊元素，實現堆疊效果 */
      .ck-content figure.table,
      .ck-content table, 
      .ck-content tbody, 
      .ck-content tr, 
      .ck-content td {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        box-sizing: border-box !important;
      }

      /* 清除 CKEditor 可能的浮動 */
      .ck-content figure.table {
        float: none !important;
        margin: 0 0 2rem 0 !important;
      }

      /* 重置表格儲存格樣式 */
      .ck-content td {
        padding: 0 !important;
        margin-bottom: 20px !important; /* 堆疊後的垂直間距 */
        border-width: 0 !important; /* 如果是排版用表格，移除邊框看起來比較乾淨 */
      }
      
      /* 最後一個儲存格不需要下方邊距 */
      .ck-content td:last-child {
        margin-bottom: 0 !important;
      }

      /* 確保圖片在堆疊時滿版 */
      .ck-content td figure.image {
         margin: 0 0 10px 0 !important;
         width: 100% !important;
      }
      
      .ck-content td figure.image img {
         width: 100% !important;
      }

      /* 修正文字區塊的間距 */
      .ck-content p {
         margin-bottom: 1rem;
      }
    }

    /* 3. 解決 CKEditor/Tailwind 衝突與細節修正 */
    .ck-content ul, .ck-content ol {
      padding-left: 1.5em;
      margin-bottom: 1em;
    }
    .ck-content li {
      margin-bottom: 0.5em;
    }
    /* 確保有背景色的文字區塊換行正常 */
    .ck-content span[style*="background-color"] {
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        padding: 2px 0;
    }
  `;

  return (
    <div className="blog-page article-content" ref={containerRef}>
      <ReactLenis root>
        <style jsx global>
          {globalStyles}
        </style>

        <div className="pt-20 px-8">
          {/* Breadcrumb */}
          <div className={`${container} mt-[50px] sm:mt-[90px] flex`}>
            <div className="w-full lg:w-[80%] mx-auto flex flex-wrap items-center gap-y-1 text-sm md:text-base leading-relaxed text-gray-500">
              <div className="flex items-center shrink-0 whitespace-nowrap">
                <Link
                  href="/blog"
                  className="hover:text-black transition-colors"
                >
                  <span>Blog文章總覽</span>
                </Link>
                <span className="mx-3">/</span>
              </div>
              <span className="font-medium text-gray-900 text-balance break-words">
                {title || "—"}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <section
            className={`${container} sm:pb-[80px] justify-between flex flex-col lg:flex-row gap-8`}
          >
            <div className="flex w-full lg:w-[80%] mx-auto flex-col">
              <article className="py-10 text-gray-800">
                {hasText(image) && (
                  <div className="animate-image-wrapper blog-hero-wrapper">
                    <Image
                      src={absolutizeUrl(image)}
                      alt={imageAlt || title || ""}
                      title={imageTitle || imageAlt || title || ""}
                      width={1600}
                      height={900}
                      className="blog-hero-img object-cover cursor-zoom-in"
                      priority
                      onClick={() => {
                        setLbIndex(0);
                        setLbOpen(true);
                      }}
                    />
                  </div>
                )}

                {(hasText(title) ||
                  hasText(description) ||
                  hasLocation ||
                  budgetNum !== null ||
                  areaNum !== null ||
                  hasTypeStyle) && (
                  <header className="mt-8">
                    {hasText(title) && (
                      <h1 className="md:text-2xl text-xl xl:text-3xl font-semibold leading-tight">
                        {title}
                      </h1>
                    )}
                    {hasText(description) && (
                      <p className="mt-3 text-[15px] leading-7 text-gray-700">
                        {description}
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                      {hasLocation && (
                        <div>
                          <b className="tracking-widest mr-1">地點</b>
                          {city} {district}
                        </div>
                      )}
                      {budgetNum !== null && (
                        <div>
                          <b className="tracking-widest mr-1">預算</b>
                          {formatWan(budgetNum)}
                        </div>
                      )}
                      {areaNum !== null && (
                        <div>
                          <b className="tracking-widest mr-1">坪數</b>
                          {areaNum} 坪
                        </div>
                      )}
                      {hasTypeStyle && (
                        <div>
                          <b className="tracking-widest mr-1">類型 / 風格</b>
                          {type}
                          {type && style ? "／" : ""}
                          {style}
                        </div>
                      )}
                    </div>
                  </header>
                )}

                {Array.isArray(details) && details.length > 0 && (
                  <div className="mt-8 space-y-10">
                    {details.map((sec, idx) => {
                      const html = normalizeDetailHtml(
                        sec?.html_content || sec?.html || ""
                      );
                      if (!htmlHasMeaningfulContent(html)) return null;
                      return (
                        <section
                          key={sec?.key ?? idx}
                          // 🔥 加入 ck-content class，讓上方的 globalStyles 生效 🔥
                          className="ck-content tiptap ProseMirror prose prose-neutral max-w-none"
                        >
                          {hasText(sec?.title) && (
                            <h2 className="mb-3 text-xl font-semibold">
                              {sec.title}
                            </h2>
                          )}
                          <div
                            className="ck-content-inner"
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        </section>
                      );
                    })}
                  </div>
                )}
              </article>
            </div>
          </section>
        </div>

        {/* 底部推薦 (Swiper) */}
        {!loadingRec && recommended.length > 0 && (
          <section className="tearsfont flex flex-col py-10 mt-10 lg:py-[60px]">
            <div className={container}>
              <div className="flex flex-col justify-center items-center mb-4 sm:mb-8">
                <h3 className="md:text-3xl text-3xl xl:text-3xl text-stone-800">
                  熱門文章
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  對我們作品有興趣嗎？看看這些您可能會喜歡的內容。
                </p>
              </div>
            </div>

            <div className={`${container} relative`}>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                loop={recommended.length > 1}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSwiper={setSwiperInstance}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                  1536: { slidesPerView: 4 },
                }}
                className="w-full"
              >
                {recommended.map((card, idx) => (
                  <SwiperSlide key={idx} className="!h-auto">
                    <a href={card.url || "#"} className="block h-full">
                      <article className="overflow-hidden px-4 pb-10 pt-5 relative duration-700 rounded h-full">
                        <RevealImage
                          src={card.img}
                          alt={card.title}
                          title={card.title}
                          aspectClass="aspect-[16/11]"
                          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                          priority={idx < 2}
                        />
                        <div className="pt-8 pb-5 border-gray-400 pr-8">
                          <h3 className="text-base font-medium text-[#000000] line-clamp-2">
                            {card.title}
                          </h3>
                          {hasText(card.desc) && (
                            <p className="mt-2 text-sm text-neutral-900 line-clamp-2">
                              {card.desc}
                            </p>
                          )}
                        </div>
                      </article>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
              <CarouselPagination
                swiper={swiperInstance}
                count={recommended.length}
              />
            </div>
          </section>
        )}

        <Lightbox
          open={lbOpen}
          close={() => setLbOpen(false)}
          index={lbIndex}
          slides={slides}
          plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]}
          captions={{ showToggle: true }}
          thumbnails={{ position: "bottom" }}
          zoom={{ maxZoomPixelRatio: 2 }}
          carousel={{ finite: false }}
        />
      </ReactLenis>
    </div>
  );
}
