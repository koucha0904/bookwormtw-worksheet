# 書蟲學習單 · Bookworm Worksheets

Free printable elementary worksheets for `worksheet.bookwormtw.com`. Built with Astro + Tailwind, bilingual (zh-TW / en), with SEO + AEO baked in and AdSense slots ready.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321 — redirects to /zh
npm run build
npm run preview
```

## What's here

- **i18n**: `/zh/*` and `/en/*`, default `zh`, connected via `hreflang`.
- **Content collections** (`src/content/`):
  - `topics/` — top-level categories (countries, minerals, …) — expandable.
  - `worksheets/` — bilingual Markdown with frontmatter: `title`, `description`, `topic`, `tags`, `grade`, `pdf`, `faq`, `coverEmoji`.
- **SEO**: canonical, OG, Twitter card, `hreflang` + `x-default`, sitemap (`@astrojs/sitemap` with i18n), JSON-LD: `Organization`, `WebSite`, `LearningResource`, `BreadcrumbList`, `CollectionPage`.
- **AEO**: every worksheet ships with a FAQ rendered on the page **and** emitted as `FAQPage` JSON-LD — this is what Google SGE / ChatGPT / Perplexity cite. `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended.
- **AdSense**: `<AdSlot>` component with 4 slot types (top / in-content / sidebar / footer). Renders a placeholder box until `PUBLIC_ADSENSE_CLIENT` + slot IDs are set in `.env`. The AdSense script tag only loads when configured.

## Adding a new worksheet

1. Create `src/content/worksheets/zh/<slug>.md` and `src/content/worksheets/en/<slug>-en.md` (same base slug + `-en` suffix on the English version).
2. Point `topic:` at a topic ID (e.g. `countries`).
3. Drop PDFs into `public/pdfs/` as `<slug>-zh.pdf` and `<slug>-en.pdf`.
4. Add a FAQ section — this drives AEO visibility.

## Adding a new topic (e.g. animals, space, food)

1. Add `src/content/topics/zh/<slug>.md` and `src/content/topics/en/<slug>-en.md`.
2. Use `translationOf` to link the pair.

## AdSense setup

1. Apply at Google AdSense — site needs to be live with real content first.
2. Once approved, copy your `ca-pub-XXXXXX` client ID and 4 slot IDs into `.env`:
   ```
   PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXX
   PUBLIC_ADSENSE_SLOT_TOP=XXXXXXXXXX
   PUBLIC_ADSENSE_SLOT_INCONTENT=XXXXXXXXXX
   PUBLIC_ADSENSE_SLOT_SIDEBAR=XXXXXXXXXX
   PUBLIC_ADSENSE_SLOT_FOOTER=XXXXXXXXXX
   ```
3. Redeploy. Placeholders become real ads.

## Deploy (Cloudflare Pages)

1. Push the repo to GitHub.
2. Cloudflare Pages → *Create project* → build command `npm run build`, output `dist`.
3. Custom domain: `worksheet.bookwormtw.com` (add a CNAME at the `bookwormtw.com` DNS to Cloudflare).
4. Set the env vars above in the Pages project settings.

## Next steps / ideas

- Add `ImageObject` / worksheet preview images to the JSON-LD for richer rich results.
- Add an `ItemList` JSON-LD on `/worksheets` to help Google understand the list.
- Swap emoji covers for real preview thumbnails once PDFs exist.
- Add Google Search Console + submit sitemap on first deploy.
- Keep publishing — AEO rewards depth (>5 FAQs that match real questions people ask).
