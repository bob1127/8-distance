// app/works/client.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

/* === HoverCard（保持原動畫樣式；手機版：預設顯示文字＋移除 hover 黃色效果） === */
function HoverCard({
  title,
  subtitle = "作品欣賞",
  src,
  alt = "",
  titleAttr = "",
  overlayOpacity = 0.55,
}) {
  return (
    <div
      className="h-[100svh] md:h-screen relative overflow-hidden group isolate"
      style={{
        ["--ease"]: "cubic-bezier(0.22,0.61,0.36,1)",
        ["--dur-img"]: "900ms",
        ["--dur-mask"]: "520ms",
        ["--delay-sub"]: "120ms",
        ["--ov"]: overlayOpacity,
      }}
    >
      {/* 背景影像 */}
      <div
        className="absolute inset-0 transform-gpu will-change-transform transition-transform duration-[var(--dur-img)] ease-[var(--ease)] group-hover:scale-[1.06]"
        style={{ transformOrigin: "center center" }}
      >
        <Image
          src={src}
          alt={alt}
          title={titleAttr}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          className="block object-cover pointer-events-none select-none"
        />
      </div>

      {/* 黑色遮罩（hover） */}
      <div
        className="absolute inset-0 bg-black pointer-events-none opacity-0 transition-opacity ease-out"
        style={{ transitionDuration: "var(--dur-mask)" }}
      />
      <style jsx>{`
        .group:hover > div:nth-child(2) {
          opacity: var(--ov);
        }
      `}</style>

      {/* 中央文字 */}
      <div className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-white sm:text-4xl text-4xl lg:text-5xl leading-none transition-transform duration-500 ease-out group-hover:-translate-y-[2px] md:group-hover:text-[#c69c6d]">
          {title}
        </h2>
        <p
          className="text-xl font-light text-white mt-3 opacity-0 translate-y-2 transition-all ease-out md:group-hover:text-[#f1c353]"
          style={{
            transitionDuration: "600ms",
            transitionDelay: "var(--delay-sub)",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 互動行為調整（手機/減動效） */}
      <style jsx>{`
        .group:hover p {
          opacity: 1;
          transform: translateY(0);
        }
        @media (hover: none), (pointer: coarse) {
          .group > div:nth-child(1) {
            transform: none !important;
            will-change: auto !important;
          }
          .group:hover > div:nth-child(2) {
            opacity: 0 !important;
          }
          .group h2 {
            color: #ffffff !important;
            transform: none !important;
          }
          .group p {
            opacity: 1 !important;
            transform: none !important;
            color: #ffffff !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .group * {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* === 中文→英文翻譯對照 === */
const zhToEn = {
  住宅空間: "Residential Space",
  老屋翻新: "Old House Renovation",
  商業空間: "Commercial Space",
  辦公空間: "Office Space",
  樣品屋: "Show Flat",
};

/* === 主組件：自動翻譯副標 + 手機零縫隙設計 === */
export default function WorksCategoryClient({ categories = [] }) {
  return (
    <section className="section-works-category bg-black leading-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 leading-none">
        {categories.length > 0 ? (
          categories.map((c, i) => {
            const slugOrId = c?.slug || String(c?.id ?? i + 1);
            const translatedSubtitle = zhToEn[c.title] || "Works";
            return (
              <a
                key={slugOrId}
                href={`/works/${encodeURIComponent(slugOrId)}`}
                aria-label={(c?.titleAttr || c?.title || "作品分類").trim()}
                className="block w-full"
              >
                <HoverCard
                  title={c.title}
                  subtitle={translatedSubtitle}
                  src={c.cover || c.image_url || "/images/placeholder-16x9.jpg"}
                  alt={c.alt || c.image_alt || c.title || "作品分類"}
                  titleAttr={
                    c.titleAttr || c.image_title || c.title || "作品分類"
                  }
                  overlayOpacity={0.55}
                />
              </a>
            );
          })
        ) : (
          <>
            {/* ✅ 修正：這裡不能使用未定義的 c.title */}
            <a href="/works/residential" className="block w-full">
              <HoverCard
                title="住宅空間"
                subtitle="Residential Space"
                src="/images/index/商業空間-桃園招待所.jpg"
                titleAttr="Residential｜WORKS"
                overlayOpacity={0.55}
              />
            </a>
            <a href="/works/renovation" className="block w-full">
              <HoverCard
                title="老屋翻新"
                subtitle="Old House Renovation"
                src="/images/index/老屋翻新-李宅.webp"
                titleAttr="Renovation｜WORKS"
                overlayOpacity={0.55}
              />
            </a>
            <a href="/works/commercial" className="block w-full">
              <HoverCard
                title="商業空間"
                subtitle="Commercial Space"
                src="/images/index/住宅空間-程宅.webp"
                titleAttr="Design｜WORKS"
                overlayOpacity={0.55}
              />
            </a>
          </>
        )}
      </div>
    </section>
  );
}
