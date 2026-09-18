import { Markdown } from "@/lib/markdown";
import type { ContentDocument, AwardMeta } from "@/lib/content";

export default function AwardsView({ awards }: { awards: ContentDocument<AwardMeta>[] }) {
  const groups = [...new Set(awards.map((award) => award.meta.category ?? "Honors & Awards"))];
  return <div className="awards-list">
    {groups.map((group) => <section className="awards-section" key={group}><h2>{group}</h2>{awards.filter((award) => (award.meta.category ?? "Honors & Awards") === group).map((award) => <article className="award-item" key={award.slug}>
      <div className="award-title">{award.meta.title}</div><div className="award-org">{award.meta.organization}</div><div className="award-date">{award.meta.date}</div><Markdown content={award.body} className="award-description" />
    </article>)}</section>)}
    {!awards.length && <p className="empty-state">Honors and awards will be added as individual Markdown files.</p>}
  </div>;
}
