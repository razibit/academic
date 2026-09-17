import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseToml } from "smol-toml";

export { internalRoute, publicAssetUrl, routeUrl } from "./routes";

export type ContentMeta = Record<string, unknown>;

export interface ContentDocument<T extends ContentMeta = ContentMeta> {
  slug: string;
  filePath: string;
  meta: T;
  body: string;
}

export interface NavigationItem {
  title: string;
  type: "section" | "page" | "link";
  target: string;
  href: string;
}

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    favicon?: string;
    last_updated?: string;
  };
  author: {
    name: string;
    title: string;
    institution?: string;
    avatar?: string;
    introduction?: string;
    positioning?: string;
    email?: string;
    resume_url?: string;
  };
  social?: Record<string, string | undefined>;
  features?: Record<string, boolean | undefined>;
  navigation: NavigationItem[];
}

export interface ProjectMeta extends ContentMeta {
  title: string;
  label?: string;
  summary?: string;
  role?: string;
  contribution?: string;
  stack?: string | string[];
  outcome?: string;
  image?: string;
  link?: string;
  repository?: string;
  demo?: string;
  featured?: boolean;
}

export interface ExperienceMeta extends ContentMeta {
  title: string;
  company?: string;
  dates?: string;
  summary?: string;
  featured?: boolean;
}

export interface MaterialMeta extends ContentMeta {
  title: string;
  type?: string;
  date?: string;
  description?: string;
  image?: string;
  link?: string;
  download?: string;
  tags?: string[];
}

export interface PostMeta extends ContentMeta {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  image?: string;
}

export interface NewsMeta extends ContentMeta {
  title?: string;
  date: string;
  tags?: string[];
  published?: boolean;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export function getSiteConfig(): SiteConfig {
  const filePath = path.join(CONTENT_DIR, "config.toml");
  if (!fs.existsSync(filePath)) throw new Error(`Missing required content file: ${filePath}`);
  try {
    return parseToml(fs.readFileSync(filePath, "utf8")) as unknown as SiteConfig;
  } catch (error) {
    throw new Error(`Invalid TOML in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getToml<T>(relativePath: string): T {
  const filePath = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Missing content file: ${filePath}`);
  try {
    return parseToml(fs.readFileSync(filePath, "utf8")) as unknown as T;
  } catch (error) {
    throw new Error(`Invalid TOML in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getMarkdownPage(slug: string): ContentDocument {
  const filePath = path.join(CONTENT_DIR, "pages", `${slug}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`Missing page content: ${filePath}`);
  return readMarkdownDocument(filePath);
}

export function readMarkdownDocument(filePath: string): ContentDocument {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid Markdown front matter in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const meta = parsed.data as ContentMeta;
  if (meta.date instanceof Date) meta.date = meta.date.toISOString().slice(0, 10);
  if (typeof meta.date === "number") meta.date = String(meta.date);
  if (typeof meta.dates === "number") meta.dates = String(meta.dates);
  return {
    slug: path.basename(filePath, path.extname(filePath)),
    filePath,
    meta,
    body: parsed.content.trim(),
  };
}

export function getCollection<T extends ContentMeta>(collection: string): ContentDocument<T>[] {
  const directory = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readMarkdownDocument(path.join(directory, entry.name)) as ContentDocument<T>)
    .sort((a, b) => {
      const aDate = String(a.meta.date ?? "");
      const bDate = String(b.meta.date ?? "");
      return bDate.localeCompare(aDate) || a.slug.localeCompare(b.slug);
    });
}

export function getPosts(): ContentDocument<PostMeta>[] {
  return getCollection<PostMeta>("posts").filter((post) => post.meta.published !== false);
}

export function getPost(slug: string): ContentDocument<PostMeta> | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getNews(): ContentDocument<NewsMeta>[] {
  return getCollection<NewsMeta>("news").filter((item) => item.meta.published !== false);
}

export function getProjects(): ContentDocument<ProjectMeta>[] {
  return getCollection<ProjectMeta>("projects");
}

export function getExperience(): ContentDocument<ExperienceMeta>[] {
  return getCollection<ExperienceMeta>("experience");
}

export function getMaterials(): ContentDocument<MaterialMeta>[] {
  return getCollection<MaterialMeta>("materials");
}

export function getPages(): ContentDocument[] {
  const directory = path.join(CONTENT_DIR, "pages");
  if (!fs.existsSync(directory)) return [];
  return getCollectionFromDirectory(directory);
}

function getCollectionFromDirectory(directory: string): ContentDocument[] {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readMarkdownDocument(path.join(directory, entry.name)));
}

export function publicAssetExists(assetPath: string): boolean {
  if (!assetPath || assetPath.startsWith("http://") || assetPath.startsWith("https://")) return true;
  const normalized = assetPath.replace(/^\//, "");
  const publicRoot = path.resolve(PUBLIC_DIR);
  const candidate = path.resolve(publicRoot, normalized);
  if (candidate !== publicRoot && !candidate.startsWith(`${publicRoot}${path.sep}`)) return false;
  return fs.existsSync(candidate);
}

export function contentDirectory(): string {
  return CONTENT_DIR;
}
