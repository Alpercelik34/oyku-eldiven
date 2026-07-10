import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Arama motorlarının indekslememesi gereken işlevsel sayfalar.
      disallow: [
        "/admin",
        "/api/",
        "/sepet",
        "/odeme",
        "/siparis-alindi",
        "/arama",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
