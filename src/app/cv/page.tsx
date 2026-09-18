import CvView from "@/components/academic/CvView";
import { getMarkdownPage } from "@/lib/content";
import type { CvMeta } from "@/lib/content";

export const metadata = { title: "Curriculum Vitae" };

export default function CvPage() {
  return <main className="main-content"><h1>Curriculum Vitae</h1><CvView page={getMarkdownPage("cv") as ReturnType<typeof getMarkdownPage> & { meta: CvMeta }} /></main>;
}
