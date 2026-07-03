// app/qa/client.jsx
"use client";

import Image from "next/image";
import QaAccordion from "@/components/QAAccordionClient";

export default function Client({
  initialByCategory = { design_process: [], renovation_knowledge: [] },
  settings = [],
  defaultCategory = "design_process", // ✅ 接收從 URL [category] 傳進來的當前分類
}) {
  // 圖片處理邏輯：根據 sort_order 排序並取前 3 張
  const pics = Array.isArray(settings)
    ? settings
        .sort(
          (a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0)
        )
        .slice(0, 3)
    : [];

  // 候補圖片 (Fallback)
  const fallback = [
    {
      src: "https://i.pinimg.com/736x/02/cc/10/02cc10c07005e8fdbaabf88c5f79f75e.jpg",
      alt: "築夢美學",
    },
    {
      src: "https://i.pinimg.com/1200x/39/eb/fb/39ebfb42b7856c1aa315fcb63b4d50a9.jpg",
      alt: "境生於心",
    },
    {
      src: "https://i.pinimg.com/736x/23/6d/01/236d01715f52e1c84e7b78208bd3ced2.jpg",
      alt: "匠心空間",
    },
  ];

  // 整合圖片資料
  const images = (pics.length > 0 ? pics : fallback).map((x, i) => ({
    key: i,
    src: x.image_url || x.src,
    alt: x.image_alt || x.alt,
    title: x.image_title || x.title || "",
  }));

  return (
    <>
      {/* 標題區塊 */}
      <section className="max-w-[1500px] mx-auto xl:w-[80%] md:w-[90%] mt-[150px] px-6 w-full">
        <div className="flex flex-col items-start lg:items-end">
          <h1 className="tracking-tighter text-2xl sm:text-2xl m-0 xl:text-5xl font-bold">
            8-DISTANCE
          </h1>
        </div>
        <div className="flex justify-start md:justify-between items-start flex-col lg:flex-row lg:items-end mt-10">
          <p className="text-[18px] lg:text-[14px]">[您所需要的室內設計知識]</p>
          <p className="max-w-[450px] text-left lg:text-right text-[14px]">
            We believe every great space starts with clear communication.
          </p>
        </div>
      </section>

      {/* 圖片展示區塊 */}
      <section className="max-w-[1500px] mx-auto xl:w-[80%] lg:w-[90%] mt-20 px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => (
            <figure key={img.key}>
              <div className="aspect-[16/9] relative overflow-hidden rounded-2xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <figcaption className="mt-2 text-xs text-gray-500">
                [ {img.alt} ]
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* QA 手風琴區塊 */}
      <section className="max-w-[1500px] mx-auto xl:w-[80%] lg:w-[90%] my-10 px-6 w-full">
        {/* ✅ 將 Server 算好的分類傳進去，作為 activeCategory */}
        <QaAccordion
          initialByCategory={initialByCategory}
          activeCategory={defaultCategory}
          labels={{
            design_process: "設計流程",
            renovation_knowledge: "裝修知識",
          }}
        />
      </section>
    </>
  );
}
