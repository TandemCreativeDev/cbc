import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import localFont from "next/font/local";
import Footer from "@/components/Footer";

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
  title: "Clark's Bowling Club",
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
          <main className="container mx-auto pt-28 mb-5xl max-w-5xl p-8 min-h-[calc(100vh-4.5rem)]">
            {children}
          </main>
        </LanguageProvider>
        <Footer />
      </body>
    </html>
  );
}
