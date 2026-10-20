import { Body, meta } from "@/content/pages/developers";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...meta, path: "/developers/" });

export default function Page() {
  return (
    <main id="top">
      <Body />
    </main>
  );
}
