import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import localFont from "next/font/local";

const BlanchCaps = localFont({
  src: "../fonts/Blanch-Caps.woff2",
  display: "swap",
});

const GoudyStd = localFont({
  src: "../fonts/GoudyStd-Heavyface.woff2",
  display: "swap",
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
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
        className={`${BlanchCaps.variable} ${GoudyStd.variable} antialiased`}
      >
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
