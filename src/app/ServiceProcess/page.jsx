"use client";
// import { TransitionLink } from "../../components/utils/TransitionLink";
// import EmblaCarousel from "../../components/EmblaCarousel07/EmblaCarousel";
import AnimatedLink from "../../components/AnimatedLink";
import { Form, Input, Button } from "@heroui/react";
import FullPage from "../../components/FullPage";

import { AnimatedTooltip } from "../../components/ui/animated-tooltip";
import GsapText from "../../components/RevealText/index";
import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import { TextGenerateEffect } from "../../components/ui/text-generate-effect";
import InfiniteScroll from "../../components/InfiniteScroll/page";
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
export default function About() {
  const data01 = [
    {
      title: "STEP1 會談˙溝通",
      content: (
        <div>
          <div className="tag bg-rose-500 mb-4 rounded-full text-white font-bold w-[200px] flex justify-center items-center px-4 py-2">
            FREE
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            了解屋況，裝修需求、想法，預算考量，風格喜好等…
          </p>
          <div className="w-full">
            <Image
              src="/images/服務流程/服務流程-STEP1會談_溝通|寬越設計.png"
              alt="STEP1 會談_溝通"
              width={500}
              height={500}
              placeholder="empty"
              loading="lazy"
              className="rounded-lg object-cover h-[450px] w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "STEP2 現勘˙丈量",
      content: (
        <div>
          <div className="tag bg-rose-500 mb-4 rounded-full text-white font-bold w-[200px] flex justify-center items-center px-4 py-2">
            FREE
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            環境勘查，丈量拍照，初步規劃想法討論。
          </p>
          <div className="w-full">
            <Image
              src="/images/服務流程/服務流程-STEP2現勘_丈量|寬越設計.png"
              alt="STEP1 會談_溝通"
              width={500}
              height={500}
              placeholder="empty"
              loading="lazy"
              className="rounded-lg object-cover h-[450px] w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "STEP3 平面配置˙初步估價",
      content: (
        <div>
          <div className="tag bg-rose-500 mb-4 rounded-full text-white font-bold w-[200px] flex justify-center items-center px-4 py-2">
            FREE
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            平面空間動線規劃，設計風格簡報， 初步估價， 規劃預算。
          </p>
          <div className="w-full">
            <Image
              src="/images/服務流程/服務流程-STEP3平面配置＿初步估價|寬越設計.png"
              alt="STEP1 會談_溝通"
              width={500}
              height={500}
              placeholder="empty"
              loading="lazy"
              className="rounded-lg object-cover h-[450px] w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "STEP4 設計合約",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            確認配置及風格，進行設計合約之簽訂 繪製平面系統施工圖及3D模擬彩圖。
          </p>
          <div className="w-full">
            <Image
              src="/images/服務流程/服務流程-STEP4設計合約|寬越設計.png"
              alt="STEP1 會談_溝通"
              width={500}
              height={500}
              placeholder="empty"
              loading="lazy"
              className="rounded-lg object-cover h-[450px] w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "STEP4 設計合約",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            確認配置及風格，進行設計合約之簽訂 繪製平面系統施工圖及3D模擬彩圖。
          </p>
          <div className="w-full">
            <Image
              src="/images/服務流程/服務流程-STEP4設計合約|寬越設計.png"
              alt="STEP1 會談_溝通"
              width={500}
              height={500}
              placeholder="empty"
              loading="lazy"
              className="rounded-lg object-cover h-[450px] w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const backgroundImages = [
    "/images/hero-img/img07.png",
    "/images/小資專案/468762259_122223978674031935_6019549633708583470_n.jpg",
    "/images/hero-img/img06.png",
    "/images/小資專案/469720578_122225453222031935_8767653310245579018_n.jpg",
    "/images/小資專案/469120903_122223965966031935_3027154932930762522_n.jpg",
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex); // 保留上一張索引
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);
  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "業務人員",
      qrCodeImage:
        "https://thumb.ac-illust.com/bd/bd2c033b5a0f028d5d0a5f63223c0781_t.jpeg",
      image: "/images/hero-img/img01.png",
    },
    {
      id: 2,
      name: "John Doe",
      designation: "買屋看房",
      qrCodeImage:
        "https://thumb.ac-illust.com/bd/bd2c033b5a0f028d5d0a5f63223c0781_t.jpeg",
      image: "/images/hero-img/img05.png",
    },
    {
      id: 3,
      name: "John Doe",
      designation: "詢問價格",
      qrCodeImage:
        "https://thumb.ac-illust.com/bd/bd2c033b5a0f028d5d0a5f63223c0781_t.jpeg",
      image: "/images/hero-img/img06.png",
    },
    {
      id: 4,
      name: "John Doe",
      designation: "詢問價格",
      qrCodeImage:
        "https://thumb.ac-illust.com/bd/bd2c033b5a0f028d5d0a5f63223c0781_t.jpeg",
      image: "/images/hero-img/img07.png",
    },
  ];
  const initGSAPAnimations = () => {
    const ctx = gsap.context(() => {
      const images = document.querySelectorAll(".animate-image-wrapper");

      images.forEach((image, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "top center",
            toggleActions: "play none none none",
            id: "imageReveal-" + i,
          },
        });

        tl.fromTo(
          image.querySelector(".overlay"),
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          }
        )
          .to(image.querySelector(".overlay"), {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power2.inOut",
          })
          .fromTo(
            image.querySelector(".image-container"),
            {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "power3.inOut",
            },
            "-=0.5"
          );
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return ctx; // return so we can revert later
  };

  const OPTIONS = {};

  // 這裡定義你的背景圖片
  const SLIDES = [
    "/images/hero-img/img05.png",
    "/images/ph_takahiradai-no-ie.jpg",
    "/images/ph_esperanza.jpg",
    "/images/ph_minna-no-ie.jpg",
    "/images/ph_kumamoto-tasaki-clinic.jpg",
    "/images/hadashinoie016-2048x1365.jpg.webp",
  ];
  const THUMBNAILS = [
    "/images/hero-img/img05.png",
    "/images/ph_takahiradai-no-ie.jpg",
    "/images/ph_esperanza.jpg",
    "/images/ph_minna-no-ie.jpg",
    "/images/ph_kumamoto-tasaki-clinic.jpg",
    "/images/hadashinoie016-2048x1365.jpg.webp",
  ];
  const [showNav, setShowNav] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
          setShowNav(false); // 向下滾 → 隱藏
        } else {
          setShowNav(true); // 向上滾 → 顯示
        }

        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <ReactLenis root className="">
      <div className="content h-screen">
        <FullPage />
      </div>
    </ReactLenis>
  );
}
