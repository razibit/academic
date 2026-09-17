import fs from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { z } from "zod";
import { parseBibTeX } from "../src/lib/bibtex";
import {
  contentDirectory,
  getCollection,
  getExperience,
  getMaterials,
  getPages,
  getProjects,
  getSiteConfig,
  publicAssetExists,
} from "../src/lib/content";

const errors: string[] = [];
const contentRoot = path.resolve(contentDirectory());
const title = z.string().min(1);
const date = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "must use YYYY, YYYY-MM, or YYYY-MM-DD");
const optionalFields = {
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  download: z.string().optional(),
};

function reportZod(prefix: string, result: z.SafeParseError<unknown>) {
  for (const issue of result.error.issues) {
    errors.push(`${prefix}: ${issue.path.join(".") || "front matter"} ${issue.message}`);
  }
}

function checkDocs(
  collection: string,
  docs: Array<{ slug: string; filePath: string; meta: Record<string, unknown>; body: string }>,
  schema: z.ZodTypeAny,
) {
  const slugs = new Set<string>();
  for (const doc of docs) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(doc.slug)) {
      errors.push(`${collection}/${doc.slug}: filename must produce a lowercase kebab-case slug`);
    }
    if (slugs.has(doc.slug)) errors.push(`${collection}/${doc.slug}: duplicate slug`);
    slugs.add(doc.slug);

    const result = schema.safeParse(doc.meta);
    if (!result.success) reportZod(`${collection}/${doc.slug}`, result);

    for (const key of ["image", "download"]) {
      const value = doc.meta[key];
      if (value !== undefined && typeof value !== "string") continue;
      if (typeof value === "string" && value) checkLocalAsset(`${collection}/${doc.slug}.${key}`, value);
    }

    const imagePattern = /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/g;
    for (const match of doc.body.matchAll(imagePattern)) {
      const value = match[1] ?? match[2];
      if (value) checkLocalAsset(`${collection}/${doc.slug} body image`, value);
    }
  }
}

function checkLocalAsset(label: string, value: string) {
  if (/^https?:\/\//.test(value)) return;
  if (!value.startsWith("/")) {
    errors.push(`${label}: local asset path must start with /`);
    return;
  }
  if (!publicAssetExists(value)) errors.push(`${label}: missing public asset ${value}`);
}

function readTomlRecord(relativePath: string, required: boolean): Record<string, unknown> | undefined {
  const filePath = path.join(contentRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    if (required) errors.push(`Missing required content file: ${filePath}`);
    return undefined;
  }
  try {
    return parseToml(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
  } catch (error) {
    errors.push(`Invalid TOML in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function checkConfigAssets(config: Record<string, unknown>) {
  const site = config.site as Record<string, unknown> | undefined;
  const author = config.author as Record<string, unknown> | undefined;
  for (const [label, value] of [
    ["site.favicon", site?.favicon],
    ["author.avatar", author?.avatar],
    ["author.resume_url", author?.resume_url],
  ] as const) {
    if (typeof value === "string" && value) checkLocalAsset(`content/config.toml ${label}`, value);
  }
}

function checkPublications() {
  const publicationConfig = readTomlRecord("publications.toml", false);
  const sourceValue = publicationConfig?.source;
  if (sourceValue !== undefined && typeof sourceValue !== "string") {
    errors.push("content/publications.toml: source must be a string");
    return;
  }

  const source = sourceValue || "publications.bib";
  const bibPath = path.resolve(contentRoot, source);
  if (bibPath !== contentRoot && !bibPath.startsWith(`${contentRoot}${path.sep}`)) {
    errors.push(`content/publications.toml: source escapes the content directory: ${source}`);
    return;
  }
  if (!fs.existsSync(bibPath)) {
    if (fs.existsSync(path.join(contentRoot, "publications.bib")) || publicationConfig) {
      errors.push(`Missing publication source: ${bibPath}`);
    }
    return;
  }

  let entries: Array<{ entryType?: string; citationKey?: string; entryTags?: Record<string, unknown> }>;
  try {
    entries = parseBibTeX(fs.readFileSync(bibPath, "utf8"), bibPath) as typeof entries;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return;
  }

  const keys = new Set<string>();
  for (const entry of entries) {
    const key = String(entry.citationKey ?? "").trim();
    const prefix = `publications.bib/${key || "entry"}`;
    if (!key) errors.push(`${prefix}: citation key is required`);
    if (keys.has(key)) errors.push(`${prefix}: duplicate citation key`);
    keys.add(key);

    const tags = entry.entryTags ?? {};
    for (const field of ["title", "author", "year"]) {
      const value = String(tags[field] ?? "").trim();
      if (!value) errors.push(`${prefix}: ${field} is required`);
    }
    const year = String(tags.year ?? "").replace(/[{}"]/g, "").trim();
    if (year && !/^\d{4}$/.test(year)) errors.push(`${prefix}: year must be YYYY`);

    for (const field of ["preview", "pdf", "poster", "slides"]) {
      const value = tags[field];
      if (value === undefined || value === "") continue;
      if (typeof value !== "string") {
        errors.push(`${prefix}: ${field} must be a string`);
        continue;
      }
      checkLocalAsset(`${prefix}.${field}`, value.startsWith("/") ? value : `/papers/${value}`);
    }
    if (tags.selected !== undefined && !["true", "false", "yes", "no", "1", "0"].includes(String(tags.selected).toLowerCase())) {
      errors.push(`${prefix}: selected must be true/false, yes/no, or 1/0`);
    }
  }
}

try {
  const config = getSiteConfig() as unknown as Record<string, unknown>;
  const configSchema = z.object({
    site: z.object({ title, description: z.string().min(1) }),
    author: z.object({ name: z.string().min(1), title: z.string().min(1) }),
    navigation: z.array(z.object({
      title: z.string().min(1),
      type: z.enum(["section", "page", "link"]),
      target: z.string().min(1),
      href: z.string().min(1),
    })),
  });
  const configResult = configSchema.safeParse(config);
  if (!configResult.success) reportZod("content/config.toml", configResult);
  checkConfigAssets(config);

  const navigation = Array.isArray(config.navigation) ? config.navigation as Array<Record<string, unknown>> : [];
  const targets = new Set<string>();
  for (const item of navigation) {
    const target = String(item.target ?? "");
    if (targets.has(target)) errors.push(`content/config.toml: duplicate navigation target ${target}`);
    targets.add(target);
  }

  for (const directory of ["pages", "posts", "news", "projects", "experience", "materials"]) {
    if (!fs.existsSync(path.join(contentRoot, directory))) errors.push(`Missing content directory: ${path.join(contentRoot, directory)}`);
  }

  const profileFile = fs.existsSync(path.join(contentRoot, "bio.md")) ? "bio.md" : "about.md";
  if (!fs.existsSync(path.join(contentRoot, profileFile))) errors.push(`Missing required content file: ${path.join(contentRoot, profileFile)}`);
  const skills = readTomlRecord("skills.toml", true);
  if (skills) {
    if (skills.note !== undefined && typeof skills.note !== "string") errors.push("content/skills.toml: note must be a string");
    if (!Array.isArray(skills.groups)) {
      errors.push("content/skills.toml: groups must be an array");
    } else {
      for (const [index, group] of (skills.groups as unknown[]).entries()) {
        if (!group || typeof group !== "object") {
          errors.push(`content/skills.toml: groups[${index}] must be a table`);
          continue;
        }
        const record = group as Record<string, unknown>;
        if (typeof record.name !== "string" || !record.name) errors.push(`content/skills.toml: groups[${index}].name is required`);
        if (!Array.isArray(record.items) || (record.items as unknown[]).some((item) => typeof item !== "string")) errors.push(`content/skills.toml: groups[${index}].items must be an array of strings`);
      }
    }
  }

  checkDocs("posts", getCollection("posts"), z.object({ title, date, ...optionalFields }).passthrough());
  checkDocs("news", getCollection("news"), z.object({ title: title.optional(), date, ...optionalFields }).passthrough());
  checkDocs("projects", getProjects(), z.object({ title, role: z.string().optional(), contribution: z.string().optional(), stack: z.union([z.string(), z.array(z.string())]).optional(), outcome: z.string().optional(), ...optionalFields }).passthrough());
  checkDocs("experience", getExperience(), z.object({ title, dates: z.string().optional(), summary: z.string().optional(), ...optionalFields }).passthrough());
  checkDocs("materials", getMaterials(), z.object({ title, type: z.string().optional(), date: date.optional(), ...optionalFields }).passthrough());
  checkDocs("pages", getPages(), z.object({ title, ...optionalFields }).passthrough());

  const teachingDirectory = path.join(contentRoot, "teaching");
  if (fs.existsSync(teachingDirectory)) {
    checkDocs("teaching", getCollection("teaching"), z.object({ title, date: date.optional(), ...optionalFields }).passthrough());
  }

  readTomlRecord("about.toml", false);
  checkPublications();
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Content validation passed.");
