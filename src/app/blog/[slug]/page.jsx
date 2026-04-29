// app/blog/[slug]/page.jsx
export const revalidate = 20; // ISR：20 秒

import Client from "./client";
import { notFound, permanentRedirect } from "next/navigation";

const API = "https://api.8distance.com/api/blogs";
const SITE_URL = "https://www.8distance.com";

/* ---------- 只給 Server 用的補全 ---------- */
const API_HOST = "https://api.8distance.com";
function absolutizeUrl(u = "") {
  const s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  if (s.startsWith("/")) return API_HOST + s;
  return API_HOST + "/" + s.replace(/^\.?\//, "");
}

/* ---------- 通用工具 ---------- */
/**
 * 🚀 終極 Slug 推導規則 (必須跟列表頁一致)
 */
function deriveSlug(row) {
  const raw = String(row?.url_slug ?? row?.slug ?? "").trim();
  if (raw) return raw;

  return String(row?.id ?? "");
}

const toNumOrNull = (v) =>
  v === null || v === undefined || v === "" ? null : Number(v);
const toStr = (v, d = "") => (v == null ? d : String(v));

function mapBlogBase(row) {
  const id = row?.id ?? row?.sort_order ?? row?._id;
  const title = row?.title ?? (id ? `文章 #${id}` : "");
  const description = toStr(row?.description);
  const city = toStr(row?.city);
  const district = toStr(row?.district);
  const budgetWan = toNumOrNull(row?.budget);
  const areaPing = toNumOrNull(row?.size_ping);
  const type = toStr(row?.case_type);

  const styleRaw = row?.style;
  const style = Array.isArray(styleRaw)
    ? styleRaw.filter(Boolean).join("、")
    : toStr(styleRaw);

  const imageRaw = toStr(row?.image_url || row?.image);
  const image = imageRaw ? absolutizeUrl(imageRaw) : "";
  const imageAlt = toStr(row?.image_alt, title || "");
  const imageTitle = toStr(row?.image_title, title || "");
  const date =
    toStr(row?.date) ||
    toStr(row?.published_at) ||
    toStr(row?.created_at) ||
    new Date().toISOString().slice(0, 10);

  return {
    id: String(id ?? ""),
    slug: deriveSlug(row),
    title,
    description,
    city,
    district,
    budgetWan,
    areaPing,
    type,
    style,
    image,
    imageAlt,
    imageTitle,
    date,
  };
}

async function fetchList() {
  const res = await fetch(API, { next: { revalidate } });
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  return Array.isArray(json?.blogs) ? json.blogs : [];
}

async function fetchDetail(id) {
  const res = await fetch(`${API}/${encodeURIComponent(String(id))}`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/* ---------- JSON-LD 輔助 ---------- */
function extractImagesFromDetails(details = []) {
  const imgs = [];
  const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  details.forEach((sec) => {
    const html = String(sec?.html_content || "");
    let m;
    while ((m = imgRe.exec(html))) {
      const abs = absolutizeUrl(m[1]);
      if (abs && !imgs.includes(abs)) imgs.push(abs);
    }
  });
  return imgs;
}

function htmlToPlainText(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(details = []) {
  for (const sec of details) {
    const t = htmlToPlainText(sec?.html_content || "");
    if (t) return t.slice(0, 1000);
  }
  return "";
}

const clean = (s) => toStr(s).replace(/\s+/g, " ").trim();
const splitKeywords = (s) =>
  clean(s)
    .split(/[,\n\r\t、\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);

/* ---------- Metadata ---------- */
export async function generateMetadata({ params }) {
  const slugParam = safeDecode(String(params.slug ?? "").trim());
  try {
    const list = await fetchList();

    // 🌟 自動相容找尋：找 ID -> 找 Slug -> 找舊的 Title
    const row =
      list.find((r) => String(r?.id) === slugParam) ||
      list.find((r) => deriveSlug(r) === slugParam) ||
      list.find((r) => String(r?.title).trim() === slugParam);

    if (!row) return { title: "文章未找到" };

    let detailJson = null;
    try {
      detailJson = await fetchDetail(row.id);
    } catch {}
    const blogDetail = detailJson?.blog || null;
    const meta = detailJson?.meta_data || blogDetail?.meta_data || null;

    const merged = { ...row, ...(blogDetail || {}) };
    const base = mapBlogBase(merged);

    const metaTitle = clean(meta?.title) || base.title || "設計誌";
    const metaDesc =
      clean(meta?.description) ||
      clean(
        base.description ||
          `${base.city ?? ""} ${base.district ?? ""}｜${base.type ?? ""}/${
            base.style ?? ""
          }`,
      );
    const keywords = meta?.key_word ? splitKeywords(meta.key_word) : undefined;

    const url = `${SITE_URL}/blog/${encodeURIComponent(base.slug)}`;

    return {
      title: metaTitle,
      description: metaDesc,
      keywords,
      metadataBase: new URL(SITE_URL),
      alternates: { canonical: url },
      robots: { index: true, follow: true, "max-image-preview": "large" },
      openGraph: {
        type: "article",
        url,
        siteName: "捌程室內設計 8 Distance",
        title: metaTitle,
        description: metaDesc,
        images: base.image
          ? [
              {
                url: absolutizeUrl(base.image),
                alt: base.imageAlt || metaTitle,
              },
            ]
          : undefined,
        locale: "zh_TW",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDesc,
        images: base.image ? [absolutizeUrl(base.image)] : undefined,
      },
    };
  } catch (e) {
    console.error("generateMetadata /blog/[slug] failed:", e);
    return { title: "設計誌" };
  }
}

/* ---------- 主頁面 ---------- */
export default async function Page({ params }) {
  const slugParam = safeDecode(String(params.slug ?? "").trim());
  const list = await fetchList();

  // 🌟 自動相容找尋
  const row =
    list.find((r) => String(r?.id) === slugParam) ||
    list.find((r) => deriveSlug(r) === slugParam) ||
    list.find((r) => String(r?.title).trim() === slugParam);

  if (!row) notFound();

  // 🚀 關鍵 301 轉址機制：
  // 只要發現訪客是從「舊標題網址」進來的，瞬間轉回正確的 ID 或 Slug 網址！
  const correctSlug = deriveSlug(row);
  if (slugParam !== correctSlug) {
    return permanentRedirect(`/blog/${encodeURIComponent(correctSlug)}`);
  }

  let detailJson = null;
  try {
    detailJson = await fetchDetail(row.id);
  } catch {}

  const blogDetail = detailJson?.blog || null;
  const meta = detailJson?.meta_data || blogDetail?.meta_data || null;

  const base = mapBlogBase({ ...row, ...(blogDetail || {}) });
  const details = Array.isArray(blogDetail?.details)
    ? blogDetail.details
        .slice()
        .sort(
          (a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0),
        )
        .map((d, i) => ({
          key: d?.key ?? i,
          title: toStr(d?.title),
          html_content: toStr(d?.html_content),
        }))
    : [];

  const post = { ...base, details };

  // ====== JSON-LD 陣列化輸出 ======
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const detailImages = extractImagesFromDetails(details);
  const images = [
    ...(post.image ? [absolutizeUrl(post.image)] : []),
    ...detailImages,
  ];
  const fallbackDesc =
    firstParagraph(details) ||
    `${post.city ?? ""} ${post.district ?? ""}｜${post.type ?? ""}/${
      post.style ?? ""
    }`;
  const datePublished = post.date;
  const dateModified =
    blogDetail?.updated_at || blogDetail?.modified_at || post.date;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: clean(meta?.title) || post.title,
    description: clean(meta?.description) || post.description || fallbackDesc,
    image: images.length ? images : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || undefined,
    author: { "@type": "Organization", name: "捌程室內設計 8 Distance" },
    publisher: {
      "@type": "Organization",
      name: "捌程室內設計 8 Distance",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/favicon.ico`,
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
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "設計誌",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "捌程室內設計 8 Distance",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/favicon.ico`,
    sameAs: [
      "https://www.facebook.com/8distance",
      "https://www.instagram.com/8distance",
    ],
  };

  const combinedJsonLd = [articleLd, breadcrumbLd, orgLd].filter(Boolean);

  return (
    <main>
      <h1 className="sr-only">{post.title}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />
      <Client post={post} />
    </main>
  );
}
