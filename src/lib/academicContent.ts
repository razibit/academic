import fs from "node:fs";
import path from "node:path";

export function readContentFile(relativePath: string): string {
  const filePath = path.join(process.cwd(), "content", relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").trim() : "";
}
