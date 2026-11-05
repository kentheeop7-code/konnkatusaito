// 開催ごとにこのファイルを書き換えるだけで、全ページの内容が更新されます。

export const event = {
  brand: "Katamachi Night",
  title: "片町ナイト カジュアル合コン",
  tagline: "素敵な出会いを見つけよう",
  date: "2026-12-26", // YYYY-MM-DD（当日のみ「進行中」表示になります）
  time: "19:00〜21:00",
  gather: "5分前集合",
  venue: "片町周辺",
  venueNote: "細部は人数が決まり次第、追ってご連絡します",
};

// 例: 2026年12月26日（土）— date から自動生成
const [y, m, d] = event.date.split("-").map(Number);
export const dateLabel = `${y}年${m}月${d}日（${"日月火水木金土"[new Date(y, m - 1, d).getDay()]}）`;

// 開催概要（ホームに表示）
export const info = [
  { icon: "📅", label: "日時", lines: [`${dateLabel}`, `${event.time}（${event.gather}）`] },
  { icon: "📍", label: "場所", lines: [event.venue, event.venueNote] },
  { icon: "¥", label: "参加費及び飲食代", lines: ["男性 6,000円", "女性 3,000円", "※飲み放題付き"], note: "お支払いは現金または PayPay" },
  { icon: "✎", label: "参加条件", lines: ["20歳から32歳までの男性と女性"], note: "友達探しや恋人探し大歓迎" },
  { icon: "📱", label: "お申込み", lines: ["サイトより申し込み"] },
];

export type Slot = {
  start: string; // HH:mm
  end: string;
  title: string;
  desc: string;
  icon: string;
};

export const schedule: Slot[] = [
  { start: "18:55", end: "19:00", title: "集合・受付", desc: "5分前までにお集まりください。お支払い（現金またはPayPay）もこのときに。", icon: "🕊️" },
  { start: "19:00", end: "19:15", title: "乾杯・自己紹介", desc: "幹事のあいさつのあと、まずは乾杯！ アプリの自己紹介カードも使ってみてください。", icon: "🥂" },
  { start: "19:15", end: "19:55", title: "席替えトーク", desc: "席を替えながら、みんなとお話しします。会話に詰まったら「話題ガチャ」をどうぞ。", icon: "💬" },
  { start: "19:55", end: "20:40", title: "フリータイム", desc: "飲み放題をお楽しみください。気になる方のカードはQRコードで受け取れます。", icon: "🍸" },
  { start: "20:40", end: "20:55", title: "連絡先交換タイム", desc: "気になった方と、お互いの合意のうえで連絡先を交換しましょう。", icon: "💌" },
  { start: "20:55", end: "21:00", title: "ごあいさつ・終了", desc: "本日はありがとうございました。帰り道はお気をつけて。", icon: "🌙" },
];

export const contacts = {
  organizer: "片町ナイト 運営",
  hours: "開催当日 18:00〜21:30（それ以外はメッセージでご連絡ください）",
  items: [
    { kind: "tel", label: "お電話", value: "000-0000-0000", href: "tel:00000000000", note: "当日の遅刻・道に迷ったときはこちら" },
    { kind: "mail", label: "メール", value: "info@example.com", href: "mailto:info@example.com", note: "ご質問・ご相談はお気軽に" },
    { kind: "line", label: "LINE", value: "@katamachi-night", href: "https://line.me/R/ti/p/@katamachi-night", note: "会場の詳細や次回のご案内をお届けします" },
    { kind: "insta", label: "Instagram", value: "@katamachi_night", href: "https://www.instagram.com/katamachi_night/", note: "開催の様子をご覧いただけます" },
  ],
  staff: [
    { name: "幹事", who: "（お名前）", note: "会場でお気軽にお声がけください" },
  ],
  notice: [
    "連絡先の交換は、お互いの合意があった場合のみにしましょう。",
    "しつこい勧誘や、無断での写真撮影・SNS投稿はお控えください。",
    "飲み過ぎにご注意を。体調不良やトラブルのときは、すぐ幹事にお知らせください。",
  ],
};
