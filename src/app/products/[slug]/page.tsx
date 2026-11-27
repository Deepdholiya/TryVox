import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components";
import { PRODUCT_PAGES } from "@/content/v3/products";
import { pageMeta, serviceLd } from "@/lib/seo";
import { ProductView } from "@/v3/pages";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PRODUCT_PAGES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = PRODUCT_PAGES[slug];
  return d ? pageMeta({ title: d.title, description: d.description, path: `/products/${slug}/` }) : {};
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const d = PRODUCT_PAGES[slug];
  if (!d) notFound();
  return (
    <>
      <ProductView d={d} slug={slug} />
      <JsonLd data={serviceLd({ name: `TryVox ${d.name}`, description: d.description, path: `/products/${slug}/`, category: "Telephony infrastructure for AI voice agents" })} />
    </>
  );
}
