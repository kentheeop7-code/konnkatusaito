"use client";

export default function WelcomeLink() {
  return (
    <button className="link-quiet" onClick={() => window.dispatchEvent(new Event("soiree:welcome"))}>
      ✦ ようこそメッセージをもう一度見る
    </button>
  );
}
