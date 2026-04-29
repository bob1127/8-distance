"use client";

import { useState, useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import {
  useReducedMotion,
  LazyMotion,
  domAnimation,
  MotionConfig,
  motion,
} from "framer-motion";
import Image from "next/image";
import AnimatedHeading from "@/components/AnimatedHeading";

const spring = { type: "spring", stiffness: 70, damping: 22, mass: 0.9 };

function WorkCard({ project, index }) {
  const ovTitle = project.overlayTitle ?? project.title;
  const computedTitle =
    project.image_title ??
    (project.tag ? `${project.title}｜${project.tag}` : project.title);
  const computedAlt = project.image_alt ?? project.title ?? "作品圖";
  const delay = (index % 6) * 0.06;

  return (
    <motion.a
      href={project.href}
      className="block will-change-transform"
      whileTap={{ scale: 0.98 }}
      style={{ transform: "translateZ(0)" }}
    >
      <motion.article
        data-workcard
        className="group relative overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          willChange: "transform, opacity",
          contain: "paint layout",
        }}
        variants={{
          hidden: { opacity: 0, y: 96, scale: 0.985 },
          show: (d = 0) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { ...spring, delay: d },
          }),
        }}
        custom={delay}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3, margin: "0px 0px 10% 0px" }}
      >
        <div className="relative w-full h-[400px] sm:h-[850px] max-h-[90vh] 2xl:h-[900px]">
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
            <div className="text-center max-w-[80%]">
              <h2 className="text-white leading-tight tracking-tight text-[28px] md:text-[32px] font-medium opacity-0 translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 will-change-transform">
                {ovTitle}
              </h2>
            </div>
          </div>
          <Image
            src={project.image}
            alt={computedAlt}
            title={computedTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="object-cover transform-gpu transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.06]"
            style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            priority={index < 2}
            draggable={false}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.35)] via-[rgba(0,0,0,0.12)] to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-black pointer-events-none opacity-0 transition-opacity duration-[520ms] ease-out group-hover:opacity-55" />
        </div>
        <style jsx>{`
          @media (hover: none), (pointer: coarse) {
            .group h2 {
              opacity: 1 !important;
              transform: none !important;
            }
            .group img {
              transform: none !important;
            }
            .group > div > div:nth-of-type(2) {
              opacity: 0.55 !important;
            }
          }
        `}</style>
      </motion.article>
    </motion.a>
  );
}

export default function Client({ title = "作品列表", items = [] }) {
  const reduce = useReducedMotion();
  const [displayTitle, setDisplayTitle] = useState(title);

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const res = await fetch("https://api.8distance.com/api/works");
        if (!res.ok) return;
        const data = await res.json();

        /**
         * ✅ 修正核心邏輯：
         * 因為您的 title 變數可能是「住宅空間設計作品...」，
         * 但 API 的分類名稱只有「住宅空間」。
         * 所以我們檢查 title 裡面是否「包含」API 的分類名稱。
         */
        const target = data.works_classifications?.find(
          (item) => title.includes(item.title) || item.title === title,
        );

        // 如果找到了且 works_title 不是 null，就更新
        if (target && target.works_title) {
          setDisplayTitle(target.works_title);
        }
      } catch (err) {
        console.error("抓取失敗:", err);
      }
    };

    if (title) fetchHeading();
  }, [title]);

  return (
    <ReactLenis root>
      <LazyMotion features={domAnimation}>
        <MotionConfig transition={spring} reducedMotion="user">
          {/* 頁首標題區 */}
          <section className="flex justify-center items-center flex-col sm:pt-[70px] pt-10 xl:pt-[150px]">
            <div className="flex items-center gap-4 mx-8 md:gap-6">
              <AnimatedHeading
                text={displayTitle}
                lineColor="#000"
                lineMax={120}
                lineThickness={1}
                yOffsetEm={0.08}
                duration={reduce ? 0 : 1.0}
                delay={reduce ? 0 : 0.12}
                firstVisitDelay={2}
                startDelay={0}
                resetOnExit={true}
              />
            </div>
            <p className="mt-2 tracking-[0.2em] text-sm text-gray-500">WORKS</p>
          </section>

          {/* 作品列表網格 */}
          <section className="section-portfolio-category py-10 bg-white text-black relative">
            <div className="w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((project, i) => (
                  <WorkCard key={project.id ?? i} project={project} index={i} />
                ))}
              </div>
            </div>
          </section>
        </MotionConfig>
      </LazyMotion>
    </ReactLenis>
  );
}
