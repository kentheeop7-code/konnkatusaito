import { contacts } from "@/data/event";

export const metadata = { title: "連絡先｜Soirée" };

export default function ContactPage() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>連絡先</h1>
        <div className="ornament" aria-hidden>❦</div>
        <p className="lead">{contacts.organizer}</p>
        <p className="small">受付時間：{contacts.hours}</p>
      </header>

      <section className="contact-list">
        {contacts.items.map((c) => (
          <a key={c.kind} className="contact" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            <span className="contact-label">{c.label}</span>
            <b>{c.value}</b>
            <small>{c.note}</small>
          </a>
        ))}
      </section>

      <section className="panel">
        <h2>当日のスタッフ</h2>
        <ul className="staff">
          {contacts.staff.map((s) => (
            <li key={s.name}>
              <b>{s.name}</b>　{s.who}
              <small>{s.note}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>ご利用にあたって</h2>
        <ul className="notice">
          {contacts.notice.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
