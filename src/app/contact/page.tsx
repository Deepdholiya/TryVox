import { Body, meta } from "@/content/pages/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...meta, path: "/contact/" });

export default function Page() {
  return (
    <main id="top">
      <Body />
    </main>
  );
}
