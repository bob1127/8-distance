"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

const galleryItems = [
  {
    title: "Beyond The Summit",
    copy: "Join a team of elite mountaineers as they attempt to conquer K2...",
    director: "Alex Honnold",
    cinematographer: "Jimmy Chin",
  },
  {
    title: "Olympian's Journey",
    copy: "A heartfelt documentary following a young athlete's 4-year journey.",
    director: "Sarah Chen",
    cinematographer: "Marcus Doherty",
  },
];

export default function GalleryTransition() {
  const blurryPrevRef = useRef(null);
  const previewRef = useRef(null);
  const galleryRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const createSplitText = (element) => {
      const split = new SplitType(element, { types: "lines" });
      element.innerHTML = "";
      split.lines.forEach((line) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = "line";
        const span = document.createElement("span");
        span.textContent = line.textContent;
        lineDiv.appendChild(span);
        element.appendChild(lineDiv);
      });
    };

    const galleryEl = galleryRef.current;
    galleryEl.innerHTML = "";
    galleryItems.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = `item ${i === 0 ? "active" : ""}`;
      const img = document.createElement("img");
      img.src = `/assets/img${i + 1}.jpg`;
      img.alt = item.title;
      div.appendChild(img);
      div.addEventListener("click", () => handleClick(i));
      galleryEl.appendChild(div);
    });

    const initialP = previewRef.current.querySelector(".info p");
    if (initialP) createSplitText(initialP);

    const handleClick = (index) => {
      if (index === activeIndex || isAnimating) return;
      setIsAnimating(true);

      const newBlurImg = document.createElement("img");
      newBlurImg.src = `/assets/img${index + 1}.jpg`;
      newBlurImg.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        opacity: 0;
        z-index: 0;
      `;
      blurryPrevRef.current.insertBefore(
        newBlurImg,
        blurryPrevRef.current.firstChild
      );

      const currentBlur =
        blurryPrevRef.current.querySelector("img:nth-child(2)");
      if (currentBlur) {
        gsap.to(currentBlur, {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          onComplete: () => {
            if (blurryPrevRef.current.contains(currentBlur)) {
              blurryPrevRef.current.removeChild(currentBlur);
            }
          },
        });
      }

      gsap.to(newBlurImg, { opacity: 1, duration: 1, delay: 0.5 });

      const oldImg = previewRef.current.querySelector(".project-img");
      const oldDetails = previewRef.current.querySelector(".project-details");

      const exitEls = previewRef.current.querySelectorAll(
        ".title h1, .info p .line span, .credits p, .director p, .cinematographer p"
      );
      gsap.to(exitEls, {
        y: -60,
        duration: 1,
        ease: "power4.in",
        stagger: 0.05,
      });

      gsap.to(oldImg, {
        scale: 0,
        duration: 1,
        onComplete: () => {
          oldDetails?.remove();
          oldImg?.remove();
          renderNew(index);
          setActiveIndex(index);
        },
      });
    };

    const renderNew = (index) => {
      const item = galleryItems[index];

      const detail = document.createElement("div");
      detail.className = "project-details";

      const fields = [
        { tag: "h1", className: "title", text: item.title },
        { tag: "p", className: "info", text: item.copy },
        { tag: "p", className: "credits", text: "Credits" },
        { tag: "p", className: "director", text: `Director: ${item.director}` },
        {
          tag: "p",
          className: "cinematographer",
          text: `Cinematographer: ${item.cinematographer}`,
        },
      ];

      fields.forEach(({ tag, className, text }) => {
        const div = document.createElement("div");
        div.className = className;
        const el = document.createElement(tag);
        el.textContent = text;
        div.appendChild(el);
        detail.appendChild(div);
      });

      const imgWrap = document.createElement("div");
      imgWrap.className = "project-img";
      const img = document.createElement("img");
      img.src = `/assets/img${index + 1}.jpg`;
      img.alt = item.title;
      imgWrap.appendChild(img);

      previewRef.current.appendChild(detail);
      previewRef.current.appendChild(imgWrap);

      const p = detail.querySelector(".info p");
      if (p) createSplitText(p);

      const enterEls = detail.querySelectorAll(
        ".title h1, .info p .line span, .credits p, .director p, .cinematographer p"
      );
      gsap.fromTo(
        enterEls,
        { y: 40 },
        {
          y: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.05,
          onComplete: () => setIsAnimating(false),
        }
      );
    };
  }, []);

  return (
    <div className="container">
      <div ref={blurryPrevRef} className="blurry-prev">
        <img src="/assets/img1.jpg" alt="cover" />
        <div className="overlay" />
      </div>

      <div className="col site-info">
        <nav>
          <a href="#">Home</a>
          <a href="#">Work</a>
          <a href="#">Contact</a>
        </nav>
        <div className="header">
          <h1>Welcome to Codegrid</h1>
        </div>
        <div className="copy">
          <p>
            We are a full-service creative agency delivering innovative design
            solutions for businesses around the globe.
          </p>
        </div>
      </div>

      <div ref={previewRef} className="col project-preview">
        <div className="project-details">
          <div className="title">
            <h1>{galleryItems[0].title}</h1>
          </div>
          <div className="info">
            <p>{galleryItems[0].copy}</p>
          </div>
          <div className="credits">
            <p>Credits</p>
          </div>
          <div className="director">
            <p>Director: {galleryItems[0].director}</p>
          </div>
          <div className="cinematographer">
            <p>Cinematographer: {galleryItems[0].cinematographer}</p>
          </div>
        </div>
        <div className="project-img">
          <img src="/assets/img1.jpg" alt="preview" />
        </div>
      </div>

      <div className="gallery-wrapper">
        <div ref={galleryRef} className="gallery"></div>
      </div>
    </div>
  );
}
