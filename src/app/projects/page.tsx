import ProjectsView from "@/components/academic/ProjectsView";
import { getProjects } from "@/lib/content";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <main className="main-content"><h1>Research & Academic Projects</h1><ProjectsView projects={getProjects()} /></main>;
}
