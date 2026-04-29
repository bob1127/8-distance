"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Logo from "./Logo";

const PageTransition = ({ children }) => {
  // ===== 中間速度係數：1 = 原速；0.8 = 中間值 =====
  const SPEED = 0.8;

  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const pathLengthRef = useRef(0);
  const revealTimeoutRef = useRef(null);

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

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });
    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4 * SPEED,
      stagger: 0.02 * SPEED,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
        setOverlayInteractive(false);
      },
    });

    revealTimeoutRef.current = setTimeout(() => {
      if (blocksRef.current.length > 0) {
        const firstBlock = blocksRef.current[0];
        if (firstBlock && gsap.getProperty(firstBlock, "scaleX") > 0) {
          gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.2 * SPEED,
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
    }, 1000 * SPEED);
  }, [setOverlayInteractive]);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];
      for (let i = 0; i < 16; i++) {
        const block = document.createElement("div");
        block.className = "page-block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };

    createBlocks();

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
    setOverlayInteractive(false);

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

    revealPage();

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
    setOverlayInteractive(true);

    const tl = gsap.timeline({
      onComplete: () => router.push(url),
    });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4 * SPEED,
      stagger: 0.02 * SPEED,
      ease: "power2.out",
      transformOrigin: "left",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
      .set(
        logoRef.current?.querySelector("path"),
        { strokeDashoffset: pathLengthRef.current, fill: "transparent" },
        "-=0.25"
      )
      .to(
        logoRef.current?.querySelector("path"),
        { strokeDashoffset: 0, duration: 2 * SPEED, ease: "power2.inOut" },
        "-=0.6"
      )
      .to(
        logoRef.current?.querySelector("path"),
        { fill: "#e3e4d8", duration: 1 * SPEED, ease: "power2.out" },
        "-=0.5"
      )
      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.25 * SPEED,
        ease: "power2.out",
      });
  };

  return (
    <>
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
