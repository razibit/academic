'use client';

import { useMemo, useState } from "react";
import { publicationAsset } from "@/lib/publicationAsset";
import type { Publication } from "@/types/publication";

export default function PublicationsView({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const years = useMemo(
    () => [...new Set(publications.map((item) => item.year))].sort((a, b) => b - a),
    [publications],
  );
  const types = useMemo(
    () => [...new Set(publications.map((item) => item.type))].sort(),
    [publications],
  );
  const filtered = publications.filter((publication) => {
    const searchable = `${publication.title} ${publication.authors.map((author) => author.name).join(" ")} ${publication.venue ?? ""}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (year === "all" || String(publication.year) === year) && (type === "all" || publication.type === type);
  });

  return (
    <div className="publication-page">
      <div className="publication-controls">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search publications" aria-label="Search publications" />
        <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter by year">
          <option value="all">All years</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by publication type">
          <option value="all">All types</option>
          {types.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="publication-list">
        {filtered.length ? filtered.map((publication) => (
          <article className="publication-card" key={publication.id}>
            {publication.preview && <img src={publicationAsset(publication, "preview")} alt="" />}
            <div>
              <h2>{publication.title}</h2>
              <p className="authors">
                {publication.authors.map((author) => (
                  <span key={author.name} className={author.highlighted ? "author-highlight" : undefined}>
                    {author.name}{author.equalContribution ? "*" : ""}
                  </span>
                ))}
              </p>
              <p className="venue">{publication.venue} · {publication.year}</p>
              {publication.description && <p>{publication.description}</p>}
              <div className="card-links">
                {publication.url && <a href={publication.url} target="_blank" rel="noreferrer">arXiv / Paper</a>}
                {publication.doi && <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">DOI</a>}
                {publication.code && <a href={publication.code} target="_blank" rel="noreferrer">Code</a>}
                {publication.pdf && <a href={publicationAsset(publication, "pdf")} target="_blank" rel="noreferrer">PDF</a>}
                {publication.poster && <a href={publicationAsset(publication, "poster")} target="_blank" rel="noreferrer">Poster</a>}
                {publication.slides && <a href={publicationAsset(publication, "slides")} target="_blank" rel="noreferrer">Slides</a>}
              </div>
              {publication.abstract && (
                <details>
                  <summary>Abstract</summary>
                  <p>{publication.abstract}</p>
                </details>
              )}
              <details>
                <summary>BibTeX</summary>
                <pre>{publication.bibtex}</pre>
              </details>
            </div>
          </article>
        )) : <p className="empty-state">No publications match the current filters.</p>}
      </div>
    </div>
  );
}
