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
    title: "Ra",
    tags: "Futuristic Fashion, Minimal Design",
    description:
      "Exploring the intersection of minimalism and future fashion trends in web design.",
  },
  {
    img: "/assets/main-2.jpg",
    title: "Uptask",
    tags: "Fashion Innovation, Graphic Simplicity",
    description:
      "Innovative fashion-forward web design with a core focus on simplicity and elegance.",
  },
  {
    img: "/assets/main-3.jpg",
    title: "Genix",
    tags: "Eco-Fashion, Sustainable Design",
    description:
      "Sustainable fashion meets modern web aesthetics, highlighting eco-friendly apparel innovations.",
  },
  {
    img: "/assets/main-4.jpg",
    title: "Unor",
    tags: "Digital Fashion, UI/UX",
    description:
      "Digital-first fashion branding that merges cutting-edge UI/UX principles with style.",
  },
  {
    img: "/assets/main-5.jpg",
    title: "Xav",
    tags: "Interactive Design, Fashion Tech",
    description:
      "Tech-infused fashion experiences showcased through interactive web design elements.",
  },
  {
    img: "/assets/main-6.jpg",
    title: "Maxim Stark",
    tags: "Futuristic Wearables, Web Graphics",
    description:
      "Futuristic wearables and gear presented in a sleek, graphically rich web interface.",
  },
  {
    img: "/assets/main-7.jpg",
    title: "Pitcher",
    tags: "Innovative Textiles, Web Presentation",
    description:
      "Web presentation of innovative textiles that redefine the boundaries of modern fashion.",
  },
  {
    img: "/assets/main-8.jpg",
    title: "MindSpace",
    tags: "Augmented Reality, Fashion Design",
    description:
      "Augmented reality in fashion design, creating immersive web experiences for users.",
  },
  {
    img: "/assets/main-9.jpg",
    title: "The Athletix",
    tags: "Virtual Fashion, Graphic Design",
    description:
      "Virtual fashion collections displayed through stunning graphic design and web aesthetics.",
  },
  {
    img: "/assets/main-10.jpg",
    title: "All Work",
    tags: "Minimalist Aesthetics, Fashion Forward",
    description:
      "Fashion forward web design encapsulating the essence of minimalist aesthetics and innovation.",
  },
];

export default function ExpandedMenu() {
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
        <div class="preview-img" style="position:absolute;margin:2em;width:300px;height:400px;${Object.entries(
          styles.img
        )
          .map(([k, v]) => `${k}:${v};`)
          .join("")}clip-path:${defaultClipPaths[variant]}"><img src="${
        p.img
      }" style="width:100%;height:100%;object-fit:cover;" /></div>
        <div class="preview-title" style="position:absolute;${Object.entries(
          styles.title
        )
          .map(([k, v]) => `${k}:${v};`)
          .join("")}font-size:80px;font-weight:lighter;"><h1>${
        p.title
      }</h1></div>
        <div class="preview-tags" style="position:absolute;${Object.entries(
          styles.tags
        )
          .map(([k, v]) => `${k}:${v};`)
          .join("")}font-size:14px;line-height:1.2;"><p>${p.tags}</p></div>
        <div class="preview-description" style="position:absolute;width:250px;${Object.entries(
          styles.desc
        )
          .map(([k, v]) => `${k}:${v};`)
          .join("")}font-size:14px;line-height:1.2;"><p>${
        p.description
      }</p></div>
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

    items.forEach((item, idx) => {
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
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden !w-[300px]  z-50"
    >
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
        ref={previewBgRef}
        className="preview-bg absolute inset-0 opacity-35 -z-10"
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
