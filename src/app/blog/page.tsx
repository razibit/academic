import BlogView from "@/components/academic/BlogView";
import { getPosts } from "@/lib/content";

export const metadata = { title: "Blog" };
export default function BlogPage() { return <main className="main-content"><div className="page-heading"><h1>Blog</h1><BlogView posts={getPosts()} /></div></main>; }
