'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { internalRoute, publicAssetUrl } from "@/lib/routes";
import type { ContentDocument, PostMeta } from "@/lib/content";

function initialFilters() {
  if (typeof window === "undefined") return { tag: "all", year: "all" };
  const params = new URLSearchParams(window.location.search);
  return { tag: params.get("tag") ?? "all", year: params.get("year") ?? "all" };
}

export default function BlogView({ posts }: { posts: ContentDocument<PostMeta>[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [year, setYear] = useState("all");
  useEffect(() => {
    const filters = initialFilters();
    setTag(filters.tag);
    setYear(filters.year);
  }, []);
  const categories = useMemo(() => [...new Set(posts.flatMap((post) => post.meta.tags ?? []))].sort(), [posts]);
  const years = useMemo(() => [...new Set(posts.map((post) => post.meta.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a)), [posts]);
  const filtered = posts.filter((post) => {
    const text = `${post.meta.title} ${post.meta.description ?? ""} ${(post.meta.tags ?? []).join(" ")} ${post.body}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (tag === "all" || (post.meta.tags ?? []).includes(tag)) && (year === "all" || post.meta.date.startsWith(year));
  });

  return <div className="blog-view">
    <form className="blog-search" onSubmit={(event) => event.preventDefault()}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search blog posts..." aria-label="Search blog posts" />
      <button type="submit" aria-label="Search">⌕</button>
    </form>
    <div className="blog-filter-row" aria-label="Filter blog posts">
      <button className={tag === "all" ? "active" : undefined} type="button" onClick={() => setTag("all")}>All</button>
      {categories.map((category) => <button className={tag === category ? "active" : undefined} type="button" key={category} onClick={() => setTag(category)}>{category}</button>)}
      {years.map((item) => <button className={year === item ? "active" : undefined} type="button" key={item} onClick={() => setYear(year === item ? "all" : item)}>{item}</button>)}
    </div>
    <div className="blog-posts" aria-live="polite">
      {filtered.length ? filtered.map((post) => <article className="blog-post" key={post.slug}>
        <h2 className="post-title"><Link href={internalRoute(`/blog/${post.slug}/`)}>{post.meta.title}</Link></h2>
        <div className="post-meta"><span className="post-date">{post.meta.date}</span>{(post.meta.tags ?? []).map((item) => <span className="post-category" key={item}>{item}</span>)}</div>
        {post.meta.image && <div className="post-image"><img src={publicAssetUrl(post.meta.image)} alt="" loading="lazy" /></div>}
        {post.meta.description && <p className="post-excerpt">{post.meta.description}</p>}
        <Link className="read-more" href={internalRoute(`/blog/${post.slug}/`)}>Read More</Link>
      </article>) : <p className="empty-state">No blog posts match the current filters.</p>}
    </div>
  </div>;
}
