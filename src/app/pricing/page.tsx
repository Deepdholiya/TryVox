import { pageMeta } from "@/lib/seo";
import { Pricing, pricingMeta } from "@/v3/static-pages";

export const metadata = pageMeta({ ...pricingMeta, path: "/pricing/" });

export default function Page() {
  return <Pricing />;
}
