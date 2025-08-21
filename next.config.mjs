/** @type {import('next').NextConfig} */
const nextConfig = {
   theme: {
    extend: {
      fontFamily: {
        ethnocentric: ["Ethnocentric", "sans-serif"],
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 允許任何來源
      },
    ],
    unoptimized: true, // 不啟用 Next 圖片優化
  },
};

export default nextConfig;
