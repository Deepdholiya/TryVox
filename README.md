# TryVox website

Marketing site for [TryVox](https://tryvox.io): telephony infrastructure for AI voice agents.

Built with **Next.js (React)** and exported as static HTML, so every page's content is in the HTML for search engines and LLM crawlers. Animations use small React hooks and **Three.js** for the hero backdrops.

## Run locally

```bash
npm install
npm run dev
```

Production build (writes static HTML to `out/`):

```bash
npm run build
```

## Structure

- `src/app/` – routes: home, `products/[slug]`, `solutions/[slug]`, pricing, developers, integrations, about, contact, plus `sitemap.xml`, `robots.txt`, `llms.txt` and `llms-full.txt`
- `src/content/` – all copy: `site.ts` (nav, constants), `products.tsx`, `solutions.tsx`, `pages/*` (pricing, about, …), `code.ts` (API samples)
- `src/components/` – layout (`Header`, `Footer`), shared UI (`ui.tsx`), page templates (`product.tsx`, `solution.tsx`, `home.tsx`), interactive pieces (`interactive.tsx`), scroll/timed motion (`behaviors.tsx`) and the Three.js hero (`ThreeField.tsx`)
- `src/lib/` – `dom.ts` (shared scroll loop and `useDom` hook with automatic cleanup), `seo.ts` (metadata and schema.org), `llms.ts`
- `src/styles/site.css` – the design system; `react.css` – React-build additions
- `public/` – logos, favicon, share image

## Editing content

Products and solutions are data: edit `src/content/products.tsx` or `src/content/solutions.tsx` and every place that uses them (page, nav, sitemap, llms.txt, structured data) updates.

## SEO and LLM access

- Per-page title, description, canonical, Open Graph and Twitter tags (`src/lib/seo.ts`)
- JSON-LD: Organization, WebSite, BreadcrumbList, FAQPage and Service
- `sitemap.xml`, `robots.txt` (search and AI crawlers allowed), `llms.txt` and `llms-full.txt`
- Set `NEXT_PUBLIC_SITE_URL` to the production domain when it moves off `tryvoxinternal.vercel.app`
