"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import CardView from "@/components/CardView";
import { Card, HOBBY_PRESETS, ICONS, TONES, ToneKey, emptyCard, encodeCard, newId } from "@/lib/card";
import { useStored } from "@/lib/storage";

const AGES = ["20代前半", "20代後半", "30代前半", "ひみつ"];

export default function ProfilePage() {
  const [card, setCard, ready] = useStored<Card>("soiree:mycard", emptyCard());
  const [custom, setCustom] = useState("");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);
  // 初回は共有用IDを発行
  useEffect(() => {
    if (ready && !card.id) setCard((c) => ({ ...c, id: newId() }));
  }, [ready, card.id, setCard]);

  const set = <K extends keyof Card>(k: K, v: Card[K]) => setCard((c) => ({ ...c, [k]: v }));
  const toggleHobby = (h: string) =>
    setCard((c) => ({
      ...c,
      hobbies: c.hobbies.includes(h) ? c.hobbies.filter((x) => x !== h) : c.hobbies.length < 8 ? [...c.hobbies, h] : c.hobbies,
    }));
  const addCustom = () => {
    const v = custom.trim().slice(0, 16);
    if (v && !card.hobbies.includes(v) && card.hobbies.length < 8) set("hobbies", [...card.hobbies, v]);
    setCustom("");
  };

  const url = card.name ? `${origin}/card?d=${encodeCard(card)}` : "";
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const share = () => navigator.share({ title: `${card.name}さんの自己紹介カード`, url }).catch(() => {});

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">My Card</p>
        <h1>自己紹介カード</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">入力内容はこの端末に自動保存されます。</p>
      </header>

      <div className="two-col">
        <form className="panel form" onSubmit={(e) => e.preventDefault()}>
          <label>
            ニックネーム<em>必須</em>
            <input value={card.name} maxLength={20} placeholder="例：さくら" onChange={(e) => set("name", e.target.value)} />
          </label>
          <div className="row">
            <label>
              参加番号
              <input value={card.number} maxLength={4} inputMode="numeric" placeholder="例：12" onChange={(e) => set("number", e.target.value)} />
            </label>
            <label>
              年代
              <select value={card.age} onChange={(e) => set("age", e.target.value)}>
                <option value="">選択してください</option>
                {AGES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="row">
            <label>
              お仕事
              <input value={card.job} maxLength={30} placeholder="例：デザイナー" onChange={(e) => set("job", e.target.value)} />
            </label>
            <label>
              お住まい
              <input value={card.area} maxLength={20} placeholder="例：東京都" onChange={(e) => set("area", e.target.value)} />
            </label>
          </div>

          <fieldset>
            <legend>趣味（8つまで）</legend>
            <div className="chips">
              {HOBBY_PRESETS.map((h) => (
                <button type="button" key={h} className={card.hobbies.includes(h) ? "chip on" : "chip"} onClick={() => toggleHobby(h)}>
                  {h}
                </button>
              ))}
              {card.hobbies.filter((h) => !HOBBY_PRESETS.includes(h)).map((h) => (
                <button type="button" key={h} className="chip on" onClick={() => toggleHobby(h)}>
                  {h} ×
                </button>
              ))}
            </div>
            <div className="add">
              <input
                value={custom}
                maxLength={16}
                placeholder="自由に追加"
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    addCustom();
                  }
                }}
              />
              <button type="button" className="btn ghost" onClick={addCustom}>追加</button>
            </div>
          </fieldset>

          <label>
            休日の過ごし方
            <input value={card.holiday} maxLength={80} placeholder="例：カフェで読書、ときどき温泉へ" onChange={(e) => set("holiday", e.target.value)} />
          </label>
          <label>
            好きな食べ物
            <input value={card.food} maxLength={60} placeholder="例：お寿司、チーズケーキ" onChange={(e) => set("food", e.target.value)} />
          </label>
          <label>
            ひとこと
            <textarea value={card.message} maxLength={200} rows={3} placeholder="お話ししたいこと、理想の関係など" onChange={(e) => set("message", e.target.value)} />
            <small className="count">{card.message.length}/200</small>
          </label>

          <fieldset>
            <legend>アイコンとカラー</legend>
            <div className="chips">
              {ICONS.map((i) => (
                <button type="button" key={i} className={card.icon === i ? "chip icon on" : "chip icon"} onClick={() => set("icon", i)} aria-label={`アイコン ${i}`}>
                  {i}
                </button>
              ))}
            </div>
            <div className="chips tones">
              {(Object.keys(TONES) as ToneKey[]).map((k) => (
                <button
                  type="button"
                  key={k}
                  className={card.tone === k ? "tone on" : "tone"}
                  style={{ background: `linear-gradient(135deg, ${TONES[k].from}, ${TONES[k].to})` }}
                  onClick={() => set("tone", k)}
                  aria-label={TONES[k].label}
                  title={TONES[k].label}
                />
              ))}
            </div>
          </fieldset>
        </form>

        <div className="stack">
          <CardView card={card} />

          <section className="panel share">
            <h2>カードを共有する</h2>
            {url ? (
              <>
                <p className="small">気になる方にこのQRコードを読み取ってもらうと、あなたのカードを受け取れます。</p>
                <div className="qr">
                  <QRCodeSVG value={url} size={180} fgColor="#2f4170" bgColor="#ffffff" level="L" marginSize={2} />
                </div>
                <div className="btn-row">
                  <button className="btn" onClick={copy}>{copied ? "コピーしました ✓" : "リンクをコピー"}</button>
                  {canShare && <button className="btn ghost" onClick={share}>LINE・メール等で送る</button>}
                </div>
              </>
            ) : (
              <p className="small">ニックネームを入力すると、共有用のQRコードとリンクが表示されます。</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
