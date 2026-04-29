"use client";

import { useRef } from "react";
import "./page.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

// 只需註冊一次（由於在模組層，SSR 不會重複註冊）
gsap.registerPlugin(CustomEase);

const Photos = () => {
  const sliderImagesRef = useRef(null);
  const titlesRef = useRef(null);
  const sliderRef = useRef(null);

  // ✅ 指定圖片路徑（請確認檔案都在 /public 底下）
  const imagePaths = [
    "/images/index/b69ff1_dbf0d0c42626415881135b9768235d8f~mv2.jpg.avif",
    "/images/index/b69ff1_dbf0d0c42626415881135b9768235d8f~mv2.jpg.avif",
    "/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif",
    "/images/index/b69ff1_5fbc029839a748f18ca1e1ac09bd662e~mv2.jpg.avif",
  ];

  useGSAP(
    (context) => {
      // ---- helpers：只在目標存在時才執行 gsap ----
      const safeTo = (target, vars) => {
        if (!target) return;
        const els =
          target instanceof Element || target instanceof Window
            ? [target]
            : Array.from(target).filter(Boolean);
        if (!els.length) return;
        return gsap.to(els, vars);
      };
      const safeSet = (target, vars) => {
        if (!target) return;
        const els =
          target instanceof Element || target instanceof Window
            ? [target]
            : Array.from(target).filter(Boolean);
        if (!els.length) return;
        return gsap.set(els, vars);
      };

      // 自訂 easing
      if (!CustomEase.get("hop2")) {
        CustomEase.create(
          "hop2",
          "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
        );
      }

      let currentImg = 1;
      const totalSlides = imagePaths.length;

      function updateTitlePosition() {
        // 您的每段標題高度約 60px
        const titleY = -60 * (currentImg - 1);
        safeTo(titlesRef.current, {
          y: titleY,
          duration: 1,
          ease: "hop2",
        });
      }

      function animateSlide(direction) {
        const list = sliderImagesRef.current;
        if (!list) return;

        const currentSlide =
          list.lastElementChild &&
          list.lastElementChild.classList.contains("img")
            ? list.lastElementChild
            : null;

        // 新一張 slide
        const slideImg = document.createElement("div");
        slideImg.classList.add("img");

        const slideImgElem = document.createElement("img");
        slideImgElem.src = imagePaths[currentImg - 1];
        slideImgElem.alt = `slide-${currentImg}`;
        slideImg.appendChild(slideImgElem);

        // 初始位置（由左或右進場）
        safeSet(slideImgElem, { x: direction === "left" ? -500 : 500 });
        list.appendChild(slideImg);

        const tl = gsap.timeline();

        // 退出舊圖
        if (currentSlide) {
          const oldImg = currentSlide.querySelector("img");
          safeTo(oldImg, {
            x: direction === "left" ? 500 : -500,
            duration: 1.5,
            ease: "hop2",
          });
        }

        // 新圖 clip 由邊到全幅 + 位移歸位
        tl.fromTo(
          slideImg,
          {
            clipPath:
              direction === "left"
                ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.5,
            ease: "hop2",
          },
          0
        ).to(
          slideImgElem,
          {
            x: 0,
            duration: 1.5,
            ease: "hop2",
          },
          0
        );

        // 清掉太舊的 slide（列表只保留 2 張即可）
        tl.call(
          () => {
            const all = list.querySelectorAll(".img");
            if (all.length > 2) {
              const first = all[0];
              safeTo(first, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => first.remove(),
              });
            }
          },
          null,
          1.5
        );
      }

      function nextSlide() {
        currentImg = currentImg < totalSlides ? currentImg + 1 : 1;
        animateSlide("right");
        updateTitlePosition();
      }

      // ✅ 初始狀態：統一由 JS 插入第一張，避免 JSX 裡死圖不同步
      const list = sliderImagesRef.current;
      if (list) {
        list.innerHTML = ""; // 清空，避免殘留不相符的初始節點
        const first = document.createElement("div");
        first.classList.add("img");
        const img = document.createElement("img");
        img.src = imagePaths[0];
        img.alt = "slide-1";
        first.appendChild(img);
        list.appendChild(first);
      }

      // 自動撥放
      const autoSlideInterval = setInterval(nextSlide, 4000);

      function handleClick(event) {
        const wrap = sliderRef.current;
        if (!wrap) return;

        const rect = wrap.getBoundingClientRect();
        const clickX = event.clientX - rect.left;

        if (clickX < rect.width / 2) {
          // 往左上一張
          currentImg = currentImg > 1 ? currentImg - 1 : totalSlides;
          animateSlide("left");
        } else {
          // 往右下一張
          currentImg = currentImg < totalSlides ? currentImg + 1 : 1;
          animateSlide("right");
        }
        updateTitlePosition();
      }

      sliderRef.current?.addEventListener("click", handleClick);

      // 初始化標題位置
      updateTitlePosition();

      // 清理
      return () => {
        sliderRef.current?.removeEventListener("click", handleClick);
        clearInterval(autoSlideInterval);
      };
    },
    // 讓 GSAP 的 selector/context 作用範圍只在 sliderRef
    { scope: sliderRef, dependencies: [] }
  );

  return (
    <>
      <div className="slider" ref={sliderRef}>
        {/* ✅ 這裡不再手動塞第一張，交由 JS 統一初始化 */}
        <div className="slider-images" ref={sliderImagesRef} />

        {/* 只有標題有掛 ref，其它（counter/indicators/previews）先拿掉，避免 null 目標 */}
        <div className="slider-title">
          <div className="slider-title-wrapper" ref={titlesRef}>
            <p>Above The Canvas</p>
            <p>Above The Canvas</p>
            <p>Harmony in Every Note</p>
            <p>Redefining Imagination</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Photos;
