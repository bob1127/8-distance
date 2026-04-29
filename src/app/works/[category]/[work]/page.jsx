export const runtime = "nodejs";
export const revalidate = 10;
export const dynamic = "force-static";

import Client from "./client";
import Script from "next/script";
import { redirect } from "next/navigation";

const API_ROOT = "https://api.8distance.com/api/works";

/* ---------------- utils ---------------- */
const S = (v, d = "") => (v == null ? d : String(v));
const trim = (s) => S(s).trim();
const norm = (s) => trim(s).toLowerCase();

async function getJson(url) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
async function tryFetchDetail(id) {
  try {
    const res = await fetch(`${API_ROOT}/${encodeURIComponent(String(id))}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

async function resolveClassificationIdBySlug(categorySlug) {
  if (/^\d+$/.test(String(categorySlug))) return String(categorySlug);
  try {
    const json = await getJson(API_ROOT);
    const list =
      (Array.isArray(json?.works_classifications) &&
        json.works_classifications) ||
      (Array.isArray(json?.classifications) && json.classifications) ||
      [];

    const s = norm(decodeURIComponent(categorySlug));

    let hit = list.find((c) => norm(c?.url_slug) === s);
    if (hit?.id != null) return String(hit.id);

    hit = list.find((c) => norm(c?.title || c?.name) === s);
    if (hit?.id != null) return String(hit.id);

    const pf = json?.works_portfolio || json?.works_portfolios || {};
    for (const [groupName, arr] of Object.entries(pf)) {
      if (norm(groupName) === s) {
        const first = Array.isArray(arr) ? arr[0] : null;
        if (first?.classification_id != null)
          return String(first.classification_id);
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveWorkIdBySlug(categoryId, workSlug) {
  const target = norm(decodeURIComponent(workSlug));

  try {
    const json = await getJson(
      `${API_ROOT}/classifications/${encodeURIComponent(categoryId)}`
    );

    const arr =
      (Array.isArray(json?.works_portfolios) && json.works_portfolios) ||
      (Array.isArray(json?.works) && json.works) ||
      (Array.isArray(json?.data?.works) && json.data.works) ||
      (Array.isArray(json) && json) ||
      [];

    let hit =
      arr.find((w) => norm(w?.url_slug) === target) ||
      arr.find((w) => norm(w?.name || w?.title) === target) ||
      arr.find((w) => String(w?.sort_order ?? "").trim() === trim(workSlug));

    if (hit) {
      const candidates = [
        hit.id,
        hit.work_id,
        hit.detail_id,
        hit.sort_order,
      ].filter((x) => x != null && String(x).trim() !== "");

      for (const cand of candidates) {
        const detail = await tryFetchDetail(cand);
        if (detail) return { id: String(cand), detail, listInCategory: arr };
      }
    }
  } catch {}

  // Fallback: 如果是數字 ID
  if (/^\d+$/.test(String(workSlug))) {
    const detail = await tryFetchDetail(workSlug);
    if (detail) return { id: String(workSlug), detail, listInCategory: null };
  }

  return { id: null, detail: null, listInCategory: null };
}

function mapDetail(d) {
  const w = d?.work && typeof d.work === "object" ? d.work : d;
  const title = w?.name ?? w?.title ?? "未命名作品";

  const heroImages = [
    {
      src:
        w?.detail_image_url ||
        w?.image_url ||
        "/images/index/b69ff1_ed3d1e1ab1e14db4bd8ad2c8f3b9c3de~mv2.jpg.avif",
      alt: w?.detail_image_alt || w?.image_alt || "背景圖",
    },
  ];

  const ai = w?.award_images;
  let galleryImages = [];
  if (ai && typeof ai === "object" && !Array.isArray(ai)) {
    const c1 = Array.isArray(ai.column_1) ? ai.column_1 : [];
    const c2 = Array.isArray(ai.column_2) ? ai.column_2 : [];
    const c3 = Array.isArray(ai.column_3) ? ai.column_3 : [];
    galleryImages = [...c1, ...c2, ...c3]
      .slice()
      .sort(
        (a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0)
      )
      .map((it) => ({
        src: it?.image_url || "",
        alt: it?.image_alt || it?.image_title || "card-img",
        title: it?.image_title || it?.image_alt || "card-img",
        sort_order: it?.sort_order,
      }))
      .filter((g) => g.src);
  } else if (Array.isArray(ai)) {
    galleryImages = ai
      .slice()
      .sort(
        (a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0)
      )
      .map((it) => ({
        src: it?.image_url || it?.src || "",
        alt: it?.image_alt || it?.image_title || it?.alt || "card-img",
        title: it?.image_title || it?.title || it?.image_alt || "card-img",
        sort_order: it?.sort_order,
      }))
      .filter((g) => g.src);
  }

  const info = {
    workName: title,
    style: (typeof w?.style === "string" ? w.style.trim() : "") || "",
    originLayout: w?.layout_original ?? w?.layout ?? "",
    region: w?.location ?? "",
    rooms: w?.layout ?? "",
    spaceType: w?.space_type ?? "",
    builder: w?.builder ?? "",
    areaPing: w?.area_size ?? "",
    colors: ["#EEE3D3", "#F6EFE7", "#6B4A3A"],
    intro: w?.intro ?? w?.description ?? "",
    description: w?.description ?? "",
    award_record:
      typeof w?.award_record === "string"
        ? w.award_record.trim()
        : Array.isArray(w?.award_record)
        ? w.award_record.filter(Boolean).join("、")
        : "",
    awards: Array.isArray(w?.award_record) ? w.award_record : [],
    award_images: ai || [],
    detail_image_url: w?.detail_image_url,
    detail_image_alt: w?.detail_image_alt,
    detail_image_title: w?.detail_image_title,
    image_alt: w?.image_alt,
    image_title: w?.image_title,
    location: w?.location ?? "",
    layout: w?.layout ?? "",
    layout_original: w?.layout_original ?? "",
    space_type: w?.space_type ?? "",
    area_size: w?.area_size ?? "",
    featured:
      (Array.isArray(d?.featured) && d.featured) ||
      (Array.isArray(w?.featured) && w.featured) ||
      [],
    classification: w?.classification || null,
    classification_id: w?.classification_id || null,
  };

  return {
    title,
    heroImages,
    galleryImages,
    sidebarCases: [],
    info,
    workRaw: w,
  };
}

function buildSidebarFromList(list, currentId, categorySlugOverride) {
  const arr = Array.isArray(list) ? list : [];

  const validCatSlug =
    categorySlugOverride && !/^\d+$/.test(categorySlugOverride)
      ? categorySlugOverride
      : null;

  return arr
    .filter(
      (x) =>
        String(x?.id ?? x?.work_id ?? x?.detail_id ?? x?.sort_order) !==
        String(currentId)
    )
    .slice(0, 10)
    .map((c) => {
      const img =
        c?.image_url || c?.cover || c?.cover_url || c?.thumbnail || "";
      const title = c?.name || c?.title || "Related";

      const catSeg =
        validCatSlug ||
        c?.url_slug_category ||
        c?.classification?.url_slug ||
        c?.classification?.title ||
        String(c?.classification_id ?? "");

      const workSeg =
        c?.url_slug ||
        c?.name ||
        c?.title ||
        String(c?.id ?? c?.work_id ?? c?.detail_id ?? c?.sort_order ?? "");

      const href = `/works/${encodeURIComponent(catSeg)}/${encodeURIComponent(
        workSeg
      )}`;

      return {
        title,
        subtitle: c?.subtitle || "",
        src: img || "/images/index/老屋翻新-李宅.webp",
        href,
        imgAlt: c?.image_alt || title || "related-image",
        imgTitle: c?.image_title || title || "related-image",
      };
    });
}

/* ==================================================
   ★ SEO 核心修正：Canonical Tag
   ================================================== */
export async function generateMetadata({ params }) {
  const categorySlug = params?.category ?? "";
  const workSlug = params?.work ?? "";

  // 1. 先嘗試用數字 ID 抓資料
  if (/^\d+$/.test(String(workSlug))) {
    const detail = await tryFetchDetail(workSlug);
    if (!detail) return { title: "找不到作品" };
    const props = mapDetail(detail);
    return renderMetadata(props); // 傳入 props 讓它自己組裝正確網址
  }

  // 2. 用 Slug 抓資料
  const cid = await resolveClassificationIdBySlug(categorySlug);
  const { id: wid, detail } = cid
    ? await resolveWorkIdBySlug(cid, workSlug)
    : { id: null, detail: null };

  if (!wid || !detail) return {};

  const props = mapDetail(detail);
  return renderMetadata(props);
}

function renderMetadata(props) {
  const w = props.workRaw;
  const info = props.info;

  // ★ 重點：強制使用資料庫裡的中文分類與作品名稱來產生 Canonical
  const realCat =
    w?.classification?.url_slug ||
    w?.classification?.title ||
    w?.classification?.name ||
    "works";
  const realWork = w?.url_slug || w?.name || w?.title || "";

  // 這樣不管網址列顯示 1/19 還是 住宅空間/19，Google 看到的「本尊」永遠是中文網址
  const canonical = `https://www.8distance.com/works/${encodeURIComponent(
    realCat
  )}/${encodeURIComponent(realWork)}`;

  const titleRaw = trim(w?.meta_data?.title || w?.name || w?.title) || "";
  const descRaw =
    trim(w?.meta_data?.description || info?.description || info?.intro) || "";
  const kwRaw = trim(w?.meta_data?.key_word) || "";
  const cover = w?.detail_image_url || w?.image_url || undefined;

  return {
    title: titleRaw || undefined,
    description: descRaw || undefined,
    keywords: kwRaw || undefined,
    alternates: {
      canonical: canonical, // 這裡告訴 Google 正確的網址
    },
    openGraph: {
      title: titleRaw || undefined,
      description: descRaw || undefined,
      url: canonical,
      type: "article",
      locale: "zh_TW",
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

function extractImagesFromAward(award_images, galleryImages, heroImages) {
  const imgs = [];
  const push = (u) => {
    const s = String(u || "").trim();
    if (!s) return;
    if (!/^https?:\/\//.test(s) && !s.startsWith("/")) return;
    if (!imgs.includes(s)) imgs.push(s);
  };
  if (heroImages) heroImages.forEach((x) => push(x?.src));
  if (Array.isArray(galleryImages)) galleryImages.forEach((g) => push(g?.src));
  if (
    award_images &&
    typeof award_images === "object" &&
    !Array.isArray(award_images)
  ) {
    ["column_1", "column_2", "column_3"].forEach((k) =>
      (award_images[k] || []).forEach((it) => push(it?.image_url))
    );
  } else if (Array.isArray(award_images)) {
    award_images.forEach((it) => push(it?.image_url || it?.src));
  }
  return imgs.slice(0, 12);
}

/* ==================================================
   ★ Page 主程式：處理轉址
   ================================================== */
export default async function Page({ params }) {
  const categorySlug = params?.category ?? "";
  const workSlug = params?.work ?? "";

  // 用於渲染頁面的 Render Helper
  const render = (props) => {
    // 取得「正確的中文網址」用於 JSON-LD
    const w = props.workRaw;
    const realCat =
      w?.classification?.url_slug ||
      w?.classification?.title ||
      w?.classification?.name ||
      "works";
    const realWork = w?.url_slug || w?.name || w?.title || "";
    const canonicalUrl = `https://www.8distance.com/works/${encodeURIComponent(
      realCat
    )}/${encodeURIComponent(realWork)}`;

    const images = extractImagesFromAward(
      props.info?.award_images,
      props.galleryImages,
      props.heroImages
    );

    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl }, // 使用標準網址
      headline: props.title,
      description: (
        props.info?.description ||
        props.info?.intro ||
        ""
      ).toString(),
      image: images.length ? images : undefined,
      author: { "@type": "Organization", name: "8 DISTANCE 捌程室內設計" },
      publisher: {
        "@type": "Organization",
        name: "8 DISTANCE 捌程室內設計",
        logo: {
          "@type": "ImageObject",
          url: "https://www.8distance.com/images/og-logo.png",
        },
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: "https://www.8distance.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "作品集",
          item: "https://www.8distance.com/works",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: props.title,
          item: canonicalUrl,
        },
      ],
    };

    const orgLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "捌程室內設計 8 Distance",
      url: "https://www.8distance.com/",
      logo: "https://www.8distance.com/images/og-logo.png",
      sameAs: [
        "https://www.facebook.com/8distance",
        "https://www.instagram.com/8distance",
      ],
    };

    return (
      <main>
        <Script
          id="ld-article"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <Client {...props} />
      </main>
    );
  };

  // Case 1) work 段是數字 → 嘗試自動轉址到中文 URL
  if (/^\d+$/.test(String(workSlug))) {
    const detail = await tryFetchDetail(workSlug);
    if (!detail) {
      return (
        <main className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-2xl font-semibold">找不到此作品</h1>
            <p className="mt-4 text-neutral-600">無法解析此路徑。</p>
          </div>
        </main>
      );
    }
    const props = mapDetail(detail);

    // ★ 自動轉址：如果找到了中文 Slug，就轉過去
    const w = props.workRaw;
    const targetCat =
      w?.classification?.url_slug ||
      w?.classification?.title ||
      w?.classification?.name;
    // 優先使用 url_slug，其次使用 name
    const targetWork = w?.url_slug || w?.name;

    if (targetCat && targetWork) {
      redirect(
        `/works/${encodeURIComponent(targetCat)}/${encodeURIComponent(
          targetWork
        )}`
      );
    }

    /* 以下為轉址失敗的 fallback (例如資料庫缺資料) */
    if (Array.isArray(detail?.featured) && detail.featured.length > 0) {
      props.info.featured = detail.featured;
      props.sidebarCases = [];
      return render(props);
    }

    const clsId = props.info.classification_id;
    if (clsId) {
      try {
        const listJson = await getJson(
          `${API_ROOT}/classifications/${encodeURIComponent(String(clsId))}`
        );
        const list =
          listJson?.works_portfolios ||
          listJson?.works ||
          listJson?.data?.works ||
          listJson ||
          [];
        const realCatSlug =
          listJson?.url_slug ||
          listJson?.title ||
          listJson?.name ||
          targetCat ||
          "";
        props.sidebarCases = buildSidebarFromList(list, workSlug, realCatSlug);
      } catch {
        props.sidebarCases = [];
      }
    }
    return render(props);
  }

  // Case 2) 非數字（可能是正常中文，也可能是 住宅空間/19 這種半 ID）
  const cid = await resolveClassificationIdBySlug(categorySlug);
  const { id: wid, detail } = cid
    ? await resolveWorkIdBySlug(cid, workSlug)
    : { id: null, detail: null };

  if (!wid || !detail) {
    return (
      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-2xl font-semibold">找不到此作品</h1>
        </div>
      </main>
    );
  }

  const props = mapDetail(detail);

  // ★ 檢查是否需要轉址 (如果現在網址是 /住宅空間/19，但我們知道正確名字是 /住宅空間/逸品山蔡宅)
  // 如果 workSlug 是數字，但我們有抓到中文名稱，就轉址
  if (/^\d+$/.test(String(workSlug))) {
    const w = props.workRaw;
    const targetWork = w?.url_slug || w?.name;
    // 保持當前 categorySlug (因為已經是對的了)，只修正 workSlug
    if (targetWork && targetWork !== workSlug) {
      redirect(
        `/works/${encodeURIComponent(categorySlug)}/${encodeURIComponent(
          targetWork
        )}`
      );
    }
  }

  // 正常渲染
  if (Array.isArray(detail?.featured) && detail.featured.length > 0) {
    props.info.featured = detail.featured;
    props.sidebarCases = [];
  } else {
    try {
      const listJson = await getJson(
        `${API_ROOT}/classifications/${encodeURIComponent(String(cid))}`
      );
      const list =
        listJson?.works_portfolios ||
        listJson?.works ||
        listJson?.data?.works ||
        listJson ||
        [];
      const catSlugDecoded = decodeURIComponent(categorySlug);
      props.sidebarCases = buildSidebarFromList(list, wid, catSlugDecoded);
    } catch {
      props.sidebarCases = [];
    }
    props.info.featured = [];
  }

  return render(props);
}
