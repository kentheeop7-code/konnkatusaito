import Link from "next/link";
import { dateLabel, event, info } from "@/data/event";
import NextUp from "@/components/NextUp";
import WelcomeLink from "@/components/WelcomeLink";

const links = [
  { href: "/schedule", title: "スケジュール", desc: "今夜の流れ", icon: "◷" },
  { href: "/profile", title: "マイカード", desc: "会話のネタを仕込もう", icon: "♡" },
  { href: "/exchange", title: "カード交換", desc: "QRを見せる・読み取る", icon: "⇄" },
  { href: "/cards", title: "名刺帳", desc: "スタンプ・相性順・メモ", icon: "❏" },
  { href: "/talk", title: "話題ガチャ", desc: "会話に詰まったら", icon: "✦" },
  { href: "/contact", title: "連絡先", desc: "幹事・運営へ", icon: "✉" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{event.brand}</p>
        <h1>{event.title}</h1>
        <p className="ribbon">{event.tagline}</p>
        <p className="hero-meta">{dateLabel}</p>
        <p className="hero-meta sub">
          {event.time}（{event.gather}） ／ {event.venue}
        </p>
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

      <section className="panel overview">
        <h2>開催概要</h2>
        <dl className="info">
          {info.map((i) => (
            <div key={i.label}>
              <dt>
                <span className="info-icon" aria-hidden>{i.icon}</span>
                {i.label}
              </dt>
              <dd>
                {i.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
                {i.note && <small>{i.note}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="center">
        <WelcomeLink />
      </p>
    </>
  );
}
