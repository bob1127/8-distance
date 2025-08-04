"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";

const LottieTransitionOverlay = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="rotate-90">
          {" "}
          <Player
            src="/lottie/Loader Ball with Physical Interaction.json"
            style={{ width: 300, height: 300 }}
            autoplay
            keepLastFrame
          />
        </div>
        <div>
          <b className="text-[16px] font-bold ">捌程室內設計</b>
        </div>
      </div>
    </motion.div>
  );
};

export default LottieTransitionOverlay;
