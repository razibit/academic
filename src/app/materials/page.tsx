import AcademicCollection from "@/components/academic/AcademicCollection";
import { getMaterials } from "@/lib/content";

export const metadata = { title: "Materials" };
export default function MaterialsPage() { return <AcademicCollection title="Materials" description="Research materials, talks, datasets, and downloadable resources." items={getMaterials()} emptyMessage="Materials will be added as individual content files." />; }
