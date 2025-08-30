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

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (!q) return;
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
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
              className="w-[50px] h-auto"
            />
          </Link>
        </div>

        {/* 中：連結（桌機） */}
        <div className="nav-links hidden md:flex w-[65%] items-center justify-center gap-8 text-gray-800">
          <Link href="/awards" className="hover:opacity-70">
            最新動態
          </Link>
          <Link href="/note" className="hover:opacity-70">
            作品欣賞
          </Link>
          <Link href="/service" className="hover:opacity-70">
            服務流程
          </Link>
          <Link href="/blog" className="hover:opacity-70">
            設計札記
          </Link>
          <Link href="/about" className="hover:opacity-70">
            關於我們
          </Link>
          <Link href="/qa" className="hover:opacity-70">
            QA
          </Link>
          <Link href="/contact" className="hover:opacity-70">
            聯絡我們
          </Link>
        </div>

        {/* 右：搜尋 + 漢堡（手機） / 只搜尋（桌機） */}
        <div className="w-[20%] min-w-[120px] flex items-center justify-end gap-2">
          {/* Search Button (all) */}
          <button
            type="button"
            onClick={() => setOpenSearch((s) => !s)}
            aria-expanded={openSearch}
            aria-controls="global-search-bar"
            aria-label={openSearch ? "Close search" : "Open search"}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
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
          />
        </div>
      </div>

      {/* 手機選單（只在手機渲染/顯示） */}
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
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    搜尋
                  </button>
                  {/* 用點漢堡關閉整個 MobileMenu；Search 自己這裡只關 search */}
                  <button
                    type="button"
                    onClick={() => setOpenSearch(false)}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
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
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={ariaControls}
      aria-label={open ? ariaLabelOpen : ariaLabelClosed}
      className={`relative h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition ${className}`}
    >
      {/* 3 條線動畫成 X */}
      <motion.span
        initial={false}
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute block h-[2px] w-6 bg-gray-800"
      />
      <motion.span
        initial={false}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute block h-[2px] w-6 bg-gray-800"
        style={{ y: 0 }}
      />
      <motion.span
        initial={false}
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute block h-[2px] w-6 bg-gray-800"
      />
    </button>
  );
}
