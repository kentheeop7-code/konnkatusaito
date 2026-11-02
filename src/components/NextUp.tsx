"use client";
import Link from "next/link";
import { schedule } from "@/data/event";
import { useSchedule } from "./Timeline";

export default function NextUp() {
  const { live, nowIdx, nextIdx } = useSchedule();
  if (!live) return null;
  const idx = nowIdx >= 0 ? nowIdx : nextIdx;
  if (idx < 0) {
    return (
      <section className="nextup">
        <p className="eyebrow">Thank you</p>
        <h2>本日はご参加ありがとうございました</h2>
      </section>
    );
  }
  const s = schedule[idx];
  return (
    <Link href="/schedule" className="nextup">
      <p className="eyebrow">{nowIdx >= 0 ? "Now" : "Next"}</p>
      <h2>
        <span aria-hidden>{s.icon}</span> {s.title}
      </h2>
      <p>
        {s.start} – {s.end}
      </p>
    </Link>
  );
}
