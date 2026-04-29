"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";
import AnimatedHeading from "@/components/AnimatedHeading";
import { ReactLenis } from "@studio-freight/react-lenis";

/* ===== 全域圖示尺寸（統一控管） ===== */
const ICON = { w: 88, h: 88, radius: 22 };

/* ===== 文字處理：清掉外層 <p> 並加粗數字 ===== */
function cleanHtmlBasic(input = "") {
  // 去除 <p>…</p>，保留 <br>；同時移除多餘空白
  return String(input)
    .replace(/<\/?p[^>]*>/gi, "")
    .replace(/\s+$/g, "")
    .trim();
}
function emphasizeNumbersHTML(text) {
  if (!text) return "";
  const pattern =
    /(\d+\s*-\s*\d+\s*%|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*萬(?:元)?|\d+(?:\.\d+)?\s*萬元|\d+(?:\.\d+)?\s*元)/g;
  const cleaned = cleanHtmlBasic(text).replace(
    pattern,
    (m) =>
      `<strong class="font-semibold align-baseline" style="font-size:1.16em; line-height:1;">${m}</strong>`
  );
  return cleaned;
}

/* ===== 底部浮動切換膠囊 ===== */
function FixedSwitchPortal({ showSwitch, activeTab, onSwitch }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {showSwitch && (
        <motion.div
          key="switch"
          className="fixed z-[99999999] left-0 bottom-[6%] w-full pointer-events-none"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <div className="relative w-full pointer-events-none">
            <div className="max-w-[320px] bg-[#f5f5f7] justify-center mx-auto px-2 py-2 flex rounded-[30px] shadow-sm border border-black/5 pointer-events-auto">
              <div className="relative grid w-full grid-cols-2 gap-1">
                {[
                  { key: "service", label: "設計流程" },
                  { key: "charge", label: "收費標準" },
                ].map((t) => {
                  const isActive = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => onSwitch(t.key)}
                      className="relative z-10 inline-flex items-center justify-center h-10 rounded-[22px] font-medium"
                      aria-pressed={isActive}
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="seg-pill"
                            className="absolute inset-0 rounded-[22px] bg-orange-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <motion.span
                        className={`relative z-10 px-4 text-[15px] ${
                          isActive ? "text-orange-500" : "text-gray-800"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {t.label}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ===== 卡片：設計流程 & 收費標準 ===== */
function ColumnCard({ item, emphasize = false }) {
  // 將描述轉成乾淨 HTML 並粗體數字
  const descHTML = emphasizeNumbersHTML(item.desc || "");
  const stepText = item.step || "";
  const headingText = item.heading || "";

  return (
    <ReactLenis root>
      <div
        className="
        group w-full mx-auto
        rounded-2xl bg-white md:bg-transparent
        p-5 sm:p-6 md:p-0
        flex flex-col items-center text-center
      "
      >
        {/* Icon */}
        <div
          className="relative mb-4 sm:mb-5 shrink-0 overflow-hidden"
          style={{ width: ICON.w, height: ICON.h, borderRadius: ICON.radius }}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.imageAlt || item.heading || "icon"}
              width={ICON.w}
              height={ICON.h}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
        </div>

        {/* 文字內容 */}
        <div className="w-full max-w-[520px] flex flex-col items-center">
          {emphasize ? (
            // 收費標準：先顯示標題，再顯示費用與描述
            <>
              {headingText && (
                <h3 className="text-[18px] font-semibold leading-tight text-gray-900">
                  {headingText}
                </h3>
              )}
              {stepText && (
                <p
                  className="mt-2 text-[15px] text-gray-700 leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: emphasizeNumbersHTML(stepText),
                  }}
                />
              )}
              {descHTML && (
                <p
                  className="mt-3 text-[14px] text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: descHTML }}
                />
              )}
            </>
          ) : (
            // 設計流程：維持原順序 STEP → 標題 → 說明（★這裡用 innerHTML，已先移除 <p>）
            <>
              {stepText && (
                <span className="text-[15px] sm:text-[16px] tracking-wide text-gray-700 leading-tight">
                  {stepText}
                </span>
              )}
              {headingText && (
                <h3 className="mt-1 text-[16px] sm:text-[18px] font-medium leading-tight text-gray-900">
                  {headingText}
                </h3>
              )}
              {descHTML && (
                <p
                  className="mt-3 text-[14px] sm:text-[15px] text-gray-600 leading-[1.8]"
                  dangerouslySetInnerHTML={{ __html: descHTML }}
                />
              )}
            </>
          )}

          {Array.isArray(item.items) && item.items.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-left">
              {item.items.map((li, idx) => (
                <li
                  key={idx}
                  className="relative pl-4 text-[14px] text-gray-700 leading-relaxed
                           before:content-[''] before:absolute before:left-0 before:top-[0.6em]
                           before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-400"
                >
                  {li}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ReactLenis>
  );
}

/* ===== 主元件：從 API 取資料 ===== */
export default function ServiceClient() {
  const [designs, setDesigns] = useState([]);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceRef = useRef(null);
  const chargeRef = useRef(null);
  const contentWrapRef = useRef(null);

  const [activeTab, setActiveTab] = useState("service");
  const [showByDir, setShowByDir] = useState(true);
  const [inContentRange, setInContentRange] = useState(true);
  const shouldShow = showByDir && inContentRange;

  /* ===== 取得後端資料 ===== */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.8distance.com/api/processes", {
          cache: "no-store",
        });
        const json = await res.json();
        const root = json?.processes || json?.data || json || {};
        const safeArray = (x) => (Array.isArray(x) ? x : []);

        // ✅ STEP 直接依 sort_order 顯示，缺值才退回 index+1
        const stepLabelStrict = (s, idx) => {
          const n = Number(s);
          if (Number.isFinite(n) && n > 0) {
            return `STEP-${String(n).padStart(2, "0")}`;
          }
          return `STEP-${String(idx + 1).padStart(2, "0")}`;
        };

        const designs = safeArray(root.process_designs)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((d, idx) => ({
            key: `design-${idx}`,
            step: stepLabelStrict(d?.sort_order, idx), // ← 嚴格版
            heading: d?.title ?? "",
            // 直接帶原始字串，ColumnCard 內會清除 <p>
            desc: d?.description ?? "",
            items: safeArray(d?.procedures)
              .map((p) => (typeof p?.step === "string" ? p.step : ""))
              .filter(Boolean),
            imageUrl: d?.image_url ?? "",
            imageAlt: d?.image_alt || d?.title || "",
          }));

        const charges = safeArray(root.process_charges)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((c, idx) => ({
            key: `charge-${idx}`,
            heading: c?.title ?? "",
            step: c?.description ?? "",
            desc: typeof c?.procedures === "string" ? c.procedures : "",
            imageUrl: c?.image_url ?? "",
            imageAlt: c?.image_alt || c?.title || "",
          }));

        setDesigns(designs);
        setCharges(charges);
      } catch (err) {
        console.error("fetch processes failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ===== 浮動切換顯示控制 ===== */
  const computeInRange = () => {
    const el = contentWrapRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const overlap =
      Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
    const ratio = overlap / Math.min(window.innerHeight, rect.height || 1);
    return overlap > 0 && ratio > 0.12;
  };

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const curr = window.scrollY;
        const delta = curr - lastY;
        if (Math.abs(delta) > 10) {
          setShowByDir(delta <= 0);
          lastY = curr;
        }
        setInContentRange(computeInRange());
        ticking = false;
      });
    };
    const onResize = () => setInContentRange(computeInRange());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToRef = (ref) => {
    if (!ref?.current) return;
    setShowByDir(true);
    const targetY =
      ref.current.getBoundingClientRect().top + window.scrollY - 80;
    animate(window.scrollY, targetY, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (y) => window.scrollTo(0, y),
      onComplete: () => setInContentRange(computeInRange()),
    });
  };

  const handleSwitch = (tab) => {
    setActiveTab(tab);
    scrollToRef(tab === "service" ? serviceRef : chargeRef);
  };

  return (
    <>
      <FixedSwitchPortal
        showSwitch={shouldShow}
        activeTab={activeTab}
        onSwitch={handleSwitch}
      />

      <div className="relative" ref={contentWrapRef}>
        {/* ===== 設計流程 ===== */}
        <section ref={serviceRef} className="my-10 sm:my-20 pt-20">
          <div className="flex flex-col items-center w-[92%] max-w-[1200px] mx-auto">
            <span className="text-[13px] sm:text-[14px] text-gray-600 tracking-wide">
              PROCESS
            </span>
            <AnimatedHeading
              text="設計流程"
              lineColor="#000"
              lineLength={120}
              lineThickness={1}
              yOffsetEm={0.08}
              duration={1.0}
              delay={0.12}
              firstVisitDelay={2}
              startDelay={0}
              resetOnExit={true}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">載入中...</p>
          ) : (
            <div className="w-[92%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12">
              {designs.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-8">
                  目前尚無流程資料
                </p>
              ) : (
                designs.map((item) => <ColumnCard key={item.key} item={item} />)
              )}
            </div>
          )}
        </section>

        {/* ===== 收費標準 ===== */}
        <section ref={chargeRef} className="my-16 sm:my-20">
          <div className="flex flex-col items-center w-[92%] max-w-[1200px] mx-auto">
            <span className="text-[13px] sm:text-[14px] text-gray-600 tracking-wide">
              CHARGE
            </span>
            <AnimatedHeading
              text="收費標準"
              lineColor="#000"
              lineLength={120}
              lineThickness={1}
              yOffsetEm={0.08}
              duration={1.0}
              delay={0.12}
              firstVisitDelay={2}
              startDelay={0}
              resetOnExit={true}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">載入中...</p>
          ) : (
            <div className="w-[92%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12">
              {charges.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-8">
                  目前尚無收費資料
                </p>
              ) : (
                charges.map((item) => (
                  <ColumnCard key={item.key} item={item} emphasize />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
