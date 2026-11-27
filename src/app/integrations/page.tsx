import { pageMeta } from "@/lib/seo";
import { Integrations, integrationsMeta } from "@/v3/static-pages";

export const metadata = pageMeta({ ...integrationsMeta, path: "/integrations/" });

export default function Page() {
  return <Integrations />;
}
