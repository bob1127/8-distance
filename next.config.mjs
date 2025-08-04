/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ✅ 完全不限制圖片來源，也不會進行圖片優化
  },
};

export default nextConfig;
