// app/about/page.jsx
// ✅ SSR + ISR：第一次就有完整 HTML；之後每 60 秒再生
export const revalidate = 60;
import GsapText from "../../components/RevealText/index";
import Image from "next/image";
import Script from "next/script";
import VerticalExpandGallery from "@/components/VerticalExpandGallery";

import Video from "../../components/Video"; // 你既有的元件（多半是 client，但可在 server page 中使用）
import TimelineM062u03Client from "../../components/timeline"; // 新增的客戶端時間軸元件（見下一檔）
import AboutGalleryClient from "../../components/AboutGalleryClient";
import { ReactLenis } from "@studio-freight/react-lenis";
// 依 API 常見欄位做映射，避免後端欄位命名異動造成頁面壞掉
function mapHistory(h) {
  const title =
    h?.title ?? h?.name ?? h?.step_title ?? h?.heading ?? "未命名項目";
  const text = h?.content ?? h?.description ?? h?.text ?? h?.body ?? "";
  const img =
    h?.image_url ?? h?.image ?? h?.cover ?? h?.picture ?? h?.photo ?? null;
  return { title, text, img };
}

async function getAboutHistories() {
  try {
    const res = await fetch("https://api.ld-8distance.com/api/about", {
      next: { revalidate: 60 }, // 與 export const revalidate 一致
    });
    if (!res.ok) {
      console.error("Fetch /api/about failed:", res.status);
      return [];
    }
    const json = await res.json().catch(() => ({}));
    const list = Array.isArray(json?.about_histories)
      ? json.about_histories
      : [];
    return list.map(mapHistory).filter((i) => i.title);
  } catch (e) {
    console.error("Fetch /api/about error:", e);
    return [];
  }
}

export default async function AboutPage() {
  const items = await getAboutHistories();

  // 結構化資料（可照你原本的需求調整）
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "寬越設計 Kuankoshi Design",
    url: "https://www.kuankoshi.com",
    logo: "https://www.kuankoshi.com/images/logo/company-logo.png",
    description:
      "寬越設計專注於老屋翻新、商業空間與住宅設計，融合風格與機能，打造舒適與美感並存的空間。",
    address: {
      "@type": "PostalAddress",
      streetAddress: "NTC國家商貿中心",
      addressLocality: "台中市",
      addressRegion: "台灣",
      postalCode: "407",
      addressCountry: "TW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "客戶服務",
      availableLanguage: ["zh-TW"],
      url: "https://www.kuankoshi.com/contact",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61550958051323",
      "https://www.instagram.com/kuankoshi.design",
    ],
  };
  // 準備要進彈窗的圖片清單（字串需與實際 src 完全一致）
  const galleryListA = [
    "/332.jpg",
    "/images/03-ADDＢ.webp",
    "/images/taiwan.webp",
  ];

  const galleryListB = [
    "/images/7caded2d-785f-4ccd-aa41-2c98678ca2fb.png",
    "https://i0.wp.com/draft.co.jp/wp-content/uploads/2024/11/ELLE-DECOR_2412_PCichiran.jpg?fit=1920%2C1280&quality=85&strip=all&ssl=1",
    "/images/a26ae4a7-fba6-4e16-b07f-1839b0add281.png",
  ];

  const imgs = [
    { src: "/images/staff/捌程室內設計張佩甄.jpg.avif", alt: "封面 1" },
    { src: "/images/staff/捌程室內設計胡萬福.jpeg.avif", alt: "封面 1" },
    { src: "/images/staff/蕭廷羽.jpg.avif", alt: "封面 1" },
    { src: "/images/staff/志芸.jpg.avif", alt: "封面 1" },
    { src: "/images/staff/李尉菁.jpg.avif", alt: "封面 1" },
    { src: "/images/staff/蘇蘇.jpg.avif", alt: "封面 1" },
  ];
  return (
    <main className="min-h-screen bg-[#f5f6f6] dark:bg-neutral-950 overflow-hidden">
      {/* JSON-LD：加強 SEO */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HERO 視訊區（保留你的原樣） */}
      <section className=" mt-[120px] lg:mt-[150px] mxa-w-[1920px] w-[90%] lg:w-[80%] mx-auto">
        <h1 className="tetx-2xl lg:text-5xl">關於捌程</h1>
        <hr />
      </section>
      <section className="section-story my-5  flex lg:flex-row flex-col max-w-[1920px] w-[90%] md:w-[85%] 2xl:w-[80%] mx-auto">
        <div className=" w-full  lg:w-1/2 pr-0 lg:pr-8">
          <div className="max-w-[750px]">
            <h2 className="text-xl lg:text-3xl">公司故事: </h2>
            <p className="tetx-[14px] leading-loose tracking-wider">
              捌程的起源，源於三位志同道合的兄弟姊妹。當初，一人專注於景觀設計，一人投入室內規劃，另一人則負責人事管理；在彼此的信任與默契下，共同奠定了捌程的基石。隨著業務逐步拓展，團隊分別成立了捌程室內設計、捌程景觀，以及專責園區管理的捌程悠旅，三大領域相輔相成，為每個案場注入完整而精緻的服務體驗。{" "}
            </p>
            <br></br>
            <p className="tetx-[14px] leading-loose tracking-wider">
              捌程室內設計深信空間本身即是一首無聲詩，透過結構比例與光影節奏的微妙交織，以質樸木紋、石材肌理為語彙，雕琢出流動且溫潤的生活場域。從概念發想至細節落實，匠心工藝與材質對話，讓每一處角落都蘊藏專屬的故事與情感。{" "}
            </p>
            <br></br>
            <p className="tetx-[14px] leading-loose tracking-wider">
              從構想到落成，捌程始終堅守用心聆聽、細膩打磨的初衷。每一個家，每一處庭院，都承載著對美好生活的想像──捌程邀請您，一同見證從設計萌芽到完美落成的每一段旅程。
            </p>
            <div className="en-slogan mt-5 flex flex-col">
              <b className="text-[18px]">
                設計不是裝修，是「把您的人生過得更有質感」的開始
              </b>
            </div>
          </div>
        </div>
        <div className=" w-full  lg:w-1/2 ">
          {" "}
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src="/images/about/公司歷程-hero.jpg"
              priority
              placeholder="empty"
              fill
              className="object-cover w-full"
            ></Image>
          </div>
        </div>
      </section>
      <section className="section-en-story flex lg:flex-row flex-col max-w-[1920px] w-[90%] md:w-[85%] 2xl:w-[80%] mx-auto">
        {" "}
        <div>
          <div className="">
            <h2 className="text-xl lg:text-3xl">Story: </h2>
            <p className="tetx-[14px]">
              The origin of 8distance began with three like-minded siblings. One
              devoted to landscape design, another to interior planning, and the
              other to personnel management. Built upon trust and a shared sense
              of purpose, they laid the foundation for 8distance. As their work
              expanded, the team established three branches: 8distance Interior
              Design, 8distance Landscape, and 8distance Leisure—These three
              sectors complement one another, delivering a seamless and refined
              service experience for every project.
            </p>
            <br></br>
            <p className="tetx-[14px]">
              8distance Interior Design believes that space itself is a silent
              poem. Through the subtle interplay of structural proportions and
              shifting light, and using the language of natural wood grains and
              stone textures, each environment is shaped into a fluid and gentle
              living experience. From conceptualization to execution,
              craftsmanship and material dialogue come together to imbue every
              corner with its own story and emotion.
            </p>
            <br></br>
            <p className="tetx-[14px]">
              From vision to completion, 8distance stays true to its commitment
              to careful listening and thoughtful execution. Every home, every
              garden, carries a shared dream of a better life—8distance invites
              you to witness every step of the journey, from the first spark of
              design to its graceful realization.
            </p>
            <div className="en-slogan mt-5 flex flex-col">
              <b className="text-[18px]">
                Design is not renovation; it’s where a more graceful life
                begins.{" "}
              </b>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="company-intro max-w-[1920px] mx-auto w-[88%] flex flex-row">
        <div className="left w-1/2 p-8">
          <div className="info bg-white p-4">
            <div className="top flex ">
              <div className="w-1/2 p-10 text-3xl">About 8Distance</div>
              <div className="txt w-1/2 leading-8 tracking-wider text-[14px] p-10">
                捌程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合。每個空間會因為不同的人所屬,而有著獨有的設計。程,以人為本為中心,創造功能合理、舒適優美、滿足物質和精神生活需要的室內環境,打造属於每個案件的獨有設計是捌程的理念,細心、用心與完美是捌程的宗旨!
              </div>
            </div>
            <div className="img aspect-[4/4] relative overflow-hidden  p-8">
              <Image
                src="/332.jpg"
                alt="company-img"
                placeholder="empty"
                loading="lazy"
                fill
                className="object-cover"
              ></Image>
            </div>
          </div>
        </div>
        <div className="left w-1/2 p-8">
          <div className="info ">
            <div className="top  flex ">
              <div className="w-1/2 p-10 text-3xl">公司外觀環境</div>
              <div className="txt w-1/2 leading-8 tracking-wider text-[14px] p-10">
                <h4 className="text-xl">Taichung</h4>
              </div>
            </div>
            <div className="px-10">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
              alias commodi laborum, pariatur neque odit. Dolores incidunt illum
              perferendis eaque velit veritatis animi nobis officia facilis,
              iste necessitatibus distinctio vel?
            </div>
            <div className="p-10 flex">
              <div className="w-1/2 overflow-hidden h-[550px] rounded-l-[150px]">
                <Image
                  src="/332.jpg"
                  alt="company-img"
                  placeholder="empty"
                  loading="lazy"
                  width={500}
                  height={800}
                  className="w-full"
                ></Image>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ✅ SEO 重要區塊：時間軸（伺服端已把資料塞進 HTML，第一次就有內容） */}
      <section className="py-6">
        {/* <div className="title my-10 flex flex-col justify-center items-center">
          <h2 className="text-neutral-900 mb-0 pb-0">COMPANY.ORIGINAL</h2>
          <p className="text-neutral-900">公司歷程</p>
        </div> */}
        <TimelineM062u03Client items={items} />
      </section>

      {/* Members 區（保留簡化版，避免在 Server Page 使用 hooks） */}
      <section className="section-staff">
        <div className="title pb-10 max-w-[1300px] mx-auto px-4">
          <h1 className="text-5xl mt-0 text-[#d79735] dark:text-white font-normal ">
            8-DISTANCE 捌程室內設計團隊
          </h1>
        </div>
        <div className="w-full mx-auto grid grid-cols-1  pb-20 px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
              <div className="txt flex flex-col items-center justify-center">
                <p className="  text-[26px]">CEO</p>
                <GsapText
                  text="胡萬福"
                  id="gsap-intro"
                  fontSize="1.3rem"
                  fontWeight="800"
                  color="#000"
                  className="text-left  tracking-widest inline-block mb-0 h-auto"
                />

                <p className="mt-3 text-[14px] text-center max-w-[550px] leading-loose -tracking-wider">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Commodi id harum repellendus soluta a nesciunt error
                  dignissimos. Laudantium recusandae, eum rerum, laboriosam hic
                  praesentium voluptatibus possimus facilis quae, nihil debitis?
                </p>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <Image
                src="/images/staff/捌程室內設計胡萬福.jpeg.avif"
                width={1200}
                height={1800}
                className="max-w-[600px] mx-auto h-auto "
                alt="staff"
                priority={false}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full">
              <Image
                src="https://static.wixstatic.com/media/b69ff1_b341c8c3f39e420abf4a4f626868096e~mv2.jpg/v1/crop/x_0,y_0,w_4000,h_5143/fill/w_289,h_372,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/捌程室內設計張佩甄.jpg"
                width={1200}
                height={1800}
                className="max-w-[600px] mx-auto h-auto "
                alt="staff"
                priority={false}
              />
            </div>
            <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
              <div className="txt flex flex-col items-center justify-center">
                <p className="  text-[26px]"> InteriorDesign Manager</p>

                <GsapText
                  text="JEN 張褞矇"
                  id="gsap-intro"
                  fontSize="1.3rem"
                  fontWeight="800"
                  color="#000"
                  className="text-left  tracking-widest inline-block mb-0 h-auto"
                />

                <p className="mt-3 text-[14px] text-center max-w-[550px] leading-loose -tracking-wider">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Commodi id harum repellendus soluta a nesciunt error
                  dignissimos. Laudantium recusandae, eum rerum, laboriosam hic
                  praesentium voluptatibus possimus facilis quae, nihil debitis?
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
              <div className="txt flex flex-col items-center md:items-start">
                <p className="border text-center rounded-[15px] px-4 py-1 font-bold max-w-[200px]">
                  設計
                </p>
                <GsapText
                  text="蕭廷羽"
                  id="gsap-intro"
                  fontSize="1.3rem"
                  fontWeight="800"
                  color="#000"
                  className="text-left  tracking-widest inline-block mb-0 h-auto"
                />

                <h3 className="mt-3 text-2xl md:text-3xl font-semibold"></h3>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <Image
                src="/images/staff/蕭廷羽.jpg.avif"
                width={1200}
                height={1800}
                className="max-w-[600px] mx-auto h-auto "
                alt="staff"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
