"use client";
import { Card, PAIRS, emptyCard, withDefaults } from "@/lib/card";
import { compat, openers } from "@/lib/match";
import { useStored } from "@/lib/storage";

// 自分のカードとの共通点と、話しかけ例（会話のきっかけ）
export default function Common({ card }: { card: Card }) {
  const [stored] = useStored<Card>("soiree:mycard", emptyCard());
  const mine = withDefaults(stored);
  const hasMine = !!mine.name && mine.id !== card.id;
  const c = hasMine ? compat(mine, card) : null;
  const lines = openers(hasMine ? mine : null, card);

  return (
    <div className="common">
      {c && (
        <>
          <div className="common-head">
            <b>共通点チェック</b>
            <span className="stars" aria-label={`相性 ${c.stars} / 5`}>
              {"★".repeat(c.stars)}
              <i>{"★".repeat(5 - c.stars)}</i>
            </span>
          </div>
          {c.score === 0 && c.diff.length === 0 ? (
            <p>共通点はまだ見つかっていません。新しい発見がありそう ✨</p>
          ) : (
            <ul>
              {c.hobbies.length > 0 && <li>共通の趣味：{c.hobbies.join("・")}</li>}
              {c.same.length > 0 && <li>同じ派：{c.same.map((i) => PAIRS[i][mine.picks[i] === "a" ? "a" : "b"]).join("・")}</li>}
              {c.diff.length > 0 && (
                <li>
                  意見が割れた：
                  {c.diff.map((i) => `${PAIRS[i].a} / ${PAIRS[i].b}`).join("、")}
                </li>
              )}
              {c.sameArea && <li>同じお住まいのエリア（{card.area}）</li>}
              {c.sameAge && <li>同じ年代（{card.age}）</li>}
            </ul>
          )}
        </>
      )}
      <div className="opener">
        <b>💬 話しかけるなら</b>
        <ul>
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
