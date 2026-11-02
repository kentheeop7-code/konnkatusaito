import type { Card } from "./card";

export type SavedCard = Card & { fav: boolean; memo: string; savedAt: number };
