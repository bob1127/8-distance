"use client";

import { useState, useEffect } from "react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card, CardBody } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLink from "../AnimatedLink";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function SwiperCardAbout() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);

  return (
    <div className="flex flex-col lg:flex-row w-full m-0 p-0 items-start gap-8">
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={1200}
        spaceBetween={16}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => {
          setCurrentIndex(((swiper.realIndex ?? 0) % posts.length) + 1);
        }}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 1.3 },
        }}
        className="m-0 p-0 !overflow-visible sm:!overflow-hidden"
      >
        <SwiperSlide className="swiper-slider">
          <div class="mx-auto  p-6">
            <div class="relative h-[450px] overflow-hidden">
              <img
                src="https://www.m-zec.com/assets/image/kv01.jpg"
                alt="arrow mask"
                class="h-full w-full object-cover transform-gpu
             [clip-path:polygon(0_0,92%_0,100%_50%,92%_100%,0_100%,0_65%,12%_50%,0_35%)]"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slider">
          <div class="mx-auto  p-6">
            <div class="relative h-[450px] overflow-hidden">
              <img
                src="https://www.m-zec.com/assets/image/kv01.jpg"
                alt="arrow mask"
                class="h-full w-full object-cover transform-gpu
             [clip-path:polygon(0_0,92%_0,100%_50%,92%_100%,0_100%,0_65%,12%_50%,0_35%)]"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slider">
          <div class="mx-auto  p-6">
            <div class="relative h-[450px] overflow-hidden">
              <img
                src="https://www.m-zec.com/assets/image/kv01.jpg"
                alt="arrow mask"
                class="h-full w-full object-cover transform-gpu
             [clip-path:polygon(0_0,92%_0,100%_50%,92%_100%,0_100%,0_65%,12%_50%,0_35%)]"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="swiper-slider">
          <div class="mx-auto max-w-6xl p-6">
            <div class="relative h-[450px] overflow-hidden">
              <img
                src="https://www.m-zec.com/assets/image/kv01.jpg"
                alt="arrow mask"
                class="h-full w-full object-cover transform-gpu
             [clip-path:polygon(0_0,92%_0,100%_50%,92%_100%,0_100%,0_65%,12%_50%,0_35%)]"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
