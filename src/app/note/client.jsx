"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProjectSlider from "../../components/Project-Slider/Slider.jsx";
import JanusButton from "../../components/JanusButton.jsx";

/* -------------------- 類別與資料（原樣保留） -------------------- */
const categories = [
  { label: "住宅空間", value: "residential" },
  { label: "老屋翻新", value: "renovation" },
  { label: "純設計案", value: "design" },
  { label: "商業空間", value: "commercial" },
];

/* 你的原始 categoryContent 不含城市/坪數/預算/日期等欄位，下面的濾鏡會自動容錯。
   若你之後在每個 item 補上：city / district / budgetWan / areaPing / type / style / date
   就能完整使用所有條件。
*/
const categoryContent = {
  residential: [
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      // 可選：city,district,budgetWan,areaPing,type,style,date
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
    },
    // ...其餘略（保持原資料）
  ],
  renovation: [
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/project/residential-1",
      tag: "住宅空間",
    },
    // ...
  ],
  design: [
    {
      title: "純設計｜輕奢美學宅",
      subtitle: "灰金色調 × 石材與金屬點綴",
      overlayTitle: "輕奢美學宅",
      overlaySubtitle: "低調材質的高級感",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-1",
      tag: "純設計案",
    },
    // ...
  ],
  commercial: [
    {
      title: "品牌服飾店",
      subtitle: "機能櫥窗 × 流線動線規劃",
      overlayTitle: "品牌服飾店",
      overlaySubtitle: "從試衣到結帳的一氣呵成",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-1",
      tag: "商業空間",
    },
  ],
};

/* ====== 與你「那頁」相同的一組常數 ====== */
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

/* ===== 共用：現代化原生 Select（和你那頁一致） ===== */
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
}) {
  const ph = placeholder ?? (options?.[0]?.label || "請選擇");
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
          {options
            .filter((o, i) => !(i === 0 && o.value === ""))
            .map((opt) => (
              <option
                key={`${id}-${opt.value ?? "null"}`}
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

/* ===== 篩選列（和你那頁一致的布局/互動） ===== */
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
    <div className="mb-6">
      {/* 第一排（lg 以上 12 欄：5/3/4） */}
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

      {/* 第二排（lg 以上 12 欄：3/3/2/2/2） */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* 預算區間 */}
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

        {/* 坪數區間 */}
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
          className="h-11 rounded-full px-6 bg-[#ffa462] text-white font-medium hover:opacity-95"
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

/* -------------------- 卡片：scroll-linked fade-up（原樣） -------------------- */
function FadeCard({ project }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.60"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const ySpring = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 });
  const oSpring = useSpring(opacity, {
    stiffness: 300,
    damping: 30,
    mass: 0.4,
  });

  const ovTitle = project.overlayTitle ?? project.title;
  const ovSub = project.overlaySubtitle ?? project.subtitle ?? "";

  return (
    <Link href={project.url}>
      <motion.div
        ref={ref}
        style={{
          y: ySpring,
          opacity: oSpring,
          willChange: "transform, opacity",
        }}
        className="border group hover:bg-transparent p-5 bg-gray-200 relative h-[650px] overflow-hidden transition"
      >
        <div className="relative w-full overflow-hidden h-[500px]">
          <div className="txt left-4 bottom-3 z-50 absolute flex flex-col justify-center items-start">
            <h2 className="text-white leading-tight tracking-tight text-[30px] font-normal">
              {ovTitle}
            </h2>
            <p className="text-white text-base">{ovSub}</p>
          </div>

          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-4 text-xl tracking-wide font-semibold group-hover:text-gray-700">
          {project.title}
        </div>
        <div className="tag">
          <span className="border text-xs rounded-[20px] px-4 py-2">
            {project.tag ?? "Title"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

/* -------------------- 主元件：加入「同款」Filter（Tabs 下方） -------------------- */
const QaClient = () => {
  const [activeCategory, setActiveCategory] = useState("residential");

  // 依螢幕寬度切換 1/2/3 欄（純排版，不影響動畫）
  const [colsClass, setColsClass] = useState("grid-cols-1");
  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setColsClass(
        mqLg.matches
          ? "grid-cols-3"
          : mqMd.matches
          ? "grid-cols-2"
          : "grid-cols-1"
      );
    update();
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  // Tabs 的原資料
  const baseItems = useMemo(
    () => categoryContent[activeCategory] ?? [],
    [activeCategory]
  );

  // 預設案型對應（若資料未提供 type）
  const defaultTypeByCat = {
    residential: "住宅",
    renovation: "住宅",
    design: "住宅",
    commercial: "商業空間",
  };

  // 正規化：在不破壞你原資料的前提下，補上濾鏡需要但可能缺的欄位（null/預設）
  const items = useMemo(
    () =>
      baseItems.map((it, idx) => ({
        id: `${activeCategory}-${idx}`,
        city: null,
        district: null,
        budgetWan: null,
        areaPing: null,
        type: it.type ?? defaultTypeByCat[activeCategory] ?? null,
        style: it.style ?? null,
        date: it.date ?? null, // "YYYY-MM-DD"；若未提供則排序時用原順序
        ...it,
      })),
    [baseItems, activeCategory]
  );

  /* ===== 和你「那頁」相同的 Filter 狀態/邏輯 ===== */
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
    _searchTick: 0, // 供「搜尋」按鈕觸發用（選擇性）
  });

  const handleChange = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const handleSearch = () =>
    setFilters((f) => ({ ...f, _searchTick: (f._searchTick || 0) + 1 }));
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

  // 濾鏡（和你那頁一致，缺資料時自動略過）
  const filtered = useMemo(() => {
    let list = [...items];

    if (filters.keyword?.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      list = list.filter((c) => {
        const haystack = [
          c.title,
          c.subtitle,
          c.overlayTitle,
          c.overlaySubtitle,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(kw);
      });
    }

    if (filters.city) list = list.filter((c) => c.city === filters.city);
    if (filters.district)
      list = list.filter((c) => c.district === filters.district);

    if (Number.isFinite(filters.budgetMin))
      list = list.filter((c) =>
        typeof c.budgetWan !== "number"
          ? true
          : c.budgetWan >= filters.budgetMin
      );
    if (Number.isFinite(filters.budgetMax))
      list = list.filter((c) =>
        typeof c.budgetWan !== "number"
          ? true
          : c.budgetWan <= filters.budgetMax
      );

    if (Number.isFinite(filters.areaMin))
      list = list.filter((c) =>
        typeof c.areaPing !== "number" ? true : c.areaPing >= filters.areaMin
      );
    if (Number.isFinite(filters.areaMax))
      list = list.filter((c) =>
        typeof c.areaPing !== "number" ? true : c.areaPing <= filters.areaMax
      );

    if (filters.type) list = list.filter((c) => c.type === filters.type);
    if (filters.style) list = list.filter((c) => c.style === filters.style);

    switch (filters.sort) {
      case "budgetDesc":
        list.sort(
          (a, b) => (b.budgetWan ?? -Infinity) - (a.budgetWan ?? -Infinity)
        );
        break;
      case "budgetAsc":
        list.sort(
          (a, b) => (a.budgetWan ?? Infinity) - (b.budgetWan ?? Infinity)
        );
        break;
      case "areaDesc":
        list.sort(
          (a, b) => (b.areaPing ?? -Infinity) - (a.areaPing ?? -Infinity)
        );
        break;
      case "areaAsc":
        list.sort(
          (a, b) => (a.areaPing ?? Infinity) - (b.areaPing ?? Infinity)
        );
        break;
      default: {
        // latest：沒有 date 的維持原順序，有 date 的排在前面並照日期新→舊
        const withDate = list
          .filter((i) => i.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const withoutDate = list.filter((i) => !i.date);
        list = [...withDate, ...withoutDate];
      }
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    items,
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

  // 作品數字格式（若你要顯示預算/坪數）
  const formatWan = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("zh-TW").format(n) + " 萬"
      : "—";

  /* -------------------- Render -------------------- */
  return (
    <>
      <section>
        <ProjectSlider />
      </section>

      <section className="section-portfolio-category py-20 bg-white text-black">
        <div className="title flex justify-center">
          <h2 className="text-2xl">作品欣賞</h2>
        </div>

        <div className="max-w-[1920px] w-[95%] 2xl:w-[85%] mx-auto px-4">
          {/* Tabs（原樣） */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
                  activeCategory === cat.value
                    ? "bg-[#E1A95F] text-white"
                    : "bg-white text-black border-gray-300 hover:bg-[#E1A95F] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* == 與另一頁「相同風格/行為」的 Filter Bar（放在 Tabs 下方） == */}
          <CaseFilterBar
            value={filters}
            onChange={handleChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <div className="mb-3 text-sm text-gray-600">
            共 {filtered.length} 個符合條件的作品
          </div>

          {/* Grid：切換/搜尋時 crossfade；卡片沿用原 scroll-linked 動畫 */}
          <div className="category-item min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${filters._searchTick}-${filters.sort}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className={`grid ${colsClass} gap-6`}>
                  {filtered.map((project) => (
                    <FadeCard
                      key={project.id ?? project.title}
                      project={project}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                      找不到符合條件的作品
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex gap-4 justify-center">
              <JanusButton label="更多作品" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QaClient;
