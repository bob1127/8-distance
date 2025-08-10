"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Menu from "./Menu/Menu";
import Footer from "./Footer/Footer1";
import GTMDeferred from "./GTMDeferred";
import LottieTransitionOverlay from "./LottieTransitionOverlay";
import Link from "next/link";

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 2500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <GTMDeferred />
      {/* 
      <AnimatePresence mode="wait">
        {isAnimating && <LottieTransitionOverlay key="transition" />}
      </AnimatePresence> */}

      <motion.div className="line-contact-bar fixed sm:hidden bottom-10 right-5 ">
        {/* LINE、FB、100 Icon 可保留原內容 */}
      </motion.div>

      <div className="w-[100vw] z-50 left-0 top-0 fixed">
        <Menu isDarkBg={false} />
      </div>

      <main>{children}</main>

      <Footer />
    </>
  );
}
