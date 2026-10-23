import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/site.css";
import "@/styles/react.css";
import { Footer, Header, JsonLd, LogoDefs, SiteEffects } from "@/components";
import { ONE_LINER, SITE_NAME, SITE_URL } from "@/content/site";
import { ORG_LD } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TryVox: Telephony Infrastructure for Voice AI", template: "%s | TryVox" },
  description: ONE_LINER,
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  alternates: { types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0C12" },
  ],
};

/* Runs before paint: applies the saved theme and marks JS as available, so there is no flash. */
const BOOT = `try{var t=localStorage.getItem('tv-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}document.documentElement.classList.add('js');`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Doto:wght@800&family=Instrument+Serif:ital@0;1&display=swap"
        />
        <JsonLd data={ORG_LD} />
      </head>
      <body>
        <a className="skip" href="#top">Skip to content</a>
        <LogoDefs />
        <div className="gridlines" aria-hidden="true">
          <div>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
