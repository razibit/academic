import ExperienceView from "@/components/academic/ExperienceView";
import { getExperience } from "@/lib/content";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <main className="main-content"><h1>Professional Experience</h1><ExperienceView entries={getExperience()} /></main>;
}
