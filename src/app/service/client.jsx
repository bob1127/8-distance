/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { createPortal } from "react-dom";
import { ReactLenis } from "@studio-freight/react-lenis";
import Image from "next/image";
import Link from "next/link";

/** ====== 這裡填入你的每一張卡片內容（可自由改） ====== */
const PROCESS_STEPS = [
  {
    key: "consult",
    step: "STEP-01",
    heading: "初次溝通（面談與線上）",
    desc: "了解需求、風格與預算，釐清時程與合作模式，建立設計共識。",
    color: "text-[#f64568]",
    items: [
      "業主需求喜好表",
      "整體作業流程說明表",
      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="22.5 20 155 160"
        viewBox="22.5 20 155 160"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
      >
        <g>
          <path
            d="M100 20c-42.802 0-77.5 34.7-77.5 77.505h155C177.5 54.7 142.802 20 100 20z"
            fill="#9D6200"
          />
          <path
            d="M100 102.496c-42.802 0-77.5 34.7-77.5 77.504h155c0-42.804-34.698-77.504-77.5-77.504z"
            fill="#9D6200"
          />
        </g>
      </svg>
    ),
  },
  {
    key: "survey",
    step: "STEP-02",
    heading: "現場勘查與紀錄 ",
    desc: "由專案設計師至現場之周圍環境進行了解，並現場丈量、拍照存檔,作為日後設計規劃與預算評估的重要依據。若為舊屋翻新，建議待原有裝潢拆除後再行丈量,以確保後續報價更為精準。 ",
    color: "text-[#f64568]",
    items: [
      "基地測繪",
      "基地丈量",
      "基地照片",
      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="20 20 160 160"
        viewBox="20 20 160 160"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8ix2 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="M20 20v160c44.183 0 80-35.817 80-80S64.183 20 20 20z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M100 100c0 44.183 35.817 80 80 80V20c-44.183 0-80 35.817-80 80z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "plan",
    step: "STEP-03",
    heading: "設計服務",
    desc: "依據居住者的使用機能與空間條件，設計師繪製初步平面構想，搭配風格建議與設計方向，勾勒出空間輪廓。 ",
    color: "text-[#f64568]",
    items: [
      "風格圖",
      "初步平面規劃圖",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="38.5 20 123 160"
        viewBox="38.5 20 123 160"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8ja6 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="M102.887 20v117.469c32.371 0 58.613-26.296 58.613-58.734C161.5 46.296 135.258 20 102.887 20z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M38.5 121.266C38.5 153.704 64.742 180 97.113 180V62.532c-32.371 0-58.613 26.296-58.613 58.734z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "contract",
    step: "STEP-04",
    heading: "合約服務",
    desc: "確認初步設計方向後，設計師將提供完整設計時程規劃，並與業主簽訂設計合約，以明確設計範圍、費用與後續流程。合約内容不涵蓋軟裝設計、工程施作與工程管理項目。 ",
    color: "text-[#f64568]",
    items: [
      "設計時程規劃表",
      "設計合約內容",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="10 10 180 180.05"
        viewBox="10 10 180 180.05"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jh3 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="M189.3 145.6c-.5-2.6-1.3-5.2-2.4-7.6-1.8-4.2-4.4-8.2-7.9-11.6-24.6-24.6-6.4-46.3-1.3-51.5.4-.4.8-.8 1.3-1.2 14.6-14.6 14.6-38.2 0-52.7-14.6-14.6-38.2-14.6-52.7 0-14.6 14.6-14.6 38.2 0 52.7 24.1 24.1 9.1 43.8 2.6 50.4-.2.2-.4.3-.5.5-.2.2-.5.4-.7.6-.4.4-.9.8-1.3 1.2-24.6 24.6-46.3 6.4-51.5 1.3-.4-.4-.8-.8-1.2-1.3-14.6-14.6-38.2-14.6-52.7 0-14.6 14.6-14.6 38.2 0 52.7 14.6 14.6 38.2 14.6 52.7 0 24.1-24.1 43.8-9.1 50.4-2.6.2.2.3.4.5.5.2.2.4.5.6.7.4.4.8.9 1.2 1.3 2.7 2.7 5.8 4.9 9 6.7 1.2.6 2.5 1.2 3.7 1.7 1.2.5 2.5.9 3.7 1.2 1.4.4 2.8.7 4.2.9.2 0 .4.1.6.1 1.7.2 3.4.4 5.1.4 3.6 0 7.2-.5 10.6-1.5.6-.2 1.1-.4 1.7-.6 2.3-.8 4.5-1.8 6.6-3.1 2.6-1.6 5.1-3.5 7.4-5.8.9-.9 1.8-1.9 2.6-2.8s1.5-2 2.2-3 1.3-2.1 1.9-3.2c2-3.8 3.3-7.8 3.9-12 .1-.6.2-1.2.2-1.8.1-1.2.2-2.4.2-3.6 0-1.2-.1-2.4-.2-3.6-.1-1-.3-2.2-.5-3.4z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            fill="#9D6200"
            d="M84.4 47.2c0 20.545-16.655 37.2-37.2 37.2S10 67.745 10 47.2 26.655 10 47.2 10s37.2 16.655 37.2 37.2z"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },

  {
    key: "contract",
    step: "STEP-05",
    heading: "細部設計與圖面繪製",
    desc: "在初步構想定案後，進入細部設計階段，繪製各項完整圖面，包括平面圖(地坪/水電/天花板/燈具配置等)、立面圖、3D圖、材質選配圖，經過多次討論調整做必要之修正與圖面的完成。 ",
    color: "text-[#f64568]",
    items: [
      "平面圖",
      "立面圖",
      "3D圖",
      "材質選配圖",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="19.999 33.5 160 133"
        viewBox="19.999 33.5 160 133"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jl3 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="M90.853 116.612c3.645 6.167 3.663 13.75.046 19.87L73.158 166.5l-19.061-32.252 15.036-25.442H39.06L19.999 76.555h35.476c7.234 0 13.947 3.806 17.593 9.974l5.09 8.613.009.005 12.686 21.465z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M109.149 116.557c-3.645 6.167-3.663 13.75-.046 19.87l17.741 30.017 19.061-32.252-15.037-25.443h30.07l19.061-32.252h-35.476c-7.233 0-13.947 3.806-17.592 9.974l-5.093 8.617-.004.002-12.685 21.467z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M118.183 73.411a20.011 20.011 0 0 0 17.23-9.818L153.198 33.5h-38.123l-15.039 25.447L84.997 33.5H46.874l17.785 30.092a20.009 20.009 0 0 0 17.23 9.818h10.556l25.738.001z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },

  {
    key: "contract",
    step: "STEP-06",
    heading: "材質與色彩確認 ",
    desc: "根據空間條件、預算配置與風格偏好，設計師將陪同進行材料與色彩後本挑選，並提供專業建議，協助屋主在美感與實用性之間取得平衡，完成設計細節的定稿。 ",
    color: "text-[#f64568]",
    items: [
      "工程規劃表",
      "工程合約內容",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="40 10 120 180"
        viewBox="40 10 120 180"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jv2 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="M130 70c-28.1 0-30-22.7-30-28.6V40c0-16.6-13.4-30-30-30S40 23.4 40 40s13.4 30 30 30c27.5 0 30.1 19.8 30.1 27.2-.1.9-.1 1.8-.1 2.8 0 16.6 13.4 30 30 30s30-13.4 30-30-13.4-30-30-30z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            fill="#9D6200"
            d="M100 160c0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30z"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "contract",
    step: "STEP-07",
    heading: "工程報價與合約簽屬",
    desc: "提供工程預算書，明確列出各項費用細目，便於調整增減項目,並編製完整的施工估價與進度規劃表。經簽署工程合約後,即正式啟動裝修作業。 ",
    color: "text-[#f64568]",
    items: [
      "施工圖",
      "細部節點圖",
      "工程進度紀錄表",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="10 10 180 180"
        viewBox="10 10 180 180"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jy5 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            fill="#9D6200"
            d="M130 40c0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30z"
            data-color="1"
          ></path>
          <path
            fill="#9D6200"
            d="M130 160c0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30z"
            data-color="1"
          ></path>
          <path
            d="M160 70c-7.7 0-14.8 2.9-20.1 7.7-42.2 30.2-79.9 0-79.9 0-5.2-4.8-12.3-7.7-20-7.7-16.6 0-30 13.4-30 30s13.4 30 30 30c7.4 0 14.1-2.7 19.3-7 41.3-26.5 80.6-.7 80.6-.7 5.3 4.8 12.4 7.7 20.1 7.7 16.6 0 30-13.4 30-30s-13.4-30-30-30z"
            fill="#9D6200"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "contract",
    step: "STEP-08",
    heading: "工程監督與進度追蹤 ",
    desc: "施工期間由專責監工人員依工程時程逐項查驗，分階段驗收，並定期提供現場照片與施工進度報告，協助屋主即時掌握施工品質與各項細節。 ",
    color: "text-[#f64568]",
    items: [
      "現場驗收",
      "作品拍攝",
      "結案報告",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="22.538 13.592 154.924 172.817"
        viewBox="22.538 13.592 154.924 172.817"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8k11 svg [data-color="1"] </style>
        </defs>
        <g>
          <path
            d="m27.458 76.311 42.188 24.647a3.268 3.268 0 0 1 1.62 2.824v48.96c0 2.536-2.762 4.107-4.942 2.81l-42.188-25.101a3.27 3.27 0 0 1-1.598-2.81V79.135c0-2.525 2.74-4.097 4.92-2.824z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="m80.734 106.703 42.188 24.647a3.268 3.268 0 0 1 1.62 2.824v48.96c0 2.536-2.762 4.107-4.942 2.81l-42.188-25.101a3.27 3.27 0 0 1-1.598-2.81v-48.506c0-2.526 2.74-4.098 4.92-2.824z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="m133.676 185.943 42.188-25.101a3.27 3.27 0 0 0 1.598-2.81v-48.506c0-2.525-2.74-4.097-4.92-2.824l-42.188 24.647a3.268 3.268 0 0 0-1.62 2.824v48.96c0 2.537 2.762 4.107 4.942 2.81z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="m83.215 35.731 41.736-21.769a3.273 3.273 0 0 1 3.025 0l41.736 21.769c2.293 1.196 2.356 4.454.111 5.738l-41.736 23.87a3.272 3.272 0 0 1-3.247 0l-41.736-23.87c-2.245-1.284-2.182-4.542.111-5.738z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="m80.734 44.691 42.188 24.647a3.268 3.268 0 0 1 1.62 2.824v48.96c0 2.536-2.762 4.107-4.942 2.81L77.412 98.831a3.27 3.27 0 0 1-1.598-2.81V47.514c0-2.524 2.74-4.097 4.92-2.823z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="m133.676 123.932 42.188-25.101a3.27 3.27 0 0 0 1.598-2.81V47.514c0-2.525-2.74-4.097-4.92-2.824l-42.188 24.647a3.268 3.268 0 0 0-1.62 2.824v48.96c0 2.537 2.762 4.108 4.942 2.811z"
            fill="#9D6200"
            data-color="1"
          ></path>
          <path
            d="M67.735 47.638 29.94 67.351c-2.293 1.196-2.356 4.454-.111 5.738l37.823 21.633c1.649.943 3.701-.247 3.701-2.147V49.831c0-1.858-1.971-3.052-3.618-2.193z"
            fill="#9D6200"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "contract",
    step: "STEP-09",
    heading: "完工驗收與交屋服務 ",
    desc: "工程完工後，設計師將與屋主一同進行現場驗收，確認施工品質與細節並確保成果符合設計規劃。完成交屋後，提供結案報告與作品拍攝，留下完整紀錄，也讓屋主安心入住，正式開啟全新生活。 ",
    color: "text-[#f64568]",
    items: [
      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="19.999 33.5 160 133"
        viewBox="19.999 33.5 160 133"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jl3 svg [data-color="1"]</style>
        </defs>
        <g>
          <path
            d="M90.853 116.612c3.645 6.167 3.663 13.75.046 19.87L73.158 166.5l-19.061-32.252 15.036-25.442H39.06L19.999 76.555h35.476c7.234 0 13.947 3.806 17.593 9.974l5.09 8.613.009.005 12.686 21.465z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M109.149 116.557c-3.645 6.167-3.663 13.75-.046 19.87l17.741 30.017 19.061-32.252-15.037-25.443h30.07l19.061-32.252h-35.476c-7.233 0-13.947 3.806-17.592 9.974l-5.093 8.617-.004.002-12.685 21.467z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M118.183 73.411a20.011 20.011 0 0 0 17.23-9.818L153.198 33.5h-38.123l-15.039 25.447L84.997 33.5H46.874l17.785 30.092a20.009 20.009 0 0 0 17.23 9.818h10.556l25.738.001z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    key: "contract",
    step: "STEP-10",
    heading: "售後服務 ",
    desc: "提供一年保固,含設備檢修與免費諮詢，讓屋主入住後持續獲得安心與保障。 ",
    color: "text-[#f64568]",
    items: [
      "一年保固",
      "設備檢修",
      "免費諮詢",

      // 想再加就繼續放字串
      // 也可放成 { label, href } 物件（見下方渲染器）
    ],
    icon: (
      <svg
        preserveAspectRatio="xMidYMid meet"
        data-bbox="19.999 33.5 160 133"
        viewBox="19.999 33.5 160 133"
        height="80"
        width="80"
        xmlns="http://www.w3.org/2000/svg"
        data-type="color"
        role="presentation"
        aria-hidden="true"
        aria-label=""
      >
        <defs>
          <style>#comp-lqc5w8jl3 svg [data-color="1"]</style>
        </defs>
        <g>
          <path
            d="M90.853 116.612c3.645 6.167 3.663 13.75.046 19.87L73.158 166.5l-19.061-32.252 15.036-25.442H39.06L19.999 76.555h35.476c7.234 0 13.947 3.806 17.593 9.974l5.09 8.613.009.005 12.686 21.465z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M109.149 116.557c-3.645 6.167-3.663 13.75-.046 19.87l17.741 30.017 19.061-32.252-15.037-25.443h30.07l19.061-32.252h-35.476c-7.233 0-13.947 3.806-17.592 9.974l-5.093 8.617-.004.002-12.685 21.467z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
          <path
            d="M118.183 73.411a20.011 20.011 0 0 0 17.23-9.818L153.198 33.5h-38.123l-15.039 25.447L84.997 33.5H46.874l17.785 30.092a20.009 20.009 0 0 0 17.23 9.818h10.556l25.738.001z"
            fill="#9D6200"
            clip-rule="evenodd"
            fill-rule="evenodd"
            data-color="1"
          ></path>
        </g>
      </svg>
    ),
  },
];

const CHARGE_ITEMS = [
  {
    key: "measure",
    step: "全台案場皆酌收丈量與初步提案費用，每案統一為新台幣6,000元 ",
    heading: "現場丈量 ",
    desc: "依坪數與複雜度估算，含平／立／剖面與 3D 示意圖、材質與色彩配置。",
    color: "text-rose-500",
    iconSrc: "/images/收費標準ICON/丈量提案費400x400_0.jpg",
  },
  {
    key: "designfee",
    step: "設計費每坪新台幣6,500元起(未稅),以實際設計範圍計算。若部分空間如儲藏室、陽台等無需設計，將自坪数中扣除,不納入計费。 ",
    heading: "設計費 ",
    desc: "工地巡檢、工序銜接與品質控管，提供周報與關鍵節點照片存證。",
    color: "text-indigo-500",
    iconSrc: "/images/收費標準ICON/設計費400x400_0.jpg",
  },
  {
    key: "variation",
    step: "無收額外客變費，客變作業將於簽訂設計合約後展開，並需預缴總設計費用的60% ",
    heading: "客變費 ",
    desc: "依圖說與實際工項明細估算，透明列出材料、工資與備品清單。",
    color: "text-emerald-500",
    iconSrc: "/images/收費標準ICON/客變費400x400_0.jpg",
  },
  {
    key: "construction",
    step: "依實際需求與選用材質而異，將依設計内容進行個别估算。為確保施工品質與建材規格,工程最低承接金額為新台幣 100 萬元起。 ",
    heading: "工程費 ",
    desc: "依進度分期支付，支持匯款／刷卡與第三方金流，提供正式發票。",
    color: "text-orange-500",
    iconSrc: "/images/收費標準ICON/工程費400x400_0.jpg",
  },
  {
    key: "supervision_fee",
    step: "以工程費總價8%計算。實際金額會依據地區收費而有所不同，中部以外縣市監工費 10-12%  ",
    heading: "監工費  ",
    desc: "依進度分期支付，支持匯款／刷卡與第三方金流，提供正式發票。",
    color: "text-orange-500",
    iconSrc: "/images/收費標準ICON/監工費400x400_0.jpg",
  },
];

/** 只讓膠囊本身可點，其餘整層都讓事件穿透 */
function FixedSwitchPortal({ showSwitch, activeTab, onSwitch }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {showSwitch && (
        <motion.div
          key="switch"
          className="fixed z-[9999999] left-0 bottom-[6%] w-full pointer-events-none"
          style={{ pointerEvents: "none" }}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <div
            className="relative w-full pointer-events-none"
            style={{ pointerEvents: "none" }}
          >
            <div className="switch-bar max-w-[260px] bg-[#f5f5f7] justify-center mx-auto px-2 py-2 flex rounded-[30px] shadow-sm border border-black/5 pointer-events-auto">
              <div className="relative grid w-full grid-cols-2 gap-1">
                {[
                  { key: "service", label: "服務項目" },
                  { key: "charge", label: "收費標準" },
                ].map((t) => {
                  const isActive = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => onSwitch(t.key)}
                      className="relative z-10 inline-flex items-center justify-center h-10 rounded-[22px] font-medium"
                    >
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="seg-pill"
                            className="absolute inset-0 rounded-[22px] bg-orange-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <motion.span
                        className={`relative z-10 px-4 text-[15px] ${
                          isActive ? "text-orange-500" : "text-gray-800"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        {t.label}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function ServiceClient() {
  const serviceRef = useRef(null);
  const chargeRef = useRef(null);

  const [activeTab, setActiveTab] = useState("service");
  const [showSwitch, setShowSwitch] = useState(true);

  // 滾動方向：下隱上現
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 10;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const curr = window.scrollY;
        const delta = curr - lastY;
        if (Math.abs(delta) > THRESHOLD) {
          setShowSwitch(delta <= 0);
          lastY = curr;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 平滑滾動
  const scrollToRef = (ref) => {
    if (!ref?.current) return;
    setShowSwitch(true);
    const targetY =
      ref.current.getBoundingClientRect().top + window.scrollY - 80;
    animate(window.scrollY, targetY, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
  };

  const handleSwitch = (tab) => {
    setActiveTab(tab);
    scrollToRef(tab === "service" ? serviceRef : chargeRef);
  };

  return (
    <ReactLenis root>
      <FixedSwitchPortal
        showSwitch={showSwitch}
        activeTab={activeTab}
        onSwitch={handleSwitch}
      />

      <div className="relative">
        {/* Hero */}
        <div className="xl:aspect-[16/7.5] aspect-[16/14] sm:aspect-[16/10] relative overflow-hidden">
          {/* <div className="txt absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-white text-2xl">設計內容</h2>
              <Link href="/3d">
                <div className="border border-white rounded-[20px] w-[200px] py-2 text-center text-white">
                  INFO
                </div>
              </Link>
            </div>
          </div> */}
          <Image
            src="/images/7cf01af6-3902-4896-8049-90ebdb7df94c.png"
            alt="hero"
            fill
            className="w-full object-cover"
          />
        </div>

        {/* 服務項目（流程區） */}
        {/* 服務項目（流程區） */}
        <section ref={serviceRef} className="section-process my-20">
          <div className="title flex justify-center items-center flex-col w-[90%] max-w-[1200px] mx-auto">
            <span className="text-[14px] text-gray-600">PROCESS</span>
            <h2 className="font-normal">設計流程</h2>
          </div>

          <div className="grid w-[90%] max-w-[1200px] mx-auto grid-cols-2">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.key}
                className="item justify-center items-center flex my-5"
              >
                <div className="w-[100px] mx-3 h-[100px] flex items-center justify-center rounded-[22px]">
                  <div className={item.color}>{item.icon}</div>
                </div>

                <div className="txt w-2/3 p-5">
                  <b className="text-[18px]">{item.step}</b>
                  <p className="font-medium">{item.heading}</p>

                  {/* ✅ desc 用這裡 */}
                  <p className="text-[14px] tracking-wider text-gray-600 mt-2">
                    {item.desc}
                  </p>

                  {Array.isArray(item.items) && item.items.length > 0 && (
                    <ul
                      className="
      mt-3 w-full text-[14px] text-gray-700
      flex flex-wrap gap-x-4 gap-y-1
      list-disc list-inside
    "
                    >
                      {item.items.map((li, idx) => (
                        <li key={idx} className="shrink-0 whitespace-nowrap">
                          {typeof li === "string" ? (
                            li
                          ) : li?.href ? (
                            <Link
                              href={li.href}
                              className="underline underline-offset-2 hover:opacity-80"
                            >
                              {li.label ?? li.href}
                            </Link>
                          ) : (
                            li?.label ?? ""
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 收費標準 */}
        <section ref={chargeRef} className="section-charge my-20">
          <div className="title flex justify-center items-center flex-col max-w-[1200px] mx-auto">
            <span className="text-[14px] text-gray-600">CHARGE</span>
            <h2 className="font-normal">收費標準</h2>
          </div>

          <div className="grid max-w-[1200px] mx-auto grid-cols-2">
            {CHARGE_ITEMS.map((item) => (
              <div
                key={item.key}
                className="item justify-center items-start flex my-5"
              >
                <div className="w-[100px] flex items-center mx-3 h-[130px] justify-center ">
                  <Image
                    src={item.iconSrc}
                    alt={item.heading}
                    width={80}
                    height={80}
                    className="w-[90px] h-[90px] rounded-[30px] object-contain"
                    priority={false}
                  />
                </div>
                <div className="txt w-2/3 p-5">
                  <b className="text-[18px]">{item.heading}</b>
                  <p className="font-medium">{item.step}</p>
                  <span className="text-[14px] tracking-wider text-gray-600 mt-2 block">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
