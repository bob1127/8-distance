"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "../hook/use-outside-click";

/* =========================
   Carousel types & context
   ========================= */
interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/* =========================
   Carousel（保留原樣）
   ========================= */
export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full flex-col overflow-x-scroll overscroll-x-auto pt-2 md:pt-20 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          />
          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "w-full mx-auto"
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr_[33%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 左右箭頭 */}
        <div className="flex justify-between absolute w-[95%] mx-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 gap-2 mr-10">
          <button
            className="relative z-40 h-10 w-10 bg-gray-600 flex items-center justify-center disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-200" />
          </button>
          <button
            className="relative z-40 h-10 w-10 bg-gray-600 flex items-center justify-center disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-200" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

/* =========================
   Card（保留原樣，可與 Reels 混用）
   ========================= */
export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center">
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg"
            />
            {/* Modal 主體 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[9999999999999999999] w-[90vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 p-6 md:p-10"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                className="absolute top-4 right-4 h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-white dark:text-black" />
              </button>

              {/* Modal 內容 */}
              <div className="pt-16 w-full md:w-[80%] mx-auto">
                <motion.p
                  layoutId={layout ? `category-${card.title}` : undefined}
                  className="text-base font-medium text-black dark:text-white"
                >
                  {card.category}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${card.title}` : undefined}
                  className="text-3xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white"
                >
                  {card.title}
                </motion.p>
                <div className="py-10">{card.content}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[30rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-3xl font-light max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0"
        />
      </motion.button>
    </>
  );
};

/* =========================
   BlurImage（保留原樣）
   ========================= */
export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

/* =========================================================
   ★ Facebook Reels 卡片：hover/tap 才載入 iframe，自動播放
   ========================================================= */
type ReelItemProps = {
  /** 直接貼 Reels 網址，例如：
   *  https://www.facebook.com/reel/1108853487853555?locale=zh_TW
   */
  url: string;
  /** 建議自備封面圖，避免抓 FB og:image 的 CORS 問題 */
  cover: string;
  title?: string;
};

function fbPluginUrl(reelUrl: string, autoplay = 1) {
  const base = "https://www.facebook.com/plugins/video.php";
  const params = new URLSearchParams({
    href: reelUrl,
    show_text: "false",
    autoplay: String(autoplay), // 1 = 自動播放（需 muted）
    mute: "1",
    allowfullscreen: "true",
    playsinline: "1",
  });
  return `${base}?${params.toString()}`;
}

export const FacebookReelItem: React.FC<ReelItemProps> = ({
  url,
  cover,
  title,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false); // 只在可視範圍附近才允許播放
  const [everLoaded, setEverLoaded] = useState(false);

  // 進出視窗偵測：離開就立刻停播釋放資源
  useEffect(() => {
    if (!rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const visible = e.isIntersecting;
        setCanPlay(visible);
        if (!visible && isPlaying) stop();
      },
      { root: null, threshold: 0.35, rootMargin: "200px" }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [isPlaying]);

  // 控制播放
  const play = () => {
    if (!iframeRef.current) return;
    if (!canPlay) return;
    iframeRef.current.src = fbPluginUrl(url, 1);
    setIsPlaying(true);
    setEverLoaded(true);
  };

  const stop = () => {
    if (!iframeRef.current) return;
    iframeRef.current.src = "about:blank";
    setIsPlaying(false);
  };

  // 桌機 hover、手機點擊
  const onEnter = () => play();
  const onLeave = () => stop();
  const onTap = () => (isPlaying ? stop() : play());

  return (
    <motion.button
      ref={rootRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
      className="bg-neutral-900 h-80 w-56 md:h-[30rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 ring-1 ring-white/10"
      aria-label={title || "Facebook Reel"}
    >
      {/* 封面（未播放時顯示） */}
      {!isPlaying && (
        <>
          <Image
            src={cover}
            alt={title || "reel cover"}
            fill
            className="object-cover absolute inset-0 z-10"
            sizes="(max-width: 768px) 224px, 384px"
            priority={false}
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-30 grid place-items-center">
            <div className="rounded-full bg-white/25 backdrop-blur p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white drop-shadow"
              >
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 z-30 p-3 text-sm text-white/90 bg-gradient-to-t from-black/60 to-transparent line-clamp-2">
              {title}
            </div>
          )}
        </>
      )}

      {/* 真正播放的 iframe（初始不載入） */}
      <iframe
        ref={iframeRef}
        title={title || "Facebook Reel"}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        src="" // 由 play() 動態注入
        loading="lazy"
        className={`absolute inset-0 w-full h-full z-40 transition-opacity ${
          isPlaying ? "opacity-100" : everLoaded ? "opacity-0" : "opacity-0"
        }`}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </motion.button>
  );
};

/* =========================
   ★ 頁面下方短影片區（不使用 data，直接 JSX 陣列）
   ========================= */
const ReelsSection = () => {
  return (
    <section className="w-full bg-black/90 text-white py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-medium tracking-widest opacity-80 mb-6">
          更多短影片
        </h2>
        <Carousel
          items={[
            <FacebookReelItem
              key="r1"
              url="https://www.facebook.com/reel/792758949760796?locale=zh_TW"
              cover="/images/reels/1108853487853555.jpg"
              title="作品花絮｜室內與外觀的關係"
            />,
            <FacebookReelItem
              key="r2"
              url="https://www.facebook.com/reel/1108853487853555?locale=zh_TW"
              cover="/images/reels/sample02.jpg"
              title="工地記錄｜木格子細節"
            />,
            // 想再加影片 → 直接複製一個 FacebookReelItem 放這裡
            // <FacebookReelItem key="r3" url="..." cover="/images/reels/xxx.jpg" title="..." />,
          ]}
        />
      </div>
    </section>
  );
};

export default ReelsSection;
