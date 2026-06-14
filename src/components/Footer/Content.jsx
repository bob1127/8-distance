// app/components/SiteFooter.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { refreshJustFontDelayed } from "@/lib/justfont";

const API = "https://api.8distance.com/api/pages";

/* ---------------- helpers ---------------- */
const toStr = (v, d = "") => (v == null ? d : String(v));
const normKey = (s) => toStr(s).trim();
const digits = (s) => toStr(s).replace(/[^\d]/g, "");
const telHref = (s) => {
  const n = digits(s);
  return n ? `tel:${n}` : undefined;
};
const decodeEntities = (s) =>
  toStr(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const isHttpUrl = (s) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/** 從 company_information 陣列取出 key 對應的 value（沒有就回傳空字串） */
function pickInfo(list, key) {
  if (!Array.isArray(list)) return "";
  const found = list.find((x) => normKey(x?.key) === key);
  return toStr(found?.value, "");
}

/** 只接受 <iframe ...>...</iframe> 片段，避免 script 之類（保留，未使用） */
function acceptIframeHtml(html) {
  const s = toStr(html).trim();
  if (!s) return "";
  const isIframe =
    /^<\s*iframe\b[\s\S]*<\/\s*iframe\s*>$/i.test(s) ||
    /^<\s*iframe\b[\s\S]*\/\s*>$/i.test(s);
  return isIframe ? s : "";
}

/** 依 tab key 決定「電腦版」地圖圖片（維持原本） */
function mapImageByKeyDesktop(key) {
  switch (key) {
    case "terms": // 台中設計辦公室
      return "/images/map/google-map-台中.webp";
    case "cookies": // 田尾總部（先用雲林）
      return "/images/map/google-map-雲林.webp";
    case "privacy": // 員林設計辦公室
      return "/images/map/google-map-員林.webp";
    default:
      return "/images/map/google-map-台中.webp";
  }
}

/** 依 tab key 決定「手機版」地圖圖片（新圖） */
function mapImageByKeyMobile(key) {
  switch (key) {
    case "terms": // 台中設計辦公室
      return "/images/footer/台中設計辦公室.png";
    case "cookies": // 田尾總部
      return "/images/footer/田尾總部.png";
    case "privacy": // 員林設計辦公室
      return "/images/footer/員林設計辦公室.png";
    default:
      return "/images/footer/台中設計辦公室.png";
  }
}

/** 靜態地圖：不載入 Google Maps、只切換圖片（可點擊開啟 Google Map） */
function MapEmbedStatic({ tabKey, label }) {
  const desktopSrc = mapImageByKeyDesktop(tabKey);
  const mobileSrc = mapImageByKeyMobile(tabKey);

  // 根據 tabKey 決定實際 Google Maps 網址
  const mapUrl = (() => {
    switch (tabKey) {
      case "terms":
        return "https://maps.google.com/?q=403+台中市西區五權三街273號";
      case "cookies":
        return "https://maps.google.com/?q=彰化縣田尾鄉福德巷325弄30號";
      case "privacy":
        return "https://maps.google.com/?q=員林設計辦公室";
      default:
        return "https://maps.google.com/?q=台中市西區五權三街273號";
    }
  })();

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden aspect-[4/3] md:aspect-[16/2.6] group"
    >
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrc} />
        <Image
          src={desktopSrc}
          alt={`${label} 地圖`}
          fill
          priority={false}
          unoptimized
          quality={100}
          className="object-cover"
        />
      </picture>
    </a>
  );
}

export default function SiteFooter() {
  const yearRange = useMemo(() => `2020—${new Date().getFullYear()}`, []);
  const [tab, setTab] = useState("terms"); // 'terms' | 'cookies' | 'privacy'
  const pathname = usePathname();

  // ====== 後台資料狀態（有資料就覆蓋，沒有就用預設） ======
  const [links, setLinks] = useState({
    facebook: "https://www.facebook.com/share/14QeXJTqNaL/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/8_distance/",
    line: "https://page.line.me/655cyzya?oat_content=url&openQrModal=true",
    youtube: "https://www.youtube.com/@捌程景觀與室內設計",
  });

  const [contacts, setContacts] = useState({
    interiorText: "室內設計｜04-23720128 室內設計部門",
    interiorTel: "tel:0423720128",
    landscapeText: "景觀設計｜0986-272188 張特助",
    landscapeTel: "tel:0986272188",
    faxText: "傳真專線｜04-23720129",
    faxTel: "tel:0423720129",
  });

  // 三個據點（label/address 可被後台覆蓋）
  const [tabsData, setTabsData] = useState([
    {
      key: "terms",
      label: "台中設計辦公室",
      address: "403 台中市西區五權三街 273 號",
      iframeUrl:
        "https://www.google.com/maps/d/u/0/embed?mid=1oOtSsogbG_jG9blH_tZjsU6zXuIesus&ehbc=2E312F&noprof=1",
      embedHtml: "",
    },
    {
      key: "cookies",
      label: "田尾總部",
      address: "522 彰化縣田尾鄉福德巷 325 弄 30 號",
      iframeUrl:
        "https://www.google.com/maps/d/embed?mid=1AeaKi6fH8Xv2Zfw_3XqQIviGI__ZZUA&ehbc=2E312F&noprof=1",
      embedHtml: "",
    },
    {
      key: "privacy",
      label: "員林設計辦公室",
      address: "需先撥電話預約（平時不開放）",
      iframeUrl:
        "https://www.google.com/maps/d/embed?mid=1jLRIs-hGhu5BuaQXUSMBMzLC5hmyMvQ&ehbc=2E312F&noprof=1",
      embedHtml: "",
    },
  ]);

  // 初始化一次
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
      offset: 100,
      mirror: false,
    });
  }, []);

  // 每次客端換頁後刷新 AOS
  useEffect(() => {
    document
      .querySelectorAll("[data-aos].aos-animate")
      .forEach((el) => el.classList.remove("aos-animate"));
    const id = setTimeout(() => {
      if (typeof AOS?.refreshHard === "function") AOS.refreshHard();
      else if (typeof AOS?.refresh === "function") AOS.refresh();
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  // ====== 抓後台 pages，覆蓋社群連結 / 聯絡資訊 / 地圖文字 ======
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(API, { cache: "force-cache" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();

        const infos = Array.isArray(json?.company_information)
          ? json.company_information
          : [];
        const addrs = Array.isArray(json?.addresses) ? json.addresses : [];

        // --- 社群連結 ---
        const rawLinks = {
          facebook: decodeEntities(pickInfo(infos, "facebook")),
          instagram: decodeEntities(pickInfo(infos, "instagram")),
          line: decodeEntities(pickInfo(infos, "line")),
          youtube: decodeEntities(pickInfo(infos, "youtube")),
        };
        const nextLinks = {
          facebook: isHttpUrl(rawLinks.facebook)
            ? rawLinks.facebook
            : links.facebook,
          instagram: isHttpUrl(rawLinks.instagram)
            ? rawLinks.instagram
            : links.instagram,
          line: isHttpUrl(rawLinks.line) ? rawLinks.line : links.line,
          youtube: isHttpUrl(rawLinks.youtube)
            ? rawLinks.youtube
            : links.youtube,
        };

        // --- 聯絡資訊 ---
        const interiorRaw =
          pickInfo(infos, "InteriorDesign") ||
          "室內設計｜04-23720128 室內設計部門";
        const landscapeRaw =
          pickInfo(infos, "landscapeDesign") || "景觀設計｜0986-272188 張特助";
        const faxRaw = pickInfo(infos, "fax") || "傳真｜04-23720129";

        const nextContacts = {
          interiorText: interiorRaw,
          interiorTel: telHref(interiorRaw) || "tel:0423720128",
          landscapeText: landscapeRaw,
          landscapeTel: telHref(landscapeRaw) || "tel:0986272188",
          faxText: `傳真專線｜${
            digits(faxRaw)
              ? faxRaw.replace(/傳真[\s｜|:]*/g, "")
              : "04-23720129"
          }`,
          faxTel: telHref(faxRaw) || "tel:0423720129",
        };

        // --- 三個據點（覆蓋 label/address；embed 保留但不使用） ---
        const sortedAddrs = addrs
          .slice()
          .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

        const mergedTabs = tabsData.map((t, i) => {
          const src = sortedAddrs[i];
          if (!src) return t;
          return {
            ...t,
            label: toStr(src.company_title, t.label),
            address: toStr(src.company_address, t.address),
            embedHtml:
              acceptIframeHtml(src?.map_embed_html || src?.embed_html) ||
              t.embedHtml,
            iframeUrl:
              toStr(src?.map_embed_url || src?.map_url || src?.iframe).trim() ||
              t.iframeUrl,
          };
        });

        if (!aborted) {
          setLinks(nextLinks);
          setContacts(nextContacts);
          setTabsData(mergedTabs);
          refreshJustFontDelayed([0, 400]);
        }
      } catch {
        // 忽略錯誤，沿用預設
      }
    })();
    return () => {
      aborted = true;
    };
  }, []); // 僅初始化抓一次

  // 依目前 tab 顯示對應據點
  const current = useMemo(
    () => tabsData.find((t) => t.key === tab) ?? tabsData[0],
    [tab, tabsData]
  );

  return (
    <footer
      id="footer"
      className="relative w-full text-white bg-black z-[9999999] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgb(62,62,62) 0%, rgb(0,0,0) 100%)",
      }}
    >
      {/* 背景層 */}
      <div />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0"
        style={{
          ["--grain-size"]: "560px",
          backgroundImage:
            "url('https://framerusercontent.com/images/9ErWmXn2IIfOUCaXNwDeuxqJXM.png')",
          backgroundRepeat: "repeat",
          backgroundPosition: "top left",
          backgroundSize: "var(--grain-size) var(--grain-size)",
          opacity: 0.6,
          mixBlendMode: "overlay",
        }}
      />

      {/* 內容 */}
      <div className="relative mx-auto w-full pt-3 ">
        {/* 上：Contact Us 與社群 icon */}
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl mt-4 mb-3">CONTACT US</h2>
          <div
            key={`icon-row-${pathname}`}
            className="flex items-center gap-5 md:gap-7 shrink-0"
          >
            <div data-aos="fade-up" data-aos-duration="750" data-aos-delay="0">
              <SocialIcon
                href={links.facebook}
                label="Facebook"
                src="/images/footer/icons8-facebook.svg"
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="750"
              data-aos-delay="180"
            >
              <SocialIcon
                href={links.instagram}
                label="Instagram"
                src="/images/footer/icons8-instagram.svg"
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="750"
              data-aos-delay="360"
            >
              <SocialIcon
                href={links.line}
                label="LINE"
                src="/images/footer/icons8-line.svg"
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="750"
              data-aos-delay="540"
            >
              <SocialIcon
                href={links.youtube}
                label="YouTube"
                src="/images/footer/icons8-youtube.svg"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center w-full lg:items-center gap-6">
          <div className="w-full ">
            <div
              role="tablist"
              aria-label="門市據點切換"
              className="flex flex-wrap mx-auto gap-4 justify-center"
            >
              {tabsData.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${t.key}`}
                    onClick={() => setTab(t.key)}
                    className={[
                      "relative bg-transparent px-0 h-10 text-[14px] text-white",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                      "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-transparent",
                      active ? "after:w-8 after:bg-white" : "",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* 地圖（改為靜態圖片切換） */}
            <div
              id={`panel-${tab}`}
              role="tabpanel"
              aria-live="polite"
              className="mt-3 overflow-hidden border border-white/20"
            >
              <MapEmbedStatic tabKey={current.key} label={current.label} />
            </div>
          </div>
        </div>

        <div className="grid gap-8 mt-3 lg:grid-cols-3 items-start">
          <div className="flex  justify-center items-center h-full">
            <Image
              src="/images/logo/yellow-style/捌程LOGO-full-yellow-橫.png"
              alt="company-logo"
              width={949}
              height={399}
              className="w-[90px] mt-4 sm:mt-0 h-auto"
            />
          </div>
          <div className="flex justify-center items-start">
            {/* 地址（與上方一致） */}
            <li className="text-[13px]">
              地址｜
              <span className="text-white text-[13px]">{current.address}</span>
            </li>
          </div>

          {/* 右側：電話 / 信箱 */}
          <div className="flex justify-center items-center">
            <ul className="text-[14px] md:text-[15px] leading-relaxed">
              <li className="text-[13px]">
                {contacts.interiorText.split("｜")[0]}｜
                <a
                  href={contacts.interiorTel}
                  className=" underline-offset-2 text-white text-[13px] hover:text-[#c69c6d] transition-colors"
                >
                  {contacts.interiorText.replace(/^.*?｜/, "")}
                </a>
              </li>
              <li className="text-[13px]">
                {contacts.landscapeText.split("｜")[0]}｜
                <a
                  href={contacts.landscapeTel}
                  className=" underline-offset-2 text-white text-[13px] hover:text-[#c69c6d] transition-colors"
                >
                  {contacts.landscapeText.replace(/^.*?｜/, "")}
                </a>
              </li>
              <li className="text-[13px]">
                {contacts.faxText.split("｜")[0]}｜
                <a
                  href={contacts.faxTel}
                  className=" underline-offset-2 text-white text-[13px] hover:text-[#c69c6d] transition-colors"
                >
                  {contacts.faxText.replace(/^.*?｜/, "")}
                </a>
              </li>

              <li className="text-[13px]">
                電子信箱｜
                <a
                  href="mailto:8distancee@gmail.com"
                  className="text-white text-[13px] hover:text-[#c69c6d] transition-colors lowercase"
                >
                  8distancee@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-5 border-t border-white/20" />
        <div className="flex flex-col justify-center items-center">
          <p className="text-center text-xs text-white/70 mb-4">
            © {yearRange} 8distance. All rights reserved.
          </p>
          <span className="text-[#949494] font-light text-[13px]">
            Copyright © 2025 捌程室內設計
          </span>{" "}
          <a
            href="https://www.jeek-webdesign.com.tw"
            target="_blank"
            className="text-[#949494] font-light text-[13px]"
          >
            Design By 極客網頁設計
          </a>
        </div>
      </div>

      {/* AOS 自訂樣式 + Map 比例樣式 */}
      <style jsx global>{`
        [data-aos="custom-grow-line"].grow-line {
          transform-origin: left center;
          transform: scaleX(0);
          opacity: 0.85;
          transition-property: transform, opacity;
          transition-duration: 0.9s;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-aos="custom-grow-line"].grow-line.aos-animate {
          transform: scaleX(1);
          opacity: 1;
        }
        .map-static {
          width: 100%;
          aspect-ratio: 16 / 6; /* 依你的素材比例調整 */
        }
        .map-crop-300 {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
        }
        .map-crop-300 iframe {
          width: 100%;
          display: block;
          border: 0;
        }
        .map-wrap {
          aspect-ratio: 16 / 10;
          width: 100%;
          overflow: hidden;
        }
        .map-wrap iframe {
          width: 100%;
          height: auto !important;
          display: block;
          border: 0;
        }
      `}</style>
    </footer>
  );
}

/** 以 CSS mask 強制把 SVG 顯示成白色（不受原檔顏色影響） */
function SocialIcon({ href, label, src, size = 28 }) {
  const safe = isHttpUrl(href) ? href : undefined;
  const disabled = !safe;
  return (
    <a
      href={safe}
      target="_blank"
      aria-label={label}
      className={`inline-flex items-center justify-center ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
      title={label}
      rel="noreferrer noopener"
    >
      <span
        aria-hidden="true"
        className="block"
        style={{
          width: size,
          height: size,
          backgroundColor: "#fff",
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </a>
  );
}
