// app/about/page.jsx
export const revalidate = 10;
export const dynamic = "force-static";
export const runtime = "nodejs";

import NextDynamic from "next/dynamic";
import Client from "./about";

const API = "https://api.8distance.com/api/about";
const SITE_URL = "https://www.8distance.com";

const LenisRoot = NextDynamic(() => import("../../components/LenisRoot"), {
  ssr: false,
});

/* ------------------------- 資料映射 ------------------------- */
function pickYear(dateStr) {
  if (!dateStr) return "";
  try {
    const iso = String(dateStr).replace(" ", "T");
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return String(d.getFullYear());
  } catch {}
  const m = String(dateStr).match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : "";
}

function mapHistoryForTimeline(h) {
  const rawTitle =
    h?.title ?? h?.name ?? h?.step_title ?? h?.heading ?? "未命名項目";
  const text = h?.description ?? h?.content ?? h?.text ?? h?.body ?? "";
  const img =
    h?.image_url ?? h?.image ?? h?.cover ?? h?.picture ?? h?.photo ?? null;
  const year = pickYear(h?.event_date);
  const title = year ? `${year}｜${rawTitle}` : rawTitle;
  return { title, text, img, year };
}

function mapAbout(a = {}) {
  return {
    title: a?.title ?? "關於捌程",
    descTW: a?.company_description_tw ?? "",
    descEN: a?.company_description_en ?? "",
    image: a?.image_url ?? "",
    imageAlt: a?.image_alt ?? "捌程室內設計 8distance",
    imageTitle: a?.image_title ?? "8distance",
    imageWidth: Number(a?.image_width ?? 0) || undefined,
    imageHeight: Number(a?.image_height ?? 0) || undefined,
  };
}

function mapTeam(t, idx) {
  return {
    id: idx + 1,
    position: t?.position ?? "",
    nameTW: t?.name_tw ?? "",
    nameEN: t?.name_en ?? "",
    motto: t?.motto ?? "",
    image: t?.image_url ?? "",
    imageAlt: t?.image_alt ?? "",
    imageTitle: t?.image_title ?? "",
    sort: Number(t?.sort_order ?? 0),
  };
}

async function getAboutData() {
  const res = await fetch(API, { next: { revalidate } });
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();

  const about = mapAbout((json?.abouts || [])[0] || {});
  const historiesForTimeline = Array.isArray(json?.about_histories)
    ? json.about_histories.map(mapHistoryForTimeline)
    : [];
  const teamsRaw = Array.isArray(json?.about_teams) ? json.about_teams : [];
  const teams = teamsRaw
    .map(mapTeam)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((t, i) => ({ ...t, id: i + 1 }));

  return { about, historiesForTimeline, teams };
}

/* --------------------- Metadata（從 API） --------------------- */
export async function generateMetadata() {
  try {
    const res = await fetch(API, { next: { revalidate } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const md = json?.meta_data || {};

    const title =
      md.title || "關於我們｜捌程室內設計 8distance - 專屬風格空間設計";
    const description =
      md.description ||
      "捌程專注於老屋翻新、商業空間與住宅設計，融合風格與機能，打造舒適與美感並存的空間。設計不是裝修，是把您的人生過得更有質感的開始。";
    const keywords = md.key_word
      ? md.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : [
          "捌程室內設計",
          "台中室內設計",
          "關於我們",
          "老屋翻新",
          "商業空間設計",
        ];

    const ogImage =
      json?.abouts?.[0]?.image_url || `${SITE_URL}/images/og-default.jpg`;

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      publisher: "捌程室內設計 8distance",
      formatDetection: { email: false, address: false, telephone: false },
      alternates: { canonical: `${SITE_URL}/about` },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: `${SITE_URL}/about`,
        siteName: "捌程室內設計 8distance",
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
      robots: { index: true, follow: true },
    };
  } catch {
    const fallbackTitle = "關於我們｜捌程室內設計 8distance";
    const fallbackDesc =
      "捌程專注於老屋翻新、商業空間與住宅設計，融合風格與機能，打造舒適與美感並存的空間。";

    return {
      metadataBase: new URL(SITE_URL),
      title: fallbackTitle,
      description: fallbackDesc,
      authors: [{ name: "捌程室內設計 8distance" }],
      alternates: { canonical: `${SITE_URL}/about` },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: `${SITE_URL}/about`,
        siteName: "捌程室內設計 8distance",
        title: fallbackTitle,
        description: fallbackDesc,
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
      },
      robots: { index: true, follow: true },
    };
  }
}

/* --------------------------- Page --------------------------- */
export default async function AboutPage() {
  let about, historiesForTimeline, teams;
  try {
    ({ about, historiesForTimeline, teams } = await getAboutData());
  } catch (e) {
    console.error("Fetch /api/about failed:", e);
    about = mapAbout({});
    historiesForTimeline = [];
    teams = [];
  }

  const pageUrl = `${SITE_URL}/about`;
  const orgId = `${SITE_URL}/#organization`;

  /* ==========================================
     JSON-LD 結構化資料打包區
  ========================================== */

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: "捌程室內設計 8distance",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/favicon.ico`,
    },
    description:
      "捌程專注於老屋翻新、商業空間與住宅設計，融合風格與機能，打造舒適與美感並存的空間。",
    sameAs: [
      "https://www.facebook.com/8distance/",
      "https://www.instagram.com/8distance_design/",
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "關於我們", item: pageUrl },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}/#webpage`,
    name: `${about.title || "關於我們"}｜捌程室內設計 8distance`,
    url: pageUrl,
    inLanguage: "zh-TW",
    isPartOf: { "@id": orgId },
    breadcrumb: { "@id": `${pageUrl}/#breadcrumb` },
    description:
      "關於捌程室內設計：專注於室內設計與老屋翻新、兼顧風格與機能的整合設計服務。",
    primaryImageOfPage: about.image
      ? { "@id": `${pageUrl}/#about-image` }
      : undefined,
  };

  const aboutImageLd = about.image
    ? {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": `${pageUrl}/#about-image`,
        url: about.image,
        caption:
          about.imageTitle || about.imageAlt || about.title || "關於捌程",
        representativeOfPage: true,
      }
    : null;

  const peopleNodes = teams.map((t) => ({
    "@type": "Person",
    "@id": `${pageUrl}/#person-${t.id}`,
    name: t.nameTW || t.nameEN || undefined,
    jobTitle: t.position || undefined,
    image: t.image || undefined,
    description: t.motto || undefined,
    worksFor: { "@id": orgId },
  }));

  const teamListLd =
    teams.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${pageUrl}/#team`,
          name: "捌程室內設計團隊成員",
          itemListElement: peopleNodes.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: p,
          })),
        }
      : null;

  const combinedJsonLd = [
    orgLd,
    breadcrumbLd,
    webPageLd,
    aboutImageLd,
    teamListLd,
  ].filter(Boolean);

  return (
    <>
      {/* 🌟 關鍵修正：將 JSON-LD 移到 LenisRoot 的外面！ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />

      <LenisRoot>
        <Client
          about={about}
          teams={teams}
          historiesForTimeline={historiesForTimeline}
        />
      </LenisRoot>
    </>
  );
}
