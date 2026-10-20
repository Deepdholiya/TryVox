import type { MetadataRoute } from "next";
import { PRODUCTS, SITE_URL, SOLUTIONS } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: SITE_URL + path, lastModified: now, changeFrequency: "weekly", priority });
  return [
    page("/", 1),
    ...PRODUCTS.map((p) => page(`/products/${p.slug}/`, 0.9)),
    ...SOLUTIONS.map((s) => page(`/solutions/${s.slug}/`, 0.8)),
    page("/pricing/", 0.9),
    page("/integrations/", 0.8),
    page("/developers/", 0.8),
    page("/about/", 0.6),
    page("/contact/", 0.7),
  ];
}
