"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import BackgroundSlider from "@/components/BackgroundSlider";
import ProjectSlider from "@/components/Project-Slider/Slider.jsx";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(CustomEase);

export default function Home() {
  const container = useRef(null);
  const customEase = CustomEase.create("custom", ".87,0,.13,1");
  const taglineRef = useRef([]);

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

      const counter = document.getElementById("counter");
      const heroElement = document.querySelector(".hero");
      const videoContainer = document.querySelector(".video-container");
      const progressBar = document.querySelector(".progress-bar");
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
            top: "790px", // ← 保持 790px 位移
            position: "absolute",
          });
        }
        if (progressBar) gsap.set(progressBar, { opacity: 0 });
        if (counter) gsap.set(counter, { innerHTML: 100 });
        if (logo) gsap.set(logo, { left: "0%", xPercent: 0 });
        if (animOutChars.length) gsap.set(animOutChars, { y: "100%" });
        if (animInChars.length) gsap.set(animInChars, { x: "-1200%" });
        if (spans.length) gsap.set(spans, { y: 0, opacity: 1 });
        if (taglineRef.current?.length)
          gsap.set(taglineRef.current, { y: 0, opacity: 1 });

        // ✅ 只移除 fixed，不要 display: none
        if (preloader) preloader.classList.remove("fixed");
      };

      // 🛑 已看過（或使用者偏好減少動畫）→ 直接套用完成狀態
      if (alreadySeen) {
        setFinalState();
        return;
      }

      // ⏳ 第一次：跑你的原本動畫（可保留你現有的 readyState 檢查）
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
              if (progressBar && counter) {
                gsap.to(progressBar, {
                  width: "100vw",
                  duration: 2,
                  ease: customEase,
                });
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
                    gsap.to(videoContainer, {
                      top: "790px",
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
              // ✅ 第一次動畫全跑完 → 設定旗標
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
      <div className="preloader-screen  fixed inset-0 z-[9999999999] bg-white">
        <div className="hero relative   w-full bg-white" ref={container}>
          <div className="progress-bar z-20 absolute top-6 left-6 px-6 py-2 text-black">
            <p>loading</p>
            <p>
              /<span id="counter">0</span>
            </p>
          </div>

          <div
            className="video-container absolute left-0 w-screen will-change-transform z-0"
            style={{ top: "0px" }}
          >
            <BackgroundSlider images={backgroundImages} duration={5} />
            {/* <div className="absolute bottom-1/2 right-6 z-20 text-white text-sm flex items-center space-x-4">
              <button className="px-3 py-1 bg-black/60 hover:bg-black/80 rounded">
                Prev
              </button>
              <span className="text-white">1 | {backgroundImages.length}</span>
              <button className="px-3 py-1 bg-black/60 hover:bg-black/80 rounded">
                Next
              </button>
            </div> */}
          </div>

          <div className="header absolute !bg-transparent bottom-20 left-10 z-30 text-white leading-tight space-y-1">
            {/* <div className="overflow-hidden">
              <span className="block  !bg-transparent text-[55px] font-semibold">
                8 DISTANCE
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block text-[55px] font-semibold">
                捌程室內設計
              </span>
            </div> */}
          </div>

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

      <div className="absolute top-[8%] ml-[100px] text-black text-4xl font-bold z-10 flex">
        <div className="flex flex-col">
          <h1
            className="text-[50px] font-normal mt-9 tracking-widest h-4 opacity-0"
            ref={(el) => (taglineRef.current[0] = el)}
          >
            We are building the
          </h1>
          <h1
            className="text-[50px] font-normal tracking-widest h-4 opacity-0"
            ref={(el) => (taglineRef.current[1] = el)}
          >
            fundamentals of your life
          </h1>
        </div>
      </div>
    </div>
  );
}
