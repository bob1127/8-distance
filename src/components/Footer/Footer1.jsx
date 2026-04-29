import React from "react";
import Content from "./Content";

export default function Footer() {
  return (
    <div
      id="dark-section"
      className="relative "
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <Content />
      <div className="bg-black ">
        <div className="pt-0 pb-5  sm:w-[45%] md:w-[35%] 2xl:w-[25%] mx-auto max-w-[500px]  flex sm:flex-row flex-col justify-center items-center sm:justify-between"></div>
      </div>
    </div>
  );
}
