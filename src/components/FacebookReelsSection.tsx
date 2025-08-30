"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type ReelItem = {
  url: string; // Facebook Reels 連結
  cover?: string; // 自訂封面（可選）
  title?: string;
};

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

function loadFacebookSDK(locale = "zh_TW", version = "v23.0") {
  if (typeof window === "undefined") return;
  if (window.FB) return;

  if (!document.getElementById("facebook-jssdk")) {
    const js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.async = true;
    js.defer = true;
    js.crossOrigin = "anonymous";
    js.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=${version}`;
    document.body.appendChild(js);
  }
}

export default function FacebookReelsSection({
  items,
  cardClassName = "",
  defaultCover,
  autoPlayOnHover = true,
  autoPlayOnTap = true,
}: {
  items: ReelItem[];
  cardClassName?: string;
  defaultCover?: string;
  autoPlayOnHover?: boolean;
  autoPlayOnTap?: boolean;
}) {
  const item = items?.[0];
  if (!item) return null;

  return (
    <section className="w-full text-white">
      <div className="w-full mx-auto">
        <ReelCard
          item={item}
          index={0}
          cardClassName={cardClassName}
          defaultCover={defaultCover}
          autoPlayOnHover={autoPlayOnHover}
          autoPlayOnTap={autoPlayOnTap}
        />
      </div>
    </section>
  );
}

function ReelCard({
  item,
  index,
  cardClassName = "",
  defaultCover,
  autoPlayOnHover,
  autoPlayOnTap,
}: {
  item: ReelItem;
  index: number;
  cardClassName?: string;
  defaultCover?: string;
  autoPlayOnHover?: boolean;
  autoPlayOnTap?: boolean;
}) {
  const xfbmlRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ 處理「使用者在 hover 之中手動按暫停」的情境
  const hoveringRef = useRef(false);
  const userPausedRef = useRef(false);

  // 用於對應 xfbml.ready 回傳的 id（必須掛在 .fb-video 上）
  const idRef = useRef(`fb-video-${Math.random().toString(36).slice(2)}`);

  // 優先封面：item.cover → defaultCover → 無則交給 FB 首幀
  const previewImage = item.cover ?? defaultCover ?? null;

  // 載入 SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.fbAsyncInit = function () {
      try {
        window.FB?.init({
          xfbml: true,
          version: "v23.0",
        });
      } finally {
        setSdkReady(true);
      }
    };

    loadFacebookSDK("zh_TW", "v23.0");

    // SDK 可能已經存在
    const t = setInterval(() => {
      if (window.FB) setSdkReady(true);
    }, 200);
    const timeout = setTimeout(() => clearInterval(t), 4000);

    return () => {
      clearInterval(t);
      clearTimeout(timeout);
    };
  }, []);

  // 訂閱 XFBML ready，拿到 player instance + 同步播放狀態
  const readyHandlerRef = useRef<(msg: any) => void>();
  useEffect(() => {
    if (!sdkReady || !xfbmlRef.current) return;

    // 只解析自己這塊容器
    window.FB?.XFBML.parse(xfbmlRef.current);

    const handler = (msg: any) => {
      // msg.id 會等於 .fb-video 元素的 id
      if (msg.type === "video" && msg.id === idRef.current) {
        playerRef.current = msg.instance;

        // 提高手勢下自動播放成功率：先靜音
        try {
          playerRef.current.mute && playerRef.current.mute();
        } catch {}

        // 跟內建控制同步 React 狀態
        try {
          playerRef.current.subscribe("started", () => {
            userPausedRef.current = false;
            setIsPlaying(true);
          });
          playerRef.current.subscribe("paused", () => {
            // 若在 hover 中暫停，標記 userPaused，避免被 hover 立刻又自動播
            if (hoveringRef.current) userPausedRef.current = true;
            setIsPlaying(false);
          });
          playerRef.current.subscribe("finished", () => {
            setIsPlaying(false);
            userPausedRef.current = false;
          });
        } catch {}
      }
    };

    // 重設訂閱
    if (readyHandlerRef.current) {
      window.FB?.Event.unsubscribe("xfbml.ready", readyHandlerRef.current);
    }
    window.FB?.Event.subscribe("xfbml.ready", handler);
    readyHandlerRef.current = handler;

    return () => {
      if (readyHandlerRef.current) {
        window.FB?.Event.unsubscribe("xfbml.ready", readyHandlerRef.current);
      }
    };
  }, [sdkReady]);

  // 控制播放（不重設 src → 會從當下續播）
  const play = () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.play && playerRef.current.play();
      // 有些瀏覽器可能不會立刻觸發 started 事件，先把 UI 切成播放中
      setIsPlaying(true);
    } catch {}
  };

  const pause = () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.pause && playerRef.current.pause();
      setIsPlaying(false);
    } catch {}
  };

  // hover / tap
  const onEnter = () => {
    hoveringRef.current = true;
    // 使用者在 hover 裡手動暫停過 → 不自動播，直到離開再進來
    if (autoPlayOnHover && !userPausedRef.current) play();
  };
  const onLeave = () => {
    hoveringRef.current = false;
    userPausedRef.current = false; // 下一次 hover 允許自動播
    if (autoPlayOnHover) pause();
  };
  const onTap = () => {
    if (!autoPlayOnTap) return;
    if (isPlaying) {
      userPausedRef.current = true; // 視為使用者手動暫停
      pause();
    } else {
      userPausedRef.current = false;
      play();
    }
  };

  // 卸載時保險暫停（保留播放進度）
  useEffect(() => {
    return () => {
      try {
        playerRef.current?.pause && playerRef.current.pause();
      } catch {}
    };
  }, []);

  return (
    <div
      className={
        cardClassName ||
        "relative shrink-0 w-[220px] md:w-[260px] lg:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 ring-1 ring-white/10"
      }
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onTap}
    >
      {/* 未播放時的覆蓋層（不攔截事件） */}
      {!isPlaying && (
        <>
          {(item.cover ?? defaultCover) && (
            <Image
              src={item.cover ?? (defaultCover as string)}
              alt={item.title || "reel cover"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 220px, 280px"
              priority={false}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="rounded-full bg-white/20 backdrop-blur p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white drop-shadow"
              >
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>
          </div>
          {item.title && (
            <div className="absolute bottom-0 left-0 right-0 p-2 text-[12px] text-white/90 bg-gradient-to-t from-black/60 to-transparent line-clamp-2 pointer-events-none">
              {item.title}
            </div>
          )}
        </>
      )}

      {/* FB 影片（XFBML 會替換成 iframe） */}
      <div ref={xfbmlRef} className="absolute inset-0">
        <div
          id={idRef.current} // ✅ id 放在 fb-video 本體
          className="fb-video w-full h-full"
          data-href={item.url}
          data-allowfullscreen="true"
          data-autoplay="false" // 初始不自動播，hover 時再 play()
          data-playsinline="true"
          data-allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
        />
      </div>
    </div>
  );
}
