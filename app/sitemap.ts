import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://dunedinherald.com";
  const articles = await getArticles();
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.4 },
    ...articles.map((article) => ({
      url: `${base}/story/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.9 : 0.7,
    })),
  ];
}
