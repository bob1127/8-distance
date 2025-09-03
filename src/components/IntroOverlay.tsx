// src/components/IntroOverlay.tsx
"use client";

import { useState } from "react";
import LogoIntro from "@/components/LogoIntro";

export default function IntroOverlay() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[999999999999999999]">
      <LogoIntro onDone={() => setShow(false)} />
    </div>
  );
}
