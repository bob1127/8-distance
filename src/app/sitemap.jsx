// app/sitemap.jsx

export const revalidate = 3600; // 每小時重新整理一次 sitemap 快取

export default async function sitemap() {
  // ✅ 1. 在這裡強制鎖定正確的網域，徹底擺脫舊的 kuan 網域
  const SITE_URL = "https://www.8distance.com";

  // ✅ 2. 靜態頁面清單 (首頁、關於我們、服務流程、作品總覽、最新消息、聯絡我們等)
  const staticRoutes = [
    "",
    "/about",
    "/service",
    "/works",
    "/news",
    "/contact",
    "/appointment",
    "/qa/design_process",
    "/qa/renovation_knowledge",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly", // 首頁設為 daily，其他 weekly
    priority: route === "" ? 1.0 : 0.8, // 首頁權重最高 1.0
  }));

  // ✅ 3. 動態抓取「作品分類」並加入 Sitemap
  let worksRoutes = [];
  try {
    const worksRes = await fetch("https://api.8distance.com/api/works");
    if (worksRes.ok) {
      const worksJson = await worksRes.json();
      const categories =
        worksJson?.works_classifications || worksJson?.classifications || [];

      categories.forEach((c) => {
        const slug = c.url_slug || c.title || c.id;
        if (slug) {
          worksRoutes.push({
            url: `${SITE_URL}/works/${encodeURIComponent(slug)}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      });
    }
  } catch (e) {
    console.error("Sitemap: fetch works failed", e);
  }

  // ✅ 4. 動態抓取「最新動態 (News)」並加入 Sitemap
  let newsRoutes = [];
  try {
    const newsRes = await fetch("https://api.8distance.com/api/news");
    if (newsRes.ok) {
      const newsJson = await newsRes.json();
      const newsList =
        (Array.isArray(newsJson?.news) && newsJson.news) ||
        (Array.isArray(newsJson?.data) && newsJson.data) ||
        (Array.isArray(newsJson) && newsJson) ||
        [];

      newsList.forEach((n) => {
        const slug = n.url_slug || n.work_name || n.id;
        if (slug) {
          // 嘗試抓取文章的最後更新時間，沒有的話用當下時間
          const lastMod =
            n.updated_at || n.published_at || new Date().toISOString();
          newsRoutes.push({
            url: `${SITE_URL}/news/${encodeURIComponent(slug)}`,
            lastModified: new Date(lastMod).toISOString(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      });
    }
  } catch (e) {
    console.error("Sitemap: fetch news failed", e);
  }

  // 將所有路由合併後吐出，Next.js 會自動把它轉成完美的 sitemap.xml！
  return [...staticRoutes, ...worksRoutes, ...newsRoutes];
}
