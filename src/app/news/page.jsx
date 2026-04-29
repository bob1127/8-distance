// app/news/page.jsx
import NewsClient from "./client";
import Script from "next/script";

export const runtime = "nodejs";
export const revalidate = 60; // ISR：1 分鐘
export const dynamic = "force-static"; // 靜態輸出 + 允許再生

const API = "https://api.8distance.com/api/news";
const SITE_URL = "https://www.8distance.com";

/* ----------------- 小工具 ----------------- */
function isFiniteNum(n) {
  return Number.isFinite(Number(n));
}

/** 安全抓取（預設 5 秒 timeout） */
async function getJsonWithTimeout(url, { timeout = 5000 } = {}) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

/** 轉 YYYY.MM.DD（若不可解析就回傳空字串） */
function toDisplayDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** 取陣列根（相容 {news} / {data} / 直接陣列） */
function pickArray(json) {
  const root = (json && (json.news || json.data || json)) ?? [];
  return Array.isArray(root) ? root : [];
}

/** 建立 slug：優先 url_slug，否則 work_name；回傳去頭尾空白的字串 */
function buildSlug(it) {
  const a = typeof it?.url_slug === "string" ? it.url_slug.trim() : "";
  const b = typeof it?.work_name === "string" ? it.work_name.trim() : "";
  return a || b || "";
}

/** 預設 href（給 fallback），實際前端會依 slug/work_name 再產一次 */
function buildHrefFallback(it) {
  const slug = buildSlug(it);
  if (slug) return `/news/${encodeURIComponent(slug)}`;
  if (isFiniteNum(it?.sort_order)) return `/news/${Number(it.sort_order)}`;
  if (it?.id != null) return `/news/${it.id}`;
  return "#";
}

/** 後端 -> 前端（給 NewsClient）的映射 */
function mapNewsList(json) {
  const arr = pickArray(json);

  return arr.map((it) => {
    const title =
      it?.title ?? it?.award_name_tw ?? it?.work_name ?? "未命名文章";
    const img = it?.image_url || it?.cover_image_url || it?.cover_url || "";
    const alt = it?.image_alt || title || "news";
    const dateRaw =
      it?.publish_date || it?.published_at || it?.date || it?.created_at || "";
    const workName = it?.work_name || it?.project_name || "";
    const slug = buildSlug(it);

    return {
      id: it?.id,
      slug,
      work_name: workName,
      title,
      titleAttr: it?.image_title || title || "",
      img,
      alt,
      desc: it?.intro || it?.description || it?.summary || it?.content || "",
      date: toDisplayDate(dateRaw),
      publishISO: dateRaw || "",
      href: buildHrefFallback(it),
      work: workName,
    };
  });
}

/* ----------------- 取清單 ----------------- */
async function getList() {
  try {
    const json = await getJsonWithTimeout(API, { timeout: 5000 });
    return mapNewsList(json);
  } catch (e) {
    console.error("Fetch /api/news failed:", e);
    return [];
  }
}

/* ----------------- ✅ generateMetadata ----------------- */
export async function generateMetadata() {
  try {
    const json = await getJsonWithTimeout(API, { timeout: 5000 });
    const meta = json?.meta_data || {};

    const title = meta.title || "最新動態｜捌程室內設計 8distance";
    const description =
      meta.description ||
      "隨時掌握捌程室內設計的最新消息、設計獲獎紀錄、媒體報導與公司動態。";
    const keywords = meta.key_word
      ? meta.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : ["捌程室內設計", "最新動態", "獲獎紀錄", "媒體報導", "台中室內設計"];

    const ogImage =
      json?.data?.[0]?.image_url || `${SITE_URL}/images/og/8distance-news.jpg`;

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: `${SITE_URL}/news`,
        siteName: "捌程室內設計 8distance",
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      alternates: { canonical: `${SITE_URL}/news` },
    };
  } catch (e) {
    console.error("generateMetadata /news failed:", e);
    return {
      metadataBase: new URL(SITE_URL),
      title: "最新動態｜捌程室內設計 8distance",
      description:
        "隨時掌握捌程室內設計的最新消息、設計獲獎紀錄、媒體報導與公司動態。",
      alternates: { canonical: `${SITE_URL}/news` },
    };
  }
}

/* ----------------- Page ----------------- */
export default async function Page() {
  const items = await getList();

  /* ==========================================
     列表頁專屬 JSON-LD 結構化資料 (採用 Google 官方推薦)
  ========================================== */

  // 1. 麵包屑導覽 (BreadcrumbList) - 讓 Google 了解此頁面在網站層級中的位置
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "最新動態",
        item: `${SITE_URL}/news`,
      },
    ],
  };

  // 2. 列表內容 (ItemList) - 將 API 獲取的文章列表建立結構，增加出現在特定搜尋輪播的機會
  const itemListJsonLd =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "捌程室內設計最新動態列表",
          description: "捌程室內設計的最新消息與媒體報導。",
          itemListElement: items.slice(0, 10).map((item, index) => ({
            // 建議最多輸出前 10~20 筆作為核心列表即可
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}${item.href}`,
            name: item.title,
            image: item.img || undefined,
          })),
        }
      : null;

  // 3. 網頁本身 (CollectionPage) - 定義這是一個「集合型」的頁面
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/news/#webpage`,
    url: `${SITE_URL}/news`,
    name: "最新動態｜捌程室內設計 8distance",
    description:
      "隨時掌握捌程室內設計的最新消息、設計獲獎紀錄、媒體報導與公司動態。",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };

  return (
    <>
      {/* ================= JSON-LD 注入區塊 ================= */}
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd && (
        <Script
          id="ld-itemlist"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <Script
        id="ld-collectionpage"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd),
        }}
      />

      {/* ================= 頁面實體 ================= */}
      <NewsClient items={items} />
    </>
  );
}
