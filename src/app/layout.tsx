import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import localFont from "next/font/local";

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

// const jost = localFont({
//   src: "../fonts/Jost.woff2", // Make sure this matches your actual file name
//   variable: "--font-jost",
//   display: "swap",
// });

// const damion = localFont({
//   src: "../fonts/Damion.woff2", // Make sure this matches your actual file name
//   variable: "--font-damion",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Clark's Bowling Club",
  description: "Clark's Bowling Club",
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
