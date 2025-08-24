"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import slides from "./slides.js";

gsap.registerPlugin(SplitText);

const Slider = () => {
  const sliderRef = useRef(null);
  const currentSlideRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const scrollAllowedRef = useRef(true);
  const lastScrollTimeRef = useRef(0);
  const autoSlideIntervalRef = useRef(null);

  const totalSlides = slides.length;

  // 字級 & 動畫參數（維持你前一版的「小字版」設定）
  const TITLE_CLASS =
    "text-white font-semibold tracking-tight break-words " +
    "text-[9vw] md:text-[7vw] lg:text-[5.5vw] xl:text-[4.5vw]";
  const WORD_STAGGER = 0.06;
  const LINE_STAGGER = 0.06;
  const HEADER_DURATION = 0.8;
  const LINES_DURATION = 0.8;
  const LINK_DURATION = 0.8;
  const CONTAINER_IN_DURATION = 1.2;
  const CONTAINER_OUT_DURATION = 1.6;
  const EXIT_ROTATION = 18;
  const EXIT_SCALE = 0.4;
  const EXIT_Y_DOWN = "-150vh";
  const EXIT_Y_UP = "150vh";
  const ENTRY_CLIP_DOWN = "polygon(15% 15%, 85% 15%, 85% 100%, 15% 100%)";
  const ENTRY_CLIP_UP = "polygon(15% 0%, 85% 0%, 85% 85%, 15% 85%)";

  const createSlide = (slideIndex) => {
    const slideData = slides[slideIndex - 1];

    /* === 容器 === */
    const slide = document.createElement("div");
    slide.className = "slide relative w-full h-full text-white overflow-hidden";

    /* === 背景圖 === */
    const slideImg = document.createElement("div");
    slideImg.className = "slide-img absolute inset-0";
    const img = document.createElement("img");
    img.src = slideData.slideImg;
    img.alt = "";
    img.className = "w-full h-full object-cover";
    slideImg.appendChild(img);

    /* === 底部可讀性漸層 === */
    const gradient = document.createElement("div");
    gradient.className =
      "pointer-events-none absolute inset-x-0 bottom-0 h-[40vh] z-10 " +
      "bg-gradient-to-t from-black/60 via-black/20 to-transparent";

    /* === Header（標題/說明/連結）→ 水平＋垂直置中 === */
    const slideHeader = document.createElement("div");
    slideHeader.className =
      "slide-header absolute z-20 flex flex-col gap-3 " +
      // 全裝置：置中定位＋置中文字
      "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " +
      "items-center text-center px-4 md:max-w-[48rem]";

    const slideTitle = document.createElement("div");
    slideTitle.className = "slide-title leading-none";
    const h1 = document.createElement("h1");
    h1.textContent = slideData.slideTitle;
    h1.className = TITLE_CLASS;
    slideTitle.appendChild(h1);

    const slideDescription = document.createElement("div");
    slideDescription.className =
      "slide-description mt-2 md:mt-3 w-full md:w-auto md:max-w-[48rem]";
    const p = document.createElement("p");
    p.textContent = slideData.slideDescription;
    p.className =
      "text-white/90 leading-relaxed text-sm md:text-base lg:text-lg";
    slideDescription.appendChild(p);

    const slideLink = document.createElement("div");
    slideLink.className = "slide-link mt-3 md:mt-4";
    const a = document.createElement("a");
    a.href = slideData.slideUrl;
    a.textContent = "VIEW PROJECT";
    a.className =
      "inline-block text-white/95 underline underline-offset-4 " +
      "text-sm md:text-base lg:text-lg";
    slideLink.appendChild(a);

    slideHeader.appendChild(slideTitle);
    slideHeader.appendChild(slideDescription);
    slideHeader.appendChild(slideLink);

    /* === 底部資訊（Tags / Index）=== */
    const slideInfo = document.createElement("div");
    slideInfo.className =
      "slide-info absolute left-4 right-4 bottom-4 md:left-8 md:right-8 " +
      "z-20 flex items-end justify-between gap-6";

    // Tags（左下）
    const slideTags = document.createElement("div");
    slideTags.className = "slide-tags space-y-1";
    const tagsLabel = document.createElement("p");
    tagsLabel.textContent = "Tags";
    tagsLabel.className = "text-white/70 text-xs md:text-sm";
    slideTags.appendChild(tagsLabel);

    const tagsWrap = document.createElement("div");
    tagsWrap.className = "flex flex-wrap gap-x-3 gap-y-1";
    slideData.slideTags.forEach((tag) => {
      const tagP = document.createElement("p");
      tagP.textContent = tag;
      tagP.className = "text-white/90 text-xs md:text-sm";
      tagsWrap.appendChild(tagP);
    });
    slideTags.appendChild(tagsWrap);

    // Index（右下）→ 三個 <p> 強制純白
    const slideIndexWrapper = document.createElement("div");
    slideIndexWrapper.className =
      "slide-index-wrapper flex items-center gap-2 md:gap-3 mr-10";
    const slideIndexCopy = document.createElement("p");
    slideIndexCopy.textContent = slideIndex.toString().padStart(2, "0");
    slideIndexCopy.className = "text-white text-sm md:text-base lg:text-lg";
    const slideIndexSeparator = document.createElement("p");
    slideIndexSeparator.textContent = "/";
    slideIndexSeparator.className =
      "text-white text-sm md:text-base lg:text-lg";
    const slidesTotalCount = document.createElement("p");
    slidesTotalCount.textContent = totalSlides.toString().padStart(2, "0");
    slidesTotalCount.className = "text-white text-sm md:text-base lg:text-lg";

    slideIndexWrapper.appendChild(slideIndexCopy);
    slideIndexWrapper.appendChild(slideIndexSeparator);
    slideIndexWrapper.appendChild(slidesTotalCount);

    slideInfo.appendChild(slideTags);
    slideInfo.appendChild(slideIndexWrapper);

    // 組裝層級：圖 → 漸層 → Header → Info
    slide.appendChild(slideImg);
    slide.appendChild(gradient);
    slide.appendChild(slideHeader);
    slide.appendChild(slideInfo);

    return slide;
  };

  const splitText = (slide) => {
    const slideHeader = slide.querySelector(".slide-title h1");
    if (slideHeader) {
      SplitText.create(slideHeader, {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
    }

    const slideContent = slide.querySelectorAll("p, a");
    slideContent.forEach((element) => {
      SplitText.create(element, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
        reduceWhiteSpace: false,
      });
    });
  };

  const animateSlide = (direction) => {
    if (isAnimatingRef.current || !scrollAllowedRef.current) return;

    isAnimatingRef.current = true;
    scrollAllowedRef.current = false;

    const slider = sliderRef.current;
    const currentSlideElement = slider.querySelector(".slide");

    if (direction === "down") {
      currentSlideRef.current =
        currentSlideRef.current === totalSlides
          ? 1
          : currentSlideRef.current + 1;
    } else {
      currentSlideRef.current =
        currentSlideRef.current === 1
          ? totalSlides
          : currentSlideRef.current - 1;
    }

    const exitY = direction === "down" ? EXIT_Y_DOWN : EXIT_Y_UP;
    const entryY = direction === "down" ? "100vh" : "-100vh";
    const entryClipPath =
      direction === "down" ? ENTRY_CLIP_DOWN : ENTRY_CLIP_UP;

    gsap.to(currentSlideElement, {
      scale: EXIT_SCALE,
      opacity: 0,
      rotation: EXIT_ROTATION,
      y: exitY,
      duration: CONTAINER_OUT_DURATION,
      ease: "power4.inOut",
      force3D: true,
      onComplete: () => currentSlideElement.remove(),
    });

    setTimeout(() => {
      const newSlide = createSlide(currentSlideRef.current);

      gsap.set(newSlide, { y: entryY, clipPath: entryClipPath, force3D: true });
      slider.appendChild(newSlide);
      splitText(newSlide);

      const words = newSlide.querySelectorAll(".word");
      const lines = newSlide.querySelectorAll(".line");

      gsap.set([...words, ...lines], { y: "100%", force3D: true });

      gsap.to(newSlide, {
        y: 0,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: CONTAINER_IN_DURATION,
        ease: "power4.out",
        force3D: true,
        onStart: () => {
          const tl = gsap.timeline();

          const headerWords = newSlide.querySelectorAll(".slide-title .word");
          tl.to(
            headerWords,
            {
              y: "0%",
              duration: HEADER_DURATION,
              ease: "power4.out",
              stagger: WORD_STAGGER,
              force3D: true,
            },
            0.6
          );

          const tagsLines = newSlide.querySelectorAll(".slide-tags .line");
          const indexLines = newSlide.querySelectorAll(
            ".slide-index-wrapper .line"
          );
          const descriptionLines = newSlide.querySelectorAll(
            ".slide-description .line"
          );

          tl.to(
            tagsLines,
            {
              y: "0%",
              duration: LINES_DURATION,
              ease: "power4.out",
              stagger: LINE_STAGGER,
            },
            "-=0.6"
          );
          tl.to(
            indexLines,
            {
              y: "0%",
              duration: LINES_DURATION,
              ease: "power4.out",
              stagger: LINE_STAGGER,
            },
            "<"
          );
          tl.to(
            descriptionLines,
            {
              y: "0%",
              duration: LINES_DURATION,
              ease: "power4.out",
              stagger: LINE_STAGGER,
            },
            "<"
          );

          const linkLines = newSlide.querySelectorAll(".slide-link .line");
          tl.to(
            linkLines,
            { y: "0%", duration: LINK_DURATION, ease: "power4.out" },
            "-=0.8"
          );
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          setTimeout(() => {
            scrollAllowedRef.current = true;
            lastScrollTimeRef.current = Date.now();
          }, 100);
        },
      });
    }, 550);
  };

  const startAutoSlide = () => {
    autoSlideIntervalRef.current = setInterval(() => {
      animateSlide("down");
    }, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideIntervalRef.current);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const initialSlide = createSlide(1);
    slider.appendChild(initialSlide);
    splitText(initialSlide);

    const words = initialSlide.querySelectorAll(".word");
    const lines = initialSlide.querySelectorAll(".line");

    gsap.set([...words, ...lines], { y: "100%", force3D: true });
    gsap.to([...words, ...lines], {
      y: "0%",
      duration: HEADER_DURATION,
      ease: "power4.out",
      stagger: WORD_STAGGER,
      force3D: true,
    });

    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return (
    <div
      ref={sliderRef}
      className="slider bg-black w-full h-screen overflow-hidden relative"
    />
  );
};

export default Slider;
