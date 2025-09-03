"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const IMAGES = [
  "A7400023.jpg",
  "A7400066.jpg",
  "A7400069.jpg",
  "A7400078.jpg",
  "A7400081.jpg",
  "A7400141.jpg",
  "A7400162.jpg",
  "A7400165.jpg",
  "A7400219.jpg",
  "A7400237.jpg",
  "A7400300.jpg",
  "A7400347.jpg",
  "A7400428.jpg",
  "A7400432.jpg",
  "A7400453.jpg",
  "A7400462.jpg",
];

export default function AwardsLightbox({
  base = "/images/員林胡宅獎盃/",
  thumb = "A7400023.jpg",
  startIndex = 0,
}) {
  const [open, setOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(startIndex);

  const openAt = useCallback((idx = 0) => {
    setInitialIndex(idx);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* 縮圖 */}
      <div
        className="awards-item w-full overflow-hidden aspect-[16/9] relative cursor-zoom-in"
        onClick={() => openAt(initialIndex)}
        role="button"
        aria-label="開啟作品幻燈片"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openAt(initialIndex)}
      >
        <Image
          src={`${base}${thumb}`}
          alt="Awards preview"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[92vw] md:max-w-[1200px] h-[70vh] md:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={() => setOpen(false)}
              aria-label="關閉"
              className="absolute -top-10 right-0 md:top-0 md:-right-12 text-white/90 hover:text-white p-2 text-2xl"
            >
              ✕
            </button>

            {/* 自訂導航按鈕：白色圓形 + Arrow PNG */}
            <button className=" !text-transparent absolute top-1/2 -left-14 z-10  !h-[40px] !w-[40px] rounded-full bg-white "></button>
            <button className="!text-transparent absolute top-1/2 -right-14 z-10 flex !h-[40px] !w-[40px] items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition rotate-180">
              <Image
                src="https://www.pngarc.com/wp-content/uploads/2023/05/Arrow-free-content-quiver-arrow-lines-black-arrow-png.png"
                alt="下一張"
                width={20}
                height={20}
              />
            </button>

            {/* Swiper */}
            <Swiper
              modules={[Navigation, Pagination, Keyboard, A11y]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              initialSlide={initialIndex}
              spaceBetween={12}
              className="w-full h-full rounded-lg overflow-hidden bg-black"
            >
              {IMAGES.map((file, i) => (
                <SwiperSlide key={file}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={`${base}${file}`}
                      alt={`Awards ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={i <= 1}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}
