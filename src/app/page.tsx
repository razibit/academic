import AcademicHome from "@/components/academic/AcademicHome";
import { getNews, getSiteConfig, getToml } from "@/lib/content";
import { readContentFile } from "@/lib/academicContent";
import { getPublications } from "@/lib/publications";

export default function Home() {
  const config = getSiteConfig();
  const about = getToml<{ profile?: { research_interests?: string[] } }>("about.toml");
  const publications = getPublications();
  return <AcademicHome config={config} bio={readContentFile("bio.md")} researchInterests={about.profile?.research_interests ?? []} selected={publications.filter((publication) => publication.selected).slice(0, 10)} news={getNews()} />;
}
