/** justfont 在 jf-active 後重新掃描 DOM（SPA / 動態內容必須） */
export function refreshJustFont() {
  if (typeof window === "undefined") return;

  const html = document.documentElement;

  function flush() {
    try {
      window._jf?.flush?.();
    } catch {
      /* ignore */
    }
  }

  if (html.classList.contains("jf-active")) {
    flush();
    return;
  }

  let n = 0;
  const timer = window.setInterval(() => {
    n += 1;
    if (html.classList.contains("jf-active")) {
      window.clearInterval(timer);
      flush();
    } else if (html.classList.contains("jf-inactive") || n > 48) {
      window.clearInterval(timer);
    }
  }, 250);
}

/** 內容晚於首次掃描的頁面，延遲多次 flush */
export function refreshJustFontDelayed(delays = [0, 400, 1200, 2500]) {
  delays.forEach((ms) => {
    window.setTimeout(refreshJustFont, ms);
  });
}
