"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, PlayCircle, HelpCircle } from "lucide-react"; // 加入 HelpCircle icon
import { usePathname } from "next/navigation";
import MobileMenu from "../ExoApeOverlayMenu";

const SEARCH_API = "https://api.8distance.com/api/search";

export default function Nav() {
  const pathnameRaw = usePathname() || "/";
  const pathOnly = pathnameRaw.split("?")[0].split("#")[0];
  const segs = pathOnly.split("/").filter(Boolean);

  // (省略中間無變動的路由判斷邏輯...)
  const LOCALES = [
    "zh-Hant",
    "zh-CN",
    "zh-TW",
    "zh",
    "en",
    "ja",
    "ko",
    "vn",
    "th",
  ];
  const firstSeg = LOCALES.includes(segs[0]) ? segs[1] || "" : segs[0] || "";
  const hasLocale = LOCALES.includes(segs[0]);
  const depthAfterWorks =
    firstSeg === "works" ? (hasLocale ? segs.length - 2 : segs.length - 1) : -1;
  const isWorksTree = firstSeg === "works";
  const isWorksRoot =
    isWorksTree &&
    ((hasLocale && segs.length === 2) || (!hasLocale && segs.length === 1));
  const isWorksLevel1 = isWorksTree && depthAfterWorks === 1;
  const isWorksLevel2Plus = isWorksTree && depthAfterWorks >= 2;
  const isBlogTree = firstSeg === "blog";
  const isBlogRoot =
    isBlogTree &&
    ((hasLocale && segs.length === 2) || (!hasLocale && segs.length === 1));
  const isBlogDetail = isBlogTree && !isBlogRoot;
  const [atTop, setAtTop] = useState(true);
  const computedTransparent =
    (isWorksRoot && atTop) ||
    (isBlogRoot && atTop) ||
    ((isWorksLevel2Plus || isBlogDetail) && atTop);
  const isHomeRoot = pathOnly === "/" || (hasLocale && segs.length === 1);
  const enableScrollHide = !isHomeRoot;

  /* ===== UI State ===== */
  const [openSearch, setOpenSearch] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [showWorkMenu, setShowWorkMenu] = useState(false);

  /* ===== Search State ===== */
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef(null);
  const [workCats, setWorkCats] = useState([]);

  useEffect(() => {
    async function loadCats() {
      try {
        const r = await fetch("https://api.8distance.com/api/works/");
        const j = await r.json();
        const list =
          (Array.isArray(j?.works_classifications) &&
            j.works_classifications) ||
          (Array.isArray(j?.classifications) && j.classifications) ||
          [];
        const normalized = list.map((c, i) => ({
          id: c?.id ?? i,
          title: c?.title || c?.name || c?.category || `分類 ${c?.id ?? i}`,
          slug: (c?.url_slug || "").trim() || null,
          raw: c,
        }));
        setWorkCats(normalized);
      } catch {
        setWorkCats([]);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    if (openSearch && inputRef.current) inputRef.current.focus();
  }, [openSearch]);

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

  /* Search Logic */
  useEffect(() => {
    if (!openSearch) return;
    const keyword = q.trim();
    if (!keyword) {
      setResults([]);
      return;
    }
    const id = setTimeout(async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const r = await fetch(
          `${SEARCH_API}?q=${encodeURIComponent(keyword)}`,
          { cache: "no-store" }
        );
        const j = await r.json().catch(() => ({}));
        const list = normalizeResults(j);
        setResults(list);
      } catch {
        setErrMsg("搜尋發生錯誤，請稍後再試。");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q, openSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
  };

  /* Scroll Logic (省略中間無變動部分...) */
  const reduce = useReducedMotion();
  const [navHidden, setNavHidden] = useState(false);
  const lastYRef = useRef(0);
  const accRef = useRef(0);
  const lastTsRef = useRef(0);
  const lastDirRef = useRef("none");

  useEffect(() => {
    const HIDE_AFTER = 28;
    const SHOW_AFTER = 14;
    const MIN_INTERVAL = 160;
    const getY = () =>
      Math.max(
        0,
        window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          0
      );
    const onScroll = () => {
      const y = getY();
      if (isWorksRoot || isWorksLevel2Plus || isBlogRoot || isBlogDetail) {
        setAtTop(y <= 2);
      }
      if (!enableScrollHide) return;
      const prevY = lastYRef.current;
      const dy = y - prevY;
      lastYRef.current = y;
      const dir = dy > 0 ? "down" : dy < 0 ? "up" : "none";
      if (dir !== "none" && dir !== lastDirRef.current) {
        accRef.current = 0;
        lastDirRef.current = dir;
      }
      accRef.current += Math.abs(dy);
      const now = performance.now();
      const allowToggle = now - lastTsRef.current >= MIN_INTERVAL;
      if (
        dir === "down" &&
        y > 0 &&
        accRef.current >= HIDE_AFTER &&
        allowToggle
      ) {
        if (!navHidden) setNavHidden(true);
        lastTsRef.current = now;
        accRef.current = 0;
      }
      if (dir === "up" && accRef.current >= SHOW_AFTER && allowToggle) {
        if (navHidden) setNavHidden(false);
        lastTsRef.current = now;
        accRef.current = 0;
      }
    };
    lastYRef.current = getY();
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [
    enableScrollHide,
    isWorksRoot,
    isWorksLevel2Plus,
    isBlogRoot,
    isBlogDetail,
    navHidden,
  ]);

  const navWrapClass = [
    "w-full z-[200] px-4",
    "sticky top-0",
    "transition-colors duration-300 ease-out",
    computedTransparent ? "bg-transparent" : "bg-white/100 backdrop-blur",
    computedTransparent ? "" : "border-b border-black/5",
  ].join(" ");
  const linkBase =
    "text-[14px] xl:text-[18px] tracking-widest transition-all duration-200 relative group";
  const linkTone = isWorksLevel1
    ? "text-gray-900 hover:text-[#D9A333]"
    : isBlogDetail
    ? "text-gray-900 hover:text-[#D9A333]"
    : computedTransparent
    ? "text-white hover:text-[#F6E7C6]"
    : "text-gray-900 hover:text-[#D9A333]";
  const underline =
    "after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:bg-[#D9A333] after:transition-all after:duration-300 group-hover:after:w-full";
  const categoryPath = (c) => {
    const rawSeg =
      (typeof c?.slug === "string" && c.slug.trim()) ||
      (typeof c?.title === "string" && c.title.trim()) ||
      String(c?.id ?? "").trim();
    return rawSeg ? `/works/${encodeURIComponent(rawSeg)}` : "/works";
  };
  const blockEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.nav
      className={navWrapClass}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      animate={{ y: enableScrollHide && navHidden ? -96 : 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 28, mass: 0.9 }
      }
    >
      <div className="w-full flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center w-[20%] min-w-[120px]">
          <Image
            src="/images/logo/logo-001.webp"
            alt="8distance"
            width={80}
            height={80}
            priority
          />
        </a>
        {/* Desktop Menu */}
        <div className="hidden md:flex w-[60%] items-center justify-center gap-6">
          <a href="/about" className={`${linkBase} ${linkTone} ${underline}`}>
            關於我們
          </a>
          <a href="/news" className={`${linkBase} ${linkTone} ${underline}`}>
            最新動態
          </a>
          <a
            href="/works"
            className="relative"
            onMouseEnter={() => setShowWorkMenu(true)}
            onMouseLeave={() => setShowWorkMenu(false)}
          >
            <button
              className={`${linkBase} ${linkTone} ${underline} flex items-center gap-1`}
            >
              作品欣賞 <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {showWorkMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 mt-2 w-56 bg-white shadow-xl border rounded-md py-2 z-[999] font-sans tracking-widest text-[15px] leading-6"
                >
                  {workCats.map((c) => (
                    <a
                      key={c.id}
                      href={categoryPath(c)}
                      className="block px-4 py-2 text-gray-900 hover:bg-[#f6efe4] whitespace-nowrap font-medium"
                    >
                      {c.title}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </a>
          <a href="/service" className={`${linkBase} ${linkTone} ${underline}`}>
            服務流程
          </a>
          <a href="/blog" className={`${linkBase} ${linkTone} ${underline}`}>
            設計靈感
          </a>
          <a
            href="/qa/design_process"
            className={`${linkBase} ${linkTone} ${underline}`}
          >
            常見問題
          </a>
          <a href="/video" className={`${linkBase} ${linkTone} ${underline}`}>
            影音內容
          </a>
        </div>
        {/* Right area */}
        <div className="flex items-center gap-2 w-[20%] justify-end">
          <a
            href="/contact"
            className={`px-4 py-2 rounded-md ${"bg-[#c69c6d] text-white hover:bg-[#d09946]"} transition`}
          >
            預約諮詢
          </a>
          <button
            type="button"
            onClick={() => setOpenSearch((s) => !s)}
            className="p-2 rounded-lg border border-[#c69c6d] text-[#c69c6d] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c69c6d]"
          >
            <Search size={18} />
          </button>
          <button onClick={() => setOpenMobile(true)} className="md:hidden p-2">
            ☰
          </button>
        </div>
      </div>
      {/* Search UI */}
      <AnimatePresence>
        {openSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t shadow-md"
          >
            <div className="px-4 py-4 max-w-5xl mx-auto">
              <form onSubmit={handleSubmit} onKeyDown={blockEnter}>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={blockEnter}
                  placeholder="搜尋作品、文章、影片、常見問題..."
                  className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring-4 focus:ring-gray-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSearch(false);
                      setQ("");
                      setResults([]);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    關閉
                  </button>
                </div>
              </form>
              <SearchResultsPanel
                q={q}
                loading={loading}
                error={errMsg}
                items={results}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <MobileMenu
        open={openMobile}
        onClose={() => setOpenMobile(false)}
        workCats={workCats}
      />
    </motion.nav>
  );
}

/* ===== Utilities ===== */
function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function normalizeResults(json) {
  if (!json) return [];

  const buildBlogUrl = (x) => {
    const raw =
      x?.url_slug?.trim() ||
      x?.slug?.trim() ||
      x?.title?.trim() ||
      x?.name?.trim() ||
      "";
    return raw ? `/blog/${encodeURIComponent(raw)}` : undefined;
  };

  const finalizeUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (!url.startsWith("/")) return url;
    const [pathAndMaybeQuery, hash = ""] = url.split("#");
    const [pathOnly, query = ""] = pathAndMaybeQuery.split("?");
    const parts = pathOnly
      .split("/")
      .map((seg, i) => {
        if (i === 0) return "";
        if (!seg) return "";
        try {
          return encodeURIComponent(decodeURIComponent(seg));
        } catch {
          return encodeURIComponent(seg);
        }
      })
      .join("/");
    return (
      (parts.startsWith("/") ? parts : `/${parts}`) +
      (query ? `?${query}` : "") +
      (hash ? `#${hash}` : "")
    );
  };

  const pack = (arr, typeFallback) =>
    (Array.isArray(arr) ? arr : []).map((x, i) => {
      let url;
      let extra = typeFallback;

      if (typeFallback === "video" || x.type === "video") {
        let category = "normal";
        let page = "1";
        const rawUrl = x.url || "";
        const match = rawUrl.match(/\/video\/(normal|shorts)\/(\d+)/);
        if (match) {
          category = match[1];
          page = match[2];
        }
        url = `/video?category=${category}&page=${page}`;
        extra = category === "shorts" ? "Shorts" : "一般影片";
      } else if (typeFallback === "qa" || x.type === "question") {
        // ✅ [修正] QA 判斷邏輯：優先讀取 API 給的 url
        const apiDataUrl = x.url || "";
        const rawCat = x.category || x.category_key || "";

        // 判斷條件：
        // 1. API 的 url 包含 "renovation_knowledge"
        // 2. 或者 API 的 category 是 "renovation" 相關
        if (
          apiDataUrl.includes("renovation_knowledge") ||
          rawCat === "renovation_knowledge" ||
          rawCat === "renovation"
        ) {
          url = "/qa/renovation_knowledge";
          extra = "裝修QA"; // 標籤顯示
        } else {
          // 否則預設為 設計流程
          url = "/qa/design_process";
          extra = "設計QA"; // 標籤顯示
        }
      } else if (typeFallback === "blog") {
        url = buildBlogUrl(x) || x.url || x.href || x.link || null;
      } else {
        url = x.url ?? x.href ?? x.link ?? null;
        if (!url && x.slug) {
          const base =
            typeFallback === "work"
              ? "/works/"
              : typeFallback === "news"
              ? "/news/"
              : "/";
          url = `${base}${encodeURIComponent(String(x.slug))}`;
        }
      }

      if (url && url.startsWith("/")) url = finalizeUrl(url);

      return {
        id: x.id ?? `${typeFallback}-${i}`,
        title: stripHtml(x.title || x.name || x.q || "(未命名)"),
        url: url || undefined,
        excerpt: stripHtml(
          x.preview || x.excerpt || x.description || x.a || ""
        ),
        extra,
        image: x.image_url ?? x.thumbnail ?? x.cover ?? null,
      };
    });

  if (json.data && typeof json.data === "object") {
    const rootData = json.data;
    const videos = json.videos || rootData.videos || [];
    const blogs = json.blogs || rootData.blogs || [];
    const works = json.works || rootData.works || [];
    const news = json.news || rootData.news || [];
    const questions = json.questions || rootData.questions || [];

    return [
      ...pack(blogs, "blog"),
      ...pack(works, "work"),
      ...pack(news, "news"),
      ...pack(videos, "video"),
      ...pack(questions, "qa"),
    ];
  }

  // Fallback structure
  const videos = json.videos || [];
  const blogs = json.blogs || [];
  const works = json.works || [];
  const news = json.news || [];
  const questions = json.questions || [];

  return [
    ...pack(blogs, "blog"),
    ...pack(works, "work"),
    ...pack(news, "news"),
    ...pack(videos, "video"),
    ...pack(questions, "qa"),
  ];
}

/* ===== Search panel ===== */
function SearchResultsPanel({ q, loading, error, items }) {
  if (!q.trim()) return null;
  return (
    <div className="rounded-xl border bg-white shadow mt-3 overflow-hidden">
      <div className="px-4 py-2 text-sm text-gray-600 border-b bg-gray-50">
        {loading ? "搜尋中…" : error ? error : `搜尋「${q}」結果`}
      </div>
      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              沒有找到相符結果。
            </div>
          ) : (
            <ul className="max-h-[45vh] overflow-y-auto divide-y">
              {items.map((it, i) => (
                <li key={i} className="p-4 hover:bg-gray-50 group">
                  <a href={it.url} className="block flex gap-4">
                    {/* 縮圖區域 */}
                    <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                      {it.image ? (
                        <Image
                          src={it.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : it.extra?.includes("影片") ||
                        it.extra === "Shorts" ||
                        it.extra === "video" ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <PlayCircle size={20} />
                        </div>
                      ) : it.extra?.includes("QA") ? ( // ✅ QA 顯示問號 icon
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <HelpCircle size={20} />
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <div className="font-medium group-hover:text-[#c69c6d] transition-colors">
                        {it.title}
                        {it.extra && (
                          <span
                            className={`ml-2 text-xs text-white px-2 py-0.5 rounded-full capitalize ${
                              it.extra === "Shorts"
                                ? "bg-red-500"
                                : it.extra?.includes("QA")
                                ? "bg-cyan-600" // ✅ QA 標籤顏色
                                : "bg-gray-400"
                            }`}
                          >
                            {it.extra === "video"
                              ? "影片"
                              : it.extra === "blog"
                              ? "文章"
                              : it.extra === "work"
                              ? "作品"
                              : it.extra === "news"
                              ? "動態"
                              : it.extra}
                          </span>
                        )}
                      </div>
                      {it.excerpt && (
                        <div className="mt-1 text-sm text-gray-600 line-clamp-1">
                          {it.excerpt}
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
