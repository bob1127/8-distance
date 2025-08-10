"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { links } from "./menuContent";
import AnimatedLink from "../AnimatedLink";

const Menu = ({ isDarkBg }) => {
  const init = useRef(false);
  const container = useRef();
  const menuRef = useRef(null);
  const navLinksRef = useRef([]);
  const logoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowBlur(latest > 10);
  });

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );
  }, []);

  const toggleMenu = useCallback(() => {
    if (!isAnimating) {
      setIsOpen((prev) => !prev);
    }
  }, [isAnimating]);

  const closeMenu = useCallback(() => {
    if (!isAnimating && isOpen) {
      setIsOpen(false);
    }
  }, [isAnimating, isOpen]);

  useGSAP(() => {
    if (navLinksRef.current.length) {
      gsap.set(navLinksRef.current, { y: 20, opacity: 0 });
      gsap.to(navLinksRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 8,
        ease: "power4.out",
        stagger: 0.15,
        color: "#000",
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const borderEl = document.querySelector(".header-border-animate");
      if (borderEl) {
        gsap.set(borderEl, { width: 0 });
        gsap.to(borderEl, {
          width: "100%",
          duration: 1.8,
          delay: 7.8,
          ease: "power4.out",
        });
      }
    }
  }, []);

  return (
    <div ref={container}>
      <motion.header
        className="fixed top-0 left-0 bg-white w-full z-50 px-6 flex justify-between items-center transition-colors duration-300"
        style={{ height: "auto" }}
      >
        <div
          className="absolute bottom-0 left-0 h-[1px] bg-black header-border-animate"
          style={{ width: 0 }}
        ></div>

        <Link href="/" className="block">
          <div
            ref={logoRef}
            className="flex flex-col justify-center items-center"
          >
            <motion.img
              src="/\u634C\u7A0B\u5BA4\u5167\u8A2D\u8A08.png.avif"
              width={190}
              height={190}
              className="w-[50px] h-auto"
              alt="logo"
              loading="lazy"
              initial={{ scale: 0.9 }}
              animate={{ scale: showBlur ? 0.87 : 1.1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </Link>

        <nav className="hidden z-50  w-1/2 md:flex justify-center gap-6">
          {["/ServiceProcess", "/hot-sale", "/qa"].map((href, index) => (
            <Link
              key={href}
              href={href}
              className="text-sm hover:underline  !text-black"
              ref={(el) => (navLinksRef.current[index] = el)}
              style={{ color: "#000" }}
            >
              {href === "/ServiceProcess"
                ? "Projects"
                : href === "/hot-sale"
                ? "Design Style"
                : "Portfolio"}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="text-sm text-black bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 border border-white/50 hover:bg-white/60 transition"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </motion.header>
    </div>
  );
};

export default Menu;
