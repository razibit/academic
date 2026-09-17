# Academic portfolio content guide

The academic portfolio is a statically generated Next.js site deployed at `/academic`. Ordinary updates are made in `content/` and `public/`; application code does not need to change for normal additions, edits, or removals.

## Where to edit

| Change | Authoring file | Result |
| --- | --- | --- |
| Profile, links, navigation, site identity | `content/config.toml` | Header, profile card, metadata, navigation |
| Biography | `content/bio.md` | Homepage About section |
| Research interests | `content/about.toml` | Homepage research-interest box |
| Publication | `content/publications.bib` | `/academic/publications/` and selected homepage cards |
| Publication source selection | `content/publications.toml` | Chooses the BibTeX file below `content/` |
| Blog post | `content/posts/YYYY-MM-DD-<slug>.md` | `/academic/blog/` and dated detail route |
| News item | `content/news/YYYY-MM-DD-<slug>.md` | Homepage News section |
| Material/resource | `content/materials/<slug>.md` | `/academic/materials/` |
| Teaching item | `content/teaching/<slug>.md` | Teaching materials cards |
| Teaching and service page text | `content/pages/teaching.md`, `services.md` | `/academic/teaching/`, `/academic/services/` |
| Additional Markdown page | `content/pages/<slug>.md` | `/academic/<slug>/` |
| Skills | `content/skills.toml` | Shared content surface for future academic skill sections |

Delete the corresponding content file to remove an item on the next build. Set `published: false` to keep a blog or news file validated but hidden.

## Markdown files

Filenames become stable URL slugs. Use YAML front matter between `---` lines and GitHub-Flavored Markdown in the body.

```markdown
---
title: Research note
date: 2026-09-18
description: Short summary shown in the index.
tags:
  - Research
published: true
image: /images/note-cover.png
link: https://example.org/resource
download: /files/notes.pdf
---

Markdown body with links, tables, task lists, code, and images.
```

Posts use the front-matter date for ordering and the filename for the `/academic/blog/<slug>/` URL. Material and teaching cards support optional images, external links, and local downloads. Local assets must exist below `public/` and use a root-relative authored path such as `/images/figure.png`; the application automatically adds `/academic`.

## Publications

Add one verified entry per paper to `content/publications.bib`. The configured `source` in `content/publications.toml` must stay inside `content/`.

```bibtex
@article{example2026,
  author = {Razib and Collaborator},
  title = {Verified publication title},
  journal = {Journal or venue},
  year = {2026},
  abstract = {Optional abstract shown in the expandable card.},
  selected = {true},
  preview = {example-preview.png},
  pdf = {example-paper.pdf},
  poster = {example-poster.pdf},
  slides = {example-slides.pdf},
  doi = {10.0000/example},
  url = {https://arxiv.org/abs/example},
  code = {https://github.com/example/repository}
}
```

Required fields are `author`, `title`, and `year`. `selected = {true}` places the entry on the homepage. Local publication assets named `example-paper.pdf` are resolved from `public/papers/example-paper.pdf`; a value beginning with `/` is treated as an authored public path, and full `https://` values remain external. Publication cards provide search, year/type filters, venue sorting, abstracts, BibTeX, arXiv/URL, DOI, code, PDF, poster, and slides links when those fields exist.

The author name from `config.toml` is highlighted in author lists. Use an asterisk in an author name for equal contribution, for example `Razib*`.

## TOML files

`config.toml` owns site identity, profile links, and navigation. Keep internal targets route-relative (`/publications/`, `/blog/`); the application automatically prefixes generated internal links and assets with `/academic`.

`about.toml` and `skills.toml` use normal TOML tables. Research interests are an array:

```toml
[profile]
research_interests = ["Verified research area"]
```

## Validation and local build

From the academic repository root:

```powershell
npm ci
npm run validate-content
npm run build
```

Validation reports file/field errors for front matter, TOML, BibTeX, duplicate slugs/keys, invalid publication fields, and missing local images/PDFs/posters/slides/downloads. The static output is written to `out/`; generated URLs and assets include `/academic`. GitHub Actions runs validation and the build with Node.js 22 before deployment.

The preserved `JiayiGeng.github.io/` directory is local reference material only. It is ignored by this repository, is not imported by the application, and is not included in the generated output.

