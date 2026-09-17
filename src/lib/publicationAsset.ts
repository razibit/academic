import { publicAssetUrl } from "@/lib/routes";
import type { Publication } from "@/types/publication";

export function publicationAsset(publication: Publication, field: "preview" | "pdf" | "poster" | "slides"): string | undefined {
  const value = publication[field];
  return value && (value.startsWith("/") || /^https?:\/\//.test(value)) ? publicAssetUrl(value) : value ? publicAssetUrl(`/papers/${value}`) : undefined;
}
