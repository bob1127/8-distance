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
      <section className="section-video aspect-[1/1] md:aspect-[1024/576] xl:aspect-[1920/768] relative overflow-hidden">
        <div className="w-full ">
          <div className="mask absolute top-0 left-0 z-10 w-full h-full bg-black/30"></div>
          <div className="content absolute w-full h-full top-0 left-0 z-20">
            <div className="flex h-[80vh] flex-row ">
              {/* <div className="left w-1/2  flex  justify-center items-center  ">
                <h1 className="text-white font-normal text-7xl">NEW</h1>
              </div> */}
            </div>
          </div>
          <section>
            <div className="aspect-[1/1] md:aspect-[1024/576] xl:aspect-[1920/768] relative overflow-hidden">
              <Image
                src="/images/about/公司歷程-hero.jpg"
                priority
                placeholder="empty"
                fill
                className="object-cover w-full"
              ></Image>
            </div>
          </section>
        </div>
      </section>
      <section className="section-story flex lg:flex-row flex-col max-w-[1920px] w-[90%] md:w-[85%] 2xl:w-[80%] mx-auto">
        <div className=" w-full p-3 lg:w-1/2 lg:p-8">
          <div className="max-w-[750px]">
            <h1 className="text-3xl">公司故事: </h1>
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
          </div>
        </div>
        <div className=" w-full p-3 lg:w-1/2 lg:p-8">
          <div className="max-w-[750px]">
            <h1 className="text-3xl">Story: </h1>
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
        <div className="title my-10 flex flex-col justify-center items-center">
          <h2 className="text-neutral-900 mb-0 pb-0">COMPANY.ORIGINAL</h2>
          <p className="text-neutral-900">公司歷程</p>
        </div>
        <TimelineM062u03Client items={items} />
      </section>

      {/* Members 區（保留簡化版，避免在 Server Page 使用 hooks） */}
      {/* <section className="section-staff">
        <div className="title pb-10 max-w-[1300px] mx-auto px-4">
          <h1 className="text-[28px] mt-0 text-black dark:text-white font-normal ">
            <p className="text-[14px] font-bold text-[#126844]">Members</p>
            捌程室內設計
          </h1>
        </div>
        <div className="w-full mx-auto grid grid-cols-1  pb-20 px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
              <div className="txt flex flex-col items-center md:items-start">
                <p className="border text-center rounded-[15px] px-4 py-1 font-bold max-w-[200px]">
                  捌程室內設計
                </p>
                <GsapText
                  text="胡萬福"
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
                src="/images/staff/捌程室內設計胡萬福.jpeg.avif"
                width={1200}
                height={1800}
                className="w-full h-auto "
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
                className="w-full h-auto "
                alt="staff"
                priority={false}
              />
            </div>
            <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
              <div className="txt flex flex-col items-center md:items-start">
                <p className="border text-center rounded-[15px] px-4 py-1 font-bold max-w-[200px]">
                  設計總監
                </p>
                <GsapText
                  text="JEN 張褞矇"
                  id="gsap-intro"
                  fontSize="1.3rem"
                  fontWeight="800"
                  color="#000"
                  className="text-left  tracking-widest inline-block mb-0 h-auto"
                />

                <h3 className="mt-3 text-2xl md:text-3xl font-semibold"></h3>
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
                className="w-full h-auto "
                alt="staff"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section> */}
      <section className="w-full bg-custom-gradient section-content">
        <main className="min-h-screen max-w-[1920px] w-full flex-col pt-20 border bg-neutral-900 text-white flex items-center justify-center">
          <div className="title mb-10 flex flex-col justify-center items-center">
            <h2 className="text-white mb-0 pb-0">DESIGN.TEAM</h2>
            <p className="text-gray-200">我們的設計團隊</p>
          </div>
          <VerticalExpandGallery
            images={imgs}
            captions={[
              "​Jen 張褞矇",
              "Hu 胡褰霡",
              "​Artin 蕭廷羽",
              "Claire 徐志芸",
              "Weijing ​李尉菁",
              "​SUSU 蘇姷霖",
            ]}
            height={820}
            ratioW={13}
            indicatorSafePadding={45}
            ratioH={22}
            collapsedSize={230} // 基準值
            expandedSize={750} // 基準值
            gap={10}
            maxWidth={2500}
            decorEnabled
            decorColor="#ff4036"
            decorTopLeft={[
              { kicker: "Interior Design Director", label: "室內設計總監" },
              { kicker: "CEO", label: "工程部門執行長" },
              { kicker: "Interior Designer", label: "室內設計師" },
              { kicker: "Interior Designer", label: "室內設計師" },
              { kicker: "Interior Designer", label: "室內設計師" },
              { kicker: "Interior Designer", label: "室內設計師" },
            ]}
            bottomBarWidth={0.66}
            bottomBarHeight={22}
            decorTextColor="#fff"
          />
        </main>
        <section className="mx-auto  max-w-[1920px] pt-20">
          <div className="flex w-[80%] flex-col md:flex-row h-full justify-center items-center mx-auto">
            <div className=" w-full md:w-1/2  pr-5 ">
              <GsapText
                text="持續進化的空間設計"
                id="gsap-intro"
                fontSize="1.3rem"
                fontWeight="800"
                color="#fff"
                className="text-left  tracking-widest inline-block mb-0 h-auto"
              />

              <p className="text-[.85rem]   tracking-widest leading-loose text-gray-100 ">
                從玄關延伸至室內動線，以工業風吊燈串聯，搭配異材質元素與層次光源，
                <br></br>營造出個性鮮明又富有活力的居家氛圍。
              </p>
            </div>
            <div className=" w-full md:w-1/2 flex mt-8 lg:mt-0  justify-center lg:justify-end items-center">
              <div className="max-w-[580px] ">
                <Image
                  src="/images/index/老屋翻新-李宅.jpg"
                  placeholder="empty"
                  loading="lazy"
                  alt=""
                  width={1500}
                  height={800}
                  className="w-full"
                ></Image>
              </div>
            </div>
          </div>
        </section>

        <section className="section-footer mx-auto max-w-[1920px] ">
          <div className="mx-auto w-[80%] 2xl:w-[80%] py-20">
            <div className="top flex justify-between flex-col sm:flex-row">
              <h3 className="text-white text-center sm:text-left text-[1.8rem] font-bold">
                LOCATION
              </h3>
              <a href="/project">
                <button class="group relative inline-flex text-[1rem] 2xl:text-[1.2rem] h-12 items-center justify-center  border-b-1 border-white px-6 font-medium text-neutral-100">
                  <span className="font-mode">More</span>
                  <div class="relative ml-1 h-5 w-5 overflow-hidden">
                    <div class="absolute transition-all duration-200 sm:group-hover:-translate-y-5 sm:group-hover:translate-x-4">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                      >
                        <path
                          d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 -translate-x-4"
                      >
                        <path
                          d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </a>
            </div>

            <section className=" w-full mt-4">
              <span className="text-white text-[1.4rem] mb-2">
                我們的營業據點
              </span>
              <div className="flex  mx-auto   lg:w-full  w-full flex-wrap flex-row">
                <a href="http://localhost:3000/project?cat=special-offers">
                  <div className=" w-[90%] md:w-[240px] 2xl:w-[340px]  group ">
                    <div className="img   mx-auto  sm:group-hover:h-[40vh] delay-75 duration-500  h-auto md:h-[33vh]  overflow-hidden">
                      <div className="animate-image-wrapper mx-auto relative w-full aspect-[4/5] md:h-full overflow-hidden ">
                        <div className="image-container relative w-full h-full">
                          <Image
                            src="/images/index/住宅空間-程宅.jpg"
                            alt="About Image 1"
                            fill
                            className="object-cover sm:group-hover:scale-[1.05] duration-700"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                          />
                          xs
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col px-3 py-4">
                      <div className="inline-block pb-4">
                        <button
                          role="link"
                          class="relative  !inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                        >
                          <button
                            role="link"
                            class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                          >
                            <b className="text-[.9rem] font-bold text-white">
                              {" "}
                              台中設計辦公室
                            </b>
                          </button>
                        </button>
                      </div>
                      <span className="text-[.75rem] text-gray-100">
                        捌程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合
                      </span>
                      <span className="text-[.75rem] text-gray-100">
                        Taichung - 南區
                      </span>
                    </div>
                  </div>
                </a>
                <a href="/about">
                  <div className=" w-[90%] md:w-[240px] 2xl:w-[340px]  group ">
                    <div className="img   mx-auto    h-auto md:h-[36vh] sm:group-hover:h-[44vh] delay-75 duration-500 overflow-hidden">
                      <div className="animate-image-wrapper mx-auto relative w-full aspect-[4/5] md:h-full overflow-hidden ">
                        <div className="image-container relative w-full h-full">
                          <Image
                            src="/images/index/老屋翻新-李宅.jpg"
                            alt="About Image 1"
                            fill
                            className="object-cover sm:group-hover:scale-[1.05] duration-700"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                          />
                          xs
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col px-3 py-4">
                      <div className="inline-block pb-4">
                        <button
                          role="link"
                          class="relative  !inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                        >
                          <button
                            role="link"
                            class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                          >
                            <b className="text-[.9rem] font-bold text-white">
                              {" "}
                              員林設計辦公室
                            </b>
                          </button>
                        </button>
                      </div>
                      <span className="text-[.75rem] text-gray-100">
                        捌程是一間室內與景觀設計的專業公司,擅長將室內、室外的景色融合
                      </span>
                      <span className="text-[.75rem] text-gray-100">
                        彰化市 - 員林
                      </span>
                    </div>
                  </div>
                </a>
                <a href="https://www.kuankoshi.com/project?cat=renovation-restoration">
                  <div className=" w-[90%] md:w-[240px] 2xl:w-[340px]  group ">
                    <div className="img   mx-auto    h-auto md:h-[26vh] sm:group-hover:h-[33vh] delay-75 duration-500 overflow-hidden">
                      <div className="animate-image-wrapper mx-auto relative w-full aspect-[4/5] md:h-full overflow-hidden ">
                        <div className="image-container relative w-full h-full">
                          <Image
                            src="/images/index/b69ff1_dfadbd53c3e2460c85392dc940a6c899~mv2.jpg.avif"
                            alt="About Image 1"
                            fill
                            className="object-cover sm:group-hover:scale-[1.05] duration-700"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                          />
                          xs
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col px-3 py-4">
                      <div className="inline-block pb-4">
                        <button
                          role="link"
                          class="relative  !inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                        >
                          <button
                            role="link"
                            class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                          >
                            <b className="text-[.9rem] font-bold text-white">
                              {" "}
                              田尾總部
                            </b>
                          </button>
                        </button>
                      </div>
                      <span className="text-[.75rem] text-gray-100">
                        結構重塑與格局優化，讓舊屋重獲新生，呈現嶄新生活樣貌。
                      </span>
                      <span className="text-[.75rem] text-gray-100">
                        彰化市 - 田尾
                      </span>
                    </div>
                  </div>
                </a>
                <a href="/ServiceProcess">
                  <div className=" w-[90%] md:w-[240px] 2xl:w-[340px]  group ">
                    <div className="img   mx-auto    h-auto md:h-[30vh] sm:group-hover:h-[35vh] delay-75 duration-500 overflow-hidden">
                      <div className="animate-image-wrapper mx-auto relative w-full aspect-[4/5] md:h-full overflow-hidden ">
                        <div className="image-container relative w-full h-full">
                          <Image
                            src="https://i0.wp.com/draft.co.jp/wp-content/uploads/2024/11/ELLE-DECOR_2412_PCichiran.jpg?fit=1920%2C1280&quality=85&strip=all&ssl=1"
                            alt="About Image 1"
                            fill
                            className="object-cover sm:group-hover:scale-[1.05] duration-700"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 550px, 85vw"
                          />
                          xs
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col px-3 py-4">
                      <div className="inline-block pb-4">
                        <button
                          role="link"
                          class="relative  !inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                        >
                          <button
                            role="link"
                            class="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] sm:group-hover:after:origin-bottom-left sm:group-hover:after:scale-x-100"
                          >
                            <b className="text-[.9rem] font-bold text-white">
                              {" "}
                              其他服務
                            </b>
                          </button>
                        </button>
                      </div>
                      <span className="text-[.75rem] text-gray-100">
                        從初談、丈量到完工，全流程專業陪伴，確保每一步都安心。
                      </span>
                      <span className="text-[.75rem] text-gray-100">
                        Cintact - Us
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
