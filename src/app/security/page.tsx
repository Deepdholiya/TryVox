import { pageMeta } from "@/lib/seo";
import { Security, securityMeta } from "@/v3/company-pages";

export const metadata = pageMeta({ ...securityMeta, path: "/security/" });

export default function Page() {
  return <Security />;
}
