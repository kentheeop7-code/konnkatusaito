"use client";
import { useEffect, useState } from "react";
import { dateLabel, event, schedule } from "@/data/event";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function useSchedule() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const live = !!now && ymd(now) === event.date;
  const mins = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const status = (i: number): "done" | "now" | "later" => {
    if (!live) return "later";
    const s = schedule[i];
    if (mins >= toMin(s.end)) return "done";
    if (mins >= toMin(s.start)) return "now";
    return "later";
  };
  const nowIdx = live ? schedule.findIndex((_, i) => status(i) === "now") : -1;
  const nextIdx = live ? schedule.findIndex((_, i) => status(i) === "later") : -1;
  return { live, status, nowIdx, nextIdx, now, mins };
}

export default function Timeline() {
  const { live, status, nextIdx } = useSchedule();
  return (
    <>
      <ol className="timeline">
        {schedule.map((s, i) => {
          const st = status(i) === "later" && i === nextIdx ? "next" : status(i);
          return (
            <li key={s.start} className={`slot ${st}`}>
              <div className="slot-time">
                <b>{s.start}</b>
                <span>{s.end}</span>
              </div>
              <div className="slot-dot" aria-hidden />
              <div className="slot-body">
                <h3>
                  <span className="slot-icon" aria-hidden>{s.icon}</span>
                  {s.title}
                  {st === "now" && <em className="badge">進行中</em>}
                  {st === "next" && <em className="badge soft">次</em>}
                </h3>
                <p>{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {!live && <p className="hint">※ 開催当日（{dateLabel}）は、現在の進行状況が自動で表示されます。</p>}
    </>
  );
}
