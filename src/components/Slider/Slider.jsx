"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders.js";
// ❌ 移除這行（會覆蓋掉外面傳進來的 slides）
// import { slides } from "./slides.js";

/**
 * 用法：
 * <Slider
 *   slides={[{ image: "/images/index/住宅空間-程宅.jpg" }, ...]}
 *   overlayTitle="住宅空間"
 *   overlaySubtitle="RESIDENTIAL"
 *   overlayDesc="專屬你的生活動線與材質表情。"
 *   overlayContainerClass="top-[45%] group-hover:top-[40%]"
 *   overlayTitleClass="text-[35px] text-center text-white m-0 font-extrabold  transition-all duration-300"
 *   overlaySubtitleClass="text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300"
 *   overlayDescClass="text-[14px] max-w-[420px] opacity-0 group-hover:opacity-100 transition duration-400 delay-75"
 *   intervalMs={5000}
 * />
 *
 * slides: [{ title?: string, image: string }]
 * ※ 只需要 image（title 可選，用來顯示文字動畫）
 */
const Slider = ({
  slides = [],
  overlayTitle = "PORTFOLIO",
  overlaySubtitle = "SUBTITLE",
  overlayDesc = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, soluta?",
  showOverlay = true,
  overlayContainerClass = "top-[45%] group-hover:top-[40%]",
  overlayTitleClass = "text-[35px] text-center text-white m-0 font-extrabold transition-all duration-300",
  overlaySubtitleClass = "text-[18px] text-white text-center font-extrabold group-hover:opacity-80 transition-all duration-300",
  overlayDescClass = "text-[14px] max-w-[400px]",
  intervalMs = 5000,
}) => {
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);

  let currentSlideIndex = 0;
  let isTransitioning = false;
  let slideTextures = [];
  let shaderMaterial, renderer, rafId;

  // 沒有 slides 直接不渲染
  const hasSlides = Array.isArray(slides) && slides.length > 0;

  /** 文字掛載點：優先 .txt */
  const getTextMountEl = () => {
    const root = sliderRef.current;
    return root?.querySelector(".txt") || root;
  };

  /** ======== 文字拆分（保留你原本的動畫邏輯） ======== */
  const createCharacterElements = (element) => {
    if (!element || element.querySelectorAll(".char").length > 0) return;

    const words = (element.textContent || "").split(" ");
    element.innerHTML = "";

    words.forEach((word, index) => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "word flex text-[60px]";

      [...word].forEach((char) => {
        const charDiv = document.createElement("div");
        charDiv.className = "char block text-[60px] overflow-hidden";
        charDiv.innerHTML = `<span class="inline-block will-change-transform relative">${char}</span>`;
        wordDiv.appendChild(charDiv);
      });

      element.appendChild(wordDiv);

      if (index < words.length - 1) {
        const spaceChar = document.createElement("div");
        spaceChar.className = "word flex text-[60px]";
        spaceChar.innerHTML =
          '<div class="char block text-[60px] overflow-hidden"><span class="inline-block will-change-transform relative">&nbsp;</span></div>';
        element.appendChild(spaceChar);
      }
    });
  };

  const processTextElements = async (container) => {
    const title = container.querySelector(".slide-title h1");
    if (title) createCharacterElements(title);
  };

  /** 只建立 title（如未提供 title 就不顯示） */
  const createSlideElement = (slideData) => {
    const titleText = slideData?.title || "";
    const content = document.createElement("div");
    content.className =
      "slider-content opacity-0 text-white text-center flex flex-col items-center justify-center";
    content.innerHTML = titleText
      ? `
        <div class="slide-title mt-2">
          <h1 class="flex justify-center gap-[0.2em] text-[40px] md:text-[60px] leading-none font-bold tracking-tight">${titleText}</h1>
        </div>
      `
      : ""; // 沒有 title 就不渲染標題
    return content;
  };

  const animateSlideTransition = async (nextIndex) => {
    const mount = getTextMountEl();
    const currentContent = mount.querySelector(".slider-content");
    const timeline = gsap.timeline();

    if (currentContent) {
      timeline.to([...currentContent.querySelectorAll(".char span")], {
        y: "-100%",
        duration: 0.6,
        stagger: 0.025,
        ease: "power2.inOut",
      });
    }

    timeline.call(
      async () => {
        const newContent = createSlideElement(slides[nextIndex]);
        if (currentContent) currentContent.remove();
        mount.appendChild(newContent);

        await processTextElements(newContent);
        const newChars = newContent.querySelectorAll(".char span");

        gsap.set(newChars, { y: "100%" });
        gsap.set(newContent, { opacity: 1 });

        gsap
          .timeline({
            onComplete: () => {
              isTransitioning = false;
              currentSlideIndex = nextIndex;
            },
          })
          .to(newChars, {
            y: "0%",
            duration: 0.5,
            stagger: 0.025,
            ease: "power2.inOut",
          });
      },
      null,
      currentContent ? 0.1 : 0
    );
  };

  const setupInitialSlide = async () => {
    if (!hasSlides) return;
    const mount = getTextMountEl();
    const slideElement = createSlideElement(slides[0]);
    mount.appendChild(slideElement);
    await processTextElements(slideElement);

    const chars = slideElement.querySelectorAll(".char span");
    gsap.set(slideElement, { opacity: 1 });
    gsap.fromTo(
      chars,
      { y: "100%" },
      { y: "0%", duration: 0.8, stagger: 0.025, ease: "power2.out" }
    );
  };

  /** ======== WebGL 初始化 ======== */
  const initializeRenderer = async () => {
    if (!hasSlides) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    const container = sliderRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);

    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    slideTextures = [];
    for (const s of slides) {
      const texture = await new Promise((resolve, reject) =>
        loader.load(s.image, (t) => resolve(t), undefined, reject)
      );
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.userData = {
        size: new THREE.Vector2(
          texture.image?.naturalWidth || texture.image?.width,
          texture.image?.naturalHeight || texture.image?.height
        ),
      };
      slideTextures.push(texture);
    }

    // 若只有一張圖，兩個 uniform 都用同一張，避免 undefined
    const t0 = slideTextures[0];
    const t1 = slideTextures[1 % slideTextures.length] || t0;

    shaderMaterial.uniforms.uTexture1.value = t0;
    shaderMaterial.uniforms.uTexture2.value = t1;
    shaderMaterial.uniforms.uTexture1Size.value = t0.userData.size;
    shaderMaterial.uniforms.uTexture2Size.value = t1.userData.size;

    const render = () => {
      rafId = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  };

  const handleSlideChange = () => {
    if (isTransitioning || !hasSlides || slides.length < 2) return;

    isTransitioning = true;
    const nextIndex = (currentSlideIndex + 1) % slides.length;

    shaderMaterial.uniforms.uTexture1.value = slideTextures[currentSlideIndex];
    shaderMaterial.uniforms.uTexture2.value = slideTextures[nextIndex];
    shaderMaterial.uniforms.uTexture1Size.value =
      slideTextures[currentSlideIndex].userData.size;
    shaderMaterial.uniforms.uTexture2Size.value =
      slideTextures[nextIndex].userData.size;

    animateSlideTransition(nextIndex);

    gsap.fromTo(
      shaderMaterial.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
          shaderMaterial.uniforms.uProgress.value = 0;
          shaderMaterial.uniforms.uTexture1.value = slideTextures[nextIndex];
          shaderMaterial.uniforms.uTexture1Size.value =
            slideTextures[nextIndex].userData.size;
        },
      }
    );
  };

  const handleResize = () => {
    if (!renderer || !shaderMaterial || !sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    const height = sliderRef.current.clientHeight;
    renderer.setSize(width, height);
    shaderMaterial.uniforms.uResolution.value.set(width, height);
  };

  useEffect(() => {
    if (!hasSlides) return;

    let interval;
    (async () => {
      await setupInitialSlide();
      await initializeRenderer();

      interval = setInterval(handleSlideChange, intervalMs);
      window.addEventListener("resize", handleResize);
    })();

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (renderer) renderer.dispose?.();
      slideTextures.forEach((t) => t.dispose?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSlides, intervalMs]);

  return (
    <div
      className="w-full group relative h-[800px] text-white overflow-hidden"
      ref={sliderRef}
    >
      {/* hover 遮罩 */}
      <div className="mask absolute bg-black/45 opacity-0 group-hover:opacity-100 transition duration-300 w-full h-full z-30 left-0 top-0"></div>

      {/* ✅ 可自訂 Overlay（水平置中、保留 hover 動畫） */}
      {showOverlay && (
        <>
          <div
            className={`absolute z-50 left-1/2 -translate-x-1/2 ${overlayContainerClass} transition-all duration-400 scale-100 group-hover:scale-115 text-center flex flex-col items-center pointer-events-none`}
          >
            <h2 className={`${overlayTitleClass}`}>{overlayTitle}</h2>
            <span className={`${overlaySubtitleClass}`}>{overlaySubtitle}</span>
          </div>

          <p
            className={`text-white absolute opacity-0 group-hover:opacity-100 delay-75 transition duration-400 z-50 left-1/2 -translate-x-1/2 top-[55%] text-center ${overlayDescClass}`}
            style={{ pointerEvents: "none" }}
          >
            {overlayDesc}
          </p>
        </>
      )}

      {/* 置中文字內容（.slider-content 會插入這裡） */}
      <div className="absolute z-50 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="txt w-full h-full relative flex flex-col items-center justify-center"></div>
      </div>

      {/* 底層暗層 */}
      <div className="mask bg-black opacity-45 w-full h-full absolute left-0 top-0"></div>

      {/* 背景 Canvas */}
      <div className="scale-100 transition duration-1000 group-hover:scale-110">
        <canvas ref={canvasRef} className="ca-block w-full h-auto" />
      </div>
    </div>
  );
};

export default Slider;
