# Academic portfolio

This repository contains the academic portfolio as a content-driven Next.js static site deployed at `razibit.github.io/academic`. Its presentation follows the supplied Academic Portfolio v2.0 layout while its authoring surface remains Markdown, TOML, and BibTeX files.

Edit [CONTENT_GUIDE.md](CONTENT_GUIDE.md) and files under `content/` to add or remove biographies, news, blog posts, projects, experience, education, teaching/material cards, and verified publications. The preserved `JiayiGeng.github.io/` directory is ignored local reference material and is never imported or published.

Requires Node.js 22 or newer:

```powershell
npm ci
npm run dev
npm run validate-content
npm run build
```

During local development, open http://localhost:3000/academic/. The static export is written to `out/`. GitHub Actions validates and builds the `main` branch before deploying the academic site.
