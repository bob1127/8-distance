// app/sitemap.js
export const revalidate = 3600; // 每小時更新一次快取

const SITE_URL = "https://www.8distance.com";
const API_ROOT = "https://api.8distance.com/api";

// 工具：網址編碼
const escape = (str) => (str ? encodeURIComponent(String(str).trim()) : "");

// 工具：Fetch JSON + 錯誤記錄
async function getJson(endpoint) {
  const url = `${API_ROOT}${endpoint}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[Sitemap] Fetch failed: ${url} (${res.status})`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`[Sitemap] Error fetching ${url}:`, e);
    return null;
  }
}

/**
 * 終極版 deriveSlug (解決 Blog 404 問題的相同邏輯)
 * 確保 sitemap 產生的網址，跟真實網頁的網址 100% 一致
 */
function deriveSlug(row) {
  const raw = String(row?.url_slug ?? row?.slug ?? "").trim();
  if (raw) return raw;
  return String(row?.id ?? "");
}

export default async function sitemap() {
  const routes = [];
  const now = new Date();

  console.log("🔄 Generating Sitemap...");

  // ==========================================
  // 1. 靜態頁面
  // ==========================================
  const staticPages = [
    "",
    "/about",
    "/service",
    "/qa",
    "/qa/design_process",
    
    "/contact",
    "/news",
    "/blog",
    "/works",
    "/video",
 
  ];

  staticPages.forEach((route) => {
    routes.push({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
    });
  });

  // ==========================================
  // 2. 作品集 (Works) - 分類 & 單一作品
  // ==========================================
  const worksJson = await getJson("/works");
  const classifications =
    worksJson?.works_classifications || worksJson?.classifications || [];

  for (const cat of classifications) {
    const catSlug = cat.url_slug || cat.title || cat.name || cat.id;
    if (!catSlug) continue;

    // 加入分類列表頁
    routes.push({
      url: `${SITE_URL}/works/${escape(catSlug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    if (cat.id) {
      const catDetail = await getJson(`/works/classifications/${cat.id}`);
      const items =
        catDetail?.works_portfolios ||
        catDetail?.works ||
        catDetail?.data?.works ||
        catDetail?.works_list ||
        [];

      if (Array.isArray(items) && items.length > 0) {
        items.forEach((work) => {
          // 強制套用與前端一致的分類名稱邏輯，避免出現 "works/works" 慘案
          let realCat = catSlug;
          if (!realCat || /^\d+$/.test(realCat) || realCat === "works" || realCat === "作品欣賞") {
              realCat = work?.classification?.name || work?.classification?.title || work?.classification?.url_slug || "works";
          }
          
          const workSlug = work.url_slug || work.name || work.title || work.id;
          if (workSlug) {
            routes.push({
              url: `${SITE_URL}/works/${escape(realCat)}/${escape(workSlug)}`,
              lastModified: work.updated_at ? new Date(work.updated_at) : now,
              changeFrequency: "monthly",
              priority: 0.7,
            });
          }
        });
      }
    }
  }

  // ==========================================
  // 3. 最新消息 (News)
  // ==========================================
  const newsJson = await getJson("/news");
  const newsList = Array.isArray(newsJson?.news) ? newsJson.news : [];

  newsList.forEach((item) => {
    const slug = item.url_slug || item.id;
    if (slug) {
      routes.push({
        url: `${SITE_URL}/news/${escape(slug)}`,
        lastModified: item.updated_at || item.publish_date ? new Date(item.updated_at || item.publish_date) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  });

  // ==========================================
  // 4. 部落格 (Blogs)
  // ==========================================
  const blogsJson = await getJson("/blogs");
  const blogList = Array.isArray(blogsJson?.blogs) ? blogsJson.blogs : [];

  blogList.forEach((item) => {
    // ★ 套用我們之前辛苦修復的 deriveSlug 邏輯
    const slug = deriveSlug(item);
    
    if (slug) {
      routes.push({
        url: `${SITE_URL}/blog/${escape(slug)}`,
        lastModified: item.updated_at || item.date || item.created_at ? new Date(item.updated_at || item.date || item.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  });

  return routes;
}