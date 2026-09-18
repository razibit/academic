import PublicationsView from "@/components/academic/PublicationsView";
import { getToml } from "@/lib/content";
import { getPublications } from "@/lib/publications";

type PublicationsPageConfig = {
  title?: string;
  description?: string;
};

function getPageConfig() {
  return getToml<PublicationsPageConfig>("publications.toml");
}

export function generateMetadata() {
  const page = getPageConfig();
  return { title: page.title ?? "Publications" };
}

export default function PublicationsPage() {
  const page = getPageConfig();
  const title = page.title ?? "Publications";
  const description = page.description ?? "Research publications and preprints.";

  return (
    <main className="main-content">
      <div className="page-heading">
        <div className="page-heading-copy"><h1>{title}</h1><p className="page-description">{description}</p></div>
        <PublicationsView publications={getPublications()} />
      </div>
    </main>
  );
}
