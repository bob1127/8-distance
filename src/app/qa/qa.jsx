"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProjectSlider from "../../components/Project-Slider/Slider.jsx";
import { defaultVelocity } from "@tsparticles/engine";
const categories = [
  { label: "住宅空間", value: "residential" },
  { label: "老屋翻新", value: "renovation" },
  { label: "純設計案", value: "design" },
  { label: "商業空間", value: "commercial" },
];

// ✅ 每個分類對應的作品列表（可自訂）
const categoryContent = {
  residential: [
    {
      title: "北歐風小宅",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
      url: "/project/residential-1",
    },
    {
      title: "光影簡約宅",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
      url: "/project/residential-2",
    },
  ],
  renovation: [
    {
      title: "老屋翻新｜現代混搭風",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/12kanda_mv2-1920x1281.png",
      url: "/project/renovation-1",
    },
  ],
  design: [
    {
      title: "純設計｜輕奢美學宅",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/rakuro_mv-640x427.jpg",
      url: "/project/design-1",
    },
    {
      title: "純設計｜日系侘寂",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbitabashiooyama_mv-640x427.jpg",
      url: "/project/design-2",
    },
  ],
  commercial: [
    {
      title: "品牌服飾店",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbkamata_mv-640x427.jpg",
      url: "/project/commercial-1",
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
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
                  activeCategory === cat.value
                    ? "bg-black text-white"
                    : "bg-white text-black border-black hover:bg-black hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Content with fade-in */}
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
                {categoryContent[activeCategory]?.map((project, index) => (
                  <Link key={index} href={project.url}>
                    <div className="block border group hover:bg-transparent  p-5 bg-gray-200  relative h-[650px] group overflow-hidden   transition">
                      <div className="relative  w-full overflow-hidden h-[500px]">
                        <div className="txt left-4  bottom-3 z-50 absolute flex flex-col justify-center items-center">
                          <h2 className="text-white leading-tight tracking-tight text-[30px] font-normal">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                          </h2>
                          <p className="text-white text-base"></p>
                        </div>
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
                          Title
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="more max-w-[210px] py-5">
              <div className="bg-black rounded-[6px]">
                <div className="text-whiteg flex justify-center items-center py-3 text-[16px] w-[80%] border-r-1 border-white text-white font-normal">
                  Read More
                </div>
                <div className="w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QaClient;
