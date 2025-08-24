import Client from "./portfolio-client";

// /app/photos/metadata.js
// /app/news/metadata.js
export const metadata = {
  title: "小坪數設計指南｜打造獨居極致空間｜8 DISTANCE 捌程室內設計",
  description:
    "聚焦單身族與小宅規劃：從功能整合（區塊重組）與向上收納，到動線尺寸精算、色彩與材質搭配、層次照明與軟裝風格，讓有限坪數也能住得舒適、有型、好整理。",
  keywords: [
    "小坪數設計",
    "獨居空間",
    "功能整合",
    "區塊重組設計",
    "機能複合",
    "向上收納",
    "動線規劃",
    "色彩設計",
    "材質搭配",
    "照明設計",
    "軟裝風格",
    "老屋翻新",
    "預售客變",
  ],
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://www.8distance.com/news",
    siteName: "8 DISTANCE 捌程室內設計",
    title: "小坪數設計指南｜打造獨居極致空間",
    description:
      "以功能整合、向上收納、視覺放大與流暢動線為核心，搭配層次照明與軟裝統整，打造貼近生活的獨居理想宅。",
    images: [
      {
        // 取自站內文章的首圖（Wix CDN）
        url: "https://static.wixstatic.com/media/b69ff1_aa75b71a5894418c927726a18a6326ac~mv2.jpg/v1/fill/w_1052,h_813,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b69ff1_aa75b71a5894418c927726a18a6326ac~mv2.jpg",
        width: 1052,
        height: 813,
        alt: "小坪數室內設計指南—客廳視角",
      },
    ],
  },
  alternates: {
    canonical: "https://www.8distance.com/news",
  },
};

export const revalidate = 60;

export default function QaPage() {
  return <Client />;
}
