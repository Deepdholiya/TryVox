import { Body, meta } from "@/content/pages/about";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...meta, path: "/about/" });

export default function Page() {
  return (
    <main id="top" className="mdk">
      <Body />
    </main>
  );
}
