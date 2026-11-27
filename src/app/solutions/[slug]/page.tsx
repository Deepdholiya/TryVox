import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components";
import { SOLUTION_PAGES } from "@/content/v3/solutions";
import { pageMeta, serviceLd } from "@/lib/seo";
import { SolutionView } from "@/v3/pages";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(SOLUTION_PAGES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = SOLUTION_PAGES[slug];
  return d ? pageMeta({ title: d.title, description: d.description, path: `/solutions/${slug}/` }) : {};
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const d = SOLUTION_PAGES[slug];
  if (!d) notFound();
  return (
    <>
      <SolutionView d={d} slug={slug} />
      <JsonLd data={serviceLd({ name: `TryVox for ${d.name}`, description: d.description, path: `/solutions/${slug}/`, category: "AI voice calling infrastructure" })} />
    </>
  );
}
