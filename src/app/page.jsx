// app/home/page.jsx
export const revalidate = 60; // ISR：1 分鐘
export const dynamic = "force-static";
export const runtime = "nodejs";

import Client from "./home";
import { buildHeroSlides } from "@/lib/heroCarousel";

/* ----------------- generateMetadata ----------------- */
export async function generateMetadata() {
  const SITE_URL = "https://www.8distance.com";

  try {
    const res = await fetch("https://api.8distance.com/api/front", {
      next: { revalidate },
    });

    let title =
      "台中室內設計推薦｜捌程室內設計 8distance - 為您量身打造高品質居家美學";
    let description =
      "捌程室內設計深耕中部多年，專精住宅空間、商業空間及老屋翻新設計。我們致力於為您打造專屬風格空間與提供全案設計提案，讓美學與實用完美結合。";
    let keywords = [
      "室內設計",
      "台中室內設計",
      "景觀設計",
      "商業空間設計",
      "老屋翻新",
      "全案設計",
      "捌程室內設計",
    ];

    let ogImage =
      "https://api.8distance.com/storage/uploads/works_classification/01K97QQ2SP8W61E7W5QDWFMRZ0.webp";

    if (res.ok) {
      const json = await res.json();
      const md = json?.meta_data || {};

      title = md.title || title;
      description = md.description || description;
      keywords = md.key_word
        ? md.key_word.split(/\s*,\s*|\s+/).filter(Boolean)
        : keywords;

      if (json?.front_design_image?.[0]?.image_url) {
        ogImage = json.front_design_image[0].image_url;
      }
    }

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords,
      authors: [{ name: "捌程室內設計 8distance" }],
      creator: "捌程室內設計 8distance",
      publisher: "捌程室內設計 8distance",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      icons: {
        icon: "/images/favicon.ico",
        apple: "/images/apple-touch-icon.png",
      },
      openGraph: {
        type: "website",
        locale: "zh_TW",
        url: SITE_URL,
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
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: { canonical: SITE_URL },
    };
  } catch (e) {
    console.error("generateMetadata front fetch failed:", e);
    return {
      metadataBase: new URL("https://www.8distance.com"),
      title: "台中室內設計推薦｜捌程室內設計 8distance",
      description:
        "捌程室內設計深耕中部多年，專精住宅空間、商業空間及老屋翻新設計。",
      openGraph: {
        images: [
          {
            url: "https://api.8distance.com/storage/uploads/works_classification/01K97QQ2SP8W61E7W5QDWFMRZ0.webp",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }
}

/* ----------------- Page ----------------- */
export default async function Page() {
  const SITE_URL = "https://www.8distance.com";

  const [frontRes, worksRes] = await Promise.allSettled([
    fetch("https://api.8distance.com/api/front", {
      next: { revalidate },
    }).then((r) => (r.ok ? r.json() : {})),
    fetch("https://api.8distance.com/api/works", {
      next: { revalidate },
    }).then((r) => (r.ok ? r.json() : {})),
  ]);

  const frontJson = frontRes.status === "fulfilled" ? frontRes.value : {};
  const worksJson = worksRes.status === "fulfilled" ? worksRes.value : {};
  const md = frontJson?.meta_data || {};

  const specialPosts = [];

  const heroSlides = buildHeroSlides(frontJson);
  const firstMp4 = heroSlides.find((s) => s.type === "mp4");

  const heroMp4 =
    firstMp4?.url ||
    "https://video.wixstatic.com/video/b69ff1_143f9b33dccf44eea83413490c5a1713/1080p/mp4/file.mp4";
  const heroPoster =
    frontJson?.front_design_image?.[0]?.image_url ||
    "/images/index/b69ff1_8d67d2bc26bd45529c4848f4343ccecc~mv2.jpg.avif";

  const worksList =
    Array.isArray(worksJson?.works_classifications) &&
    worksJson.works_classifications.length > 0
      ? worksJson.works_classifications.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/works/${w.id}`,
          name: w.title || `作品分類 ${i + 1}`,
          image: w.image_url || undefined,
        }))
      : [];

  const pageTitle =
    md.title ||
    "台中室內設計推薦｜捌程室內設計 8distance - 為您量身打造高品質居家美學";
  const pageDescription =
    md.description ||
    "捌程室內設計深耕中部多年，專精住宅空間、商業空間及老屋翻新設計。我們致力於為您打造專屬風格空間與提供全案設計提案，讓美學與實用完美結合。";

  /* ==========================================
     進階 JSON-LD 結構化資料區 (採用陣列打包合併)
  ========================================== */

  // 1. 在地實體商家 (LocalBusiness) - 核心 SEO 標籤
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "捌程室內設計 8distance",
    url: SITE_URL,
    logo: `${SITE_URL}/images/favicon.ico`,
    image: [heroPoster],
    description: pageDescription,
    telephone: "+886-4-23720128",
    email: "8distancee@gmail.com",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "西區五權三街273號",
      addressLocality: "台中市",
      postalCode: "403",
      addressCountry: "TW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.138865,
      longitude: 120.659902,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/8distance/",
      "https://www.instagram.com/8distance_design/",
    ],
  };

  // 2. 網站整體結構 (WebSite)
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "捌程室內設計 8distance",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // 3. 網頁導覽標籤 (SiteNavigationElement) - 幫助生成子連結 (Sitelinks)
  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#sitenavigation`,
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "空間作品 Works",
        url: `${SITE_URL}/works`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "服務流程 Service",
        url: `${SITE_URL}/service`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "最新消息 News",
        url: `${SITE_URL}/news`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "聯絡我們 Contact",
        url: `${SITE_URL}/contact`,
      },
    ],
  };

  // 4. 網頁本身 (WebPage)
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  // 5. 影片物件 (VideoObject)
  const videoObjectJsonLd = heroMp4
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: pageTitle,
        description: pageDescription,
        thumbnailUrl: [heroPoster],
        uploadDate: new Date().toISOString(),
        contentUrl: heroMp4,
        embedUrl: SITE_URL,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      }
    : null;

  // 整理成單一陣列
  const combinedJsonLd = [
    localBusinessJsonLd,
    webSiteJsonLd,
    siteNavigationJsonLd,
    webPageJsonLd,
    videoObjectJsonLd,
  ].filter(Boolean);

  return (
    <>
      {/* ================= 官方推薦寫法：原生 script 標籤 ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />

      <Client
        specialPosts={specialPosts}
        frontData={frontJson}
        worksData={worksJson}
      />
    </>
  );
}
