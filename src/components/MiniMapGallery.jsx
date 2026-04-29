"use client";

import { useEffect, useRef, useState } from "react";

export default function MiniMapGallery({
  images: rawImages = [],
  currentIndex = 0,
  onClose,
}) {
  const images = (rawImages || [])
    .map((img) => (typeof img === "string" ? { src: img, alt: "" } : img))
    .filter((img) => img && img.src && String(img.src).trim() !== "");

  const containerRef = useRef(null);
  const thumbsViewportRef = useRef(null);
  const itemsRef = useRef(null);
  const indicatorRef = useRef(null);
  const previewImageRef = useRef(null);
  const itemRefs = useRef([]);
  const itemImgRefs = useRef([]); // ✅ 直接存縮圖 <img>，避免每禎 querySelector
  const rafRef = useRef(null);

  const translateRef = useRef({
    current: 0,
    target: 0,
    min: 0,
    max: 0,
  });

  const [isHorizontal, setIsHorizontal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const activeIndexRef = useRef(0); // ✅ 目前焦點（用 ref 降低 re-render）
  const animatingRef = useRef(false); // ✅ rAF 是否啟動

  const dimsRef = useRef({
    itemSize: 0,
    viewportSize: 0,
  });

  const ACTIVE_OPACITY = 1;
  const INACTIVE_OPACITY = 0.6;

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  /* ============== 尺寸、邊界、黑匡固定中間 ============== */
  const updateDimensions = () => {
    const horizontal = window.innerWidth <= 900;
    setIsHorizontal(horizontal);

    const firstItem = itemRefs.current[0];
    if (!firstItem) return;

    const itemSize = horizontal
      ? firstItem.offsetWidth
      : firstItem.offsetHeight;
    const viewportSize = thumbsViewportRef.current
      ? horizontal
        ? thumbsViewportRef.current.offsetWidth
        : thumbsViewportRef.current.offsetHeight
      : 0;

    dimsRef.current = { itemSize, viewportSize };

    if (indicatorRef.current) {
      if (horizontal) {
        Object.assign(indicatorRef.current.style, {
          width: `${itemSize}px`,
          height: "100%",
          left: "50%",
          top: "0",
          transform: "translateX(-50%)",
        });
      } else {
        Object.assign(indicatorRef.current.style, {
          width: "100%",
          height: `${itemSize}px`,
          top: "50%",
          left: "0",
          transform: "translateY(-50%)",
        });
      }
    }

    const centerOffset = (viewportSize - itemSize) / 2;
    const min = centerOffset - (images.length - 1) * itemSize;
    const max = centerOffset;

    translateRef.current.min = min;
    translateRef.current.max = max;
  };

  /* ============== 根據 translate 算視覺中心的索引 ============== */
  const getFocusIndex = (v) => {
    const { itemSize, viewportSize } = dimsRef.current;
    if (!itemSize || !images.length) return 0;
    const centerOffset = (viewportSize - itemSize) / 2;
    let idx = Math.round((centerOffset - v) / itemSize);
    return clamp(idx, 0, images.length - 1);
  };

  /* ============== 只在需要時更新主圖與縮圖透明度 ============== */
  const setActiveIndex = (idx) => {
    if (idx === activeIndexRef.current) return;

    const prev = activeIndexRef.current;
    activeIndexRef.current = idx;

    // 主圖：只有在 index 真的變化時才換 src / state
    const g = images[idx];
    if (g && previewImageRef.current) {
      if (previewImageRef.current.src !== g.src) {
        previewImageRef.current.src = g.src;
      }
      previewImageRef.current.alt = g.alt || "";
    }
    // React state 只在變化時設定，避免每禎 re-render
    setCurrentImageIndex(idx);

    // 縮圖透明度：只改前一張與現在這張
    const prevImg = itemImgRefs.current[prev];
    const curImg = itemImgRefs.current[idx];
    if (prevImg) prevImg.style.opacity = String(INACTIVE_OPACITY);
    if (curImg) curImg.style.opacity = String(ACTIVE_OPACITY);
  };

  /* ============== rAF：移動/收斂時才跑；靜止就停 ============== */
  const tick = () => {
    const t = translateRef.current;
    // 跟手程度可調 0.06~0.15
    let v = lerp(t.current, t.target, 0.12);

    // 逼近到很小的誤差就「到位」
    if (Math.abs(t.target - v) < 0.25) v = t.target;

    // 減少 sub-pixel 抖動
    v = Math.round(v * 100) / 100;

    t.current = v;

    if (itemsRef.current) {
      if (isHorizontal) {
        itemsRef.current.style.transform = `translate3d(${v}px,0,0)`;
      } else {
        itemsRef.current.style.transform = `translate3d(0,${v}px,0)`;
      }
    }

    // 只有在接近目標（避免滑動途中狂切圖）時才切主圖/透明度
    const { itemSize } = dimsRef.current;
    const nearTarget = Math.abs(t.target - v) <= (itemSize || 1) * 0.25;
    if (nearTarget) {
      const idx = getFocusIndex(v);
      setActiveIndex(idx);
    }

    const stillMoving = Math.abs(t.target - v) > 0.1;
    if (stillMoving) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      animatingRef.current = false; // 停止
    }
  };

  const startRAF = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  };

  /* ============== 讓指定索引置中 ============== */
  const centerByIndex = (idx) => {
    const { itemSize, viewportSize } = dimsRef.current;
    if (!itemSize) return;
    const centerOffset = (viewportSize - itemSize) / 2;
    const target = centerOffset - idx * itemSize;
    translateRef.current.target = clamp(
      target,
      translateRef.current.min,
      translateRef.current.max
    );
    startRAF();
  };

  /* ============== 事件與初始化 ============== */
  useEffect(() => {
    if (!images.length) return;

    const el = containerRef.current;

    const onWheel = (e) => {
      e.preventDefault();
      const raw = e.deltaY ?? e.deltaX ?? 0;
      const delta = Math.max(-40, Math.min(40, raw)); // 限制單次步進，避免一次跳太大
      const t = translateRef.current;
      t.target = clamp(t.target - delta * 0.8, t.min, t.max);
      startRAF();
    };

    let start = 0;
    const onTouchStart = (e) => {
      start = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      const now = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
      const delta = start - now;
      const t = translateRef.current;
      t.target = clamp(t.target - delta, t.min, t.max);
      start = now;
      e.preventDefault();
      startRAF();
    };

    const onResize = () => {
      updateDimensions();
      const idx = activeIndexRef.current;
      const { itemSize, viewportSize } = dimsRef.current;
      const centerOffset = (viewportSize - itemSize) / 2;
      const newPos = clamp(
        centerOffset - idx * itemSize,
        translateRef.current.min,
        translateRef.current.max
      );
      translateRef.current.current = newPos;
      translateRef.current.target = newPos;

      if (itemsRef.current) {
        if (isHorizontal) {
          itemsRef.current.style.transform = `translate3d(${newPos}px,0,0)`;
        } else {
          itemsRef.current.style.transform = `translate3d(0,${newPos}px,0)`;
        }
      }
    };

    el?.addEventListener("wheel", onWheel, { passive: false });
    el?.addEventListener("touchstart", onTouchStart, { passive: true });
    el?.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onResize);

    updateDimensions();

    const idx0 = clamp(currentIndex, 0, images.length - 1);
    const { itemSize, viewportSize } = dimsRef.current;
    const centerOffset = (viewportSize - itemSize) / 2;
    const startPos = clamp(
      centerOffset - idx0 * itemSize,
      translateRef.current.min,
      translateRef.current.max
    );

    translateRef.current.current = startPos;
    translateRef.current.target = startPos;

    // 初始化 transform
    if (itemsRef.current) {
      if (isHorizontal) {
        itemsRef.current.style.transform = `translate3d(${startPos}px,0,0)`;
      } else {
        itemsRef.current.style.transform = `translate3d(0,${startPos}px,0)`;
      }
    }

    // 初始化主圖 + 縮圖透明度（只改一次）
    activeIndexRef.current = idx0;
    setCurrentImageIndex(idx0);
    if (previewImageRef.current) {
      previewImageRef.current.src = images[idx0]?.src || "";
      previewImageRef.current.alt = images[idx0]?.alt || "";
    }
    itemImgRefs.current.forEach((imgEl, i) => {
      if (imgEl) {
        imgEl.style.opacity =
          i === idx0 ? String(ACTIVE_OPACITY) : String(INACTIVE_OPACITY);
      }
    });

    return () => {
      el?.removeEventListener("wheel", onWheel);
      el?.removeEventListener("touchstart", onTouchStart);
      el?.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, currentIndex, isHorizontal]);

  if (!images.length) return null;

  return (
    <div
      ref={containerRef}
      className="!fixed inset-0 bg-[#f1efe7] z-[9999999999] overflow-hidden"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-black text-2xl z-50"
        aria-label="關閉預覽"
      >
        ✕
      </button>

      {/* 主圖 + ALT */}
      <div className="absolute top-[40%] mt-20 left-1/2 w-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* ✅ 改為 object-contain：維持原比例、不裁切、不破版 */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            maxHeight: "80vh", // 主圖不會超過視窗高度
          }}
        >
          <img
            ref={previewImageRef}
            src={images[currentImageIndex]?.src}
            alt={images[currentImageIndex]?.alt || ""}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
        </div>
        {/* 
        {images[currentImageIndex]?.alt ? (
          <p className="text-base text-neutral-600 text-[14px] !text-left mt-2">
            {images[currentImageIndex].alt}
          </p>
        ) : null} */}
      </div>

      {/* 縮圖列（黑匡固定在中間） */}
      <div
        className={`absolute ${
          isHorizontal
            ? "bottom-20 left-1/2 -translate-x-1/2 h-[80px] w-[min(70vw,860px)]"
            : "right-20 top-1/2 -translate-y-1/2 w-[80px] h-[70vh]"
        }`}
      >
        <div
          ref={thumbsViewportRef}
          className="relative overflow-hidden h-full w-full"
        >
          {/* 黑色指示框 */}
          <div
            ref={indicatorRef}
            className="absolute z-10 pointer-events-none"
          />
          {/* 連續軌 */}
          <div
            ref={itemsRef}
            className={`absolute inset-0 flex ${
              isHorizontal ? "flex-row" : "flex-col"
            }`}
            style={{ willChange: "transform" }}
          >
            {images.map((img, index) => (
              <div
                key={img.src + index}
                className={`${
                  isHorizontal ? "w-[60px] h-full" : "h-[60px] w-full"
                } p-1 cursor-pointer`}
                ref={(el) => (itemRefs.current[index] = el)}
                onClick={() => centerByIndex(index)}
              >
                <img
                  ref={(el) => (itemImgRefs.current[index] = el)}
                  src={img.src}
                  alt={img.alt || `img-${index}`}
                  className="w-full h-full object-cover transition-opacity"
                  style={{ opacity: INACTIVE_OPACITY }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
