/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 你的圖片設定 (保持原樣)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 允許任何來源
      },
    ],
    unoptimized: true, // 不啟用 Next 圖片優化
  },

  // 2. 新增的轉址設定
  async redirects() {
    return [
      // 1. 關於我們 -> /about
      {
        source: '/%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91',
        destination: '/about',
        permanent: true,
      },
      // 2. 設計服務 -> /service
      {
        source: '/%E8%A8%AD%E8%A8%88%E6%9C%8D%E5%8B%99',
        destination: '/service',
        permanent: true,
      },
      // 3. 景觀設計 -> /works
      {
        source: '/%E6%99%AF%E8%A7%80%E8%A8%AD%E8%A8%88',
        destination: '/works',
        permanent: true,
      },
      // 4. 室內設計作品 -> /works/住宅空間
      {
        source: '/%E5%AE%A4%E5%85%A7%E8%A8%AD%E8%A8%88%E4%BD%9C%E5%93%81',
        destination: '/works/%E4%BD%8F%E5%AE%85%E7%A9%BA%E9%96%93', 
        permanent: true,
      },
      // 5. 景觀設計作品 -> /works/商業空間
      {
        source: '/%E6%99%AF%E8%A7%80%E8%A8%AD%E8%A8%88%E4%BD%9C%E5%93%81',
        destination: '/works/%E5%95%86%E6%A5%AD%E7%A9%BA%E9%96%93',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;