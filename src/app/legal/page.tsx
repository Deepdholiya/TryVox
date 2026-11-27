import { pageMeta } from "@/lib/seo";
import { Legal, legalMeta } from "@/v3/company-pages";

export const metadata = pageMeta({ ...legalMeta, path: "/legal/" });

export default function Page() {
  return <Legal />;
}
