"use client";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { dateLabel, event } from "@/data/event";

const steps = [
  { n: "1", title: "QRコードを読み取る", text: "スマホのカメラをかざすと、アプリのページが開きます。" },
  { n: "2", title: "マイカードを作る", text: "ニックネームや趣味を入力して、自己紹介カードを用意。" },
  { n: "3", title: "QRでカード交換", text: "気になる方と見せ合って、名刺帳に保存しましょう。" },
];

export default function JoinPage() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setUrl(`${window.location.origin}/`), []);

  const savePng = () => {
    const canvas = document.getElementById("app-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "katamachi-night-qr.png";
    a.click();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <header className="page-head no-print">
        <p className="eyebrow">Share the App</p>
        <h1>みんなで使おう</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">このQRコードを会場で見せたり、印刷して配ったりできます。</p>
      </header>

      <section className="poster">
        <p className="eyebrow">{event.brand}</p>
        <h2>{event.title}</h2>
        <p className="poster-date">
          {dateLabel} {event.time}
        </p>
        <p className="poster-cta">スマホで読み取って、アプリを使ってね 📱</p>
        <div className="qr qr-big">
          {url && <QRCodeCanvas id="app-qr" value={url} size={1024} fgColor="#2f4170" bgColor="#ffffff" level="M" marginSize={2} style={{ width: "100%", height: "auto" }} />}
        </div>
        <p className="poster-url">{url}</p>
        <ol className="poster-steps">
          {steps.map((s) => (
            <li key={s.n}>
              <b>{s.n}</b>
              <div>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="btn-row no-print">
        <button className="btn" onClick={savePng}>画像（PNG）で保存</button>
        <button className="btn ghost" onClick={() => window.print()}>印刷する</button>
        <button className="btn ghost" onClick={copy}>{copied ? "コピーしました ✓" : "リンクをコピー"}</button>
      </div>
      <p className="hint no-print">会場のスクリーンに映したり、チラシ・受付に貼ったりしてご利用ください。</p>
    </>
  );
}
