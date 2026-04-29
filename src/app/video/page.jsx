// app/video/page.jsx
export const revalidate = 300;
export const runtime = "nodejs";

import Script from "next/script";
import AnimatedHeading from "@/components/AnimatedHeading";
import YouTubeLiteClient from "./client";

const API_BASE = "https://api.8distance.com/api/videos";
const SITE = "https://8-distance.vercel.app";

/* ---------------- 工具：解析 YouTube ID ---------------- */
function extractYouTubeId(input) {
  if (!input) return "";
  const s = String(input).trim();
  // ... (保持原本的正則邏輯)
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "");
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {}
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  if (m) return m[0];
  return "";
}

/* ---------------- 工具：去重 (新增) ---------------- */
function deduplicateVideos(videos) {
  const map = new Map();
  videos.forEach((v) => {
    if (v && v.id && !map.has(v.id)) {
      map.set(v.id, v);
    }
  });
  return Array.from(map.values());
}

/* ---------------- 映射邏輯 ---------------- */
function mapItem(row, idx, type) {
  const id =
    extractYouTubeId(row?.video_param) ||
    extractYouTubeId(row?.url) ||
    extractYouTubeId(row?.link);
  if (!id) return null;

  return {
    type,
    id,
    title: row?.title || `Video #${idx + 1}`,
    thumb: row?.image_url || null,
    sort: Number(row?.sort_order ?? idx),
    imgAlt: row?.image_alt || row?.title || "影片縮圖",
    imgTitle: row?.title || "YouTube 影片",
    uploadDate:
      row?.published_at || row?.updated_at || row?.created_at || undefined,
  };
}

function mapSliderRow(row, idx) {
  // 這裡只做基礎映射，ID 可能會是空的，稍後在 getInitialData 補全
  const id =
    extractYouTubeId(row?.video_param) ||
    extractYouTubeId(row?.url) ||
    extractYouTubeId(row?.link) ||
    "";
  return {
    id, // 可能為空字串
    type: "video",
    src: row?.image_url,
    title: row?.title || `Slider #${idx + 1}`,
    imgAlt: row?.image_alt || row?.title || "影片輪播圖",
    imgTitle: row?.title || "影片輪播圖",
  };
}

/* ---------------- JSON-LD ---------------- */
function toVideoLd({ id, type, title, thumb, uploadDate }) {
  // ... (保持原本邏輯)
  const watchUrl =
    type === "short"
      ? `https://www.youtube.com/shorts/${id}`
      : `https://www.youtube.com/watch?v=${id}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;

  return {
    "@type": "VideoObject",
    name: title || "YouTube 影片",
    description: title || "YouTube 影片",
    thumbnailUrl: thumb
      ? [thumb]
      : [
          `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        ],
    embedUrl,
    potentialAction: { "@type": "WatchAction", target: watchUrl },
    uploadDate: uploadDate || undefined,
  };
}

/* ---------------- 核心資料抓取 (修正重點) ---------------- */
async function getInitialData(page = 1) {
  try {
    const isFirstPage = Number(page) === 1;

    // 定義請求 Promise
    const requests = [
      fetch(`${API_BASE}?category=all&page=${page}`, { next: { revalidate } }),
    ];

    // 如果不是第一頁，我們額外抓第一頁是為了「補全 Slider 缺少的 ID」，而不是為了合併列表
    if (!isFirstPage) {
      requests.push(
        fetch(`${API_BASE}?category=all&page=1`, { next: { revalidate } })
      );
    }

    const [currentRes, firstPageRes] = await Promise.all(requests);
    const json = await currentRes.json();
    
    // 如果有抓第一頁資料就解析，否則用空物件
    const firstJson = firstPageRes ? await firstPageRes.json() : null;

    // 1. 準備當前頁面的原始資料 (用於列表顯示)
    const currentNormalsRaw = Array.isArray(json?.videos?.normal) ? json.videos.normal : [];
    const currentShortsRaw = Array.isArray(json?.videos?.shorts) ? json.videos.shorts : [];

    // 2. 建立 "Lookup Pool" (對照表池)
    // 這是為了解決 Slider 只有標題沒有 ID 的問題。
    // 池子包含：第一頁資料 (通常 Slider 內容都在第一頁) + 當前頁面資料
    const poolRaw = [
      ...currentNormalsRaw,
      ...currentShortsRaw,
      ...(Array.isArray(firstJson?.videos?.normal) ? firstJson.videos.normal : []),
      ...(Array.isArray(firstJson?.videos?.shorts) ? firstJson.videos.shorts : []),
    ];

    // 建立 title -> ID 的 Map (轉小寫比對)
    const idMap = new Map();
    poolRaw.forEach(row => {
        const id = extractYouTubeId(row?.video_param) || extractYouTubeId(row?.url) || extractYouTubeId(row?.link);
        const title = (row?.title || "").trim().toLowerCase();
        if (id && title) {
            idMap.set(title, id);
        }
    });

    // 3. 處理 Slider (在 Server 端就把 ID 補好)
    const sliderRaw = Array.isArray(json?.video_slider) ? json.video_slider : [];
    const processedSlider = sliderRaw.map((row, idx) => {
        const item = mapSliderRow(row, idx);
        // 如果原本就有 ID 就用原本的，否則去 Map 找
        if (!item.id && item.title) {
            const foundId = idMap.get(item.title.trim().toLowerCase());
            if (foundId) item.id = foundId;
        }
        return item;
    }).filter(Boolean);


    // 4. 處理顯示列表 (只回傳當前頁面資料，並去重)
    const normalVideos = deduplicateVideos(
        currentNormalsRaw.map((r, i) => mapItem(r, i, "video"))
    );
    
    const shortsVideos = deduplicateVideos(
        currentShortsRaw.map((r, i) => mapItem(r, i, "short"))
    );

    return {
      sliderItems: processedSlider,
      normalVideos, // 現在只會包含當前頁面的不重複影片
      shortsVideos, // 現在只會包含當前頁面的不重複 Short
      pagination: json?.pagination || {
        normal: { current_page: Number(page), total_pages: 1 },
        shorts: { current_page: Number(page), total_pages: 1 },
      },
    };
  } catch (e) {
    console.error("Data Fetch Error:", e);
    return {
      sliderItems: [],
      normalVideos: [],
      shortsVideos: [],
      pagination: {},
    };
  }
}

/* ---------------- Page Component ---------------- */
export default async function Page({ searchParams }) {
  const page = searchParams?.page || 1;
  const category = searchParams?.category || "normal";

  const { sliderItems, normalVideos, shortsVideos, pagination } =
    await getInitialData(page);

  const pageUrl = `${SITE}/video`;

  // Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "影音內容", item: pageUrl },
    ],
  };

  const allPlayable = [...normalVideos, ...shortsVideos].slice(0, 10);
  const videoObjectsLd = allPlayable.map((v) =>
    toVideoLd({
      id: v.id,
      type: v.type,
      title: v.title,
      thumb: v.thumb,
      uploadDate: v.uploadDate,
    })
  );

  return (
    <main className="min-h-screen mx-auto py-20 w-full">
      <Script
        id="video-ld-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {videoObjectsLd.map((vo, i) => (
        <Script
          key={`video-ld-${i}`}
          id={`video-ld-${i}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vo) }}
        />
      ))}

      <header className="pt-4 max-w-[1920px] flex flex-col justify-center items-center w-[92%] md:w-[90%] xl:w-[85%] mx-auto">
        <AnimatedHeading
          text="影音內容"
          lineColor="#2b3742"
          lineLength={120}
          lineThickness={1}
          yOffsetEm={0.08}
          duration={1.0}
          delay={0.12}
          firstVisitDelay={2}
          startDelay={0}
          resetOnExit={true}
        />
      </header>

      <YouTubeLiteClient
        sliderItems={sliderItems}
        initialNormal={normalVideos}
        initialShorts={shortsVideos}
        initialPagination={pagination}
        initialTab={category}
      />
    </main>
  );
}