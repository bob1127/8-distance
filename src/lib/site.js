/** 正式站點網域（全站 canonical / JSON-LD / sitemap 統一使用） */
export const SITE_ORIGIN = "https://www.8distance.com";

/** Google 搜尋結果「網站名稱」用（Site Name，勿混英文網域） */
export const SITE_NAME = "捌程室內設計";

/** 首頁 canonical（與 GSC 已索引格式一致，含尾隨斜線） */
export const SITE_HOME = `${SITE_ORIGIN}/`;

/** 捌程官方 YouTube（@捌程景觀與室內設計 已失效 404） */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@捌程室內設計";

/** 後台若仍填舊 handle，自動改為正確頻道 */
export function resolveYouTubeUrl(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return YOUTUBE_CHANNEL_URL;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.includes("捌程景觀與室內設計")) return YOUTUBE_CHANNEL_URL;
  } catch {
    /* ignore */
  }
  if (raw.includes("捌程景觀與室內設計")) return YOUTUBE_CHANNEL_URL;
  try {
    const u = new URL(raw);
    if (u.protocol === "http:" || u.protocol === "https:") return raw;
  } catch {
    /* ignore */
  }
  return YOUTUBE_CHANNEL_URL;
}

/** 組合絕對網址；path 為 `/about` 或 `about` */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_HOME;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
