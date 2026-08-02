import type { MetadataRoute } from "next";
import { listApps, listPolicies } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gariton.site";
  const [apps, policies] = await Promise.all([listApps(), listPolicies()]);
  const staticRoutes = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7
  }));
  const appRoutes = apps.flatMap((app) => {
    const routes: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/apps/${app.slug}`, lastModified: new Date(app.updatedAt), changeFrequency: "monthly", priority: 0.8 }
    ];
    if (policies.some((policy) => policy.appId === app.id)) {
      routes.push({ url: `${baseUrl}/apps/${app.slug}/privacy`, lastModified: new Date(app.updatedAt), changeFrequency: "yearly", priority: 0.4 });
    }
    return routes;
  });
  return [...staticRoutes, ...appRoutes];
}
