// app/sitemap.js

export const revalidate = 86400; // 1天更新一次

const SITE_URL = "https://www.8distance.com";
const API_ROOT = "https://api.8distance.com/api";

// 工具：網址編碼
const escape = (str) => (str ? encodeURIComponent(String(str).trim()) : "");

// 工具：Fetch JSON + 錯誤記錄
async function getJson(endpoint) {
  const url = `${API_ROOT}${endpoint}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
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

export default async function sitemap() {
  const routes = [];
  const now = new Date();

  console.log("🔄 Generating Sitemap...");

  // ==========================================
  // 1. 靜態頁面
  // ==========================================
  const staticPages = [
    "", "/about", "/service", "/qa", 
    "/qa/design_process", "/qa/renovation_knowledge",
    "/contact", "/news", "/blog", "/works", "/video"
  ];

  staticPages.forEach((route) => {
    routes.push({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
    });
  });

  // ==========================================
  // 2. 作品集 (Works)
  // ==========================================
  const worksJson = await getJson("/works");
  
  // 您的 Works API 結構通常有 works_classifications
  const classifications = 
    worksJson?.works_classifications || 
    worksJson?.classifications || 
    [];
  
  console.log(`✅ Found ${classifications.length} work categories`);

  for (const cat of classifications) {
    const catSlug = cat.url_slug || cat.title || cat.name || cat.id;
    if (!catSlug) continue;

    routes.push({
      url: `${SITE_URL}/works/${escape(catSlug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    if (cat.id) {
      const catDetail = await getJson(`/works/classifications/${cat.id}`);
      // 嘗試抓取作品列表，相容多種欄位
      const items = 
        catDetail?.works_portfolios || 
        catDetail?.works || 
        catDetail?.data?.works || 
        catDetail?.works_list ||
        [];
      
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((work) => {
          const workSlug = work.url_slug || work.name || work.title || work.id;
          if (workSlug) {
            routes.push({
              url: `${SITE_URL}/works/${escape(catSlug)}/${escape(workSlug)}`,
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
  // API 回傳結構: { "news": [...] }
  // ==========================================
  const newsJson = await getJson("/news");
  const newsList = Array.isArray(newsJson?.news) ? newsJson.news : [];
  
  console.log(`✅ Found ${newsList.length} news items`);

  newsList.forEach((item) => {
    // 優先使用 url_slug，若無則使用 id
    // 注意：url_slug 可能是中文，需要 escape
    const slug = item.url_slug || item.id;
    
    if (slug) {
      routes.push({
        url: `${SITE_URL}/news/${escape(slug)}`,
        lastModified: item.publish_date ? new Date(item.publish_date) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  });

  // ==========================================
  // 4. 部落格 (Blogs)
  // API 回傳結構: { "blogs": [...] }
  // ==========================================
  const blogsJson = await getJson("/blogs");
  const blogList = Array.isArray(blogsJson?.blogs) ? blogsJson.blogs : [];

  console.log(`✅ Found ${blogList.length} blog posts`);

  blogList.forEach((item) => {
    // Blog 資料看似沒有 slug 欄位，只有 id
    // 所以強制使用 id 生成網址: /blog/8
    const slug = item.id; 
    
    if (slug) {
      routes.push({
        url: `${SITE_URL}/blog/${escape(slug)}`,
        // 雖然 blog 沒給 updated_at，但通常不會常變動，用 now 或預設值
        lastModified: now, 
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  });

  console.log(`🎉 Sitemap generated with ${routes.length} URLs`);
  return routes;
}