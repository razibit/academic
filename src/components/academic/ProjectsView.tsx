'use client';

import { useMemo, useState } from "react";
import { publicAssetUrl } from "@/lib/routes";
import type { ContentDocument, ProjectMeta } from "@/lib/content";
import { Markdown } from "@/lib/markdown";

function values(value?: string | string[]) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function categories(project: ContentDocument<ProjectMeta>) {
  return values(project.meta.category ?? project.meta.tags).flatMap((value) => value.split(",").map((item) => item.trim()).filter(Boolean));
}

export default function ProjectsView({ projects }: { projects: ContentDocument<ProjectMeta>[] }) {
  const categoryNames = useMemo(() => [...new Set(projects.flatMap(categories))].sort(), [projects]);
  const [filter, setFilter] = useState("all");
  const filtered = projects.filter((project) => filter === "all" || categories(project).includes(filter));

  return <div className="projects-view">
      {categoryNames.length > 0 && <div className="project-filters" aria-label="Filter projects">
      <button className={filter === "all" ? "active" : undefined} type="button" onClick={() => setFilter("all")}>All</button>
      {categoryNames.map((category) => <button className={filter === category ? "active" : undefined} type="button" key={category} onClick={() => setFilter(category)}>{category}</button>)}
    </div>}
    <div className="project-list" aria-live="polite">
      {filtered.length ? filtered.map((project) => <article className="project-item" key={project.slug}>
        <h2>{project.meta.title}</h2>
        <div className="project-meta"><span className="project-date">{String(project.meta.date ?? "")}</span>{project.meta.category && <span className="project-category">{project.meta.category}</span>}</div>
        {project.meta.image && <img className="project-image" src={publicAssetUrl(project.meta.image)} alt="" />}
        <Markdown content={project.body} />
        {project.meta.role && <p className="project-detail"><strong>Role:</strong> {project.meta.role}</p>}
        {project.meta.contribution && <p className="project-detail"><strong>Contribution:</strong> {project.meta.contribution}</p>}
        {(project.meta.repository || project.meta.link || project.meta.demo) && <div className="project-links">
          {project.meta.link && <a className="project-link" href={project.meta.link} target="_blank" rel="noreferrer">Project Page</a>}
          {project.meta.repository && <a className="project-link" href={project.meta.repository} target="_blank" rel="noreferrer">GitHub</a>}
          {project.meta.demo && <a className="project-link" href={project.meta.demo} target="_blank" rel="noreferrer">Demo</a>}
        </div>}
        {values(project.meta.stack).length > 0 && <div className="project-tech-stack">{values(project.meta.stack).map((technology) => <span className="tech-tag" key={technology}>{technology}</span>)}</div>}
      </article>) : <p className="empty-state">Projects will be added as individual Markdown files.</p>}
    </div>
  </div>;
}
