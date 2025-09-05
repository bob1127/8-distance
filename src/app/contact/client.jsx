// app/appointment/page.jsx  或  pages/appointment.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

/* --------------------------- 設定與小工具 --------------------------- */
const STEPS = ["個人資料", "房屋資訊", "設計需求"]; // 正確步驟順序
const isNonEmpty = (v) => String(v ?? "").trim().length > 0;

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-wide">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

/* 整卡可點的單選 */
// 原本 <div ...> ... </div> 全部換成：
function ChoiceCard({ name, value, current, onChange, children }) {
  const active = current === value;
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(value);
    }
  };
  return (
    <button
      type="button"
      aria-pressed={active}
      data-name={name}
      onKeyDown={onKey}
      onClick={() => onChange(value)}
      className={`rounded-xl border p-3 cursor-pointer transition select-none text-left ${
        active
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <div className="text-sm">{children}</div>
    </button>
  );
}

/* 整卡可點的複選 */
function MultiChoiceCard({ value, values, onToggle, children }) {
  const active = values.includes(value);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(value);
    }
  };
  return (
    <button
      type="button"
      aria-pressed={active}
      onKeyDown={onKey}
      onClick={() => onToggle(value)}
      className={`rounded-xl border p-3 cursor-pointer transition select-none text-left ${
        active
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <div className="text-sm">{children}</div>
    </button>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 20, step = 1 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-600 w-28">{label}</span>
      <input
        type="number"
        className="w-28 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-800"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* ------------------------------- 貸款 Popup ------------------------------- */
function LoanHelpModal({ open, onClose }) {
  // 關閉時恢復 body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // ESC 關閉
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const loanNews = {
    title: "最新消息 | 2025 全新裝修分期：輕鬆打造您的夢想家園！",
    intro:
      "夢想的家，不再遙不可及！捌程室內設計與和潤企業攜手合作，推出專為您量身打造的裝修分期付款專案。最高可享 200 萬元彈性分期額度，讓您輕鬆打造心目中的理想居住空間，無需為資金煩惱，幸福立即到家。",
    partnerBlock: [
      "捌程室內設計 X 和潤企業：您的理想家園，輕鬆入主！",
      "我們深知裝修是實現美好生活的關鍵一步，但同時可能帶來資金壓力。因此，捌程室內設計與和潤企業合作，提供貼心、無負擔的裝修分期解決方案，讓您的裝修旅程更從容、更安心。",
    ],
    features: [
      {
        title: "免去繁瑣程序",
        desc: "無需信用卡，也無需擔心聯徵紀錄，大幅簡化申辦流程。",
      },
      {
        title: "資金運用更靈活",
        desc: "最高 36 期分期選擇，分散裝修開支、降低每月負擔。",
      },
    ],
    plan: {
      amountLabel: "100 萬元",
      rows: [
        { term: "12 期", monthly: "87,090 元" },
        { term: "18 期", monthly: "59,170 元" },
        { term: "24 期", monthly: "45,420 元" },
        { term: "36 期", monthly: "31,250 元" },
      ],
    },
    chooseUs: [
      {
        title: "專業設計與品質保證",
        desc: "秉持精湛工藝與嚴謹施工標準，確保裝修品質達到最高水準。",
      },
      {
        title: "全程貼心服務",
        desc: "以經驗與熱忱，陪你走完從規劃到落成的每一步，讓過程更愉悅。",
      },
      {
        title: "完善售後",
        desc: "提供完善保固與修繕服務，為居家空間提供長期保障。",
      },
    ],
    ctas: [
      { label: "預約諮詢表單", href: "/appointment" },
      { label: "詢問客服", href: "/contact" },
    ],
    notes: [
      "本分期方案適用於工程款項滿 100 萬元以上之裝修項目，最高可貸額度為 200 萬元。",
      "分期貸款服務之申貸事宜皆由「和潤企業」提供與核定。",
      "捌程室內設計保留對此專案最終解釋、修改及取消之權利。",
    ],
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999999999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* 視窗 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-[81] w-[min(820px,92vw)] max-h-[88svh] overflow-y-scroll rounded-2xl bg-white shadow-xl border border-neutral-200"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h3 className="text-base font-semibold">協助貸款資訊</h3>
              <button
                onClick={onClose}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:border-neutral-900"
              >
                關閉
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-6">
              {/* 標題＋導言 */}
              <section className="space-y-2">
                <h4 className="text-lg font-semibold">{loanNews.title}</h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {loanNews.intro}
                </p>
              </section>

              {/* 合作說明 */}
              <section className="rounded-2xl border border-neutral-200 !bg-[#daa335] p-4 sm:p-5 bg-neutral-50/60">
                <div className="mb-3 font-medium">
                  {loanNews.partnerBlock[0]}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {loanNews.partnerBlock[1]}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {loanNews.features.map((f) => (
                    <div
                      key={f.title}
                      className="rounded-xl border border-neutral-200 bg-white p-3.5"
                    >
                      <div className="text-sm font-medium">{f.title}</div>
                      <p className="mt-1 text-sm text-neutral-700">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 分期方案（100 萬元示意） */}
              <section>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <h4 className="font-semibold">
                    分期試算（{loanNews.plan.amountLabel} 示意）
                  </h4>
                  <span className="text-xs text-neutral-500">
                    * 實際金額以核准為準
                  </span>
                </div>

                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  {loanNews.plan.rows.map((r) => (
                    <div
                      key={r.term}
                      className="rounded-2xl border border-neutral-200 p-4 bg-white"
                    >
                      <div className="text-xs text-neutral-500">期數</div>
                      <div className="mt-0.5 text-base font-semibold">
                        {r.term}
                      </div>
                      <div className="mt-3 text-xs text-neutral-500">
                        月付(約)
                      </div>
                      <div className="mt-0.5 text-lg font-semibold tracking-wide">
                        {r.monthly}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 為什麼選擇捌程 */}
              <section>
                <h4 className="font-semibold mb-2">
                  選擇捌程，享受安心設計旅程
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {loanNews.chooseUs.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-2xl border border-neutral-200 p-4 bg-white"
                    >
                      <div className="text-sm font-medium">{c.title}</div>
                      <p className="mt-1 text-sm text-neutral-700">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <section className="grid gap-3 sm:grid-cols-2">
                {loanNews.ctas.map((a) => (
                  <a
                    key={a.label}
                    href={a.href}
                    className="rounded-xl bg-[#daa335] text-white px-4 py-3 text-center text-sm hover:opacity-90"
                  >
                    {a.label} →
                  </a>
                ))}
              </section>

              {/* 注意事項 */}
              <section className="rounded-2xl border border-neutral-200 p-4">
                <h4 className="text-sm font-medium mb-2">注意事項</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                  {loanNews.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>

              {/* 更多：流程與準備資料（保留示意） */}
              <details
                className="group border-t border-neutral-200 pt-4 rounded-lg"
                open
              >
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium select-none px-2 py-2 rounded-lg hover:bg-neutral-50">
                  <span>更多：流程與準備資料</span>
                  <svg
                    className="w-4 h-4 text-neutral-500 transition-transform group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>

                <div className="mt-3 space-y-6 text-sm text-neutral-700 px-2">
                  <section>
                    <h5 className="font-medium mb-1">流程</h5>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>留下聯絡方式與基本需求（坪數、預算、房屋狀況）。</li>
                      <li>專員 1–2 個工作日內與你聯繫，初步試算。</li>
                      <li>確認方案並收集資料（下方清單）。</li>
                      <li>送件審核與核貸，安排撥款時程。</li>
                    </ol>
                  </section>

                  <section>
                    <h5 className="font-medium mb-1">準備資料</h5>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>身分證/第二證件</li>
                        <li>近 6 個月薪資或收入證明</li>
                        <li>近 3–6 個月銀行往來明細</li>
                      </ul>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>房屋權狀或買賣契約（如適用）</li>
                        <li>裝修/設計估價單</li>
                        <li>其他銀行要求之文件</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </details>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- 流程說明 Popup ------------------------------- */
function FlowHelpModal({ open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999999999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-[81] w-[min(900px,94vw)] max-h-[88svh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-neutral-200"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h3 className="text-base font-semibold">流程說明</h3>
              <button
                onClick={onClose}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:border-neutral-900"
              >
                關閉
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 text-sm leading-relaxed text-neutral-800">
              <section className="space-y-2">
                <h4 className="text-lg font-semibold">服務流程一覽</h4>
                <p>
                  以下為捌程室內設計標準服務流程，讓你清楚掌握每一階段的重點與交付內容。
                </p>
              </section>

              <ol className="list-decimal pl-5 space-y-10">
                <li>
                  <h5 className="font-semibold">初步諮詢（免費）</h5>
                  <p className="mt-1">
                    了解現況與需求：坪數、格局、風格、預算、時程。提供過往作品與初步建議。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">現場丈量與需求釐清</h5>
                  <p className="mt-1">
                    專員到場丈量、拍照與紀錄，釐清細節（動線、收納與設備需求）。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">平面配置提案</h5>
                  <p className="mt-1">
                    提供 2–3
                    版平面配置，說明優劣與動線。確認方向後進入設計合約。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">設計合約＆3D 模擬</h5>
                  <p className="mt-1">
                    簽訂設計合約並進入 3D
                    模擬（材質、色彩、燈光氛圍），同步進行基本機電整合。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">施工圖與工程報價</h5>
                  <p className="mt-1">
                    繪製完整施工圖、統整材料與設備明細，提供分項工程報價與時程規劃。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">簽訂工程合約＆開工</h5>
                  <p className="mt-1">
                    確認報價與期程後簽約，安排進場。提供 LINE
                    群組與定期進度回報。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">完工驗收與交屋</h5>
                  <p className="mt-1">
                    依驗收清單逐項確認品質，完成後交屋並提供保固維護說明。
                  </p>
                </li>
                <li>
                  <h5 className="font-semibold">售後保固與維護</h5>
                  <p className="mt-1">
                    依合約提供保固；若有使用或維護疑問，隨時與我們聯繫。
                  </p>
                </li>
              </ol>

              <section className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
                <h5 className="font-semibold">費用說明（摘要）</h5>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>設計費：每坪 $6500 起（未稅）。</li>
                  <li>工程：最低承接總額 100 萬。</li>
                  <li>實際以現場狀況、材料與工項核算。</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- 主頁面 --------------------------------- */
export default function AppointmentFormPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 往左, 1 往右
  const [loanOpen, setLoanOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);

  // 表單資料
  const [form, setForm] = useState({
    // Step 1 個人資料
    name: "",
    gender: "",
    age: "",
    phone: "",
    lineId: "",
    email: "",
    ref: "", // ← 改為自由輸入（必填）
    referrer: "",

    // Step 2 房屋資訊
    adults: 1,
    kids: 0,
    region: "",
    houseStatus: "",
    sizeRange: "",

    // Step 3 設計需求
    need: "",
    budget: "",
    styles: [],
    designBrief: "",
    note: "",
    agree: false,
  });

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  // 鍵盤 ← → 支援
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, form]); // 保持最新狀態

  // 小工具：安全字串檢查
  const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

  // 驗證（依當前步驟檢查）
  const validate = (s = step) => {
    if (s === 0) {
      return (
        isNonEmpty(form.name) &&
        isNonEmpty(form.gender) &&
        isNonEmpty(form.age) &&
        isNonEmpty(form.phone) &&
        isNonEmpty(form.lineId) && // ← Line ID 必填
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email).trim()) &&
        isNonEmpty(form.ref) // ← 從哪裡得知（自由輸入）必填
      );
    }
    if (s === 1) {
      return (
        isNonEmpty(form.region) &&
        isNonEmpty(form.houseStatus) &&
        isNonEmpty(form.sizeRange)
      );
    }
    if (s === 2) {
      return isNonEmpty(form.need) && isNonEmpty(form.budget) && !!form.agree;
    }
    return true;
  };

  const prev = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const next = () => {
    if (!validate(step)) {
      alert("有必填欄位尚未完成或格式有誤，請檢查。");
      return;
    }
    if (step === STEPS.length - 1) return;
    setDirection(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(2)) {
      alert("請完整填寫必填欄位。");
      return;
    }
    console.log("FORM SUBMIT:", form);
    alert("送出成功！我們已收到您的需求。");
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const setF = (patch) => setForm((f) => ({ ...f, ...patch }));
  const canNext = validate(step);
  const canSubmit = step === 2 && validate(2);

  /* ------------------------------ UI 版型 ------------------------------ */
  return (
    <div className="min-h-[100svh] bg-white mt-20 text-neutral-900">
      <div className="relative overflow-hidden max-w-[1920px] aspect-[16/9] sm:w-[90%] w-[95%] lg:w-[80%] mx-auto">
        <Image
          src="/images/7cf01af6-3902-4896-8049-90ebdb7df94c.png"
          alt="contact-img"
          placeholder="empty"
          loading="lazy"
          fill
          className="object-cover w-full"
        />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {/* 標題 */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">
              預約 Appointment
            </h1>
            <p className="text-sm text-neutral-500">
              請依步驟填寫，我們將盡快與您聯繫。
            </p>
          </div>

          <div className="hidden sm:flex gap-2">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={`text-xs px-3 py-1 rounded-full border ${
                  i === step
                    ? "border-neutral-900"
                    : "border-neutral-200 text-neutral-500"
                }`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
        </header>

        {/* 進度條 */}
        <div className="h-2 w-full rounded-full bg-neutral-100 mb-6 overflow-hidden">
          <div
            className="h-full bg-[#daa335] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 表單卡片 */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl p-5 sm:p-8 shadow-sm"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              {/* STEP 1：個人資料 */}
              {step === 0 && (
                <>
                  <Section
                    title="歡迎先參閱我們的流程說明"
                    subtitle={
                      <span>
                        若想更了解合作方式，請點擊
                        <button
                          type="button"
                          onClick={() => setFlowOpen(true)}
                          className="ml-1 underline underline-offset-2 decoration-2 text-blue-600 hover:opacity-80"
                          title="查看流程說明"
                        >
                          流程說明
                        </button>
                      </span>
                    }
                  />

                  {/* 姓名 */}
                  <Section title="姓名 *">
                    <input
                      type="text"
                      placeholder="請填寫姓名"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                      value={form.name}
                      onChange={(e) => setF({ name: e.target.value })}
                    />
                  </Section>

                  {/* 稱謂 */}
                  <Section title="稱謂 *">
                    <div className="grid gap-3 grid-cols-2">
                      {["先生", "小姐"].map((v) => (
                        <ChoiceCard
                          key={v}
                          name="gender"
                          value={v}
                          current={form.gender}
                          onChange={(val) => setF({ gender: val })}
                        >
                          {v}
                        </ChoiceCard>
                      ))}
                    </div>
                  </Section>

                  {/* 年齡 */}
                  <Section title="年齡 *">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {[
                        "30歲以下",
                        "31-40歲",
                        "41-50歲",
                        "51-60歲",
                        "61歲以上",
                      ].map((label) => (
                        <ChoiceCard
                          key={label}
                          name="age"
                          value={label}
                          current={form.age}
                          onChange={(val) => setF({ age: val })}
                        >
                          {label}
                        </ChoiceCard>
                      ))}
                    </div>
                  </Section>

                  {/* 聯絡 */}
                  <Section title="手機號碼 *">
                    <input
                      type="tel"
                      placeholder="請留聯絡電話"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                      value={form.phone}
                      onChange={(e) => setF({ phone: e.target.value })}
                    />
                  </Section>
                  <Section title="LINE ID *">
                    <input
                      type="text"
                      placeholder="請留 LINE ID（必填）"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                      value={form.lineId}
                      onChange={(e) => setF({ lineId: e.target.value })}
                    />
                  </Section>

                  <Section title="Email *">
                    <input
                      type="email"
                      placeholder="請留下常用信箱"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                      value={form.email}
                      onChange={(e) => setF({ email: e.target.value })}
                    />
                  </Section>

                  <Section title="推薦人姓名">
                    <input
                      type="text"
                      placeholder="若有請填寫"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                      value={form.referrer}
                      onChange={(e) => setF({ referrer: e.target.value })}
                    />
                  </Section>

                  <Section title="從哪裡得知我們 *">
                    <input
                      type="text"
                      placeholder="例：IG、FB、搜尋、親友介紹…（必填）"
                      className="w-full border-0 border-b border-neutral-300 bg-transparent px-1 py-2 outline-none focus:border-neutral-900"
                      value={form.ref}
                      onChange={(e) => setF({ ref: e.target.value })}
                    />
                  </Section>
                </>
              )}

              {/* STEP 2：房屋資訊 */}
              {step === 1 && (
                <>
                  <Section title="家庭人口">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="居住人口大人"
                        value={form.adults}
                        onChange={(n) => setF({ adults: Math.max(0, n) })}
                        min={0}
                        max={20}
                      />
                      <NumberField
                        label="居住人口小孩"
                        value={form.kids}
                        onChange={(n) => setF({ kids: Math.max(0, n) })}
                        min={0}
                        max={20}
                      />
                    </div>
                  </Section>

                  <Section title="房屋所在區域 *">
                    <div className="grid gap-3 grid-cols-3">
                      {["北部", "中部", "南部"].map((v) => (
                        <ChoiceCard
                          key={v}
                          name="region"
                          value={v}
                          current={form.region}
                          onChange={(val) => setF({ region: val })}
                        >
                          {v}
                        </ChoiceCard>
                      ))}
                    </div>
                  </Section>

                  <Section title="房屋現況 *">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {[
                        "新成屋",
                        "毛胚屋",
                        "預售屋",
                        "中古屋",
                        "商業空間",
                        "自地自建",
                      ].map((v) => (
                        <ChoiceCard
                          key={v}
                          name="houseStatus"
                          value={v}
                          current={form.houseStatus}
                          onChange={(val) => setF({ houseStatus: val })}
                        >
                          {v}
                        </ChoiceCard>
                      ))}
                    </div>
                  </Section>

                  <Section title="室內坪數 *">
                    <div className="grid gap-3 grid-cols-2">
                      {["25坪以下", "26-40坪", "41-60坪", "61坪以上"].map(
                        (label) => (
                          <ChoiceCard
                            key={label}
                            name="sizeRange"
                            value={label}
                            current={form.sizeRange}
                            onChange={(val) => setF({ sizeRange: val })}
                          >
                            {label}
                          </ChoiceCard>
                        )
                      )}
                    </div>
                    <p className="text-xs text-rose-600">
                      設計費每坪 $6500 起（未稅），依實際設計坪數計算
                    </p>
                  </Section>
                </>
              )}

              {/* STEP 3：設計需求 */}
              {step === 2 && (
                <>
                  <Section title="本次委託需求 *">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {[
                        "室內全規劃",
                        "客變+室內全規劃",
                        "客變",
                        "純設計不含施工",
                        "純裝修不含設計",
                        "建築",
                      ].map((v) => (
                        <ChoiceCard
                          key={v}
                          name="need"
                          value={v}
                          current={form.need}
                          onChange={(val) => setF({ need: val })}
                        >
                          {v}
                        </ChoiceCard>
                      ))}
                    </div>
                  </Section>

                  {/* 預算範圍 + 協助貸款 */}
                  <section className="mb-8">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold tracking-wide">
                        預算範圍 <span className="text-rose-600">*</span>
                      </h3>
                      {/* <button
                        type="button"
                        onClick={() => setLoanOpen(true)}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:border-neutral-900"
                      >
                        協助貸款
                      </button> */}
                    </div>

                    <div className="grid gap-3 grid-cols-2">
                      {[
                        ["100-200", "100-200萬"],
                        ["201-300", "201-300萬"],
                        ["301-400", "301-400萬"],
                        ["401+", "401萬以上"],
                      ].map(([v, label]) => (
                        <ChoiceCard
                          key={v}
                          name="budget"
                          value={v}
                          current={form.budget}
                          onChange={(val) => setF({ budget: val })}
                        >
                          {label}
                        </ChoiceCard>
                      ))}
                    </div>
                    <p className="text-xs text-rose-600 mt-1">
                      工程最低承接總額為 200 萬。即日起推出{" "}
                      <button
                        type="button"
                        onClick={() => setLoanOpen(true)}
                        className="rounded-xl !border-b border-none underline !border-blue-400 !text-blue-400 px-3 py-2 text-sm hover:border-neutral-900"
                      >
                        裝修分期付款專案
                      </button>
                      最高200萬額度
                    </p>
                  </section>

                  <Section title="喜好風格（可複選）">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {[
                        "現代極簡",
                        "北歐風格",
                        "日式侘寂",
                        "工業風",
                        "新中式",
                        "無式輕奢",
                        "歐式輕奢",
                        "法式古典",
                        "美式鄉村",
                        "其他（請簡述）",
                      ].map((v) => (
                        <MultiChoiceCard
                          key={v}
                          value={v}
                          values={form.styles}
                          onToggle={(val) =>
                            setForm((f) => ({
                              ...f,
                              styles: f.styles.includes(val)
                                ? f.styles.filter((x) => x !== val)
                                : [...f.styles, val],
                            }))
                          }
                        >
                          {v}
                        </MultiChoiceCard>
                      ))}
                    </div>
                  </Section>

                  <Section
                    title="設計風格參考"
                    subtitle="若有設計參考或連結，可提供於此"
                  >
                    <textarea
                      rows={3}
                      value={form.designBrief}
                      onChange={(e) => setF({ designBrief: e.target.value })}
                      placeholder="例：喜歡日式侘寂＋無式輕奢，可參考 https://……"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                    />
                  </Section>

                  <Section title="備註">
                    <textarea
                      rows={3}
                      value={form.note}
                      onChange={(e) => setF({ note: e.target.value })}
                      placeholder="其他需求、時程或預算補充"
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                    />
                  </Section>

                  <div className="flex items-center gap-2">
                    <input
                      id="agree"
                      type="checkbox"
                      className="accent-black"
                      checked={form.agree}
                      onChange={(e) => setF({ agree: e.target.checked })}
                    />
                    <label htmlFor="agree" className="text-sm">
                      我已閱讀並同意：工程最低承接總額為 100 萬以上，設計費每坪
                      $6500（未稅）起。*
                    </label>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 底部操作列（左灰右黑） */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className={`rounded-xl border px-5 py-3 text-sm transition ${
                step === 0
                  ? "cursor-not-allowed border-neutral-200 text-neutral-400"
                  : "border-neutral-300 hover:border-neutral-900"
              }`}
            >
              ← 上一步
            </button>

            <div className="flex-1 text-center text-sm text-neutral-500">
              第 {step + 1} 步，共 {STEPS.length} 步
            </div>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className={`rounded-xl px-5 py-3 text-sm text-white ${
                  canNext
                    ? "bg-neutral-900 hover:opacity-90"
                    : "bg-neutral-400 cursor-not-allowed"
                }`}
              >
                下一步 →
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className={`rounded-xl px-5 py-3 text-sm text-white ${
                  canSubmit
                    ? "bg-neutral-900 hover:opacity-90"
                    : "bg-neutral-400 cursor-not-allowed"
                }`}
              >
                送出表單
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          小技巧：可使用鍵盤 ← → 快速切換步驟；彈窗可按 ESC 關閉。
        </p>
      </div>

      {/* Popup：協助貸款 & 流程說明 */}
      <LoanHelpModal open={loanOpen} onClose={() => setLoanOpen(false)} />
      <FlowHelpModal open={flowOpen} onClose={() => setFlowOpen(false)} />
    </div>
  );
}
