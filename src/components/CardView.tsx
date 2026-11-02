import { Card, TONES } from "@/lib/card";

export default function CardView({ card }: { card: Card }) {
  const tone = TONES[card.tone];
  const rows: [string, string][] = [
    ["年代", card.age],
    ["お仕事", card.job],
    ["お住まい", card.area],
    ["休日の過ごし方", card.holiday],
    ["好きな食べ物", card.food],
  ];
  return (
    <article className="pcard">
      <header style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}>
        <span className="pcard-icon">{card.icon}</span>
        <div>
          {card.number && <small>No. {card.number}</small>}
          <h3>{card.name || "お名前"}</h3>
        </div>
      </header>
      <div className="pcard-body">
        {card.hobbies.length > 0 && (
          <ul className="tags">
            {card.hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <dl>
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {card.message && <p className="pcard-msg">“{card.message}”</p>}
      </div>
    </article>
  );
}
