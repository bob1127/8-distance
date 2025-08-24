"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Logo from "./Logo";

const PageTransition = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const pathLengthRef = useRef(0);
  const revealTimeoutRef = useRef(null);

  // 只在需要時讓 overlay 可互動，其它時候完全穿透
  const setOverlayInteractive = useCallback((active) => {
    const pe = active ? "auto" : "none";
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = pe;
      if (active) {
        overlayRef.current.removeAttribute("inert");
        overlayRef.current.setAttribute("aria-hidden", "false");
      } else {
        overlayRef.current.setAttribute("inert", "");
        overlayRef.current.setAttribute("aria-hidden", "true");
      }
    }
    if (logoOverlayRef.current) {
      logoOverlayRef.current.style.pointerEvents = pe;
      if (active) {
        logoOverlayRef.current.removeAttribute("inert");
        logoOverlayRef.current.setAttribute("aria-hidden", "false");
      } else {
        logoOverlayRef.current.setAttribute("inert", "");
        logoOverlayRef.current.setAttribute("aria-hidden", "true");
      }
    }
  }, []);

  const handleRouteChange = useCallback((url) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    coverPage(url);
  }, []);

  const onAnchorClick = useCallback(
    (e) => {
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        e.currentTarget.target === "_blank"
      ) {
        return;
      }
      e.preventDefault();
      const href = e.currentTarget.href;
      const url = new URL(href).pathname;
      if (url !== pathname) {
        handleRouteChange(url);
      }
    },
    [pathname, handleRouteChange]
  );

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    // 收闔開場格
    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });
    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
        setOverlayInteractive(false); // ← 統一走這裡，確保關閉
      },
    });

    // 安全網：若動畫被中斷，1 秒後仍強制關閉互動
    revealTimeoutRef.current = setTimeout(() => {
      if (blocksRef.current.length > 0) {
        const firstBlock = blocksRef.current[0];
        if (firstBlock && gsap.getProperty(firstBlock, "scaleX") > 0) {
          gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.2,
            ease: "power2.out",
            transformOrigin: "right",
            onComplete: () => {
              isTransitioning.current = false;
              setOverlayInteractive(false);
            },
          });
        } else {
          setOverlayInteractive(false);
        }
      } else {
        setOverlayInteractive(false);
      }
    }, 1000);
  }, [setOverlayInteractive]);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];
      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };

    createBlocks();

    // 初始狀態：格子縮回、overlay 不可互動
    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
    setOverlayInteractive(false);

    // 準備 logo path
    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        pathLengthRef.current = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLengthRef.current,
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        });
      }
    }

    // 首屏：收闔動畫
    revealPage();

    // 攔站內連結做轉場
    const links = Array.from(document.querySelectorAll('a[href^="/"]'));
    links.forEach((link) => {
      link.addEventListener("click", onAnchorClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", onAnchorClick);
      });
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      setOverlayInteractive(false);
    };
  }, [router, pathname, onAnchorClick, revealPage, setOverlayInteractive]);

  const coverPage = (url) => {
    setOverlayInteractive(true); // ← 只在轉場期間開啟攔截

    const tl = gsap.timeline({
      onComplete: () => router.push(url),
    });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "left",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
      .set(
        logoRef.current.querySelector("path"),
        { strokeDashoffset: pathLengthRef.current, fill: "transparent" },
        "-=0.25"
      )
      .to(
        logoRef.current.querySelector("path"),
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" },
        "-=0.5"
      )
      .to(
        logoRef.current.querySelector("path"),
        { fill: "#e3e4d8", duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });
  };

  return (
    <>
      {/* 預設就不可互動，避免遮擋 */}
      <div
        ref={overlayRef}
        className="transition-overlay"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
        inert=""
      />
      <div
        ref={logoOverlayRef}
        className="logo-overlay"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
        inert=""
      >
        <div className="logo-container">
          <Logo ref={logoRef} />
        </div>
      </div>

      {children}

      {/* 保險：強制讓 overlay 預設穿透（不改你原本 CSS，只添加） */}
      <style jsx global>{`
        .transition-overlay,
        .logo-overlay {
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default PageTransition;
