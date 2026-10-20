/* Metadata and schema.org helpers shared by every route. */
import type { Metadata } from "next";
import { COMPANY, DOCS, EMAIL, ONE_LINER, SITE_NAME, SITE_URL } from "@/content/site";

export function pageMeta({ title, description, path, absoluteTitle = true }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const url = SITE_URL + path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website", locale: "en_IN", images: [{ url: "/og.png", width: 1200, height: 630, alt: "TryVox: telephony infrastructure for voice AI" }] },
    twitter: { card: "summary_large_image", title, description, site: "@TryvoxTeam", images: ["/og.png"] },
  };
}

export const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SITE_URL + "/#org",
      name: SITE_NAME,
      legalName: COMPANY,
      url: SITE_URL + "/",
      logo: SITE_URL + "/favicon.svg",
      email: EMAIL,
      description: ONE_LINER,
      areaServed: "IN",
      sameAs: ["https://x.com/TryvoxTeam", "https://www.linkedin.com/company/tryvox", DOCS],
      contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: EMAIL, availableLanguage: ["en", "hi"] }],
    },
    { "@type": "WebSite", "@id": SITE_URL + "/#site", url: SITE_URL + "/", name: SITE_NAME, publisher: { "@id": SITE_URL + "/#org" }, inLanguage: "en-IN" },
  ],
};

/** A product or solution page described as a Service offered by TryVox. */
export function serviceLd({ name, description, path, category }: { name: string; description: string; path: string; category: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: SITE_URL + path,
    serviceType: category,
    areaServed: { "@type": "Country", name: "India" },
    provider: { "@id": SITE_URL + "/#org" },
  };
}
