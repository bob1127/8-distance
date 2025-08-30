"use client";
import { Suspense } from "react";
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
import HomeSlider from "../../components/HeroSliderHome/page.jsx";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link.js";
import { ReactLenis } from "@studio-freight/react-lenis";
// import HoverItem from "../../components/HoverItem.jsx";
// import AnimatedLink from "../../components/AnimatedLink.js";
import gsap from "gsap";
import Categories from "../../components/categories.jsx";
import ScrollTrigger from "gsap/ScrollTrigger";
import Marquee from "react-fast-marquee";
import { Card, CardBody } from "@nextui-org/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);

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
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            },
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

      return ctx; // return so we can revert later
    };

    let ctx;

    const onTransitionComplete = () => {
      ctx = initGSAPAnimations();
    };

    window.addEventListener("pageTransitionComplete", onTransitionComplete);

    // fallback: 若不是從 transition link 進來，直接初始化
    if (!sessionStorage.getItem("transitioning")) {
      ctx = initGSAPAnimations();
    } else {
      sessionStorage.removeItem("transitioning"); // 清除 flag
    }

    return () => {
      if (ctx) ctx.revert();
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete
      );
    };

    return () => ctx.revert(); // 👈 自動 kill 清理範圍內動畫
  }, []);
  const staticSlides = [
    {
      title: "小資裝修專案",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kumu_mv-1920x1280.jpg",
      link: "/project/small-budget",
    },
    {
      title: "商業空間設計",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kaika_mv-1920x1280.jpg",
      link: "/project/commercial-space",
    },
    {
      title: "老屋翻新工程",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
      link: "/project/renovation",
    },
    {
      title: "北歐簡約風",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
      link: "/project/nordic-style",
    },
    {
      title: "現代輕奢宅",
      image: "https://www.rebita.co.jp/images/index/solutioncard_bg_2.jpg",
      link: "/project/luxury-modern",
    },
  ];
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // 你想放進 Lightbox 的圖片清單（依序給 index）
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

  return (
    <ReactLenis root>
      <div className="bg-[#f8f8f8] pt-20">
        {/* <section className="blog-inner-img">
          <div className="relative h-[70vh] mx-auto w-[98%] ">
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 z-40 w-[600px]">
              <div className="flex flex-col">
                <h1 className="text-white text-5xl font-normal">雲林虎尾</h1>
                <p className="text-slate-50">Interior design</p>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-90px] z-40 max-w-[1000px] w-[80%]"></div>

            <div className="absolute w-full h-full bg-black/20 top-0 left-0 z-30"></div>

            <Image
              src="/images/index/b69ff1_dfadbd53c3e2460c85392dc940a6c899~mv2.jpg.avif"
              alt="hero-img"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section> */}
        <div className="navgation pl-[5%] mt-[90px] flex">
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
        <section className=" py-5  flex flex-col lg:flex-row pt-8 mt-5 sm:pb-[80px]   max-w-[1920px] mx-auto w-full px-4 sn:px-0  sm:w-[95%] 2xl::w-[88%] ">
          <div className=" w-full lg:w-[15%]">
            {/* <div className="sticky pl-5 top-24  ">
              <Suspense fallback={<div></div>}>
                <Categories />
              </Suspense>
            </div> */}

            <div className="sticky pl-5 top-24 ">
              <div className="border-b-1   border-gray-400 pb-5">
                <span className="text-[16px] gray-800">快速導覽</span>
              </div>
              <div className="items flex  flex-col">
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-800 text-[14px]">
                    掌握空間規劃，讓動線與使用更直覺
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-800 text-[14px]">
                    統一設計語言，打造一眼認出的風格
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-800 text-[14px]">
                    把細節做好，體感分數自然上來
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-800 text-[14px]">
                    兼顧美觀與維護，營運更省心
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full lg:w-[60%] px-8 flex-col">
            <article className="mx-auto w-[92%] max-w-3xl py-10 text-gray-800">
              {/* Hero */}
              <div className="relative aspect-[16/9] w-full overflow-hidden  bg-gray-100">
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
              <div className="relative aspect-[16/9] w-full overflow-hidden  bg-gray-100">
                <Image
                  src="https://static.wixstatic.com/media/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg/v1/fill/w_740,h_497,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_2cccc2d74bb747fe9d61abd6c1deae4f~mv2.jpg"
                  alt="高評價民宿設計關鍵：空間、細節一次到位"
                  fill
                  className="object-cover cursor-zoom-in"
                  priority
                  onClick={() => openAt(1)}
                />
              </div>
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
              <section className="mt-12  border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">
                  需要一起規劃你的民宿嗎？
                </h3>
                <p className="mt-2 leading-8">
                  若你正要籌備或優化民宿，我們可依據品牌定位、空間條件與預算，提供從
                  規劃到落地的完整服務，讓空間更有辨識度也更好管理。
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
          <div className=" w-full py-10 px-5 sm:px-0 lg:py-0 sm:w-[60%] mx-auto lg:w-[25%] pr-8  flex flex-col">
            <div className="">
              <span className="text-[14px]">
                民宿設計的第一步，就是做好空間規劃。不同於一般住宅，民宿空間需兼顧私密性與共享性、舒適度與實用性。良好的空間規劃能提升整體入住體驗，也降低管理維護成本。
              </span>
            </div>
            <div className="sticky  my-4 top-24 ">
              <div className="main-info bg-white rounded-lg p-8 grid grid-cols-2">
                <div className="flex flex-col">
                  <b className="text-[14px] mt-3">室內坪數：</b>
                  <span className="text-[14px] mt-1 text-gray-700">35 坪</span>

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
              <div className="small-viewer-project p-5">
                <div className="flex flex-row justify-between my-3 ">
                  <div className="img w-1/2">
                    <Image
                      src="https://kon-sumai.com/wp/wp-content/uploads/2023/11/9-8-2048x1357.jpg"
                      placeholder="empty"
                      loading="lazy"
                      alt="small-img"
                      width={400}
                      height={30}
                      className="w-full"
                    />
                  </div>

                  <div className="arrow w-1/2 flex flex-col justify-between p-4">
                    <div className="flex flex-col">
                      <b className="text-[.95rem]">Name</b>
                      <span className="text-[.8rem] leading-snug ">
                        {" "}
                        Lorem ipsum dolor consectetur
                      </span>
                    </div>
                    <b className="text-[.95rem] ">Go Project</b>
                  </div>
                </div>
                <div className="flex flex-row justify-between my-3 ">
                  <div className="img w-1/2">
                    <Image
                      src="https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20078ss.jpg"
                      placeholder="empty"
                      loading="lazy"
                      alt="small-img"
                      width={400}
                      height={30}
                      className="w-full"
                    />
                  </div>

                  <div className="arrow w-1/2 flex flex-col justify-between p-4">
                    <div className="flex flex-col">
                      <b className="text-[.95rem]">Name</b>
                      <span className="text-[.8rem] leading-snug ">
                        {" "}
                        Lorem ipsum dolor consectetur
                      </span>
                    </div>
                    <b className="text-[.95rem] ">Go Project</b>
                  </div>
                </div>
                <div className="flex flex-row justify-between my-3 ">
                  <div className="img w-1/2">
                    <Image
                      src="https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20066Res-2048x1365.jpg"
                      placeholder="empty"
                      loading="lazy"
                      alt="small-img"
                      width={400}
                      height={30}
                      className="w-full"
                    />
                  </div>

                  <div className="arrow w-1/2 flex flex-col justify-between p-4">
                    <div className="flex flex-col">
                      <b className="text-[.95rem]">Name</b>
                      <span className="text-[.8rem] leading-snug ">
                        {" "}
                        Lorem ipsum dolor consectetur
                      </span>
                    </div>
                    <b className="text-[.95rem] ">Go Project</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section_navgation flex flex-row">
          <div className="flex w-full md:w-[70%] mx-auto">
            <div className="Navgation_Prev group hover:scale-[1.02] duration-400 w-1/2 px-8">
              <div className="flex flex-col justify-start items-start">
                <b className="text-[.9rem] tracking-wide w-3/4 text-left font-bold">
                  〈COGNOMEN〉 25AW “WORKER-MAN
                  ATHLETE”的預購活動將於下週末為期三天舉辦！！
                </b>
                <span className="text-[.8rem] mt-3">Categories: XXXXXXX</span>
                <button class="mt-4  relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#1b8bed] px-6 font-medium text-neutral-200 duration-500">
                  <div class="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
                    <div class="absolute translate-x-0 opacity-0 transition group-hover:-translate-x-6 group-hover:opacity-100 rotate-180">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>

                    <span class="pl-6">Hover</span>
                    <div class=" absolute  right-0 translate-x-12 opacity-100 transition group-hover:translate-x-6 group-hover:opacity-0">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="Navgation_Next hover:scale-[1.02] duration-400 w-1/2 group px-8">
              <div className="flex flex-col justify-end items-end">
                <b className="text-[.9rem]  w-3/4 text-right tracking-wide font-bold">
                  〈COGNOMEN〉 25AW “WORKER-MAN
                  ATHLETE”的預購活動將於下週末為期三天舉辦！！
                </b>
                <span className="text-[.8rem] mt-3">Categories: XXXXXXX</span>
                <button class="mt-4 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#1b8bed] px-6 font-medium text-neutral-200 duration-500">
                  <div class="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
                    <div class="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span class="pl-6">Hover</span>
                    <div class="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="section-page-navgation w-[68%] mt-5 mb-20 max-w-[1920px] mx-auto px-4">
          <div className="flex flex-col md:flex-row py-6 justify-between items-center">
            <div className="tag border rounded-full px-4 py-1 text-[.85rem] mb-4 md:mb-0">
              Categories
            </div>
            <span className="text-gray-600">Look More</span>
          </div>

          <div className="border-t border-gray-600 flex flex-col md:flex-row justify-between py-5 items-start md:items-center gap-6">
            <span className="text-[.9rem] text-gray-800 leading-relaxed">
              結合品牌精神與市場洞察，量身打造具吸引力與記憶點的商業空間，
              <br className="hidden md:block" />
              助力品牌形象升級與業績成長。
            </span>

            <button className="group rotate-[-90deg] relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-950 font-medium text-neutral-200 shrink-0">
              <div className="translate-x-0 transition group-hover:translate-x-[300%]">
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
              <div className="absolute -translate-x-[300%] transition group-hover:translate-x-0">
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
            </button>
          </div>
        </section>
        <div className="bg-white z-[99999999] py-10 bottom-section flex flex-col justify-center items-center">
          <div className="flex bg-white flex-row justify-center items-center flex-wrap">
            <div className="news-item  group overflow-hidden  m-1 sm:m-2 bg-[url('https://kon-sumai.com/wp/wp-content/uploads/2024/05/1KKP6021s-1s-scaled.jpg')] bg-no-repeat relative bg-cover bg-center w-[170px] sm:w-[230px] lg:w-[270px] h-[230px]  sm:h-[300px] lg:h-[340px]">
              <div className="description absolute w-full bottom-0 h-[0%] opacity-0 group-hover:opacity-100 duration-500 group-hover:h-[40%] flex flex-col bg-white p-3">
                <p className="text-[.8rem] hidden sm:block">
                  輕裝潢時代來了！我該繼續選擇傳統室內設計嗎？
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <b className="text-[.8rem] mr-3 mt-4"> 室內設計知識</b>
                  <button class="group relative inline-flex h-6 w-6 items-center justify-center  rounded-full bg-neutral-950 font-medium text-neutral-200">
                    <div class="translate-x-0 transition group-hover:translate-x-[300%]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="absolute -translate-x-[300%] transition group-hover:translate-x-0 duration-1000">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </button>{" "}
                </div>
              </div>
            </div>
            <div className="news-item  group overflow-hidden  m-1 sm:m-2 bg-[url('https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20083sss-scaled.jpg')] bg-no-repeat relative bg-cover bg-center w-[170px] sm:w-[230px] lg:w-[270px] h-[230px]  sm:h-[300px] lg:h-[340px]">
              <div className="description absolute w-full bottom-0 h-[0%] opacity-0 group-hover:opacity-100 duration-500 group-hover:h-[40%] flex flex-col bg-white p-3">
                <p className="text-[.8rem] hidden sm:block">
                  室內設計的新選擇！為什麼越來越多新成屋裝潢找軟裝設計師？
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <b className="text-[.8rem] mr-3 mt-4"> 室內設計知識</b>
                  <button class="group relative inline-flex h-6 w-6 items-center justify-center  rounded-full bg-neutral-950 font-medium text-neutral-200">
                    <div class="translate-x-0 transition group-hover:translate-x-[300%]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="absolute -translate-x-[300%] transition group-hover:translate-x-0 duration-1000">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </button>{" "}
                </div>
              </div>
            </div>
            <div className="news-item  group overflow-hidden  m-1 sm:m-2 bg-[url('https://kon-sumai.com/wp/wp-content/uploads/2024/05/KKP24_04_KonKomuten20035ss-scaled.jpg')] bg-no-repeat relative bg-cover bg-center w-[170px] sm:w-[230px] lg:w-[270px] h-[230px]  sm:h-[300px] lg:h-[340px]">
              <div className="description absolute w-full bottom-0 h-[0%] opacity-0 group-hover:opacity-100 duration-500 group-hover:h-[40%] flex flex-col bg-white p-3">
                <p className="text-[.8rem] hidden sm:block">
                  一個人的休閒療癒宅！隔間牆還能這樣做？11 坪小宅打造北歐簡約風
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <b className="text-[.8rem] mr-3 mt-4"> 空間故事</b>
                  <button class="group relative inline-flex h-6 w-6 items-center justify-center  rounded-full bg-neutral-950 font-medium text-neutral-200">
                    <div class="translate-x-0 transition group-hover:translate-x-[300%]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="absolute -translate-x-[300%] transition group-hover:translate-x-0 duration-1000">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </button>{" "}
                </div>
              </div>
            </div>
            <div className="news-item  group overflow-hidden  m-1 sm:m-2 bg-[url('https://kon-sumai.com/wp/wp-content/uploads/2024/07/0423_067-%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1367x2050.jpg')] bg-no-repeat relative bg-cover bg-center w-[170px] sm:w-[230px] lg:w-[270px] h-[230px]  sm:h-[300px] lg:h-[340px]">
              <div className="description absolute w-full bottom-0 h-[0%] opacity-0 group-hover:opacity-100 duration-500 group-hover:h-[40%] flex flex-col bg-white p-3">
                <p className="text-[.8rem] hidden sm:block">
                  不簡單的青海路，相遇不平凡的青世代 獻給，鍾情市中心的菁英家庭
                  致邀，職住共生的青創企業家
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <b className="text-[.8rem] mr-3 mt-4">
                    {" "}
                    NEWS:神隱青海│2-3房│含精裝修{" "}
                  </b>
                  <button class="group relative inline-flex h-6 w-6 items-center justify-center  rounded-full bg-neutral-950 font-medium text-neutral-200">
                    <div class="translate-x-0 transition group-hover:translate-x-[300%]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="absolute -translate-x-[300%] transition group-hover:translate-x-0 duration-1000">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </button>{" "}
                </div>
              </div>
            </div>
            <div className="news-item  group overflow-hidden  m-1 sm:m-2 bg-[url('https://kon-sumai.com/wp/wp-content/uploads/2024/07/0423_060-%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1367x2050.jpg')] bg-no-repeat relative bg-cover bg-center w-[170px] sm:w-[230px] lg:w-[270px] h-[230px]  sm:h-[300px] lg:h-[340px]">
              <div className="description absolute w-full bottom-0 h-[0%] opacity-0 group-hover:opacity-100 duration-500 group-hover:h-[40%] flex flex-col bg-white p-3">
                <p className="text-[.8rem] hidden sm:block">
                  不簡單的青海路，相遇不平凡的青世代 獻給，鍾情市中心的菁英家庭
                  致邀，職住共生的青創企業家
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <b className="text-[.8rem] mr-3 mt-4">
                    {" "}
                    NEWS:神隱青海│2-3房│含精裝修{" "}
                  </b>
                  <button class="group relative inline-flex h-6 w-6 items-center justify-center  rounded-full bg-neutral-950 font-medium text-neutral-200">
                    <div class="translate-x-0 transition group-hover:translate-x-[300%]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="absolute -translate-x-[300%] transition group-hover:translate-x-0 duration-1000">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="pb-[100px] w-full overflow-hidden">
          <div className="title p-10">
            <h2 className="text-center text-[4vmin] font-bold">其他好文推薦</h2>
            <Link
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61550958051323&sk=photos"
              className="icon flex justify-center items-center"
            >
              <div className="w-[1.6rem]  bg-center bg-cover bg-no-repeat h-[1.6rem] bg-[url('https://www.uneven.jp/images/icon_ig.svg')]"></div>
              <b className="ml-3 font-normal">INSTGRAM</b>
            </Link>
          </div>
          <div className="w-full pb-20">
            <Swiper
              modules={[Pagination, A11y, Autoplay]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={true}
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
                  className="mx-2  group overflow-hidden group relative duration-1000 "
                >
                  <div className="w-full fkex flex-col">
                    <div className="img relative overflow-hidden">
                      <div className="mask opacity-0 group-hover:opacity-100 transition duration-400 w-full h-full absolute z-30 bg-black/30"></div>
                      <div className="write-people opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="w-[45px] flex h-[45px] bg-slate-100 rounded-full absolute top-5 left-5 z-40">
                          {/* <Image
                            src="/images/menbers/捌程室內設計張佩甄.jpg.avif"
                            alt="article"
                            placeholder="empty"
                            loading="lazy"
                            width={400}
                            height={300}
                            className="w-[45px] h-[45px] rounded-full"
                          ></Image> */}
                          <div className="name text-white ml-4 text-[15px]">
                            USER
                          </div>
                        </div>
                      </div>
                      <Image
                        src="/img-02.jpg"
                        alt="article"
                        placeholder="empty"
                        loading="lazy"
                        width={400}
                        height={300}
                        className="w-full scale-100 group-hover:scale-105 transition duration-400"
                      ></Image>
                    </div>
                    <div className="info mt-4">
                      <div className="top flex justify-between">
                        <b className="text-[14px]">2025.08.11</b>
                        <div className="rounded-full w-[20px] h-[20px] bg-[#189ed8]"></div>
                      </div>
                      <div className="flex flex-col py-2">
                        <b>打造飯店氛圍感：高級感居家設計技巧</b>
                        <span className="text-[13px] leading-relaxed w-[80%]">
                          你是否曾入住過一間令人難忘的高級飯店，對它的氛圍、質感與細節印象深刻
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
      {/* <div className="w-full h-full py-20">
        <Carousel items={cards} />
      </div> */}
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
