"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCard";
import Link from "next/link";
import ProjectSlider from "../../components/Project-Slider/Slider.jsx";
import { defaultVelocity } from "@tsparticles/engine";

const ServiceClient = () => {
  return (
    <div className="relative h-[200vh]">
      <section className="section-hero pt-20">
        <div className="relative py-10">
          <div className="swith fixed z-[9999999] left-0 bottom-6  w-full">
            <div className="relative w-full">
              <div className="switch-bar max-w-[230px] border bg-[#f5f5f7] justify-center items-center mx-auto px-5 py-4 flex rounded-[30px] border-gray-400 ">
                <span className="text-[16px] mx-1">服務項目</span>
                <span className="mx-2">|</span>
                <span className="text-[16px] mx-1">收費標準</span>
              </div>
            </div>
          </div>
          <SwiperCarousel />
          <div className="ScrollBar"></div>
          <div className="title absolute z-50 left-[10%] top-1/2">
            <h1 class="text-6xl font-bold bg-gradient-to-r from-[#1A237E] via-[#7B1FA2] to-[#E91E63] bg-clip-text text-transparent">
              設計・規劃・實現
            </h1>
            <p className="text-[#1A237E] text-md font-bold">
              從設計靈感的誕生，到規劃每一個細節，<br></br>
              最終實現獨一無二、專屬於您的生活場景。
            </p>
          </div>
        </div>
      </section>
      <section className="section-process">
        <div className="grid grid-cols-2 border">
          <img
            class="!mask !mask-pentagon w-40 h-40 object-cover"
            src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
            alt="Pentagon Masked Image"
          />
        </div>
      </section>
    </div>
  );
};

export default ServiceClient;
