"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // ESC 關閉
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (!q) return;
    // TODO: 換成你的搜尋頁面路由
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      {/* NAV BAR */}
      <div className="relative w-full flex items-center justify-between px-4 py-3">
        {/* 左：Logo */}
        <div className="nav-logo flex items-center justify-center w-[15%] min-w-[120px]">
          <Link href="/" aria-label="Go to home">
            <Image
              src="/捌程室內設計.png.avif"
              alt="company-logo"
              placeholder="empty"
              loading="lazy"
              width={100}
              height={100}
              className="w-[50px] h-auto"
            />
          </Link>
        </div>

        {/* 中：連結 */}
        <div className="nav-links hidden md:flex w-[65%] items-center justify-center gap-8 text-gray-800">
          <Link href="/" className="hover:opacity-70">
            Index
          </Link>
          <Link href="/service" className="hover:opacity-70">
            Archive
          </Link>
          <Link href="/contact" className="hover:opacity-70">
            Contact
          </Link>
        </div>

        {/* 右：搜尋 Icon 區 */}
        <div className="w-[20%] min-w-[120px] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="global-search-bar"
            aria-label={open ? "Close search" : "Open search"}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {/* 底下滑出的搜尋列 */}
      <AnimatePresence initial={false}>
        {open && (
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
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-gray-300 p-2 hover:bg-gray-50"
                    aria-label="Close search"
                  >
                    <X size={16} />
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
