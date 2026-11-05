"use client";
import Link from "next/link";
import { event, schedule } from "@/data/event";
import { useSchedule } from "./Timeline";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}時間${m % 60 ? `${m % 60}分` : ""}` : `${m}分`);

export default function NextUp() {
  const { live, nowIdx, nextIdx, now, mins } = useSchedule();
  if (!now) return <div className="live skeleton" aria-hidden />;

  if (!live) {
    const start = new Date(`${event.date}T00:00:00`);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((start.getTime() - today.getTime()) / 86400000);
    if (days > 0) {
      return (
        <section className="live">
          <p className="eyebrow">Countdown</p>
          <p className="big">
            開催まであと <b>{days}</b> 日
          </p>
          <p className="live-sub">その日までに「自己紹介カード」を作っておくと当日スムーズです。</p>
          <Link href="/profile" className="btn light">カードを作る</Link>
        </section>
      );
    }
    return (
      <section className="live">
        <p className="eyebrow">Thank you</p>
        <p className="big">ご参加ありがとうございました</p>
      </section>
    );
  }

  const first = toMin(schedule[0].start);
  if (mins < first) {
    return (
      <section className="live">
        <p className="eyebrow">Today</p>
        <p className="big">
          集合まであと <b>{fmt(first - mins)}</b>
        </p>
        <p className="live-sub">集合は {schedule[0].start} から。カードの準備をしておきましょう ✨</p>
        <Link href="/profile" className="btn light">カードを確認する</Link>
      </section>
    );
  }

  if (nowIdx < 0 && nextIdx < 0) {
    return (
      <section className="live">
        <p className="eyebrow">Thank you</p>
        <p className="big">本日はありがとうございました</p>
        <p className="live-sub">良いご縁がありますように 💍</p>
      </section>
    );
  }

  const cur = nowIdx >= 0 ? schedule[nowIdx] : null;
  const nxt = schedule[nowIdx >= 0 ? nowIdx + 1 : nextIdx];
  const target = cur ?? nxt;
  const progress = cur ? Math.min(100, ((mins - toMin(cur.start)) / (toMin(cur.end) - toMin(cur.start))) * 100) : 0;

  return (
    <section className="live">
      <p className="eyebrow">{cur ? "Now" : "Coming up"}</p>
      <p className="big">
        <span aria-hidden>{target.icon}</span> {target.title}
      </p>
      {cur ? (
        <>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${progress}%` }} />
          </div>
          <p className="live-sub">あと <b>{fmt(toMin(cur.end) - mins)}</b>（〜{cur.end}）</p>
          {nxt && <p className="live-next">次は {nxt.start}〜 {nxt.icon} {nxt.title}</p>}
        </>
      ) : (
        <p className="live-sub">{target.start} から（あと <b>{fmt(toMin(target.start) - mins)}</b>）</p>
      )}
      <Link href="/schedule" className="btn light">タイムテーブルを見る</Link>
    </section>
  );
}
