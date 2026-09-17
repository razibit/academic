import type { Metadata } from "next";
import "./globals.css";
import AcademicNav from "@/components/academic/AcademicNav";
import { getSiteConfig, routeUrl } from "@/lib/content";

const config = getSiteConfig();

export const metadata: Metadata = { title: { default: config.site.title, template: `%s | ${config.site.title}` }, description: config.site.description, icons: config.site.favicon ? routeUrl(config.site.favicon) : undefined };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(() => { let t = null; try { t = localStorage.getItem('academic-theme'); } catch {} const dark = t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; })();` }} /></head><body><a className="skip-link" href="#main-content">Skip to content</a><AcademicNav items={config.navigation} title={config.site.title} /><div id="main-content" className="academic-shell">{children}</div><footer className="academic-footer">Last updated: {config.site.last_updated ?? ""}</footer></body></html>;
}
