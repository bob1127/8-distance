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
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { links } from "./menuContent";
import AnimatedLink from "../AnimatedLink";
const Menu = ({ isDarkBg }) => {
  const init = useRef(false);
  const container = useRef();
  const menuRef = useRef(null);
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

  useGSAP(
    () => {
      if (menuRef.current) {
        const menu = menuRef.current;
        const links = menu.querySelectorAll(".link h2");
        const socials = menu.querySelectorAll(".socials .line p");
        const menuContent = menu.querySelector(".menu-content");

        links.forEach((link) => {
          link.addEventListener("click", toggleMenu);
        });

        gsap.set(menu, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(links, { y: 120 });
        gsap.set(socials, { y: 30 });
        gsap.set(menuContent, { y: 40, opacity: 0 });

        init.current = true;
      }
    },
    { scope: container }
  );

  const animateMenu = useCallback((open) => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const links = menu.querySelectorAll(".link h2");
    const socialsCols = menu.querySelectorAll(".socials .sub-col");
    const menuContent = menu.querySelector(".menu-content");

    setIsAnimating(true);

    if (open) {
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "hop",
        duration: 1,
        onStart: () => {
          menu.style.pointerEvents = "auto";
        },
        onComplete: () => setIsAnimating(false),
      });

      gsap.to(menuContent, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        delay: 0.4,
      });

      if (window.innerWidth >= 768) {
        gsap.to(links, {
          y: -25,
          stagger: 0.05,
          delay: 0.6,
          duration: 0.6,
          ease: "power4.out",
        });
      } else {
        gsap.set(links, { y: 0 });
      }

      socialsCols.forEach((subCol) => {
        const socialCopy = subCol.querySelectorAll(".line p");
        gsap.to(socialCopy, {
          y: 0,
          stagger: 0.1,
          delay: 1.2,
          duration: 1,
          ease: "power4.out",
        });
      });
    } else {
      gsap.to(menuContent, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power4.in",
      });

      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop",
        duration: 1.5,
        delay: 0.25,
        onComplete: () => {
          menu.style.pointerEvents = "none";
          gsap.set(menu, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });

          gsap.set(links, { y: 120 });
          socialsCols.forEach((subCol) => {
            const socialCopy = subCol.querySelectorAll(".line p");
            gsap.set(socialCopy, { y: 30 });
          });

          setIsAnimating(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (init.current) {
      animateMenu(isOpen);
    }
  }, [isOpen, animateMenu]);

  useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;
    menuEl.style.pointerEvents = isOpen ? "auto" : "none";
  }, [isOpen]);

  return (
    <div ref={container}>
      <motion.div
        className={`fixed top-0 left-0 w-full z-50 px-6 border-b-1 border-[#636363] py-3 flex justify-between items-center transition-colors duration-300 ${
          showBlur ? "bg-black/80 backdrop-blur shadow-md" : "bg-transparent"
        }`}
      >
        {/* LOGO 左側 */}
        <Link href="/" className="block">
          <div className="flex flex-col justify-center items-center">
            <span className="text-[18px] font-bold">LOGO</span>
            <span className="text-[10px]">Interior Design</span>
          </div>
        </Link>

        {/* 新增：中間導覽項目 */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/ServiceProcess"
            className="text-white text-sm hover:underline"
          >
            Projects
          </Link>
          <Link href="/hot-sale" className="text-white text-sm hover:underline">
            Design Style
          </Link>
          <Link href="/qa" className="text-white text-sm hover:underline">
            Portfolio
          </Link>
        </nav>

        {/* Menu 按鈕右側 */}
        <button
          onClick={toggleMenu}
          className="text-sm text-black bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 border border-white/50 hover:bg-white/60 transition"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </motion.div>

      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen py-20 px-6 flex flex-col items-center justify-center bg-[#f0f3f3] z-[60] overflow-y-auto text-white"
        style={{
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        }}
      >
        <div className="menu-content flex flex-col items-center">
          <h1 className="text-4xl text-gray-600 mb-6">FULL MENU</h1>
          <ul className="space-y-4 text-lg">
            {links.map((link, index) => (
              <li key={index} className="link">
                <AnimatedLink href={link.href}>
                  <h2>{link.title}</h2>
                </AnimatedLink>
              </li>
            ))}
          </ul>

          <button
            onClick={closeMenu}
            className="mt-10 px-4 py-2 border border-gray-500 rounded-full hover:bg-white hover:text-black text-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
