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
      <button className="theme-button" type="button" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark} data-theme-state={dark ? "dark" : "light"}>
        <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
          {dark ? <><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></> : <path d="M20.8 15.4A8.5 8.5 0 0 1 8.6 3.2 8.5 8.5 0 1 0 20.8 15.4Z" fill="currentColor" />}
        </svg>
      </button>
    </div>
  </header>;
}
