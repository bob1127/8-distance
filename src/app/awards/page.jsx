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
          src="https://images.ctfassets.net/5md7dhlbngv9/9egAf1S897FxEXPOmTQzC/657118af41975f2070a235bf7efd86d0/journal-logo.svg?"
          alt="award-icon"
          placeholder="empty"
          loading="lazy"
          width={700}
          height={700}
          className="max-w-[350px] mx-auto"
        ></Image>
        <div className="description flex flex-col max-w-[600px] mx-auto">
          <h1 className="text-rose-500 text-[20px] text-center">
            .g Good Design Journa
          </h1>
          <p className="tracking-wider leading-relaxed text-center">
            是傳播GOOD DESIGN AWARD相關資訊，探索設計的新可能性的媒體。
            為了讓所有人都能獲得接觸設計的機會，
            以廣闊的視野和靈活的視角思考、傳播「什麼是GOOD DESIGN」。
          </p>
        </div>
        <Marquee>
          <div>
            <div className="text-[70px] flex justify-center items-center font-bold ">
              {" "}
              IS GREAT INTERIOR{" "}
              <Image
                src="https://images.ctfassets.net/5md7dhlbngv9/9egAf1S897FxEXPOmTQzC/657118af41975f2070a235bf7efd86d0/journal-logo.svg?"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              ></Image>{" "}
              DESIGN . 8 DISTANCE{" "}
              <Image
                src="matsue00.jpg"
                alt="award-icon"
                placeholder="empty"
                loading="lazy"
                width={700}
                height={700}
                className="max-w-[80px] mx-8"
              ></Image>{" "}
              INTERIOR DESIGN
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
                src="https://journal.g-mark.org/posts/report_029/report_000.jpg"
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
                words="獲得第三大獎的肯定

"
              />

              <br></br>
              <p className="text-[.9rem] tracking-widest">
                宜園建設堅信，家不僅是住所，更是安身立命的港灣。我們致力於打造宜居空間，
                透過嚴謹的施工品質與細膩的設計，讓每一位住戶都能在這裡找到安心與幸福。
              </p>
              <p className="text-[.9rem] tracking-widest">
                <br></br>
                <br></br>
                社區所擁有的個性是一件藝術作品，為人們的生活注入新的脈動，創造出特別的瞬間。
              </p>
              <br></br>
              <br></br>
              <p className="text-[.9rem] tracking-widest">
                象徵著自然與人文的共融，我們將綠建築理念融入每一個案場，創造富含綠意、
                舒適宜人的生活環境，讓建築不僅是一座空間，而是一處與自然共存的理想家園。
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
