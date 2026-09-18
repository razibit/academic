import BlogView from "@/components/academic/BlogView";
import { getPosts } from "@/lib/content";

export const metadata = { title: "Blog" };
export default function BlogPage() { return <main className="main-content"><h1>Blog</h1><BlogView posts={getPosts()} /></main>; }
