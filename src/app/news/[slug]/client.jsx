// app/news/[slug]/client.jsx
"use client";

import { Card } from "@nextui-org/react";
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import LatestNewsCarousel from "@/components/LatestNewsCarousel";

/* Lightbox (YARL) */
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

const NEWS_LIST_API = "https://api.8distance.com/api/news";

/* ------------------ utils ------------------ */
function toNumber(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

/** 將 HTML 文字轉換為純文字（把 </p><p> 與 <br> 轉成換行，再移除其餘標籤） */
function normalizeDescText(html = "") {
  if (typeof html !== "string") return "";
  return html
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?p[^>]*>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u00A0/g, " ")
    .trim();
}

/** 依 sort_order 升冪（1→2→3）取得 award_images */
function getSortedAwardImages(news) {
  const arr = Array.isArray(news?.award_images) ? news.award_images : [];
  return arr
    .map((it, idx) => ({
      src: it?.image_url || "",
      title:
        it?.image_title ||
        news?.title ||
        news?.award_name_en ||
        news?.award_name_tw ||
        `圖片 ${idx + 1}`,
      alt:
        it?.image_alt ||
        it?.image_title ||
        news?.title ||
        news?.award_name_tw ||
        `圖片 ${idx + 1}`,
      sort: toNumber(it?.sort_order, idx),
    }))
    .filter((x) => x.src)
    .sort((a, b) => a.sort - b.sort);
}

/** 依指定 sort_order 取圖；沒有就回傳 null */
function getImageByOrder(news, order) {
  const arr = getSortedAwardImages(news);
  return arr.find((x) => Number(x.sort) === Number(order)) || null;
}

/** 封面 fallback（當找不到任何 award_images 時使用） */
function pickCoverFallback(news) {
  return {
    src:
      news?.detail_image_url ||
      news?.image_url ||
      news?.cover_image_url ||
      "/images/placeholder.png",
    title:
      news?.detail_image_title ||
      news?.image_title ||
      news?.title ||
      news?.award_name_en ||
      news?.award_name_tw ||
      "",
    alt:
      news?.detail_image_alt ||
      news?.image_alt ||
      news?.title ||
      news?.award_name_tw ||
      "news",
    sort: 0,
  };
}

/** 相關文章輪播資料（優先 url_slug，其次 work_name） */
function mapNewsListForCarousel(json) {
  const arr =
    (Array.isArray(json?.news) && json.news) ||
    (Array.isArray(json?.data) && json.data) ||
    (Array.isArray(json) && json) ||
    [];

  return arr
    .map((it, idx) => {
      const node = it?.news && typeof it.news === "object" ? it.news : it;
      const slug =
        (typeof node?.url_slug === "string" && node.url_slug.trim()) ||
        (typeof node?.work_name === "string" && node.work_name.trim()) ||
        "";
      return {
        id: node?.id ?? idx,
        title:
          node?.title || node?.award_name_tw || node?.work_name || "最新動態",
        image: node?.image_url || node?.cover_image_url || "",
        alt: node?.image_alt || node?.title || node?.award_name_tw || "news",
        sort: toNumber(node?.sort_order, idx),
        link: slug ? `/news/${encodeURIComponent(slug)}` : "#",
      };
    })
    .sort((a, b) => a.sort - b.sort);
}

/* ------------------ Component ------------------ */
export default function Home({ work: news }) {
  // smooth scroll（保留）
  useEffect(() => {
    const lenis = new Lenis();
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const container = useRef(null);
  useScroll({ target: container, offset: ["start start", "end end"] });

  /* ------- 動態標題：大標=得獎名稱，副標=作品名稱 ------- */
  const HERO_MAIN = useMemo(
    () =>
      news?.award_name_tw || news?.award_name_en || news?.title || "得獎資訊",
    [news],
  );
  const HERO_SUB = useMemo(() => news?.work_name || "", [news]);

  // ⭐【行動版專用】保留 - / – / —，並在其後換行
  const HERO_MAIN_MOBILE = useMemo(
    () => String(HERO_MAIN ?? "").replace(/\s*([-–—])\s*/g, "$1\n"),
    [HERO_MAIN],
  );

  /* 相關文章（底部 Slider） */
  const [relatedSlides, setRelatedSlides] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(NEWS_LIST_API, {
          signal: ac.signal,
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        setRelatedSlides(mapNewsListForCarousel(json));
      } catch (e) {
        console.error("Fetch /api/news failed:", e);
        setRelatedSlides([]);
      } finally {
        setLoadingRelated(false);
      }
    })();
    return () => ac.abort();
  }, []);

  /* ====== 圖片處理 ====== */
  const awardSorted = useMemo(() => getSortedAwardImages(news), [news]);

  const order1 =
    getImageByOrder(news, 1) || awardSorted[0] || pickCoverFallback(news);

  const order2 =
    getImageByOrder(news, 2) || awardSorted[0] || pickCoverFallback(news);

  const order3 =
    getImageByOrder(news, 3) || awardSorted[0] || pickCoverFallback(news);

  const slidesSorted = awardSorted.length
    ? awardSorted
    : [pickCoverFallback(news)];

  const idxOfOrder2 = slidesSorted.findIndex((x) => Number(x.sort) === 2);

  const descTextRaw =
    news?.intro || news?.description || news?.content || news?.excerpt || "";

  const descText = useMemo(() => normalizeDescText(descTextRaw), [descTextRaw]);

  const lbSlides = useMemo(
    () =>
      slidesSorted.map((img, i) => ({
        src: img.src,
        title: img.title, // 保留標題
        description: img.alt, // ← 說明文字改為該圖的 alt
        alt: img.alt, // 也一併保留 alt 欄位
        download: `${news?.work_name || news?.award_name_tw || "image"}-${
          i + 1
        }.jpg`,
      })),
    [slidesSorted, news?.work_name, news?.award_name_tw],
  );

  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const openLB = useCallback(
    () => setLbOpen(true) || setLbIndex(idxOfOrder2 >= 0 ? idxOfOrder2 : 0),
    [idxOfOrder2],
  );

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  /* 右側資訊（保留您的呈現） */
  const infoList = [
    { label: "得獎名稱 (EN)", value: news?.award_name_en },
    { label: "得獎名稱 (TW)", value: news?.award_name_tw },
    { label: "作品名稱", value: news?.work_name },

    // 先顯示設計師
    { label: "設計師", value: news?.designer },

    // 再顯示得獎日期
    {
      label: "得獎日期",
      value:
        news?.publish_date ||
        news?.date ||
        (news?.publishISO
          ? new Date(news.publishISO).toLocaleDateString("zh-TW")
          : ""),
    },
  ].filter((x) => !!x.value);

  /* 相關卡片資料 */
  const cardsForSlider = useMemo(() => {
    const base =
      relatedSlides && relatedSlides.length
        ? relatedSlides
        : slidesSorted.slice(0, 8).map((img, i) => ({
            id: i,
            title: news?.title || news?.award_name_tw || `圖片 ${i + 1}`,
            image: img.src,
            alt: img.alt || news?.title || `圖片 ${i + 1}`,
            link: "#",
          }));
    return base.slice(0, 16);
  }, [relatedSlides, slidesSorted, news?.title, news?.award_name_tw]);

  const awardLink = news?.award_link || "";

  /* ------------------ Render ------------------ */
  return (
    <>
      {/* 頂部區塊 */}
      <section className="relative pt-[140px] aspect-[16/5] flex flex-col justify-center items-center pb-10 bg-[url('/images/awards/S__14745649.webp')] bg-cover bg-no-repeat bg-center">
        {/* 黑色透明遮罩（可調整透明度） */}
        <div className="absolute inset-0 bg-black/55 md:bg-black/45"></div>

        <div className="relative z-10 max-w-[1200px] w-[92%] mx-auto text-center">
          {/* 桌機版（不換行） */}
          <h1 className="hidden md:block mt-1 text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-100">
            {HERO_MAIN}
          </h1>
          {/* 行動版（保留橫線並換行） */}
          <h1 className="md:hidden mt-1 text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-100 whitespace-pre-line">
            {HERO_MAIN_MOBILE}
          </h1>

          <div className="mt-6">
            {HERO_SUB ? (
              <h2 className="text-[16px] md:text-2xl xl:text-3xl font-semibold text-neutral-100">
                {HERO_SUB}
              </h2>
            ) : null}
          </div>
        </div>
      </section>

      {/* 說明 + 中間大圖（👉 sort_order=1） */}
      <section className="max-w-[1300px]  px-6 mx-auto py-10">
        <div className="info sm:w-[90%] w-full xl:w-[80%] mx-auto border-l-2 sm:border-l-3 border-black pl-3 sm:pl-5">
          {descText ? (
            <p className="leading-loose tracking-wider whitespace-pre-line">
              {descText}
            </p>
          ) : (
            <p className="leading-loose tracking-wider">
              這是新聞內頁的預設敘述。
            </p>
          )}
        </div>

        <div className="design-img flex w-[70%] mx-auto justify-center mt-8">
          <Image
            src={order1.src}
            alt={order1.alt}
            title={order1.title}
            priority
            className="max-w-[370px] w-full"
            width={1000}
            height={600}
          />
        </div>
      </section>

      {/* Lightbox 觸發縮圖（👉 sort_order=2） */}
      <section className="overflow-hidden ">
        <div className="w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* 圖片容器：跟下方內容同寬，16:9 比例 */}
          <div className="relative w-full overflow-hidden aspect-[16/9]">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="開啟圖片瀏覽"
              onClick={openLB}
            >
              <Image
                src={order2.src}
                alt={order2.alt}
                title={order2.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                className="object-cover"
                priority={false}
              />
            </button>
          </div>

          {/* 下方按鈕：置中 */}
          <div className="flex justify-center">
            <button
              type="button"
              aria-label="開啟圖片瀏覽"
              onClick={openLB}
              className="mt-3 text-sm sm:text-[16px] border bg-[#d09946] rounded-lg px-4 py-2 text白 hover:text-white"
            >
              點擊看更多得獎照片
            </button>
          </div>
        </div>
      </section>

      {/* 資訊 + 左側代表圖（👉 固定使用 sort_order=3） */}
      <section
        className="section-awards-info  py-7 max-w-[1400px] mx-auto"
        aria-labelledby="award-title"
      >
        <div className="w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* 左：代表圖（sort_order=3） */}
            <figure className=" w-full lg:w-[80%] mx-auto sm:mx-0 py-3 lg:py-14 mt-8 focus-visible:outline-none">
              {/* 外層容器：控制最大寬度＋固定比例 */}
              <div
                className="
      relative mx-auto w-full 
   
      outline-none
    "
                tabIndex={-1}
              >
                <Image
                  src={order3.src}
                  alt={order3.alt}
                  title={order3.title}
                  width={1000}
                  height={1000}
                  priority
                  // 高度撐滿容器、寬度置中，保留灰色 ring
                  className="object-contain mx-auto ring-1 ring-black/0 outline-none focus:outline-none focus-visible:outline-none"
                  sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 480px"
                />
              </div>
            </figure>

            {/* 右：資訊清單 */}
            <div className="flex flex-col items-start px-4  justify-center">
              <div className="max-w-[1200px] w-[92%]">
                <h2 className="mt-1 text-xl md:text-2xl mb-0 pb-0 xl:text-3xl font-extrabold tracking-tight text-neutral-900">
                  {HERO_MAIN}
                </h2>

                <div className="mt-2">
                  {HERO_SUB ? (
                    <p className="text-xl md:text-2xl xl:text-3xl  mb-6 mt-0 pt-0 font-semibold text-neutral-900">
                      {HERO_SUB}
                    </p>
                  ) : null}
                </div>
              </div>

              <dl className="w-[w-[8em]]">
                {infoList.map((row) => (
                  <div
                    key={row.label}
                    className="py-2 flex  flex-col sm:flex-row sm:items-center sm:gap-3"
                  >
                    <dt className="text-[17px] md:text-[18px] w-[8em]  font-semibold text-neutral-900 ">
                      {row.label}：
                    </dt>
                    <dd className="text-[16px] md:text-[18px]   text-neutral-700 leading-relaxed">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {awardLink ? (
                <div className="mt-6 MoreLink  ">
                  <b className="font-medium text-xl">獲獎連結：</b>
                  <ul className="mt-3 space-y-1 ">
                    <li className="">
                      <a
                        // 🔴 在這裡加入 break-all
                        className="break-all underline-offset-4 hover:underline text-gray-800 hover:text-black"
                        href={awardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {awardLink}
                      </a>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 底部 Slider（使用 Swiper；避免最後張裁切） */}
      <section className="section-others-project  w-full sm:w-[90%] mx-auto">
        <LatestNewsCarousel slides={[]} />
      </section>

      {/* Lightbox（點擊預覽直接從 sort_order=2 開始） */}
      <Lightbox
        open={lbOpen}
        close={() => setLbOpen(false)}
        index={lbIndex}
        slides={lbSlides}
        plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]}
        captions={{ showToggle: true }}
        thumbnails={{ position: "bottom" }}
        zoom={{ maxZoomPixelRatio: 2 }}
        carousel={{ finite: false }}
      />
    </>
  );
}
