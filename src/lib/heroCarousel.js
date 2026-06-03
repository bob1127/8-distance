/** 解析 YouTube 影片 ID */
export function getYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = String(url).match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/** 後台「是否顯示」：API 若已篩選則預設 true */
export function isHeroSlideVisible(row) {
  if (!row) return false;
  const url = String(row?.video_url ?? "").trim();
  if (!url) return false;

  const show = row.is_show ?? row.isShow ?? row.show;
  if (show === false || show === 0 || show === "0") return false;
  return true;
}

/**
 * 從 /api/front 的 front_carouse_video 建立輪播列表
 * 依 sort_order 升冪；支援 mp4 直連與 YouTube
 */
export function buildHeroSlides(frontData) {
  const list = Array.isArray(frontData?.front_carouse_video)
    ? frontData.front_carouse_video
    : [];

  return list
    .filter(isHeroSlideVisible)
    .sort(
      (a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0),
    )
    .map((row, idx) => {
      const url = String(row.video_url).trim();
      const youtubeId = getYouTubeId(url);
      return {
        key: String(row.id ?? `${idx}-${url}`),
        type: youtubeId ? "youtube" : "mp4",
        url,
        youtubeId,
        poster: row.image_url || null,
        title: row.title || "",
      };
    });
}
