import EducationView from "@/components/academic/EducationView";
import { getCollection } from "@/lib/content";
import type { EducationMeta } from "@/lib/content";

export const metadata = { title: "Education" };

export default function EducationPage() {
  return <main className="main-content"><h1>Education</h1><EducationView entries={getCollection<EducationMeta>("education")} /></main>;
}
