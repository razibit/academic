import { Markdown } from "@/lib/markdown";
import type { ContentDocument, ExperienceMeta } from "@/lib/content";

export default function ExperienceView({ entries }: { entries: ContentDocument<ExperienceMeta>[] }) {
  const groups = [...new Set(entries.map((entry) => entry.meta.category ?? "Experience"))];
  return <div className="experience-list">
    {groups.map((group) => <section className="experience-section" key={group}><h2>{group}</h2>{entries.filter((entry) => (entry.meta.category ?? "Experience") === group).map((entry) => <article className="experience-item" key={entry.slug}>
      <div className="experience-timeline">{entry.meta.dates}</div>
      <div className="experience-content"><div className="experience-org">{entry.meta.organization ?? entry.meta.company}</div><div className="experience-position">{entry.meta.position ?? entry.meta.title}</div><Markdown content={entry.body} className="experience-description" /></div>
    </article>)}</section>)}
    {!entries.length && <p className="empty-state">Experience will be added as individual Markdown files.</p>}
  </div>;
}
