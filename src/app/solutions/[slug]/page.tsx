import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Faq, Integrations, JsonLd } from "@/components";
import { CallFlow, Challenge, SolutionHero } from "@/components/solution";
import { SOLUTION_PAGES } from "@/content/solutions";
import { pageMeta, serviceLd } from "@/lib/seo";

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
  const path = `/solutions/${slug}/`;
  return (
    <main id="top">
      <Breadcrumb items={[["Solutions", null], [d.name, null]]} path={path} />
      <SolutionHero d={d} />
      <Challenge d={d} />
      <CallFlow d={d} />
      <Integrations />
      <Faq items={d.faq} />
      <JsonLd data={serviceLd({ name: `AI voice calling for ${d.name.toLowerCase()}`, description: d.description, path, category: "AI voice calling infrastructure" })} />
    </main>
  );
}
