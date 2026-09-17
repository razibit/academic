import Link from "next/link";
import { Markdown } from "@/lib/markdown";
import { internalRoute, publicAssetUrl } from "@/lib/content";
import { publicationAsset } from "@/lib/publicationAsset";
import type { ContentDocument, NewsMeta, SiteConfig } from "@/lib/content";
import type { Publication } from "@/types/publication";

export default function AcademicHome({
  config,
  bio,
  researchInterests,
  selected,
  news,
}: {
  config: SiteConfig;
  bio: string;
  researchInterests: string[];
  selected: Publication[];
  news: ContentDocument<NewsMeta>[];
}) {
  return (
    <main className="academic-home">
      <aside className="academic-profile">
        {config.author.avatar ? (
          <img className="academic-avatar" src={publicAssetUrl(config.author.avatar)} alt={`${config.author.name} profile`} />
        ) : (
          <div className="academic-avatar placeholder-avatar" role="img" aria-label="Profile image placeholder">Profile image<br />to add</div>
        )}
        <h1>{config.author.name}</h1>
        <p className="academic-title">{config.author.title}</p>
        {config.author.institution && <p className="academic-institution">{config.author.institution}</p>}
        <div className="academic-links">
          {config.author.email && <a href={`mailto:${config.author.email}`}>Email</a>}
          {config.social?.google_scholar && <a href={config.social.google_scholar} target="_blank" rel="noreferrer">Scholar</a>}
          {config.social?.orcid && <a href={config.social.orcid} target="_blank" rel="noreferrer">ORCID</a>}
          {config.social?.github && <a href={config.social.github} target="_blank" rel="noreferrer">GitHub</a>}
        </div>
        {researchInterests.length > 0 && (
          <section className="interest-box">
            <h2>Research interests</h2>
            {researchInterests.map((interest) => <p key={interest}>{interest}</p>)}
          </section>
        )}
      </aside>
      <div className="academic-main">
        <section className="academic-section">
          <h2>About</h2>
          <Markdown content={bio} />
        </section>
        <section className="academic-section">
          <div className="section-heading"><h2>Selected publications</h2><Link href={internalRoute("/publications/")}>View all →</Link></div>
          {selected.length ? <div className="publication-preview">{selected.map((publication) => <PublicationMini key={publication.id} publication={publication} />)}</div> : <p className="empty-state">Verified publications will be added to the BibTeX content file.</p>}
        </section>
        <section className="academic-section">
          <h2>News</h2>
          {news.length ? (
            <div className="news-list">
              {news.map((item) => (
                <article key={item.slug}>
                  <time dateTime={item.meta.date}>{item.meta.date}</time>
                  {item.meta.title && <h3>{item.meta.title}</h3>}
                  <Markdown content={item.body} />
                </article>
              ))}
            </div>
          ) : <p className="empty-state">News items will be added as individual Markdown files.</p>}
        </section>
      </div>
    </main>
  );
}

function PublicationMini({ publication }: { publication: Publication }) {
  return (
    <article className="publication-mini">
      {publication.preview && <img src={publicationAsset(publication, "preview")} alt="" />}
      <div>
        <h3>{publication.title}</h3>
        <p>{publication.authors.map((author) => <span key={author.name} className={author.highlighted ? "author-highlight" : undefined}>{author.name}{author.equalContribution ? "*" : ""}</span>)}</p>
        <p className="venue">{publication.venue} · {publication.year}</p>
        {publication.description && <p className="description">{publication.description}</p>}
      </div>
    </article>
  );
}
