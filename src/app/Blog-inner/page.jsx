"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
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

import SwiperCarousel from "../../components/SwiperCarousel/SwiperCard";
import Image from "next/image";
import Link from "next/link";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

/* ====== 小工具：高亮關鍵字 ====== */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Highlight({ text, kw }) {
  if (!kw) return <>{text}</>;
  const reg = new RegExp(`(${escapeRegExp(kw)})`, "ig");
  const parts = String(text).split(reg);
  return (
    <>
      {parts.map((p, i) =>
        reg.test(p) ? (
          <mark key={i} className="bg-yellow-200 px-0.5 rounded">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function About() {
  const containerRef = useRef(null);

  /* ====== GSAP 進場動畫（保留你的原設定，修正清理函式重複問題） ====== */
  useEffect(() => {
    const initGSAPAnimations = () => {
      const ctx = gsap.context(() => {
        const images = document.querySelectorAll(".animate-image-wrapper");

        images.forEach((image, i) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "top center",
              toggleActions: "play none none none",
              id: "imageReveal-" + i,
            },
          });

          tl.fromTo(
            image.querySelector(".overlay"),
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 0.7,
              ease: "power2.inOut",
            }
          )
            .to(image.querySelector(".overlay"), {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              duration: 0.7,
              ease: "power2.inOut",
            })
            .fromTo(
              image.querySelector(".image-container"),
              {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              },
              {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1.5,
                ease: "power3.inOut",
              },
              "-=0.5"
            );
        });

        ScrollTrigger.refresh();
      }, containerRef);

      return ctx;
    };

    let ctx;
    const onTransitionComplete = () => {
      ctx = initGSAPAnimations();
    };

    window.addEventListener("pageTransitionComplete", onTransitionComplete);

    if (!sessionStorage.getItem("transitioning")) {
      ctx = initGSAPAnimations();
    } else {
      sessionStorage.removeItem("transitioning");
    }

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete
      );
    };
  }, []);

  /* ====== 模擬推薦卡片資料（也拿來當側欄搜尋的資料源） ====== */
  const staticSlides = [
    {
      title: "小資裝修專案",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kumu_mv-1920x1280.jpg",
      link: "/project/small-budget",
      description: "10-30坪小宅改造，重點抓在機能與動線。",
    },
    {
      title: "商業空間設計",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kaika_mv-1920x1280.jpg",
      link: "/project/commercial-space",
      description: "品牌識別延伸到空間，打造記憶點。",
    },
    {
      title: "老屋翻新工程",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
      link: "/project/renovation",
      description: "結構安全與水電更新優先，風格再到位。",
    },
    {
      title: "北歐簡約風",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
      link: "/project/nordic-style",
      description: "明亮、木質、留白，舒壓又好住。",
    },
    {
      title: "現代輕奢宅",
      image: "https://www.rebita.co.jp/images/index/solutioncard_bg_2.jpg",
      link: "/project/luxury-modern",
      description: "金屬、石材與燈光層次，低調奢華。",
    },
  ];

  /* ====== 文章主要圖進 Lightbox ====== */
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const slides = useMemo(
    () => [
      {
        src: "https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg",
        title: "側欄小圖 3",
        description: "Small viewer image #3",
        download: "side-3.jpg",
      },
      {
        src: "https://static.wixstatic.com/media/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg/v1/fill/w_740,h_497,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg",
        title: "推薦文章封面",
        description: "Swiper 卡片圖",
        download: "card-1.jpg",
      },
    ],
    []
  );

  const openAt = useCallback((i) => {
    setLbIndex(i);
    setLbOpen(true);
  }, []);

  /* ====== 側欄搜尋狀態與結果 ====== */
  const [sideQ, setSideQ] = useState("");
  const [sideFocused, setSideFocused] = useState(false);

  // 搜尋資料源：主文 + 靜態卡片（可改為你的實際文章清單）
  const searchData = useMemo(
    () => [
      {
        id: "post-main",
        title: "高評價民宿設計關鍵：空間、細節一次到位",
        description: "空間規劃、設計語言、細節與維護，全面提升體驗與回訪率。",
        image:
          "https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg",
        link: "/blog/guesthouse-keys",
        meta: "台中市 西屯區｜住宅/北歐",
      },
      ...staticSlides.map((s, i) => ({
        id: `static-${i}`,
        title: s.title,
        description: s.description,
        image: s.image,
        link: s.link,
        meta: "推薦專題",
      })),
    ],
    [staticSlides]
  );

  const sideResults = useMemo(() => {
    const q = sideQ.trim().toLowerCase();
    if (!q) return [];
    return searchData
      .filter((it) =>
        [it.title, it.description, it.meta]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [sideQ, searchData]);

  return (
    <ReactLenis root>
      <div className="bg-[#f8f8f8] pt-20" ref={containerRef}>
        {/* 麵包屑 */}
        <div className="navgation max-w-[1920px] !w-[85%] mt-[90px] mx-auto  flex">
          <div className="border bg-white/20 hover:bg-white/90 transition duration-300 rounded-md px-4 py-2 flex">
            <Link href="/blog">
              <span>Blog文章總覽</span>
            </Link>
            <div>
              <span className="mx-3">/</span>
            </div>
            <Link href="/">
              <span>雲林虎尾</span>
            </Link>
          </div>
        </div>
        <div className="max-w-[1920px] w-[85%] mx-auto flex mt-10 justify-between ">
          <div className="flex text-[14px] justify-center items-center">
            {" "}
            <b>發布日期:</b>
            <span>2025/05/23</span>
          </div>
          <div className="flex text-[14px] justify-center items-center">
            {" "}
            <b>觀看次數:</b>
            <span>45</span>
          </div>
        </div>

        <section className="py-5 flex flex-col lg:flex-row pt-8 mt-5 sm:pb-[80px] max-w-[1920px] mx-auto w-full px-4 sn:px-0 sm:w-[95%] 2xl:w-[88%]">
          {/* 左側：目錄（保留樣式） */}
          <div className="w-full lg:w-[15%]">
            <div className="sticky pl-5 top-24">
              <div className="border-b-1 border-gray-400 pb-5">
                <span className="text-[16px] gray-800">快速導覽</span>
              </div>
              <div className="items flex flex-col">
                {[
                  "掌握空間規劃，讓動線與使用更直覺",
                  "統一設計語言，打造一眼認出的風格",
                  "把細節做好，體感分數自然上來",
                  "兼顧美觀與維護，營運更省心",
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className="border-b-1 py-5 border-gray-400 flex justify-center items-center"
                  >
                    <div className="dots">
                      <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4" />
                    </div>
                    <span className="text-gray-800 text-[14px]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 文章內容 */}
          <div className="flex w-full lg:w-[60%] px-8 flex-col">
            <article className="mx-auto w-[92%] max-w-3xl py-10 text-gray-800">
              {/* Hero */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                  src="https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg"
                  alt="高評價民宿設計關鍵：空間、細節一次到位"
                  fill
                  className="object-cover cursor-zoom-in"
                  priority
                  onClick={() => openAt(0)}
                />
              </div>

              {/* Title & meta */}
              <header className="mt-8">
                <h1 className="text-3xl font-semibold leading-tight">
                  高評價民宿設計關鍵：空間、細節一次到位
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  重點整理版｜來源：捌程室內設計 8 Distance
                </p>
              </header>

              {/* Intro */}
              <p className="mt-6 leading-8">
                在競爭激烈的旅宿市場，一間能拿到高評價的民宿，往往不是「只要好看」就夠了；從
                <span className="font-medium">空間規劃</span>、
                <span className="font-medium">風格一致性</span> 到
                <span className="font-medium">細節、品牌與維護</span>
                ，每一環都會直接影響入住體驗與回訪率。以下整理實作重點，協助你打造有記憶點、又好經營的民宿空間。
              </p>

              {/* Section 1 */}
              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">
                  1｜掌握空間規劃，讓動線與使用更直覺
                </h2>
                <p className="mb-4 leading-8">
                  民宿不同於一般住宅，需要同時兼顧
                  <span className="font-medium">共享區域</span>與
                  <span className="font-medium">私密空間</span>
                  。良好的配置能提升住宿舒適度，也能降低營運維護成本。
                </p>
                <ul className="list-disc space-y-2 pl-6 leading-8">
                  <li>
                    <span className="font-medium">公共區域：</span>
                    客廳、餐廚或交誼空間採
                    <span className="font-medium">開放且順暢的動線</span>
                    ，方便互動。
                  </li>
                  <li>
                    <span className="font-medium">客房配置：</span>
                    依客群規劃雙人／家庭房，確保
                    <span className="font-medium">完善衛浴與足夠收納</span>。
                  </li>
                  <li>
                    <span className="font-medium">彈性機能：</span>
                    活動隔間、滑門等
                    <span className="font-medium">可變空間</span>
                    ，對淡旺季或長短租都更友善。
                  </li>
                </ul>
              </section>

              {/* 圖片 2 */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 mt-10">
                <Image
                  src="https://static.wixstatic.com/media/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg/v1/fill/w_740,h_497,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg"
                  alt="高評價民宿設計關鍵：空間、細節一次到位"
                  fill
                  className="object-cover cursor-zoom-in"
                  priority
                  onClick={() => openAt(1)}
                />
              </div>

              {/* Section 2 */}
              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">
                  2｜統一設計語言，打造一眼認出的風格
                </h2>
                <p className="mb-4 leading-8">
                  想在平台與社群上脫穎而出，必須有
                  <span className="font-medium">一致的視覺與材質語言</span>
                  。不論日式侘寂、北歐簡約、工業或鄉村風，都應從色彩、材質到家具選擇保持同調。
                </p>
                <ul className="list-disc space-y-2 pl-6 leading-8">
                  <li>避免「拼貼式風格」，維持整體一致與專業度。</li>
                  <li>結合在地元素或文化符號，增強識別與記憶點。</li>
                  <li>以目標客群與區域調性為主軸，做深做滿。</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">
                  3｜把細節做好，體感分數自然上來
                </h2>
                <p className="mb-4 leading-8">
                  高評價的關鍵常藏在細節：燈光、插座、布品、五金與香氛等都會影響體驗。
                </p>
                <ul className="list-disc space-y-2 pl-6 leading-8">
                  <li>
                    <span className="font-medium">照明層次：</span>
                    主燈＋間接光＋床頭閱讀燈，夜間更舒適。
                  </li>
                  <li>
                    <span className="font-medium">電源配置：</span>插座與 USB
                    位置貼近使用情境，減少延長線與動線干擾。
                  </li>
                  <li>
                    <span className="font-medium">布品等級：</span>以
                    <span className="font-medium">飯店等級</span>
                    床單、枕頭、浴巾提升觸感與衛生感。
                  </li>
                  <li>
                    <span className="font-medium">五金配件：</span>
                    毛巾掛架、置物層板、門把與鉸鏈選耐用款。
                  </li>
                  <li>
                    <span className="font-medium">氣味與陳列：</span>
                    選擇與品牌調性一致的香氛與小物，營造在地記憶。
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">
                  4｜品牌感與視覺識別：讓每個角落都能被打卡
                </h2>
                <p className="mb-4 leading-8">
                  於社群時代，強烈的
                  <span className="font-medium">品牌識別</span>
                  能快速累積口碑。從 Logo、門牌、引導牌到房卡與小卡，視覺系統要
                  <span className="font-medium">一致且好拍</span>。
                </p>
                <ul className="list-disc space-y-2 pl-6 leading-8">
                  <li>把品牌色與材質語言延伸到空間細節與備品。</li>
                  <li>規劃「打卡牆」或小型裝置，創造自然擴散點。</li>
                  <li>每個轉角皆可成為旅客記憶框景。</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">
                  5｜兼顧美觀與維護，營運更省心
                </h2>
                <p className="mb-4 leading-8">
                  長期營運必須考量清潔與維修效率。選材、櫃體與設備應同時滿足
                  <span className="font-medium">耐用、易保養、易替換</span>。
                </p>
                <ul className="list-disc space-y-2 pl-6 leading-8">
                  <li>地坪與牆面選擇抗污、防潮、易清潔材質。</li>
                  <li>衛浴設備挑選維修資源充足的品牌，備品規格一致化。</li>
                  <li>水電與機電預留檢修空間，後續升級不拆大面。</li>
                </ul>
              </section>

              {/* CTA */}
              <section className="mt-12 border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">
                  需要一起規劃你的民宿嗎？
                </h3>
                <p className="mt-2 leading-8">
                  若你正要籌備或優化民宿，我們可依據品牌定位、空間條件與預算，
                  提供從規劃到落地的完整服務，讓空間更有辨識度也更好管理。
                </p>
              </section>

              {/* Source note */}
              <p className="mt-8 text-xs leading-6 text-gray-500">
                本文為參考
                <a
                  href="https://www.8distance.com/post/%E9%AB%98%E8%A9%95%E5%83%B9%E6%B0%91%E5%AE%BF%E8%A8%AD%E8%A8%88%E9%97%9C%E9%8D%B5%EF%BC%9A%E7%A9%BA%E9%96%93%E3%80%81%E7%B4%B0%E7%AF%80%E4%B8%80%E6%AC%A1%E5%88%B0%E4%BD%8D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 underline"
                >
                  8 Distance：高評價民宿設計關鍵：空間、細節一次到位
                </a>
                之整理（非逐字轉載）。
              </p>
            </article>
          </div>

          {/* 右側欄（含搜尋） */}
          <div className="w-full py-10 px-5 sm:px-0 lg:py-0 sm:w-[60%] mx-auto lg:w-[25%] pr-8 flex flex-col">
            <div className="sticky my-4 top-24">
              <div className="right-bar bg-white sticky top-20 py-8 rounded-2xl border border-gray-100">
                <div className="mx-auto rounded-[22px] relative bg-black p-4 flex justify-center max-w-[120px] items-center">
                  <div className="absolute color bg-[#323936] w-full h-full rounded-[22px] rotate-12" />
                  <Image
                    src="/images/捌程室內設計.png.avif"
                    width={500}
                    height={500}
                    alt="logo"
                    placeholder="empty"
                    className="w-full z-50"
                    loading="lazy"
                  />
                </div>

                <div className="txt flex justify-center flex-col items-center mt-5 px-8">
                  <b>捌程室內設計 | 8 Distance</b>
                  <p className="text-[14px] text-gray-700 text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem fugiat quasi quis consequatur.
                  </p>
                </div>

                {/* 社群 icons */}
                <div className="social flex justify-center mt-4 mx-auto">
                  {/* IG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 48 48"
                  >
                    <radialGradient
                      id="ig1"
                      cx="19.38"
                      cy="42.035"
                      r="44.899"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fd5" />
                      <stop offset=".328" stopColor="#ff543f" />
                      <stop offset=".348" stopColor="#fc5245" />
                      <stop offset=".504" stopColor="#e64771" />
                      <stop offset=".643" stopColor="#d53e91" />
                      <stop offset=".761" stopColor="#cc39a4" />
                      <stop offset=".841" stopColor="#c837ab" />
                    </radialGradient>
                    <path
                      fill="url(#ig1)"
                      d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"
                    />
                    <path
                      fill="#fff"
                      d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5 s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                    />
                    <circle cx="31.5" cy="16.5" r="1.5" fill="#fff" />
                    <path
                      fill="#fff"
                      d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12 C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                    />
                  </svg>
                  {/* FB */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 48 48"
                  >
                    <linearGradient
                      id="fb1"
                      x1="9.993"
                      x2="40.615"
                      y1="9.993"
                      y2="40.615"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#2aa4f4" />
                      <stop offset="1" stopColor="#007ad9" />
                    </linearGradient>
                    <path
                      fill="url(#fb1)"
                      d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                    />
                    <path
                      fill="#fff"
                      d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                    />
                  </svg>
                  {/* LINE-like */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 48 48"
                  >
                    <linearGradient
                      id="ln1"
                      x1="4.522"
                      x2="45.203"
                      y1="2.362"
                      y2="47.554"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#33c481" />
                      <stop offset="1" stopColor="#21a366" />
                    </linearGradient>
                    <path
                      fill="url(#ln1)"
                      d="M8,42h32c1.105,0,2-0.895,2-2V8c0-1.105-0.895-2-2-2H8C6.895,6,6,6.895,6,8v32  C6,41.105,6.895,42,8,42z"
                    />
                    <path
                      fill="#fff"
                      d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637 c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185 c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611 C36.203,26.879,37.113,24.764,37.113,22.417z"
                    />
                  </svg>
                </div>

                {/* ===== 側邊欄搜尋 ===== */}
                <div className="others-article mt-5">
                  <div className="article-item px-8 group flex">
                    <div className="txt w-full transition duration-400">
                      <b>Article Title</b>
                      <p className="text-[14px] text-gray-800">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Aliquid vero praesentium iusto illo, consectetur
                        quae?
                      </p>
                    </div>
                  </div>

                  <div className="search px-8 mt-6">
                    <label className="mb-1 block text-xs tracking-wider text-gray-500">
                      快速搜尋
                    </label>
                    <div className="relative">
                      <input
                        value={sideQ}
                        onChange={(e) => setSideQ(e.target.value)}
                        onFocus={() => setSideFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setSideFocused(false), 150)
                        }
                        type="text"
                        placeholder="輸入關鍵字（標題 / 內文 / 主題）"
                        className="w-full h-11 rounded-full pl-11 pr-10 border border-gray-200 bg-white/90 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
                      />
                      {/* search icon */}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M20 20l-3.5-3.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      {/* clear */}
                      {sideQ && (
                        <button
                          onClick={() => setSideQ("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label="清除搜尋"
                          type="button"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M6 6l12 12M18 6L6 18"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* 結果卡片 */}
                    {(sideFocused || sideQ) && (
                      <div className="mt-3 space-y-2">
                        {sideQ && sideResults.length === 0 && (
                          <div className="text-sm text-gray-500 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                            找不到相符項目
                          </div>
                        )}

                        {sideResults.map((it) => (
                          <Link key={it.id} href={it.link}>
                            <div className="group flex gap-3 items-center p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition">
                              <div className="relative w-[96px] h-[72px] rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={it.image}
                                  alt={it.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="96px"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                  <Highlight text={it.title} kw={sideQ} />
                                </div>
                                {it.meta && (
                                  <div className="text-[12px] text-gray-600 mt-0.5">
                                    {it.meta}
                                  </div>
                                )}
                                <div className="text-[12px] text-gray-500 line-clamp-2">
                                  <Highlight text={it.description} kw={sideQ} />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}

                        {sideResults.length >= 6 && (
                          <div className="text-[12px] text-gray-500 px-1">
                            只顯示前 6 筆，請輸入更精準的關鍵字以縮小範圍
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 基本資訊卡 */}
                  <div className="main-info bg-white rounded-lg p-8 grid grid-cols-2 mt-6">
                    <div className="flex flex-col">
                      <b className="text-[14px] mt-3">室內坪數：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        35 坪
                      </span>

                      <b className="text-[14px] mt-3">案件地點：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        台中市西屯區
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <b className="text-[14px] mt-3">風格：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        現代簡約
                      </span>

                      <b className="text-[14px] mt-3">格局：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        3 房 2 廳 2 衛
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <b className="text-[14px] mt-3">色系：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        木質暖白
                      </span>

                      <b className="text-[14px] mt-3">空間佔比：</b>
                      <span className="text-[14px] mt-1 text-gray-700">
                        客廳 30%｜餐廳 20%｜臥室 40%｜其他 10%
                      </span>
                    </div>
                  </div>

                  {/* 小圖 viewer 區 */}
                  <div className="small-viewer-project p-5">
                    {[
                      "https://kon-sumai.com/wp/wp-content/uploads/2023/11/9-8-2048x1357.jpg",
                      "https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20078ss.jpg",
                      "https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20066Res-2048x1365.jpg",
                    ].map((src, i) => (
                      <div
                        className="flex flex-row justify-between my-3"
                        key={i}
                      >
                        <div className="img w-1/2">
                          <Image
                            src={src}
                            placeholder="empty"
                            loading="lazy"
                            alt={`small-img-${i}`}
                            width={400}
                            height={30}
                            className="w-full"
                          />
                        </div>
                        <div className="arrow w-1/2 flex flex-col justify-between p-4">
                          <div className="flex flex-col">
                            <b className="text-[.95rem]">Name</b>
                            <span className="text-[.8rem] leading-snug ">
                              Lorem ipsum dolor consectetur
                            </span>
                          </div>
                          <b className="text-[.95rem] ">Go Project</b>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 上下頁導覽（修正 className 與 fillRule/clipRule） */}
        <section className="section_navgation flex flex-row">
          {/* <div className="flex w-full md:w-[70%] mx-auto">
            <div className="Navgation_Prev group hover:scale-[1.02] duration-400 w-1/2 px-8">
              <div className="flex flex-col justify-start items-start">
                <b className="text-[.9rem] tracking-wide w-3/4 text-left font-bold">
                  〈COGNOMEN〉 25AW “WORKER-MAN
                  ATHLETE”的預購活動將於下週末為期三天舉辦！！
                </b>
                <span className="text-[.8rem] mt-3">Categories: XXXXXXX</span>
                <button className="mt-4  relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#1b8bed] px-6 font-medium text-neutral-200 duration-500">
                  <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
                    <div className="absolute translate-x-0 opacity-0 transition group-hover:-translate-x-6 group-hover:opacity-100 rotate-180">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="pl-6">Hover</span>
                    <div className=" absolute  right-0 translate-x-12 opacity-100 transition group-hover:translate-x-6 group-hover:opacity-0">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                      >
                        <path
                          d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="Navgation_Next hover:scale-[1.02] duration-400 w-1/2 group px-8">
              <div className="flex flex-col justify-end items-end">
                <b className="text-[.9rem] w-3/4 text-right tracking-wide font-bold">
                  〈COGNOMEN〉 25AW “WORKER-MAN
                  ATHLETE”的預購活動將於下週末為期三天舉辦！！
                </b>
                <span className="text-[.8rem] mt-3">Categories: XXXXXXX</span>
                <button className="mt-4 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#1b8bed] px-6 font-medium text-neutral-200 duration-500">
                  <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
                    <div className="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                      >
                        <path
                          d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <span className="pl-6">Hover</span>
                    <div className="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div> */}
        </section>

        {/* 底部推薦 Swiper（保留） */}
        <section className="flex pl-20 flex-col py-4 lg:py-[60px] ">
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-4xl text-stone-800">對我們作品有興趣嗎？</h3>
            <button className="bg-[#f7a438] mt-3 text-stone-800 rounded-[30px] font-bold px-4 border border-gray-300 py-1">
              協助貸款
            </button>

            <input
              type="text"
              placeholder="歡迎聯繫我們"
              className="rounded-[40px] py-2 w-[90%] max-w-[800px] mt-10 px-5"
            />
          </div>

          <div className="FB-reels mt-10 flex sm:flex-row flex-col">
            <div className="w-full sm:w-[10%] flex items-center justify-center sm:justify-end">
              <div className="card-text flex flex-col justify-center items-center text-center">
                <div className="flex flex-row justify-center items-center sm:flex-col">
                  <h2 className="m-0 text-[9.5vmin] text-[#222222] tracking-wide rotate-0 sm:rotate-90">
                    IDEA
                  </h2>

                  <div className="project-amount text-white my-0 mb-0 sm:my-16 bg-black flex justify-center items-center rounded-full w-10 h-10 sm:w-8 sm:h-8 text-[1rem] sm:text-[0.9rem]">
                    23
                  </div>
                </div>

                <span className="text-[1.2rem] sm:text-[1.4rem] text-[#1c1c1c] mb-5 sm:mt-10">
                  創意想法案件
                </span>
              </div>
            </div>

            <div className="w-[90%] overflow-hidden">
              <SwiperCarousel />
            </div>
          </div>
        </section>

        <section className="pb-5 xl:pb-[100px] w-full overflow-hidden">
          <div className="title p-10">
            <h2 className="text-center text-[4vmin] font-bold">其他好文推薦</h2>
            <Link
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61550958051323&sk=photos"
              className="icon flex justify-center items-center"
            ></Link>
          </div>

          <div className="w-full pb-20">
            <Swiper
              modules={[Pagination, A11y, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              speed={1200}
              spaceBetween={16}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1.2 },
                480: { slidesPerView: 2 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4.5 },
              }}
              className="m-0 p-0 h-[450px] !overflow-visible sm:!overflow-hidden"
            >
              {staticSlides.map((slide, idx) => (
                <SwiperSlide
                  key={idx}
                  className="mx-2 group overflow-hidden relative duration-1000"
                >
                  <div className="w-full fkex flex-col">
                    <div className="img relative overflow-hidden">
                      <div className="mask opacity-0 group-hover:opacity-100 transition duration-400 w-full h-full absolute z-30 bg-black/30" />
                      <div className="write-people opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="w-[45px] flex h-[45px] bg-slate-100 rounded-full absolute top-5 left-5 z-40">
                          <div className="name text-black flex justify-center items-center ml-3 text-[9px]">
                            USER
                          </div>
                        </div>
                      </div>
                      <Image
                        src="/images/index/老屋翻新-李宅.webp"
                        alt="article"
                        placeholder="empty"
                        loading="lazy"
                        width={400}
                        height={300}
                        className="w-full scale-100 group-hover:scale-105 transition duration-400"
                      />
                    </div>
                    <div className="info mt-4">
                      <div className="top flex justify-between">
                        <b className="text-[14px]">2025.08.11</b>
                        <div className="rounded-full w-[20px] h-[20px] bg-[#189ed8]" />
                      </div>
                      <div className="flex flex-col py-2">
                        <b>{slide.title}</b>
                        <span className="text-[13px] leading-relaxed w-[80%]">
                          {slide.description}
                        </span>
                      </div>
                      <div className="tags flex flex-wrap">
                        <span className="text-[13px] mr-2 text-gray-700">
                          #室內設計
                        </span>
                        <span className="text-[13px] mr-2 text-gray-700">
                          #小宅
                        </span>
                        <span className="text-[13px] mr-2 text-gray-700">
                          #100萬內
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>

      {/* Lightbox */}
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
  );
}

/* ===== 使用說明 =====
1) 側欄搜尋目前搜尋的是 searchData（主文 + 靜態卡片），要接真實文章只需把 searchData 換成你的資料。
2) 若外部圖源報錯，請在 next.config.js 的 images.domains 加入：
   static.wixstatic.com、rebita.co.jp、kon-sumai.com
*/
