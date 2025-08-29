// app/appointment/page.jsx  或  pages/appointment.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
/* --------------------------- 設定與小工具 --------------------------- */
const STEPS = ["個人資料", "房屋資訊", "設計需求"]; // 正確步驟順序

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
function ChoiceCard({ name, value, current, onChange, children }) {
  const active = current === value;
  const toggle = () => onChange(value);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };
  return (
    <div
      role="radio"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={onKey}
      onClick={toggle}
      className={`rounded-xl border p-3 cursor-pointer transition select-none
      ${
        active
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        readOnly
        className="hidden"
      />
      <div className="text-sm">{children}</div>
    </div>
  );
}

/* 整卡可點的複選 */
function MultiChoiceCard({ value, values, onToggle, children }) {
  const active = values.includes(value);
  const toggle = () => onToggle(value);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };
  return (
    <div
      role="checkbox"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={onKey}
      onClick={toggle}
      className={`rounded-xl border p-3 cursor-pointer transition select-none
      ${
        active
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <input type="checkbox" checked={active} readOnly className="hidden" />
      <div className="text-sm">{children}</div>
    </div>
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center"
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
            className="relative z-[81] w-[min(820px,92vw)] max-h-[88svh] overflow-hidden rounded-2xl bg-white shadow-xl border border-neutral-200"
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
              <section>
                <h4 className="font-medium mb-2">我們如何協助你</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                  <li>評估可貸額度、期數與每月還款金額（含裝修/設計費）。</li>
                  <li>多家銀行方案比價，提供最適合的利率與配套。</li>
                  <li>整理申貸資料與進度追蹤，縮短核貸時間。</li>
                </ul>
              </section>

              <section>
                <h4 className="font-medium mb-2">流程</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-700">
                  <li>留下聯絡方式與基本需求（坪數、預算、房屋狀況）。</li>
                  <li>專員 1–2 個工作日內與你聯繫，初步試算。</li>
                  <li>確認方案並收集資料（下方清單）。</li>
                  <li>送件審核與核貸，安排撥款時程。</li>
                </ol>
              </section>

              <section>
                <h4 className="font-medium mb-2">準備資料</h4>
                <div className="grid gap-3 sm:grid-cols-2 text-sm text-neutral-700">
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

              <section>
                <h4 className="font-medium mb-2">常見問題</h4>
                <div className="space-y-2 text-sm text-neutral-700">
                  <p>
                    <span className="font-medium">
                      Q：設計費可以併入貸款嗎？
                    </span>
                    <br />
                    A：多數方案可併入，將視房屋條件與額度評估。
                  </p>
                  <p>
                    <span className="font-medium">Q：大約利率與年限？</span>
                    <br />
                    A：視個人條件，常見 1.8%–3.5%，年限 5–20
                    年（實際以核准為準）。
                  </p>
                  <p>
                    <span className="font-medium">Q：核貸時間多久？</span>
                    <br />
                    A：資料齊全下約 5–10 個工作日。
                  </p>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://www.google.com/search?q=%E8%B2%B8%E6%AC%BE%E8%A9%A6%E7%AE%97"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-neutral-300 px-4 py-3 text-sm text-center hover:border-neutral-900"
                >
                  立即前往貸款試算 →
                </a>
                <a
                  href="tel:+886-2-0000-0000"
                  className="rounded-xl bg-neutral-900 text-white px-4 py-3 text-sm text-center hover:opacity-90"
                >
                  直接致電專員
                </a>
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

  // 表單資料
  const [form, setForm] = useState({
    // Step 1 個人資料
    name: "",
    gender: "",
    age: "",
    phone: "",
    lineId: "",
    email: "",
    ref: "",
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
  }, [step]);

  // 驗證（依順序）
  const validate = (s = step) => {
    if (s === 0) {
      return (
        form.name &&
        form.gender &&
        form.age &&
        form.phone &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        form.ref
      );
    }
    if (s === 1) {
      return form.region && form.houseStatus && form.sizeRange;
    }
    if (s === 2) {
      return form.need && form.budget && form.agree;
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
  const toggleStyle = (v) =>
    setForm((f) => ({
      ...f,
      styles: f.styles.includes(v)
        ? f.styles.filter((x) => x !== v)
        : [...f.styles, v],
    }));

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
        ></Image>
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        {/* 標題（第一版排版） */}
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

        {/* 進度條（第一版風格） */}
        <div className="h-2 w-full rounded-full bg-neutral-100 mb-6 overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 表單卡片 */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl  p-5 sm:p-8 shadow-sm"
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
              {/* STEP 1：個人資料（略）—— 內容與前版相同 */}
              {step === 0 && (
                <>
                  <Section
                    title="歡迎先參閱我們的流程說明"
                    subtitle="這裡要套用停留的顏色效果以及插入連結讓使用者可切換"
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
                  <Section title="LINE ID">
                    <input
                      type="text"
                      placeholder="請留帳號便於聯絡"
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
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {["FB", "IG", "自主搜尋", "廣告", "親友", "其他"].map(
                        (label) => (
                          <ChoiceCard
                            key={label}
                            name="ref"
                            value={label}
                            current={form.ref}
                            onChange={(val) => setF({ ref: val })}
                          >
                            {label}
                          </ChoiceCard>
                        )
                      )}
                    </div>
                  </Section>
                </>
              )}

              {/* STEP 2：房屋資訊（略）—— 與前版相同 */}
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

              {/* STEP 3：設計需求（新增「協助貸款」按鈕＋Popup） */}
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
                      <button
                        type="button"
                        onClick={() => setLoanOpen(true)}
                        className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:border-neutral-900"
                      >
                        協助貸款
                      </button>
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
                      工程最低承接總額為 100 萬。
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
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm text-white hover:opacity-90"
              >
                下一步 →
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-5 py-3 text-sm text-white hover:opacity-90"
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

      {/* 協助貸款 Popup */}
      <LoanHelpModal open={loanOpen} onClose={() => setLoanOpen(false)} />
    </div>
  );
}
