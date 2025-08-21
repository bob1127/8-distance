"use client";
import GsapText from "../../components/RevealText/index";
import ThreeJs from "../../components/ThreeSlider/index";
import { projects } from "../../components/ParallaxCard/data";
import { TextGenerateEffect } from "../../components/ui/text-generate-effec-home";
import ScrollCard from "../../components/ParallaxCard/page";
import { Card, CardBody } from "@nextui-org/react";
import Images from "next/image";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import AnimatedLink from "../../components/AnimatedLink";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });
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
    <div className="bg-[#f6f6f7]">
      <section className="flex max-w-[1920px] py-20 h-screen w-[85%] mx-auto flex-row">
        <div className="left w-[70%]">
          <div className="blog-grid grid sm:grid-cols-2 grid-cols-1 2xl:grid-cols-3">
            <div className="item  overflow-hidden group bg-white  transition-all duration-400">
              <div className="img w-ful p-1 overflow-hidden relative hover:p-1 transition duration-500 aspect-[4/3]">
                <Image
                  src="https://static.wixstatic.com/media/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg/v1/fill/w_740,h_493,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_30d89834222e4629bdd55b84b7ab2c8b~mv2.jpg"
                  alt="blog-img"
                  placeholder="empty"
                  loading="lazy"
                  fill
                  className="object-cover  group-hover:scale-105 scale-100 transition-all duration-400 w-full"
                ></Image>
              </div>

              <div className="content p-6 flex flex-col ">
                <h2 className="text-[20px]">
                  開放式空間設計好不好？一文搞懂優缺點與替代方案
                </h2>
                <p className="text-[14px] text-gray-800">
                  開放式空間設計（Open-Plan
                  Design）近年來在室內設計圈持續流行，特別是小坪數住宅與現代風格居家案例中，經常可見客廳
                </p>
                <div className="info mt-4">
                  <div className="flex">
                    {" "}
                    <b className="text-[14px] tracking-widest">發佈於:</b>
                    <span className="date text-[14px] tracking-widest">
                      2024.11.23
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right w-[30%] ">
          <div className="right-bar bg-white sticky top-20 py-8">
            <div className="mx-auto rounded-[22px] relative bg-black p-4 flex justify-center max-w-[120px] items-center">
              <div className="absolute color bg-[#323936] w-full h-full rounded-[22px] rotate-12"></div>
              <Image
                src="/images/捌程室內設計.png.avif"
                width={500}
                height={500}
                alt="logo"
                placeholder="empty"
                className="w-full z-50"
                loading="lazy"
              ></Image>
            </div>
            <div className="txt flex justify-center flex-col items-center mt-5">
              <b>捌程室內設計 | 8 Distance</b>
              <p className="text-[14px] text-gray-700 w-2/3 text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem fugiat quasi quis consequatur.
              </p>
            </div>
            <div className="social flex justify-center mt-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                  cx="19.38"
                  cy="42.035"
                  r="44.899"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#fd5"></stop>
                  <stop offset=".328" stop-color="#ff543f"></stop>
                  <stop offset=".348" stop-color="#fc5245"></stop>
                  <stop offset=".504" stop-color="#e64771"></stop>
                  <stop offset=".643" stop-color="#d53e91"></stop>
                  <stop offset=".761" stop-color="#cc39a4"></stop>
                  <stop offset=".841" stop-color="#c837ab"></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                  cx="11.786"
                  cy="5.54"
                  r="29.813"
                  gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#4168c9"></stop>
                  <stop
                    offset=".999"
                    stop-color="#4168c9"
                    stop-opacity="0"
                  ></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <path
                  fill="#fff"
                  d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                ></path>
                <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                <path
                  fill="#fff"
                  d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                ></path>
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                  x1="9.993"
                  x2="40.615"
                  y1="9.993"
                  y2="40.615"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#2aa4f4"></stop>
                  <stop offset="1" stop-color="#007ad9"></stop>
                </linearGradient>
                <path
                  fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                  d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                ></path>
                <path
                  fill="#fff"
                  d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xa_0ZWDaCvmIF4I_gr1"
                  x1="4.522"
                  x2="45.203"
                  y1="2.362"
                  y2="47.554"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xa_0ZWDaCvmIF4I_gr1)"
                  d="M8,42h32c1.105,0,2-0.895,2-2V8c0-1.105-0.895-2-2-2H8C6.895,6,6,6.895,6,8v32	C6,41.105,6.895,42,8,42z"
                ></path>
                <path
                  d="M23.284,37.758c-0.454,0-0.851-0.175-1.118-0.493c-0.46-0.548-0.338-1.245-0.286-1.542l0.191-1.144	c0.036-0.277,0.036-0.451,0.028-0.549c-0.08-0.037-0.22-0.091-0.45-0.14c-6.792-0.895-11.751-5.723-11.751-11.473	c0-6.417,6.329-11.637,14.108-11.637c7.779,0,14.107,5.22,14.107,11.637c0,2.593-1.005,4.954-3.073,7.218	c-2.801,3.227-9.098,7.206-10.647,7.858C23.97,37.672,23.607,37.758,23.284,37.758z"
                  opacity=".05"
                ></path>
                <path
                  d="M23.284,37.258c-0.389,0-0.615-0.171-0.735-0.315c-0.311-0.371-0.22-0.888-0.176-1.136l0.191-1.146	c0.075-0.578,0.024-0.824-0.013-0.918c-0.017-0.038-0.202-0.214-0.796-0.342c-6.564-0.866-11.357-5.489-11.357-10.984	c0-6.141,6.104-11.137,13.608-11.137c7.503,0,13.607,4.996,13.607,11.137c0,2.462-0.962,4.713-2.942,6.881	c-2.76,3.179-8.95,7.094-10.472,7.734C23.838,37.185,23.539,37.258,23.284,37.258z"
                  opacity=".07"
                ></path>
                <path
                  fill="#fff"
                  d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637	c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185	c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001	C36.203,26.879,37.113,24.764,37.113,22.417z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xb_0ZWDaCvmIF4I_gr2"
                  x1="18.372"
                  x2="36.968"
                  y1="13.013"
                  y2="27.439"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xb_0ZWDaCvmIF4I_gr2)"
                  d="M32.052,20.698c0.38,0,0.688-0.308,0.688-0.687s-0.309-0.687-0.688-0.687h-2.604 c-0.379,0-0.687,0.308-0.687,0.687c0,0.001,0,0.001,0,0.002v2.602c0,0,0,0,0,0.001v2.603c0,0.38,0.309,0.688,0.687,0.688h2.604 c0.379,0,0.688-0.309,0.688-0.688c0-0.379-0.309-0.687-0.688-0.687h-1.917v-1.23h1.917c0.38,0,0.688-0.308,0.688-0.687 c0-0.38-0.309-0.688-0.688-0.688v0.001h-1.917v-1.23H32.052z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xc_0ZWDaCvmIF4I_gr3"
                  x1="16.286"
                  x2="34.882"
                  y1="15.702"
                  y2="30.128"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xc_0ZWDaCvmIF4I_gr3)"
                  d="M26.463,20.01v3.223l-2.67-3.635c-0.129-0.172-0.335-0.275-0.549-0.275 c-0.074,0-0.147,0.011-0.218,0.035c-0.281,0.094-0.47,0.356-0.47,0.652v5.209c0,0.38,0.309,0.688,0.688,0.688 c0.38,0,0.688-0.309,0.688-0.688v-3.222l2.669,3.635c0.129,0.172,0.334,0.275,0.549,0.275c0.073,0,0.147-0.012,0.218-0.036 c0.282-0.093,0.47-0.355,0.47-0.652V20.01c0-0.379-0.308-0.687-0.687-0.687S26.463,19.631,26.463,20.01z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xd_0ZWDaCvmIF4I_gr4"
                  x1="12.933"
                  x2="31.529"
                  y1="20.025"
                  y2="34.451"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xd_0ZWDaCvmIF4I_gr4)"
                  d="M16.271,19.323c-0.379,0-0.687,0.308-0.687,0.687v5.209c0,0.38,0.308,0.688,0.687,0.688 h2.604c0.379,0,0.687-0.309,0.687-0.689c0-0.379-0.308-0.687-0.687-0.687h-1.917V20.01C16.958,19.631,16.65,19.323,16.271,19.323z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xe_0ZWDaCvmIF4I_gr5"
                  x1="14.665"
                  x2="33.26"
                  y1="17.793"
                  y2="32.218"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xe_0ZWDaCvmIF4I_gr5)"
                  d="M20.194,20.01v5.209c0,0.38,0.308,0.688,0.687,0.688c0.379,0,0.687-0.309,0.687-0.688V20.01 c0-0.379-0.308-0.687-0.687-0.687C20.502,19.323,20.194,19.631,20.194,20.01z"
                ></path>
              </svg>
            </div>
            <div className="others-article">
              <div className="article-item  px-8 group flex">
                <div className="txt w-full  transition duration-400">
                  <b>Article Title</b>
                  <p className="text-[14px] text-gray-800">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquid vero praesentium iusto illo, consectetur quae?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
