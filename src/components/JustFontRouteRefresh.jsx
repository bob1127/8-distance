"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** SPA 換頁後，等 jf-active 再 flush 讓淚體套到新 DOM */
export default function JustFontRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;

    function flush() {
      if (!html.classList.contains("jf-active")) return;
      try {
        window._jf?.flush?.();
      } catch {
        /* ignore */
      }
    }

    flush();
    const t1 = window.setTimeout(flush, 400);
    const t2 = window.setTimeout(flush, 1200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
