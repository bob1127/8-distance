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

/* -------------------- 類別與資料（已新增多筆專案；大標/副標用 overlayTitle/overlaySubtitle 直接自訂） -------------------- */
const categories = [
  { label: "住宅空間", value: "residential" },
  { label: "老屋翻新", value: "renovation" },
  { label: "純設計案", value: "design" },
  { label: "商業空間", value: "commercial" },
];

/* 你的原始 categoryContent 不含城市/坪數/預算/日期等欄位，下面的濾鏡會自動容錯。*/
/* ✅ 已新增多筆示範專案，方便一次看到「兩個一排、多列」的效果 */
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
      date: "2025-06-01",
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-05-20",
    },
    {
      title: "柔霧奶油宅",
      subtitle: "26坪｜米白層次 × 緩慢日常",
      overlayTitle: "南屯簡宅",
      overlaySubtitle: "靜謐色溫下的生活節奏",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-04-12",
    },
    {
      title: "石紋調性宅",
      subtitle: "32坪｜石材紋理 × 金屬點綴",
      overlayTitle: "七期沈宅",
      overlaySubtitle: "材質拼接的俐落高級感",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-03-02",
    },
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
      date: "2025-05-10",
    },
    {
      title: "格局翻新",
      subtitle: "28坪｜動線重塑 × 收納優化",
      overlayTitle: "西屯吳宅",
      overlaySubtitle: "中古屋的全新呼吸",
      image: "/images/project-01/project04.jpg",
      url: "/project/residential-2",
      tag: "住宅空間",
      date: "2025-04-05",
    },
    {
      title: "復古混搭",
      subtitle: "24坪｜老件 × 新材質共存",
      overlayTitle: "北屯黃宅",
      overlaySubtitle: "時間感與機能並存",
      image: "/images/project-01/project05.jpg",
      url: "/project/residential-3",
      tag: "住宅空間",
      date: "2025-03-22",
    },
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
      date: "2025-05-28",
    },
    {
      title: "純設計｜日式無印",
      subtitle: "原木 × 霧面白 × 關西調光",
      overlayTitle: "無印慢生活",
      overlaySubtitle: "留白與秩序的平衡",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-2",
      tag: "純設計案",
      date: "2025-03-18",
    },
    {
      title: "純設計｜工業感",
      subtitle: "清水模 × 黑鐵 × 大面採光",
      overlayTitle: "Loft Style",
      overlaySubtitle: "粗獷材質下的通透",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-3",
      tag: "純設計案",
      date: "2025-02-06",
    },
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
      date: "2025-07-01",
    },
    {
      title: "精品咖啡廳",
      subtitle: "吧台中島 × 陽光天井",
      overlayTitle: "拾光咖啡",
      overlaySubtitle: "香氣與光影的交會",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-2",
      tag: "商業空間",
      date: "2025-05-15",
    },
    {
      title: "複合選品店",
      subtitle: "流線動線 × 展示系統",
      overlayTitle: "Daily Select",
      overlaySubtitle: "逛起來順手的動線學",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-3",
      tag: "商業空間",
      date: "2025-04-01",
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

/* -------------------- 卡片：scroll-linked fade-up（維持原動畫；加上漸層遮罩、標題可自訂） -------------------- */
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

  // ✅ 大標/副標可直接在資料用 overlayTitle / overlaySubtitle 自訂
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
        className="group relative overflow-hidden"
      >
        <div className="relative w-full h-[590px] sm:h-[650px] xl:h-[1000px]">
          {/* 漸層遮罩，讓文字對比更好 */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.20)] to-transparent pointer-events-none" />

          {/* 文字：水平垂直置中 */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
            <div className="text-center max-w-[80%]">
              <h2 className="text-white leading-tight tracking-tight text-[28px] md:text-[32px] font-medium">
                {ovTitle}
              </h2>
              {!!ovSub && (
                <p className="text-white/90 text-sm md:text-base mt-2">
                  {ovSub}
                </p>
              )}
            </div>
          </div>

          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
      </motion.div>
    </Link>
  );
}

/* -------------------- 主元件：固定兩欄、容器 95% 置中 -------------------- */
const QaClient = () => {
  const [activeCategory, setActiveCategory] = useState("residential");

  // ✅ 改成固定兩欄（行動裝置 1 欄、md 以上 2 欄）
  const colsClass = "grid-cols-1 md:grid-cols-2";

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
        date: it.date ?? null,
        ...it,
      })),
    [baseItems, activeCategory]
  );

  /* ===== Filter 狀態/邏輯 ===== */
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

  // 濾鏡
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
        const withDate = list
          .filter((i) => i.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const withoutDate = list.filter((i) => !i.date);
        list = [...withDate, ...withoutDate];
      }
    }
    return list;
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

        {/* ✅ 整體容器：寬度 95%、置中（2XL 時 85% 仍可保留） */}
        <div className="max-w-[1920px] w-[95%] 2xl:w-[95%] mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`border-r-1 border-black pr-5 ${
                  cat.value === activeCategory ? "font-semibold" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter 區 */}
          <FilterToggleAndPanel
            filters={filters}
            onChange={handleChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <div className="mb-3 text-sm text-gray-600">
            共 {filtered.length} 個符合條件的作品
          </div>

          {/* Grid：固定兩欄；卡片沿用 scroll-linked 動畫 */}
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
          </div>
        </div>
      </section>
    </>
  );
};

/* 小元件：Filter 展開/收合 */
function FilterToggleAndPanel({ filters, onChange, onSearch, onClear }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen((v) => !v);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm tracking-wide text-gray-700">Filter</span>
        </div>

        <button
          type="button"
          onClick={toggleFilter}
          aria-expanded={isFilterOpen}
          aria-controls="case-filter-panel"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 transition"
        >
          {isFilterOpen ? "收合" : "展開"}
          <svg
            className={`h-4 w-4 transition-transform ${
              isFilterOpen ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isFilterOpen && (
          <motion.div
            id="case-filter-panel"
            key="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CaseFilterBar
              value={filters}
              onChange={onChange}
              onSearch={onSearch}
              onClear={onClear}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default QaClient;
