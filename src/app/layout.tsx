import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import localFont from "next/font/local";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const blanchCaps = localFont({
  src: "../fonts/Blanch-Caps.woff2",
  variable: "--font-blanch",
  display: "swap",
});

const goudyStd = localFont({
  src: "../fonts/GoudyStd-Heavyface.woff2",
  variable: "--font-goudy",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Clark's Bowling Club",
    template: "%s | Clark's Bowling Club",
  },
  description:
    "Clark’s Bowling Club is a 6-piece funk/pop band based in Lyon, France. Inspired by the likes of Jungle and Deluxe, their music brings a modern twist to disco-funk, hip-hop, and jazz genres, breathing new life into the vibrant music scene.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${blanchCaps.variable} 
          ${goudyStd.variable} 
     
          antialiased
        `}
      >
        <LanguageProvider>
          <Header />
          <main className="container mx-auto pt-28 mb-5xl max-w-5xl p-8 min-h-[calc(100vh-6rem)]">
            <Toaster position="bottom-center" />
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
