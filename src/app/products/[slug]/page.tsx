import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Faq, Integrations, JsonLd } from "@/components";
import { Compliance, DevSection, ProductHero, ProductPanels, ProductStory } from "@/components/product";
import { PRODUCT_PAGES } from "@/content/products";
import { pageMeta, serviceLd } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PRODUCT_PAGES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const d = PRODUCT_PAGES[(await params).slug];
  return d ? pageMeta({ title: d.title, description: d.description, path: `/products/${(await params).slug}/` }) : {};
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const d = PRODUCT_PAGES[slug];
  if (!d) notFound();
  const path = `/products/${slug}/`;
  return (
    <main id="top">
      <Breadcrumb items={[["Products", null], [d.name, null]]} path={path} />
      <ProductHero d={d} />
      <ProductStory lines={d.story} />
      <ProductPanels d={d} />
      <Compliance />
      {d.code && <DevSection code={d.code} note={d.note} />}
      <Integrations />
      <Faq items={d.faq} />
      <JsonLd data={serviceLd({ name: `TryVox ${d.name}`, description: d.description, path, category: "Telephony infrastructure for AI voice agents" })} />
    </main>
  );
}
