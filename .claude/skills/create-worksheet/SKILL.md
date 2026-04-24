---
name: create-worksheet
description: Create a new bilingual (zh-TW + English) worksheet for the Bookworm Worksheets site (worksheet.bookwormtw.com). Guides the user through topic, learning objectives, activity format, and illustration style, then writes the site MD content and a printable HTML worksheet. Trigger when the user says "做一份學習單", "做一張學習單", "新增學習單", "加一份學習單", "create a worksheet", "new worksheet", or mentions they want to add a country / mineral / animal / any new subject to the site.
---

# Create a worksheet

This skill produces one new worksheet for the site. Each worksheet ships as:

1. **Site content** — two Markdown files (`zh` + `en`) in `src/content/worksheets/` that plug into the Astro content collection and automatically get SEO + AEO metadata.
2. **Printable worksheet** — one self-contained HTML file in `public/printable/` that prints to a clean A4 PDF. The user opens it in a browser, hits ⌘P, saves as PDF, then drops the PDF into `public/pdfs/`.

Do not skip either output — they serve different audiences (site visitors vs. kids with pencils).

---

## Step 1 — Gather requirements (ask once, in one message)

Ask the user all four questions below in a single message so they can answer in one reply. Skip any that were already answered earlier in the conversation. Use the user's language (Chinese if they have been writing in Chinese).

1. **主題**：這份學習單的主題是什麼？（一份一個主題，例：芬蘭 / 紫水晶 / 無尾熊）
2. **學習項目**：希望孩子學到什麼？挑 3–5 項（例：地理位置、國旗、食物、4 句當地語言、1 個文化小知識）
3. **形式**：想用哪些活動方式？可複選，建議混合 2–3 種：
   - 閱讀小短文 + 填空
   - 圖文配對
   - 地圖 / 圖片著色
   - 任務挑戰（找一找、連連看、畫出⋯⋯）
   - 作文 / 日記頁
   - 小迷宮 / 找字遊戲
4. **風格**：插畫風格與角色？
   - 整份學習單的色系（柔粉 / 大地色 / 繽紛 / ⋯⋯）
   - 有沒有貫穿全篇的角色陪伴？（例：一隻戴眼鏡的貓頭鷹、女兒的玩偶、Moomin⋯⋯）
   - 如果沒想法，說一句 "你幫我選" 即可

Also confirm (give defaults so the user can just say "都用預設"):
- **年級**：低 1–2 / 中 3–4 / 高 5–6 / 全年級通用（預設：中年級）
- **語言**：中英雙語 / 只做中文 / 只做英文（預設：雙語）

---

## Step 2 — Check the topic taxonomy

Before writing anything, read the existing topics:

```
src/content/topics/zh/*.md
src/content/topics/en/*.md
```

If the user's subject fits an existing topic (countries, minerals, …), use that. If it's a new category (e.g. animals, space, food, famous people), tell the user you'll also create the topic file pair, and show the proposed topic slug + emoji + one-line description for approval before proceeding.

---

## Step 3 — Research, then plan

1. **Research** — Use your training knowledge for well-known topics. For anything time-sensitive, regional, or where accuracy matters (statistics, living people, current events), use WebSearch / WebFetch. A worksheet with a wrong fact is worse than no worksheet. If the user uploaded sources, use those as primary.

2. **Plan** — Before writing files, show the user a short plan and wait for approval:

   ```
   Topic slug: <slug>
   Title (zh): <title>
   Title (en): <title>
   Grade: <lower|middle|upper|all>
   Tags: [...]
   Cover: <emoji> + <color hex>
   Character: <如果有>

   Pages (printable):
     P1 - Title page: <短描述>
     P2 - <活動 1 名稱>: <教什麼>
     P3 - <活動 2 名稱>: <教什麼>
     ...
     PN - Answer key (if applicable)

   FAQ (5 questions that drive AEO):
     Q1: ...
     Q2: ...
     ...
   ```

   Let the user redirect before you spend time generating content.

---

## Step 4 — Write the site MD files

Use this frontmatter schema (matches `src/content.config.ts`). Required: `title`, `description`, `topic`, `grade`, `lang`, `slug`, `publishedAt`. Everything else has sensible defaults but FAQ is what drives AEO so **always include 5 FAQ entries**.

### Chinese version → `src/content/worksheets/zh/<slug>.md`

```markdown
---
title: <主題>學習單 — <副標>
description: <一句 SEO 描述，含目標年級、關鍵字、"附免費 PDF 下載"。120–160 字之間>
topic: <existing-topic-slug>           # e.g. countries, minerals
tags: [<3–6 個標籤>]
grade: middle                           # lower | middle | upper | all
lang: zh
slug: <slug>                            # no language suffix
pdf: /pdfs/<slug>-zh.pdf
coverEmoji: <單個 emoji>
coverColor: "<hex 背景色，要淺、要柔和>"
translationOf: <slug>-en
publishedAt: <today ISO date>
featured: false
faq:
  - q: <真的會有家長/老師 Google 的問題 1>
    a: <具體、完整、可單獨被引用的答案>
  - q: ...
  - q: ...
  - q: ...
  - q: ...
---

## 這份學習單在教什麼？

<一段簡介 + 活動條列>

## 為什麼我想為女兒做這份學習單？

<作者視角，溫暖親切，1–2 段>

## 建議搭配的延伸活動

- <繪本 / 影片 / 料理 / 實驗 / 景點>
- ...
```

### English version → `src/content/worksheets/en/<slug>-en.md`

Same structure, `lang: en`, `slug: <slug>-en`, `topic: <topic>-en`, `translationOf: <slug>`, `pdf: /pdfs/<slug>-en.pdf`. Translate — don't just transliterate. FAQs should match common English-language search queries about the topic.

**Critical rules for frontmatter:**
- YAML is fussy — never start a q/a value with a leading `"`. If you need a quoted term, say `The word foo means ...` instead of `"Foo" means ...`. (The existing content was bitten by this.)
- `coverColor` must be in double quotes because of the `#`.
- `publishedAt` in ISO format (`YYYY-MM-DD`).

**Critical rules for FAQs (AEO):**
- 5 entries each language. No more, no less.
- Questions must sound like how a real parent/teacher would phrase a search query — "芬蘭什麼時候可以看到極光？", not "極光時期".
- Answers must be **self-contained** — if Google pulls just the answer, it should still make sense.
- Mix "about the worksheet" questions (grade level, print usage) with "about the subject" factual questions (capital, landmark, origin).

---

## Step 5 — Write the printable HTML

Create `public/printable/<slug>.html`. It must be:

- **Self-contained** — all CSS inline, no external fonts or images except emoji (which are system fonts).
- **A4 portrait**, 2–4 pages, `page-break-after: always` between pages.
- **Print-clean** — hidden screen-only nav bar, no ads, proper margins.
- **Kid-friendly** — large touch areas, lined boxes to write in, generous white space.
- **Character-consistent** — if the user specified a companion character, it should appear on every page (emoji or simple SVG is fine).
- **Footer on each page** with `worksheet.bookwormtw.com` in small print.

### Content budget per page (critical — prevents overflow to a second sheet)

A4 usable area with our margins = **265mm tall**. The `.page` block has `min-height: 260mm` but **not** `max-height` (capping it would chop content). So the generator is responsible for not overstuffing. Rough budget per page:

- 1 × H2 heading (~10mm)
- 1 × H3 heading (~6mm each)
- Body text: ~14 lines of 12pt at line-height 1.7 ≈ 85mm for one full paragraph block
- Activity box (`.box` min-height 30mm) ≈ 35–40mm with padding
- Lined writing area (`.lined` min-height 60mm) ≈ 65mm
- Buddy character + footer + page number ≈ 20mm reserved

Rule of thumb: **each page should use 1 heading + 2–3 content blocks, not 4+**. If an activity doesn't fit, split it across two pages or cut it.

### US Letter fallback (optional)

English version readers may print on US Letter (216×279mm — shorter than A4 by 18mm). If the user says the English worksheet is for a US/Canada audience, change `@page size: Letter portrait` and reduce `.page min-height` to `245mm`. Otherwise keep A4 as default — it prints fine on Letter, just with slightly larger bottom margin.

Use the template at the bottom of this skill as a starting point. Build 4–6 pages:

1. **Cover** — big title, subject emoji, child's name field, date field.
2. **Learn** — a short reading passage with key vocabulary highlighted, or a labeled diagram.
3. **Do** — the main activity (fill-in, matching, coloring, map labeling — matches what the user chose in Step 1).
4. **Explore** — open-ended / creative page (draw what you'd pack for the trip, write a letter home, design your own flag).
5. **Answer key** (optional) — for parents/teachers; put on last page so it can be separated.

If doing bilingual, generate **one HTML per language** (`<slug>-zh.html` and `<slug>-en.html`). Do not mix languages on the same printable — kids get confused.

---

## Step 6 — Verify A4 fit (do this before reporting done)

After writing the HTML, open it in a browser and inspect the print preview layout. You can't literally open a browser from the skill, but you can verify the constraint by counting:

For each `<section class="page">`, estimate total vertical height:
- Sum the rough heights from the content budget above.
- If any page's content sum exceeds **~255mm**, trim. Signs of overstuffing: more than 3 content blocks per page, paragraphs over 6 lines, more than 6 list items.
- Confirm every `.page` ends with `<footer>` and `<div class="page-no">`.

Tell the user explicitly: "Open `public/printable/<slug>-zh.html` in Chrome, hit ⌘P, check that the preview shows exactly N pages with nothing cut off or orphaned. If a page overflows, let me know which one."

## Step 7 — Report back

Give the user:

1. **Links to the new files** as markdown paths:
   - Worksheet pages after `npm run dev`: `/zh/worksheets/<slug>` and `/en/worksheets/<slug>`
   - Printable: `public/printable/<slug>-zh.html` → open in browser → ⌘P → save as PDF → move to `public/pdfs/<slug>-zh.pdf`
2. **Page count** for each printable (e.g. "中文 4 頁 / 英文 4 頁") so user knows what to expect in print preview.
3. **One sentence** on what's unique about this worksheet vs. the existing ones (so the collection feels curated, not generic).
4. **Any uncertainties** — flag facts you weren't 100% sure about so the user can verify before publishing.

---

## Printable HTML template

Use this as the starting skeleton. Replace placeholders, duplicate page blocks as needed, and adapt the activities to what the user requested.

```html
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>{{TITLE}} · 書蟲學習單</title>
<style>
  @page { size: A4 portrait; margin: 14mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: "Noto Sans TC", "PingFang TC", system-ui, sans-serif; color: #2f2018; }
  .page { page-break-after: always; min-height: 260mm; position: relative; padding-bottom: 12mm; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 32pt; margin: 0 0 6mm; color: #6b4a2a; line-height: 1.1; }
  h2 { font-size: 18pt; margin: 6mm 0 3mm; color: #8a5f33; border-bottom: 2px dashed #d5b07c; padding-bottom: 2mm; }
  h3 { font-size: 13pt; margin: 4mm 0 2mm; color: #6b4a2a; }
  p, li { font-size: 12pt; line-height: 1.7; }
  .hero { background: {{COVER_COLOR}}; border-radius: 10mm; padding: 12mm; text-align: center; }
  .hero .emoji { font-size: 72pt; line-height: 1; }
  .hero .subject { font-size: 20pt; color: #6b4a2a; margin-top: 4mm; }
  .field { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 45mm; height: 7mm; margin: 0 2mm; }
  .box { border: 1.5px dashed #c4925a; border-radius: 3mm; padding: 4mm; margin: 3mm 0; min-height: 30mm; }
  .lined { background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 8mm, #e6cfa9 8mm, #e6cfa9 8.5mm); min-height: 60mm; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
  .match-item { padding: 3mm 4mm; border: 1.5px solid #c4925a; border-radius: 3mm; text-align: center; font-size: 13pt; }
  .fill { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 22mm; padding: 0 2mm; }
  .buddy { position: absolute; bottom: 15mm; right: 10mm; font-size: 36pt; opacity: 0.85; }
  footer { position: absolute; bottom: 4mm; left: 0; right: 0; text-align: center; font-size: 9pt; color: #8a5f33; }
  .page-no { position: absolute; bottom: 4mm; right: 10mm; font-size: 9pt; color: #8a5f33; }
  .screen-only { display: none; }
  @media screen {
    body { background: #f3e8d5; padding: 20px; }
    .page { background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin: 0 auto 20px; max-width: 210mm; padding: 14mm; }
    .screen-only { display: block; text-align: center; padding: 10px 0 20px; color: #6b4a2a; font-size: 13px; }
  }
</style>
</head>
<body>
<div class="screen-only">← 按 ⌘P 列印，或存成 PDF。列印時不會出現這行字。</div>

<!-- PAGE 1 · Cover -->
<section class="page">
  <div class="hero">
    <div class="emoji">{{COVER_EMOJI}}</div>
    <h1>{{TITLE}}</h1>
    <div class="subject">{{SUBTITLE}}</div>
  </div>
  <div style="margin-top:14mm; font-size:13pt;">
    <p>我的名字： <span class="field"></span></p>
    <p>今天的日期： <span class="field"></span></p>
    <p>我今天想學會的一件事： <span class="field" style="min-width:90mm"></span></p>
  </div>
  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
  <div class="page-no">1</div>
</section>

<!-- PAGE 2 · Learn -->
<section class="page">
  <h2>{{SECTION_LEARN_TITLE}}</h2>
  <!-- short reading passage + 3–5 key facts -->
  <p>{{LEARN_INTRO}}</p>
  <h3>小知識</h3>
  <ul>
    <li>{{FACT_1}}</li>
    <li>{{FACT_2}}</li>
    <li>{{FACT_3}}</li>
  </ul>
  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
  <div class="page-no">2</div>
</section>

<!-- PAGE 3 · Do (adapt to the activity chosen) -->
<section class="page">
  <h2>{{SECTION_DO_TITLE}}</h2>
  <!-- EXAMPLE: fill in the blanks -->
  <p>讀讀看，把空格填起來：</p>
  <p>{{COUNTRY}} 的首都是 <span class="fill"></span>，最有名的動物是 <span class="fill"></span>。</p>
  <!-- EXAMPLE: matching -->
  <h3>連連看</h3>
  <div class="grid-2">
    <div class="match-item">{{TERM_A}}</div><div class="match-item">{{DEF_A}}</div>
    <div class="match-item">{{TERM_B}}</div><div class="match-item">{{DEF_B}}</div>
    <div class="match-item">{{TERM_C}}</div><div class="match-item">{{DEF_C}}</div>
  </div>
  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
  <div class="page-no">3</div>
</section>

<!-- PAGE 4 · Explore -->
<section class="page">
  <h2>{{SECTION_EXPLORE_TITLE}}</h2>
  <p>{{EXPLORE_PROMPT}}</p>
  <div class="box lined"></div>
  <h3>畫一畫</h3>
  <div class="box" style="min-height:70mm"></div>
  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
  <div class="page-no">4</div>
</section>

<!-- PAGE 5 · Answer key (optional, for adults) -->
<section class="page">
  <h2>給大人的解答與延伸</h2>
  <p><strong>填空答案：</strong>{{ANSWERS}}</p>
  <p><strong>延伸活動建議：</strong>{{EXTENSIONS}}</p>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
  <div class="page-no">5</div>
</section>

</body>
</html>
```

For the English version, change `lang="en"`, the screen-only hint to English, and `"書蟲學習單"` in the footer to `"Bookworm Worksheets"`.

---

## Don'ts

- Don't write the MD and HTML at the same time — show the plan (Step 3) first. Users often redirect after seeing it.
- Don't invent facts. If uncertain, either WebSearch or tell the user "I'm not sure about X — please verify".
- Don't skip the FAQ. That's the single biggest AEO lever on the whole site.
- Don't use external image URLs in the printable HTML. It must print the same whether the user is online or not.
- Don't forget `translationOf` linking both MD files together — it keeps `hreflang` correct.
- Don't use emojis that render differently across fonts (rare flags, complex ZWJ sequences) on cover pages — stick to common ones for print consistency.
