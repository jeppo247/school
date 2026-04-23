import type { MetadataRoute } from "next";
import { getAllComparisonSlugs } from "@/data/comparisonData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://upwise.com.au";
  const lastModified = new Date();

  const comparisons = getAllComparisonSlugs().map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
    },
    ...comparisons,
  ];
}
