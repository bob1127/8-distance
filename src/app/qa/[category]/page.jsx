// app/qa/[category]/page.jsx
export const runtime = "nodejs";
export const revalidate = 600;
export const dynamic = "force-static"; // 使用 generateStaticParams 產生靜態頁面

import Script from "next/script";
import { notFound } from "next/navigation";
import Client from "../client"; // 指向原本的 client.jsx
import { fetchQA } from "@/lib/qa";
import { SITE_HOME, SITE_ORIGIN, absoluteUrl } from "@/lib/site";

/* ✅ 1. 產生靜態路徑 (SSG) */
export async function generateStaticParams() {
  return [{ category: "design_process" }, { category: "renovation_knowledge" }];
}

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

/* ✅ 2. Metadata: 根據 Category 顯示不同標題 */
export async function generateMetadata({ params }) {
  const { category } = params;
  const { meta } = await fetchQA();

  const catName = category === "renovation_knowledge" ? "裝修知識" : "設計流程";
  const title = `${catName} - ${meta.title || "常見問題"}`;

  const canonical = absoluteUrl(`/qa/${category}`);

  // ✅ 指定的 OG 圖片網址
  const ogImage =
    "https://api.8distance.com/storage/uploads/question-settings/01K8M3ZAC8Z255925CH1THCG5E.webp";

  return {
    title,
    description: meta.description,
    keywords: meta.key_word,
    metadataBase: new URL(SITE_ORIGIN),
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description: meta.description,
      // ✅ 修改此處
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
      description: meta.description,
      images: [ogImage], // Twitter 預覽圖
    },
  };
}

/* ✅ 3. 主頁面接收 params */
export default async function Page({ params }) {
  const { category } = params;
  const { byCat, settings } = await fetchQA();

  // 簡單驗證，如果亂打網址就 404
  const validCategories = ["design_process", "renovation_knowledge"];
  if (!validCategories.includes(category)) {
    notFound();
  }

  const pageUrl = absoluteUrl(`/qa/${category}`);

  // JSON-LD (只針對當前分類生成)
  const currentItems = byCat[category] || [];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: currentItems.map((it, i) => ({
      "@type": "Question",
      "@id": `${pageUrl}#q-${i}`,
      name: stripHtml(it.q),
      acceptedAnswer: { "@type": "Answer", text: stripHtml(it.a) },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: SITE_HOME },
      {
        "@type": "ListItem",
        position: 2,
        name: "常見問題",
        item: absoluteUrl("/qa/design_process"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category === "design_process" ? "設計流程" : "裝修知識",
        item: pageUrl,
      },
    ],
  };

  return (
    <main>
      <h1 className="sr-only">
        常見問題 - {category === "design_process" ? "設計流程" : "裝修知識"}
      </h1>

      <Script
        id="qa-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="qa-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ✅ 傳入 defaultCategory 給 Client */}
      <Client
        initialByCategory={byCat}
        settings={settings}
        defaultCategory={category}
      />
    </main>
  );
}
