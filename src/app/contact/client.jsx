"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
/* --------------------------- 設定與小工具 --------------------------- */
const STEPS = ["個人資料", "房屋資訊", "設計需求"]; // 正確步驟順序
const isNonEmpty = (v) => String(v ?? "").trim().length > 0;

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_APPOINTMENT_API ||
  "https://api.8distance.com/api/customer-inquiry";

// 與服務流程頁面一致的數字強調（用於描述內金額/百分比）
function emphasizeNumbersHTML(text) {
  if (!text) return text;
  const pattern =
    /(\d+\s*-\s*\d+\s*%|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*萬(?:元)?|\d+(?:\.\d+)?\s*萬元|\d+(?:\.\d+)?\s*元)/g;
  return String(text).replace(
    pattern,
    (m) =>
      `<strong class="font-semibold align-baseline" style="font-size:1.16em; line-height:1;">${m}</strong>`,
  );
}
function BreakAfterColon({ text = "" }) {
  const idx =
    text.indexOf("：") !== -1 ? text.indexOf("：") : text.indexOf(":");
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx + 1)}
      <br />
      {text.slice(idx + 1)}
    </>
  );
}

const normalizeSource = (ref) => {
  if (!ref) return "";
  return ref.startsWith("其他:") ? ref.replace(/^其他:/, "").trim() : ref;
};

// 把選到的預算代碼轉成後端要的中文字（含「萬」）
const budgetLabelFromValue = (v) => {
  switch (v) {
    case "200-300":
      return "200-300萬";
    case "301-400":
      return "301-400萬";
    case "401-500":
      return "401-500萬";
    case "501+":
      return "501萬以上";
    default:
      return ""; // 讓前端驗證擋住
  }
};

/* --------- 僅抽出有效 URL，避免 style_reference 驗證失敗 --------- */
const isValidUrl = (s) => {
  try {
    const u = new URL(String(s).trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const extractFirstUrl = (text) => {
  if (!text) return "";
  // 抓第一個 http(s) 連結（避開空白與右括號等常見結尾）
  const m = String(text).match(/https?:\/\/[^\s)]+/i);
  return m && isValidUrl(m[0]) ? m[0] : "";
};

// 把表單狀態轉成後端需求格式（修正版）
function buildPayload(form) {
  const source = normalizeSource(form.ref) || form.ref || "";
  const url = extractFirstUrl(form.designBrief); // 只抽第一個有效 URL

  return {
    step1: {
      name: form.name,
      gender: form.gender, // "先生" | "小姐"
      age_range: form.age, // 例 "31-40歲"
      occupation: form.occupation, // 新增：職業
      phone: form.phone,
      line_id: form.lineId,
      email: form.email,
      referrer: form.referrer || "",
      source, // 確保不是空字串
    },
    step2: {
      adults: Number(form.adults ?? 0),
      children: Number(form.kids ?? 0),
      region: form.region, // "北部" | "中部" | "南部"
      case_address: form.caseAddress, // 新增：案件地址
      case_name: form.caseName, // 新增：案件名稱
      house_status: form.houseStatus,
      size_range: form.sizeRange, // "41-60坪" 等
      handover_time: formatScheduleValue(form.handoverTime),
      expected_completion_time: formatScheduleValue(form.completionTime),
    },
    step3: {
      need: form.need,
      budget: budgetLabelFromValue(form.budget),
      styles: (() => {
        const base = Array.isArray(form.styles) ? form.styles : [];

        const withoutOther = base.filter((s) => s !== "其他（請簡述）");
        const extra = form.otherStyle?.trim()
          ? [`其他:${form.otherStyle.trim()}`]
          : [];
        return [...withoutOther, ...extra];
      })(),
      ...(extractFirstUrl(form.designBrief)
        ? { style_reference: extractFirstUrl(form.designBrief) }
        : {}),
      note: form.note || "",
    },
  };
}

/* ---------------------- 通用：Portal 容器（行動裝置必備） ---------------------- */
function ModalPortal({ children }) {
  const [el, setEl] = useState(null);

  useEffect(() => {
    const div = document.createElement("div");
    div.className = "portal-root"; // ★ 讓我們能在 CSS 精準鎖字體
    div.style.position = "fixed";
    div.style.inset = "0";
    div.style.zIndex = "2147483647";
    div.style.pointerEvents = "none";
    // ★ 關鍵：在 root 直接鎖家族與權重，避免任何內層覆蓋
    div.style.fontFamily = "var(--app-font)";
    div.style.fontWeight = "300";
    document.body.appendChild(div);
    setEl(div);
    return () => document.body.removeChild(div);
  }, []);

  if (!el) return null;
  return createPortal(children, el);
}

/* 整卡可點的單選 */
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

const MONTH_VALUE_RE = /^\d{4}-\d{2}$/;

function formatScheduleValue(v) {
  if (!v) return "";
  if (
    v === "已交屋" ||
    v === "尚未確定" ||
    v === "3個月內" ||
    v === "6個月內" ||
    v === "1年內"
  ) {
    return v;
  }
  const m = String(v).match(/^(\d{4})-(\d{2})$/);
  if (m) return `${m[1]}年${Number(m[2])}月`;
  return v;
}

/** 交屋 / 完工時間：快捷選項 + 年月選擇器（與表單 ChoiceCard 風格一致） */
function MonthScheduleField({
  label,
  value = "",
  onChange,
  quickOptions = ["尚未確定"],
  inputRef,
  error,
}) {
  const isQuick = quickOptions.includes(value);
  const monthValue = MONTH_VALUE_RE.test(value) ? value : "";

  return (
    <div ref={inputRef}>
      <label className="block text-sm text-neutral-600 mb-2">{label}</label>

      <div
        className={`grid gap-2 mb-3 ${
          quickOptions.length >= 3
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        {quickOptions.map((opt) => (
          <ChoiceCard
            key={opt}
            name={label}
            value={opt}
            current={value}
            onChange={onChange}
          >
            {opt}
          </ChoiceCard>
        ))}
      </div>

      <div
        className={`rounded-xl border px-4 py-3 transition ${
          monthValue
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-neutral-500 shrink-0">預計年月</span>
          <input
            type="month"
            className="w-full min-w-0 bg-transparent text-sm outline-none focus:ring-0 [color-scheme:light]"
            value={monthValue}
            min="2024-01"
            max="2035-12"
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label}預計年月`}
          />
        </div>
      </div>

      {!isQuick && !monthValue && (
        <p className="mt-1.5 text-xs text-neutral-400">
          可點選上方選項，或選擇預計年月
        </p>
      )}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

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

/* ------------------------------- 貸款 Popup ------------------------------- */
function LoanHelpModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    };
  }, [open]);

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
        desc: "以經驗與熱忱，陪您走完從規劃到落成的每一步，讓過程更愉悅。",
      },
      {
        title: "完善售後",
        desc: "提供完善保固與修繕服務，為居家空間提供長期保障。",
      },
    ],
    ctas: [
      { label: "預約諮詢表單", href: "/contact" },
      { label: "詢問客服", href: "/contact" },
    ],
    notes: [
      "本分期方案適用於工程款項滿 120 萬元以上之裝修項目，最高可貸額度為 200 萬元。",
      "分期貸款服務之申貸事宜皆由「和潤企業」提供與核定。",
      "捌程室內設計保留對此專案最終解釋、修改及取消之權利。",
    ],
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center pt-[max(env(safe-area-inset-top),0px)] pb-[max(env(safe-area-inset-bottom),0px)]"
            style={{ minHeight: "100svh", pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 背景遮罩 */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* 視窗 */}
            <motion.div
              role="dialog"
              aria-modal="true"
              style={{ fontFamily: "var(--app-font)", fontWeight: 300 }}
              className="relative z-[1] w-[min(820px,94vw)] max-h-[88svh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-neutral-200"
              initial={{ y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <h3 className="text-base font-semibold">協助貸款資訊</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:border-neutral-900"
                >
                  關閉
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
                {/* 標題＋導言 */}
                <section className="space-y-2">
                  <h4 className="text-lg font-semibold">{loanNews.title}</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {loanNews.intro}
                  </p>
                </section>

                {/* 合作說明 */}
                <section className="rounded-2xl border border-neutral-200 !bg-[#daa335] p-4 sm:p-5 bg-neutral-50/60">
                  <div className="mb-3 font-medium leading-relaxed">
                    <BreakAfterColon text={loanNews.partnerBlock[0]} />
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
                        <p className="mt-1 text-sm text-neutral-700">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 分期方案 */}
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
                        <p className="mt-1 text-sm text-neutral-700">
                          {c.desc}
                        </p>
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}

/* ------------------------------- 流程說明 Popup（修正排序邏輯&修字） ------------------------------- */
function FlowHelpModal({ open, onClose }) {
  // 鎖捲動
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    };
  }, [open]);

  // ESC 關閉
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 讀取與《服務流程》相同 API 的「設計流程」資料（嚴格依 sort_order 標號）
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    let aborted = false;
    async function fetchData() {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch("https://api.8distance.com/api/processes", {
          cache: "no-store",
        });
        const json = await res.json();
        const root = json?.processes || json?.data || json || {};
        const arr = Array.isArray(root.process_designs)
          ? root.process_designs
          : [];

        // 嚴格：若 sort_order 是正整數，用它當 STEP；否則回退為 index+1
        const stepLabelStrict = (s, idx) => {
          const n = Number(s);
          if (Number.isFinite(n) && n > 0)
            return `STEP-${String(n).padStart(2, "0")}`;
          return `STEP-${String(idx + 1).padStart(2, "0")}`;
        };

        const mapped = arr
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((d, idx) => ({
            step: stepLabelStrict(d?.sort_order, idx),
            heading: d?.title ?? "",
            desc: d?.description ?? "",
            items: Array.isArray(d?.procedures)
              ? d.procedures
                  .map((p) => (typeof p?.step === "string" ? p.step : ""))
                  .filter(Boolean)
              : [],
            imageUrl: d?.image_url ?? "",
            imageAlt: d?.image_alt || d?.title || "",
          }));

        if (!aborted) setDesigns(mapped);
      } catch (e) {
        if (!aborted) setErr("流程資料載入失敗，請稍後再試。");
        console.error(e);
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      aborted = true;
    };
  }, [open]);

  return (
    <ModalPortal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center pt-[max(env(safe-area-inset-top),0px)] pb-[max(env(safe-area-inset-bottom),0px)]"
            style={{ minHeight: "100svh", pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 遮罩 */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
              aria-hidden="true"
            />
            {/* 視窗 */}
            <motion.div
              role="dialog"
              style={{ fontFamily: "var(--app-font)", fontWeight: 300 }}
              aria-modal="true"
              className="relative z-[1] w-[min(900px,94vw)] max-h-[88svh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-neutral-200"
              initial={{ y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <h3 className="text-base font-semibold">流程說明</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:border-neutral-900"
                >
                  關閉
                </button>
              </div>

              {/* Body：抓到的「設計流程」列表 */}
              <div className="px-4 sm:px-6 py-5">
                {loading && (
                  <p className="text-center text-neutral-400 py-10">載入中…</p>
                )}
                {err && <p className="text-center text-rose-600 py-6">{err}</p>}
                {!loading && !err && (
                  <>
                    {designs.length === 0 ? (
                      <p className="text-center text-neutral-500 py-8">
                        目前尚無流程資料
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {designs.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-neutral-200 p-4"
                          >
                            {/* 圖示 */}
                            {item.imageUrl ? (
                              <div className="mb-3">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.imageAlt}
                                  width={88}
                                  height={88}
                                  className="w-20 h-20 object-cover rounded-2xl"
                                />
                              </div>
                            ) : null}

                            {/* 文字 */}
                            {item.step && (
                              <div className="text-[14px] tracking-wide text-neutral-600">
                                {item.step}
                              </div>
                            )}
                            {item.heading && (
                              <h4 className="mt-0.5 text-[16px] font-semibold text-neutral-900">
                                {item.heading}
                              </h4>
                            )}
                            {item.desc && (
                              <p
                                className="mt-2 text-[14px] text-neutral-700 leading-relaxed whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: emphasizeNumbersHTML(item.desc),
                                }}
                              />
                            )}

                            {Array.isArray(item.items) &&
                              item.items.length > 0 && (
                                <ul className="mt-3 grid grid-cols-1 gap-y-1 text-left">
                                  {item.items.map((li, i) => (
                                    <li
                                      key={i}
                                      className="relative pl-4 text-[14px] text-neutral-700 leading-relaxed before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-400"
                                    >
                                      {li}
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}

/* --------------------------------- 主頁面 --------------------------------- */
export default function AppointmentFormPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 往左, 1 往右
  const [loanOpen, setLoanOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);

  // 送出狀態與訊息
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [serverErr, setServerErr] = useState("");

  // 🔴 錯誤狀態
  const [errors, setErrors] = useState({});

  // 表單資料
  const [form, setForm] = useState({
    // Step 1 個人資料
    name: "",
    gender: "",
    age: "",
    occupation: "", // 新增：職業
    phone: "",
    lineId: "",
    email: "",
    ref: "",
    referrer: "",
    // Step 2 房屋資訊
    adults: 1,
    kids: 0,
    region: "",
    caseAddress: "",
    caseName: "",
    houseStatus: "",
    sizeRange: "",
    handoverTime: "",
    completionTime: "",
    // Step 3 設計需求
    need: "",
    budget: "",
    styles: [],
    otherStyle: "",
    designBrief: "",
    note: "",
    agree: false,
  });

  // 欄位 refs（用來捲動到錯誤處）
  const refs = {
    name: useRef(null),
    gender: useRef(null),
    age: useRef(null),
    occupation: useRef(null), // 新增
    phone: useRef(null),
    lineId: useRef(null),
    email: useRef(null),
    ref: useRef(null),
    refOther: useRef(null),

    region: useRef(null),
    caseAddress: useRef(null),
    houseStatus: useRef(null),
    sizeRange: useRef(null),

    need: useRef(null),
    budget: useRef(null),
    agree: useRef(null),
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };
  useEffect(() => {
    // 當步驟切換時，自動回到表單頂端
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // 鍵盤 ← → 支援
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, form]);

  const validate = (s = step) => {
    // 基礎工具
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = (x) => String(x ?? "").replace(/\D+/g, "");
    const hasOther = (ref) =>
      typeof ref === "string" &&
      ref.startsWith("其他:") &&
      ref.replace(/^其他:/, "").trim().length > 0;

    if (s === 0) {
      const phoneDigits = digitsOnly(form.phone);
      const refOK =
        (form.ref && !form.ref.startsWith("其他:")) || hasOther(form.ref);

      return (
        isNonEmpty(form.name) &&
        isNonEmpty(form.gender) &&
        isNonEmpty(form.age) &&
        isNonEmpty(form.occupation) && // 新增：職業必填
        phoneDigits.length >= 8 &&
        isNonEmpty(form.lineId) &&
        isEmail.test(String(form.email).trim()) &&
        refOK
      );
    }

    if (s === 1) {
      return (
        isNonEmpty(form.region) &&
        isNonEmpty(form.caseAddress) &&
        isNonEmpty(form.houseStatus) &&
        isNonEmpty(form.sizeRange)
      );
    }

    if (s === 2) {
      const budgetOK = !!(
        form.budget &&
        ["200-300", "301-400", "401-500", "501+"].includes(form.budget)
      );
      return isNonEmpty(form.need) && budgetOK && !!form.agree;
    }

    return true;
  };

  // 🔴 詳細驗證 + 指到第一個錯誤
  const validateDetailed = (s = step) => {
    const errs = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = (x) => String(x ?? "").replace(/\D+/g, "");

    if (s === 0) {
      if (!isNonEmpty(form.name)) errs.name = "請填寫姓名";
      if (!isNonEmpty(form.gender)) errs.gender = "請選擇稱謂";
      if (!isNonEmpty(form.age)) errs.age = "請選擇年齡";
      if (!isNonEmpty(form.occupation)) errs.occupation = "請填寫職業"; // 新增
      if (digitsOnly(form.phone).length < 8) errs.phone = "電話格式不正確";
      if (!isNonEmpty(form.lineId)) errs.lineId = "請填寫 LINE ID";
      if (!isEmail.test(String(form.email).trim()))
        errs.email = "Email 格式不正確";
      const refIsOther = form.ref?.startsWith("其他:");
      if (!isNonEmpty(form.ref)) errs.ref = "請選擇來源";
      if (refIsOther && !form.ref.replace(/^其他:/, "").trim()) {
        errs.ref = "請輸入其他來源";
      }
    }

    if (s === 1) {
      if (!isNonEmpty(form.region)) errs.region = "請選擇區域";
      if (!isNonEmpty(form.caseAddress)) errs.caseAddress = "請填寫案件地址";
      if (!isNonEmpty(form.houseStatus)) errs.houseStatus = "請選擇房屋現況";
      if (!isNonEmpty(form.sizeRange)) errs.sizeRange = "請選擇室內坪數";
    }

    if (s === 2) {
      if (!isNonEmpty(form.need)) errs.need = "請選擇委託需求";
      if (!["200-300", "301-400", "401-500", "501+"].includes(form.budget))
        errs.budget = "請選擇預算範圍";
      if (!form.agree) errs.agree = "請勾選同意條款";
    }

    setErrors(errs);
    const firstKey = Object.keys(errs)[0] || null;
    return { ok: Object.keys(errs).length === 0, firstKey };
  };

  const scrollToKey = (key) => {
    const el =
      (key === "ref" && form.ref?.startsWith("其他:")
        ? refs.refOther.current
        : null) || (refs[key] ? refs[key].current : null);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const input = el.querySelector?.("input, textarea, button, [tabindex]");
      if (input && typeof input.focus === "function") {
        setTimeout(() => input.focus(), 350);
      }
    }
  };

  const prev = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const next = () => {
    const { ok, firstKey } = validateDetailed(step);
    if (!ok) {
      if (firstKey) scrollToKey(firstKey);
      return;
    }
    if (step === STEPS.length - 1) return;
    setDirection(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setServerErr("");

    const { ok, firstKey } = validateDetailed(2);
    if (!ok) {
      if (firstKey) scrollToKey(firstKey);
      return;
    }

    if (submitting) return; // 防雙擊
    setSubmitting(true);

    try {
      const payload = buildPayload(form);

      // 15 秒逾時
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        // 不是 JSON 就忽略
      }

      if (!res.ok) {
        let msg =
          data?.message || data?.error || `送出失敗（HTTP ${res.status}）`;

        if (data?.errors) {
          if (Array.isArray(data.errors)) {
            msg +=
              "\n" +
              data.errors
                .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
                .join("\n");
          } else if (typeof data.errors === "object") {
            msg +=
              "\n" +
              Object.entries(data.errors)
                .map(
                  ([k, v]) =>
                    `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`,
                )
                .join("\n");
          }
        }

        setServerErr(msg);
        alert(msg);
        return;
      }

      const okMsg = data?.message || "送出成功！我們已收到您的需求。";
      setServerMsg(okMsg);
      alert(okMsg);

      // 成功後清空表單並回到第一步
      setForm({
        name: "",
        gender: "",
        age: "",
        occupation: "", // 重置
        phone: "",
        lineId: "",
        email: "",
        ref: "",
        referrer: "",
        adults: 1,
        kids: 0,
        region: "",
        caseAddress: "",
        caseName: "",
        houseStatus: "",
        sizeRange: "",
        handoverTime: "",
        completionTime: "",
        need: "",
        budget: "",
        styles: [],
        otherStyle: "",
        designBrief: "",
        note: "",
        agree: false,
      });
      setErrors({});
      setStep(0);
    } catch (err) {
      const msg =
        err?.name === "AbortError"
          ? "連線逾時，請稍後再試。"
          : "送出失敗，請稍後再試。";
      setServerErr(msg);
      alert(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  // 改成中央控管 setF：同步清理對應欄位的錯誤
  const setF = (patch) =>
    setForm((f) => {
      const next = { ...f, ...patch };
      setErrors((e) => {
        const copy = { ...e };
        Object.keys(patch).forEach((k) => {
          if (copy[k]) delete copy[k];
        });
        return copy;
      });
      return next;
    });

  /* ------------------------------ UI 版型 ------------------------------ */
  return (
    <div className="min-h-[100svh] bg-white  mt-[120px] sm:mt-[90px] text-neutral-900">
      <div className="relative overflow-hidden t-20 max-w-[1920px] aspect-[16/9] sm:aspect-[16/7] sm:w-[90%] w-[95%] lg:w-[80%] mx-auto">
        <Image
          src="/images/S__14459053.webp"
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
                    <div ref={refs.name}>
                      <input
                        type="text"
                        placeholder="請填寫姓名"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        value={form.name}
                        onChange={(e) => setF({ name: e.target.value })}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </Section>

                  {/* 稱謂 */}
                  <Section title="稱謂 *">
                    <div
                      ref={refs.gender}
                      className="grid gap-3 grid-cols-2"
                    >
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
                    {errors.gender && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.gender}
                      </p>
                    )}
                  </Section>

                  {/* 年齡 */}
                  <Section title="年齡 *">
                    <div
                      ref={refs.age}
                      className="grid gap-3 grid-cols-1 sm:grid-cols-3"
                    >
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
                    {errors.age && (
                      <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
                    )}
                  </Section>

                  {/* 職業 */}
                  <Section title="職業 *">
                    <div ref={refs.occupation}>
                      <input
                        type="text"
                        placeholder="請填寫職業"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        value={form.occupation}
                        onChange={(e) => setF({ occupation: e.target.value })}
                        aria-invalid={!!errors.occupation}
                      />
                      {errors.occupation && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.occupation}
                        </p>
                      )}
                    </div>
                  </Section>

                  {/* 聯絡 */}
                  <Section title="手機號碼 *">
                    <div ref={refs.phone}>
                      <input
                        type="tel"
                        placeholder="請留聯絡電話"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        value={form.phone}
                        onChange={(e) => setF({ phone: e.target.value })}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </Section>
                  <Section title="LINE ID *">
                    <div ref={refs.lineId}>
                      <input
                        type="text"
                        placeholder="請留 LINE ID（必填）"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        value={form.lineId}
                        onChange={(e) => setF({ lineId: e.target.value })}
                        aria-invalid={!!errors.lineId}
                      />
                      {errors.lineId && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.lineId}
                        </p>
                      )}
                    </div>
                  </Section>

                  <Section title="Email *">
                    <div ref={refs.email}>
                      <input
                        type="email"
                        placeholder="請留下常用信箱"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        value={form.email}
                        onChange={(e) => setF({ email: e.target.value })}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
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
                    <div
                      ref={refs.ref}
                      className="grid gap-3 grid-cols-2 sm:grid-cols-3"
                    >
                      {[
                        "官網",
                        "廣告",
                        "親友",
                        "IG 短影音",
                        "IG 文章",
                        "FB 短影音",
                        "FB 文章",
                        "TikTok",
                        "Youtube",
                      ].map((v) => (
                        <ChoiceCard
                          key={v}
                          name="ref"
                          value={v}
                          current={form.ref}
                          onChange={(val) => setF({ ref: val })}
                        >
                          {v}
                        </ChoiceCard>
                      ))}
                      {/* 其他選項 */}
                      <ChoiceCard
                        name="ref"
                        value="其他"
                        current={
                          form.ref?.startsWith("其他:") ? "其他" : form.ref
                        }
                        onChange={() => setF({ ref: "其他:" })}
                      >
                        其他
                      </ChoiceCard>
                    </div>
                    {form.ref?.startsWith("其他:") && (
                      <div ref={refs.refOther}>
                        <input
                          type="text"
                          placeholder="請輸入其他來源"
                          className="mt-3 w-full border-0 border-b border-neutral-300 px-1 py-2 outline-none bg-transparent focus:border-neutral-900"
                          value={form.ref.replace(/^其他:/, "")}
                          onChange={(e) =>
                            setF({ ref: "其他:" + e.target.value })
                          }
                          aria-invalid={!!errors.ref}
                        />
                      </div>
                    )}
                    {errors.ref && (
                      <p className="mt-1 text-xs text-rose-600">{errors.ref}</p>
                    )}
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
                    <div
                      ref={refs.region}
                      className="grid gap-3 grid-cols-3"
                    >
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
                    {errors.region && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.region}
                      </p>
                    )}

                    {/* 新增的 案件地址 與 案件名稱 輸入區塊 */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div ref={refs.caseAddress}>
                        <label className="block text-sm text-neutral-600 mb-1">
                          案件地址(必填){" "}
                          <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="請填寫案件地址"
                          className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                          value={form.caseAddress}
                          onChange={(e) =>
                            setF({ caseAddress: e.target.value })
                          }
                        />
                        {errors.caseAddress && (
                          <p className="mt-1 text-xs text-rose-600">
                            {errors.caseAddress}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">
                          案件名稱
                        </label>
                        <input
                          type="text"
                          placeholder="請填寫案件名稱"
                          className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                          value={form.caseName}
                          onChange={(e) => setF({ caseName: e.target.value })}
                        />
                      </div>
                    </div>
                  </Section>

                  <Section title="房屋現況 *">
                    <div
                      ref={refs.houseStatus}
                      className="grid gap-4 grid-cols-2 sm:grid-cols-3"
                    >
                      {[
                        "新成屋",
                        "毛胚屋",
                        "預售屋",
                        "中古屋",
                        "商業空間",
                        "自地自建",
                      ].map((v) => (
                        <label
                          key={v}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <input
                            type="radio"
                            name="houseStatus"
                            value={v}
                            checked={form.houseStatus === v}
                            onChange={(e) =>
                              setF({ houseStatus: e.target.value })
                            }
                            className="w-4 h-4 accent-neutral-900 cursor-pointer"
                          />
                          <span className="text-sm">{v}</span>
                        </label>
                      ))}
                    </div>
                    {errors.houseStatus && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.houseStatus}
                      </p>
                    )}
                  </Section>

                  <Section title="室內坪數 *">
                    <div
                      ref={refs.sizeRange}
                      className="grid gap-3 grid-cols-2"
                    >
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
                        ),
                      )}
                    </div>
                    {errors.sizeRange && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.sizeRange}
                      </p>
                    )}
                    <p className="text-xs text-rose-600">
                      設計費每坪 $6500 起（未稅），依實際設計坪數計算
                    </p>
                  </Section>

                  <Section
                    title="交屋與完工時間"
                    subtitle="若尚未確定，可直接點選選項"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <MonthScheduleField
                        label="交屋時間"
                        value={form.handoverTime}
                        onChange={(val) => setF({ handoverTime: val })}
                        quickOptions={["已交屋", "尚未確定"]}
                      />
                      <MonthScheduleField
                        label="預計完工時間"
                        value={form.completionTime}
                        onChange={(val) => setF({ completionTime: val })}
                        quickOptions={[
                          "3個月內",
                          "6個月內",
                          "1年內",
                          "尚未確定",
                        ]}
                      />
                    </div>
                  </Section>
                </>
              )}

              {/* STEP 3：設計需求 */}
              {step === 2 && (
                <>
                  <Section title="本次委託需求 *">
                    <div
                      ref={refs.need}
                      className="grid gap-3 grid-cols-1 sm:grid-cols-2"
                    >
                      {[
                        "室內全規劃",
                        "客變+室內全規劃",
                        "客變",
                        "純設計不含施工",

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
                    {errors.need && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.need}
                      </p>
                    )}
                  </Section>

                  {/* 預算範圍 + 協助貸款 */}
                  <section className="mb-8">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold tracking-wide">
                        預算範圍 <span className="text-rose-600">*</span>
                      </h3>
                    </div>

                    <div
                      ref={refs.budget}
                      className="grid gap-3 grid-cols-2"
                    >
                      {[
                        ["200-300", "200-300萬"],
                        ["301-400", "301-400萬"],
                        ["401-500", "401-500萬"],
                        ["501+", "501萬以上"],
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
                    {errors.budget && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.budget}
                      </p>
                    )}
                    <p className="text-xs text-rose-600 mt-1">
                      工程最低承接總額為 120 萬。即日起推出{" "}
                      <button
                        type="button"
                        onClick={() => setLoanOpen(true)}
                        className="rounded-xl underline text-blue-600 px-1 py-0.5"
                      >
                        裝修分期付款專案
                      </button>
                      ，最高 200 萬額度
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
                            setForm((f) => {
                              const included = f.styles.includes(val);
                              let next = included
                                ? f.styles.filter((x) => x !== val)
                                : [...f.styles, val];

                              if (val === "其他（請簡述）" && included) {
                                return { ...f, styles: next, otherStyle: "" };
                              }
                              return { ...f, styles: next };
                            })
                          }
                        >
                          {v}
                        </MultiChoiceCard>
                      ))}
                    </div>

                    {form.styles.includes("其他（請簡述）") && (
                      <div className="mt-3">
                        <label
                          htmlFor="other-style"
                          className="block text-sm text-neutral-600 mb-1"
                        >
                          請簡述您喜歡的風格
                        </label>
                        <input
                          id="other-style"
                          type="text"
                          value={form.otherStyle}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              otherStyle: e.target.value,
                            }))
                          }
                          placeholder="例如：日式無印＋溫潤木質＋留白"
                          className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-800"
                        />
                      </div>
                    )}
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

                  <div className="flex items-center gap-2" ref={refs.agree}>
                    <input
                      id="agree"
                      type="checkbox"
                      className="accent-black"
                      checked={form.agree}
                      onChange={(e) => setF({ agree: e.target.checked })}
                    />
                    <label htmlFor="agree" className="text-sm">
                      我已閱讀並同意：工程最低承接總額為 120 萬以上，設計費每坪
                      $6500（未稅）起。*
                    </label>
                  </div>
                  {errors.agree && (
                    <p className="mt-1 text-xs text-rose-600">{errors.agree}</p>
                  )}
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
                disabled={submitting}
                className="rounded-xl px-5  py-3 text-sm text-white bg-neutral-900 hover:opacity-90"
              >
                下一步 →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-5 py-3 text-sm text-white bg-neutral-900 hover:opacity-90"
              >
                {submitting ? "送出中…" : "送出表單"}
              </button>
            )}
          </div>

          {/* 後端訊息 */}
          {serverMsg && (
            <p className="mt-3 text-sm text-emerald-700">{serverMsg}</p>
          )}
          {serverErr && (
            <p className="mt-3 text-sm text-rose-600">{serverErr}</p>
          )}
        </form>
      </div>

      {/* Popup：協助貸款 & 流程說明（用 Portal 確保行動裝置也覆蓋最上層） */}
      <LoanHelpModal open={loanOpen} onClose={() => setLoanOpen(false)} />
      <FlowHelpModal open={flowOpen} onClose={() => setFlowOpen(false)} />
    </div>
  );
}
