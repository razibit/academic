import AcademicCollection from "@/components/academic/AcademicCollection";
import { getCollection, getMarkdownPage } from "@/lib/content";
import { Markdown } from "@/lib/markdown";
import type { MaterialMeta } from "@/lib/content";

export const metadata = { title: "Teaching" };
export default function TeachingPage() { const items = getCollection<MaterialMeta>("teaching"); return <main className="academic-page"><h1>Teaching</h1><Markdown content={getMarkdownPage("teaching").body} /><AcademicCollection asSection title="Teaching materials" items={items} emptyMessage="Teaching entries will be added as individual content files." /></main>; }
