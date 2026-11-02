export const TONES = {
  rose: { label: "ローズ", from: "#e8b4b8", to: "#b8607a" },
  gold: { label: "シャンパン", from: "#e6cf9d", to: "#a9843f" },
  navy: { label: "ネイビー", from: "#7f93b8", to: "#2c3e68" },
  sage: { label: "セージ", from: "#b5c9b0", to: "#5f8068" },
  plum: { label: "プラム", from: "#c9a3c9", to: "#6b3a6e" },
} as const;
export type ToneKey = keyof typeof TONES;

export const ICONS = ["🌹", "🌸", "🦋", "🍷", "☕", "🌿", "🎀", "🐈", "🌙", "✨", "🎹", "🍀"];

export const HOBBY_PRESETS = [
  "旅行", "カフェ巡り", "映画", "料理", "ヨガ", "ゴルフ", "読書", "音楽",
  "ドライブ", "グルメ", "写真", "スポーツ観戦", "ランニング", "キャンプ", "お酒", "ペット",
];

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
  };
  return card.name ? card : null;
}

// UTF-8 → base64url（URLに載せて共有するため）
export function encodeCard(card: Card): string {
  const bytes = new TextEncoder().encode(JSON.stringify(card));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCard(data: string): Card | null {
  try {
    const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return sanitize(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}
