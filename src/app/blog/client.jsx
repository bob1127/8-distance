"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Link from "next/link";
import JanusButton02 from "../../components/JanusButton2.jsx";

/* ===== 假資料（換成你的真實資料） ===== */
const cases = [
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
      "https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg",
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

/* ===== 共用：現代化原生 Select（label + placeholder + 自訂箭頭） ===== */
function SelectField({
  id,
  label,
  value,
  onChange,
  options, // [{value:'', label:'顯示文字'}] 第一個可當 placeholder
  placeholder, // 若未提供，預設 options[0].label
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
            .filter((o, i) => !(i === 0 && o.value === "")) // 避免重複 placeholder
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

/* ===== 篩選列（三排排版；第3排是按鈕） ===== */
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

      {/* 第三排：按鈕（小螢幕置中；lg 以上靠右） */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center lg:justify-end">
        <button
          onClick={onSearch}
          className="h-11 rounded-full px-6 bg-purple-600 text-white font-medium hover:opacity-95"
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

export default function Home() {
  const container = useRef(null);
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

  useEffect(() => {
    const lenis = new Lenis();
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafId);
  }, []);

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
  }, [filters]);

  const handleChange = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const handleClear = () =>
    setFilters({
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
      _searchTick: (filters._searchTick || 0) + 1,
    });

  const formatWan = (n) =>
    new Intl.NumberFormat("zh-TW").format(Number(n || 0)) + " 萬";

  return (
    <div className="bg-[#f6f6f7] py-20">
      <section className="flex pt-[100px] max-w-[1920px] py-20 w-[90%] mx-auto flex-col lg:flex-row">
        {/* 左半部 */}
        <div className="left w-full pr-8 lg:w-[70%]">
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

          <div className="mb-3 text-sm text-gray-600">
            共 {filtered.length} 個符合條件的案件
          </div>

          <div className="blog-grid grid pl-0 lg:pr-10 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Link key={item.id} href={item.link}>
                <div className="item overflow-hidden relative group bg-white transition-all duration-300 rounded-2xl border border-gray-100">
                  <div className="!absolute hidden group-hover:block w-[90px] h-[90px] bottom-3 right-5">
                    <JanusButton02 />
                  </div>
                  <div className="img mx-5 overflow-hidden mt-5 relative rounded-xl aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-6 pt-6 pb-7 flex flex-col gap-2">
                    <h2 className="text-[18px] font-medium">{item.title}</h2>
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
        </div>

        {/* 右半部（保持不動） */}
        <div className="right w-full pt-10 lg:pt-0 lg:w-[30%] ">
          <div className="right-bar bg-white sticky top-20 py-8">
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
              ></Image>
            </div>
            <div className="txt flex justify-center flex-col items-center mt-5">
              <b>捌程室內設計 | 8 Distance</b>
              <p className="text-[14px] text-gray-700 w-2/3 text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem fugiat quasi quis consequatur.
              </p>
            </div>
            <div className="social flex justify-center mt-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                  cx="19.38"
                  cy="42.035"
                  r="44.899"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#fd5"></stop>
                  <stop offset=".328" stop-color="#ff543f"></stop>
                  <stop offset=".348" stop-color="#fc5245"></stop>
                  <stop offset=".504" stop-color="#e64771"></stop>
                  <stop offset=".643" stop-color="#d53e91"></stop>
                  <stop offset=".761" stop-color="#cc39a4"></stop>
                  <stop offset=".841" stop-color="#c837ab"></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                  cx="11.786"
                  cy="5.54"
                  r="29.813"
                  gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#4168c9"></stop>
                  <stop
                    offset=".999"
                    stop-color="#4168c9"
                    stop-opacity="0"
                  ></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <path
                  fill="#fff"
                  d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5 s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                ></path>
                <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                <path
                  fill="#fff"
                  d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12 C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                ></path>
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                  x1="9.993"
                  x2="40.615"
                  y1="9.993"
                  y2="40.615"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#2aa4f4"></stop>
                  <stop offset="1" stop-color="#007ad9"></stop>
                </linearGradient>
                <path
                  fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                  d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                ></path>
                <path
                  fill="#fff"
                  d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xa_0ZWDaCvmIF4I_gr1"
                  x1="4.522"
                  x2="45.203"
                  y1="2.362"
                  y2="47.554"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xa_0ZWDaCvmIF4I_gr1)"
                  d="M8,42h32c1.105,0,2-0.895,2-2V8c0-1.105-0.895-2-2-2H8C6.895,6,6,6.895,6,8v32  C6,41.105,6.895,42,8,42z"
                ></path>
                <path
                  d="M23.284,37.758c-0.454,0-0.851-0.175-1.118-0.493c-0.46-0.548-0.338-1.245-0.286-1.542l0.191-1.144  c0.036-0.277,0.036-0.451,0.028-0.549c-0.08-0.037-0.22-0.091-0.45-0.14c-6.792-0.895-11.751-5.723-11.751-11.473 c0-6.417,6.329-11.637,14.108-11.637c7.779,0,14.107,5.22,14.107,11.637c0,2.593-1.005,4.954-3.073,7.218 c-2.801,3.227-9.098,7.206-10.647,7.858C23.97,37.672,23.607,37.758,23.284,37.758z"
                  opacity=".05"
                ></path>
                <path
                  d="M23.284,37.258c-0.389,0-0.615-0.171-0.735-0.315c-0.311-0.371-0.22-0.888-0.176-1.136l0.191-1.146  c0.075-0.578,0.024-0.824-0.013-0.918c-0.017-0.038-0.202-0.214-0.796-0.342c-6.564-0.866-11.357-5.489-11.357-10.984 c0-6.141,6.104-11.137,13.608-11.137c7.503,0,13.607,4.996,13.607,11.137c0,2.462-0.962,4.713-2.942,6.881  c-2.76,3.179-8.95,7.094-10.472,7.734C23.838,37.185,23.539,37.258,23.284,37.258z"
                  opacity=".07"
                ></path>
                <path
                  fill="#fff"
                  d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637 c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185 c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001 C36.203,26.879,37.113,24.764,37.113,22.417z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xb_0ZWDaCvmIF4I_gr2"
                  x1="18.372"
                  x2="36.968"
                  y1="13.013"
                  y2="27.439"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xb_0ZWDaCvmIF4I_gr2)"
                  d="M32.052,20.698c0.38,0,0.688-0.308,0.688-0.687s-0.309-0.687-0.688-0.687h-2.604 c-0.379,0-0.687,0.308-0.687,0.687c0,0.001,0,0.001,0,0.002v2.602c0,0,0,0,0,0.001v2.603c0,0.38,0.309,0.688,0.687,0.688h2.604 c0.379,0,0.688-0.309,0.688-0.688c0-0.379-0.309-0.687-0.688-0.687h-1.917v-1.23h1.917c0.38,0,0.688-0.308,0.688-0.687 c0-0.38-0.309-0.688-0.688-0.688v0.001h-1.917v-1.23H32.052z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xc_0ZWDaCvmIF4I_gr3"
                  x1="16.286"
                  x2="34.882"
                  y1="15.702"
                  y2="30.128"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xc_0ZWDaCvmIF4I_gr3)"
                  d="M26.463,20.01v3.223l-2.67-3.635c-0.129-0.172-0.335-0.275-0.549-0.275 c-0.074,0-0.147,0.011-0.218,0.035c-0.281,0.094-0.47,0.356-0.47,0.652v5.209c0,0.38,0.309,0.688,0.688,0.688 c0.38,0,0.688-0.309,0.688-0.688v-3.222l2.669,3.635c0.129,0.172,0.334,0.275,0.549,0.275c0.073,0,0.147-0.012,0.218-0.036 c0.282-0.093,0.47-0.355,0.47-0.652V20.01c0-0.379-0.308-0.687-0.687-0.687S26.463,19.631,26.463,20.01z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xd_0ZWDaCvmIF4I_gr4"
                  x1="12.933"
                  x2="31.529"
                  y1="20.025"
                  y2="34.451"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xd_0ZWDaCvmIF4I_gr4)"
                  d="M16.271,19.323c-0.379,0-0.687,0.308-0.687,0.687v5.209c0,0.38,0.308,0.688,0.687,0.688 h2.604c0.379,0,0.687-0.309,0.687-0.689c0-0.379-0.308-0.687-0.687-0.687h-1.917V20.01C16.958,19.631,16.65,19.323,16.271,19.323z"
                ></path>
                <linearGradient
                  id="s7bNhrkBpwUCoDDZerQ_xe_0ZWDaCvmIF4I_gr5"
                  x1="14.665"
                  x2="33.26"
                  y1="17.793"
                  y2="32.218"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#33c481"></stop>
                  <stop offset="1" stop-color="#21a366"></stop>
                </linearGradient>
                <path
                  fill="url(#s7bNhrkBpwUCoDDZerQ_xe_0ZWDaCvmIF4I_gr5)"
                  d="M20.194,20.01v5.209c0,0.38,0.308,0.688,0.687,0.688c0.379,0,0.687-0.309,0.687-0.688V20.01 c0-0.379-0.308-0.687-0.687-0.687C20.502,19.323,20.194,19.631,20.194,20.01z"
                ></path>
              </svg>
            </div>
            <div className="others-article">
              <div className="article-item  px-8 group flex">
                <div className="txt w-full  transition duration-400">
                  <b>Article Title</b>
                  <p className="text-[14px] text-gray-800">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aliquid vero praesentium iusto illo, consectetur quae?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
