// app/works/[category]/page.jsx
export const runtime = "nodejs";
export const revalidate = 20; // ISR 10 分鐘
export const dynamic = "force-static";

import Client from "./client";

const API_ROOT = "https://api.8distance.com/api/works";
const SITE = "https://www.8distance.com";

/* ------------- utils ------------- */
const S = (v, d = "") => (v == null ? d : String(v));
const trim = (s) => S(s).trim();
const norm = (s) => trim(s).toLowerCase();

function tryDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

async function getJson(url) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** 從 /api/works 建立 slug->id 對照 */
async function resolveClassificationIdBySlug(slug) {
  if (/^\d+$/.test(String(slug))) return String(slug);

  try {
    const json = await getJson(API_ROOT);
    const list =
      (Array.isArray(json?.works_classifications) &&
        json.works_classifications) ||
      (Array.isArray(json?.classifications) && json.classifications) ||
      [];

    const s = norm(tryDecode(slug));

    // 1) 比對 url_slug
    let hit = list.find((c) => norm(c?.url_slug) === s);
    if (hit?.id != null) return String(hit.id);

    // 2) 比對 title/name
    hit = list.find((c) => norm(c?.title || c?.name) === s);
    if (hit?.id != null) return String(hit.id);

    // 3) 比對 portfolio group
    const pf = json?.works_portfolio || json?.works_portfolios || {};
    for (const [groupName, arr] of Object.entries(pf)) {
      if (norm(groupName) === s) {
        const first = Array.isArray(arr) ? arr[0] : null;
        if (first?.classification_id != null)
          return String(first.classification_id);
      }
    }
    return null;
  } catch {
    return null;
  }
}

/** 從分類回應裡把作品陣列抽出 */
function pickWorksArray(json) {
  const cands = [
    json?.works_portfolios,
    json?.works,
    json?.data?.works,
    json?.items,
    json?.works_list,
    Array.isArray(json) ? json : null,
  ].filter(Array.isArray);
  return cands[0] || [];
}

/** 顯示標題 */
function pickCategoryTitle(json, fallback) {
  const md = json?.meta_data || json?.metadata || {};
  const tMeta = trim(md?.title);
  if (tMeta) return tMeta;

  const c =
    json?.classification ||
    json?.category_info ||
    json?.category_meta ||
    json?.meta ||
    (json && typeof json === "object" ? json : null);

  const tFromObj = trim(
    (c && (c.title || c.name || c.category || c.classification_title)) ||
      json?.category ||
      json?.title ||
      json?.name,
  );

  return tFromObj || trim(fallback);
}

/** 卡片映射 */
function mapWork(row, idx, categorySlugRaw) {
  const sort =
    typeof row?.sort_order === "number"
      ? row.sort_order
      : Number.isFinite(Number(row?.sort_order))
        ? Number(row.sort_order)
        : idx + 1;

  const preferred =
    trim(row?.url_slug) ||
    trim(row?.name) ||
    trim(row?.title) ||
    (row?.id != null ? String(row.id) : "") ||
    String(sort);

  const workSlug = encodeURIComponent(preferred);
  const href = `/works/${categorySlugRaw}/${workSlug}`;

  return {
    id: row?.id ?? row?._id ?? `work-${idx}`,
    title: row?.name ?? row?.title ?? row?.project_title ?? "未命名作品",
    subtitle: row?.description ?? row?.subtitle ?? row?.summary ?? "",
    overlayTitle: row?.name ?? row?.title ?? "",
    overlaySubtitle: row?.description ?? "",
    image:
      row?.image_url ??
      row?.cover ??
      row?.cover_url ??
      row?.thumbnail ??
      "/images/project-01/project04.jpg",
    image_alt: row?.image_alt ?? null,
    image_title: row?.image_title ?? null,
    tag: row?.category ?? row?.type ?? "",
    sort,
    date: row?.date ?? row?.published_at ?? row?.created_at ?? "1970-01-01",
    href,
  };
}

/** 拉分類下的作品 */
async function fetchWorksInClassification(classificationId, categorySlugRaw) {
  const json = await getJson(
    `${API_ROOT}/classifications/${encodeURIComponent(classificationId)}`,
  );

  const itemsRaw = pickWorksArray(json);
  const items = itemsRaw.map((it, i) => mapWork(it, i, categorySlugRaw));

  items.sort((a, b) => {
    const as = Number(a.sort);
    const bs = Number(b.sort);
    const asNum = Number.isFinite(as);
    const bsNum = Number.isFinite(bs);
    if (asNum && bsNum) return as - bs;
    if (asNum && !bsNum) return -1;
    if (!asNum && bsNum) return 1;
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (isNaN(da) && isNaN(db)) return 0;
    if (isNaN(da)) return 1;
    if (isNaN(db)) return -1;
    return db - da;
  });

  const title = pickCategoryTitle(json, tryDecode(categorySlugRaw));
  return { title, items, raw: json };
}

/* ---------- Metadata ---------- */
export async function generateMetadata({ params }) {
  const category = params?.category || "";
  const canonical = `${SITE}/works/${category}`;

  const FALLBACK_IMAGE =
    "https://api.8distance.com/storage/uploads/works_classification/01K97QPPSM5EG1HM7MAC14B7SM.webp";

  const cid = await resolveClassificationIdBySlug(category);

  if (!cid) {
    const pretty = tryDecode(category);
    const title = `${pretty}｜作品列表｜捌程室內設計 8distance`;
    return {
      metadataBase: new URL(SITE),
      title,
      description: `${pretty} 的作品清單。`,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: { email: false, address: false, telephone: false },
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        siteName: "捌程室內設計 8distance",
        locale: "zh_TW",
        images: [{ url: FALLBACK_IMAGE, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", title, images: [FALLBACK_IMAGE] },
    };
  }

  try {
    const json = await getJson(
      `${API_ROOT}/classifications/${encodeURIComponent(cid)}`,
    );
    const md = json?.meta_data || json?.metadata || {};
    const catTitle =
      trim(md?.title) ||
      pickCategoryTitle(json, tryDecode(category)) ||
      "作品列表";
    const description = trim(md?.description) || `${catTitle} 的作品清單。`;
    const keywords = md?.key_word
      ? md.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : ["捌程室內設計", "8distance", "作品欣賞", catTitle];

    let pickedImage = null;
    const metaImg =
      md?.image ||
      json?.image_url ||
      json?.cover ||
      json?.cover_url ||
      json?.classification?.image_url;

    if (metaImg) {
      pickedImage = metaImg;
    }

    if (!pickedImage) {
      const worksList = pickWorksArray(json);
      const firstWorkWithImg = worksList.find(
        (w) => w.image_url || w.cover || w.thumbnail || w.cover_url,
      );
      if (firstWorkWithImg) {
        pickedImage =
          firstWorkWithImg.image_url ||
          firstWorkWithImg.cover ||
          firstWorkWithImg.thumbnail ||
          firstWorkWithImg.cover_url;
      }
    }

    const finalOgImage = pickedImage || FALLBACK_IMAGE;

    return {
      metadataBase: new URL(SITE),
      title: catTitle,
      description,
      keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: { email: false, address: false, telephone: false },
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: catTitle,
        description,
        siteName: "捌程室內設計 8distance",
        locale: "zh_TW",
        images: [
          { url: finalOgImage, width: 1200, height: 630, alt: catTitle },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: catTitle,
        description,
        images: [finalOgImage],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch {
    const pretty = tryDecode(category);
    const title = `${pretty}｜作品列表｜捌程室內設計 8distance`;
    return {
      metadataBase: new URL(SITE),
      title,
      description: `${pretty} 的作品清單。`,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: { email: false, address: false, telephone: false },
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        siteName: "捌程室內設計 8distance",
        locale: "zh_TW",
        images: [{ url: FALLBACK_IMAGE, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", title, images: [FALLBACK_IMAGE] },
    };
  }
}

/* ---------- Page ---------- */
export default async function Page({ params }) {
  const categorySlugRaw = params?.category || "";
  if (!categorySlugRaw) return <Client title="未分類" items={[]} />;

  let id = await resolveClassificationIdBySlug(categorySlugRaw);
  let result = { title: tryDecode(categorySlugRaw), items: [] };

  try {
    if (id) result = await fetchWorksInClassification(id, categorySlugRaw);
  } catch (e) {
    console.error("[/works/[category]] error:", e);
  }

  const { title, items } = result;

  const cleanSlug = encodeURIComponent(categorySlugRaw);
  const fullPageUrl = `${SITE}/works/${cleanSlug}`;

  /* ==========================================
     分類內頁專屬 JSON-LD 結構化資料 (陣列輸出法)
  ========================================== */

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "作品欣賞",
        item: `${SITE}/works`,
      },
      { "@type": "ListItem", position: 3, name: title, item: fullPageUrl },
    ],
  };

  const itemListJsonLd =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${title} 作品列表`,
          description: `瀏覽捌程室內設計的${title}精選案例。`,
          itemListElement: items.map((x, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}${x.href}`,
            name: x.title,
            image: x.image || undefined,
          })),
        }
      : null;

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${fullPageUrl}/#webpage`,
    url: fullPageUrl,
    name: `${title}｜作品欣賞｜捌程室內設計 8distance`,
    description: `${title} 的精選空間設計作品列表。`,
    isPartOf: { "@id": `${SITE}/#website` },
  };

  // 常見問題結構 (FAQPage)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "請問捌程室內設計的服務流程是什麼？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "我們的服務流程包含：線上預約諮詢、現場丈量、平面配置討論、設計合約簽訂、3D及施工圖面確認、工程報價與簽約、進場施工到最終完工交屋。",
        },
      },
      {
        "@type": "Question",
        name: "請問裝潢設計的費用與預算門檻是多少？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "本公司的工程最低承接總額為 120 萬以上，設計費每坪 $6500（未稅）起，實際費用會依照實際設計坪數與您溝通後提供準確報價。",
        },
      },
      {
        "@type": "Question",
        name: "你們有提供裝潢分期付款的服務嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "有的！我們與和潤企業攜手合作，推出最高 200 萬元額度的裝修分期付款專案，讓您輕鬆打造心目中的理想居住空間。",
        },
      },
    ],
  };

  const combinedJsonLd = [
    breadcrumbJsonLd,
    itemListJsonLd,
    collectionPageJsonLd,
    faqJsonLd,
  ].filter(Boolean);

  return (
    <main className="pt-20">
      {/* 使用官方推薦的最穩寫法：直接印出原生的 <script>，不加 strategy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />

      <h1 className="sr-only">{title}</h1>
      <Client title={title} items={items} />
    </main>
  );
}
