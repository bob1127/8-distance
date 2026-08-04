"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
/* ✅ Icons */
import { PlayCircle, HelpCircle } from "lucide-react";
/* ✅ 公告輪播（僅手機） */
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { YOUTUBE_CHANNEL_URL, DEFAULT_SOCIAL_LINKS, fetchSocialLinks } from "@/lib/site";

const SEARCH_API = "https://api.8distance.com/api/search";

// 使用 useLayoutEffect 在 SSR 修正閃爍，但在 Next.js 中需 fallback 到 useEffect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ExoApeOverlayMenu({ children }) {
  const rootRef = useRef(null);
  const searchInputRef = useRef(null);

  // 🔹 Client-side mounted 檢查
  const [mounted, setMounted] = useState(false);

  // 🔹 [新增] 佈局模式狀態：用於偵測斷點變化 (解決縮放破版問題)
  const [layoutMode, setLayoutMode] = useState("desktop");

  // ✅ 搜尋狀態管理
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 社群連結：預設 → 後台 /api/pages 覆蓋（與 Footer 同源）
  const [socialLinks, setSocialLinks] = useState({ ...DEFAULT_SOCIAL_LINKS });

  const topDividerRef = useRef(null);
  const footerDividerRef = useRef(null);
  const closeMenuRef = useRef(() => {});

  // ✅ 確保只在客戶端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ 從後台同步社群連結（含 IG）
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const next = await fetchSocialLinks();
        if (!aborted) setSocialLinks(next);
      } catch {
        /* 沿用預設 */
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // ✅ [新增] 監聽視窗尺寸變化
  // 當跨越 768px (CSS 中的 md breakpoint) 時，更新 layoutMode
  // 這會觸發下方的 useIsomorphicLayoutEffect 重跑，清除 GSAP 殘留樣式
  useEffect(() => {
    const handleResize = () => {
      // 768px 是你在 style jsx 中定義 .exo-container 切換 position 的斷點
      const mode = window.innerWidth < 768 ? "mobile" : "desktop";
      setLayoutMode(mode);
    };

    // 初始化執行一次
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 搜尋邏輯
  useEffect(() => {
    const keyword = searchQ.trim();
    if (!keyword) {
      setResults([]);
      setErrMsg("");
      return;
    }

    const id = setTimeout(async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const r = await fetch(
          `${SEARCH_API}?q=${encodeURIComponent(keyword)}`,
          { cache: "no-store" }
        );
        const j = await r.json().catch(() => ({}));
        const list = normalizeResults(j);
        setResults(list);
      } catch (err) {
        console.error(err);
        setErrMsg("搜尋發生錯誤");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchQ]);

  // GSAP 邏輯
  useIsomorphicLayoutEffect(() => {
    if (!mounted) return; // 等待 Client Mount

    const root = rootRef.current;
    if (!root) return;

    // 建立 GSAP Context 以便之後一次性清理 (revert)
    const ctx = gsap.context(() => {
      const $ = (sel) => root.querySelector(sel);
      const $$ = (sel) => Array.from(root.querySelectorAll(sel));

      const container = $(".exo-container");
      const menuToggle = $(".menu-toggle");
      const menuOverlay = $(".menu-overlay");
      const menuContent = $(".menu-content");
      const menuPreviewImg = $(".menu-preview-img");
      const menuLinks = $$(".link a");

      const lineTop = $(".menu-toggle .line.top");
      const lineMid = $(".menu-toggle .line.middle");
      const lineBot = $(".menu-toggle .line.bottom");

      const dividers = [topDividerRef.current, footerDividerRef.current].filter(
        Boolean
      );

      const ACTIVE_CLASSES = ["z-10"];
      const addActiveClasses = () =>
        container?.classList.add(...ACTIVE_CLASSES);
      const removeActiveClasses = () =>
        container?.classList.remove(...ACTIVE_CLASSES);

      // ✅ [修復核心] 強制設定高度，並處理 100dvh 相容性
      const setContainerMinHeight = () => {
        if (!container) return;

        // 只有在小於 768px (手機版) 且選單開啟時才鎖定高度
        if (window.matchMedia("(max-width: 767px)").matches) {
          // 優先使用 visualViewport.height (解決 iOS Safari 鍵盤彈出問題)
          const vh = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;

          // 確保 vh 有值且合理，避免抓到 0
          if (vh > 0) {
            container.style.minHeight = `${vh}px`;
            if (menuOverlay) {
              menuOverlay.style.height = `${vh}px`;
            }
          }
        } else {
          // 在 Desktop 模式下，確保清除 GSAP 可能寫入的 inline style
          container.style.minHeight = "";
          if (menuOverlay) {
            menuOverlay.style.height = "";
          }
        }
      };

      // 1. 立即執行一次
      setContainerMinHeight();

      // 2. 延遲執行 (應對 JS 比 CSS 先跑完的情況)
      setTimeout(setContainerMinHeight, 100);
      setTimeout(setContainerMinHeight, 500); // 多加一個保險

      // 3. 綁定 Resize 與 視覺視口變化
      window.addEventListener("resize", setContainerMinHeight);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", setContainerMinHeight);
      }

      // 4. ✅ [關鍵修正] 監聽 load 事件，確保圖片載入後重新計算高度
      const handleLoad = () => {
        setContainerMinHeight();
      };

      // 如果頁面還沒載入完成，就掛載監聽器
      if (document.readyState !== "complete") {
        window.addEventListener("load", handleLoad);
      } else {
        // 如果已經載入完成 (例如路由切換)，直接執行
        setContainerMinHeight();
      }

      const resetPreviewImage = () => {
        if (!menuPreviewImg) return;
        menuPreviewImg.innerHTML = "";
        const img = document.createElement("img");
        img.src = "/img-1.jpg"; // 預設圖
        img.alt = "preview";
        img.className = "absolute inset-0 w-full h-full object-cover";
        menuPreviewImg.appendChild(img);
      };

      const cleanupPreviewImages = () => {
        if (!menuPreviewImg) return;
        const imgs = menuPreviewImg.querySelectorAll("img");
        if (imgs.length > 3) {
          for (let i = 0; i < imgs.length - 3; i++) {
            menuPreviewImg.removeChild(imgs[i]);
          }
        }
      };

      let isOpen = false;
      let isAnimating = false;

      // 初始化狀態
      gsap.set(dividers, {
        transformOrigin: "left center",
        scaleX: 0,
        willChange: "transform",
      });
      gsap.set(".search-bar-container", { y: "120%", opacity: 0 });

      const animateHamburger = (opening) => {
        if (!lineTop || !lineMid || !lineBot) return;
        const tl = gsap.timeline();
        if (opening) {
          tl.to(
            lineTop,
            { y: 6, rotate: 45, duration: 0.28, ease: "power2.out" },
            0
          )
            .to(lineMid, { opacity: 0, duration: 0.18, ease: "power2.out" }, 0)
            .to(
              lineBot,
              { y: -6, rotate: -45, duration: 0.28, ease: "power2.out" },
              0
            );
        } else {
          tl.to(
            lineTop,
            { y: 0, rotate: 0, duration: 0.28, ease: "power2.out" },
            0
          )
            .to(lineMid, { opacity: 1, duration: 0.18, ease: "power2.out" }, 0)
            .to(
              lineBot,
              { y: 0, rotate: 0, duration: 0.28, ease: "power2.out" },
              0
            );
        }
      };

      const openMenu = () => {
        if (isAnimating || isOpen) return;
        isAnimating = true;

        // 鎖定卷軸
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        addActiveClasses();
        setContainerMinHeight(); // 開啟前強制計算一次
        animateHamburger(true);

        if (menuOverlay) {
          menuOverlay.style.pointerEvents = "auto";
          // ✅ 使用 CSS class 控制初始狀態，GSAP 負責動畫
          gsap.to(menuOverlay, {
            autoAlpha: 1, // GSAP 的 autoAlpha 會自動處理 opacity 和 visibility
            duration: 0.35,
            ease: "power2.out",
          });
        }

        if (menuContent) {
          gsap.set(menuContent, { opacity: 0.25 });
          gsap.to(menuContent, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          });
        }

        gsap.to(dividers, {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.08,
        });

        gsap.to(
          [
            root.querySelector(".search-bar-container"),
            ...root.querySelectorAll(".link a"),
            ...root.querySelectorAll(".social a"),
          ],
          {
            y: "0%",
            delay: 0.12,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
          }
        );

        setTimeout(() => {
          isOpen = true;
          isAnimating = false;
          menuToggle?.setAttribute("aria-expanded", "true");
          setContainerMinHeight(); // 動畫結束後再次確認高度
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 300);
        }, 300);
      };

      const closeMenu = () => {
        if (isAnimating || !isOpen) return;
        isAnimating = true;
        animateHamburger(false);

        if (menuContent) {
          gsap.to(menuContent, {
            opacity: 0.25,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }

        gsap.to(dividers, { scaleX: 0, duration: 0.25, ease: "power2.in" });

        if (menuOverlay) {
          gsap.to(menuOverlay, {
            autoAlpha: 0, // 自動處理 opacity 0 + visibility hidden
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              isOpen = false;
              isAnimating = false;
              menuToggle?.setAttribute("aria-expanded", "false");

              gsap.set(
                [
                  root.querySelector(".search-bar-container"),
                  ...root.querySelectorAll(".link a"),
                  ...root.querySelectorAll(".social a"),
                ],
                { y: "120%", opacity: 0 }
              );

              resetPreviewImage();

              // 解除卷軸鎖定
              document.body.style.overflow = "";
              document.documentElement.style.overflow = "";

              if (menuOverlay) {
                menuOverlay.style.pointerEvents = "none";
              }
              removeActiveClasses();

              // 重置搜尋
              setSearchQ("");
              setResults([]);

              // 重置高度限制，避免影響正常頁面瀏覽
              if (container) container.style.minHeight = "";
            },
          });
        }
      };

      closeMenuRef.current = closeMenu;

      const handleToggle = () => (isOpen ? closeMenu() : openMenu());

      const handleHover = (e) => {
        if (!isOpen || isAnimating) return;
        const link = e.currentTarget;
        const imgSrc = link.getAttribute("data-img");
        if (!imgSrc || !menuPreviewImg) return;
        const imgs = menuPreviewImg.querySelectorAll("img");
        if (
          imgs.length > 0 &&
          imgs[imgs.length - 1].getAttribute("src")?.endsWith(imgSrc)
        )
          return;

        const newImg = document.createElement("img");
        newImg.src = imgSrc;
        newImg.alt = "preview";
        newImg.className = "absolute inset-0 w-full h-full object-cover";
        newImg.style.opacity = "0";
        newImg.style.transform = "scale(1.25) rotate(10deg)";
        menuPreviewImg.appendChild(newImg);
        cleanupPreviewImages();

        gsap.to(newImg, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: "power2.out",
        });
      };

      const handleLinkClick = (e) => {
        const a = e.currentTarget;
        const href = a.getAttribute("href") || "#";
        if (href.startsWith("#") || href === "#") e.preventDefault();
        closeMenu();
      };

      // 事件綁定
      menuToggle?.addEventListener("click", handleToggle);
      menuLinks.forEach((a) => {
        a.addEventListener("mouseover", handleHover);
        a.addEventListener("click", handleLinkClick);
      });

      // 初始化狀態：確保 GSAP 狀態與 CSS 一致
      if (menuOverlay) {
        menuOverlay.style.pointerEvents = "none";
        gsap.set(menuOverlay, { autoAlpha: 0 }); // autoAlpha: 0 等同於 opacity: 0, visibility: hidden
      }
      removeActiveClasses();
      resetPreviewImage();

      const onKey = (e) => e.key === "Escape" && closeMenu();
      window.addEventListener("keydown", onKey);

      // 清理函數
      return () => {
        menuToggle?.removeEventListener("click", handleToggle);
        menuLinks.forEach((a) => {
          a.removeEventListener("mouseover", handleHover);
          a.removeEventListener("click", handleLinkClick);
        });
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", setContainerMinHeight);
        window.removeEventListener("load", handleLoad); // 清除 load 監聽
        if (window.visualViewport) {
          window.visualViewport.removeEventListener(
            "resize",
            setContainerMinHeight
          );
        }

        // 確保 DOM 狀態復原 (ctx.revert 會被自動呼叫，但這裡手動確保 CSS 狀態)
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (menuOverlay) {
          menuOverlay.style.pointerEvents = "none";
          gsap.set(menuOverlay, { autoAlpha: 0 });
        }
        if (container) container.style.minHeight = "";
        removeActiveClasses();
      };
    }, root);

    return () => ctx.revert();
  }, [mounted, layoutMode]); // 👈 關鍵修改：將 layoutMode 加入依賴，跨越斷點時重置

  return (
    <div ref={rootRef} className="exoape-menu-root w-full z-[60]">
      {mounted && (
        <div className="xl:hidden fixed top-0 inset-x-0 z-[100] bg-[#181818] text-white">
          <div className="h-9"></div>
        </div>
      )}

      {/* 手機頂欄 */}
      <nav className="xl:hidden fixed top-9 inset-x-0 z-[95] flex items-center justify-between pl-[max(env(safe-area-inset-left),1.25rem)] pr-[max(env(safe-area-inset-right),1.25rem)] py-2 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="font-semibold text-white">
          <a href="/" aria-label="Brand">
            <Image
              src="/images/logo/yellow-style/捌程LOGO-full-yellow-橫.png"
              alt="company-logo"
              width={949}
              height={399}
              className="w-[90px] h-auto"
            />
          </a>
        </div>
        <button className="menu-toggle !z-50 relative w-11 h-11 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5">
          <span className="line top absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[14px]" />
          <span className="line middle absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[21px]" />
          <span className="line bottom absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[28px]" />
        </button>
      </nav>

      {/* 手機 Overlay - ✅ 加入 opacity-0 invisible 防止初始閃爍 */}
      <div
        id="exoape-menu-overlay"
        className="menu-overlay xl:hidden fixed inset-0 z-[90] opacity-0 invisible"
        role="dialog"
      >
        <div className="menu-content relative w-full h-full flex items-center justify-center">
          <div className="menu-items w-full flex flex-wrap gap-5 px-5 text-white h-full overflow-y-auto content-start">
            <div className="col-sm order-1 basis-full flex flex-col gap-6 w-full">
              <div className="menu-links flex flex-col gap-2 w-full">
                <span
                  ref={topDividerRef}
                  className="block h-[1px] w-full bg-white/50 mb-5 rounded-[2px]"
                />

                {/* 搜尋框 */}
                <div className="search-bar-container w-full opacity-0 translate-y-[120%] mb-4 relative z-50">
                  <div className="relative w-full group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                      placeholder="SEARCH..."
                      className="w-full bg-transparent border-b border-white/40 py-2 pr-10 text-xl font-light tracking-wide text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* 搜尋結果列表 */}
                  {(results.length > 0 || errMsg) && (
                    <div className="absolute top-full left-0 mt-3 w-full bg-[#1e1e1e] border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-[50vh] overflow-y-auto z-[200]">
                      {errMsg && (
                        <div className="p-4 text-sm text-red-400">{errMsg}</div>
                      )}
                      {results.map((item, i) => (
                        <a
                          key={i}
                          href={item.url || "#"}
                          onClick={() => closeMenuRef.current()}
                          className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                            <div className="text-base text-white font-normal truncate group-hover:text-[#D9A333] transition-colors">
                              {item.title}
                            </div>
                            {item.extra && (
                              <span className="shrink-0 inline-flex items-center justify-center px-2 py-[2px] rounded-full bg-white/20 text-[11px] text-white/90 font-light tracking-wide">
                                {(() => {
                                  const map = {
                                    blog: "文章",
                                    work: "作品",
                                    news: "動態",
                                    video: "影片",
                                  };
                                  return map[item.extra] || item.extra;
                                })()}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* 連結 */}
                {[
                  {
                    label: "關於我們",
                    href: "/about",
                    img: "/images/project-01/img02.jpg",
                  },
                  {
                    label: "最新動態",
                    href: "/news",
                    img: "/images/project-01/img03.jpg",
                  },
                  {
                    label: "作品欣賞",
                    href: "/works",
                    img: "/images/project-01/img04.jpg",
                  },
                  {
                    label: "服務流程",
                    href: "/service",
                    img: "/images/project-01/img05.jpg",
                  },
                  {
                    label: "設計靈感",
                    href: "/blog",
                    img: "/images/project-01/img06.jpg",
                  },
                  {
                    label: "常見問題",
                    href: "/qa",
                    img: "/images/project-01/img07.jpg",
                  },
                  {
                    label: "影音內容",
                    href: "/video",
                    img: "/images/project-01/img07.jpg",
                  },
                  {
                    label: "預約諮詢",
                    href: "/contact",
                    img: "/images/project-01/img07.jpg",
                  },
                ].map((item) => (
                  <div key={item.label} className="link pb-1">
                    <a
                      href={item.href}
                      data-img={item.img}
                      className="inline-block text-[2rem] leading-none tracking-tight text-white opacity-25 translate-y-[120%] transition-colors hover:opacity-100"
                    >
                      {item.label}
                    </a>
                  </div>
                ))}
              </div>
              <div className="menu-socials flex flex-col gap-2">
                {[
                  {
                    label: "INSTAGRAM",
                    href: socialLinks.instagram,
                  },
                  {
                    label: "FACEBOOK",
                    href: socialLinks.facebook,
                  },
                  {
                    label: "YOUTUBE",
                    href: socialLinks.youtube || YOUTUBE_CHANNEL_URL,
                  },
                  {
                    label: "LINE",
                    href: socialLinks.line,
                  },
                ].map((s) => (
                  <div key={s.label} className="social pb-1">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-white/60 translate-y-[120%] opacity-25 transition hover:text-white"
                    >
                      {s.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="menu-footer absolute bottom-0 left-0 w-full px-5 pb-3 text-white">
            <div className="flex flex-col gap-3"></div>
          </div>
        </div>
      </div>

      <div className="exo-container md:contents z-[10]">{children}</div>

      <style jsx>{`
        /* 保持原有的 styles */
        a,
        p {
          position: relative;
          text-decoration: none;
          color: #fff;
          font-size: 1rem;
          font-weight: 300;
          user-select: none;
        }
        .menu-toggle {
          position: relative;
          width: 44px;
          height: 44px;
          cursor: pointer;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .menu-toggle .line {
          position: absolute;
          width: 22px;
          height: 2px;
          background: #fff;
          left: 50%;
          transform: translateX(-50%);
          will-change: transform, opacity;
        }
        .menu-overlay {
          position: fixed;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          z-index: 90;
          /* opacity 與 visibility 已在 JSX 中透過 class 控制初始狀態 */
          inset: 0;
          overflow: hidden;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .menu-overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          background: url("/images/S__14672051.webp") center center / cover
            no-repeat;
          transform: scale(1.03);
          z-index: 0;
        }
        .menu-overlay::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 0;
        }
        .menu-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          will-change: opacity;
          opacity: 0.25;
          z-index: 1;
        }
        .menu-items {
          width: 100%;
          padding: 140px 1.25rem 140px 1.25rem;
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          height: 100%;
          overflow-y: auto;
        }
        .menu-footer {
          width: 100%;
          padding: 2rem 1.25rem calc(1rem + env(safe-area-inset-bottom)) 1.25rem;
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 10;
          background: linear-gradient(
            to top,
            rgba(24, 24, 24, 1) 20%,
            rgba(24, 24, 24, 0) 100%
          );
          pointer-events: none;
        }
        .menu-footer a {
          pointer-events: auto;
        }
        .menu-preview-img {
          position: relative;
          width: 80%;
          max-width: 360px;
          height: 38vh;
          overflow: hidden;
          border-radius: 14px;
        }
        .menu-preview-img img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }
        .link,
        .social {
          padding-bottom: 6px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }
        .link a,
        .social a {
          display: inline-block;
          will-change: transform;
          transition: color 0.5s;
        }
        .link a {
          font-size: 20px;
          letter-spacing: -0.02rem;
        }
        .social a {
          color: #8f8f8f;
        }
        .social a:hover {
          color: #fff;
        }
        .link a::after,
        .social a::after,
        .menu-footer a::after {
          position: absolute;
          content: "";
          top: 102.5%;
          left: 0;
          width: 100%;
          height: 2px;
          background: #fff;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.6, 0, 0.4, 1);
        }
        .link a:hover::after,
        .social a:hover::after,
        .menu-footer a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .exo-container {
          position: absolute;
          width: 100%;
          transform-origin: right top;
          will-change: transform;
          z-index: 10;
          overflow-x: clip;
          max-width: 100dvw;
        }
        @media (min-width: 768px) {
          .exo-container {
            position: static !important;
            width: auto !important;
            min-height: 0 !important;
            transform: none !important;
            will-change: auto !important;
            z-index: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

// 輔助函數保持不變
function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function normalizeResults(json) {
  if (!json) return [];
  const buildBlogUrl = (x) => {
    const raw =
      x?.url_slug?.trim() ||
      x?.slug?.trim() ||
      x?.title?.trim() ||
      x?.name?.trim() ||
      "";
    return raw ? `/blog/${encodeURIComponent(raw)}` : undefined;
  };
  const finalizeUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (!url.startsWith("/")) return url;
    const [pathAndMaybeQuery, hash = ""] = url.split("#");
    const [pathOnly, query = ""] = pathAndMaybeQuery.split("?");
    const parts = pathOnly
      .split("/")
      .map((seg, i) => {
        if (i === 0) return "";
        if (!seg) return "";
        try {
          return encodeURIComponent(decodeURIComponent(seg));
        } catch {
          return encodeURIComponent(seg);
        }
      })
      .join("/");
    return (
      (parts.startsWith("/") ? parts : `/${parts}`) +
      (query ? `?${query}` : "") +
      (hash ? `#${hash}` : "")
    );
  };
  const pack = (arr, typeFallback) =>
    (Array.isArray(arr) ? arr : []).map((x, i) => {
      let url;
      let extra = typeFallback;
      if (typeFallback === "video" || x.type === "video") {
        let category = "normal";
        let page = "1";
        const rawUrl = x.url || "";
        const match = rawUrl.match(/\/video\/(normal|shorts)\/(\d+)/);
        if (match) {
          category = match[1];
          page = match[2];
        }
        url = `/video?category=${category}&page=${page}`;
        extra = category === "shorts" ? "Shorts" : "一般影片";
      } else if (typeFallback === "qa" || x.type === "question") {
        const apiDataUrl = x.url || "";
        const rawCat = x.category || x.category_key || "";
        if (
          apiDataUrl.includes("renovation_knowledge") ||
          rawCat === "renovation_knowledge" ||
          rawCat === "renovation"
        ) {
          url = "/qa/renovation_knowledge";
          extra = "裝修QA";
        } else {
          url = "/qa/design_process";
          extra = "設計QA";
        }
      } else if (typeFallback === "blog") {
        url = buildBlogUrl(x) || x.url || x.href || x.link || null;
      } else {
        url = x.url ?? x.href ?? x.link ?? null;
        if (!url && x.slug) {
          const base =
            typeFallback === "work"
              ? "/works/"
              : typeFallback === "news"
              ? "/news/"
              : "/";
          url = `${base}${encodeURIComponent(String(x.slug))}`;
        }
      }
      if (url && url.startsWith("/")) url = finalizeUrl(url);
      return {
        id: x.id ?? `${typeFallback}-${i}`,
        title: stripHtml(x.title || x.name || x.q || "(未命名)"),
        url: url || undefined,
        excerpt: stripHtml(
          x.preview || x.excerpt || x.description || x.a || ""
        ),
        extra,
        image: x.image_url ?? x.thumbnail ?? x.cover ?? null,
      };
    });
  if (json.data && typeof json.data === "object") {
    const rootData = json.data;
    const videos = json.videos || rootData.videos || [];
    const blogs = json.blogs || rootData.blogs || [];
    const works = json.works || rootData.works || [];
    const news = json.news || rootData.news || [];
    const questions = json.questions || rootData.questions || [];
    return [
      ...pack(blogs, "blog"),
      ...pack(works, "work"),
      ...pack(news, "news"),
      ...pack(videos, "video"),
      ...pack(questions, "qa"),
    ];
  }
  const videos = json.videos || [];
  const blogs = json.blogs || [];
  const works = json.works || [];
  const news = json.news || [];
  const questions = json.questions || [];
  return [
    ...pack(blogs, "blog"),
    ...pack(works, "work"),
    ...pack(news, "news"),
    ...pack(videos, "video"),
    ...pack(questions, "qa"),
  ];
}
