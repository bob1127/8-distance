"use client";

import { useCallback } from "react";

export default function BackToTopButton() {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white flex justify-center items-center rounded-full w-[50px] h-[50px] hover:bg-neutral-800 transition"
      aria-label="回到頂部"
    >
      ↑
    </button>
  );
}
