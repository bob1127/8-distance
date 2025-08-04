"use client";
import { Suspense } from "react";

import HomeSlider from "../../components/HeroSliderHome/page.jsx";
import React, { useRef, useEffect } from "react";
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
  return (
    <ReactLenis root>
      <div className="bg-[#f8f8f8]">
        <div className="relative w-full  h-[95vh] lg:h-[900px] overflow-hidden ">
          <div className="hero-img-txt relative w-full h-full">
            {/* 背景圖層 */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://static.wixstatic.com/media/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg/v1/fill/w_740,h_493,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg')",
              }}
            />

            {/* ✅ 右側毛玻璃漸層遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-2xl z-10" />

            {/* 內容層 */}
            <div className="relative z-30 flex md:flex-row flex-col w-full justify-center h-full">
              <div className=" w-full md:w-1/2 flex items-center justify-center md:justify-end pr-10">
                <img
                  src="https://static.wixstatic.com/media/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg/v1/fill/w_740,h_493,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg"
                  className=" w-[85%] md:w-full shadow-white shadow-sm max-w-[750px] rounded-xl"
                  alt="hero-img "
                />
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-start pt-10 pl-10">
                <div className="max-w-[500px] text-center">
                  <div className="category_date  flex justify-between">
                    <div className="date text-[14px] tetx-black">
                      2025.09.11
                    </div>
                    <span className="bg-white px-4 py-1 rounded-[30px]">
                      室內設計
                    </span>
                  </div>
                  <h1 className="text-[4.5vmin]  text-left text-gray-200 font-bold">
                    開放式空間設計好不好？一文搞懂優缺點與替代方案
                  </h1>
                  <p className="mt-2 text-sm text-left">
                    不是所有家庭都適合打開隔間，真正的好設計應該因人而異
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute h-[280px] bg-[#0b1110] z-20 left-0 top-0 w-full">
            <div className="flex  w-full h-full relative">
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div className="flex flex-col items-start">
                  <h3 className="text-[26px] font-bold text-white">
                    8 DISTANCE
                  </h3>
                  <p className="text-sm text-white">捌程室內設計</p>
                </div>
              </div>
              <div className="w-1/2">
                <h3 className="text-[26px] font-bold text-white"></h3>
              </div>
            </div>
          </div>
        </div>

        <section className=" py-5  flex flex-col lg:flex-row pt-8 mt-20  sm:pb-[80px]   max-w-[1920px] mx-auto w-full px-4 sn:px-0  sm:w-[95%] 2xl::w-[88%] ">
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
              <div className="items flex flex-col">
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-500 tracking-widest text-[14px]">
                    以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-500 tracking-widest text-[14px]">
                    以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-500 tracking-widest text-[14px]">
                    以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列
                  </span>
                </div>
                <div className="border-b-1 py-5 border-gray-400 flex justify-center items-center">
                  <div className="dots">
                    <div className="bg-[#b0bfda] w-[10px] h-[10px] rounded-full mx-4"></div>
                  </div>
                  <span className="text-gray-500 tracking-widest text-[14px]">
                    以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full lg:w-[60%] px-8 flex-col">
            <div className="title flex justify-between pl-8"></div>
            <div className="  mx-auto px-4 md:px-10">
              <Image
                src="https://kon-sumai.com/wp/wp-content/uploads/2023/11/6-6-2048x1357.jpg"
                alt=""
                placeholder="empty"
                loading="eager"
                width={1500}
                height={800}
                className="w-screen"
              />
              <div className="text text-[.95rem] leading-loose mt-5">
                以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。
                <br></br>
                <br></br>
                以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。
                Designer
              </div>
              <Image
                src="https://kon-sumai.com/wp/wp-content/uploads/2024/07/0423_012-%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1-2048x1411.jpg"
                alt=""
                placeholder="empty"
                loading="eager"
                width={1500}
                height={800}
                className="w-screen mt-8"
              />
              <div className="text text-[.95rem] leading-loose mt-5">
                以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。
                <br></br>
                <br></br>
                以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。
                Designer
              </div>
            </div>
          </div>
          <div className=" w-full py-10 px-5 sm:px-0 lg:py-0 sm:w-[60%] mx-auto lg:w-[25%] pr-8  flex flex-col">
            <div className="">
              <span className="text-[.8rem]">
                以瑞典為基地的TUF設計了可供所有年齡層日常使用的系列。這款設計關注於尺寸與用途的關係，讓孩子的大盤子可以成為成年人的小菜盤，並不拘泥於單一的使用方式，而是通過使用者的想像力來適應各種功能。這是一系列源於融化冰淇淋主題和印章等充滿趣味的創意。
                Designer
              </span>
            </div>
            <div className="sticky  my-4 top-24 ">
              <div className="flex  px-4 flex-col border border-[#d7d7d7] bg-[#242724]">
                <div className="h-[340px] w-full"></div>
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
          <Marquee>
            <div className="flex flex-row py-10 justify-center items-center">
              <div className="h-[1px] bg-black w-[50vw]"></div>
              <div className="flex flex-col sm:flex-row justify-center items-center">
                <p className="text-[3rem] mx-4">NEWS</p>
                <button class="group relative mr-3 inline-flex h-12 w-12 items-center justify-center  rounded-full bg-neutral-950">
                  <div class="transition duration-300 group-hover:rotate-[360deg]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-neutral-200"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="h-[1px] bg-black w-[50vw]"></div>
            </div>
          </Marquee>
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
    </ReactLenis>
  );
}
