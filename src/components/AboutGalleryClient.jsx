"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import MiniMapGallery from "./MiniMapGallery"; // ← 確認路徑：如果 MiniMapGallery 在 components 根目錄

export default function AboutGalleryClient({
  images = [], // 由 page.jsx 傳入，作為幻燈片清單
  thumbs = images, // 如果縮圖清單不同，可另外傳
  className = "",
}) {
  const galleryImages = useMemo(() => images.filter(Boolean), [images]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openBySrc = useCallback(
    (src) => {
      const i = galleryImages.indexOf(src);
      setIndex(i >= 0 ? i : 0);
      setOpen(true);
    },
    [galleryImages]
  );

  if (!galleryImages.length) return null;

  return (
    <>
      {/* 這裡示範渲染一到多張可點圖片；你也可以改成你的版型 */}
      <div className={className}>
        <div
          className="relative w-full overflow-hidden cursor-zoom-in"
          onClick={() => openBySrc(galleryImages[0])}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && openBySrc(galleryImages[0])
          }
        >
          {/* 純視覺遮罩避免攔截滑鼠：pointer-events-none */}
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
          <Image
            src={thumbs[0] ?? galleryImages[0]}
            alt="about-photo"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>

        {/* 如果要一排縮圖 */}
        {thumbs.length > 1 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {thumbs.slice(1).map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-[4/3] overflow-hidden rounded cursor-zoom-in"
                onClick={() => openBySrc(images[i + 1] ?? src)}
              >
                <div className="pointer-events-none absolute inset-0 bg-black/10" />
                <Image
                  src={src}
                  alt={`thumb-${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 彈窗（MiniMapGallery） */}
      {open && (
        <MiniMapGallery
          images={galleryImages}
          currentIndex={index}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
