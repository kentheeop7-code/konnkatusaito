import Timeline from "@/components/Timeline";
import { event } from "@/data/event";

export const metadata = { title: "本日のスケジュール｜Soirée" };

export default function SchedulePage() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Today’s Program</p>
        <h1>本日のスケジュール</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">{event.dateLabel}</p>
      </header>

      <Timeline />

      <section className="panel venue">
        <h2>会場のご案内</h2>
        <p><b>{event.venue}</b></p>
        <p>{event.address}</p>
        <a className="btn ghost" href={event.mapUrl} target="_blank" rel="noopener noreferrer">地図を開く</a>
      </section>
    </>
  );
}
