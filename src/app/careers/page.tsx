import { pageMeta } from "@/lib/seo";
import { Careers, careersMeta } from "@/v3/company-pages";

export const metadata = pageMeta({ ...careersMeta, path: "/careers/" });

export default function Page() {
  return <Careers />;
}
