// app/blog/page.jsx
export const revalidate = 10; // ISR：10 秒
export const dynamic = "force-static";

import Client from "./client";

const API = "https://api.8distance.com/api/blogs";
const SITE_URL = "https://www.8distance.com";

/** * 🚀 終極 Slug 推導規則（解決 404 問題）
 * 1) 優先使用後台設定的 url_slug
 * 2) 絕對不使用 Title！如果沒設定 slug，強制使用「文章 ID」
 */
function deriveSlug(row) {
  const raw = String(row?.url_slug ?? row?.slug ?? "").trim();
  if (raw) return raw;

  return String(row?.id ?? "");
}

/* 後端 → 前端欄位映射 */
function mapBlog(row) {
  const id = row?.id ?? row?.sort_order ?? row?._id;
  const title = row?.title ?? `文章 #${id ?? "—"}`;
  const description = row?.description ?? "";
  const budgetWan =
    typeof row?.budget === "number"
      ? row.budget
      : row?.budget != null && !Number.isNaN(Number(row.budget))
        ? Number(row.budget)
        : null;
  const areaPing =
    row?.size_ping != null && !Number.isNaN(Number(row.size_ping))
      ? Number(row.size_ping)
      : null;

  const slug = deriveSlug(row);
  const link = `/blog/${encodeURIComponent(slug)}`;

  return {
    id: String(id ?? ""),
    title,
    description,
    city: row?.city ?? "",
    district: row?.district ?? "",
    budgetWan,
    areaPing,
    type: row?.case_type ?? "",
    style: row?.style ?? "",
    date:
      row?.date ??
      row?.published_at ??
      row?.created_at ??
      new Date().toISOString().slice(0, 10),
    image:
      row?.image_url ??
      "https://static.wixstatic.com/media/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg/v1/fill/w_740,h_459,al_c,q_80,enc_avif,quality_auto/b69ff1_f971c77f04fe413ab0d7ee9d7342b526~mv2.jpg",
    imageAlt: row?.image_alt ?? title,
    imageTitle: row?.image_title ?? "",
    link,
    slug,
  };
}

async function fetchBlogs() {
  try {
    const res = await fetch(API, { next: { revalidate } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();

    const arr = Array.isArray(json?.blogs) ? json.blogs : [];
    const banner =
      Array.isArray(json?.blog_banners) && json.blog_banners[0]
        ? {
            imageUrl: json.blog_banners[0].image_url,
            imageAlt: json.blog_banners[0].image_alt ?? "Blog Banner",
            imageTitle: json.blog_banners[0].image_title ?? "",
          }
        : null;

    const items = arr.map(mapBlog).filter((x) => x.id);
    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return { items, banner, raw: json };
  } catch (e) {
    console.error("Fetch /api/blogs failed:", e);
    return { items: [], banner: null, raw: null };
  }
}

/* 從後台抓取 metadata（列表頁） */
export async function generateMetadata() {
  try {
    const res = await fetch(API, { next: { revalidate } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();

    const meta =
      json?.meta_data || json?.data?.meta_data || json?.blogs?.meta_data || {};

    const title = meta.title || "設計誌｜捌程室內設計 8 Distance";
    const description =
      meta.description ||
      "小坪數設計、老屋翻新、商業空間的規劃技巧與實務案例解析，整理捌程室內設計的專欄文章與洞察。";
    const keywords = meta.key_word
      ? meta.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : [
          "設計誌",
          "室內設計",
          "老屋翻新",
          "小坪數",
          "商業空間",
          "8 Distance",
          "捌程",
        ];

    const ogImage =
      (Array.isArray(json?.blog_banners) && json.blog_banners[0]?.image_url) ||
      `${SITE_URL}/images/og/8distance-blog.jpg`;

    const canonical = `${SITE_URL}/blog`;
    const siteName = "捌程室內設計 8 Distance";

    return {
      title,
      description,
      keywords,
      metadataBase: new URL(SITE_URL),
      icons: { icon: "/images/favicon.ico" },
      alternates: { canonical },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: canonical,
        siteName,
        title,
        description,
        images: [{ url: ogImage, alt: title, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch (e) {
    console.error("generateMetadata /blog failed:", e);
    return {
      title: "設計誌｜捌程室內設計 8 Distance",
      description:
        "小坪數設計、老屋翻新、商業空間的規劃技巧與實務案例解析，整理捌程室內設計的專欄文章與洞察。",
      metadataBase: new URL(SITE_URL),
      alternates: { canonical: `${SITE_URL}/blog` },
      icons: { icon: "/images/favicon.ico" },
    };
  }
}

/* Page */
export default async function Page() {
  const { items, banner } = await fetchBlogs();
  const pageUrl = `${SITE_URL}/blog`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "設計誌", item: pageUrl },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: "設計誌｜捌程室內設計 8 Distance",
    description:
      "小坪數設計、老屋翻新、商業空間的規劃技巧與實務案例解析，整理捌程室內設計的專欄文章與洞察。",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const listLd =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "設計誌文章列表",
          itemListElement: items.map((x, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: x.link?.startsWith("http") ? x.link : `${SITE_URL}${x.link}`,
            name: x.title,
          })),
        }
      : null;

  const combinedJsonLd = [breadcrumbLd, collectionPageLd, listLd].filter(
    Boolean,
  );

  return (
    <main>
      <h1 className="sr-only">設計誌</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />
      <Client items={items} banner={banner} />
    </main>
  );
}
