"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

const mapClasses = [
  "variant-1",
  "variant-2",
  "variant-3",
  "variant-1",
  "variant-2",
  "variant-3",
  "variant-1",
  "variant-2",
  "variant-3",
  "variant-1",
];

const previews = [
  {
    img: "/assets/main-1.jpg",
    title: "光影之間",
    link: "/KuankoshiProjectInner",
    tags: "現代簡約, 光線運用",
    description:
      "透過光與影的交錯，營造出自然流動的空間氛圍，展現純粹而沉靜的設計語言。",
  },
  {
    img: "/assets/main-2.jpg",
    title: "靜謐居所",
    tags: "北歐風格, 溫潤木質",
    description:
      "以北歐自然色系為基調，融合木質溫度與清新線條，打造理想的療癒居家。",
  },
  {
    img: "/assets/main-3.jpg",
    title: "綠意共生",
    tags: "永續概念, 室內植栽",
    description:
      "將自然植栽融入生活空間，結合永續材料，創造綠意共生的舒適場域。",
  },
  {
    img: "/assets/main-4.jpg",
    title: "極簡美學",
    tags: "留白設計, 空間機能",
    description: "透過極簡留白與精緻機能，實現清爽俐落的現代空間規劃。",
  },
  {
    img: "/assets/main-5.jpg",
    title: "智能生活",
    tags: "科技融合, 智慧居家",
    description: "結合智慧控制系統與現代設計語彙，讓生活更便利也更具質感。",
  },
  {
    img: "/assets/main-6.jpg",
    title: "未來寓所",
    tags: "未來感, 簡約線條",
    description: "以簡潔線條與灰白色調鋪陳，傳遞低調內斂的未來生活美學。",
  },
  {
    img: "/assets/main-7.jpg",
    title: "材質實驗室",
    tags: "異材質拼接, 空間層次",
    description: "運用多元異材質交錯堆疊，展現空間層次與豐富視覺變化。",
  },
  {
    img: "/assets/main-8.jpg",
    title: "沉浸體驗",
    tags: "空間感知, 使用者導向",
    description: "透過聲光動線與空間比例的設計，強化人與空間之間的感知體驗。",
  },
  {
    img: "/assets/main-9.jpg",
    title: "運動生活館",
    tags: "機能空間, 活力色彩",
    description: "以活力跳色與開放式格局，打造動靜皆宜的居家運動空間。",
  },
  {
    img: "/assets/main-10.jpg",
    title: "設計全覽",
    tags: "風格整合, 完整案例",
    description:
      "集合多元風格與實作案例，呈現我們對空間美感與實用性的完整詮釋。",
  },
];

export default function PreviewGallery() {
  const containerRef = useRef(null);
  const previewBgRef = useRef(null);
  const activePreviewRef = useRef(null);
  const isMouseOverItemRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const previewBg = previewBgRef.current;
    const items = container.querySelectorAll(".item");

    const defaultClipPaths = {
      "variant-1": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
      "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    };

    const variantStyles = {
      "variant-1": {
        img: { bottom: "0%", right: "0%" },
        title: { top: "35%", left: "25%" },
        tags: { bottom: "25%", right: "40%" },
        desc: { top: "25%", right: "25%" },
      },
      "variant-2": {
        img: { top: "10%", right: "5%" },
        title: { bottom: "30%", left: "50%" },
        tags: { top: "25%", left: "25%" },
        desc: { bottom: "15%", right: "10%" },
      },
      "variant-3": {
        img: { bottom: "10%", left: "15%" },
        title: { bottom: "40%", right: "15%" },
        tags: { bottom: "20%", right: "30%" },
        desc: { top: "15%", left: "20%" },
      },
    };

    previews.forEach((p, idx) => {
      const variant = mapClasses[idx];
      const styles = variantStyles[variant];
      const preview = document.createElement("div");
      preview.className = `preview ${variant} preview-${idx + 1}`;
      Object.assign(preview.style, {
        position: "absolute",
        width: "100vw",
        height: "100vh",
        color: "#fff",
        opacity: 0,
        zIndex: 1,
      });

      preview.innerHTML = `
  <div class="preview-img" style="position:absolute;margin:2em;width:300px;height:400px;${
    styles.img
      ? Object.entries(styles.img)
          .map(([k, v]) => `${k}:${v};`)
          .join("")
      : ""
  }clip-path:${defaultClipPaths[variant]}"><img src="${
        p.img
      }" style="width:100%;height:100%;object-fit:cover;" /></div>
  
<div class="preview-title" style="color:#fff;position:absolute;${Object.entries(
        styles.title
      )
        .map(([k, v]) => `${k}:${v};`)
        .join("")}font-size:80px;font-weight:lighter;">
  <h1>
  <a href="${
    p.link
  }" style="color:white;text-decoration:none;pointer-events:auto;z-index:999;">

      ${p.title}
    </a>
  </h1>
</div>

  
  <div class="preview-tags" style="color:#fff;position:absolute;${Object.entries(
    styles.tags
  )
    .map(([k, v]) => `${k}:${v};`)
    .join("")}font-size:14px;line-height:1.2;"><p>${p.tags}</p></div>
  
  <div class="preview-description" style="color:#fff;position:absolute;width:250px;${Object.entries(
    styles.desc
  )
    .map(([k, v]) => `${k}:${v};`)
    .join("")}font-size:14px;line-height:1.2;"><p>${p.description}</p></div>
`;

      container.appendChild(preview);
    });

    const changeBg = (src) => {
      const newImg = document.createElement("img");
      newImg.src = src;
      Object.assign(newImg.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: 0,
      });
      previewBg.appendChild(newImg);
      gsap.to(newImg, { opacity: 1, duration: 0.5 });

      if (previewBg.children.length > 1) {
        const oldImg = previewBg.children[0];
        gsap.to(oldImg, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => oldImg.remove(),
        });
      }
    };

    const getDefaultClipPath = (el) => {
      for (const v in defaultClipPaths) {
        if (el.classList.contains(v)) return defaultClipPaths[v];
      }
      return defaultClipPaths["variant-1"];
    };

    const applyVariantStyles = (el) => {
      const variant = [...el.classList].find((c) => c.startsWith("variant-"));
      if (!variant || !variantStyles[variant]) return;
      ["title", "tags", "description"].forEach((key) => {
        const elTarget = el.querySelector(`.preview-${key}`);
        if (elTarget) gsap.set(elTarget, { x: 75, y: 75, opacity: 0 });
      });
    };

    const itemElements = container.querySelectorAll(".item");

    itemElements.forEach((item, idx) => {
      const preview = container.querySelector(`.preview-${idx + 1}`);
      applyVariantStyles(preview);

      item.addEventListener("mouseenter", () => {
        isMouseOverItemRef.current = true;
        changeBg(`/assets/bg-${idx + 1}.jpg`);

        if (activePreviewRef.current && activePreviewRef.current !== preview) {
          const old = activePreviewRef.current;
          const oldImg = old.querySelector(".preview-img");
          gsap.to(oldImg, {
            clipPath: getDefaultClipPath(old),
            duration: 0.75,
            ease: "power3.out",
          });
          gsap.to(old, { opacity: 0, duration: 0.3, delay: 0.2 });
          applyVariantStyles(old);
        }

        gsap.to(preview, { opacity: 1, duration: 0.1 });
        activePreviewRef.current = preview;

        ["title", "tags", "description"].forEach((key) => {
          const el = preview.querySelector(`.preview-${key}`);
          if (el) gsap.to(el, { x: 0, y: 0, opacity: 1, duration: 0.5 });
        });

        const img = preview.querySelector(".preview-img");
        gsap.to(img, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power3.out",
        });
      });

      item.addEventListener("mouseleave", () => {
        isMouseOverItemRef.current = false;
        setTimeout(() => {
          if (!isMouseOverItemRef.current) {
            changeBg("/assets/default-bg.jpg");
            if (activePreviewRef.current) {
              gsap.to(activePreviewRef.current, { opacity: 0, duration: 0.1 });
              activePreviewRef.current = null;
            }
          }
        }, 10);
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed  inset-0 bg-black overflow-hidden">
      <nav className="fixed w-full p-8 flex items-center z-20">
        <div className="flex-1">
          <p className="bg-white/10 text-white text-xs rounded-full px-3 py-1 backdrop-blur-md w-max">
            Menu
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <a href="#" className="text-white text-xl font-medium">
            Thetalab
          </a>
        </div>
        <div className="flex-1 flex justify-end">
          <p className="text-white text-xs">ON 11:34AM</p>
        </div>
      </nav>

      <footer className="fixed bottom-0 w-full p-8 flex justify-between items-center z-20">
        <p className="text-white text-xs">Watch Showreel</p>
        <p className="text-white text-xs">Collection 2024</p>
      </footer>

      <div className="fixed left-0 top-0 w-[30%] h-screen p-8 flex flex-col justify-center z-10">
        {previews.map((p, i) => (
          <div key={i} className="item w-max py-1 cursor-pointer">
            <p className="text-white text-sm font-light px-3 py-1 rounded-full border border-white/10 bg-white/10 backdrop-blur-md transition duration-300 hover:bg-transparent hover:border-white/25">
              {p.title}
            </p>
          </div>
        ))}
      </div>

      <div
        className="preview-bg absolute inset-0 opacity-35 -z-10"
        ref={previewBgRef}
      >
        <Image
          src="/assets/default-bg.jpg"
          alt="Default BG"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}
