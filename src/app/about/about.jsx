// app/about/page.jsx
// ✅ SSR + ISR：第一次就有完整 HTML；之後每 60 秒再生
export const revalidate = 60;

import Image from "next/image";
import GsapText from "../../components/RevealText/index";
import TimelineM062u03Client from "../../components/timeline";

/* ------------------------- 資料抓取與映射 ------------------------- */

const API = "https://api.ld-8distance.com/api/about";

// 給「公司歷程元件」吃的格式（維持你原本 timeline 的 props 結構）
function mapHistoryForTimeline(h) {
  const title =
    h?.title ?? h?.name ?? h?.step_title ?? h?.heading ?? "未命名項目";
  const text = h?.description ?? h?.content ?? h?.text ?? h?.body ?? "";
  const img =
    h?.image_url ?? h?.image ?? h?.cover ?? h?.picture ?? h?.photo ?? null;
  return { title, text, img };
}

function mapAbout(a) {
  return {
    title: a?.title ?? "關於捌程",
    descTW: a?.company_description_tw ?? "",
    descEN: a?.company_description_en ?? "",
    image: a?.image_url ?? "",
  };
}

function mapTeam(t) {
  return {
    position: t?.position ?? "",
    nameTW: t?.name_tw ?? "",
    nameEN: t?.name_en ?? "",
    image: t?.image_url ?? "",
    sort: Number(t?.sort_order ?? 0),
  };
}

async function getAboutData() {
  try {
    const res = await fetch(API, { next: { revalidate } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();

    const about = mapAbout((json?.abouts || [])[0] || {});
    const historiesForTimeline = Array.isArray(json?.about_histories)
      ? json.about_histories.map(mapHistoryForTimeline)
      : [];
    const teams = (Array.isArray(json?.about_teams) ? json.about_teams : [])
      .map(mapTeam)
      .sort((a, b) => a.sort - b.sort);

    return { about, historiesForTimeline, teams };
  } catch (e) {
    console.error("Fetch /api/about failed:", e);
    return { about: mapAbout({}), historiesForTimeline: [], teams: [] };
  }
}

// 把 \n\n 轉段落；單一 \n 轉 <br/>
function toParagraphs(s = "") {
  return s
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, "<br/>"))
    .filter((p) => p.trim());
}

/* ----------------------------- SEO ----------------------------- */

export async function generateMetadata() {
  const { about } = await getAboutData();
  const title = `${about.title}｜8distance 捌程室內設計`;
  const description =
    about.descTW.replace(/\s+/g, " ").slice(0, 160) ||
    "捌程專注室內設計、景觀與園區管理，融合風格與機能，打造舒適與美感並存的空間。";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.kuankoshi.com/about",
      images: about.image ? [{ url: about.image }] : undefined,
      type: "website",
    },
    alternates: { canonical: "https://www.kuankoshi.com/about" },
  };
}

/* --------------------------- Page --------------------------- */

export default async function AboutPage() {
  const { about, historiesForTimeline, teams } = await getAboutData();
  const paragraphsTW = toParagraphs(about.descTW);
  const paragraphsEN = toParagraphs(about.descEN);

  // ✅ JSON-LD（直接用 <script>，確保首屏 HTML 就包含）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "8distance 捌程室內設計",
    url: "https://www.kuankoshi.com",
    logo: "https://www.kuankoshi.com/images/logo/company-logo.png",
    description:
      "捌程專注於老屋翻新、商業空間與住宅設計，融合風格與機能，打造舒適與美感並存的空間。",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61550958051323",
      "https://www.instagram.com/kuankoshi.design",
    ],
    employee: teams.map((t) => ({
      "@type": "Person",
      name: t.nameTW || t.nameEN,
      jobTitle: t.position,
      image: t.image || undefined,
    })),
  };

  return (
    <main className="min-h-screen bg-[#f5f6f6] dark:bg-neutral-950 overflow-hidden">
      {/* JSON-LD：搜尋引擎第一次就看到完整資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="mt-[120px] lg:mt-[150px] max-w-[1920px] w-[90%] lg:w-[80%] mx-auto">
        <h1 className="text-2xl lg:text-5xl">{about.title}</h1>
        <hr />
      </section>

      {/* 公司故事（繁） */}
      <section className="my-5 flex lg:flex-row flex-col max-w-[1920px] w-[90%] md:w-[85%] 2xl:w-[80%] mx-auto">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-8">
          <div className="max-w-[750px]">
            <h2 className="text-xl lg:text-3xl">公司故事</h2>
            {paragraphsTW.map((p, i) => (
              <p
                key={i}
                className="text-[14px] leading-loose tracking-wider mt-3"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="aspect-[4/3] relative overflow-hidden">
            {about.image ? (
              <Image
                src={about.image}
                alt="關於捌程"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>
        </div>
      </section>

      {/* Story（EN） */}
      <section className="max-w-[1920px] w-[90%] md:w-[85%] 2xl:w-[80%] mx-auto">
        <h2 className="text-xl lg:text-3xl">Story</h2>
        {paragraphsEN.map((p, i) => (
          <p
            key={i}
            className="text-[14px] leading-relaxed mt-3"
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </section>

      {/* ✅ 公司歷程：維持原本的時間軸元件（資料已從 API 來） */}
      <section className="py-6">
        <TimelineM062u03Client items={historiesForTimeline} />
      </section>

      {/* ✅ 團隊成員（動態資料 + 原設計/動畫） */}
      <section className="section-staff">
        <div className="title pb-10 max-w-[1300px] mx-auto px-4">
          <h1 className="text-5xl mt-0 text-[#d79735] dark:text-white font-normal ">
            8-DISTANCE 捌程室內設計團隊
          </h1>
        </div>

        <div className="w-full mx-auto grid grid-cols-1 pb-20 px-4">
          {teams.map((t, idx) => (
            <div
              key={`${t.nameTW || t.nameEN || "member"}-${idx}`}
              className="flex flex-col md:flex-row"
            >
              {/* 交錯版（偶數文字左、奇數文字右），維持原樣式感 */}
              {idx % 2 === 0 ? (
                <>
                  <TeamText t={t} />
                  <TeamImage t={t} />
                </>
              ) : (
                <>
                  <TeamImage t={t} />
                  <TeamText t={t} />
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ------------------------- 子區塊（維持原動畫與視覺） ------------------------- */

function TeamText({ t }) {
  return (
    <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
      <div className="txt flex flex-col items-center justify-center">
        <p className="text-[26px]">{t.position}</p>
        <GsapText
          text={t.nameTW || t.nameEN || ""}
          id="gsap-intro"
          fontSize="1.3rem"
          fontWeight="800"
          color="#000"
          className="text-left tracking-widest inline-block mb-0 h-auto"
        />
        {/* 若要補描述可在 API 增欄位後這裡渲染 */}
      </div>
    </div>
  );
}

function TeamImage({ t }) {
  return (
    <div className="md:w-1/2 w-full">
      {t.image ? (
        <Image
          src={t.image}
          width={1200}
          height={1800}
          className="max-w-[600px] mx-auto h-auto"
          alt={t.nameTW || t.nameEN || "staff"}
          priority={false}
        />
      ) : (
        <div className="max-w-[600px] mx-auto aspect-[3/4] bg-neutral-200" />
      )}
    </div>
  );
}
