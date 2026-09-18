import type { Metadata } from "next";
import "./globals.css";
import AcademicNav from "@/components/academic/AcademicNav";
import AcademicSidebar from "@/components/academic/AcademicSidebar";
import { getPosts, getSiteConfig, getToml, routeUrl } from "@/lib/content";
import type { AcademicAbout } from "@/types/content";

const config = getSiteConfig();
const about = getToml<AcademicAbout>("about.toml");

export const metadata: Metadata = { title: { default: config.site.title, template: `%s | ${config.site.title}` }, description: config.site.description, icons: config.site.favicon ? routeUrl(config.site.favicon) : undefined };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const blogPosts = getPosts();
  const blogCategories = [...new Set(blogPosts.flatMap((item) => item.meta.tags ?? []))].sort();
  const blogYears = [...new Set(blogPosts.map((item) => String(item.meta.date).slice(0, 4)))].sort((a, b) => b.localeCompare(a));
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(() => { let t = null; try { t = localStorage.getItem('academic-theme'); } catch {} const dark = t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; })();` }} /></head><body><a className="skip-link" href="#main-content">Skip to content</a><AcademicNav items={config.navigation} title={config.site.title} /><div id="main-content" className="academic-shell"><div className="academic-layout"><AcademicSidebar config={config} researchInterests={about.profile?.research_interests ?? []} spotlight={about.profile?.spotlight ?? []} blogCategories={blogCategories} blogYears={blogYears} />{children}</div></div><footer className="academic-footer"><p>© 2024 Rajib Dab | Last Update: August 2024</p></footer></body></html>;
}
