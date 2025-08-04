"use client";

import { useEffect, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";

const Nav = () => {
  const router = useTransitionRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="logo font-bold text-xl">
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/", {
                onTransitionReady: slideInOut,
              });
            }}
            href="/"
          >
            Index
          </a>
        </div>
        <div className="links flex space-x-6">
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/projects", {
                onTransitionReady: slideInOut,
              });
            }}
            href="/projects"
            className="hover:underline"
          >
            Projects
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/about", {
                onTransitionReady: slideInOut,
              });
            }}
            href="/about"
            className="hover:underline"
          >
            Info
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
