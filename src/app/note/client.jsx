"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import JanusButton from "../../components/JanusButton.jsx";
import JanusButton02 from "../../components/JanusButton2.jsx";
import Link from "next/link";
import ProjectSlider from "../../components/Project-Slider/Slider.jsx";

const categories = [
  { label: "住宅空間", value: "residential" },
  { label: "老屋翻新", value: "renovation" },
  { label: "純設計案", value: "design" },
  { label: "商業空間", value: "commercial" },
];

// ✅ 每個 item 可自訂：image / title / subtitle / overlayTitle / overlaySubtitle / tag / url
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
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project06.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
    },
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project06.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
    },
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project06.jpg",
      url: "/portfolio-inner",
      tag: "住宅空間",
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
    },
    {
      title: "光影簡約宅",
      subtitle: "18坪｜極簡動線 × 層次照明",
      overlayTitle: "員林程宅",
      overlaySubtitle: "極簡裡的細膩層次",
      image: "/images/project-01/project06.jpg",
      url: "/project/residential-2",
      tag: "住宅空間",
    },
    {
      title: "木質留白",
      subtitle: "20坪｜木質留白 × 充足採光",
      overlayTitle: "逸瓏山蔡宅",
      overlaySubtitle: "留白與木質的日常溫度",
      image: "/images/project-01/project04.jpg",
      url: "/project/residential-1",
      tag: "住宅空間",
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
    },
    {
      title: "純設計｜日系侘寂",
      subtitle: "侘寂質感 × 柔霧光影",
      overlayTitle: "日系侘寂",
      overlaySubtitle: "時間留下的美",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbitabashiooyama_mv-640x427.jpg",
      url: "/project/design-2",
      tag: "純設計案",
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
    },
  ],
};

const QaClient = () => {
  const [activeCategory, setActiveCategory] = useState("residential");

  return (
    <>
      <section>
        <ProjectSlider />
      </section>

      <section className="section-portfolio-category py-20 bg-white text-black">
        <div className="title flex  justify-center">
          <h2 className="text-2xl ">作品欣賞</h2>
        </div>
        <div className="max-w-[1920px] w-[95%] 2xl:w-[85%] mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
                  activeCategory === cat.value
                    ? "bg-[#E1A95F] text-white"
                    : "bg-white text-black border-gray-300 hover:bg-[#E1A95F] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Content with fade-in（沿用你原本的 DOM 與樣式） */}
          <div className="category-item min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {categoryContent[activeCategory]?.map((project, index) => {
                  const ovTitle = project.overlayTitle ?? project.title;
                  const ovSub =
                    project.overlaySubtitle ?? project.subtitle ?? "";
                  return (
                    <Link key={index} href={project.url}>
                      <div className=" border group hover:bg-transparent  p-5 bg-gray-200  relative h-[650px] group overflow-hidden   transition">
                        <div className="relative  w-full overflow-hidden h-[500px]">
                          <div className="txt left-4  bottom-3 z-50 absolute flex flex-col justify-center items-center">
                            <h2 className="text-white leading-tight tracking-tight text-[30px] font-normal">
                              {ovTitle}
                            </h2>
                            <p className="text-white text-base">
                              {ovSub || ""}
                            </p>
                          </div>
                          {/* 保留你原本的 Image 用法與外觀 */}
                          <Image
                            src={project.image}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 text-xl  tracking-wide font-semibold group-hover:text-gray-700">
                          {project.title}
                        </div>
                        <div className="tag">
                          <span className="border text-xs rounded-[20px] px-4 py-2">
                            {project.tag ?? "Title"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex gap-4 justify-center">
              <JanusButton label="更多作品" />
              <JanusButton02 label="更多作品" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QaClient;
