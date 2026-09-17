import { Markdown } from "@/lib/markdown";
import { publicAssetUrl, type ContentDocument, type MaterialMeta } from "@/lib/content";

export default function AcademicCollection({ title, description, items, emptyMessage, asSection = false }: { title: string; description?: string; items: ContentDocument<MaterialMeta>[]; emptyMessage: string; asSection?: boolean }) {
  const Wrapper = asSection ? "section" : "main";
  const Heading = asSection ? "h2" : "h1";

  return <Wrapper className="academic-page"><Heading>{title}</Heading>{description && <p className="page-description">{description}</p>}<div className="academic-card-list">{items.length ? items.map((item) => <article className="academic-card" id={item.slug} key={item.slug}>{item.meta.image && <img src={publicAssetUrl(item.meta.image)} alt="" /> }<div><p className="eyebrow">{item.meta.type ?? "Material"}{item.meta.date ? ` · ${item.meta.date}` : ""}</p><h2>{item.meta.title}</h2>{item.meta.description && <p>{item.meta.description}</p>}<Markdown content={item.body} />{item.meta.link && <a className="card-link" href={item.meta.link} target="_blank" rel="noreferrer">Open resource →</a>}{item.meta.download && <a className="card-link" href={publicAssetUrl(item.meta.download)} download>Download →</a>}</div></article>) : <p className="empty-state">{emptyMessage}</p>}</div></Wrapper>;
}
