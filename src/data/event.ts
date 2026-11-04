// 開催ごとにこのファイルを書き換えるだけで、スケジュールと連絡先が更新されます。

export const event = {
  title: "Soirée 婚活パーティー",
  date: "2026-11-23", // YYYY-MM-DD（当日のみ「進行中」表示になります）
  venue: "ホテル グランベル 2F「ル・サロン」",
  address: "東京都千代田区丸の内1-1-1",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=東京駅",
  dress: "スマートカジュアル",
};

// 例: 2026年11月23日（月）— date から自動生成
const [y, m, d] = event.date.split("-").map(Number);
export const dateLabel = `${y}年${m}月${d}日（${"日月火水木金土"[new Date(y, m - 1, d).getDay()]}）`;

export type Slot = {
  start: string; // HH:mm
  end: string;
  title: string;
  desc: string;
  icon: string;
};

export const schedule: Slot[] = [
  { start: "13:00", end: "13:30", title: "受付・ウェルカムドリンク", desc: "名札とプロフィールカードをお渡しします。アプリで自己紹介カードの記入もどうぞ。", icon: "🥂" },
  { start: "13:30", end: "13:45", title: "開会のご挨拶・ルール説明", desc: "本日の流れとマナーについてご案内します。", icon: "🎤" },
  { start: "13:45", end: "14:45", title: "1対1 トークタイム", desc: "全員と順番にお話しします。1人あたり約5分、男性が席を移動します。", icon: "💬" },
  { start: "14:45", end: "15:00", title: "休憩・カード交換", desc: "気になった方のカードをQRコードで受け取りましょう。", icon: "🌸" },
  { start: "15:00", end: "15:50", title: "フリータイム", desc: "ご自由に歓談いただけます。ドリンク・軽食をお楽しみください。", icon: "🍰" },
  { start: "15:50", end: "16:10", title: "マッチング投票", desc: "気になった方の番号を投票用紙にご記入ください。", icon: "💌" },
  { start: "16:10", end: "16:30", title: "結果発表・閉会", desc: "カップル成立の発表と、連絡先交換のご案内をいたします。", icon: "💍" },
];

export const contacts = {
  organizer: "Soirée 運営事務局",
  hours: "平日 10:00〜19:00 ／ 開催当日 12:00〜17:00",
  items: [
    { kind: "tel", label: "お電話", value: "03-0000-0000", href: "tel:0300000000", note: "開催当日の緊急連絡はこちら" },
    { kind: "mail", label: "メール", value: "info@example.com", href: "mailto:info@example.com", note: "ご質問・ご相談はお気軽に" },
    { kind: "line", label: "LINE公式", value: "@soiree-event", href: "https://line.me/R/ti/p/@soiree-event", note: "次回イベントのご案内も配信中" },
    { kind: "insta", label: "Instagram", value: "@soiree_event", href: "https://www.instagram.com/soiree_event/", note: "開催の様子をご覧いただけます" },
  ],
  staff: [
    { name: "司会・進行", who: "佐藤", note: "会場内でお気軽にお声がけください" },
    { name: "受付・案内", who: "田中", note: "入口カウンターにおります" },
  ],
  notice: [
    "お相手のご連絡先は、双方の同意があった場合のみ運営からお伝えします。",
    "しつこい勧誘や無断での連絡先の共有・SNS投稿はお控えください。",
    "体調不良やトラブルの際は、すぐにスタッフまでお知らせください。",
  ],
};
