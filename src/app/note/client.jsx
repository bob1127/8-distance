"use client";

import { useState, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProjectSlider from "../../components/Project-Slider/Slider.jsx";
import HeroSlider from "../../components/HeroSlideContact/page.jsx";
/* -------------------- 類別與資料 -------------------- */
const categories = [
  { label: "住宅空間", value: "residential" },
  { label: "老屋翻新", value: "renovation" },
  { label: "純設計案", value: "design" },
  { label: "商業空間", value: "commercial" },
];

const categoryContent = {
  residential: [
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-06-01",
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-05-20",
    },
    {
      title: "柔霧奶油宅",
      subtitle: "26坪｜米白層次 × 緩慢日常",
      overlayTitle: "南屯簡宅",
      overlaySubtitle: "靜謐色溫下的生活節奏",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-04-12",
    },
    {
      title: "石紋調性宅",
      subtitle: "32坪｜石材紋理 × 金屬點綴",
      overlayTitle: "七期沈宅",
      overlaySubtitle: "材質拼接的俐落高級感",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
      date: "2025-03-02",
    },
  ],
  renovation: [
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/project/residential-1",
      tag: "住宅空間",
      date: "2025-05-10",
    },
    {
      title: "格局翻新",
      subtitle: "28坪｜動線重塑 × 收納優化",
      overlayTitle: "西屯吳宅",
      overlaySubtitle: "中古屋的全新呼吸",
      image: "/images/project-01/project04.jpg",
      url: "/project/residential-2",
      tag: "住宅空間",
      date: "2025-04-05",
    },
    {
      title: "復古混搭",
      subtitle: "24坪｜老件 × 新材質共存",
      overlayTitle: "北屯黃宅",
      overlaySubtitle: "時間感與機能並存",
      image: "/images/project-01/project05.jpg",
      url: "/project/residential-3",
      tag: "住宅空間",
      date: "2025-03-22",
    },
  ],
  design: [
    {
      title: "純設計｜輕奢美學宅",
      subtitle: "灰金色調 × 石材與金屬點綴",
      overlayTitle: "輕奢美學宅",
      overlaySubtitle: "低調材質的高級感",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-1",
      tag: "純設計案",
      date: "2025-05-28",
    },
    {
      title: "純設計｜日式無印",
      subtitle: "原木 × 霧面白 × 關西調光",
      overlayTitle: "無印慢生活",
      overlaySubtitle: "留白與秩序的平衡",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-2",
      tag: "純設計案",
      date: "2025-03-18",
    },
    {
      title: "純設計｜工業感",
      subtitle: "清水模 × 黑鐵 × 大面採光",
      overlayTitle: "Loft Style",
      overlaySubtitle: "粗獷材質下的通透",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-3",
      tag: "純設計案",
      date: "2025-02-06",
    },
  ],
  commercial: [
    {
      title: "品牌服飾店",
      subtitle: "機能櫥窗 × 流線動線規劃",
      overlayTitle: "品牌服飾店",
      overlaySubtitle: "從試衣到結帳的一氣呵成",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-1",
      tag: "商業空間",
      date: "2025-07-01",
    },
    {
      title: "精品咖啡廳",
      subtitle: "吧台中島 × 陽光天井",
      overlayTitle: "拾光咖啡",
      overlaySubtitle: "香氣與光影的交會",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-2",
      tag: "商業空間",
      date: "2025-05-15",
    },
    {
      title: "複合選品店",
      subtitle: "流線動線 × 展示系統",
      overlayTitle: "Daily Select",
      overlaySubtitle: "逛起來順手的動線學",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-3",
      tag: "商業空間",
      date: "2025-04-01",
    },
  ],
};

/* -------------------- 卡片：scroll-linked fade-up -------------------- */
function FadeCard({ project }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.60"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const ySpring = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 });
  const oSpring = useSpring(opacity, {
    stiffness: 300,
    damping: 30,
    mass: 0.4,
  });

  const ovTitle = project.overlayTitle ?? project.title;
  const ovSub = project.overlaySubtitle ?? project.subtitle ?? "";

  return (
    <Link href={project.url}>
      <motion.div
        ref={ref}
        style={{
          y: ySpring,
          opacity: oSpring,
          willChange: "transform, opacity",
        }}
        className="group relative overflow-hidden"
      >
        <div className="relative w-full h-[590px] sm:h-[550px] xl:h-[700px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.20)] to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
            <div className="text-center max-w-[80%]">
              <h2 className="text-white leading-tight tracking-tight text-[28px] md:text-[32px] font-medium">
                {ovTitle}
              </h2>
              {!!ovSub && (
                <p className="text-white/90 text-sm md:text-base mt-2">
                  {ovSub}
                </p>
              )}
            </div>
          </div>

          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
      </motion.div>
    </Link>
  );
}

/* -------------------- 主元件：只保留 Tabs -------------------- */
export default function QaClient() {
  const [activeCategory, setActiveCategory] = useState("residential");
  const colsClass = "grid-cols-1 md:grid-cols-2";

  const items = useMemo(
    () =>
      (categoryContent[activeCategory] ?? []).map((it, idx) => ({
        id: `${activeCategory}-${idx}`,
        ...it,
      })),
    [activeCategory]
  );

  return (
    <>
      <section>
        <HeroSlider />
      </section>

      <section className="section-portfolio-category py-20 bg-white text-black">
        <div className="title flex justify-center">
          <h2 className="text-2xl">作品欣賞</h2>
        </div>

        <div className="max-w-[1920px] sm:w-[90%] w-full xl:w-[80%] mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`border-r-1 border-black pr-5 ${
                  cat.value === activeCategory ? "font-semibold" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="category-item min-h-[200px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="contents pointer-events-none" /* 避免退出層攔截滾動 */
              >
                <div className={`grid ${colsClass} gap-6`}>
                  {items.map((project) => (
                    <div key={project.id} className="pointer-events-auto">
                      <FadeCard project={project} />
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12 pointer-events-auto">
                      尚無作品
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
