"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "ホーム", icon: "⌂" },
  { href: "/schedule", label: "進行", icon: "◷" },
  { href: "/profile", label: "マイカード", icon: "♡" },
  { href: "/cards", label: "名刺帳", icon: "❏" },
  { href: "/talk", label: "話題", icon: "✦" },
  { href: "/contact", label: "連絡先", icon: "✉" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="メインメニュー">
      <Link href="/" className="nav-brand">
        Katamachi Night
      </Link>
      <ul>
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                <span className="nav-icon" aria-hidden>{it.icon}</span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
