import { Body, meta } from "@/content/pages/pricing";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...meta, path: "/pricing/" });

export default function Page() {
  return (
    <main id="top" className="mdk">
      <Body />
    </main>
  );
}
