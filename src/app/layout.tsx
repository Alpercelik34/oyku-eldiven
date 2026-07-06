import type { Metadata } from "next";
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
  return {
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.heroSubtitle,
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
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <head><<!-- Meta Pixel Code -->
<script>
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
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=2110370899526861&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code --></head>
      <body
        className="min-h-full flex flex-col bg-ink-50 text-ink-900"
        style={themeCssVars(settings.theme)}
      >
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
