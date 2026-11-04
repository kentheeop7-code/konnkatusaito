"use client";
import { useEffect, useState } from "react";

const PIECES = ["💖", "✨", "🌸", "💫", "🥂", "💍"];

// fire が変わるたびに紙吹雪を表示
export default function Confetti({ fire }: { fire: number }) {
  const [items, setItems] = useState<{ id: number; ch: string; x: number; d: number; s: number }[]>([]);

  useEffect(() => {
    if (!fire) return;
    setItems(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        ch: PIECES[i % PIECES.length],
        x: Math.random() * 100,
        d: Math.random() * 0.5,
        s: 0.9 + Math.random() * 0.9,
      })),
    );
    const t = setTimeout(() => setItems([]), 2600);
    return () => clearTimeout(t);
  }, [fire]);

  return (
    <div className="confetti" aria-hidden>
      {items.map((p) => (
        <span key={p.id} style={{ left: `${p.x}%`, animationDelay: `${p.d}s`, fontSize: `${p.s}rem` }}>
          {p.ch}
        </span>
      ))}
    </div>
  );
}
