import AcademicHome from "@/components/academic/AcademicHome";
import { getNews } from "@/lib/content";
import { readContentFile } from "@/lib/academicContent";
import { getPublications } from "@/lib/publications";

export default function Home() {
  const publications = getPublications();
  return <AcademicHome bio={readContentFile("bio.md")} selected={publications.filter((publication) => publication.selected).slice(0, 10)} news={getNews()} />;
}
