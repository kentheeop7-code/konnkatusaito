import Link from "next/link";
import { event, schedule } from "@/data/event";
import NextUp from "@/components/NextUp";

const links = [
  { href: "/schedule", title: "本日のスケジュール", desc: "タイムテーブルと進行状況", icon: "◷" },
  { href: "/profile", title: "自己紹介カード", desc: "記入して、QRで共有", icon: "♡" },
  { href: "/cards", title: "名刺帳", desc: "受け取ったカードにメモ", icon: "❏" },
  { href: "/contact", title: "連絡先", desc: "運営・スタッフへのご連絡", icon: "✉" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Welcome</p>
        <h1>{event.title}</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="hero-meta">{event.dateLabel}</p>
        <p className="hero-meta sub">
          {schedule[0].start} – {schedule[schedule.length - 1].end} ／ {event.venue}
        </p>
        <p className="hero-meta sub">ドレスコード：{event.dress}</p>
      </section>

      <NextUp />

      <section className="grid">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="tile">
            <span className="tile-icon" aria-hidden>{l.icon}</span>
            <h2>{l.title}</h2>
            <p>{l.desc}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
