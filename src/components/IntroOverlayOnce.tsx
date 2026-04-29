"use client";

import React, { useEffect, useState } from "react";
import IntroOverlay from "./IntroOverlay";

export default function IntroOverlayOnce() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 等 component 在瀏覽器端 mount 完成
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 每次進到首頁（有用到這個 component）都會播動畫
  return <IntroOverlay />;
}
