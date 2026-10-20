import { Body, meta } from "@/content/pages/integrations";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...meta, path: "/integrations/" });

export default function Page() {
  return (
    <main id="top">
      <Body />
    </main>
  );
}
