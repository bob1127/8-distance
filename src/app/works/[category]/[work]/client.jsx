"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ReactLenis } from "@studio-freight/react-lenis";
import MiniMapGallery from "../../../../components/MiniMapGallery";
import { useParams } from "next/navigation";
import Link from "next/link";
/* ✅ Embla（不自動播放） */
import useEmblaCarousel from "embla-carousel-react";

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

gsap.registerPlugin(CustomEase);

/* --------- 小工具：安全字串與 alt/title 防呆 --------- */
const s = (v) => (typeof v === "string" ? v.trim() : "");
const pickAlt = (...cands) => s(cands.find((x) => s(x)) || "gallery-image");
const pickTitle = (...cands) => s(cands.find((x) => s(x)) || "gallery-image");

function decodeMany(input = "") {
  let out = String(input || "");
  for (let i = 0; i < 2; i++) {
    try {
      const d = decodeURIComponent(out);
      if (d === out) break;
      out = d;
    } catch {
      break;
    }
  }
  return out;
}
function encodeSegOnce(input = "") {
  return encodeURIComponent(decodeMany(input));
}

const mapItem = (it, i = 0) => {
  const src = s(it?.image_url ?? it?.src ?? "");
  if (!src) return null;
  return {
    src,
    alt: pickAlt(it?.image_alt ?? it?.alt),
    title: pickTitle(it?.image_title ?? it?.title),
    _i: i,
  };
};

export default function Photos({
  title = "作品標題",
  heroImages = [],
  galleryImages = [],
  sidebarCases = [],
  info = {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const params = useParams();

  // ✅ 修改：更聰明地抓取當前分類 Slug
  const categorySegment = useMemo(() => {
    // 1. 優先看路由參數
    const fromRoute = params?.category
      ? Array.isArray(params.category)
        ? params.category[0]
        : params.category
      : "";
    // 如果路由不是數字，直接用
    if (s(fromRoute) && !/^\d+$/.test(s(fromRoute))) return s(fromRoute);

    // 2. 如果路由是數字，嘗試從 info 裡找中文 Slug
    const fromInfo =
      s(info?.classification?.url_slug) || // 優先抓這個 (page.jsx 傳過來的)
      s(info?.classification?.title) ||
      s(info?.category_slug) ||
      s(info?.classification_slug) ||
      s(info?.category) ||
      "";

    if (fromInfo) return fromInfo;

    // 3. 真的沒辦法才回退到 ID
    return s(String(info?.classification_id ?? info?.category_id ?? ""));
  }, [params, info]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  /* ---------- HERO ---------- */
  const heroSrcs = useMemo(() => {
    if (s(info?.detail_image_url)) return [s(info.detail_image_url)];
    if (Array.isArray(heroImages) && heroImages.length > 0) {
      return heroImages.map((x) => s(x?.src)).filter(Boolean);
    }
    return [
      "/images/index/b69ff1_ed3.jpg.avif",
      "/images/index/b69ff1_2e8.jpg.avif",
      "/images/index/b69ff1_dbf.jpg.avif",
    ];
  }, [info?.detail_image_url, heroImages]);

  const heroImgAlt = pickAlt(info?.detail_image_alt, info?.image_alt, title);
  const heroImgTitle = pickTitle(
    info?.detail_image_title,
    info?.image_title,
    title
  );

  useEffect(() => {
    if (heroSrcs.length <= 1) return;
    const t = setInterval(
      () => setCurrentIndex((p) => (p + 1) % heroSrcs.length),
      5000
    );
    return () => clearInterval(t);
  }, [heroSrcs]);

  /* ---------- GALLERY 3 欄 ---------- */
  const galleryCols = useMemo(() => {
    const ai = info?.award_images;
    if (ai && typeof ai === "object" && !Array.isArray(ai)) {
      return [
        (ai.column_1 || []).map(mapItem).filter(Boolean),
        (ai.column_2 || []).map(mapItem).filter(Boolean),
        (ai.column_3 || []).map(mapItem).filter(Boolean),
      ];
    }
    const arr =
      (Array.isArray(ai) && ai) ||
      (Array.isArray(galleryImages) && galleryImages) ||
      [];

    const sorted = arr
      .slice()
      .sort(
        (a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0)
      )
      .map(mapItem)
      .filter(Boolean);

    const cols = [[], [], []];
    sorted.forEach((item, i) => cols[i % 3].push(item));
    return cols;
  }, [info?.award_images, galleryImages]);

  const flatGallery = useMemo(
    () => galleryCols.flat().map((g, i) => ({ ...g, _flatIndex: i })),
    [galleryCols]
  );

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const openGalleryAt = (src) => {
    const idx = flatGallery.findIndex((p) => p.src === src);
    setGalleryStartIndex(idx === -1 ? 0 : idx);
    setGalleryOpen(true);
  };

  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const slides = flatGallery.map((g) => ({
    src: g.src,
    title: g.title,
    description: g.alt || g.title,
    download: (g.title || "image") + ".jpg",
  }));

  /* ========= ✅ 修正重點：Featured Fallback 資料處理 ========= */
  const featuredFallback = useMemo(() => {
    const arr = Array.isArray(info?.featured) ? info.featured : [];

    return arr
      .map((f) => {
        const catSlug =
          s(f?.category_slug) ||
          s(f?.classification_slug) ||
          s(f?.classification?.url_slug) ||
          s(f?.category) ||
          "";

        // ✅ 這裡也要加入 name 作為 fallback
        const workSlug =
          s(f?.url_slug) ||
          s(f?.name) ||
          s(f?.image_title) ||
          String(f?.id ?? "").trim();

        return {
          id: String(f?.id ?? "").trim(),
          category: catSlug,
          title: s(f?.name) || s(f?.image_title) || "作品圖",
          subtitle: "",
          src: s(f?.image_url) || "/images/placeholder.jpg",
          image_alt: s(f?.image_alt),
          image_title: s(f?.image_title),
          url_slug: workSlug, // 確保這裡存的是中文名稱或 slug
        };
      })
      .filter((x) => x.id && x.src);
  }, [info?.featured]);

  const sidebar = useMemo(() => {
    return Array.isArray(sidebarCases) && sidebarCases.length > 0
      ? sidebarCases
      : featuredFallback;
  }, [sidebarCases, featuredFallback]);

  /* ===== Embla ===== */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: sidebar.length > 1,
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi, onSelect]);
  const scrollTo = (i) => emblaApi?.scrollTo(i);

  const isEmptyValue = (v) => {
    const t = s(v);
    return !t || t === "-" || t === "—";
  };

  const F = (label, value) =>
    isEmptyValue(value) ? null : (
      <div className="flex flex-col">
        <b className="text-stone-800 !font-extrabold text-[18px]">{label}</b>
        <span className="mt-1 text-stone-700">{value}</span>
      </div>
    );

  /* ===== ✅ 修正重點：buildHref 邏輯 ===== */
  const buildHref = (c) => {
    if (s(c?.href)) return c.href;

    // ✅ 加入 name 和 title 到判斷鏈中
    const workSegRaw =
      s(c?.url_slug) ||
      s(c?.slug) ||
      s(c?.name) || // 新增：嘗試抓取中文名稱
      s(c?.title) || // 新增：嘗試抓取中文標題
      s(c?.work_id) ||
      s(c?.id) ||
      s(c?.detail_id) ||
      s(c?.sort_order);

    if (!workSegRaw) return "#";

    let catSegRaw = s(c?.category);

    if (!catSegRaw || /^\d+$/.test(catSegRaw)) {
      if (s(categorySegment) && !/^\d+$/.test(categorySegment)) {
        catSegRaw = categorySegment;
      }
    }

    if (!catSegRaw) catSegRaw = s(categorySegment);
    if (!catSegRaw) return "#";

    const workSeg = encodeSegOnce(workSegRaw);
    const catSeg = encodeSegOnce(catSegRaw);
    return `/works/${catSeg}/${workSeg}`;
  };

  const awardRecord = (() => {
    const T = (v) =>
      v == null
        ? ""
        : String(v)
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const I = info && typeof info.work === "object" ? info.work : info;

    if (T(I?.award_record)) return T(I.award_record);

    const name =
      T(I?.award_name_tw) ||
      T(I?.award_name_en) ||
      T(I?.award_title) ||
      T(I?.award) ||
      T(I?.awards_title) ||
      T(I?.awards?.[0]?.name) ||
      T(I?.awards?.[0]?.title) ||
      T(I?.awards?.[0]?.award_name_tw) ||
      T(I?.awards?.[0]?.award_name_en);

    const level =
      T(I?.award_level) ||
      T(I?.award_result) ||
      T(I?.award_prize) ||
      T(I?.prize) ||
      T(I?.level) ||
      T(I?.awards?.[0]?.level) ||
      T(I?.awards?.[0]?.prize) ||
      T(I?.awards?.[0]?.result);

    const combined =
      T(I?.award_text) ||
      T(I?.award_full) ||
      T(I?.awardSummary) ||
      T(I?.award_desc) ||
      T(I?.awards?.[0]?.text);

    if (combined) return combined;
    if (name && level) return `${name} - ${level}`;
    if (name) return name;
    if (level) return level;
    return "";
  })();

  return (
    <ReactLenis root>
      <div className="bg-[#f1f1f1] overflow-visible">
        {/* ===== HERO ===== */}
        <section className="relative flex justify-center items-center h-screen  pt-[150px]  pb-[100px] overflow-visible">
          <Image
            src={heroSrcs[currentIndex] ?? heroSrcs[0]}
            alt={heroImgAlt}
            title={heroImgTitle}
            fill
            className="absolute inset-0 object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10">
            <h1 className="title py-20 flex justify-center text-2xl md:text-4xl text-white">
              {title}
            </h1>
          </div>
        </section>

        {/* ===== 作品資訊（淺黃色） ===== */}
        <section
          aria-label="作品基本資訊"
          className="relative bg-[#f0ebe3] p-5 md:p-10"
        >
          <div className="">
            <div className="mt-5 grid mx-auto max-w-[1300px] w-[90%] grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 text-sm">
              {F("風格", info?.style)}
              {F("坪數", info?.areaPing || info?.area_size)}
              {F("格局", info?.rooms || info?.layout)}
              {F("空間性質", info?.spaceType || info?.space_type)}
              {F("原況格局", info?.originLayout || info?.layout_original)}
              {F("所在地區", info?.region || info?.location)}
              {F("建設公司", info?.builder)}
            </div>
            {awardRecord && (
              <div className="mx-auto max-w-[1300px] w-[90%]">
                <div className=" text-left sm:text-center mt-8">
                  <div className="inline-block px-4 py-2 mb-4 rounded-md bg-[#e8e1d6] text-stone-800 text-[15px] leading-7">
                    {awardRecord}
                  </div>
                </div>
              </div>
            )}

            <div className="mx-auto max-w-[1300px] w-[90%]">
              {(() => {
                const descHTML = s(info?.description);
                const introHTML = s(info?.intro);

                const strip = (h) =>
                  String(h || "")
                    .replace(/<\/p>\s*<p>/gi, " ")
                    .replace(/<br\s*\/?>/gi, " ")
                    .replace(/<[^>]*>/g, "")
                    .replace(/\s+/g, " ")
                    .trim();

                const isDup =
                  descHTML && introHTML && strip(descHTML) === strip(introHTML);

                if (!descHTML && !introHTML) return null;

                return (
                  <div className="text-[15px]  leading-7 text-stone-800 py-0 md:py-10">
                    {descHTML && (
                      <div
                        className={introHTML && !isDup ? "mb-3" : ""}
                        dangerouslySetInnerHTML={{ __html: descHTML }}
                      />
                    )}
                    {introHTML && !isDup && (
                      <div
                        className="opacity-90"
                        dangerouslySetInnerHTML={{ __html: introHTML }}
                      />
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ===== Main ===== */}
        <section className=" px-4 py-8">
          <div className="max-w-[1920px] w-[98%] mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 作品 3 欄 */}
            {galleryCols.slice(0, 3).map((list, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {list.map((img) => (
                  <figure
                    title={img.title}
                    key={`${img.src}-${img._i}`}
                    className="group w-full overflow-hidden cursor-zoom-in relative"
                    onClick={() => {
                      const idx = flatGallery.findIndex(
                        (p) => p.src === img.src
                      );

                      if (isMobile) {
                        setLbIndex(idx === -1 ? 0 : idx);
                        setLbOpen(true);
                      } else {
                        openGalleryAt(img.src);
                      }
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      loading="lazy"
                      className="w-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-50 transition" />
                  </figure>
                ))}
              </div>
            ))}

            <aside className="">
              <div className="">
                {/* ✅ 手機版：Embla 輪播 */}
                <div className="md:hidden">
                  {sidebar.length === 0 ? (
                    <div className="text-sm text-neutral-500 ">
                      尚無同分類其他作品
                    </div>
                  ) : (
                    <>
                      <div
                        ref={emblaRef}
                        className="embla__viewport !w-full overflow-hidden "
                      >
                        <div className="embla__container flex !w-full  will-change-transform">
                          {sidebar.map((c, i) => {
                            const href = buildHref(c);
                            const cardAlt = c?.title || "作品圖";
                            const cardTitle = c?.title || "作品圖";
                            const src =
                              s(c?.src) ||
                              s(c?.image_url) ||
                              "/images/placeholder.jpg";

                            return (
                              <div
                                key={`${src}-${i}`}
                                className="embla__slide !flex-[0_0_100%] !basis-full !min-w-full !max-w-full"
                              >
                                <div className="px-3">
                                  <a
                                    href={href}
                                    title={cardTitle}
                                    className="block overflow-hidden  shadow-md"
                                  >
                                    <div
                                      className="relative object-cover transition-transform group-hover:opacity-100 opacity-85 group-hover:scale-105 filter grayscale group-hover:filter-none w-full"
                                      style={{ paddingTop: "100%" }}
                                    >
                                      <Image
                                        src={src}
                                        alt={cardAlt}
                                        title={cardTitle}
                                        fill
                                        className="absolute inset-0 object-cover"
                                        sizes="100vw"
                                        priority={i < 1}
                                      />
                                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.25)] to-transparent" />
                                      <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-3 pointer-events-none">
                                        <div className="max-w-[90%]">
                                          <h4 className="text-white text-base font-semibold leading-tight">
                                            {c.title}
                                          </h4>
                                          {c.subtitle && (
                                            <p className="text-white/90 text-xs mt-1">
                                              {c.subtitle}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="embla__dots mt-5 flex items中心 justify-center gap-3">
                        {scrollSnaps.map((_, i) => (
                          <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`pill-bullet ${
                              i === selectedIndex ? "is-active" : ""
                            }`}
                            onClick={() => scrollTo(i)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ✅ 桌機版：sticky 清單 */}
                <div className="hidden md:block sticky top-24 space-y-5">
                  {sidebar.length === 0 && (
                    <div className="text-sm text-neutral-500 px-2">
                      尚無同分類其他作品
                    </div>
                  )}

                  {sidebar.map((c, i) => {
                    const href = buildHref(c);
                    const cardAlt = c?.title || "作品圖";
                    const cardTitle = c?.title || "作品圖";
                    const src =
                      s(c?.src) || s(c?.image_url) || "/images/placeholder.jpg";

                    return (
                      <div key={`${src}-${i}`} className="flex justify-end">
                        <a
                          href={href}
                          title={cardTitle}
                          className="
                            group relative w-full md:w-[65%]
                            aspect-square overflow-hidden shadow-md
                            transition-all duration-500 hover:brightness-110 hover:scale-[1.02]
                          "
                        >
                          <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-3 pointer-events-none">
                            <div className="max-w-[90%]">
                              <h4 className="text-white text-base md:text-lg font-semibold leading-tight">
                                {c.title}
                              </h4>
                              {c.subtitle && (
                                <p className="text-white/90 text-xs md:text-sm mt-1">
                                  {c.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.25)] to-transparent" />

                          <Image
                            src={src}
                            alt={cardAlt}
                            title={cardTitle}
                            fill
                            className="
                              object-cover
                              transition-transform group-hover:opacity-100 opacity-85 group-hover:scale-105
                              filter grayscale group-hover:filter-none
                            "
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            priority={false}
                            style={{
                              transition:
                                "transform 700ms cubic-bezier(0.22,0.61,0.36,1), filter 500ms ease",
                            }}
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* ===== 桌機 Lightbox ===== */}
      {mounted &&
        galleryOpen &&
        createPortal(
          <MiniMapGallery
            images={flatGallery.map((g) => ({
              src: g.src,
              alt: g.alt,
              title: g.title,
            }))}
            currentIndex={galleryStartIndex}
            onClose={() => setGalleryOpen(false)}
          />,
          document.body
        )}

      {/* ✅ 手機 Lightbox */}
      {isMobile && (
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
      )}

      <style jsx>{`
        .embla__viewport::-webkit-scrollbar {
          display: none;
        }
        .pill-bullet {
          width: 8px;
          height: 8px;
          background: #111;
          border-radius: 9999px;
          opacity: 0.8;
          transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pill-bullet.is-active {
          width: 36px;
          background: #111;
          opacity: 1;
        }
        @media (min-width: 768px) {
          .pill-bullet {
            width: 6px;
            height: 6px;
          }
          .pill-bullet.is-active {
            width: 44px;
          }
        }
      `}</style>
    </ReactLenis>
  );
}
