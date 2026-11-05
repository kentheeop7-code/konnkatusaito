import { Card, PAIRS } from "./card";

export type Compat = {
  hobbies: string[];
  same: number[]; // 同じ側を選んだ「どっち派」
  diff: number[]; // 割れた「どっち派」
  sameArea: boolean;
  sameAge: boolean;
  score: number;
  stars: number;
};

export function compat(mine: Card, other: Card): Compat {
  const hobbies = other.hobbies.filter((h) => mine.hobbies.includes(h));
  const same: number[] = [];
  const diff: number[] = [];
  PAIRS.forEach((_, i) => {
    const x = mine.picks[i];
    const y = other.picks[i];
    if (x && y && x !== "-" && y !== "-") (x === y ? same : diff).push(i);
  });
  const sameArea = !!mine.area && mine.area === other.area;
  const sameAge = !!mine.age && mine.age === other.age && mine.age !== "ひみつ";
  const score = hobbies.length * 2 + same.length + (sameArea ? 1 : 0) + (sameAge ? 1 : 0);
  return { hobbies, same, diff, sameArea, sameAge, score, stars: Math.min(5, Math.ceil(score / 2)) };
}

const side = (c: Card, i: number) => (c.picks[i] === "a" ? PAIRS[i].a : PAIRS[i].b);

// 話しかけ例（会話のきっかけ）
export function openers(mine: Card | null, other: Card): string[] {
  const out: string[] = [];
  if (other.hook) out.push(`「${other.hook}」って気になる！ 詳しく聞かせてください`);
  if (other.animal) out.push(`${other.animal.split(" ")[1] ?? other.animal}って言われるんですね！ 自分ではどのあたりが似てると思います？`);
  if (mine?.name) {
    const c = compat(mine, other);
    c.hobbies.slice(0, 2).forEach((h) => out.push(`${h}がお好きなんですね！ 私もなんです。最近のおすすめはありますか？`));
    if (c.diff[0] !== undefined) {
      const i = c.diff[0];
      out.push(`私は${side(mine, i)}なんですが、${side(other, i)}なんですね！ どこが好きですか？`);
    } else if (c.same[0] !== undefined) {
      out.push(`${side(other, c.same[0])}同士ですね！ きっかけは何ですか？`);
    }
  }
  if (other.tl.every((t) => t) && other.lie >= 0) out.push("カードのウソ当てクイズ、挑戦しました！ ヒントをください 😆");
  const first = other.hobbies[0];
  if (first && !out.some((o) => o.includes(first))) out.push(`${first}はいつ頃から好きなんですか？`);
  out.push("今日いちばん楽しみにしていたことは何ですか？");
  return out.slice(0, 4);
}
