// app/components/QAAccordionClient.jsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { refreshJustFontDelayed } from "@/lib/justfont";

export default function QAAccordionClient({
  initialByCategory = { design_process: [], renovation_knowledge: [] },
  labels = { design_process: "設計流程", renovation_knowledge: "裝修知識" },
  activeCategory = "design_process",
}) {
  const [activeKey, setActiveKey] = useState(activeCategory);

  useEffect(() => {
    if (activeCategory) {
      setActiveKey(activeCategory);
    }
  }, [activeCategory]);

  useEffect(() => {
    refreshJustFontDelayed([0, 500, 1500]);
  }, [activeKey]);

  const tabs = useMemo(
    () => [
      {
        key: "design_process",
        label: labels.design_process,
        count: initialByCategory.design_process?.length || 0,
      },
      {
        key: "renovation_knowledge",
        label: labels.renovation_knowledge,
        count: initialByCategory.renovation_knowledge?.length || 0,
      },
    ],
    [labels, initialByCategory]
  );

  const handleTabClick = (key) => {
    if (key === activeKey) return;
    setActiveKey(key);
    const newUrl = `/qa/${key}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const items = initialByCategory?.[activeKey] || [];

  return (
    <div className="qa-scope mx-auto w-full">
      {/* Tabs */}
      <div role="tablist" aria-label="常見問題分類" className="relative mb-2">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => {
            const isActive = t.key === activeKey;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(t.key)}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-800"
                  }
                `}
              >
                <span className="align-middle">{t.label}</span>
                <span
                  className={`ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[11px]
                  ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {t.count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="qa-tab-underline"
                    className="absolute left-2 right-2 -bottom-1 h-[2px] rounded bg-neutral-900"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.7,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[200px]">
        {" "}
        {/* ✅ 加入 min-h 防止高度塌陷 */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeKey}
            id={`qa-panel-${activeKey}`}
            role="tabpanel"
            // ✅ 修改這裡：如果 activeKey 存在，預設就是可見的 (opacity: 1)
            // 透過 initial={false} (AnimatePresence 設定的) 其實已經會讓初次渲染直接顯示
            // 但為了保險，我們明確定義 variants 或保持原本寫法但確保 css 不會隱藏
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="divide-y divide-neutral-300/80"
          >
            {items.map((it, i) => (
              <QAItem
                key={`${activeKey}-${it.q}-${i}`}
                index={i}
                q={it.q}
                a={it.a}
              />
            ))}
            {items.length === 0 && (
              <div className="py-8 text-sm text-neutral-500">
                目前此分類沒有內容。
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Style 保持不變 */}
      <style jsx>{`
        .qa-scope {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        .qa-scope,
        .qa-scope * {
          font-synthesis: weight style small-caps !important;
        }
        .qa-scope {
          font-family: var(--app-font) !important;
        }
        .qa-scope .qa-title {
          font-family: var(--app-font) !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

// QAItem 保持不變 (省略)
function QAItem({ index, q, a }) {
  // ... 原本的代碼 ...
  const [open, setOpen] = useState(false);
  const contentId = `qa-content-${index}`;
  const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  const answerJSX = useMemo(
    () =>
      String(a || "")
        .split(/\n{2,}/)
        .map((para, i) => (
          <p key={i} className={i ? "mt-3" : undefined}>
            {para.split("\n").map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        )),
    [a]
  );

  return (
    <div className="group" role="listitem">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left focus:outline-none"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 className="qa-title pr-6 text-[18px] leading-6 text-neutral-900 group-hover:text-neutral-700">
          {q}
        </h3>

        <span
          className="ml-4 inline-flex h-5 w-5 items-center justify-center relative"
          aria-hidden="true"
        >
          <span className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-neutral-900" />
          <motion.span
            className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-neutral-900"
            animate={{ scaleY: open ? 0 : 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: transition, opacity: { duration: 0.25 } }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-6 text-[15px] leading-relaxed text-neutral-600">
              {answerJSX}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
