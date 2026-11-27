import { pageMeta } from "@/lib/seo";
import { Contact, contactMeta } from "@/v3/static-pages";

export const metadata = pageMeta({ ...contactMeta, path: "/contact/" });

export default function Page() {
  return <Contact />;
}
