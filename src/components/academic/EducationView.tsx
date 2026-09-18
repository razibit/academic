import { publicAssetUrl, type ContentDocument, type EducationMeta } from "@/lib/content";
import { Markdown } from "@/lib/markdown";

export default function EducationView({ entries }: { entries: ContentDocument<EducationMeta>[] }) {
  return <div className="education-timeline">
    {entries.length ? entries.map((entry) => <article className="education-card" key={entry.slug}>
      <div className="education-header">{entry.meta.logo && <img src={publicAssetUrl(entry.meta.logo)} alt={`${entry.meta.title} logo`} className="education-logo" />}<div className="education-details"><h2>{entry.meta.title}</h2><span className="education-period">{entry.meta.period}</span><p>{entry.meta.degree}</p></div></div>
      {entry.meta.gpa && <div className="education-gpa">CGPA: <b>{entry.meta.gpa}</b>{entry.meta.transcript && <a className="transcript-link" href={entry.meta.transcript} target="_blank" rel="noreferrer"> (Transcript)</a>}</div>}
      {entry.body && <Markdown content={entry.body} className="education-note" />}
    </article>) : <p className="empty-state">Education entries will be added as individual Markdown files.</p>}
  </div>;
}
