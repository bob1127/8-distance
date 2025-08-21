"use client";
import Form from "../../components/FullInquiryForm";
import StickySlider from "../../components/StickySider";
import Room from "../../components/room-model";
export default function TestPage() {
  return (
    <div className=" py-[80px] md:py-[150px] ">
      <Room glbUrl="/3dModel/4.glb" />
      <section className="h-screen"></section>
    </div>
  );
}
