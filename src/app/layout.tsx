import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/v3/v3.css";
import { JsonLd, LogoDefs } from "@/components/ui";
import { ONE_LINER, SITE_NAME, SITE_URL } from "@/content/site";
import { ORG_LD } from "@/lib/seo";
import { Footer } from "@/v3/Footer";
import { Header } from "@/v3/Header";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TryVox: Telephony Infrastructure for Voice AI", template: "%s | TryVox" },
  description: ONE_LINER,
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  alternates: { types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFFFF" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" />
        <JsonLd data={ORG_LD} />
      </head>
      <body>
        <a className="skip" href="#top">
          Skip to content
        </a>
        <LogoDefs />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
