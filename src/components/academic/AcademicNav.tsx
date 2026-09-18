'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { internalRoute } from "@/lib/routes";
import type { NavigationItem } from "@/lib/content";

export default function AcademicNav({ items, title }: { items: NavigationItem[]; title: string }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);
  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.themeSource = "explicit";
    setDark(!dark);
    try { localStorage.setItem("academic-theme", next); } catch { /* Storage may be disabled. */ }
  }
  return <header className="academic-header">
    <div className="academic-nav">
      <Link className="site-mark" href={internalRoute("/")} aria-label="Rajib Dab homepage">{title}</Link>
      <button className="menu-toggle" type="button" aria-label="Toggle menu" aria-controls="academic-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        <span /><span /><span />
      </button>
      <nav id="academic-menu" className={menuOpen ? "active" : undefined} aria-label="Main navigation">
        {items.filter((item) => item.type !== "link").map((item) => {
          const isHome = item.target === "home" || item.target === "about";
          const href = isHome ? internalRoute("/") : internalRoute(`/${item.target}/`);
          const active = isHome ? pathname === "/academic/" || pathname === "/academic" || pathname === "/" : pathname.includes(`/${item.target}`);
          return <Link key={item.target} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} href={href}>{item.title}</Link>;
        })}
      </nav>
      <button className="theme-button" type="button" onClick={toggle} aria-label="Toggle color theme" aria-pressed={dark}>{dark ? "Light" : "Dark"}</button>
    </div>
  </header>;
}
