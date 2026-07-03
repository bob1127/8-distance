"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  refreshJustFont,
  refreshJustFontDelayed,
  resetJustFontSchedule,
} from "@/lib/justfont";

const LATE_CONTENT_MS = 3000;
const MUTATION_DEBOUNCE_MS = 800;

/** 換頁後統一 flush；動態內容由 MutationObserver 補掃（debounce） */
export default function JustFontRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    resetJustFontSchedule();
    refreshJustFontDelayed([0, 1200]);

    let mutationTimer = null;
    let stopTimer = null;
    let stopped = false;

    const observer = new MutationObserver(() => {
      if (stopped) return;
      if (mutationTimer) window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(() => {
        refreshJustFont();
      }, MUTATION_DEBOUNCE_MS);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    stopTimer = window.setTimeout(() => {
      stopped = true;
      observer.disconnect();
      if (mutationTimer) window.clearTimeout(mutationTimer);
    }, LATE_CONTENT_MS);

    return () => {
      stopped = true;
      observer.disconnect();
      if (mutationTimer) window.clearTimeout(mutationTimer);
      if (stopTimer) window.clearTimeout(stopTimer);
      resetJustFontSchedule();
    };
  }, [pathname]);

  return null;
}
