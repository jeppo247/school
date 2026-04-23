import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://upwise.com.au";
  const lastModified = new Date();

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
  ];
}
