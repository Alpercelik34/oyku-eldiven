import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getCategories, getSettings } from "@/lib/db";
import { SettingsProvider } from "@/lib/settings-context";
import { themeCssVars } from "@/lib/settings";
import { SITE_BRAND, SITE_URL, absoluteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Tüm siteyi istek anında (dinamik) render et. Veriler veritabanından geldiği
// için build sırasında statik üretim yapılmaz — böylece canlı build DB'ye
// bağlanmaya çalışıp takılmaz ve admin değişiklikleri anında yansır.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${SITE_BRAND} — ${settings.tagline}`;
  const description = `${SITE_BRAND} (${settings.siteName}): ${settings.heroSubtitle}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_BRAND}`,
    },
    description,
    keywords: [
      "eldiven",
      "öykü eldiven",
      "nitril eldiven",
      "lateks eldiven",
      "vinil eldiven",
      "muayene eldiveni",
      "cerrahi eldiven",
      "toptan eldiven",
      "medikal sarf malzemeleri",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: SITE_BRAND,
      title,
      description,
      locale: "tr_TR",
      images: settings.logoUrl ? [settings.logoUrl] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);
  // Google'ın işletmeyi tanıması için yapılandırılmış veri (Organization).
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_BRAND,
    alternateName: settings.siteName,
    url: SITE_URL,
    logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : undefined,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "TR",
    },
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
  };
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/arama?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-ink-50 text-ink-900"
        style={themeCssVars(settings.theme)}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, webSiteJsonLd]),
          }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2110370899526861');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2110370899526861&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <SettingsProvider settings={settings}>
          <CartProvider>
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer categories={categories} settings={settings} />
            <FloatingContact
              phone={settings.phone}
              whatsapp={settings.whatsapp}
            />
          </CartProvider>
        </SettingsProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
