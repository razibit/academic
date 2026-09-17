'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { internalRoute } from "@/lib/routes";
import type { NavigationItem } from "@/lib/content";

export default function AcademicNav({ items, title }: { items: NavigationItem[]; title: string }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.themeSource = "explicit";
    setDark(!dark);
    try { localStorage.setItem("academic-theme", next); } catch { /* Storage may be disabled. */ }
  }
  return <header className="academic-header"><div className="academic-nav"><Link className="site-mark" href={internalRoute("/")}>{title}</Link><nav aria-label="Main navigation">{items.filter((item) => item.type !== "link").map((item) => { const href = item.target === "about" ? internalRoute("/") : internalRoute(`/${item.target}/`); const active = item.target === "about" ? pathname === "/academic/" || pathname === "/academic" || pathname === "/" : pathname.includes(`/${item.target}`); return <Link key={item.target} className={active ? "active" : undefined} href={href}>{item.title}</Link>; })}</nav><button className="theme-button" type="button" onClick={toggle} aria-label="Toggle theme">{dark ? "Light" : "Dark"}</button></div></header>;
}
