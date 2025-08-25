"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ExoApeOverlayMenu({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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

    // 只在「開啟菜單」時加上這些 class（行為維持原本）
    const ACTIVE_CLASSES = [
      "relative",
      "w-screen",
      "z-10",
      "!bg-transparent",
      "origin-top-right",
    ];
    const addActiveClasses = () => {
      if (container) container.classList.add(...ACTIVE_CLASSES);
    };
    const removeActiveClasses = () => {
      if (container) container.classList.remove(...ACTIVE_CLASSES);
    };

    // 手機才需要撐滿高度；桌機直接跳過
    const setContainerMinHeight = () => {
      if (!container) return;
      if (window.matchMedia("(min-width: 768px)").matches) {
        container.style.minHeight = ""; // 桌機移除任何 min-height
        return;
      }
      const de = document.documentElement;
      const body = document.body;
      const docH = Math.max(
        de.scrollHeight,
        de.offsetHeight,
        de.clientHeight,
        body?.scrollHeight || 0,
        body?.offsetHeight || 0
      );
      container.style.minHeight = `${docH}px`;
    };

    // 初次設定 + 監聽
    setContainerMinHeight();
    const onResize = () => setContainerMinHeight();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    document.fonts?.ready?.then(onResize);
    const mo = new MutationObserver(() => setContainerMinHeight());
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // 預覽圖
    const resetPreviewImage = () => {
      if (!menuPreviewImg) return;
      menuPreviewImg.innerHTML = "";
      const img = document.createElement("img");
      img.src = "/img-1.jpg";
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

    const animateHamburger = (opening) => {
      if (!lineTop || !lineMid || !lineBot) return;
      if (opening) {
        gsap.to(lineTop, {
          y: 6,
          rotate: 45,
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(lineMid, { opacity: 0, duration: 0.2, ease: "power2.out" });
        gsap.to(lineBot, {
          y: -6,
          rotate: -45,
          duration: 0.35,
          ease: "power2.out",
        });
      } else {
        gsap.to(lineTop, {
          y: 0,
          rotate: 0,
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(lineMid, { opacity: 1, duration: 0.2, ease: "power2.out" });
        gsap.to(lineBot, {
          y: 0,
          rotate: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    };

    const openMenu = () => {
      if (isAnimating || isOpen) return;
      isAnimating = true;

      // 僅手機會有 container（桌機 md:hidden 沒有容器也沒關係）
      if (menuOverlay) menuOverlay.style.pointerEvents = "auto";
      addActiveClasses();
      setContainerMinHeight();

      if (container) {
        gsap.to(container, {
          rotation: 10,
          x: 300,
          y: 450,
          scale: 1.5,
          duration: 1.25,
          ease: "power4.inOut",
          transformOrigin: "right top",
          onUpdate: setContainerMinHeight,
        });
      }

      animateHamburger(true);

      if (menuContent) {
        gsap.to(menuContent, {
          rotation: 0,
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.25,
          ease: "power4.inOut",
        });
      }

      gsap.to(
        [
          ...root.querySelectorAll(".link a"),
          ...root.querySelectorAll(".social a"),
        ],
        {
          y: "0%",
          delay: 0.75,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      if (menuOverlay) {
        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
          duration: 1.25,
          ease: "power4.inOut",
          onComplete: () => {
            isOpen = true;
            isAnimating = false;
            menuToggle?.setAttribute("aria-expanded", "true");
            document.documentElement.style.overflow = "hidden";
            setContainerMinHeight();
          },
        });
      }
    };

    const closeMenu = () => {
      if (isAnimating || !isOpen) return;
      isAnimating = true;

      if (container) {
        gsap.to(container, {
          rotation: 0,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.25,
          ease: "power4.inOut",
          transformOrigin: "right top",
          onUpdate: setContainerMinHeight,
          onComplete: setContainerMinHeight,
        });
      }

      animateHamburger(false);

      if (menuContent) {
        gsap.to(menuContent, {
          rotation: -15,
          x: -100,
          y: -100,
          scale: 1.5,
          opacity: 0.25,
          duration: 1.25,
          ease: "power4.inOut",
        });
      }

      if (menuOverlay) {
        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "power4.inOut",
          onComplete: () => {
            isOpen = false;
            isAnimating = false;
            menuToggle?.setAttribute("aria-expanded", "false");
            gsap.set(
              [
                ...root.querySelectorAll(".link a"),
                ...root.querySelectorAll(".social a"),
              ],
              { y: "120%", opacity: 0.25 }
            );
            resetPreviewImage();
            document.documentElement.style.overflow = "";

            menuOverlay.style.pointerEvents = "none";
            removeActiveClasses();
            setContainerMinHeight();
          },
        });
      }
    };

    const handleToggle = () => (isOpen ? closeMenu() : openMenu());

    const handleHover = (e) => {
      if (!isOpen || isAnimating) return;
      const link = e.currentTarget;
      const imgSrc = link.getAttribute("data-img");
      if (!imgSrc || !menuPreviewImg) return;

      const imgs = menuPreviewImg.querySelectorAll("img");
      if (imgs.length > 0 && imgs[imgs.length - 1].src.endsWith(imgSrc)) return;

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
        onComplete: setContainerMinHeight,
      });
    };

    const handleLinkClick = (e) => {
      const href = e.currentTarget.getAttribute("href") || "#";
      if (href.startsWith("#") || href === "#") e.preventDefault();
      closeMenu();
    };

    menuToggle?.addEventListener("click", handleToggle);
    menuLinks.forEach((a) => {
      a.addEventListener("mouseover", handleHover);
      a.addEventListener("click", handleLinkClick);
    });

    // 初始
    if (menuOverlay) menuOverlay.style.pointerEvents = "none";
    removeActiveClasses();
    resetPreviewImage();

    const onKey = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);

    return () => {
      menuToggle?.removeEventListener("click", handleToggle);
      menuLinks.forEach((a) => {
        a.removeEventListener("mouseover", handleHover);
        a.removeEventListener("click", handleLinkClick);
      });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      mo.disconnect();

      document.documentElement.style.overflow = "";
      if (menuOverlay) menuOverlay.style.pointerEvents = "none";
      removeActiveClasses();
    };
  }, []);

  return (
    <div ref={rootRef} className="exoape-menu-root z-[60]">
      {/* 手機頂欄（桌機隱藏） */}
      <nav className="md:hidden fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-5 py-4 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="font-semibold text-white">
          <a href="/" aria-label="Brand">
            8-DISTANCE
          </a>
        </div>

        {/* 三條線漢堡按鈕 */}
        <button
          className="menu-toggle !z-50 relative w-11 h-11 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5"
          type="button"
          aria-label="Toggle menu"
          aria-expanded="false"
          aria-controls="exoape-menu-overlay"
        >
          <span className="line top absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[14px]" />
          <span className="line middle absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[21px]" />
          <span className="line bottom absolute w-[22px] h-[2px] bg-white left-1/2 -translate-x-1/2 top-[28px]" />
        </button>
      </nav>

      {/* 手機 Overlay（桌機隱藏） */}
      <div
        id="exoape-menu-overlay"
        className="menu-overlay md:hidden fixed inset-0 bg-[#0f0f0f] z-[50]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="menu-content relative w-full h-full flex items-center justify-center origin-bottom-left opacity-25"
          style={{
            transform:
              "translateX(-100px) translateY(-100px) scale(1.5) rotate(-15deg)",
          }}
        >
          <div className="menu-items w-full flex flex-wrap gap-5 px-5 py-8 text-white">
            {/* 連結區 */}
            <div className="col-sm order-1 basis-full flex flex-col gap-8">
              <div className="menu-links flex flex-col gap-2">
                {[
                  {
                    label: "關於我們",
                    img: "/images/project-01/img02.jpg",
                    href: "/about",
                  },
                  {
                    label: "作品欣賞",
                    img: "/images/project-01/img03.jpg",
                    href: "/#core",
                  },
                  {
                    label: "服務流程",
                    img: "/images/project-01/img04.jpg",
                    href: "/#signals",
                  },
                  {
                    label: "設計札記",
                    img: "/images/project-01/img05.jpg",
                    href: "/#connect",
                  },
                ].map((item) => (
                  <div key={item.label} className="link pb-1">
                    <a
                      href={item.href}
                      data-img={item.img}
                      className="inline-block text-[2.25rem] leading-none tracking-tight text-white opacity-25 translate-y-[120%] transition-colors hover:opacity-100"
                    >
                      {item.label}
                    </a>
                  </div>
                ))}
              </div>

              <div className="menu-socials flex flex-col gap-2">
                {[
                  { label: "Behance", href: "https://behance.net" },
                  { label: "Dribbble", href: "https://dribbble.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "Instagram", href: "https://instagram.com" },
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

          {/* 底部 Footer */}
          <div className="menu-footer absolute bottom-0 left-0 w-full px-5 pb-3 text-white">
            <div className="flex flex-col gap-3">
              <div className="col-lg">
                <a href="/#run" className="relative inline-block">
                  Run Sequence
                </a>
              </div>
              <div className="col-sm flex justify-between gap-4">
                <a href="/#origin" className="relative inline-block">
                  Origin
                </a>
                <a href="/#join" className="relative inline-block">
                  Join Signal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 只有手機才有效果的 exo-container；桌機上不影響排版（display:contents） */}
      <div className="exo-container md:contents">{children}</div>

      {/* 保留你原本的樣式，外加「桌機重置」段，確保只有手機受影響 */}
      <style jsx>{`
        :global(html, body, #__next) {
          height: 100%;
        }
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

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
        .menu-toggle .line.top {
          top: 14px;
        }
        .menu-toggle .line.middle {
          top: 21px;
        }
        .menu-toggle .line.bottom {
          top: 28px;
        }

        .menu-overlay {
          position: fixed;
          width: 100vw;
          height: 100svh;
          background-color: #0f0f0f;
          z-index: 50;
          clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
        }
        .menu-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-origin: left bottom;
          will-change: opacity, transform;
          transform: translateX(-100px) translateY(-100px) scale(1.5)
            rotate(-15deg);
          opacity: 0.25;
        }

        .menu-items,
        .menu-footer {
          width: 100%;
          padding: 2rem 1.25rem;
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
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
          font-size: 2.25rem;
          letter-spacing: -0.02rem;
        }
        .social a {
          color: #8f8f8f;
        }
        .social a:hover {
          color: #fff;
        }

        .menu-footer {
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .menu-footer .col-sm {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 0.75rem;
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

        /* 手機：保留原本絕對定位與 transform-origin，以符合你的動效 */
        .exo-container {
          position: absolute;
          width: 100%;
          will-change: transform;
          transform-origin: right top;
        }

        /* 桌機（≥768px）：把 exo-container 變成不影響排版（display:contents），並重置所有會干擾高度的屬性 */
        @media (min-width: 768px) {
          .exo-container {
            position: static !important;
            width: auto !important;
            min-height: 0 !important;
            transform: none !important;
            will-change: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
