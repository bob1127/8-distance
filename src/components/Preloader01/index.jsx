"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import BackgroundSlider from "@/components/BackgroundSlider";
import ProjectSlider from "@/components/Project-Slider/Slider.jsx";
import Link from "next/link";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(CustomEase);

export default function Home() {
  const container = useRef(null);
  const customEase = CustomEase.create("custom", ".87,0,.13,1");
  const taglineRef = useRef([]);

  // ✅ 最終要停在頂部下方 520px
  const FINAL_TOP = 520;

  const backgroundImages = [
    "/images/index/b69ff1_8d67d2bc26bd45529c4848f4343ccecc~mv2.jpg.avif",
    "/images/index/b69ff1_dfadbd53c3e2460c85392dc940a6c899~mv2.jpg.avif",
    "/images/index/b69ff1_5fbc029839a748f18ca1e1ac09bd662e~mv2.jpg.avif",
    "/images/index/b69ff1_2e8beb67f7c64ad9aaab0271e8d9a385~mv2.jpg.avif",
    "/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif",
    "/images/index/b69ff1_dbf0d0c42626415881135b9768235d8f~mv2.jpg.avif",
  ];

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const prefersReducedMotion =
        !!window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const alreadySeen =
        prefersReducedMotion ||
        window.localStorage.getItem("home_intro_done") === "1";

      // ⚠️ 這兩個元素我們已經從 DOM 拿掉了（不再顯示 Loading 圓圈/進度條）
      const counter = document.getElementById("counter"); // 可能是 null
      const progressBar = document.querySelector(".progress-bar"); // 一定是 null

      const heroElement = document.querySelector(".hero");
      const videoContainer = document.querySelector(".video-container");
      const logo = document.querySelector(".logo");
      const animOutChars = document.querySelectorAll(".char.anim-out h1");
      const animInChars = document.querySelectorAll(".char.anim-in h1");
      const headerSpans = document.querySelectorAll(".header span");
      const coordinatesSpans = document.querySelectorAll(".coordinates span");
      const preloader = document.querySelector(".preloader-screen");
      const spans = [...headerSpans, ...coordinatesSpans];

      const setFinalState = () => {
        if (heroElement) {
          gsap.set(heroElement, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            backgroundColor: "#ffffff",
          });
        }
        if (videoContainer) {
          gsap.set(videoContainer, {
            scale: 1,
            rotation: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            top: `${FINAL_TOP}px`,
            position: "absolute",
          });
        }
        if (progressBar) gsap.set(progressBar, { opacity: 0 }); // 現在不會被觸發
        if (counter) gsap.set(counter, { innerHTML: 100 });
        if (logo) gsap.set(logo, { left: "0%", xPercent: 0 });
        if (animOutChars.length) gsap.set(animOutChars, { y: "100%" });
        if (animInChars.length) gsap.set(animInChars, { x: "-1200%" });
        if (spans.length) gsap.set(spans, { y: 0, opacity: 1 });
        if (taglineRef.current?.length)
          gsap.set(taglineRef.current, { y: 0, opacity: 1 });

        // 只移除 fixed，不要 display:none
        if (preloader) preloader.classList.remove("fixed");
      };

      // 🛑 已看過（或偏好減少動作）→ 直接套完成態
      if (alreadySeen) {
        setFinalState();
        return;
      }

      // ⏳ 第一次：跑入場動畫
      if (document.readyState === "complete") {
        if (videoContainer) {
          gsap.set(videoContainer, {
            scale: 0,
            rotation: -20,
            top: "0px",
            position: "absolute",
          });
        }

        if (heroElement) {
          gsap.to(heroElement, {
            clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
            duration: 1.5,
            ease: customEase,
            delay: 1,
          });

          gsap.to(heroElement, {
            clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
            duration: 2,
            ease: customEase,
            delay: 3,
            onStart: () => {
              // 這裡原本有 progressBar/counter 動畫，已移除
              if (counter) {
                gsap.to(counter, {
                  innerHTML: 100,
                  duration: 2,
                  ease: customEase,
                  snap: { innerHTML: 1 },
                });
              }
            },
          });

          gsap.to(heroElement, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: customEase,
            delay: 5,
            onStart: () => {
              if (videoContainer) {
                gsap.to(videoContainer, {
                  scale: 1,
                  rotation: 0,
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  duration: 1.25,
                  ease: customEase,
                  onComplete: () => {
                    // ✅ 最終位移改為 520px
                    gsap.to(videoContainer, {
                      top: `${FINAL_TOP}px`,
                      duration: 1.5,
                      ease: customEase,
                    });

                    gsap.to(heroElement, {
                      backgroundColor: "#ffffff",
                      duration: 1,
                      ease: customEase,
                    });
                  },
                });
              }
              // 移除 progressBar 淡出
              if (progressBar) {
                gsap.to(progressBar, { opacity: 0, duration: 0.3 });
              }
              if (logo) {
                gsap.to(logo, {
                  left: "0%",
                  transform: "translateX(0%)",
                  duration: 1.25,
                  ease: customEase,
                  onStart: () => {
                    if (animOutChars.length > 0) {
                      gsap.to(animOutChars, {
                        y: "100%",
                        duration: 1,
                        stagger: -0.075,
                        ease: customEase,
                      });
                    }
                    if (animInChars.length > 0) {
                      gsap.to(animInChars, {
                        x: "-1200%",
                        duration: 1,
                        ease: customEase,
                        delay: 0.25,
                      });
                    }
                  },
                });
              }
            },
          });
        }

        if (spans.length > 0) {
          gsap.fromTo(
            spans,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.125,
              ease: "power3.out",
              delay: 5.75,
              onComplete: () => {
                if (preloader) preloader.classList.remove("fixed");
              },
            }
          );
        }

        if (taglineRef.current.length > 0) {
          gsap.fromTo(
            taglineRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power4.out",
              delay: 7.8,
              stagger: 0.2,
              onComplete: () => {
                window.localStorage.setItem("home_intro_done", "1");
              },
            }
          );
        }
      }
    },
    { scope: container, dependencies: [] }
  );

  return (
    <div>
      <div className="preloader-screen fixed inset-0 z-[9999999999] bg-white">
        <div className="hero relative w-full bg-white" ref={container}>
          {/* ⛔ 已移除：Loading/進度條
          <div className="progress-bar z-20 absolute top-6 left-6 px-6 py-2 text-black">
            <p>loading</p>
            <p>
              /<span id="counter">0</span>
            </p>
          </div>
          */}

          <div
            className="video-container absolute left-0 w-screen will-change-transform z-0"
            style={{ top: "0px" }} // 進場從 0 開始 → 動畫推到 520px
          >
            <BackgroundSlider images={backgroundImages} duration={5} />
          </div>

          {/* ✅ 左下角 → 右上角 黑色漸層陰影（在背景之上、標題之下） */}
          <div
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              // 底部左側較濃，往右上漸淡；疊兩個漸層讓邊緣更柔和
              backgroundImage:
                "radial-gradient(120% 120% at 0% 100%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 75%), linear-gradient(45deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.0) 75%)",
            }}
          />

          <div className="header absolute !bg-transparent bottom-20 left-10 z-30 text-white leading-tight space-y-1" />

          <div className="coordinates absolute bottom-10 right-10 text-white z-30 space-y-1">
            <p>
              <span></span>
            </p>
            <p>
              <span></span>
            </p>
          </div>
        </div>
      </div>

      {/* 指標數字區（保持在漸層之上） */}
      <div className="absolute bottom-[20%] ml-[40px] sm:ml-[100px] text-4xl font-bold z-40 flex">
        <div className="grid grid-cols-3 w-[500px] md:w-[800px] ">
          <div>
            <div className="number flex flex-col">
              <span className="text-[30px] md:text-[55px] font-extrabold text-white">
                50+
              </span>
              <span className="text-[14px] text-white font-extralight">
                累積案件數量
              </span>
            </div>
          </div>
          <div>
            <div className="number flex flex-col">
              <span className="text-[30px] md:text-[55px] font-extrabold text-white">
                20y
              </span>
              <span className="text-[14px] text-white font-extralight">
                業界經營
              </span>
            </div>
          </div>
          <div>
            <div className="number flex flex-col">
              <span className="text-[30px] md:text-[55px] font-extrabold text-white">
                150+
              </span>
              <span className="text-[14px] text-white font-extralight">
                好評數量
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 標題與 CTA（保持在漸層之上） */}
      <div className="absolute top-[15%] ml-[40px] sm:ml-[100px] text-4xl font-bold z-40 flex">
        <div className="flex flex-col">
          <h1
            className="text-[32px] md:text-[50px] text-white !font-900 mt-9 tracking-widest"
            ref={(el) => (taglineRef.current[0] = el)}
          >
            8-DISTANCE
          </h1>
          <h1
            className="text-[32px] md:text-[50px] text-white !font-extrabold m-0 tracking-widest"
            ref={(el) => (taglineRef.current[1] = el)}
          >
            捌程室內設計
          </h1>
          <p className="text-[14px] text-gray-200 max-w-[550px] leading-normal mt-4 font-extralight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit saepe minima quam cupiditate velit ut aliquid. Eveniet
            dolore incidunt hic odio commodi, quia blanditiis obcaecati, velit
            voluptatibus, sunt fugit et!
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <div className="max-w-[150px] bg-white px-3 flex items-center justify-between text-center rounded-xl">
                <span className="text-stone-800 font-normal">Contac Us</span>
                <div className="circle w-[20px] h-[20px] rounded-full bg-stone-800 text-white flex justify-center items-center">
                  ~
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
