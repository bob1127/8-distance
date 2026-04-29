"use client";
import { useEffect, useMemo } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

/* ---------- Helpers：偵測 CJK、產生 tokens（不需 u flag） ---------- */
const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF]/;
const hasCJK = (s: string) => CJK_RE.test(s);

/** 將文字切成 tokens：
 * - 含 CJK：逐「字素」切分（有 Intl.Segmenter 用它；否則 Array.from）
 * - 非 CJK：以「單字＋空白」切（保留空白，避免手動加 {" "}）
 * - 斷行：保留 `\n`，稍後在 render 轉成 <br />
 */
function tokenize(text: string) {
  if (hasCJK(text)) {
    if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
      const seg = new (Intl as any).Segmenter("zh-Hant", {
        granularity: "grapheme",
      });
      return Array.from(seg.segment(text), (x: any) => x.segment);
    }
    return Array.from(text); // fallback
  }
  return text.split(/(\s+)/); // 英文：單字＋空白
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  startDelay = 0,
  triggerOnce = true,
  amount = 0.25,
  viewportMargin = "0px 0px -10% 0px",
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  startDelay?: number;
  triggerOnce?: boolean;
  amount?: number;
  viewportMargin?: string;
}) => {
  const [scope, animate] = useAnimate();

  const tokens = useMemo(() => tokenize(words), [words]);

  const isInView = useInView(scope, {
    once: triggerOnce,
    amount,
    margin: viewportMargin,
  } as any);

  useEffect(() => {
    if (!scope.current || !isInView) return;

    const timer = setTimeout(() => {
      animate(
        "span",
        { opacity: 1, filter: filter ? "blur(0px)" : "none" },
        { duration: duration ?? 1, delay: stagger(0.2) }
      );
    }, startDelay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, animate, filter, duration, startDelay]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          <motion.div ref={scope}>
            {tokens.map((tk, idx) =>
              tk === "\n" ? (
                // 換行不做動畫
                <br key={`br-${idx}`} />
              ) : (
                <motion.span
                  key={`${tk}-${idx}`}
                  className="dark:text-white text-black text-[18px] opacity-0"
                  style={{ filter: filter ? "blur(10px)" : "none" }}
                >
                  {tk}
                </motion.span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
