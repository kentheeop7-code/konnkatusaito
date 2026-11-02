import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const serif = Shippori_Mincho({ weight: ["400", "600", "700"], variable: "--font-serif", preload: false, display: "swap" });
const display = Cormorant_Garamond({ weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Noto_Sans_JP({ weight: ["400", "500", "700"], variable: "--font-sans", preload: false, display: "swap" });

export const metadata: Metadata = {
  title: "Soirée｜婚活・合コン プロフィール＆スケジュール",
  description: "本日のスケジュール、自己紹介カードの作成と共有、運営への連絡先をひとつに。",
};

export const viewport: Viewport = { themeColor: "#faf6f0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="foot">Soirée — with love &amp; good conversation</footer>
      </body>
    </html>
  );
}
