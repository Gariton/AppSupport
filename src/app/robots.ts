import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gariton.site";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/owner/"] }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
