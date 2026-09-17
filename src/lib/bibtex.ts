import { parse as parseBibTeXDocument } from "@retorquere/bibtex-parser";

export type ParsedBibEntry = {
  entryType: string;
  citationKey: string;
  entryTags: Record<string, unknown>;
};

const creatorFields = new Set(["author", "bookauthor", "collaborator", "commentator", "director", "editor", "editora", "editorb", "editors", "holder", "scriptwriter", "translator"]);

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

function stringifyCreator(value: unknown): string {
  if (typeof value !== "object" || value === null) return String(value);
  const record = value as Record<string, unknown>;
  if (typeof record.name === "string" && record.name) return record.name;
  return [record.prefix, record.firstName, record.lastName, record.suffix]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join(" ");
}

function stringifyField(key: string, value: unknown): string {
  if (!Array.isArray(value)) return stringifyCreator(value);
  const separator = creatorFields.has(key.toLowerCase()) ? " and " : ", ";
  return value.map(stringifyCreator).join(separator);
}

export function parseBibTeX(source: string, filePath: string): ParsedBibEntry[] {
  let library: ReturnType<typeof parseBibTeXDocument>;
  try {
    library = parseBibTeXDocument(source, { raw: true, sentenceCase: false });
  } catch (error) {
    throw new Error(`Invalid BibTeX in ${filePath}: ${describeError(error)}`);
  }

  if (library.errors.length) {
    const details = library.errors.map(describeError).join("; ");
    throw new Error(`Invalid BibTeX in ${filePath}: ${details}`);
  }

  return library.entries.map((entry) => ({
    entryType: entry.type,
    citationKey: entry.key,
    entryTags: Object.fromEntries(
      Object.entries(entry.fields).map(([key, value]) => [key.toLowerCase(), stringifyField(key, value)]),
    ),
  }));
}
