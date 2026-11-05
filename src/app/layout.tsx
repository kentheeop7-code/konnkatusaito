import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import Nav from "@/components/Nav";
import Welcome from "@/components/Welcome";
import "./globals.css";

const serif = Shippori_Mincho({ weight: ["400", "600", "700"], variable: "--font-serif", preload: false, display: "swap" });
const display = Cormorant_Garamond({ weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Noto_Sans_JP({ weight: ["400", "500", "700"], variable: "--font-sans", preload: false, display: "swap" });

export const metadata: Metadata = {
  title: "片町ナイト｜カジュアル合コン 自己紹介＆スケジュール",
  description: "素敵な出会いを見つけよう。今夜のスケジュール、自己紹介カードの交換、連絡先をひとつに。",
};

export const viewport: Viewport = { themeColor: "#fdfaf5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <body>
        <Welcome />
        <Nav />
        <main>{children}</main>
        <footer className="foot">Katamachi Night — 素敵な出会いを見つけよう</footer>
      </body>
    </html>
  );
}
