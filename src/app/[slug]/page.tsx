import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/lib/markdown";
import { getPages, internalRoute } from "@/lib/content";

type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const pages = getPages()
    .filter((page) => !["about", "services", "teaching"].includes(page.slug))
    .map((page) => ({ slug: page.slug }));
  return pages.length ? pages : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  if (slug === "__empty__") return {};
  const page = getPages().find((item) => item.slug === slug);
  return page
    ? {
        title: String(page.meta.title ?? page.slug),
        description: page.meta.description ? String(page.meta.description) : undefined,
      }
    : {};
}

export default async function AcademicContentPage({ params }: RouteProps) {
  const { slug } = await params;
  if (slug === "__empty__") notFound();
  const page = getPages().find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <main className="academic-article">
      <Link href={internalRoute("/")}>← Home</Link>
      <h1>{String(page.meta.title ?? page.slug)}</h1>
      {typeof page.meta.description === "string" && <p className="page-description">{page.meta.description}</p>}
      <Markdown content={page.body} />
    </main>
  );
}
