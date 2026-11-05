import type { Card } from "./card";

export const STAMPS = ["😊 笑顔が素敵", "🔥 話が盛り上がった", "👂 聞き上手", "🌟 また話したい", "🤝 共通点が多い", "🎭 ギャップがいい", "😂 笑いのツボが合う"];

export type SavedCard = Card & { fav: boolean; memo: string; savedAt: number; stamps?: string[] };
