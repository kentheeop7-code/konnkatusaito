"use client";
import { Card, emptyCard } from "@/lib/card";
import { useStored } from "@/lib/storage";

// 自分のカードとの共通点を表示（会話のきっかけ）
export default function Common({ card }: { card: Card }) {
  const [mine] = useStored<Card>("soiree:mycard", emptyCard());
  if (!mine.name || mine.id === card.id) return null;

  const hobbies = card.hobbies.filter((h) => mine.hobbies.includes(h));
  const sameArea = !!mine.area && mine.area === card.area;
  const sameAge = !!mine.age && mine.age === card.age;
  const points = hobbies.length * 2 + (sameArea ? 1 : 0) + (sameAge ? 1 : 0);
  const stars = Math.min(5, points);

  return (
    <div className="common">
      <div className="common-head">
        <b>共通点チェック</b>
        <span className="stars" aria-label={`相性 ${stars} / 5`}>
          {"★".repeat(stars)}
          <i>{"★".repeat(5 - stars)}</i>
        </span>
      </div>
      {points === 0 ? (
        <p>共通点はまだ見つかっていません。新しい発見がありそう ✨</p>
      ) : (
        <ul>
          {hobbies.length > 0 && <li>共通の趣味：{hobbies.join("・")}</li>}
          {sameArea && <li>同じお住まいのエリア（{card.area}）</li>}
          {sameAge && <li>同じ年代（{card.age}）</li>}
        </ul>
      )}
    </div>
  );
}
