import { NotFoundView } from "@/v3/static-pages";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return <NotFoundView />;
}
