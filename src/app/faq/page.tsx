import { pageMeta } from "@/lib/seo";
import { FaqHub, faqMeta } from "@/v3/company-pages";

export const metadata = pageMeta({ ...faqMeta, path: "/faq/" });

export default function Page() {
  return <FaqHub />;
}
