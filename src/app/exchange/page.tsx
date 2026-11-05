"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import CardView from "@/components/CardView";
import Common from "@/components/Common";
import Confetti from "@/components/Confetti";
import Scanner from "@/components/Scanner";
import { Card, cardFromText, emptyCard, encodeCard, withDefaults } from "@/lib/card";
import { SavedCard } from "@/lib/saved";
import { useStored } from "@/lib/storage";

type Tab = "show" | "scan";

export default function ExchangePage() {
  const [tab, setTab] = useState<Tab>("show");
  const [stored, , ready] = useStored<Card>("soiree:mycard", emptyCard());
  const [saved, setSaved] = useStored<SavedCard[]>("soiree:saved", []);
  const [origin, setOrigin] = useState("");
  const [scanned, setScanned] = useState<Card | null>(null);
  const [paste, setPaste] = useState("");
  const [pasteErr, setPasteErr] = useState("");
  const [fire, setFire] = useState(0);

  useEffect(() => setOrigin(window.location.origin), []);
  const mine = withDefaults(stored);
  const url = mine.name && mine.id && origin ? `${origin}/card?d=${encodeCard(mine)}` : "";

  const accept = (text: string): boolean => {
    const c = cardFromText(text);
    if (!c) return false;
    setScanned(c);
    try {
      navigator.vibrate?.(60);
    } catch {}
    return true;
  };
  const onScan = (text: string) => {
    if (!accept(text)) setPasteErr("このQRコードはカードではありませんでした。もう一度お試しください。");
  };
  const onPaste = () => {
    setPasteErr("");
    if (!accept(paste)) setPasteErr("カードを読み込めませんでした。リンク全体を貼り付けてください。");
    else setPaste("");
  };

  const already = !!scanned && saved.some((s) => s.id === scanned.id);
  const save = () => {
    if (!scanned) return;
    setSaved((l) => [{ ...scanned, fav: false, memo: "", stamps: [], savedAt: Date.now() }, ...l.filter((s) => s.id !== scanned.id)]);
    setFire((n) => n + 1);
  };

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Card Exchange</p>
        <h1>カード交換</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">お互いに「見せる」と「読み取る」で、カードを交換しよう。</p>
      </header>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "show"} className={tab === "show" ? "on" : ""} onClick={() => setTab("show")}>
          見せる（自分のQR）
        </button>
        <button role="tab" aria-selected={tab === "scan"} className={tab === "scan" ? "on" : ""} onClick={() => setTab("scan")}>
          読み取る（相手のQR）
        </button>
      </div>

      {tab === "show" && (
        <section className="panel center ex-show">
          {ready && url ? (
            <>
              <p className="ex-name">
                <span aria-hidden>{mine.icon}</span> {mine.name}
                {mine.number && <small> No.{mine.number}</small>}
              </p>
              <div className="qr qr-big">
                <QRCodeSVG value={url} size={360} fgColor="#2f4170" bgColor="#ffffff" level="L" marginSize={3} />
              </div>
              <p className="small">相手にこの画面を見せて、読み取ってもらいましょう。<br />画面の明るさを上げると読み取りやすくなります。</p>
              <div className="btn-row">
                <button className="btn" onClick={() => setTab("scan")}>相手のQRを読み取る →</button>
                <Link className="btn ghost" href="/profile">カードを編集</Link>
              </div>
            </>
          ) : ready ? (
            <>
              <h2>先にマイカードを作りましょう</h2>
              <p className="small">ニックネームを入力すると、交換用のQRコードが表示されます。</p>
              <Link className="btn" href="/profile">マイカードを作る</Link>
            </>
          ) : null}
        </section>
      )}

      {tab === "scan" && (
        <section className="panel center ex-scan">
          <Confetti fire={fire} />
          {scanned ? (
            <div className="narrow">
              <p className="found">🎉 カードを読み取りました！</p>
              <CardView card={scanned} />
              <Common card={scanned} />
              <div className="btn-row">
                {already ? (
                  <Link className="btn" href="/cards">名刺帳で見る ✓ 保存済み</Link>
                ) : (
                  <button className="btn" onClick={save}>名刺帳に保存する</button>
                )}
                <button className="btn ghost" onClick={() => setScanned(null)}>続けて読み取る</button>
              </div>
            </div>
          ) : (
            <>
              <Scanner onResult={onScan} />
              <details className="paste">
                <summary>うまく読み取れないときは「リンクを貼り付け」</summary>
                <p className="small">相手から届いたカードのリンクを貼り付けてください。</p>
                <div className="add">
                  <input value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="https://…/card?d=…" aria-label="カードのリンク" />
                  <button className="btn ghost" onClick={onPaste} disabled={!paste.trim()}>読み込む</button>
                </div>
              </details>
              {pasteErr && <p className="err" role="alert">{pasteErr}</p>}
              <p className="small">※ スマートフォン標準のカメラで読み取っても、カードのページが開いて保存できます。</p>
            </>
          )}
        </section>
      )}
    </>
  );
}
