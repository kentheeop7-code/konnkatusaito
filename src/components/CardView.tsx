"use client";
import { useState } from "react";
import { Card, PAIRS, TONES } from "@/lib/card";

// answer: 自分のカードのプレビューではウソの答えを見せる
export default function CardView({ card, answer = false }: { card: Card; answer?: boolean }) {
  const tone = TONES[card.tone];
  const [guessed, setGuessed] = useState<number[]>([]);
  const rows: [string, string][] = [
    ["年代", card.age],
    ["お仕事", card.job],
    ["お住まい", card.area],
    ["休日の過ごし方", card.holiday],
    ["好きな食べ物", card.food],
  ];
  const picks = PAIRS.map((p, i) => (card.picks[i] === "a" ? p.a : card.picks[i] === "b" ? p.b : "")).filter(Boolean);
  const quiz = card.tl.every((t) => t.trim()) && card.lie >= 0;
  const solved = guessed.includes(card.lie);

  return (
    <article className="pcard">
      <header style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}>
        <span className="pcard-icon">{card.icon}</span>
        <div>
          {card.number && <small>No. {card.number}</small>}
          <h3>{card.name || "お名前"}</h3>
          {card.animal && <span className="animal">{card.animal}</span>}
        </div>
      </header>
      <div className="pcard-body">
        {card.hook && (
          <p className="hook">
            <b>💬 これ聞いて！</b>
            {card.hook}
          </p>
        )}
        {picks.length > 0 && (
          <div className="picks" aria-label="どっち派">
            {picks.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        )}
        {card.hobbies.length > 0 && (
          <ul className="tags">
            {card.hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <dl>
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {quiz && (
          <div className="quiz">
            <b>🎲 ウソ当てクイズ</b>
            <small>3つのうち、1つはウソ！ どれだと思う？</small>
            <ul>
              {card.tl.map((t, i) => {
                const wrong = guessed.includes(i) && i !== card.lie;
                const right = i === card.lie && (solved || answer);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={right ? "q right" : wrong ? "q wrong" : "q"}
                      disabled={answer || solved || guessed.includes(i)}
                      onClick={() => setGuessed((g) => [...g, i])}
                    >
                      <span>{t}</span>
                      {right && <em>ウソ！ 🎉</em>}
                      {wrong && <em>本当でした</em>}
                    </button>
                  </li>
                );
              })}
            </ul>
            {solved && !answer && <p className="quiz-note">正解！ ぜひ「本当の話」を聞いてみてください 😆</p>}
          </div>
        )}
        {card.message && <p className="pcard-msg">“{card.message}”</p>}
      </div>
    </article>
  );
}
