"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import CardView from "@/components/CardView";
import Common from "@/components/Common";
import { Card, emptyCard, withDefaults } from "@/lib/card";
import { compat } from "@/lib/match";
import { STAMPS, SavedCard } from "@/lib/saved";
import { useStored } from "@/lib/storage";

type Sort = "new" | "num" | "match";

export default function CardsPage() {
  const [saved, setSaved, ready] = useStored<SavedCard[]>("soiree:saved", []);
  const [mineRaw] = useStored<Card>("soiree:mycard", emptyCard());
  const [onlyFav, setOnlyFav] = useState(false);
  const [sort, setSort] = useState<Sort>("new");
  const mine = withDefaults(mineRaw);

  const patch = (id: string, p: Partial<SavedCard>) => setSaved((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const toggleStamp = (c: SavedCard, s: string) => {
    const cur = c.stamps ?? [];
    patch(c.id, { stamps: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
  };
  const remove = (id: string, name: string) => {
    if (confirm(`${name}さんのカードを削除しますか？`)) setSaved((l) => l.filter((c) => c.id !== id));
  };

  const cards = useMemo(() => saved.map((c) => ({ ...withDefaults(c), fav: c.fav, memo: c.memo, savedAt: c.savedAt, stamps: c.stamps ?? [] })), [saved]);
  const score = (c: Card) => (mine.name ? compat(mine, c).score : 0);
  const list = useMemo(() => {
    const base = onlyFav ? cards.filter((c) => c.fav) : cards;
    const arr = [...base];
    if (sort === "num") arr.sort((a, b) => (parseInt(a.number) || 999) - (parseInt(b.number) || 999));
    if (sort === "match") arr.sort((a, b) => score(b) - score(a));
    if (sort === "new") arr.sort((a, b) => b.savedAt - a.savedAt);
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, onlyFav, sort, mineRaw]);
  const favs = cards.filter((c) => c.fav).sort((a, b) => (parseInt(a.number) || 999) - (parseInt(b.number) || 999));

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Card Collection</p>
        <h1>名刺帳</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">今夜出会った人との「会話」を、スタンプとメモで残そう。</p>
      </header>

      {ready && saved.length > 0 && (
        <>
          <div className="summary">
            <div><b>{saved.length}</b><span>出会った人</span></div>
            <div><b>{favs.length}</b><span>気になる</span></div>
            <div><b>{cards.reduce((n, c) => n + c.stamps.length, 0)}</b><span>スタンプ</span></div>
          </div>
          <div className="btn-row center">
            {(
              [
                ["new", "新しい順"],
                ["num", "番号順"],
                ["match", "相性順"],
              ] as [Sort, string][]
            ).map(([k, label]) => (
              <button key={k} className={sort === k ? "chip on" : "chip"} onClick={() => setSort(k)} disabled={k === "match" && !mine.name} title={k === "match" && !mine.name ? "マイカードを作ると使えます" : undefined}>
                {label}
              </button>
            ))}
            <button className={onlyFav ? "chip on" : "chip"} onClick={() => setOnlyFav((v) => !v)}>
              ♥ 気になる方のみ
            </button>
          </div>
        </>
      )}

      {ready && saved.length === 0 && (
        <section className="panel center">
          <h2>まだカードがありません</h2>
          <p className="small">相手のQRコードをスマートフォンで読み取ると、ここに保存できます。まずはご自身のカードを作成しましょう。</p>
          <Link className="btn" href="/profile">マイカードを作る</Link>
        </section>
      )}

      {favs.length > 0 && (
        <section className="panel vote">
          <h2>💌 気になる人メモ</h2>
          <p className="small">「気になる」にした方です。連絡先交換のときの控えにどうぞ。</p>
          <ul>
            {favs.map((c) => (
              <li key={c.id}>
                <b>{c.number ? `No.${c.number}` : "No.—"}</b>
                <span>{c.icon} {c.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="card-grid">
        {list.map((c) => (
          <div key={c.id} className="saved">
            <CardView card={c} />
            <Common card={c} />
            <div className="saved-tools">
              <button className={c.fav ? "heart on" : "heart"} onClick={() => patch(c.id, { fav: !c.fav })} aria-pressed={c.fav}>
                {c.fav ? "♥ 気になる" : "♡ 気になる"}
              </button>
              <button className="link-danger" onClick={() => remove(c.id, c.name)}>削除</button>
            </div>
            <div className="stamps" role="group" aria-label="印象スタンプ">
              {STAMPS.map((s) => (
                <button key={s} className={c.stamps.includes(s) ? "stamp on" : "stamp"} aria-pressed={c.stamps.includes(s)} onClick={() => toggleStamp(c, s)}>
                  {s}
                </button>
              ))}
            </div>
            <textarea
              className="memo"
              rows={2}
              maxLength={200}
              placeholder="会話メモ（聞けたこと、次に聞きたいこと）— 他の人には見えません"
              value={c.memo}
              onChange={(e) => patch(c.id, { memo: e.target.value })}
            />
          </div>
        ))}
      </div>
    </>
  );
}
