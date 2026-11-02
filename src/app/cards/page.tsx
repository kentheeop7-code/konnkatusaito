"use client";
import Link from "next/link";
import { useState } from "react";
import CardView from "@/components/CardView";
import { SavedCard } from "@/lib/saved";
import { useStored } from "@/lib/storage";

export default function CardsPage() {
  const [saved, setSaved, ready] = useStored<SavedCard[]>("soiree:saved", []);
  const [onlyFav, setOnlyFav] = useState(false);

  const patch = (id: string, p: Partial<SavedCard>) => setSaved((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const remove = (id: string, name: string) => {
    if (confirm(`${name}さんのカードを削除しますか？`)) setSaved((l) => l.filter((c) => c.id !== id));
  };
  const list = onlyFav ? saved.filter((c) => c.fav) : saved;

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Card Collection</p>
        <h1>名刺帳</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">受け取ったカードに、気になる度合いやメモを残せます。</p>
      </header>

      {ready && saved.length > 0 && (
        <div className="btn-row center">
          <button className={onlyFav ? "chip on" : "chip"} onClick={() => setOnlyFav((v) => !v)}>
            ♥ 気になる方のみ（{saved.filter((c) => c.fav).length}）
          </button>
        </div>
      )}

      {ready && saved.length === 0 && (
        <section className="panel center">
          <h2>まだカードがありません</h2>
          <p className="small">相手のQRコードをスマートフォンで読み取ると、ここに保存できます。まずはご自身のカードを作成しましょう。</p>
          <Link className="btn" href="/profile">自己紹介カードを作る</Link>
        </section>
      )}

      <div className="card-grid">
        {list.map((c) => (
          <div key={c.id} className="saved">
            <CardView card={c} />
            <div className="saved-tools">
              <button className={c.fav ? "heart on" : "heart"} onClick={() => patch(c.id, { fav: !c.fav })} aria-pressed={c.fav}>
                {c.fav ? "♥ 気になる" : "♡ 気になる"}
              </button>
              <button className="link-danger" onClick={() => remove(c.id, c.name)}>削除</button>
            </div>
            <textarea
              className="memo"
              rows={2}
              maxLength={200}
              placeholder="メモ（話した内容、印象など）— 他の人には見えません"
              value={c.memo}
              onChange={(e) => patch(c.id, { memo: e.target.value })}
            />
          </div>
        ))}
      </div>
    </>
  );
}
