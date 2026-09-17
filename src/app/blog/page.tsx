import Link from "next/link";
import { getPosts, internalRoute } from "@/lib/content";

export const metadata = { title: "Blog" };
export default function BlogPage() { const posts = getPosts(); return <main className="academic-page"><h1>Blog</h1><p className="page-description">Long-form research notes and writing.</p><div className="academic-card-list">{posts.length ? posts.map((post) => <article className="academic-card" key={post.slug}><div><p className="eyebrow">{post.meta.date}</p><h2><Link href={internalRoute(`/blog/${post.slug}/`)}>{post.meta.title}</Link></h2><p>{post.meta.description}</p><Link className="card-link" href={internalRoute(`/blog/${post.slug}/`)}>Read post →</Link></div></article>) : <p className="empty-state">Posts will be added as individual Markdown files.</p>}</div></main>; }
