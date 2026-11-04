"use client";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CardView from "@/components/CardView";
import Common from "@/components/Common";
import Confetti from "@/components/Confetti";
import { decodeCard } from "@/lib/card";
import { SavedCard } from "@/lib/saved";
import { useStored } from "@/lib/storage";

function Inner() {
  const params = useSearchParams();
  const d = params.get("d");
  const card = useMemo(() => (d ? decodeCard(d) : null), [d]);
  const [saved, setSaved] = useStored<SavedCard[]>("soiree:saved", []);
  const [fire, setFire] = useState(0);

  if (!card) {
    return (
      <section className="panel center">
        <h2>カードを読み込めませんでした</h2>
        <p className="small">リンクが途中で切れている可能性があります。もう一度共有してもらってください。</p>
        <Link className="btn" href="/">ホームへ</Link>
      </section>
    );
  }
  const already = saved.some((s) => s.id === card.id);
  const save = () => {
    setSaved((list) => [{ ...card, fav: false, memo: "", savedAt: Date.now() }, ...list.filter((s) => s.id !== card.id)]);
    setFire((n) => n + 1);
  };

  return (
    <div className="narrow">
      <Confetti fire={fire} />
      <CardView card={card} />
      <Common card={card} />
      <div className="btn-row center">
        {already ? (
          <Link className="btn" href="/cards">名刺帳で見る ✓ 保存済み</Link>
        ) : (
          <button className="btn" onClick={save}>名刺帳に保存する</button>
        )}
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Received Card</p>
        <h1>受け取ったカード</h1>
        <div className="ornament" aria-hidden>❦</div>
      </header>
      <Suspense fallback={<p className="hint">読み込み中…</p>}>
        <Inner />
      </Suspense>
    </>
  );
}
