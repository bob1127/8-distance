import Client from "./client";

// /app/contact/page.jsx
export const metadata = {
  title: "聯絡我們｜捌程室內設計 8 Distance｜預約諮詢與合作洽談",
  description:
    "需要住宅或商業空間規劃？透過表單留下需求，或以 Email／電話聯繫捌程室內設計 8 Distance。我們提供設計諮詢、預約丈量與品牌／商業合作洽談，服務包含住宅設計、老屋翻新、純設計案與商業空間整體規劃。",
  keywords: [
    "聯絡我們",
    "捌程室內設計",
    "8 Distance",
    "設計諮詢",
    "預約丈量",
    "室內設計聯絡方式",
    "住宅設計",
    "商業空間設計",
    "品牌合作",
    "聯絡表單",
  ],
  icons: {
    icon: "/images/logo/company-logo.ico",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://www.8distance.com/contact",
    siteName: "捌程室內設計 8 Distance",
    title: "聯絡我們｜捌程室內設計 8 Distance",
    description:
      "表單、Email、電話多管道聯繫捌程室內設計：提供住宅與商業空間設計諮詢、預約丈量與品牌／商業合作洽談。",
    images: [
      {
        url: "https://www.8distance.com/images/og/contact-cover.jpg",
        width: 1200,
        height: 630,
        alt: "捌程室內設計 8 Distance 聯絡我們封面",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "聯絡我們｜捌程室內設計 8 Distance",
    description: "透過表單或 Email／電話與我們聯繫，預約設計諮詢與合作洽談。",
    images: ["https://www.8distance.com/images/og/contact-cover.jpg"],
  },
  alternates: {
    canonical: "https://www.8distance.com/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 60;

export default function ContactPage() {
  return <Client />;
}
