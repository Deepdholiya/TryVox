# TryVox website

Marketing site for [TryVox](https://tryvox.io): telephony infrastructure for AI voice agents.

Static HTML, no framework. Fonts come from Google Fonts; everything else is in this repo.

## Structure

- `index.html` – homepage
- `products/*`, `solutions/*`, `pricing/`, `developers/`, `integrations/`, `about/`, `contact/` – inner pages (generated)
- `assets/css/site.css` – the one design system every page uses
- `assets/js/site.js` – shared script; each module only runs when its section is on the page
- `assets/logos/` – partner logos
- `tools/build.py` – generates the inner pages and keeps the homepage header and footer in sync

## Editing pages

Inner pages are generated. Edit content in `tools/build.py`, then run:

```bash
python3 tools/build.py
```

The homepage body is edited directly in `index.html`; its header and footer come from the same generator.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

The repo is linked to Vercel. Every push to `main` deploys to production.
