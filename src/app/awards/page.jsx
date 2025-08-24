"use client";
import GsapText from "../../components/RevealText/index";
import ThreeJs from "../../components/ThreeSlider/index";
import { projects } from "../../components/ParallaxCard/data";
import { TextGenerateEffect } from "../../components/ui/text-generate-effec-home";
import ScrollCard from "../../components/ParallaxCard/page";
import { Card, CardBody } from "@nextui-org/react";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import AnimatedLink from "../../components/AnimatedLink";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });
  const staticSlides = [
    {
      title: "小資裝修專案",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kumu_mv-1920x1280.jpg",
      link: "/project/small-budget",
    },
    {
      title: "商業空間設計",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/kaika_mv-1920x1280.jpg",
      link: "/project/commercial-space",
    },
    {
      title: "老屋翻新工程",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/wbjujo_mv-1920x1280.jpg",
      link: "/project/renovation",
    },
    {
      title: "北歐簡約風",
      image:
        "https://www.rebita.co.jp/wp-content/uploads/2025/06/spharumiflag_mv-1920x1281.jpg",
      link: "/project/nordic-style",
    },
    {
      title: "現代輕奢宅",
      image: "https://www.rebita.co.jp/images/index/solutioncard_bg_2.jpg",
      link: "/project/luxury-modern",
    },
  ];

  return (
    <>
      {/* <h1 className="mt-[20vh] ml-[20px] md:ml-[10%]  mb-[35px] lg:mb-[6px] text-[2.3rems] md:text-[3rem] xl:text-[5rem] font-normal text-gray-800"></h1> */}
      {/* <div className="pt-[14vh] pl-[10%] 2xl:pl-[20%] mb-[5vmin]">
        <GsapText
          text="TENDER-宜安"
          id="gsap-intro"
          fontSize="2.8rem"
          fontWeight="500"
          color="#000"
          lineHeight="60px"
          className="text-center inline-block mb-0 h-auto "
        />
      </div> */}
      {/* <ThreeJs /> */}
      <section className="section-hero py-20">
        <Image
          src="/images/awards-logo.png"
          alt="award-icon"
          placeholder="empty"
          loading="lazy"
          width={700}
          height={700}
          className="max-w-[350px] mx-auto"
        ></Image>
        <div className="description flex flex-col max-w-[600px] mx-auto">
          <p className="tracking-wider leading-relaxed text-center">
            法國設計獎
          </p>
          <h1 className="text-rose-500 text-[20px] text-center">Gold.Winner</h1>
          <p className="tracking-wider leading-relaxed text-center">
            榮獲國際大獎的肯定
          </p>
        </div>
        <Marquee>
          <div>
            <div className="text-[70px] flex justify-center items-center font-bold ">
              {" "}
              榮獲國際大獎的肯定{" "}
              <Image
                src="/images/awards-logo.png"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              ></Image>{" "}
              法國設計獎{" "}
              <Image
                src="/images/awards-logo.png"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              ></Image>{" "}
              Gold.Winner
            </div>
          </div>
        </Marquee>
      </section>
      <main ref={container} className=" relative">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <ScrollCard
              total={projects.length} // ✅ 修正這裡
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
      <section className="section-award-item max-w-[1920px] mx-auto w-[80%]">
        <div className="flex py-[10vh] flex-col lg:flex-row">
          <div className="w-1/2 items-center flex justify-center">
            <div className=" w-full ">
              <Image
                src="/images/捌程-2024法國設計獎電子證書-員林胡宅.png"
                placeholder="empty"
                loading="lazy"
                className="w-[90%]"
                alt=""
                width={500}
                height={800}
              ></Image>
            </div>
          </div>
          <div className=" w-full lg:w-1/2">
            <div className="description max-w-[600px] p-10">
              <TextGenerateEffect
                words="榮獲國際大獎的肯定

"
              />

              <br></br>
              <p className="text-[.9rem] tracking-widest">
                能夠榮獲國際大獎的肯定，對我們而言意義非凡。這份榮耀凝聚了團隊成員們的心血與智慧，是大家攜手努力的成果。這份肯定更是驅動我們不斷向前的動力，期許未來能持續精進設計，為大家帶來更多卓越的作品！
                特別感謝我們的業主，您們的信任與支持是我們最大的力量。每一次的交流與啟發，都成為我們克服挑戰、實現創意的寶貴泉源。謝謝您們與我們一同成就這份殊榮。
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-others-project mb-20 w-full">
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
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3.5 },
          }}
          className="m-0 p-0 !overflow-visible sm:!overflow-hidden"
        >
          {staticSlides.map((slide, idx) => (
            <SwiperSlide
              key={idx}
              className="mx-2  overflow-hidden group relative duration-1000 "
            >
              <div className="title absolute top-5 left-5 z-[999]">
                <span className="text-white text-[.9rem]">{slide.title}</span>
              </div>
              <div className="title absolute bottom-5 flex right-5 z-[999]">
                <button className="relative h-12 bg-transparent px-4 group-hover:text-white text-neutral-950">
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[110%] text-transparent group-hover:skew-y-12">
                      View More
                    </div>
                    <div className="absolute translate-y-[110%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      View More
                    </div>
                  </span>
                </button>
                <button className="relative opacity-10 group-hover:opacity-100 duration-500 inline-flex h-12 w-12 items-center justify-center overflow-hidden border font-medium text-neutral-200">
                  <div className="translate-x-0 transition group-hover:translate-x-[300%]">
                    ➔
                  </div>
                  <div className="absolute -translate-x-[300%] transition group-hover:translate-x-0">
                    ➔
                  </div>
                </button>
              </div>

              <AnimatedLink href={slide.link}>
                <div className="absolute z-50 w-full h-full inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out" />
                <Card
                  className="border-white !rounded-[0px]  pb-4 w-full h-[250px] md:h-[280px] lg:h-[300px] 2xl:h-[320px] max-h-[450px] border relative bg-no-repeat bg-center bg-cover shadow-none overflow-hidden transition-transform duration-1000 ease-in-out hover:scale-110"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <CardBody className="flex relative flex-col h-full w-full px-0"></CardBody>
                </Card>
              </AnimatedLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
