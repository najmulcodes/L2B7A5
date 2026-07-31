import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://gearup.example.com";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/gear`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/auth/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/auth/register`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
