"use client";
import { useState } from "react";
import { CATEGORIES, Topic, topics } from "@/data/topics";

export default function TalkPage() {
  const [cat, setCat] = useState<string>("all");
  const [current, setCurrent] = useState<Topic | null>(null);
  const [spin, setSpin] = useState(0);

  const draw = () => {
    const pool = topics.filter((t) => cat === "all" || t.cat === cat);
    let next = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) while (next.text === current?.text) next = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(next);
    setSpin((n) => n + 1);
    try {
      navigator.vibrate?.(30);
    } catch {}
  };

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Conversation Cards</p>
        <h1>話題ガチャ</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">会話に詰まったら、ひと引き。画面を相手に見せてもOKです。</p>
      </header>

      <div className="chips center-chips" role="group" aria-label="カテゴリ">
        {["all", ...CATEGORIES].map((c) => (
          <button key={c} className={cat === c ? "chip on" : "chip"} onClick={() => setCat(c)}>
            {c === "all" ? "すべて" : c}
          </button>
        ))}
      </div>

      <div className="gacha">
        <div key={spin} className={current ? "topic-card pop" : "topic-card empty"} aria-live="polite">
          {current ? (
            <>
              <small>{current.cat}</small>
              <p>{current.text}</p>
            </>
          ) : (
            <p>ボタンを押して、話題を引いてみましょう ✨</p>
          )}
        </div>
        <button className="btn big-btn" onClick={draw}>
          {current ? "もう一度引く" : "話題を引く"}
        </button>
      </div>
    </>
  );
}
