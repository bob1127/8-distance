"use client";

import ThreeDSlider from "../../components/3DSlider.jsx";
import ParallaxImage from "../../components/ParallaxImage";
import InfiniteScroll from "../../components/InfiniteScroll/page.jsx";
import GsapText from "../../components/RevealText/index";
import HomeSlider from "../../components/HeroSliderHome/page.jsx";
import { useState } from "react";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link.js";
import StaffCard from "@/components/StaffCard";

import AnimatedLink from "../../components/AnimatedLink.tsx";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import ScrollTopCard from "../../components/ScrollTopCard/index.jsx";
import ScrollTopCard1 from "../../components/ScrollTopCard1/index.jsx";
import ScrollTopCard2 from "../../components/ScrollTopCard2/index.jsx";
import { ReactLenis } from "@studio-freight/react-lenis";
import Script from "next/script";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Marquee from "react-fast-marquee";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });
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

  return (
    <ReactLenis root>
      <div>
        <section className="section-staff">
          <div className="title pb-10 max-w-[1300px] mx-auto">
            <h1 className="text-[28px] mt-0  text-black font-normal ">
              <p className="text-[14px] font-bold text-[#126844]">Members</p>
              捌程室內設計
            </h1>
          </div>
          <div className="menbers max-w-[1300px] mx-auto grid grid-cols-3 gap-4 pb-20">
            <StaffCard
              imgSrc="/images/menbers/捌程室內設計張佩甄.jpg.avif"
              title="室內設計總監"
              name="Jen 張褞矇"
              description="專注於住宅與商空整合設計，擁有豐富的改造與風格塑造經驗。"
            />
            <StaffCard
              imgSrc="/images/menbers/捌程室內設計胡萬福.jpeg.avif"
              title="設計總監"
              name="John 王小明"
              description="擅長以簡約風格結合實用空間機能，深受客戶好評。"
            />
            <StaffCard
              imgSrc="/images/menbers/蕭廷羽.jpg.avif"
              title="室內設計總監"
              name="Jen 張褞矇"
              description="專注於住宅與商空整合設計，擁有豐富的改造與風格塑造經驗。"
            />
            <StaffCard
              imgSrc="/images/menbers/捌程室內設計張佩甄.jpg.avif"
              title="室內設計總監"
              name="Jen 張褞矇"
              description="專注於住宅與商空整合設計，擁有豐富的改造與風格塑造經驗。"
            />
            <StaffCard
              imgSrc="/images/menbers/捌程室內設計胡萬福.jpeg.avif"
              title="設計總監"
              name="John 王小明"
              description="擅長以簡約風格結合實用空間機能，深受客戶好評。"
            />
            <StaffCard
              imgSrc="/images/menbers/蕭廷羽.jpg.avif"
              title="室內設計總監"
              name="Jen 張褞矇"
              description="專注於住宅與商空整合設計，擁有豐富的改造與風格塑造經驗。"
            />
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
