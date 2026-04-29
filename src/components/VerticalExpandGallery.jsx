// components/VerticalExpandGallery.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export default function VerticalExpandGallery({
  images,
  captions,
  height = 640,
  ratioW = 9,
  ratioH = 16,

  collapsedWidth = 24,
  collapsedSize, // 基準「未 hover」寬（px）
  expandedWidthPx,
  expandedSize, // 基準「hover」寬（px）

  gap = 12,
  maxWidth = 1400,
  autoOverflow = true,
  overflowX = "hidden",

  // ✅ 自動平均分配（滿版）
  autoDistribute = true, // 以 collapsedSize/expandedSize 比例滿版鋪滿
  // 可選下限，避免過窄（需要再加就傳）
  minCollapsed = 8,
  minExpanded = 80,

  // ── 指示器 ─────────────────────────────────────────
  indicatorOffsetY = -10,
  indicatorLineHeight = 28,
  indicatorDotSize = 6,
  indicatorTitle = "DESIGNER",
  indicatorBarWidth = 500,
  indicatorSafePadding = -5, // 手動覆蓋與指示區距離

  // 文字樣式
  captionClassName = "text-white font-semibold tracking-wide",

  // ── 裝飾色塊 ───────────────────────────────────────
  decorEnabled = true,
  decorColor = "#ff492f",
  decorTopLeft = { kicker: "한국경쟁", label: "Korean Competition" },
  bottomBarWidth = 0.62,
  bottomBarHeight = 18,
  bottomBarOffset = 0,
  decorTextColor = "#111",
}) {
  // ===== 資料 =====
  const fallback = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        src: `/images/img${i + 1}.jpg`,
        alt: `image ${i + 1}`,
      })),
    []
  );
  const data = useMemo(() => {
    const list = !images || images.length === 0 ? fallback : images;
    return list.map((it, idx) =>
      typeof it === "string" ? { src: it, alt: `image ${idx + 1}` } : it
    );
  }, [images, fallback]);

  const captionTexts = useMemo(() => {
    if (captions && captions.length) return captions;
    return data.map((d) => d.alt || "");
  }, [captions, data]);

  const getTopLeft = (idx) => {
    if (!decorTopLeft) return { kicker: "", label: "" };
    return Array.isArray(decorTopLeft)
      ? decorTopLeft[idx] || { kicker: "", label: "" }
      : decorTopLeft;
  };

  // ===== 尺寸（基準值）=====
  const expandedFromRatio = Math.round((height * ratioW) / ratioH);
  const BASE_EXPANDED = expandedWidthPx ?? expandedSize ?? expandedFromRatio;
  const BASE_COLLAPSED = collapsedSize ?? collapsedWidth;

  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const [hovered, setHovered] = useState(0);

  // ✅ 自動量測指示區高度，推開圖片列
  const [autoTopGap, setAutoTopGap] = useState(0);
  useEffect(() => {
    const measureIndicator = () => {
      if (!indicatorRef.current) return;
      const rect = indicatorRef.current.getBoundingClientRect();
      const gapPx = Math.ceil(rect.height + Math.max(0, -indicatorOffsetY) + 8);
      setAutoTopGap(gapPx);
    };
    measureIndicator();
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [
    indicatorLineHeight,
    indicatorDotSize,
    indicatorTitle,
    indicatorBarWidth,
    indicatorOffsetY,
  ]);

  // ✅ 自動平均分配：依容器寬度把 collapsed / expanded 比例縮放到滿版
  const [computedCollapsed, setComputedCollapsed] = useState(BASE_COLLAPSED);
  const [computedExpanded, setComputedExpanded] = useState(BASE_EXPANDED);

  useEffect(() => {
    if (!autoDistribute) {
      setComputedCollapsed(BASE_COLLAPSED);
      setComputedExpanded(BASE_EXPANDED);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const n = data.length || 1;
      const containerWidth = el.clientWidth; // 內部實際可用寬度
      const gapsTotal = (n - 1) * gap;

      // 以基準值建立比例，計算縮放係數
      const denom = BASE_EXPANDED + (n - 1) * BASE_COLLAPSED + gapsTotal;
      if (denom <= 0) return;

      const scale = containerWidth / denom;

      let c = Math.max(minCollapsed, Math.round(BASE_COLLAPSED * scale));
      let e = Math.max(minExpanded, Math.round(BASE_EXPANDED * scale));

      // 微調誤差：把差值加到展開寬，使總和精準等於容器寬
      const sum = e + (n - 1) * c + gapsTotal;
      const delta = containerWidth - sum; // 可能是負或正（通常 -1,0,1）
      e = Math.max(minExpanded, e + delta);

      setComputedCollapsed(c);
      setComputedExpanded(e);
    };

    compute();

    // 追蹤容器大小與視窗大小變化
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(compute);
      ro.observe(el);
    }
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
    // 依賴：成員數、gap、基準尺寸、maxWidth 變動時重算
  }, [autoDistribute, data.length, gap, BASE_COLLAPSED, BASE_EXPANDED]);

  // caption 動畫
  const captionRefs = useRef([]);
  const splitRefs = useRef([]);
  const tlRefs = useRef([]);

  useEffect(() => setHovered(0), []);

  // 指示點跟隨滑鼠 X
  const onMouseMove = (e) => {
    const el = containerRef.current;
    const wrap = indicatorRef.current;
    if (!el || !wrap) return;
    const rect = el.getBoundingClientRect();
    wrap.style.left = `${e.clientX - rect.left}px`;
  };

  // 自動滿版時不需要水平卷軸；否則沿用舊邏輯
  const listOverflowX = autoDistribute
    ? "hidden"
    : autoOverflow
    ? BASE_EXPANDED +
        (data.length - 1) * BASE_COLLAPSED +
        (data.length - 1) * gap >
      maxWidth
      ? "auto"
      : "hidden"
    : overflowX;

  useEffect(() => {
    const p = captionRefs.current[hovered];
    if (!p) return;

    if (splitRefs.current[hovered]) splitRefs.current[hovered].revert();
    splitRefs.current[hovered] = new SplitType(p, { types: "chars" });

    const chars = splitRefs.current[hovered].chars || [];
    tlRefs.current[hovered]?.kill();

    gsap.set(chars, { y: 24, opacity: 0 });
    const tl = gsap.timeline();
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.03,
    });
    tlRefs.current[hovered] = tl;
  }, [hovered]);

  useEffect(() => {
    return () => {
      splitRefs.current.forEach((s) => s?.revert());
      tlRefs.current.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <div className="w-full flex justify-center bg-transparent">
      <div
        className="relative w-full"
        style={{ maxWidth: `${maxWidth}px` }}
        ref={containerRef}
        onMouseMove={onMouseMove}
      >
        {/* ── 上方指示區 ───────── */}
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute left-0 z-[60]"
          style={{
            top: 0,
            transform: `translateX(-50%) translateY(${indicatorOffsetY}px)`,
            transition: "left 1s cubic-bezier(0.075,0.82,0.165,1)",
          }}
        >
          <div className="flex flex-col pb-8 items-center relative">
            <div
              style={{
                width: 1,
                height: `${indicatorLineHeight}px`,
                background: "#fff",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                width: `${indicatorDotSize}px`,
                height: `${indicatorDotSize}px`,
                borderRadius: "9999px",
                background: "#fff",
                marginTop: 6,
              }}
            />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white text-[13px] leading-none">
                {indicatorTitle}
              </span>
              <div
                style={{
                  width: `${indicatorBarWidth}px`,
                  height: 1,
                  background: "#fff",
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </div>

        {/* 圖片列（自動或手動下推） */}
        <div
          className="flex mx-auto"
          style={{
            marginTop:
              indicatorSafePadding > 0 ? indicatorSafePadding : autoTopGap,
            gap: `${gap}px`,
            overflowX: listOverflowX,
            overflowY: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {data.map((item, idx) => {
            const isActive = idx === hovered;

            // 用「自動分配後」的寬度
            const colW = autoDistribute ? computedCollapsed : BASE_COLLAPSED;
            const expW = autoDistribute ? computedExpanded : BASE_EXPANDED;

            const flexValue = isActive ? `0 0 ${expW}px` : `0 0 ${colW}px`;
            const tl = getTopLeft(idx);

            return (
              <div
                key={idx}
                className="relative bg-black overflow-hidden"
                style={{
                  height: `${height}px`,
                  flex: flexValue,
                  transition: "flex 0.9s cubic-bezier(0.075,0.82,0.165,1)",
                }}
                onMouseEnter={() => setHovered(idx)}
                onTouchStart={() => setHovered(idx)}
              >
                {/* 圖片 */}
                <img
                  src={item.src}
                  alt={item.alt || `image ${idx + 1}`}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    filter: isActive ? "none" : "grayscale(100%)",
                    transition: "filter 0.45s ease",
                  }}
                />

                {/* 裝飾色塊 */}
                {decorEnabled && (
                  <>
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        top: 16,
                        left: 16,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(-12px)",
                        opacity: isActive ? 1 : 0,
                        transition:
                          "transform .45s cubic-bezier(0.2,0.8,0.2,1), opacity .45s",
                      }}
                    >
                      <div
                        style={{
                          background: decorColor,
                          padding: "6px 10px",
                          color: decorTextColor,
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          borderTopLeftRadius: 3,
                          borderTopRightRadius: 3,
                        }}
                      >
                        {tl?.kicker || ""}
                      </div>
                      <div
                        style={{
                          background: decorColor,
                          padding: "8px 12px",
                          color: decorTextColor,
                          fontSize: 12,
                          fontWeight: 600,
                          borderBottomLeftRadius: 3,
                          borderBottomRightRadius: 3,
                          marginTop: 2,
                          boxShadow: "0 2px 0 rgba(0,0,0,.25) inset",
                        }}
                      >
                        {tl?.label || ""}
                      </div>
                    </div>

                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: 0 + bottomBarOffset,
                        bottom: 0,
                        width: `${
                          Math.max(0, Math.min(1, bottomBarWidth)) * 100
                        }%`,
                        height: bottomBarHeight,
                        background: decorColor,
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(12px)",
                        opacity: isActive ? 1 : 0,
                        transition:
                          "transform .45s cubic-bezier(0.2,0.8,0.2,1), opacity .45s",
                      }}
                    />
                  </>
                )}

                {/* 文字覆蓋層 */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-end"
                  style={{
                    background: isActive
                      ? "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)"
                      : "transparent",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.35s ease, background 0.35s ease",
                    padding: "24px",
                  }}
                >
                  <p
                    ref={(el) => (captionRefs.current[idx] = el)}
                    className={`leading-tight ${captionClassName}`}
                    style={{
                      fontSize: "clamp(1.05rem, 2.2vw, 1.6rem)",
                      lineHeight: 1.15,
                      margin: 0,
                      textShadow:
                        "0 1px 2px rgba(0,0,0,.45), 0 0 24px rgba(0,0,0,.25)",
                    }}
                  >
                    {captionTexts[idx] || ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
