declare module "bibtex-parse-js" {
  const parser: { toJSON(input: string): Array<{ entryType: string; citationKey: string; entryTags: Record<string, string> }> };
  export = parser;
}
