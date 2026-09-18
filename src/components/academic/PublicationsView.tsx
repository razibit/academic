'use client';

import { useMemo, useState } from "react";
import { publicationAsset } from "@/lib/publicationAsset";
import type { Publication } from "@/types/publication";

export default function PublicationsView({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const years = useMemo(() => [...new Set(publications.map((item) => item.year))].sort((a, b) => b - a), [publications]);
  const types = useMemo(() => [...new Set(publications.map((item) => item.type))].sort(), [publications]);
  const filtered = publications.filter((publication) => {
    const searchable = `${publication.title} ${publication.authors.map((author) => author.name).join(" ")} ${publication.venue ?? ""} ${publication.abstract ?? ""}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (year === "all" || String(publication.year) === year) && (type === "all" || publication.type === type);
  });

  return <div className="publication-page">
    <div className="publication-controls">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search publications" aria-label="Search publications" />
      <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter by year"><option value="all">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by publication type"><option value="all">All types</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select>
    </div>
    <div className="publication-list" aria-live="polite">
      {filtered.length ? filtered.map((publication) => <article className="publication-item" key={publication.id}>
        {publication.preview && <div className="thumbnail"><img src={publicationAsset(publication, "preview")} alt="" /></div>}
        <div className="publication-details">
          {publication.venue && <span className="conference-name">{publication.venue}</span>}
          <h2 className="paper-title">{publication.title}</h2>
          <p className="authors">{publication.authors.map((author, index) => <span key={author.name}>{index > 0 ? ", " : ""}<span className={author.highlighted ? "author-highlight" : undefined}>{author.name}{author.equalContribution ? "*" : ""}</span></span>)}</p>
          <p className="publication-date">{publication.year}</p>
          {publication.description && <p className="publication-abstract-short">{publication.description}</p>}
          <div className="buttons" aria-label="Publication resources">
            <details className="publication-action"><summary>BibTeX</summary><pre>{publication.bibtex}</pre></details>
            {publication.abstract ? <details className="publication-action"><summary>Abstract</summary><p>{publication.abstract}</p></details> : <button className="publication-action" type="button" disabled>Abstract</button>}
            {publication.pdf ? <a className="publication-action" href={publicationAsset(publication, "pdf")} target="_blank" rel="noreferrer">PDF</a> : <button className="publication-action" type="button" disabled>PDF</button>}
            {publication.code ? <a className="publication-action" href={publication.code} target="_blank" rel="noreferrer">Code</a> : <button className="publication-action" type="button" disabled>Code</button>}
            {publication.dataset ? <a className="publication-action" href={publicationAsset(publication, "dataset")} target="_blank" rel="noreferrer">Dataset</a> : <button className="publication-action" type="button" disabled>Dataset</button>}
            {publication.url && <a className="publication-action" href={publication.url} target="_blank" rel="noreferrer">ArXiv / Paper</a>}
            {publication.doi && <a className="publication-action" href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">DOI</a>}
            {publication.poster && <a className="publication-action" href={publicationAsset(publication, "poster")} target="_blank" rel="noreferrer">Poster</a>}
            {publication.slides && <a className="publication-action" href={publicationAsset(publication, "slides")} target="_blank" rel="noreferrer">Slides</a>}
          </div>
        </div>
      </article>) : <p className="empty-state">No publications match the current filters.</p>}
    </div>
  </div>;
}
