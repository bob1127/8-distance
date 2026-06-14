"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { refreshJustFontDelayed } from "@/lib/justfont";

const HOME_DELAYS = [0, 400, 1000, 2000, 3500, 5000];
const DEFAULT_DELAYS = [0, 400, 1200, 2500];

/** 換頁後多次 flush，首頁 ssr:false 需更長等待 */
export default function JustFontRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const delays = pathname === "/" ? HOME_DELAYS : DEFAULT_DELAYS;
    refreshJustFontDelayed(delays);
  }, [pathname]);

  return null;
}
