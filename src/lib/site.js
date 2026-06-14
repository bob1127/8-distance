/** 正式站點網域（全站 canonical / JSON-LD / sitemap 統一使用） */
export const SITE_ORIGIN = "https://www.8distance.com";

/** 首頁 canonical（與 GSC 已索引格式一致，含尾隨斜線） */
export const SITE_HOME = `${SITE_ORIGIN}/`;

/** 組合絕對網址；path 為 `/about` 或 `about` */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_HOME;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
