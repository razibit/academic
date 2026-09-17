import fs from "node:fs";
import path from "node:path";

const outputRoot = path.join(process.cwd(), "out");

// Next's static-export compiler requires one generated value for an empty
// dynamic collection. The route renders notFound; remove its compiler-only
// output so an empty collection does not publish a sentinel URL.
for (const relativePath of ["__empty__", path.join("blog", "__empty__")]) {
  const target = path.join(outputRoot, relativePath);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}
