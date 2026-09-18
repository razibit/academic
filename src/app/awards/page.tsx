import AwardsView from "@/components/academic/AwardsView";
import { getCollection } from "@/lib/content";
import type { AwardMeta } from "@/lib/content";

export const metadata = { title: "Honors & Awards" };

export default function AwardsPage() {
  return <main className="main-content"><h1>Honors & Awards</h1><AwardsView awards={getCollection<AwardMeta>("awards")} /></main>;
}
