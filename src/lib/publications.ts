import fs from "node:fs";
import path from "node:path";
import { getSiteConfig, getToml } from "@/lib/content";
import { parseBibTeX } from "@/lib/bibtex";
import type { Publication, PublicationAuthor } from "@/types/publication";

const months: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

function clean(value?: string): string | undefined {
  if (!value) return undefined;
  return value.replace(/^['"]|['"]$/g, "").replace(/[{}]/g, "").replace(/\\textbf\{([^}]*)\}/g, "$1").replace(/\\emph\{([^}]*)\}/g, "$1").replace(/\s+/g, " ").trim();
}

function parseAuthors(value: string, owner: string): PublicationAuthor[] {
  return value.split(/\s+and\s+/i).map((raw) => {
    const equalContribution = raw.includes("*");
    const name = clean(raw.replace(/[*#]/g, "")) ?? "";
    return { name, equalContribution, highlighted: name.toLowerCase().includes(owner.toLowerCase()) };
  }).filter((author) => author.name);
}

export function getPublications(): Publication[] {
  const config = getToml<{ source?: string }>("publications.toml");
  if (config.source !== undefined && typeof config.source !== "string") throw new Error("content/publications.toml: source must be a string");
  const source = config.source || "publications.bib";
  const contentRoot = path.resolve(process.cwd(), "content");
  const filePath = path.resolve(contentRoot, source);
  if (filePath !== contentRoot && !filePath.startsWith(`${contentRoot}${path.sep}`)) throw new Error(`content/publications.toml: source escapes the content directory: ${source}`);
  if (!fs.existsSync(filePath)) throw new Error(`Missing publication source: ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");
  const owner = getSiteConfig().author.name;
  const entries = parseBibTeX(content, filePath) as Array<{ entryType: string; citationKey: string; entryTags: Record<string, string> }>;

  return entries.map((entry) => {
    const tags = entry.entryTags;
    const monthText = tags.month?.toLowerCase();
    const parsedMonth = monthText ? (months[monthText] ?? Number.parseInt(monthText, 10)) : undefined;
    const type = entry.entryType.toLowerCase() === "inproceedings" ? "conference" : entry.entryType.toLowerCase() === "article" ? "journal" : "preprint";
    return {
      id: entry.citationKey,
      title: clean(tags.title) ?? "Untitled publication",
      authors: parseAuthors(tags.author ?? "", owner),
      year: Number.parseInt(tags.year ?? "0", 10) || 0,
      month: Number.isFinite(parsedMonth) ? parsedMonth : undefined,
      venue: clean(tags.journal ?? tags.booktitle),
      type,
      url: clean(tags.url),
      doi: clean(tags.doi),
      code: clean(tags.code),
      pdf: clean(tags.pdf),
      poster: clean(tags.poster),
      slides: clean(tags.slides),
      preview: clean(tags.preview),
      abstract: clean(tags.abstract),
      description: clean(tags.description ?? tags.note),
      selected: ["true", "yes", "1"].includes((tags.selected ?? "").toLowerCase()),
      bibtex: reconstructBibtex(entry),
    } satisfies Publication;
  }).sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
}

function reconstructBibtex(entry: { entryType: string; citationKey: string; entryTags: Record<string, string> }): string {
  const lines = Object.entries(entry.entryTags).filter(([key]) => !["selected", "preview", "description", "code", "pdf", "poster", "slides"].includes(key.toLowerCase())).map(([key, value]) => `  ${key} = {${value}}`);
  return `@${entry.entryType}{${entry.citationKey},\n${lines.join(",\n")}\n}`;
}
