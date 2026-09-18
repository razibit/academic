import { publicAssetUrl, type ContentDocument, type CvMeta } from "@/lib/content";
import { Markdown } from "@/lib/markdown";

export default function CvView({ page }: { page: ContentDocument<CvMeta> }) {
  return <div className="cv-container">
    {page.meta.embed_url && <iframe src={page.meta.embed_url} className="gde-frame" title={`${page.meta.title} embedded document`} loading="lazy" />}
    <Markdown content={page.body} />
    {page.meta.download && <div className="cv-download"><a href={publicAssetUrl(page.meta.download)} download>Download CV (PDF)</a></div>}
  </div>;
}
