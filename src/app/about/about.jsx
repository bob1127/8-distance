/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import AnimatedLine from "@/components/AnimatedLine";
import TimelineM062u03Client from "../../components/timeline";
import GsapText from "../../components/RevealText";
import AnimatedHeading from "@/components/AnimatedHeading";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { motion } from "framer-motion";

/* ---------------- 工具 ---------------- */
function normalizeTimeline(items = []) {
  return items.map((it) => {
    const raw = it?.description ?? it?.desc ?? it?.text ?? "";
    const str = String(raw ?? "");
    // 若本身就有 HTML 標籤，直接使用；否則才把換行轉 <br/>
    const hasHtml = /<\/?[a-z][\s\S]*>/i.test(str);
    const description = hasHtml ? str : str.replace(/\n/g, "<br/>");
    return { ...it, description };
  });
}
const getNameEN = (t = {}) => t.nameEN || t.name_en || t.nameEn || "";
const getNameTW = (t = {}) =>
  t.nameTW || t.name_tw || t.nameZh || t.name_zh || "";
const getImageUrl = (t = {}) => t.image || t.image_url || t.photo || "";
const getImageAlt = (t = {}) => t.imageAlt || t.image_alt || "";
const getImageTitle = (t = {}) => t.imageTitle || t.image_title || "";

/* ---------------- 團隊文字 ---------------- */
function TeamText({ t }) {
  const nameEN = getNameEN(t);
  const nameTW = getNameTW(t);
  const displayName = nameTW || nameEN || "";

  const mottoZh = t.mottoTW || t.mottoZh || t.motto_zh || "";
  const mottoEn = t.mottoEN || t.mottoEn || t.motto_en || "";
  const mottoRaw = t.motto || "";

  return (
    <div className="md:w-1/2 p-10 lg:p-0 w-full flex justify-center items-center mb-6 md:mb-0">
      <div className="txt flex flex-col items-center justify-center text-center">
        {t.position && (
          <p
            className="text-[18px] md:text-[20px] tracking-widest text-neutral-700"
            itemProp="jobTitle"
          >
            『 {t.position} 』
          </p>
        )}

        {displayName && (
          <GsapText
            text={displayName}
            id={`team-name-${displayName}`}
            fontSize="1.8rem"
            fontWeight="800"
            color="#000"
            className="leading-none mt-4 inline-block h-auto"
          />
        )}

        {nameEN && (
          <p
            className="mt-2 text-[14px] md:text-[15px] tracking-[0.25em] uppercase text-neutral-600"
            itemProp="additionalName"
          >
            {nameEN}
          </p>
        )}

        {(mottoZh || mottoEn || mottoRaw) && (
          <div className="mt-8 flex flex-col items-center gap-2.5 max-w-[28rem]">
            {mottoZh && (
              <p
                className="text-[14px] text-neutral-700 leading-relaxed break-words max-w-[36rem]"
                lang="zh-Hant"
                dangerouslySetInnerHTML={{ __html: mottoZh }}
              />
            )}
            {mottoEn && (
              <p
                className="text-[13px] text-neutral-500 italic leading-relaxed break-words max-w-[36rem]"
                lang="en"
                dangerouslySetInnerHTML={{ __html: mottoEn }}
              />
            )}
            {!mottoZh && !mottoEn && mottoRaw && (
              <p
                className="text-[14px] text-neutral-700 leading-relaxed break-words max-w-[36rem]"
                dangerouslySetInnerHTML={{ __html: mottoRaw }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 團隊圖片 ---------------- */
function TeamImage({ t }) {
  const displayName = getNameTW(t) || getNameEN(t) || "staff";
  const altRaw = getImageAlt(t);
  const titleRaw = getImageTitle(t);
  const imgUrl = getImageUrl(t);

  const computedAlt = altRaw?.trim()
    ? altRaw
    : t.position && displayName
    ? `${displayName}（${t.position}）- 8distance 捌程室內設計`
    : `${displayName} - 8distance 捌程室內設計`;

  const computedTitle = titleRaw?.trim()
    ? titleRaw
    : `${displayName}｜8distance 捌程室內設計`;

  return (
    // 這一層 div 負責控制寬度佔一半 (md:w-1/2)
    <div className="md:w-1/2 w-full">
      <figure className="w-full">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={computedAlt}
            title={computedTitle}
            // 關鍵修改開始：改用響應式寬高，而非 fill
            width={0}
            height={0}
            sizes="100vw" // 告訴 Next.js 這張圖在不同斷點下大概佔多寬，優化加載
            priority={false}
            // w-full 撐滿寬度，h-auto 自動計算高度以維持原比例
            className="w-full h-auto display-block"
            // 關鍵修改結束
          />
        ) : (
          // 當沒有圖片時的佔位符，給一個預設比例 (例如 16:9) 讓它有空間
          <div className="w-full aspect-video grid place-items-center bg-neutral-200 text-neutral-500 font-bold tracking-widest">
            無照片
          </div>
        )}
        <figcaption className="sr-only">{computedAlt}</figcaption>
      </figure>
    </div>
  );
}
/* ---------------- 動畫設定：得獎獎牌（保留桌機網格） ---------------- */
const easeOut = [0.22, 1, 0.36, 1];
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.66, ease: easeOut },
  },
};

/* ---------------- 主畫面（不在客端注入 JSON-LD） ---------------- */
export default function Client({
  about,
  teams = [],
  historiesForTimeline = [],
}) {
  const descTW =
    about?.descTW || about?.company_description_tw || about?.desc_tw || "";
  const descEN =
    about?.descEN || about?.company_description_en || about?.desc_en || "";
  const timelineItems = normalizeTimeline(historiesForTimeline);

  return (
    <main
      className="min-h-screen bg-[#f0efef] overflow-hidden"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      {/* HERO 區塊 */}
      <header
        className="mt-4 lg:mt-6 max-w-[1920px] w-[90%] md:w-[75%] xl:w-[70%] mx-auto"
        id="main-content"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <AnimatedLine
            width={160}
            height={1}
            origin="right"
            delay={3}
            duration={1.8}
          />
        </div>
        <p className="sr-only" itemProp="description">
          捌程專注室內設計、景觀與園區管理，融合風格與機能，打造舒適與美感並存的空間。
        </p>
        <hr className="mt-3" />
      </header>

      {/* 關於區塊：左文右圖 */}
      <section className="flex lg:flex-row flex-col">
        {/* 圖片 */}
        <div className="right w-full lg:w-1/2 lg:mb-0 mb-5 order-1 lg:order-2">
          <div className="aspect-[4/4] w-full h-full overflow-hidden relative">
            {about?.image ? (
              <Image
                src={about.image}
                alt={about.imageAlt || "about image"}
                title={about.imageTitle || "about"}
                priority
                className="object-cover"
                fill
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-neutral-200 text-neutral-500">
                無封面圖片
              </div>
            )}
          </div>
        </div>

        {/* 文字 */}
        <div className="left px-4 flex justify-center items-center sm:p-10 p-5 lg:p-20 w-full lg:w-1/2 order-2 lg:order-1">
          <div>
            <AnimatedLine
              width="100%"
              height={0.5}
              origin="right"
              delay={3}
              duration={1.8}
            />
            <h1 className="leading-none mt-2 mb-[-2px] text-nowrap lg:mt-2">
              {about?.title || "關於捌程"}
            </h1>
            <AnimatedLine
              width="100%"
              height={0.5}
              origin="right"
              delay={3}
              duration={1.8}
            />

            {descTW ? (
              <div
                className="text-[14px] tracking-widest mt-4 prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: descTW }}
              />
            ) : (
              <p className="text-[14px] tracking-widest mt-4 text-neutral-500">
                （公司簡介尚無內容）
              </p>
            )}

            <TextGenerateEffect
              words={`設計不是裝修\n是「把您的人生過得更有質感」的開始`}
            />

            {descEN && (
              <div
                className="leading-loose tracking-wider text-[14px] font-light mt-6 prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: descEN }}
              />
            )}
          </div>
        </div>
      </section>

      {/* 團隊成員 */}
      <section
        id="team"
        className="section-staff"
        aria-labelledby="section-team"
      >
        <div className="w-full mx-auto grid grid-cols-1 pb-20 ">
          {teams.map((t, idx) => (
            <article
              key={`${getNameTW(t) || getNameEN(t) || "member"}-${idx}`}
              className={`flex flex-col md:flex-row ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              itemScope
              itemType="https://schema.org/Person"
            >
              <TeamImage t={t} />
              <TeamText t={t} />
            </article>
          ))}
          {teams.length === 0 && (
            <p className="text-center text-neutral-500 py-10">
              （尚無團隊資料）
            </p>
          )}
        </div>
      </section>

      {/* 公司歷程 + （桌機）獎牌牆；「行動版獎牌區塊」已刪除 */}
      <section
        id="history"
        className="py-6 max-w-[1920px] w-[90%] md:w-[95%] xl:w-[70%] mx-auto"
        aria-labelledby="section-history"
      >
        <h2 id="section-history" className="sr-only">
          公司歷程
        </h2>

        <div className="flex justify-center items-center">
          {/* 桌機版：靜態獎牌牆（保留） */}

          {/* 時間軸（吃進你後台的 HTML/文字） */}
          <TimelineM062u03Client items={timelineItems} />
        </div>

        {/* 你指定移除的「行動版獎牌牆」區塊已刪除 */}
      </section>
    </main>
  );
}
