"use client";

import { useEffect, useRef, useState } from "react";

export default function MiniMapGallery({
  images: rawImages = [],
  currentIndex = 0,
  onClose,
}) {
  const images = rawImages
    .map((img) => (typeof img === "string" ? { src: img, alt: "" } : img))
    .filter((img) => img?.src?.trim() !== "");

  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const indicatorRef = useRef(null);
  const previewImageRef = useRef(null);
  const itemRefs = useRef([]);
  const animationFrameRef = useRef(null);

  const translateRef = useRef({ current: 0, target: 0, max: 0 });
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dimensionsRef = useRef({ itemSize: 0, indicatorSize: 0 });
  const activeItemOpacity = 0.3;
  const isClickMoveRef = useRef(false);

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const updateDimensions = () => {
    const newIsHorizontal = window.innerWidth <= 900;
    const firstItem = itemRefs.current[0];
    if (!firstItem || !indicatorRef.current) return;

    const itemSize = newIsHorizontal
      ? firstItem.offsetWidth
      : firstItem.offsetHeight;
    const indicatorSize = newIsHorizontal
      ? indicatorRef.current.offsetWidth
      : indicatorRef.current.offsetHeight;

    dimensionsRef.current = { itemSize, indicatorSize };

    const totalSize = itemSize * images.length;
    translateRef.current.max = Math.max(
      0,
      totalSize - indicatorSize - itemSize
    );

    setIsHorizontal(newIsHorizontal);
  };

  const clampTarget = (target) => {
    const { itemSize, indicatorSize } = dimensionsRef.current;
    const minOffset = (indicatorSize - itemSize) / 2;
    const maxOffset =
      -translateRef.current.max - (indicatorSize - itemSize) / 2 - itemSize;
    return Math.max(Math.min(target, minOffset), maxOffset);
  };

  const getItemInIndicator = () => {
    itemRefs.current.forEach((item) => {
      const img = item?.querySelector("img");
      if (img) img.style.opacity = "1";
    });

    const indicatorStart = -translateRef.current.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;

    let maxOverlap = 0;
    let selectedIndex = 0;

    itemRefs.current.forEach((_, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;
      const overlap = Math.max(
        0,
        Math.min(indicatorEnd, itemEnd) - Math.max(indicatorStart, itemStart)
      );
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectedIndex = index;
      }
    });

    const img = itemRefs.current[selectedIndex]?.querySelector("img");
    if (img) img.style.opacity = activeItemOpacity;

    return selectedIndex;
  };

  const updatePreviewImage = (index) => {
    if (images[index] && previewImageRef.current) {
      previewImageRef.current.src = images[index].src;
      previewImageRef.current.alt = images[index].alt || "";
    }
    setCurrentImageIndex(index);
  };

  const animate = () => {
    const factor = isClickMoveRef.current ? 0.08 : 0.06;
    translateRef.current.current = lerp(
      translateRef.current.current,
      translateRef.current.target,
      factor
    );

    const transform = isHorizontal
      ? `translateX(${translateRef.current.current}px)`
      : `translateY(${translateRef.current.current}px)`;

    if (itemsRef.current) itemsRef.current.style.transform = transform;
    updatePreviewImage(getItemInIndicator());

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleItemClick = (index) => {
    isClickMoveRef.current = true;
    const offset =
      -(index * dimensionsRef.current.itemSize) +
      (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) /
        2;
    translateRef.current.target = clampTarget(offset);
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      isClickMoveRef.current = false;
      const delta = e.deltaY;
      const newTarget = translateRef.current.target - delta * 0.6;
      translateRef.current.target = clampTarget(newTarget);
    };

    let touchStart = 0;
    const handleTouchStart = (e) => {
      touchStart = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const delta = isHorizontal
        ? touchStart - e.touches[0].clientX
        : touchStart - e.touches[0].clientY;
      const newTarget = translateRef.current.target - delta;
      translateRef.current.target = clampTarget(newTarget);
      touchStart = isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
      e.preventDefault();
    };

    const handleResize = () => updateDimensions();

    container?.addEventListener("wheel", handleWheel, { passive: false });
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    window.addEventListener("resize", handleResize);

    updateDimensions();

    // 正確：不要加 1
    const startIndex = Math.min(images.length - 1, currentIndex);

    updatePreviewImage(startIndex);

    const offset =
      -(startIndex * dimensionsRef.current.itemSize) +
      (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) /
        2;

    const safeOffset = clampTarget(offset);
    translateRef.current.target = safeOffset;
    translateRef.current.current = safeOffset;

    const transform = isHorizontal
      ? `translateX(${safeOffset}px)`
      : `translateY(${safeOffset}px)`;
    if (itemsRef.current) itemsRef.current.style.transform = transform;

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isHorizontal, currentIndex, images.length]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#f1efe7] z-50 overflow-hidden"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-black text-2xl z-50"
      >
        ✕
      </button>

      {/* 主圖 + ALT（下方顯示文字） */}
      <div className="absolute top-[40%] left-1/2 w-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <img
          ref={previewImageRef}
          src={images[currentImageIndex]?.src}
          alt={images[currentImageIndex]?.alt || ""}
          className="w-full h-[60vh] object-contain"
        />
        {images[currentImageIndex]?.alt ? (
          <p className=" text-base text-neutral-600 text-[14px] !text-left mt-2">
            {images[currentImageIndex].alt}
          </p>
        ) : null}
      </div>

      {/* 縮圖列 */}
      <div
        className={`absolute flex items-center ${
          isHorizontal
            ? "bottom-20 left-1/2 -translate-x-1/2 h-[80px] flex-row"
            : "right-20 top-1/2 -translate-y-1/2 w-[80px] flex-col"
        }`}
      >
        <div
          className={`${
            isHorizontal
              ? "w-[60px] h-full translate-x-[60px]"
              : "w-full h-[60px] translate-y-[60px]"
          } border border-black z-10 transition-all duration-300`}
          ref={indicatorRef}
        ></div>

        <div
          className={`flex ${isHorizontal ? "flex-row" : "flex-col"}`}
          ref={itemsRef}
        >
          {images.map((img, index) => (
            <div
              key={img.src + index}
              className={`${
                isHorizontal ? "w-[60px] h-full" : "h-[60px] w-full"
              } p-1 cursor-pointer`}
              ref={(el) => (itemRefs.current[index] = el)}
              onClick={() => handleItemClick(index)}
            >
              <img
                src={img.src}
                alt={img.alt || `img-${index}`}
                className="w-full h-full object-cover transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
