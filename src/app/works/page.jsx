// app/works/page.jsx
export const runtime = "nodejs";
export const revalidate = 600; // ISR：10 分鐘
export const dynamic = "force-static";

import Script from "next/script";
import WorksCategoryClient from "./client";

const API = "https://api.8distance.com/api/works";
const SITE = "https://www.8distance.com";

/* ---------- utils ---------- */
const S = (v, d = "") => (v == null ? d : String(v));
const trim = (s) => S(s).trim();

async function getJson(url) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** 從 /api/works 抽出「分類清單」：
 * 1) 優先 json.works_classifications / json.classifications
 * 2) 沒有就用 works_portfolio 的 category 群組推回分類
 */
function pickClassifications(json) {
  const list =
    (Array.isArray(json?.works_classifications) &&
      json.works_classifications) ||
    (Array.isArray(json?.classifications) && json.classifications) ||
    [];

  if (list.length) return list.map((c) => ({ ...c, _from: "classifications" }));

  // 從作品群組推回分類（fallback）
  const pf = json?.works_portfolio || json?.works_portfolios || {};
  const groups = [];
  for (const [catName, arr] of Object.entries(pf)) {
    const first = Array.isArray(arr) && arr.length ? arr[0] : null;
    groups.push({
      id: first?.classification_id ?? catName,
      title: catName,
      url_slug: catName,
      image_url: first?.image_url ?? "",
      image_alt: first?.image_alt ?? "",
      image_title: first?.image_title ?? "",
      _from: "portfolio_group",
    });
  }
  return groups;
}

/** 映射成最外層 Client 需要的 categories（包含後台 alt/title） */
function mapCategory(row) {
  const title =
    trim(row?.title || row?.name) || trim(row?.url_slug) || "未命名分類";
  const slug =
    trim(row?.url_slug) ||
    trim(row?.title || row?.name) ||
    String(row?.id ?? "category");

  return {
    id: row?.id ?? row?._id ?? slug,
    title,
    slug,
    cover:
      row?.image_url ||
      row?.cover ||
      row?.cover_url ||
      row?.thumb ||
      row?.coverImage ||
      "",
    alt: row?.image_alt || title,
    titleAttr: row?.image_title || title,
  };
}

async function fetchCategories() {
  try {
    const json = await getJson(API);
    const raw = pickClassifications(json);
    const categories = raw.map(mapCategory);
    return categories;
  } catch (e) {
    console.error("[/works] fetchCategories failed:", e);
    return [];
  }
}

/* ---------- Metadata：抓後台 meta_data ---------- */
export async function generateMetadata() {
  const ogImage =
    "https://api.8distance.com/storage/uploads/works_classification/01K97QPPSM5EG1HM7MAC14B7SM.webp";

  try {
    const json = await getJson(API);
    const md = json?.meta_data || json?.metadata || {};
    const baseTitle =
      trim(md?.title) || "作品欣賞｜捌程室內設計 8distance - 精選空間設計案例";
    const description =
      trim(md?.description) ||
      "以功能、動線與美學平衡為核心，呈現捌程室內設計的精選住宅、商業與老屋翻新空間作品。";
    const keywords = md?.key_word
      ? md.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : [
          "捌程室內設計",
          "室內設計作品",
          "商業空間設計",
          "住宅空間",
          "老屋翻新",
          "台中室內設計",
        ];

    const canonical = `${SITE}/works`;

    return {
      metadataBase: new URL(SITE),
      title: baseTitle,
      description,
      keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      alternates: { canonical },
      icons: { icon: "/images/favicon.ico" },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: canonical,
        siteName: "捌程室內設計 8distance",
        title: baseTitle,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: baseTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: baseTitle,
        description,
        images: [ogImage],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch {
    // 後台掛掉時的保底
    const canonical = `${SITE}/works`;
    const fallbackTitle = "作品欣賞｜捌程室內設計 8distance";
    const fallbackDesc =
      "以功能、動線與美學平衡為核心，呈現捌程室內設計的精選住宅、商業與老屋翻新空間作品。";

    return {
      metadataBase: new URL(SITE),
      title: fallbackTitle,
      description: fallbackDesc,
      alternates: { canonical },
      icons: { icon: "/images/favicon.ico" },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: canonical,
        siteName: "捌程室內設計 8distance",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: fallbackTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [ogImage],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  }
}

/* ---------- Page ---------- */
export default async function Page() {
  const categories = await fetchCategories();
  const pageUrl = `${SITE}/works`;

  /* ==========================================
     列表頁專屬 JSON-LD 結構化資料 (採用 Google 官方推薦)
  ========================================== */

  // 1. 麵包屑導覽 (BreadcrumbList)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: `${SITE}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "作品欣賞",
        item: pageUrl,
      },
    ],
  };

  // 2. 列表內容 (ItemList) - 讓搜尋引擎知道這裡有許多不同的分類
  const itemListJsonLd =
    categories.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "捌程室內設計作品分類",
          description: "瀏覽我們的精選住宅空間、商業空間與老屋翻新案例。",
          itemListElement: categories.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/works/${encodeURIComponent(c.slug)}`,
            name: c.title,
            image: c.cover || undefined,
          })),
        }
      : null;

  // 3. 網頁本身 (CollectionPage) - 定義這是一個「集合型」的作品頁面
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: "作品欣賞｜捌程室內設計 8distance",
    description:
      "以功能、動線與美學平衡為核心，呈現捌程室內設計的精選住宅、商業與老屋翻新空間作品。",
    isPartOf: {
      "@id": `${SITE}/#website`,
    },
  };

  return (
    <main className="">
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

      <h1 className="sr-only">作品分類｜捌程室內設計 8distance</h1>
      <WorksCategoryClient categories={categories} />
    </main>
  );
}
