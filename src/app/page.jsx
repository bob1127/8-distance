// /app/page.jsx 或 app/home/page.jsx
import Client from "./home";
import Script from "next/script";

export const metadata = {
  title:
    "捌程景觀及室內設計8distance｜景觀設計的專業公司｜專屬風格空間與全案設計提案",
  description:
    "8Distance 捌程景觀及室內設計,是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合,每個空間會因為不同的人所屬,而有著獨有的設計。",
  keywords: [
    "小坪數室內設計",
    "輕裝潢方案",
    "寬越設計",
    "全案設計",
    "預算裝潢推薦",
    "高端室內設計",
    "空間風格規劃",
  ],
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://8-distance.vercel.app",
    siteName: "寬越設計 Kuankoshi Design",
    title:
      "捌程景觀及室內設計8distance｜景觀設計的專業公司｜專屬風格空間與全案設計提案",
    description:
      "8Distance 捌程景觀及室內設計,是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合,每個空間會因為不同的人所屬,而有著獨有的設計。",
    images: [
      {
        url: "https://8-distance.vercel.app/images/index/住宅空間-程宅.webp",
        width: 1200,
        height: 630,
        alt: "寬越設計室內空間封面",
      },
    ],
  },
  alternates: {
    canonical: "https://8-distance.vercel.app",
  },
};

export const revalidate = 60;

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "捌程景觀及室內設計8distance｜景觀設計的專業公司｜專屬風格空間與全案設計提案",
  url: "https://8-distance.vercel.app/",
  description:
    "8Distance 捌程景觀及室內設計,是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合,每個空間會因為不同的人所屬,而有著獨有的設計。",
  publisher: {
    "@type": "Organization",
    name: "寬越設計",
    url: "https://8-distance.vercel.app/",
    logo: {
      "@type": "ImageObject",
      url: "https://8-distance.vercel.app/images/favicon.ico",
    },
  },
  mainEntity: [
    {
      "@type": "CreativeWork",
      name: "小資裝修專案",
      url: "https://8-distance.vercel.app/#special",
      description: "50-100萬裝潢專案，為首購族量身打造，兼具美感與實用性",
    },
    {
      "@type": "CreativeWork",
      name: "商業空間設計",
      url: "https://8-distance.vercel.app/project?cat=commercial-public",
      description: "量身打造品牌商業空間，從品牌精神出發整合設計與施工",
    },
    {
      "@type": "CreativeWork",
      name: "老屋翻新工程",
      url: "https://8-distance.vercel.app/project?cat=renovation-restoration",
      description: "結合現代美感與結構優化，翻轉老屋新生命",
    },
  ],
};

export default async function Page() {
  const res = await fetch(
    "https://inf.fjg.mybluehost.me/website_61ba641a/wp-json/wp/v2/posts?per_page=100&_embed",
    { next: { revalidate: 60 } } // 👈 App Router 寫法
  );
  const data = await res.json();

  const filtered = data.filter((post) =>
    post._embedded["wp:term"][0]?.some((cat) => cat.slug === "special-offers")
  );

  filtered.sort((a, b) => {
    const numA = parseInt(a.title.rendered.match(/^\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.title.rendered.match(/^\d+/)?.[0] || "0", 10);
    return numA - numB;
  });

  return (
    <>
      <Script
        id="structured-data-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData),
        }}
      />
      <Client specialPosts={filtered} /> {/* 👈 傳資料給 client component */}
    </>
  );
}
