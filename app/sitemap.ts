import type { MetadataRoute } from "next";
import { site } from "@/data/site.config";
import { repo } from "@/lib/repo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pecas = await repo().listarPublicas();

  return [
    { url: site.url, lastModified: new Date(), priority: 1 },
    { url: `${site.url}/catalogo`, lastModified: new Date(), priority: 0.8 },
    ...pecas.map((p) => ({
      url: `${site.url}/p/${p.slug}`,
      lastModified: new Date(p.criadoEm),
      priority: p.destaque ? 0.9 : 0.7,
    })),
  ];
}
