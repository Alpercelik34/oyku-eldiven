// Sitenin mutlak adresi. Canonical URL, sitemap ve robots.txt bu adresi
// kullanır. Farklı bir ortamda (ör. önizleme) NEXT_PUBLIC_SITE_URL ile
// geçersiz kılınabilir.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oykueldiven.com";

// Arama motorlarında hedeflenen marka adı. Alan adı (oykueldiven.com) ile
// birebir eşleşmesi için ayarlardaki siteName'den bağımsız tutulur.
export const SITE_BRAND = "Öykü Eldiven";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
