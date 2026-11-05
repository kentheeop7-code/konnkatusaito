export const TONES = {
  rose: { label: "コーラル", from: "#f7bdb5", to: "#e9756a" },
  gold: { label: "スター", from: "#f6e2a6", to: "#d9a93f" },
  navy: { label: "ネイビー", from: "#7f93b8", to: "#2c3e68" },
  sage: { label: "ミント", from: "#b4e0dc", to: "#4f9b98" },
  plum: { label: "ラベンダー", from: "#cfc8ee", to: "#7d6bb5" },
} as const;
export type ToneKey = keyof typeof TONES;

export const ICONS = ["🌹", "🌸", "🦋", "🍷", "☕", "🌿", "🎀", "🐈", "🌙", "✨", "🎹", "🍀"];

export const HOBBY_PRESETS = [
  "旅行", "カフェ巡り", "映画", "料理", "ヨガ", "ゴルフ", "読書", "音楽",
  "ドライブ", "グルメ", "写真", "スポーツ観戦", "ランニング", "キャンプ", "お酒", "ペット",
];

// 「私を動物に例えると？」
export const ANIMALS = ["🐶 わんこ系", "🐱 ねこ系", "🐰 うさぎ系", "🦊 きつね系", "🐻 くま系", "🐧 ペンギン系", "🦉 ふくろう系", "🐼 パンダ系", "🦦 カワウソ系", "🐿️ りす系"];

// どっち派？（a / b のどちらか）
export const PAIRS: { a: string; b: string }[] = [
  { a: "犬派", b: "猫派" },
  { a: "朝型", b: "夜型" },
  { a: "海", b: "山" },
  { a: "甘党", b: "辛党" },
  { a: "インドア", b: "アウトドア" },
  { a: "きのこの山", b: "たけのこの里" },
  { a: "お家デート", b: "お出かけデート" },
  { a: "計画派", b: "ノリ派" },
];
export const NO_PICKS = "-".repeat(PAIRS.length);

export type Card = {
  id: string;
  name: string;
  number: string;
  age: string;
  job: string;
  area: string;
  hobbies: string[];
  holiday: string;
  food: string;
  message: string;
  icon: string;
  tone: ToneKey;
  animal: string;
  hook: string; // これ聞いて！
  picks: string; // "a" | "b" | "-" × PAIRS.length
  tl: string[]; // ウソ当てクイズ: 3つの主張
  lie: number; // tl のうちウソの番号（未設定は -1）
};

export const emptyCard = (): Card => ({
  id: "",
  name: "",
  number: "",
  age: "",
  job: "",
  area: "",
  hobbies: [],
  holiday: "",
  food: "",
  message: "",
  icon: ICONS[0],
  tone: "rose",
  animal: "",
  hook: "",
  picks: NO_PICKS,
  tl: ["", "", ""],
  lie: -1,
});

export const newId = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

function sanitize(raw: unknown): Card | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const tone = typeof r.tone === "string" && r.tone in TONES ? (r.tone as ToneKey) : "rose";
  const hobbies = Array.isArray(r.hobbies)
    ? r.hobbies.filter((h): h is string => typeof h === "string").slice(0, 8).map((h) => h.slice(0, 16))
    : [];
  const tl = Array.isArray(r.tl) ? [0, 1, 2].map((i) => str(r.tl instanceof Array ? r.tl[i] : "", 40)) : ["", "", ""];
  const lie = typeof r.lie === "number" && r.lie >= 0 && r.lie <= 2 ? Math.floor(r.lie) : -1;
  const picks = typeof r.picks === "string" && new RegExp(`^[ab-]{${PAIRS.length}}$`).test(r.picks) ? r.picks : NO_PICKS;
  const card: Card = {
    id: str(r.id, 20) || newId(),
    name: str(r.name, 20),
    number: str(r.number, 4),
    age: str(r.age, 10),
    job: str(r.job, 30),
    area: str(r.area, 20),
    hobbies,
    holiday: str(r.holiday, 80),
    food: str(r.food, 60),
    message: str(r.message, 200),
    icon: str(r.icon, 4) || ICONS[0],
    tone,
    animal: str(r.animal, 14),
    hook: str(r.hook, 60),
    picks,
    tl,
    lie,
  };
  return card.name ? card : null;
}

// 保存済みデータに新しい項目がなくても動くよう補う
export const withDefaults = (c: Partial<Card>): Card => ({ ...emptyCard(), ...c });

// QRコードを読み取りやすくするため、キー名なしの配列にして短くする
const KEYS = ["id", "name", "number", "age", "job", "area", "hobbies", "holiday", "food", "message", "icon", "tone", "animal", "hook", "picks", "tl", "lie"] as const;

function pack(card: Card): unknown[] {
  const arr: unknown[] = KEYS.map((k) => card[k]);
  if (card.picks === NO_PICKS) arr[14] = "";
  if (card.tl.every((t) => !t)) arr[15] = [];
  if (card.lie < 0) arr[16] = -1;
  while (arr.length && (arr[arr.length - 1] === "" || (Array.isArray(arr[arr.length - 1]) && (arr[arr.length - 1] as unknown[]).length === 0))) arr.pop();
  return arr;
}

// UTF-8 → base64url（URLに載せて共有するため）
export function encodeCard(card: Card): string {
  const bytes = new TextEncoder().encode(JSON.stringify(pack(card)));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCard(data: string): Card | null {
  try {
    const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    const obj = Array.isArray(parsed) ? Object.fromEntries(KEYS.map((k, i) => [k, parsed[i]])) : parsed;
    return sanitize(obj);
  } catch {
    return null;
  }
}

// QRコードやリンクの文字列からカードを取り出す
export function cardFromText(text: string): Card | null {
  const t = text.trim();
  try {
    const d = new URL(t).searchParams.get("d");
    if (d) return decodeCard(d);
  } catch {}
  return decodeCard(t);
}
