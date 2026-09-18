'use client';

import { useMemo, useState } from "react";
import { Markdown } from "@/lib/markdown";
import type { ContentDocument, NewsMeta } from "@/lib/content";

function displayDate(item: ContentDocument<NewsMeta>) {
  if (item.meta.display_date) return item.meta.display_date;
  const [year, month] = item.meta.date.split("-");
  if (!month) return year;
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${year}-${month}-01T00:00:00Z`));
}

export default function NewsFeed({ items }: { items: ContentDocument<NewsMeta>[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = useMemo(() => expanded ? items : items.slice(0, 5), [expanded, items]);
  if (!items.length) return <p className="empty-state">News items will be added as individual Markdown files.</p>;
  return <>
    <ul className="news-list" id="news-list">
      {visibleItems.map((item) => <li className="news-item" key={item.slug}>
        <span className="news-date">{displayDate(item)}</span>
        <Markdown content={item.body} className="news-copy" />
      </li>)}
    </ul>
    {items.length > 5 && <p className="full-news-toggle"><button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls="news-list"><i>{expanded ? "[Collapse News]" : "[Full list of News]"}</i></button></p>}
  </>;
}
