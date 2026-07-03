/** JustFont flush：全站唯一協調器，合併重複請求避免文字跳動 */

const DEBOUNCE_MS = 400;
const ACTIVE_POLL_MS = 250;
const ACTIVE_POLL_MAX = 48;

let debounceTimer = null;
let activeWaitTimer = null;
const scheduledDelays = new Set();

function isJustFontActive() {
  return document.documentElement.classList.contains("jf-active");
}

function doFlush() {
  try {
    window._jf?.flush?.();
  } catch {
    /* ignore */
  }
}

function waitForActiveThenFlush() {
  if (typeof window === "undefined") return;

  if (isJustFontActive()) {
    doFlush();
    return;
  }

  if (activeWaitTimer !== null) return;

  let n = 0;
  activeWaitTimer = window.setInterval(() => {
    n += 1;
    const html = document.documentElement;
    if (html.classList.contains("jf-active")) {
      window.clearInterval(activeWaitTimer);
      activeWaitTimer = null;
      doFlush();
    } else if (html.classList.contains("jf-inactive") || n >= ACTIVE_POLL_MAX) {
      window.clearInterval(activeWaitTimer);
      activeWaitTimer = null;
    }
  }, ACTIVE_POLL_MS);
}

/** 短時間內多次呼叫會合併為一次 flush */
export function refreshJustFont() {
  if (typeof window === "undefined") return;

  if (debounceTimer !== null) {
    window.clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    debounceTimer = null;
    waitForActiveThenFlush();
  }, DEBOUNCE_MS);
}

/** 延遲 flush；同毫秒值只排程一次 */
export function refreshJustFontDelayed(delays = [0, 1200]) {
  if (typeof window === "undefined") return;

  for (const ms of [...new Set(delays)].sort((a, b) => a - b)) {
    if (scheduledDelays.has(ms)) continue;
    scheduledDelays.add(ms);

    window.setTimeout(() => {
      scheduledDelays.delete(ms);
      refreshJustFont();
    }, ms);
  }
}

/** 換頁時清除排程，避免舊頁與新頁 flush 疊加 */
export function resetJustFontSchedule() {
  scheduledDelays.clear();
  if (debounceTimer !== null) {
    window.clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
