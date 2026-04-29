"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * 使用方式：
 * 1) npm i gsap lenis
 * 2) 將 /public 放 icon_1.png ~ icon_5.png
 * 3) 直接引入 <CodegridScroll /> 使用
 */
export default function CodegridScroll() {
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const iconsWrapRef = useRef(null);
  const iconRefs = useRef([]);
  const textRefs = useRef([]);
  const placeholderRefs = useRef([]);
  const duplicateIconsRef = useRef(null); // 存放動態複製的 icon 節點陣列

  // 清理動態複製的 icon
  const removeDuplicates = () => {
    if (duplicateIconsRef.current && duplicateIconsRef.current.length) {
      duplicateIconsRef.current.forEach((d) => d?.parentNode?.removeChild(d));
    }
    duplicateIconsRef.current = null;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis 慣性捲動
    const lenis = new Lenis();
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const heroSection = heroRef.current;
    const heroHeader = headerRef.current;
    const animatedIcons = iconsWrapRef.current;
    const iconElements = iconRefs.current;
    const textSegments = textRefs.current;
    const placeholders = placeholderRefs.current;

    // 建立隨機出現順序
    const textAnimationOrder = textSegments.map((segment, i) => ({
      segment,
      originalIndex: i,
    }));
    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [textAnimationOrder[i], textAnimationOrder[j]] = [
        textAnimationOrder[j],
        textAnimationOrder[i],
      ];
    }

    const isMobile = window.innerWidth <= 1000;
    const headerIconSize = isMobile ? 30 : 60;
    const currentIconSize =
      iconElements[0]?.getBoundingClientRect()?.width || headerIconSize;
    const exactScale = currentIconSize ? headerIconSize / currentIconSize : 1;

    // ScrollTrigger 主動畫
    const st = ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // 先把所有文字段落隱藏
        textSegments.forEach((segment) => {
          gsap.set(segment, { opacity: 0 });
        });

        if (progress <= 0.3) {
          // 第一段：icons 從底部往上
          const moveProgress = progress / 0.3;
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

          // 1-1 header 上移與淡出
          if (progress <= 0.15) {
            const headerProgress = progress / 0.15;
            const headerMoveY = -50 * headerProgress;
            const headerOpacity = 1 - headerProgress;
            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
              opacity: headerOpacity,
            });
          } else {
            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + -50px))`,
              opacity: 0,
            });
          }

          // 移除複製 icons
          removeDuplicates();

          gsap.set(animatedIcons, {
            x: 0,
            y: containerMoveY,
            scale: 1,
            opacity: 1,
          });

          // 個別 icon 依序進場
          iconElements.forEach((icon, index) => {
            const staggerDelay = index * 0.1;
            const iconStart = staggerDelay;
            const iconEnd = staggerDelay + 0.5;
            const iconProgress = gsap.utils.mapRange(
              iconStart,
              iconEnd,
              0,
              1,
              moveProgress
            );
            const clamped = Math.max(0, Math.min(1, iconProgress));

            const startOffset = -containerMoveY;
            const individualY = startOffset * (1 - clamped);
            gsap.set(icon, { x: 0, y: individualY });
          });
        } else if (progress <= 0.6) {
          // 第二段：icons 聚中 + 縮放
          const scaleProgress = (progress - 0.3) / 0.3;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });

          // 背景色過渡
          heroSection.style.backgroundColor =
            scaleProgress >= 0.5 ? "#e3e3db" : "#141414";

          // 移除舊的複製 icons
          removeDuplicates();

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
          const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
          const baseY = -window.innerHeight * 0.3;
          const currentScale = 1 + (exactScale - 1) * scaleProgress;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: currentScale,
            opacity: 1,
          });
          iconElements.forEach((icon) => gsap.set(icon, { x: 0, y: 0 }));
        } else if (progress <= 0.75) {
          // 第三段：icons 移到文字中的 placeholder 位置（垂直→水平分兩段）
          const moveProgress = (progress - 0.6) / 0.15;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });

          heroSection.style.backgroundColor = "#e3e3db";

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = targetCenterX - currentCenterX;
          const deltaY = targetCenterY - currentCenterY;
          const baseY = -window.innerHeight * 0.3;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: exactScale,
            opacity: 0,
          });
          iconElements.forEach((icon) => gsap.set(icon, { x: 0, y: 0 }));

          // 建立複製 icons（一次性）
          if (!duplicateIconsRef.current) {
            duplicateIconsRef.current = [];
            iconElements.forEach(() => {
              const dup = document.createElement("div");
              dup.className =
                "duplicate-icon fixed flex items-center justify-center";
              dup.style.width = `${headerIconSize}px`;
              dup.style.height = `${headerIconSize}px`;
              dup.style.opacity = "0";
              dup.style.willChange = "transform, left, top, opacity";
              // 放個占位方塊（也可自行改成 <img>）
              dup.style.background = "#141414";
              dup.style.borderRadius = "0.375rem";
              dup.style.zIndex = "30";
              document.body.appendChild(dup);
              duplicateIconsRef.current.push(dup);
            });
          }

          // 更新複製 icons 位置（先垂直再水平）
          if (duplicateIconsRef.current) {
            duplicateIconsRef.current.forEach((dup, index) => {
              if (index >= placeholders.length) return;

              const iconRect = iconElements[index].getBoundingClientRect();
              const startCenterX = iconRect.left + iconRect.width / 2;
              const startCenterY = iconRect.top + iconRect.height / 2;
              const startPageX = startCenterX + window.pageXOffset;
              const startPageY = startCenterY + window.pageYOffset;

              const targetRect = placeholders[index].getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const targetPageX = targetCenterX + window.pageXOffset;
              const targetPageY = targetCenterY + window.pageYOffset;

              const moveX = targetPageX - startPageX;
              const moveY = targetPageY - startPageY;

              let curX = 0;
              let curY = 0;

              if (moveProgress <= 0.5) {
                const v = moveProgress / 0.5;
                curY = moveY * v;
              } else {
                const h = (moveProgress - 0.5) / 0.5;
                curY = moveY;
                curX = moveX * h;
              }

              const finalX = startPageX + curX - headerIconSize / 2;
              const finalY = startPageY + curY - headerIconSize / 2;

              dup.style.left = `${finalX}px`;
              dup.style.top = `${finalY}px`;
              dup.style.opacity = "1";
              dup.style.display = "flex";
            });
          }
        } else {
          // 第四段：icons 停到 placeholder，文字 segment 依序顯示
          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -100px))`,
            opacity: 0,
          });

          heroSection.style.backgroundColor = "#e3e3db";
          gsap.set(animatedIcons, { opacity: 0 });

          if (duplicateIconsRef.current) {
            duplicateIconsRef.current.forEach((dup, index) => {
              if (index >= placeholders.length) return;
              const rect = placeholders[index].getBoundingClientRect();
              const cx = rect.left + rect.width / 2 + window.pageXOffset;
              const cy = rect.top + rect.height / 2 + window.pageYOffset;
              dup.style.left = `${cx - headerIconSize / 2}px`;
              dup.style.top = `${cy - headerIconSize / 2}px`;
              dup.style.opacity = "1";
              dup.style.display = "flex";
            });
          }

          // 文字依亂數順序淡入
          textAnimationOrder.forEach((item, randomIndex) => {
            const segmentStart = 0.75 + randomIndex * 0.03;
            const segmentEnd = segmentStart + 0.015;
            const segProgress = gsap.utils.mapRange(
              segmentStart,
              segmentEnd,
              0,
              1,
              progress
            );
            const clamped = Math.max(0, Math.min(1, segProgress));
            gsap.set(item.segment, { opacity: clamped });
          });
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.killAll();
      gsap.ticker.remove(() => {});
      lenis.off("scroll", onScroll);
      // lenis 無需 destroy，但可視需求：
      // @ts-ignore
      if (lenis.destroy) lenis.destroy();
      removeDuplicates();
    };
  }, []);

  // 工具：綁 ref 陣列
  const bindIconRef = (el, i) => {
    iconRefs.current[i] = el;
  };
  const bindTextRef = (el, i) => {
    textRefs.current[i] = el;
  };
  const bindPlaceholderRef = (el, i) => {
    placeholderRefs.current[i] = el;
  };

  return (
    <div className="relative">
      {/* HERO 區 */}
      <section
        ref={heroRef}
        className="relative w-screen h-[100svh] p-6 flex items-center justify-center bg-[#141414] text-[#e3e3db] overflow-hidden flex-col transition-colors duration-300"
      >
        {/* Header 文字 */}
        <div
          ref={headerRef}
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] text-center flex flex-col gap-8"
          style={{ willChange: "transform, opacity" }}
        >
          <h1 className="text-[7vw] font-extrabold leading-none">
            CodegridPRO
          </h1>
          <p className="text-[1.5rem] font-normal">
            One subscription, endless web design.
          </p>
        </div>

        {/* 底部可動 Icons 容器 */}
        <div
          ref={iconsWrapRef}
          className="fixed bottom-4 left-4 right-4 flex items-center gap-4 z-20"
          style={{ willChange: "transform" }}
        >
          {[
            "/icon_1.png",
            "/icon_2.png",
            "/icon_3.png",
            "/icon_4.png",
            "/icon_5.png",
          ].map((src, i) => (
            <div
              key={i}
              ref={(el) => bindIconRef(el, i)}
              className="flex-1 aspect-square"
              style={{ willChange: "transform" }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* 中央大標（含 placeholder） */}
        <h1 className="relative max-w-[1000px] text-center text-[#141414] font-extrabold leading-none [font-size:clamp(2rem,5vw,4rem)]">
          <span
            ref={(el) => bindPlaceholderRef(el, 0)}
            className="inline-block align-middle invisible mt-[-10px] w-[60px] h-[60px] md:mt-[-10px]"
            style={{ willChange: "transform" }}
          />
          <span ref={(el) => bindTextRef(el, 0)} className="opacity-0">
            Delve into coding
          </span>
          <span
            ref={(el) => bindPlaceholderRef(el, 1)}
            className="inline-block align-middle invisible mt-[-10px] w-[60px] h-[60px] md:mt-[-10px]"
            style={{ willChange: "transform" }}
          />
          <span ref={(el) => bindTextRef(el, 1)} className="opacity-0">
            without clutter.
          </span>
          <span ref={(el) => bindTextRef(el, 2)} className="opacity-0">
            {" "}
            Unlock source code{" "}
          </span>
          <span
            ref={(el) => bindPlaceholderRef(el, 2)}
            className="inline-block align-middle invisible mt-[-10px] w-[60px] h-[60px] md:mt-[-10px]"
            style={{ willChange: "transform" }}
          />
          <span ref={(el) => bindTextRef(el, 3)} className="opacity-0">
            for every tutorial
          </span>
          <span
            ref={(el) => bindPlaceholderRef(el, 3)}
            className="inline-block align-middle invisible mt-[-10px] w-[60px] h-[60px] md:mt-[-10px]"
            style={{ willChange: "transform" }}
          />
          <span ref={(el) => bindTextRef(el, 4)} className="opacity-0">
            published on the Codegrid
          </span>
          <span
            ref={(el) => bindPlaceholderRef(el, 4)}
            className="inline-block align-middle invisible mt-[-10px] w-[60px] h-[60px] md:mt-[-10px]"
            style={{ willChange: "transform" }}
          />
          <span ref={(el) => bindTextRef(el, 5)} className="opacity-0">
            YouTube channel.
          </span>
        </h1>
      </section>

      {/* OUTRO 區 */}
      <section className="relative w-screen h-[100svh] p-6 flex items-center justify-center bg-[#141414] text-[#e3e3db] overflow-hidden">
        <h1 className="text-[7vw] font-extrabold leading-none">
          Link in description
        </h1>
      </section>
    </div>
  );
}
