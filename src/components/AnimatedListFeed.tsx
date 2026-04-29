// components/feeds/AnimatedListDemo.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface Item {
  id: number; // ✅ 固定 id 作為穩定 key
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

const BASE: Item[] = [
  {
    id: 0,
    name: "客戶好評",
    description:
      "我們家有長輩和小孩，設計師特地為我們規劃了許多安全又貼心的設計，像是圓弧邊角、防滑地板等。整個過程中，服務態度始終如一，有任何問題都能迅速回應，真的很負責。",
    time: "",
    icon: "👤",
    color: "#00C9A7",
  },
  {
    id: 1,
    name: "客戶好評",
    description:
      "「從一開始的諮詢到最後的驗收，每個環節都讓人感到安心。設計師不僅專業，還會細心聆聽我們的需求，把家裡的每一個小角落都規劃得超乎想像！真的非常感謝團隊的用心。",
    time: "",
    icon: "👤",
    color: "#FFB800",
  },
  {
    id: 2,
    name: "客戶好評",
    description:
      "從第一次接觸開始，設計師就很有耐心傾聽需求，過程中不厭其煩地解釋每一個細節，讓我們對新家的樣貌逐漸清晰。施工團隊也相當專業，每個步驟都會主動回報，讓人很安心。最後成果比想像還要更好，住進來後的舒適感，真的讓人覺得一切都值得。",
    time: "",
    icon: "👤",
    color: "#FF3D71",
  },
  {
    id: 3,
    name: "客戶好評",
    description:
      "家裡坪數不大，原本很擔心空間不足，沒想到設計師透過巧妙的動線規劃和收納設計，讓每個角落都能發揮作用。成品不僅美觀，實際使用起來也非常便利。每天回家都覺得空間更寬敞、明亮，這份貼心的設計感受得到專業與細心。",
    time: "",
    icon: "👤",
    color: "#1E86FF",
  },
  {
    id: 4,
    name: "客戶好評",
    description:
      "設計不只是漂亮而已，更兼顧了我們日常生活的需求。家裡收納空間變多，但卻不會讓人覺得壓迫。整體氛圍輕盈舒適，家人每天回家都心情很好。謝謝設計師將功能性和美感結合，真的超乎預期！",
    time: "",
    icon: "👤",
    color: "#1E86FF",
  },
];

const Notification = ({
  name,
  description,
  icon,
  color,
  time,
}: Omit<Item, "id">) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[500px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="shrink-0 pt-1">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: color }}
          >
            <span className="text-lg">{icon}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <figcaption className="flex items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            {time ? (
              <>
                <span className="mx-1 select-none opacity-60">·</span>
                <span className="text-xs text-gray-500">{time}</span>
              </>
            ) : null}
          </figcaption>

          <p className="text-sm font-normal dark:text-white/60 whitespace-pre-wrap break-words leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export default function AnimatedListDemo({
  className,
  stepMs = 4000,
  pauseOnHover = true,
  loop = true,
  pauseWhenHidden = true,
  pauseWhenOffscreen = true,
}: {
  className?: string;
  stepMs?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  pauseWhenHidden?: boolean;
  pauseWhenOffscreen?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pausedHover, setPausedHover] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [inView, setInView] = useState(true);

  // ✅ 用「起始指標」旋轉，不改 key
  const [start, setStart] = useState(0);
  const ordered = useMemo(() => {
    const n = BASE.length;
    return [...BASE.slice(start, n), ...BASE.slice(0, start)];
  }, [start]);

  // 可見度（分頁切走暫停）
  useEffect(() => {
    if (!pauseWhenHidden) return;
    const handler = () => setDocHidden(document.hidden);
    handler();
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [pauseWhenHidden]);

  // 是否在畫面內（離開 viewport 暫停）
  useEffect(() => {
    if (!pauseWhenOffscreen || !containerRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [pauseWhenOffscreen]);

  // rAF 定時：只更新 start 指標
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const accRef = useRef(0);

  useEffect(() => {
    const frame = (t: number) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = t - lastRef.current;
      lastRef.current = t;

      const shouldRun =
        loop &&
        !(pauseOnHover && pausedHover) &&
        !(pauseWhenHidden && docHidden) &&
        !(pauseWhenOffscreen && !inView);

      if (shouldRun) {
        accRef.current += dt;
        const interval = Math.max(500, stepMs);
        while (accRef.current >= interval) {
          setStart((s) => (s + 1) % BASE.length);
          accRef.current -= interval;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
      accRef.current = 0;
    };
  }, [
    loop,
    pausedHover,
    pauseOnHover,
    pauseWhenHidden,
    docHidden,
    pauseWhenOffscreen,
    inView,
    stepMs,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
      onMouseEnter={() => pauseOnHover && setPausedHover(true)}
      onMouseLeave={() => pauseOnHover && setPausedHover(false)}
    >
      {/* ✅ 保持固定 key（item.id）→ 不會整列清空 */}
      <AnimatedList>
        {ordered.map(({ id, ...rest }) => (
          <Notification key={id} {...rest} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
    </div>
  );
}
