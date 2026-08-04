/** 正式站點網域（全站 canonical / JSON-LD / sitemap 統一使用） */
export const SITE_ORIGIN = "https://www.8distance.com";

/** Google 搜尋結果「網站名稱」用（Site Name，勿混英文網域） */
export const SITE_NAME = "捌程室內設計";

/** 首頁 canonical（與 GSC 已索引格式一致，含尾隨斜線） */
export const SITE_HOME = `${SITE_ORIGIN}/`;

/** 頁面設定 API（Footer / 選單社群連結同源） */
export const PAGES_API = "https://api.8distance.com/api/pages";

/** 社群預設（後台無值時使用；後台有值應覆蓋） */
export const DEFAULT_SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/HuDecorator?locale=zh_TW",
  instagram: "https://www.instagram.com/8_distance/",
  line: "https://page.line.me/655cyzya?oat_content=url&openQrModal=true",
  youtube: "https://www.youtube.com/@捌程室內設計",
};

/** 捌程官方 YouTube（@捌程景觀與室內設計 已失效 404） */
export const YOUTUBE_CHANNEL_URL = DEFAULT_SOCIAL_LINKS.youtube;

function decodeEntities(s) {
  return String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function pickInfo(list, key) {
  if (!Array.isArray(list)) return "";
  const found = list.find((x) => String(x?.key ?? "").trim() === key);
  return found?.value == null ? "" : String(found.value);
}

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

/**
 * 從 /api/pages 的 company_information 組出社群連結。
 * 後台有有效 http(s) 就覆蓋預設；YouTube 另走 resolve。
 */
export function socialLinksFromPages(json) {
  const infos = Array.isArray(json?.company_information)
    ? json.company_information
    : [];
  const raw = {
    facebook: decodeEntities(pickInfo(infos, "facebook")),
    instagram: decodeEntities(pickInfo(infos, "instagram")),
    line: decodeEntities(pickInfo(infos, "line")),
    youtube: decodeEntities(pickInfo(infos, "youtube")),
  };
  return {
    facebook: isHttpUrl(raw.facebook)
      ? raw.facebook
      : DEFAULT_SOCIAL_LINKS.facebook,
    instagram: isHttpUrl(raw.instagram)
      ? raw.instagram
      : DEFAULT_SOCIAL_LINKS.instagram,
    line: isHttpUrl(raw.line) ? raw.line : DEFAULT_SOCIAL_LINKS.line,
    youtube: resolveYouTubeUrl(raw.youtube),
  };
}

/** 即時抓取社群連結（勿 force-cache，否則後台改了前端仍舊） */
export async function fetchSocialLinks() {
  const res = await fetch(PAGES_API, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  return socialLinksFromPages(await res.json());
}

/** 組合絕對網址；path 為 `/about` 或 `about` */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_HOME;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
