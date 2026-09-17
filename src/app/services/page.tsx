import { Markdown } from "@/lib/markdown";
import { getMarkdownPage } from "@/lib/content";

export const metadata = { title: "Services" };
export default function ServicesPage() { return <main className="academic-page"><h1>Services</h1><Markdown content={getMarkdownPage("services").body} /></main>; }
