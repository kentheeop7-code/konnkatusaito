"use client";
import { useEffect, useState } from "react";
import { dateLabel, event } from "@/data/event";

const KEY = "soiree:welcomed";

const steps = [
  { icon: "♡", title: "マイカードを作る", text: "ニックネームや趣味を入力して、自己紹介カードを用意しましょう。" },
  { icon: "❏", title: "QRでカード交換", text: "気になる方とQRコードを読み取り合うだけ。名刺帳にメモも残せます。" },
  { icon: "✦", title: "話題ガチャで盛り上がる", text: "会話に詰まったら、ひと引き。きっかけがきっと見つかります。" },
];

export default function Welcome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
    const reopen = () => setOpen(true);
    window.addEventListener("soiree:welcome", reopen);
    return () => window.removeEventListener("soiree:welcome", reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="welcome-back" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome">
        <div className="welcome-stars" aria-hidden>✦ ✧ ✦</div>
        <p className="eyebrow">Welcome</p>
        <h2 id="welcome-title">ようこそ、{event.title.split(" ")[0]}へ</h2>
        <p className="welcome-lead">
          今夜は、素敵な出会いの夜に。
          <br />
          肩の力を抜いて、お話しを楽しんでくださいね 🥂
        </p>
        <p className="welcome-date">
          {dateLabel} {event.time}
        </p>
        <ol className="welcome-steps">
          {steps.map((s) => (
            <li key={s.title}>
              <span aria-hidden>{s.icon}</span>
              <div>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <button className="btn big-btn" onClick={close} autoFocus>
          はじめる
        </button>
      </div>
    </div>
  );
}
