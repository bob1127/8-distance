import Client from "./client";

// /app/photos/metadata.js
// /app/news/metadata.js
// /app/about/metadata.js
export const metadata = {
  title: "常見問題（QA）｜捌程 8 Distance｜服務流程・報價・聯絡方式",
  description:
    "捌程景觀及室內設計常見問題：合作流程、估價與費用、工期與保固、場勘與諮詢方式等，一次看懂。",
  keywords: [
    "捌程",
    "8 Distance",
    "常見問題",
    "QA",
    "室內設計 FAQ",
    "設計流程",
    "估價",
    "台中室內設計",
    "景觀設計",
  ],
  icons: {
    icon: "/images/logo/company-logo.ico", // 若有專屬 icon，可改你的實際路徑
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://www.8distance.com/QA", // 若你的實際路徑不同，改成對應 slug
    siteName: "捌程景觀及室內設計 8 Distance",
    title: "常見問題（QA）｜捌程 8 Distance｜服務流程・報價・聯絡方式",
    description:
      "捌程景觀及室內設計常見問題：合作流程、估價與費用、工期與保固、場勘與諮詢方式等，一次看懂。",
    images: [
      {
        url: "https://www.8distance.com/images/og/qa-cover.jpg", // 換成實際存在的 OG 圖檔
        width: 1200,
        height: 630,
        alt: "捌程 8 Distance 常見問題封面",
      },
    ],
  },
  alternates: {
    canonical: "https://www.8distance.com/QA", // 同上，依你的實際網址調整
  },
};

export const revalidate = 60;

export default function QaPage() {
  return <Client />;
}
