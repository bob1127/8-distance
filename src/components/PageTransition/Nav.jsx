"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import MobileMenu from "../ExoApeOverlayMenu";

export default function Nav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (openSearch && inputRef.current) inputRef.current.focus();
  }, [openSearch]);

  // ESC 關閉 search / mobile menu
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenSearch(false);
        setOpenMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 監聽滾動：頂部透明、向下恢復
  useEffect(() => {
    const update = () => setAtTop(window.scrollY <= 2);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (!q) return;
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  // 顏色樣式
  const searchBtnTone = atTop
    ? "border-white/50 text-white hover:bg-white/10"
    : "border-gray-300 text-gray-700 hover:bg-gray-50";

  // 改成（無底線）

  return (
    <nav
      className="
         bg-white"
    >
      {/* NAV BAR */}
      <div className="relative w-full flex items-center justify-between px-4 py-3">
        {/* 左：Logo */}
        <div className="nav-logo flex items-center justify-center w-[15%] min-w-[120px]">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/images/捌程室內設計.png.avif"
              alt="company-logo"
              placeholder="empty"
              loading="lazy"
              width={100}
              height={100}
              className="w-[60px] h-auto"
            />
          </Link>
        </div>

        {/* 中：連結（桌機） */}
        <div className="nav-links hidden md:flex w-[85%] items-center  !justify-end gap-8">
          {" "}
          <Link href="/about" className="text-black text-[18px]">
            關於我們
          </Link>
          <Link href="/news" className="text-black text-[18px]">
            最新動態
          </Link>
          <Link href="/note" className="text-black text-[18px]">
            作品欣賞
          </Link>
          <Link href="/service" className="text-black text-[18px]">
            服務流程
          </Link>
          <Link href="/blog" className="text-black text-[18px]">
            設計靈感
          </Link>
          <Link href="/qa" className="text-black text-[18px]">
            QA
          </Link>
          <Link href="/video" className="text-black text-[18px]">
            影音內容
          </Link>
          <div className="bg-[#cd9f79] px-2 py-1 text-white">
            {" "}
            <Link href="/contact" className="text-white">
              預約諮詢
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpenSearch((s) => !s)}
            aria-expanded={openSearch}
            aria-controls="global-search-bar"
            aria-label={openSearch ? "Close search" : "Open search"}
            className={[
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 active:scale-[0.98] transition border border-black text-black",
              "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            ].join(" ")}
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
          {/* Hamburger (mobile only) */}
          <HamburgerButton
            open={openMobile}
            onClick={() => setOpenMobile((s) => !s)}
            className="md:hidden"
            ariaControls="mobile-menu-panel"
            ariaLabelOpen="Close menu"
            ariaLabelClosed="Open menu"
            tone={atTop ? "light" : "dark"}
          />
        </div>
      </div>

      {/* 手機選單 */}
      <MobileMenu open={openMobile} onClose={() => setOpenMobile(false)} />

      {/* 底下滑出的搜尋列 */}
      <AnimatePresence initial={false}>
        {openSearch && (
          <motion.div
            id="global-search-bar"
            key="searchbar"
            initial={{ height: 0, opacity: 0, y: -6 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="px-4 py-3">
              <form
                onSubmit={handleSubmit}
                className="relative mx-auto max-w-5xl"
              >
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="輸入關鍵字搜尋…（Esc 關閉）"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-24 text-base outline-none focus:ring-4 focus:ring-gray-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    搜尋
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenSearch(false)}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    關閉
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ============== Hamburger Button ============== */
function HamburgerButton({
  open,
  onClick,
  className = "",
  ariaControls,
  ariaLabelOpen = "Close menu",
  ariaLabelClosed = "Open menu",
  tone = "dark", // 'light'：白色（頂部）；'dark'：深色（滾動）
}) {
  const borderClass =
    tone === "light"
      ? "border-white/50 hover:bg-white/10"
      : "border-gray-300 hover:bg-gray-50";
  const barClass = tone === "light" ? "bg-white" : "bg-gray-800";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={ariaControls}
      aria-label={open ? ariaLabelOpen : ariaLabelClosed}
      className={`relative h-10 w-10 inline-flex items-center justify-center rounded-xl border ${borderClass} active:scale-[0.98] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {/* 3 條線動畫成 X */}
      <motion.span
        initial={false}
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={`absolute page-block h-[2px] w-6 ${barClass}`}
      />
      <motion.span
        initial={false}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
        className={`absolute page-block h-[2px] w-6 ${barClass}`}
        style={{ y: 0 }}
      />
      <motion.span
        initial={false}
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={`absolute page-block h-[2px] w-6 ${barClass}`}
      />
    </button>
  );
}
