// lib/qa.js
export const QA_REVALIDATE = 600; // ISR：10 分鐘

const UPSTREAM = "https://api.8distance.com/api/questions";

export async function fetchQA() {
  const res = await fetch(UPSTREAM, {
    headers: { Accept: "application/json" },
    next: { revalidate: QA_REVALIDATE }, // 交給 Next 做 ISR
    cache: "force-cache",
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);

  const json = await res.json();

  // ---- 問題（新版兩分類結構）----
  const groups =
    json?.questions && typeof json.questions === "object" && !Array.isArray(json.questions)
      ? json.questions
      : json?.data?.questions || {};

  const pick = (arr = []) =>
    (Array.isArray(arr) ? arr : [])
      .map((q, i) => ({
        q: q?.question ?? "",
        a: q?.answer ?? "",
        sort: Number.isFinite(Number(q?.sort_order)) ? Number(q.sort_order) : i,
      }))
      .sort((a, b) => a.sort - b.sort);

  const byCat = {
    design_process: pick(groups.design_process),
    renovation_knowledge: pick(groups.renovation_knowledge),
  };

  // ---- 上方三張圖（question_settings）----
  const settings = Array.isArray(json?.question_settings)
    ? json.question_settings
    : Array.isArray(json?.data?.question_settings)
    ? json.data.question_settings
    : [];

  // ---- meta ----
  const meta =
    json?.meta_data || json?.data?.meta_data || json?.questions?.meta_data || {};

  return { byCat, settings, meta };
}
