import Timeline from "@/components/Timeline";
import { dateLabel, event } from "@/data/event";

export const metadata = { title: "本日のスケジュール｜片町ナイト" };

export default function SchedulePage() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Today’s Program</p>
        <h1>本日のスケジュール</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">{dateLabel}</p>
      </header>

      <Timeline />

      <section className="panel venue">
        <h2>集合場所</h2>
        <p><b>{event.venue}</b></p>
        <p className="small">{event.venueNote}</p>
        <p className="small">※ {event.gather}（{event.time.split("〜")[0]}の5分前）にお集まりください。</p>
      </section>
    </>
  );
}
