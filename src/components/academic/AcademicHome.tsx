import Link from "next/link";
import { Markdown } from "@/lib/markdown";
import { internalRoute } from "@/lib/content";
import { publicationAsset } from "@/lib/publicationAsset";
import type { ContentDocument, NewsMeta } from "@/lib/content";
import type { Publication } from "@/types/publication";
import NewsFeed from "./NewsFeed";

export default function AcademicHome({
  bio,
  selected,
  news,
}: {
  bio: string;
  selected: Publication[];
  news: ContentDocument<NewsMeta>[];
}) {
  return <main className="main-content home-content">
    <section className="home-intro"><Markdown content={bio} /></section>
    <section className="content-section" aria-labelledby="recent-news"><h3 id="recent-news">Recent News</h3><NewsFeed items={news} /></section>
    <section className="content-section" aria-labelledby="selected-publications">
      <div className="section-heading"><h3 id="selected-publications">Selected Publications</h3><Link href={internalRoute("/publications/")}>View all →</Link></div>
      {selected.length ? <div className="publication-preview">{selected.map((publication) => <PublicationMini key={publication.id} publication={publication} />)}</div> : <p className="empty-state">Verified publications will be added to the BibTeX content file.</p>}
    </section>
  </main>;
}

function PublicationMini({ publication }: { publication: Publication }) {
  return (
    <article className={`publication-mini${publication.preview ? " has-preview" : ""}`}>
      {publication.preview && <img src={publicationAsset(publication, "preview")} alt="" />}
      <div>
        <h3>{publication.title}</h3>
        <p className="authors">{publication.authors.map((author, index) => <span key={author.name}>{index > 0 ? ", " : ""}<span className={author.highlighted ? "author-highlight" : undefined}>{author.name}{author.equalContribution ? "*" : ""}</span></span>)}</p>
        <p className="venue">{publication.venue} · {publication.year}</p>
        {publication.description && <p className="description">{publication.description}</p>}
      </div>
    </article>
  );
}
