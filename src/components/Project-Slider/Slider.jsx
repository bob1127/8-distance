"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import slides from "./slides.js";

const Slider = () => {
  const sliderRef = useRef(null);
  const currentSlideRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const scrollAllowedRef = useRef(true);
  const lastScrollTimeRef = useRef(0);
  const autoSlideIntervalRef = useRef(null);

  const totalSlides = slides.length;

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

    /* === 底部可讀性漸層（不影響動畫元素）=== */
    const gradient = document.createElement("div");
    gradient.className =
      "pointer-events-none absolute inset-x-0 bottom-0 h-[40vh] " +
      "bg-gradient-to-t from-black/60 via-black/20 to-transparent";
    slide.appendChild(gradient);

    /* === Header (標題 / 說明 / 連結) - 置右設計 === */
    const slideHeader = document.createElement("div");
    slideHeader.className =
      // 手機滿寬置中；md+ 轉為靠右，限制最大寬度
      "slide-header absolute z-10 flex flex-col gap-3 " +
      "left-4 right-4 bottom-28 " +
      "md:left-auto md:right-[6vw] md:bottom-24 " +
      "lg:bottom-28 md:max-w-[42rem] md:items-end md:text-right";

    const slideTitle = document.createElement("div");
    slideTitle.className = "slide-title leading-none";
    const h1 = document.createElement("h1");
    h1.textContent = slideData.slideTitle;
    // 主標縮小 + 自適應（桌機更精緻）
    h1.className =
      "text-white font-semibold tracking-tight break-words " +
      "text-[12vw] md:text-[9vw] lg:text-[7vw] xl:text-[6vw]";
    slideTitle.appendChild(h1);

    const slideDescription = document.createElement("div");
    slideDescription.className =
      "slide-description mt-2 md:mt-3 w-full md:w-auto md:max-w-[42rem]";
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

    /* === 底部資訊（標籤 / 索引） === */
    const slideInfo = document.createElement("div");
    slideInfo.className =
      "slide-info absolute left-4 right-4 bottom-4 md:left-8 md:right-8 " +
      "z-10 flex items-end justify-between gap-6";

    // Tags（靠左）
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

    // Index（靠右）
    const slideIndexWrapper = document.createElement("div");
    slideIndexWrapper.className =
      "slide-index-wrapper flex items-center gap-2 md:gap-3 text-white/80";
    const slideIndexCopy = document.createElement("p");
    slideIndexCopy.textContent = slideIndex.toString().padStart(2, "0");
    slideIndexCopy.className = "text-sm md:text-base lg:text-lg";
    const slideIndexSeparator = document.createElement("p");
    slideIndexSeparator.textContent = "/";
    slideIndexSeparator.className = "text-sm md:text-base lg:text-lg";
    const slidesTotalCount = document.createElement("p");
    slidesTotalCount.textContent = totalSlides.toString().padStart(2, "0");
    slidesTotalCount.className = "text-sm md:text-base lg:text-lg";

    slideIndexWrapper.appendChild(slideIndexCopy);
    slideIndexWrapper.appendChild(slideIndexSeparator);
    slideIndexWrapper.appendChild(slidesTotalCount);

    slideInfo.appendChild(slideTags);
    slideInfo.appendChild(slideIndexWrapper);

    slide.appendChild(slideImg);
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

    const exitY = direction === "down" ? "-200vh" : "200vh";
    const entryY = direction === "down" ? "100vh" : "-100vh";
    const entryClipPath =
      direction === "down"
        ? "polygon(20% 20%, 80% 20%, 80% 100%, 20% 100%)"
        : "polygon(20% 0%, 80% 0%, 80% 80%, 20% 80%)";

    gsap.to(currentSlideElement, {
      scale: 0.25,
      opacity: 0,
      rotation: 30,
      y: exitY,
      duration: 2,
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
        duration: 1.5,
        ease: "power4.out",
        force3D: true,
        onStart: () => {
          const tl = gsap.timeline();

          const headerWords = newSlide.querySelectorAll(".slide-title .word");
          tl.to(
            headerWords,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
              force3D: true,
            },
            0.75
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
            { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1 },
            "-=0.75"
          );
          tl.to(
            indexLines,
            { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1 },
            "<"
          );
          tl.to(
            descriptionLines,
            { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1 },
            "<"
          );

          const linkLines = newSlide.querySelectorAll(".slide-link .line");
          tl.to(linkLines, { y: "0%", duration: 1, ease: "power4.out" }, "-=1");
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          setTimeout(() => {
            scrollAllowedRef.current = true;
            lastScrollTimeRef.current = Date.now();
          }, 100);
        },
      });
    }, 750);
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
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
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
