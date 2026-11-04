import Link from "next/link";
import { dateLabel, event, schedule } from "@/data/event";
import NextUp from "@/components/NextUp";

const links = [
  { href: "/schedule", title: "スケジュール", desc: "今日の流れ", icon: "◷" },
  { href: "/profile", title: "マイカード", desc: "記入してQRで共有", icon: "♡" },
  { href: "/cards", title: "名刺帳", desc: "カード・メモ・投票", icon: "❏" },
  { href: "/talk", title: "話題ガチャ", desc: "会話に詰まったら", icon: "✦" },
  { href: event.mapUrl, title: "会場マップ", desc: "地図を開く", icon: "⌖", external: true },
  { href: "/contact", title: "連絡先", desc: "運営・スタッフ", icon: "✉" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Welcome</p>
        <h1>{event.title}</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="hero-meta">{dateLabel}</p>
        <p className="hero-meta sub">
          {schedule[0].start} – {schedule[schedule.length - 1].end} ／ {event.venue}
        </p>
        <p className="hero-meta sub">ドレスコード：{event.dress}</p>
      </section>

      <NextUp />

      <section className="grid">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="tile" {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <span className="tile-icon" aria-hidden>{l.icon}</span>
            <h2>{l.title}</h2>
            <p>{l.desc}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
