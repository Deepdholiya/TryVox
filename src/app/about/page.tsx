import { pageMeta } from "@/lib/seo";
import { About, aboutMeta } from "@/v3/static-pages";

export const metadata = pageMeta({ ...aboutMeta, path: "/about/" });

export default function Page() {
  return <About />;
}
