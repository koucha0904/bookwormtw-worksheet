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
  - `worksheets/` — bilingual Markdown with frontmatter: `title`, `description`, `topic`, `tags`, `grade`, `faq`, `coverEmoji`.
- **SEO**: canonical, OG, Twitter card, `hreflang` + `x-default`, sitemap (`@astrojs/sitemap` with i18n), JSON-LD: `Organization`, `WebSite`, `LearningResource`, `BreadcrumbList`, `CollectionPage`.
- **AEO**: every worksheet ships with a FAQ rendered on the page **and** emitted as `FAQPage` JSON-LD — this is what Google SGE / ChatGPT / Perplexity cite. `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended.
- **AdSense**: `<AdSlot>` component with 4 slot types (top / in-content / sidebar / footer). Renders a placeholder box until `PUBLIC_ADSENSE_CLIENT` + slot IDs are set in `.env`. The AdSense script tag only loads when configured.

## Theme-first worksheet structure

Each worksheet theme gets its own folder. Everything for that theme lives there.

```text
src/content/worksheets/
  earths-treasures/
    zh.md
    en.md

public/printable/
  earths-treasures/
    zh-boy-explorer.html
    zh-girl-mission.html
    en-boy-explorer.html
    en-girl-mission.html

public/pdfs/
  earths-treasures/
    zh-boy-explorer.pdf
    zh-girl-mission.pdf
    en-boy-explorer.pdf
    en-girl-mission.pdf
```

Rules:

1. One theme = one folder, for example `earths-treasures`, `finland`, `nagoya`, `uji`.
2. Each theme has exactly two content files: `zh.md` and `en.md`.
3. Each language can have multiple styles. The filename should include both language and style, for example `zh-boy-explorer.html`.
4. You do not need nested `zh/` or `en/` folders under `public/printable/` or `public/pdfs/`.
5. The site auto-discovers styles from the files inside the theme folder. If `public/printable/finland/` contains `zh-story.html` and `zh-quiz.html`, both styles will appear automatically on the `/zh/worksheets/finland` page.

## Daily workflow

The intended workflow is simple:

1. Create one theme folder.
2. Put `zh.md` and `en.md` into `src/content/worksheets/<slug>/`.
3. Drop every style HTML into `public/printable/<slug>/`.
4. Drop matching PDFs into `public/pdfs/<slug>/`.
5. Use explicit filenames such as `zh-boy-explorer.html`, `zh-girl-mission.html`, or any other `<lang>-<style>` pattern.
6. The site will automatically list every detected style on the worksheet page.

You only need to add a `styles:` array in the Markdown file if you want nicer labels, descriptions, or a custom display order.

Common default style IDs:

- `boy-explorer`
- `girl-mission`

These two styles should keep the same mission-based worksheet structure. The difference is visual direction only:

- `boy-explorer`: cooler palette, cleaner explorer-notebook mood
- `girl-mission`: warmer palette, softer rounded mission-card mood

## Adding a new worksheet theme

1. Create `src/content/worksheets/<slug>/zh.md` and `src/content/worksheets/<slug>/en.md`.
2. Point `topic:` at a topic ID (for example `countries` or `minerals`).
3. Drop the corresponding HTML and PDF files into:
   - `public/printable/<slug>/`
   - `public/pdfs/<slug>/`
4. Name files with the pattern `<lang>-<style>.html` and `<lang>-<style>.pdf`.
5. Run `npm run audit:worksheets` to see which required files are still missing. Missing PDFs are reported as optional warnings, not hard failures.
6. Add a FAQ section — this drives AEO visibility.

Optional:

- If you want a friendlier style label or description than the filename implies, you can still add a `styles:` array to the MD file as an override. The site will merge that metadata with the actual files found in the folder.

### Minimal worksheet frontmatter

```yaml
---
title: 大地瑰寶學習單
description: 給小學生使用的主題學習單介紹文字。
topic: minerals
tags: [礦物, 博物館]
grade: upper
lang: zh
worksheetSlug: earths-treasures
coverEmoji: 💎
coverColor: "#eef2f7"
translationOf: earths-treasures
publishedAt: 2026-04-24
faq:
  - q: 問題
    a: 答案
---
```

Optional style override example:

```yaml
styles:
  - id: boy-explorer
    label: 藍調版
    description: 冷色系任務版，結構和活動不變，只調整配色與視覺語氣。
  - id: girl-mission
    label: 玫瑰版
    description: 暖色系任務版，結構和活動不變，只調整配色與視覺語氣。
```

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
