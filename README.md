# TryVox website

Marketing site for [TryVox](https://tryvox.io): telephony infrastructure for AI voice agents.

A single static page (`index.html`) with no build step. Fonts load from Google Fonts; everything else is inline.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

The repo is linked to Vercel. Every push to `main` deploys to production; other branches get preview URLs.
