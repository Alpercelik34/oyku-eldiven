import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/db";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

// Sitemap route handler'ı varsayılan olarak build sırasında önbelleğe alınır;
// veriler DB'den geldiği için (layout'taki force-dynamic ile aynı gerekçe)
// istek anında üretilmesi gerekir.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    {
      url: absoluteUrl("/urunler"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hakkimizda"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/iletisim"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/kategori/${c.slug}`),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/urunler/${p.slug}`),
    lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
    images: p.image ? [absoluteUrl(p.image)] : undefined,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
