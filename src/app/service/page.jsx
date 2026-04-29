// app/services/page.jsx
export const revalidate = 10; // ISR：10 秒再生
export const dynamic = "force-static"; // 靜態 + ISR

import Script from "next/script";
import Link from "next/link";
import ServiceClient from "./client";

const API = "https://api.8distance.com/api/processes";
const SITE = "https://8-distance.vercel.app";

/* ----------------- 小工具 ----------------- */
function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

// ✅ 改這裡：STEP 直接依 sort_order 顯示，缺值才退回 index+1
function stepLabelFromSort(sort, fallbackIndex) {
  const n = Number(sort);
  if (Number.isFinite(n) && n > 0) {
    return `STEP-${String(n).padStart(2, "0")}`;
  }
  return `STEP-${String(fallbackIndex + 1).padStart(2, "0")}`;
}

// 去 HTML（避免把標籤塞進 JSON-LD）
function stripHtml(input = "") {
  try {
    return String(input)
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+\n/g, "\n")
      .trim();
  } catch {
    return String(input || "");
  }
}
// 嘗試從文字中解析價格（台幣），支援「萬/萬元/元」，回傳 { price, currency } 或 null
function parseTwdPrice(text = "") {
  const s = stripHtml(text);
  // 先抓「x.x 萬」或「x 萬」
  const mWan = s.match(/(\d+(?:\.\d+)?)\s*萬(?:元)?/);
  if (mWan) {
    const num = parseFloat(mWan[1]);
    if (!Number.isNaN(num))
      return { price: Math.round(num * 10000), currency: "TWD" };
  }
  // 再抓「xxx,xxx 元」或「xxxx 元」
  const mYuan = s.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*元/);
  if (mYuan) {
    const num = parseInt(mYuan[1].replace(/,/g, ""), 10);
    if (!Number.isNaN(num)) return { price: num, currency: "TWD" };
  }
  return null;
}

/* ----------------- 後端 -> 前端資料映射 ----------------- */
function mapDesign(d, idx) {
  const items = safeArray(d?.procedures)
    .map((p) => (typeof p?.step === "string" ? p.step.trim() : ""))
    .filter(Boolean);

  return {
    key: `design-${idx}`,
    step: stepLabelFromSort(d?.sort_order, idx), // ← 直接吃 sort_order
    title: d?.title ?? "",
    desc: d?.description ?? "",
    items,
    imageUrl: d?.image_url ?? "",
    imageAlt: d?.image_alt || d?.title || "process-image",
  };
}

function mapCharge(c, idx) {
  const obj = {
    key: `charge-${idx}`,
    title: c?.title ?? "",
    // 後台 description 是主文案（常含「xx 萬元」）
    leadText: c?.description ?? "",
    // 後台 procedures 是補充說明（字串）
    subText: typeof c?.procedures === "string" ? c.procedures : "",
    imageUrl: c?.image_url ?? "",
    imageAlt: c?.image_alt || c?.title || "charge-image",
  };
  const price = parseTwdPrice(`${obj.leadText}\n${obj.subText}`);
  if (price) obj.parsedPrice = price; // { price, currency: 'TWD' }
  return obj;
}

/* ----------------- 取資料（容錯版） ----------------- */
async function getProcesses() {
  try {
    const res = await fetch(API, { next: { revalidate, tags: ["processes"] } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const root = (json && (json.processes || json.data || json)) || {};

    const rawDesigns = safeArray(root.process_designs);
    const rawCharges = safeArray(root.process_charges);

    const designs = rawDesigns
      .slice()
      .sort((a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0))
      .map(mapDesign);

    const charges = rawCharges
      .slice()
      .sort((a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0))
      .map(mapCharge);

    return {
      designs,
      charges,
      meta_data: json?.meta_data || root?.meta_data || {},
    };
  } catch (err) {
    console.error("Fetch /api/processes failed:", err);
    return { designs: [], charges: [], meta_data: {} };
  }
}

/* ----------------- ✅ 依後台產生 SEO Metadata ----------------- */
export async function generateMetadata() {
  try {
    const res = await fetch(API, { next: { revalidate } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // 兼容三種結構：根層 / data / processes
    const meta =
      json?.meta_data ||
      json?.data?.meta_data ||
      json?.processes?.meta_data ||
      {};

    const title = meta.title || "服務流程";
    const description =
      meta.description || "捌程室內設計的服務流程與收費標準。";
    const keywords = meta.key_word
      ? meta.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
      : ["服務流程", "收費標準", "室內設計", "8distance", "捌程設計"];

    const canonical = `${SITE}/services`;
    const siteName = "8distance 捌程室內設計";

    return {
      title,
      description,
      keywords,
      metadataBase: new URL(SITE),
      alternates: {
        canonical,
        languages: { "zh-TW": "/services", en: "/en/services" },
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName,
        type: "website",
        locale: "zh_TW",
        images: [{ url: "/images/og/8distance-services.jpg", alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/og/8distance-services.jpg"],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch (err) {
    console.error("generateMetadata /services failed:", err);
    return {
      title: "服務流程",
      description: "捌程室內設計的服務流程與收費標準。",
      keywords: ["服務流程", "收費標準", "室內設計", "8distance"],
      alternates: { canonical: `${SITE}/services` },
    };
  }
}

/* ----------------- Page ----------------- */
export default async function ServicesPage() {
  const { designs, charges } = await getProcesses();

  const pageUrl = `${SITE}/services`;

  // 1) BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "服務流程", item: pageUrl },
    ],
  };

  // 2) WebPage
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: "服務流程｜8distance 捌程室內設計",
    url: pageUrl,
    inLanguage: "zh-TW",
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    description:
      "捌程室內設計的服務流程與收費標準，涵蓋設計洽談、初步提案、細部設計、發包與監工等完整步驟。",
  };

  // 3) HowTo（把「設計流程」轉成步驟）
  const howToSteps =
    designs.length > 0
      ? designs.map((d, i) => {
          const step = {
            "@type": "HowToStep",
            position: i + 1,
            name: stripHtml(d.title || d.step || `步驟 ${i + 1}`),
            text: stripHtml(
              [d.desc, ...(d.items || [])].filter(Boolean).join("\n")
            ),
          };
          if (d.imageUrl) {
            step.image = {
              "@type": "ImageObject",
              url: d.imageUrl,
              caption: d.imageAlt || d.title || `步驟 ${i + 1}`,
            };
          }
          return step;
        })
      : [];

  const howToLd =
    howToSteps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "@id": `${pageUrl}#howto`,
          name: "捌程室內設計｜設計流程",
          description: "從需求訪談、初步提案、細部設計到施工監工的完整流程。",
          step: howToSteps,
        }
      : null;

  // 4) OfferCatalog（把「收費標準」轉成多個方案）
  const offers =
    charges.length > 0
      ? charges.map((c, i) => {
          const offer = {
            "@type": "Offer",
            name: stripHtml(c.title || `方案 ${i + 1}`),
            description: stripHtml(
              [c.leadText, c.subText].filter(Boolean).join("\n")
            ),
            // 如解析到價格就放入價格
            priceCurrency: c?.parsedPrice?.currency || undefined,
            price: c?.parsedPrice?.price || undefined,
            availability: "https://schema.org/InStock",
          };
          return offer;
        })
      : [];

  const offerCatalogLd =
    offers.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "@id": `${pageUrl}#offers`,
          name: "服務收費標準",
          itemListElement: offers,
        }
      : null;

  return (
    <main className="min-h-screen bg-white">
      {/* ✅ JSON-LD：在 SSR 階段以 beforeInteractive 注入 <head> */}
      <Script
        id="services-ld-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="services-ld-webpage"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      {offerCatalogLd && (
        <Script
          id="services-ld-offercatalog"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogLd) }}
        />
      )}
      {howToLd && (
        <Script
          id="services-ld-howto"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}

      <ServiceClient />
    </main>
  );
}
