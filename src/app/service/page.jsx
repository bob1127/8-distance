import QaClient from "./client";

export const metadata = {
  title: "設計流程｜合作步驟與注意事項｜捌程 8 Distance",
  description:
    "捌程 8 Distance 設計流程：初步諮詢、現場丈量與場勘、概念提案與預算溝通、合約簽訂、深化設計與3D、工程施工與監造、驗收與保固，一次看懂合作步驟與重點。",
  keywords: [
    "捌程",
    "8 Distance",
    "設計流程",
    "合作流程",
    "裝潢流程",
    "室內設計",
    "景觀設計",
    "台中室內設計",
  ],
  icons: {
    icon: "/images/logo/company-logo.ico", // 依專案實際路徑調整
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://www.8distance.com/design-process",
    siteName: "捌程景觀及室內設計 8 Distance",
    title: "設計流程｜合作步驟與注意事項｜捌程 8 Distance",
    description:
      "捌程 8 Distance 設計流程：初步諮詢、現場丈量與場勘、概念提案與預算溝通、合約簽訂、深化設計與3D、工程施工與監造、驗收與保固，一次看懂合作步驟與重點。",
    images: [
      {
        url: "https://www.8distance.com/images/og/design-process.jpg", // 換成站內實際存在的 OG 圖
        width: 1200,
        height: 630,
        alt: "捌程 8 Distance 設計流程封面",
      },
    ],
  },
  alternates: {
    canonical: "https://www.8distance.com/design-process",
  },
};

export const revalidate = 60;

export default function QaPage() {
  return <QaClient />;
}
