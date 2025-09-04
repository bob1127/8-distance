"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Link from "next/link";
import JanusButton02 from "../../components/JanusButton2.jsx";

/* ===== 原始樣板資料（保留你給的四篇） ===== */
const BASE_CASES = [
  {
    id: "A01",
    title: "高評價民宿設計關鍵：空間、細節一次到位",
    description:
      "在競爭激烈的旅宿市場中，一間高評價的民宿不僅能帶來口碑，更是提高入住率與回訪率的關鍵。成功的民宿設計",
    city: "台中市",
    district: "西屯區",
    budgetWan: 280,
    areaPing: 22,
    type: "住宅",
    style: "北歐",
    date: "2025-05-20",
    image:
      "https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg",
    link: "/Blog-inner",
  },
  {
    id: "A02",
    title: "咖啡廳氛圍怎麼營造：商業空間設計",
    description:
      "在咖啡文化高度發展的今天，單靠好喝的咖啡已無法脫穎而出。空間成為品牌的延伸媒介，而 室內設計 則是這段轉譯過程中的靈魂。透過整合 空間設計。",
    city: "台中市",
    district: "南屯區",
    budgetWan: 850,
    areaPing: 60,
    type: "商業空間",
    style: "輕奢",
    date: "2024-11-23",
    image:
      "https://static.wixstatic.com/media/b69ff1_af2e65bd847d47c98e1fd3b6c7a919fb~mv2.jpg/v1/fill/w_454,h_341,fp_0.50_0.50,q_90,enc_avif,quality_auto/b69ff1_af2e65bd847d47c98e1fd3b6c7a919fb~mv2.jpg",
    link: "/Blog-inner",
  },
  {
    id: "A03",
    title: "第一次裝潢就上手：新手室內設計入門攻略",
    description:
      "新家裝潢沒經驗？一次搞懂設計流程、預算配置與常見錯誤 對第一次要裝潢新家的你來說， 室內設計 的世界可能充滿專業術語與不確定性：要先找 設計師 還是抓預算",
    city: "台北市",
    district: "內湖區",
    budgetWan: 520,
    areaPing: 38,
    type: "住宅",
    style: "現代",
    date: "2024-09-18",
    image:
      "https://static.wixstatic.com/media/b69ff1_0ec38cbb854347a596e0981caae62dd2~mv2.jpg/v1/fill/w_454,h_341,fp_0.50_0.50,q_90,enc_avif,quality_auto/b69ff1_0ec38cbb854347a596e0981caae62dd2~mv2.jpg",
    link: "/Blog-inner",
  },
  {
    id: "A04",
    title: "打造飯店氛圍感：高級感居家設計技巧",
    description:
      "你是否曾入住過一間令人難忘的高級飯店，對它的氛圍、 質感與細節 印象深刻？事實上，這樣的空間感受不必只存在於旅途中。透過精心規劃的 設計 與選材",
    city: "高雄市",
    district: "苓雅區",
    budgetWan: 420,
    areaPing: 28,
    type: "商業空間",
    style: "現代",
    date: "2025-03-02",
    image:
      "https://static.wixstatic.com/media/b69ff1_e88ba0fcab0243f5b125fdbf5eb7e541~mv2.jpg/v1/fill/w_454,h_341,fp_0.50_0.50,q_90,enc_avif,quality_auto/b69ff1_e88ba0fcab0243f5b125fdbf5eb7e541~mv2.jpg",
    link: "/Blog-inner",
  },
];

/* ===== 城市/區域與選項 ===== */
const CITY_DISTRICTS = {
  台北市: [
    "中正區",
    "大同區",
    "中山區",
    "松山區",
    "大安區",
    "萬華區",
    "信義區",
    "士林區",
    "北投區",
    "內湖區",
    "南港區",
    "文山區",
  ],
  台中市: [
    "中區",
    "東區",
    "南區",
    "西區",
    "北區",
    "北屯區",
    "西屯區",
    "南屯區",
    "太平區",
    "大里區",
    "霧峰區",
  ],
  高雄市: [
    "新興區",
    "前金區",
    "苓雅區",
    "鹽埕區",
    "鼓山區",
    "左營區",
    "三民區",
    "前鎮區",
    "小港區",
  ],
};
const STYLES = ["北歐", "現代", "輕奢", "日式", "工業", "美式"];
const TYPES = ["住宅", "商業空間"];
const SORTS = [
  { value: "latest", label: "最新發佈" },
  { value: "budgetDesc", label: "預算：高 → 低" },
  { value: "budgetAsc", label: "預算：低 → 高" },
  { value: "areaDesc", label: "坪數：大 → 小" },
  { value: "areaAsc", label: "坪數：小 → 大" },
];

/* ===== 共用 Select（修正版） ===== */
function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className = "",
}) {
  const ph = placeholder ?? (options?.[0]?.label || "請選擇");
  const displayOptions = Array.isArray(options) ? options : [];
  return (
    <div className={`flex flex-col min-w-0 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-xs tracking-wider text-gray-500"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
          className={`w-full h-11 appearance-none rounded-full border bg-white/80 backdrop-blur px-4 pr-10 text-gray-800 shadow-sm
                      outline-none transition min-w-0
                      ${
                        disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-white"
                      }
                      border-gray-200 focus:ring-2 focus:ring-purple-200`}
        >
          <option value="">{ph}</option>
          {displayOptions
            .filter((o, i) => !(i === 0 && o.value === ""))
            .map((opt) => (
              <option
                key={`${id}-${String(opt.value ?? "")}`}
                value={opt.value ?? ""}
              >
                {opt.label}
              </option>
            ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ===== 可收折容器（版面原樣） ===== */
function Collapsible({ title, open, onToggle, children, depKey }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(open ? "auto" : 0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      const h = el.scrollHeight;
      setHeight(h);
      const id = setTimeout(() => setHeight("auto"), 320);
      return () => clearTimeout(id);
    } else {
      const h = el.scrollHeight;
      setHeight(h);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  useEffect(() => {
    if (!open || !contentRef.current) return;
    const h = contentRef.current.scrollHeight;
    setHeight(h);
    const id = setTimeout(() => setHeight("auto"), 320);
    return () => clearTimeout(id);
  }, [open, depKey]);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
        aria-expanded={open}
        aria-controls="filter-panel"
      >
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <span
          className={`inline-flex size-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id="filter-panel"
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height }}
      >
        <div
          ref={contentRef}
          className={`px-4 pb-4 pt-1 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ===== 小工具：高亮 ===== */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Highlight({ text, kw }) {
  if (!kw) return <>{text}</>;
  const reg = new RegExp(`(${escapeRegExp(kw)})`, "ig");
  const parts = String(text).split(reg);
  return (
    <>
      {parts.map((p, i) =>
        reg.test(p) ? (
          <mark key={i} className="bg-yellow-200 px-0.5 rounded">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/* ===== 篩選列 ===== */
function CaseFilterBar({ value, onChange, onSearch, onClear }) {
  const cityOptions = useMemo(
    () => [
      { value: "", label: "全部縣市" },
      ...Object.keys(CITY_DISTRICTS).map((c) => ({ value: c, label: c })),
    ],
    []
  );
  const districts = useMemo(
    () => (value.city ? CITY_DISTRICTS[value.city] || [] : []),
    [value.city]
  );
  const districtOptions = useMemo(
    () =>
      value.city
        ? [
            { value: "", label: "全部區域" },
            ...districts.map((d) => ({ value: d, label: d })),
          ]
        : [{ value: "", label: "先選縣市" }],
    [districts, value.city]
  );

  return (
    <div>
      {/* 第一排 */}
      <div className="grid grid-cols-1 gap-3 items-end lg:grid-cols-12">
        <div className="lg:col-span-5 min-w-0">
          <label className="mb-1 block text-xs tracking-wider text-gray-500">
            搜尋
          </label>
          <div className="relative">
            <input
              value={value.keyword}
              onChange={(e) => onChange({ keyword: e.target.value })}
              type="text"
              placeholder="搜尋關鍵字（標題 / 內文）"
              className="w-full h-11 rounded-full pl-4 pr-10 border border-gray-200 bg-white/80 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <SelectField
            id="city"
            label="縣市"
            value={value.city || ""}
            onChange={(v) => onChange({ city: v || null, district: null })}
            options={cityOptions}
            placeholder="選擇縣市"
          />
        </div>

        <div className="lg:col-span-4">
          <SelectField
            id="district"
            label="區域"
            value={value.district || ""}
            onChange={(v) => onChange({ district: v || null })}
            options={districtOptions}
            placeholder={value.city ? "選擇區域" : "先選縣市"}
            disabled={!value.city}
          />
        </div>
      </div>

      {/* 第二排 */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="mb-1 text-xs tracking-wider text-gray-500">
            預算（萬）
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="h-11 rounded-full px-3 border border-gray-200 bg-white/80 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
              type="number"
              placeholder="最少"
              min={0}
              value={value.budgetMin ?? ""}
              onChange={(e) =>
                onChange({
                  budgetMin: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <input
              className="h-11 rounded-full px-3 border border-gray-200 bg-white/80 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
              type="number"
              placeholder="最多"
              min={0}
              value={value.budgetMax ?? ""}
              onChange={(e) =>
                onChange({
                  budgetMax: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-1 text-xs tracking-wider text-gray-500">坪數</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="h-11 rounded-full px-3 border border-gray-200 bg-white/80 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
              type="number"
              placeholder="最小"
              min={0}
              value={value.areaMin ?? ""}
              onChange={(e) =>
                onChange({
                  areaMin: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <input
              className="h-11 rounded-full px-3 border border-gray-200 bg-white/80 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
              type="number"
              placeholder="最大"
              min={0}
              value={value.areaMax ?? ""}
              onChange={(e) =>
                onChange({
                  areaMax: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <SelectField
            id="type"
            label="案型"
            value={value.type || ""}
            onChange={(v) => onChange({ type: v || null })}
            options={[
              { value: "", label: "全部案型" },
              ...TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <SelectField
            id="style"
            label="風格"
            value={value.style || ""}
            onChange={(v) => onChange({ style: v || null })}
            options={[
              { value: "", label: "全部風格" },
              ...STYLES.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <SelectField
            id="sort"
            label="排序"
            value={value.sort}
            onChange={(v) => onChange({ sort: v })}
            options={SORTS.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>
      </div>

      {/* 第三排：按鈕 */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center lg:justify-end">
        <button
          onClick={onSearch}
          className="h-11 rounded-full px-6 bg-[#ffa743] text-white font-medium hover:opacity-95"
        >
          搜尋
        </button>
        <button
          onClick={onClear}
          className="h-11 rounded-full px-6 border border-gray-300 bg-white hover:bg-gray-50"
        >
          清除
        </button>
      </div>
    </div>
  );
}

/* ===== 分頁組件 ===== */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const go = (p) => {
    const n = Math.max(1, Math.min(totalPages, p));
    if (n !== page) onChange(n);
  };

  const pages = [];
  const windowSize = 1;
  const add = (p) => pages.push(p);
  const addEllipsis = (key) => pages.push(key);

  add(1);
  const start = Math.max(2, page - windowSize);
  const end = Math.min(totalPages - 1, page + windowSize);
  if (start > 2) addEllipsis("...");
  for (let p = start; p <= end; p++) add(p);
  if (end < totalPages - 1) addEllipsis("..");
  if (totalPages > 1) add(totalPages);

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="分頁導覽"
    >
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className={`h-10 rounded-full px-4 border ${
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        } bg-white border-gray-200`}
        aria-label="上一頁"
      >
        上一頁
      </button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={`p-${p}-${idx}`}
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
            className={[
              "h-10 min-w-10 px-4 border",
              p === page
                ? "bg-black text-white border-black"
                : "bg-white border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {p}
          </button>
        ) : (
          <span key={`e-${idx}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className={`h-10 rounded-full px-4 border ${
          page === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50"
        } bg-white border-gray-200`}
        aria-label="下一頁"
      >
        下一頁
      </button>
    </nav>
  );
}

export default function Home() {
  const container = useRef(null);

  /* ---------- 防滾動鎖：進入/離開本頁都解鎖 ---------- */
  useEffect(() => {
    const unlock = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
    unlock(); // mount 時解一次
    return unlock; // unmount 時再解一次
  }, []);

  /* ---------- Lenis：記得完整銷毀，避免殘留監聽造成無法滾動 ---------- */
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      try {
        lenis.destroy(); // ← 關鍵：把 wheel/touch 監聽與樣式恢復
      } catch {}
      lenisRef.current = null;
      // 離開時再保險解一次
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const [filters, setFilters] = useState({
    keyword: "",
    city: null,
    district: null,
    budgetMin: null,
    budgetMax: null,
    areaMin: null,
    areaMax: null,
    type: null,
    style: null,
    sort: "latest",
    _searchTick: 0,
  });

  // 分頁狀態
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // 右側欄搜尋狀態
  const [sideQ, setSideQ] = useState("");
  const [sideFocused, setSideFocused] = useState(false);

  // Filter 收折狀態
  const [filterOpen, setFilterOpen] = useState(true);

  // 分享 / 複製用
  const [pageUrl, setPageUrl] = useState("");
  const [toast, setToast] = useState(null); // { type: 'ok'|'warn', text: string }

  useEffect(() => {
    if (typeof window !== "undefined") setPageUrl(window.location.href);
  }, []);

  // 產生更多假資料：用 BASE_CASES 複製擴充（24 筆）
  const cases = useMemo(() => {
    const total = 24;
    const list = [];
    for (let i = 0; i < total; i++) {
      const base = BASE_CASES[i % BASE_CASES.length];
      const d = new Date(base.date);
      d.setDate(d.getDate() - i * 7);
      const dateStr = d.toISOString().slice(0, 10);

      list.push({
        ...base,
        id: `${base.id}-${i + 1}`,
        title: i === 0 ? base.title : `${base.title}（案例 ${i + 1}）`,
        date: dateStr,
      });
    }
    return list;
  }, []);

  const formatWan = (n) =>
    new Intl.NumberFormat("zh-TW").format(Number(n || 0)) + " 萬";

  // 主清單：先篩選/排序，再分頁
  const filtered = useMemo(() => {
    let list = [...cases];

    if (filters.keyword?.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw)
      );
    }

    if (filters.city) list = list.filter((c) => c.city === filters.city);
    if (filters.district)
      list = list.filter((c) => c.district === filters.district);

    if (Number.isFinite(filters.budgetMin))
      list = list.filter((c) => c.budgetWan >= filters.budgetMin);
    if (Number.isFinite(filters.budgetMax))
      list = list.filter((c) => c.budgetWan <= filters.budgetMax);

    if (Number.isFinite(filters.areaMin))
      list = list.filter((c) => c.areaPing >= filters.areaMin);
    if (Number.isFinite(filters.areaMax))
      list = list.filter((c) => c.areaPing <= filters.areaMax);

    if (filters.type) list = list.filter((c) => c.type === filters.type);
    if (filters.style) list = list.filter((c) => c.style === filters.style);

    switch (filters.sort) {
      case "budgetDesc":
        list.sort((a, b) => b.budgetWan - a.budgetWan);
        break;
      case "budgetAsc":
        list.sort((a, b) => a.budgetWan - b.budgetWan);
        break;
      case "areaDesc":
        list.sort((a, b) => b.areaPing - a.areaPing);
        break;
      case "areaAsc":
        list.sort((a, b) => a.areaPing - b.areaPing);
        break;
      default:
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [cases, filters]);

  // 篩選條件變更時，回到第 1 頁
  useEffect(() => {
    setPage(1);
  }, [
    filters.keyword,
    filters.city,
    filters.district,
    filters.budgetMin,
    filters.budgetMax,
    filters.areaMin,
    filters.areaMax,
    filters.type,
    filters.style,
    filters.sort,
    filters._searchTick,
  ]);

  // 計算分頁切片
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.max(1, Math.min(totalPages, page));
  const start = (pageSafe - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // 右側欄即時搜尋
  const sideResults = useMemo(() => {
    const q = sideQ.trim().toLowerCase();
    if (!q) return [];
    return cases
      .filter((c) =>
        [c.title, c.description, c.city, c.district, c.style, c.type].some(
          (v) => String(v).toLowerCase().includes(q)
        )
      )
      .slice(0, 6);
  }, [sideQ, cases]);

  const handleChange = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const handleClear = () =>
    setFilters((f) => ({
      keyword: "",
      city: null,
      district: null,
      budgetMin: null,
      budgetMax: null,
      areaMin: null,
      areaMax: null,
      type: null,
      style: null,
      sort: "latest",
      _searchTick: (f._searchTick || 0) + 1,
    }));

  // 分享功能
  const openFBShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      pageUrl || (typeof window !== "undefined" ? window.location.href : "")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const shareToIG = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document?.title || "分享連結",
          url: pageUrl,
        });
      } catch (e) {}
    } else {
      setToast({
        type: "warn",
        text: "此裝置不支援直接分享至 Instagram，請改用手機分享或使用下方複製連結。",
      });
      setTimeout(() => setToast(null), 2800);
    }
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setToast({ type: "ok", text: "連結已複製！" });
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast({ type: "warn", text: "複製失敗，請手動選取網址列複製。" });
      setTimeout(() => setToast(null), 2800);
    }
  };

  return (
    <div className="bg-[#f6f6f7] py-20 w-full overflow-visible">
      <section className="flex pt-[100px] max-w-[1920px] py-20 w-[90%] mx-auto flex-col lg:flex-row">
        {/* 左側清單 */}
        <div className="left w-full pr-0 sm:pr-8 lg:w-[70%]">
          {/* 篩選面板（保留 UI 與功能） */}
          <Collapsible
            title="篩選條件"
            open={filterOpen}
            onToggle={() => setFilterOpen((s) => !s)}
            depKey={filters._searchTick}
          >
            <CaseFilterBar
              value={filters}
              onChange={handleChange}
              onSearch={() =>
                setFilters((f) => ({
                  ...f,
                  _searchTick: (f._searchTick || 0) + 1,
                }))
              }
              onClear={handleClear}
            />
          </Collapsible>

          <div className="mb-3 text-sm text-gray-600">
            共 {filtered.length} 個符合條件的案件（第 {pageSafe} / {totalPages}{" "}
            頁）
          </div>

          <div className="blog-grid grid pl-0 lg:pr-10 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {pageItems.map((item) => (
              <Link key={item.id} href={item.link}>
                <div className="item overflow-hidden relative group bg-white transition-all duration-300 border border-gray-100">
                  <div className="img mx-5 overflow-hidden mt-2 relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
                    />
                  </div>
                  <div className="px-6 pt-6 pb-7 flex flex-col gap-2">
                    <h2 className="text-[18px] font-medium line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-[14px] text-gray-700 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-gray-600">
                      <div>
                        <b className="tracking-widest mr-1">地點</b>
                        {item.city} {item.district}
                      </div>
                      <div>
                        <b className="tracking-widest mr-1">預算</b>
                        {formatWan(item.budgetWan)}
                      </div>
                      <div>
                        <b className="tracking-widest mr-1">坪數</b>
                        {item.areaPing} 坪
                      </div>
                      <div>
                        <b className="tracking-widest mr-1">類型</b>
                        {item.type}／{item.style}
                      </div>
                    </div>
                    <div className="mt-2 text-[12px] text-gray-500">
                      發佈於：{item.date}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 分頁列 */}
          <Pagination
            page={pageSafe}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>

        {/* 右半部（保持不動） */}
        <div className="right w-full pt-10 lg:pt-0 lg:w-[30%] h-full">
          <div className="right-bar bg-white sticky top-20 py-8 border border-gray-100 h-fit">
            <div className="mx-auto rounded-[22px] relative bg-black p-4 flex justify-center max-w-[120px] items-center">
              <div className="absolute color bg-[#323936] w-full h-full rounded-[22px] rotate-12"></div>
              <Image
                src="/images/捌程室內設計.png.avif"
                width={500}
                height={500}
                alt="logo"
                placeholder="empty"
                className="w-full z-50"
                loading="lazy"
              />
            </div>

            <div className="txt flex justify-center flex-col items-center mt-5 px-8">
              <b>捌程室內設計 | 8 Distance</b>
              <p className="text-[14px] text-gray-700 text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem fugiat quasi quis consequatur.
              </p>
            </div>

            {/* 社群＋分享 */}
            <div className="social flex justify-center mt-4 mx-auto gap-2">
              <button
                onClick={shareToIG}
                aria-label="分享至 Instagram"
                className="transition hover:opacity-90"
                type="button"
              >
                {/* IG 圖示 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                >
                  <radialGradient
                    id="ig1"
                    cx="19.38"
                    cy="42.035"
                    r="44.899"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#fd5" />
                    <stop offset=".328" stopColor="#ff543f" />
                    <stop offset=".348" stopColor="#fc5245" />
                    <stop offset=".504" stopColor="#e64771" />
                    <stop offset=".643" stopColor="#d53e91" />
                    <stop offset=".761" stopColor="#cc39a4" />
                    <stop offset=".841" stopColor="#c837ab" />
                  </radialGradient>
                  <path
                    fill="url(#ig1)"
                    d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"
                  />
                  <path
                    fill="#fff"
                    d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5 s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                  />
                  <circle cx="31.5" cy="16.5" r="1.5" fill="#fff" />
                  <path
                    fill="#fff"
                    d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12 C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                  />
                </svg>
              </button>

              <button
                onClick={openFBShare}
                aria-label="分享至 Facebook"
                className="transition hover:opacity-90"
                type="button"
              >
                {/* FB 圖示 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                >
                  <linearGradient
                    id="fb1"
                    x1="9.993"
                    x2="40.615"
                    y1="9.993"
                    y2="40.615"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#2aa4f4" />
                    <stop offset="1" stopColor="#007ad9" />
                  </linearGradient>
                  <path
                    fill="url(#fb1)"
                    d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                  />
                  <path
                    fill="#fff"
                    d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                  />
                </svg>
              </button>

              <button
                onClick={copyLink}
                aria-label="複製此頁連結"
                className="transition hover:opacity-90"
                type="button"
                title="複製連結"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10.59 13.41a1.998 1.998 0 0 0 2.82 0l3.59-3.59a2 2 0 0 0-2.83-2.83l-.88.88"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.41 10.59a1.998 1.998 0 0 0-2.82 0l-3.59 3.59a2 2 0 0 0 2.83 2.83l.88-.88"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="others-article mt-5">
              <div className="article-item px-8 flex-col group flex">
                <div className="txt w-full transition duration-400 mt-2">
                  <b>近期文章</b>
                  <p className="text-[14px] text-gray-800 w-[80%]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquid vero praesentium iusto illo, consectetur quae?
                  </p>
                </div>
                <div className="txt w-full transition duration-400 mt-2">
                  <b>近期文章</b>
                  <p className="text-[14px] text-gray-800 w-[80%]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquid vero praesentium iusto illo, consectetur quae?
                  </p>
                </div>
                <div className="txt w-full transition duration-400 mt-2">
                  <b>近期文章</b>
                  <p className="text-[14px] text-gray-800 w-[80%]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquid vero praesentium iusto illo, consectetur quae?
                  </p>
                </div>
              </div>

              {/* 右側欄搜尋 */}
              <div className="search px-8 mt-6">
                <label className="mb-1 block text-xs tracking-wider text-gray-500">
                  快速搜尋案例
                </label>
                <div className="relative">
                  <input
                    value={sideQ}
                    onChange={(e) => setSideQ(e.target.value)}
                    onFocus={() => setSideFocused(true)}
                    onBlur={() => setTimeout(() => setSideFocused(false), 150)}
                    type="text"
                    placeholder="輸入關鍵字（標題 / 內文 / 地點 / 風格…）"
                    className="w-full h-11 rounded-full pl-11 pr-10 border border-gray-200 bg:white bg-white/90 backdrop-blur outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M20 20l-3.5-3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  {sideQ && (
                    <button
                      onClick={() => setSideQ("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="清除搜尋"
                      type="button"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {(sideFocused || sideQ) && (
                  <div className="mt-3 space-y-2">
                    {sideQ && sideResults.length === 0 && (
                      <div className="text-sm text-gray-500 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                        找不到相符項目
                      </div>
                    )}

                    {sideResults.map((it) => (
                      <Link key={`side-${it.id}`} href={it.link}>
                        <div className="group flex gap-3 items-center p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition">
                          <div className="relative w-[96px] h-[72px] rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={it.image}
                              alt={it.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="96px"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              <Highlight text={it.title} kw={sideQ} />
                            </div>
                            <div className="text-[12px] text-gray-600 mt-0.5">
                              <b className="tracking-widest mr-1">地點</b>
                              {it.city} {it.district} ・ {it.type}/{it.style}
                            </div>
                            <div className="text-[12px] text-gray-500 line-clamp-2">
                              <Highlight text={it.description} kw={sideQ} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {sideResults.length >= 6 && (
                      <div className="text-[12px] text-gray-500 px-1">
                        只顯示前 6 筆，請輸入更精準的關鍵字以縮小範圍
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {toast && (
              <div
                className={`mx-6 mt-4 rounded-lg px-3 py-2 text-sm ${
                  toast.type === "ok"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                }`}
              >
                {toast.text}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
