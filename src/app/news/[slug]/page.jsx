// app/news/[slug]/page.jsx
export const runtime = "nodejs";
export const revalidate = 60; // ISR（單篇仍可快取）
export const dynamic = "force-dynamic"; // 讓 slug 變更能即時反映

import Home from "./client";
import { notFound, permanentRedirect } from "next/navigation";
import Head from "next/head";
import Script from "next/script";

const API_BASE = "https://api.8distance.com/api/news";

/* ---------- 站點 / 圖片補全（供 JSON-LD 用） ---------- */
const SITE_ORIGIN = "https://www.8distance.com";
const API_HOST = "https://api.8distance.com";
function absolutizeUrl(u = "") {
  const s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  if (s.startsWith("/")) return API_HOST + s;
  return API_HOST + "/" + s.replace(/^\.?\//, "");
}

/* -------------------- helpers -------------------- */
const trim = (s) => (typeof s === "string" ? s.trim() : "");
const norm = (s) => trim(s).toLowerCase();
const decodeOnce = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** 後台 HTML 編輯器欄位（custom 模板會用到） */
function pickHtmlFromEditor(n = {}) {
  return (
    n.html ||
    n.html_content ||
    n.content_html ||
    n.editor_html ||
    n.body_html ||
    n.description || // 有些後台直接把 HTML 放在 description
    n.content ||
    n.intro ||
    ""
  );
}

/** 去除 HTML 標籤，縮成單行摘要 */
function stripHtmlToText(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 列表：用 no-store 避免 slug 更新時踩到舊快取 */
async function fetchNewsList() {
  const res = await fetch(API_BASE, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return (
    (Array.isArray(json?.news) && json.news) ||
    (Array.isArray(json?.data) && json.data) ||
    (Array.isArray(json) && json) ||
    []
  );
}

/** 以 id 取單篇：單篇可走 ISR */
async function fetchNewsById(id) {
  const res = await fetch(`${API_BASE}/${id}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // 形狀：{ news: {...}, meta_data?: {...} }
}

/** 從單篇 payload 取出「最終可用的 meta（後台可覆蓋）」 */
function extractMetaForPage(payload, requestedSlug) {
  const n = payload?.news ?? payload;
  const md = payload?.meta_data || n?.metadata || {};
  const isCustom =
    String(n?.template_type || "")
      .trim()
      .toLowerCase() === "custom";

  const title =
    trim(md?.title) ||
    trim(n?.title) ||
    trim(n?.award_name_tw) ||
    trim(n?.work_name) ||
    (requestedSlug
      ? `${requestedSlug}｜捌程室內設計`
      : "最新動態｜捌程室內設計");

  const htmlText = isCustom ? stripHtmlToText(pickHtmlFromEditor(n)) : "";

  const description =
    trim(md?.description) ||
    (isCustom && htmlText) ||
    trim(n?.description) ||
    trim(n?.intro) ||
    trim(n?.award_name_en) ||
    trim(n?.award_name_tw) ||
    title;

  const keywords =
    trim(md?.key_word) || "最新動態, 捌程室內設計, 台中室內設計, 8distance";

  const image =
    n?.detail_image_url ||
    n?.image_url ||
    (Array.isArray(n?.award_images) && n.award_images[0]?.image_url) ||
    undefined;

  return { title, description, keywords, image };
}

/* ----------------- ✅ generateMetadata ----------------- */
export async function generateMetadata({ params }) {
  const raw = params?.slug || "";
  if (!raw) return {};

  // 純數字 id
  if (/^\d+$/.test(raw)) {
    try {
      const payload = await fetchNewsById(raw);
      const n = payload?.news;
      if (!n) return {};
      const canonicalSlug = trim(n?.url_slug) || trim(n?.work_name) || raw;
      const meta = extractMetaForPage(payload, canonicalSlug);
      const canonical = `${SITE_ORIGIN}/news/${encodeURIComponent(
        canonicalSlug,
      )}`;
      return {
        metadataBase: new URL(SITE_ORIGIN),
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        authors: [{ name: "捌程室內設計 8distance" }],
        publisher: "捌程室內設計 8distance",
        alternates: { canonical },
        openGraph: {
          title: meta.title,
          description: meta.description,
          url: canonical,
          siteName: "捌程室內設計 8distance",
          type: "article",
          images: meta.image ? [{ url: absolutizeUrl(meta.image) }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: meta.title,
          description: meta.description,
          images: meta.image ? [absolutizeUrl(meta.image)] : undefined,
        },
        robots: { index: true, follow: true, "max-image-preview": "large" },
      };
    } catch {
      return {};
    }
  }

  // 文字 slug
  try {
    const list = await fetchNewsList();
    const match = list.find((it) => {
      const w = norm(trim(it?.work_name));
      const u = norm(trim(it?.url_slug));
      const s = norm(decodeOnce(raw));
      return w === s || u === s;
    });
    if (!match?.id) return {};
    const payload = await fetchNewsById(match.id);
    const n = payload?.news;
    if (!n) return {};
    const canonicalSlug = trim(n?.url_slug) || trim(n?.work_name) || raw;
    const meta = extractMetaForPage(payload, canonicalSlug);
    const canonical = `${SITE_ORIGIN}/news/${encodeURIComponent(
      canonicalSlug,
    )}`;
    return {
      metadataBase: new URL(SITE_ORIGIN),
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      alternates: { canonical },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: canonical,
        siteName: "捌程室內設計 8distance",
        type: "article",
        images: meta.image ? [{ url: absolutizeUrl(meta.image) }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
        images: meta.image ? [absolutizeUrl(meta.image)] : undefined,
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch {
    return {};
  }
}

/* ----------------- 🔧 JSON-LD helpers ----------------- */
function collectNewsImages(n = {}) {
  const out = new Set();
  const push = (u) => {
    const abs = absolutizeUrl(u);
    if (abs) out.add(abs);
  };
  push(n.detail_image_url);
  push(n.image_url);
  push(n.cover_image_url);
  if (Array.isArray(n.award_images))
    n.award_images.forEach((it) => push(it?.image_url));
  return Array.from(out);
}

function plainDescription(n = {}, meta = {}) {
  const isCustom =
    String(n?.template_type || "")
      .trim()
      .toLowerCase() === "custom";
  if (isCustom) {
    const html = pickHtmlFromEditor(n);
    const text = stripHtmlToText(html);
    if (text) return text.slice(0, 1000);
  }
  const raw =
    trim(meta?.description) ||
    trim(n.description) ||
    trim(n.intro) ||
    trim(n.award_name_en) ||
    trim(n.award_name_tw) ||
    trim(n.title) ||
    "";
  return String(raw).replace(/\s+/g, " ").slice(0, 1000);
}

/* ====== 渲染 custom 的純 HTML 內容（無灰底） ====== */
function renderCustomBody(newsObj) {
  const html = pickHtmlFromEditor(newsObj);
  return (
    // 只留內容區塊，背景透明；paddingTop 140 取代舊頂部灰色區
    <section
      className="max-w-[1300px] px-6 mx-auto py-10 bg-transparent"
      style={{ paddingTop: 140 }}
    >
      <article
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

/* ----------------------- Page ----------------------- */
export default async function Page({ params }) {
  const rawSlug = params?.slug;
  if (!rawSlug) return notFound();

  // 1) 若 slug 為數字 id → 直接抓資料
  if (/^\d+$/.test(rawSlug)) {
    const payload = await fetchNewsById(rawSlug).catch(() => null);
    const newsObj = payload?.news;
    if (!newsObj) return notFound();

    const canonical = trim(newsObj?.url_slug) || trim(newsObj?.work_name);
    const requested = decodeOnce(rawSlug);
    if (canonical && norm(canonical) !== norm(requested)) {
      return permanentRedirect(`/news/${encodeURIComponent(canonical)}`);
    }

    /* ===== JSON-LD ===== */
    const slug = canonical || String(newsObj?.id || rawSlug);
    const url = `${SITE_ORIGIN}/news/${encodeURIComponent(slug)}`;
    const images = collectNewsImages(newsObj);
    const meta = payload?.meta_data || newsObj?.metadata || {};
    const headline =
      trim(meta?.title) ||
      trim(newsObj?.title) ||
      trim(newsObj?.award_name_tw) ||
      trim(newsObj?.work_name) ||
      slug;
    const description = plainDescription(newsObj, meta);
    const datePublished =
      newsObj?.publishISO || newsObj?.publish_date || newsObj?.date || null;
    const dateModified =
      newsObj?.updated_at || newsObj?.modified_at || datePublished || null;

    const newsLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline,
      description,
      image: images.length ? images : undefined,
      datePublished: datePublished || undefined,
      dateModified: dateModified || undefined,
      author: {
        "@type": "Organization",
        name: "捌程室內設計 8distance",
        url: SITE_ORIGIN,
      },
      publisher: {
        "@type": "Organization",
        name: "捌程室內設計 8distance",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/images/favicon.ico`,
        },
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: `${SITE_ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "最新動態",
          item: `${SITE_ORIGIN}/news`,
        },
        { "@type": "ListItem", position: 3, name: headline, item: url },
      ],
    };

    const isCustom =
      String(newsObj?.template_type || "")
        .trim()
        .toLowerCase() === "custom";

    return (
      <>
        <Head />
        <Script
          id="ld-news-article"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsLd) }}
        />
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        {isCustom ? renderCustomBody(newsObj) : <Home work={newsObj} />}
      </>
    );
  }

  // 2) 文字 slug → 先找 id
  const list = await fetchNewsList().catch(() => []);
  const found = list.find((it) => {
    const w = norm(trim(it?.work_name));
    const u = norm(trim(it?.url_slug));
    const s = norm(decodeOnce(rawSlug));
    return w === s || u === s;
  });
  if (!found?.id) return notFound();

  const payload = await fetchNewsById(found.id).catch(() => null);
  const newsObj = payload?.news;
  if (!newsObj) return notFound();

  const canonical = trim(newsObj?.url_slug) || trim(newsObj?.work_name);
  const requested = decodeOnce(rawSlug);
  if (canonical && norm(canonical) !== norm(requested)) {
    return permanentRedirect(`/news/${encodeURIComponent(canonical)}`);
  }

  /* ===== JSON-LD（slug 版） ===== */
  const slug = canonical || String(newsObj?.id || requested);
  const url = `${SITE_ORIGIN}/news/${encodeURIComponent(slug)}`;
  const images = collectNewsImages(newsObj);
  const meta = payload?.meta_data || newsObj?.metadata || {};
  const headline =
    trim(meta?.title) ||
    trim(newsObj?.title) ||
    trim(newsObj?.award_name_tw) ||
    trim(newsObj?.work_name) ||
    slug;
  const description = plainDescription(newsObj, meta);
  const datePublished =
    newsObj?.publishISO || newsObj?.publish_date || newsObj?.date || null;
  const dateModified =
    newsObj?.updated_at || newsObj?.modified_at || datePublished || null;

  const newsLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    description,
    image: images.length ? images : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || undefined,
    author: {
      "@type": "Organization",
      name: "捌程室內設計 8distance",
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "捌程室內設計 8distance",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/images/favicon.ico`,
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "最新動態",
        item: `${SITE_ORIGIN}/news`,
      },
      { "@type": "ListItem", position: 3, name: headline, item: url },
    ],
  };

  const isCustom =
    String(newsObj?.template_type || "")
      .trim()
      .toLowerCase() === "custom";

  return (
    <>
      <Head />
      <Script
        id="ld-news-article"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {isCustom ? renderCustomBody(newsObj) : <Home work={newsObj} />}
    </>
  );
}
