import Client from "./about";
import Script from "next/script";

export const metadata = {
  title: "關於捌程｜8 Distance｜室內・景觀設計品牌與服務介紹",
  description:
    "捌程是一間室內與景觀設計的專業公司，擅長將室內、室外的景色融合；以人為本，創造功能合理、舒適優美、滿足物質與精神需求的空間。",
  keywords: [
    "捌程",
    "8 Distance",
    "捌程室內設計",
    "室內設計",
    "景觀設計",
    "商業空間設計",
    "住宅設計",
    "台中室內設計",
  ],
  icons: {
    // 依你專案實際檔案調整（此為站內相對路徑）
    icon: "/images/logo/company-logo.ico",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://www.8distance.com/%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91",
    siteName: "捌程景觀及室內設計 8 Distance",
    title: "關於捌程｜8 Distance｜室內・景觀設計品牌與服務介紹",
    description:
      "捌程是一間室內與景觀設計的專業公司，擅長將室內、室外的景色融合；以人為本，創造功能合理、舒適優美、滿足物質與精神需求的空間。",
    images: [
      {
        // 建議放你站內實體圖檔，這裡提供可替換示意路徑
        url: "https://www.8distance.com/images/og/about-cover.jpg",
        width: 1200,
        height: 630,
        alt: "捌程景觀及室內設計 8 Distance 品牌介紹",
      },
    ],
  },
  alternates: {
    canonical: "https://www.8distance.com/%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91",
  },
};

export const revalidate = 60;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "捌程景觀及室內設計 8 Distance",
  url: "https://www.8distance.com",
  // 建議換成你站內實際 LOGO 圖檔（需為絕對網址）
  logo: "https://www.8distance.com/images/logo/company-logo.png",
  description:
    "捌程是一間室內與景觀設計的專業公司，擅長將室內、室外的景色融合；以人為本，創造功能合理、舒適優美、滿足生活所需的室內環境。",
  address: {
    "@type": "PostalAddress",
    streetAddress: "五權三街273號",
    addressLocality: "西區",
    addressRegion: "台中市",
    addressCountry: "TW",
    // postalCode 可加上 403（台中西區），若要避免不一致可留白
    // postalCode: "403",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "客戶服務",
    availableLanguage: ["zh-TW"],
    telephone: "+886-4-23720128",
    email: "8distancee@gmail.com",
    url: "https://www.8distance.com/%E8%81%AF%E7%B5%A1%E6%88%91%E5%80%91",
  },
  sameAs: [
    "https://www.instagram.com/8_distance/",
    "https://www.facebook.com/8Distancee/",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Client />
    </>
  );
}
