import { pageMeta } from "@/lib/seo";
import { Developers, developersMeta } from "@/v3/static-pages";

export const metadata = pageMeta({ ...developersMeta, path: "/developers/" });

export default function Page() {
  return <Developers />;
}
