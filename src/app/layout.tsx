// app/layout.tsx
import "./globals.css";
import "yakuhanjp";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";
import Script from "next/script";
import Nav from "../components/PageTransition/Nav";
import Footer from "../components/Footer/Footer1";
import PageTransition from "../components/PageTransition/PageTransition";
import ExoApeOverlayMenu from "../components/ExoApeOverlayMenu";
import Image from "next/image";
export const metadata: Metadata = {
  title: "寬越設計｜商業空間與住宅設計",
  description: "寬越設計專注於舊屋翻新、住宅裝修與商業空間的室內設計整合服務。",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="zh-Hant">
        <body className="antialiased bg-white text-gray-900">
          <ExoApeOverlayMenu>
            <div className="hidden md:block fixed inset-x-0 top-0 z-[9999]">
              <Nav />
            </div>
            <PageTransition>{children}</PageTransition>
            <Footer />
          </ExoApeOverlayMenu>
          <div className="fixed right-8 bottom-[10%]">
            <a
              href="https://page.line.me/655cyzya?oat_content=url&openQrModal=true"
              target="_blank"
            >
              {" "}
              <Image
                src="/images/icon/line.png"
                alt="line-icon"
                width={200}
                height={200}
                className="max-w-[50px]"
              ></Image>
            </a>
          </div>

          {/* Tawk.to */}
          <Script
            id="tawk-embed"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                  var s1=document.createElement("script"), s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='https://embed.tawk.to/68b2c125109d7be2aa210cc6/1j3t44v66';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
