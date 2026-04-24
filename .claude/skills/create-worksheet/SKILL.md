---
name: create-worksheet
description: Create a new bilingual (zh-TW + English) worksheet for the Bookworm Worksheets site (worksheet.bookwormtw.com). Pipeline - Step 1-3: gather requirements and plan; Step 4: write content outline + Fact-Check Brief (pause for user to verify with GPT/Claude); Step 5: apply corrections + Claude Design Brief (pause for user to get HTML from Claude Design); Step 6: receive HTML + write MD files + push. Trigger when the user says "做一份學習單", "做一張學習單", "新增學習單", "加一份學習單", "create a worksheet", "new worksheet", or mentions they want to add a country / mineral / animal / any new subject to the site.
---

# Create a worksheet

This skill produces one new worksheet for the site. Each worksheet ships as:

1. **Site content** — two Markdown files (`zh` + `en`) in `src/content/worksheets/` that plug into the Astro content collection and automatically get SEO + AEO metadata.
2. **Printable worksheet** — one self-contained HTML file in `public/printable/` that prints to a clean A4 PDF.

Do not skip either output.

---

## Design philosophy

> The goal is not to "deliver knowledge" but to "trigger exploration".  
> Kids are not "filling in a worksheet" — they are "completing a mission".

### Two modes — pick the right one for the topic

| Mode | When to use | Structure |
|---|---|---|
| **任務型 Mission** | Museum visits, observation tasks, experiments, travel activities | Role → Mission → Observe → Judge → Create → Achievement |
| **知識型 Knowledge** | Country intro, science concepts, historical figures | Learn → Do → Explore → Reflect |

Default to **Mission mode** for any worksheet that involves hands-on activity or fieldwork. Knowledge mode for pure learning content. Ask the user if unsure.

---

## Step 1 — Gather requirements (ask once, in one message)

Ask in one message. Skip what was already answered. Use the user's language.

1. **主題**：這份學習單的主題是什麼？（一份一個主題）
2. **學習目標**：希望孩子學到或注意到什麼？挑 3–5 項
3. **模式**：任務型（有角色設定、挑戰關卡）or 知識型（學完再做）？不確定你幫我決定
4. **活動形式**（可複選）：
   - 結構化觀察（顏色/形狀/判斷選框）
   - 選擇題 / 判斷題
   - 連連看 / 圖文配對
   - 創作命名（給主角取名 + 設定能力）
   - 畫圖區（任務導向，非單純畫一畫）
   - 作文 / 日記頁
5. **風格**：色系、貫穿角色（有的話）？沒想法說「你幫我選」

Also confirm (give defaults):
- **年級**：低 1–2 / 中 3–4 / 高 5–6 / 全年級（預設：中年級）
- **語言**：中英雙語 / 只中文 / 只英文（預設：雙語）

---

## Step 2 — Check the topic taxonomy

Read existing topics:
```
src/content/topics/zh/*.md
src/content/topics/en/*.md
```

If it's a new category, show proposed `slug + emoji + one-line description` for approval before proceeding.

---

## Step 3 — Research, then plan

1. **Research** — Use training knowledge for well-known facts. For anything time-sensitive or regional, use WebSearch / WebFetch. Wrong facts are worse than no worksheet. User-uploaded sources take priority.

2. **Plan** — Show a plan and wait for approval:

```
Mode: 任務型 / 知識型
Topic slug: <slug>
Title (zh): <title>
Title (en): <title>
Grade: <lower|middle|upper|all>
Tags: [...]
Cover: <emoji> + <color hex>
Character / role: <角色名稱 + emoji>

Mission briefing (任務型限定):
  Role: 你是一位 <身份>
  Mission: <1 句具體任務>
  Goal: <完成什麼才算成功>

Pages (printable):
  P1 - Cover / Mission briefing
  P2 - <活動 1>: <教什麼 / 觀察什麼>
  P3 - <活動 2>
  ...
  PN - Achievement + Reflect

Achievement badges (3–5 個):
  □ <探索型> (容易達成)
  □ <完成型>
  ⭐ <挑戰型> (稍難)

FAQ (5 questions for AEO):
  Q1: ...
```

Wait for OK before writing any file.

---

## Step 4 — Content outline + Fact-Check Brief

> **STOP after this step.** Output the brief, then wait for the user to return with corrections before proceeding.

Write the full content in plain structured text (not HTML yet). Then output a **Fact-Check Brief** formatted for pasting directly into GPT or Claude.ai.

### Fact-Check Brief template

```
## 學習單事實核查

主題：[topic]　年級：[grade]　語言：[zh/en]

請逐項核查以下內容的正確性，標示：
  ❌ 明確錯誤（請提供正確答案）
  ⚠️ 有疑慮 / 需查證
  ✅ 正確
  💡 建議補充或換個更適合的說法

---
### 知識點
[條列所有知識點，一行一條]

---
### 活動內容與選擇題答案
P2 任務一：[活動名稱]
  說明文字：[原文]
  選擇題：[題目]
    A. [選項] B. [選項] C. [選項] D. [選項]
    正確答案：[X]

P3 任務二：[活動名稱]
  [同上格式]

---
### FAQ（將出現在網站上，影響 SEO）
Q1: [問題]
A1: [答案]
... (共 5 組)

---
請回覆修改建議，格式：「P2 選擇題答案應為 B，因為⋯⋯」
```

After outputting the brief, say:
> 「請把這段貼到 GPT 或 Claude.ai 核查，回來告訴我哪裡要修改，或說『沒問題』就繼續。」

---

## Step 5 — Apply corrections + Claude Design Brief

> **STOP after this step.** Output the Design Brief, then wait for the user to return with the HTML from Claude Design.

1. Apply all corrections from the fact-check step.
2. Output a **Claude Design Brief** formatted for pasting into [claude.ai](https://claude.ai) (Projects → artifact).

### Claude Design Brief template

```
請製作一份 A4 學習單 HTML。

**輸出規格**
- 自包含 HTML（所有 CSS 在 <style> 內，不使用外部連結）
- 字型：system-ui 或 "Noto Sans TC"（不要 Google Fonts）
- 列印：@page { size: A4 portrait; margin: 14mm; }
- 每個活動區塊加 page-break-inside: avoid
- footer 用 margin-top 置於正常文件流，不用 position: absolute
- 螢幕預覽：白色卡片，最大寬度 210mm，陰影

---
**基本資訊**
標題：[title]
年級：[grade]（[age range] 歲）
語言：繁體中文
封面色：[hex]
封面 emoji：[emoji]
角色設定：你是一位 [role name]

---
**頁面結構（共 [N] 頁）**

P1 封面
- 大 emoji：[emoji]
- 角色說明：你是一位 [role]
- 任務宣言：🎯 你的任務：[mission statement]
- 姓名欄、日期欄
- 填空：今天最想發現的是：___________
- 頁尾：worksheet.bookwormtw.com · 書蟲學習單 · 1

P2 任務一：[title]
說明：[intro text, 2–3 sentences]
活動 A — 結構化觀察表：
  欄位：顏色 ___ / 形狀 ___ / 像什麼 ___
  勾選：☐ 規則 ☐ 不規則 ☐ 會發光 ☐ 透明 ☐ 有條紋
活動 B — 選擇題：
  題目：[question]
  ☐ A. [opt]  ☐ B. [opt]  ☐ C. [opt]  ☐ D. [opt]
頁尾：worksheet.bookwormtw.com · 書蟲學習單 · 2

P3 任務二：[title]
[same detail level]

P[N] 成就 + 反思
成就清單：
  ☐ [ach 1]
  ☐ [ach 2]
  ☐ [ach 3]
  ⭐ [challenge ach]（金色粗體）
反思填空：今天最讓我驚訝的是：___________
頁尾：worksheet.bookwormtw.com · 書蟲學習單 · [N]

---
**配色（暖棕色系）**
主色：#8a5f33　次色：#c4925a　淺棕：#d5b07c　背景：#f3e8d5
虛線框：#c4925a　成就框：#f0c060

**活動框樣式建議**
- 觀察表：solid border #e6cfa9，圓角 3mm
- 選擇題：左側 4px solid #d5b07c，背景 #fffbf5
- 創作框：dashed border #c4925a，背景 #fffdf9
- 成就框：solid #f0c060，背景 #fffbf0
- 畫圖區：dashed border #c4925a，min-height 55mm
- 作文區：橫線（repeating-linear-gradient），min-height 48mm
```

After outputting the brief, say:
> 「請把這段貼到 Claude.ai（建議開新對話，用 Project），確認 artifact 版面 OK 後，把完整 HTML 複製回來給我。」

---

## Step 6 — Receive HTML + integrate

User pastes back the HTML from Claude Design. Then:

1. **Save HTML** → `public/printable/<slug>-zh.html`
   - If the HTML uses Google Fonts links, replace with `system-ui` fallback
   - If it uses external image URLs, remove or replace with emoji/inline SVG

2. **Write MD files** — Chinese + English (see schema below)

3. **git add + commit + push**

### MD frontmatter schema

**Chinese** → `src/content/worksheets/zh/<slug>.md`

```yaml
---
title: <主題>學習單 — <副標>
description: <120–160字，含年級、關鍵字、"附免費 PDF 下載">
topic: <existing-topic-slug>
tags: [<3–6 個>]
grade: middle
lang: zh
slug: <slug>
pdf: /pdfs/<slug>-zh.pdf
previewHtml: /printable/<slug>-zh.html
coverEmoji: <emoji>
coverColor: "<hex>"
translationOf: <slug>-en
publishedAt: <YYYY-MM-DD>
featured: false
faq:
  - q: <真實搜尋問題 1>
    a: <自含式答案>
  - q: ...  # 共 5 組
---

## 這份學習單在教什麼？
## 為什麼我想為女兒做這份學習單？
## 建議搭配的延伸活動
```

**English** → `src/content/worksheets/en/<slug>-en.md`
Same structure, `lang: en`, `slug: <slug>-en`, `topic: <topic>-en`, `translationOf: <slug>`. FAQs match English-language search queries.

### YAML safety rules
- Never start a q/a value with a leading `"`. Say `The word foo means ...` not `"Foo" means ...`
- `coverColor` must be in double quotes (hex has `#`)
- `publishedAt` in `YYYY-MM-DD`
- Always 5 FAQ entries. Mix worksheet-about questions (grade, print) with subject-fact questions.

---

## Content design rules (reference — use when writing the Design Brief)

### Voice
- Story voice, not textbook. Imagine explaining to a curious 9-year-old.
- Each paragraph ≤ 3–4 lines. Short sentences.
- Scannable: kids should be able to start the activity after a quick glance.

### Activities — do's and don'ts

| ❌ Don't | ✅ Do instead |
|---|---|
| 「請寫下你的觀察」(open-ended) | Structured fields: 顏色＿＿ / 形狀＿＿ / 像＿＿ / ☐規則 ☐不規則 |
| 傳統問答題 | 選擇題（≤4 選項，至少 1 個有趣選項）|
| 長篇敘述作答 | 勾選 / 填一個詞 / 畫圖 |
| 「畫一畫」 | 命名 + 能力設定 + 畫圖（任務導向）|
| 4+ 活動在同一頁 | 1 heading + 2–3 activity blocks per page max |

### Content budget per page (for page count planning)

| Block type | Approx height |
|---|---|
| H2 heading | ~10mm |
| Short paragraph (3–4 lines) | ~20mm |
| Observation grid | ~30mm |
| Activity box | ~40mm |
| Draw box (min 55mm) | ~65mm |
| Lined writing area | ~65mm |
| Achievement list (4 items) | ~35mm |
| Footer | ~15mm |

If a page's estimated height > **250mm**: split or cut one block.

---

## Fallback — self-generated HTML (skip Claude Design)

Use this when the user does **not** want to go through Claude Design. Write `public/printable/<slug>-zh.html` directly using the template below, then proceed to Step 7.

**Print layout rules — never break these:**
```css
/* ❌ Never */
min-height: 260mm;
position: absolute; bottom: 0;

/* ✅ Always */
.page { page-break-after: always; padding-bottom: 20mm; }
.box, .lined, .quiz, .obs-grid, .achievement, .draw-box, .create-box { page-break-inside: avoid; }
footer { margin-top: 10mm; }
```

```html
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>{{TITLE}} · 書蟲學習單</title>
<style>
  @page { size: A4 portrait; margin: 14mm 14mm 16mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: "Noto Sans TC", "PingFang TC", system-ui, sans-serif; color: #2f2018; }
  .page { page-break-after: always; padding-bottom: 20mm; }
  .page:last-child { page-break-after: auto; }
  .box, .lined, .quiz, .obs-grid, .achievement, .draw-box, .create-box, .mission-box, .name-fields { page-break-inside: avoid; }
  h1 { font-size: 28pt; margin: 0 0 4mm; color: #6b4a2a; line-height: 1.1; }
  h2 { font-size: 16pt; margin: 6mm 0 3mm; color: #8a5f33; border-bottom: 2px dashed #d5b07c; padding-bottom: 2mm; }
  h3 { font-size: 12pt; margin: 4mm 0 2mm; color: #6b4a2a; }
  p, li, label { font-size: 11pt; line-height: 1.7; }
  .hero { background: {{COVER_COLOR}}; border-radius: 8mm; padding: 10mm; text-align: center; margin-bottom: 6mm; }
  .hero .emoji { font-size: 64pt; line-height: 1; }
  .mission-role { font-size: 13pt; color: #8a5f33; margin: 3mm 0 1mm; }
  .mission-box { background: rgba(255,255,255,0.7); border: 2px solid #d5b07c; border-radius: 4mm; padding: 4mm 6mm; margin-top: 4mm; font-size: 12pt; text-align: left; }
  .name-fields { margin-top: 6mm; }
  .field { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 45mm; height: 7mm; margin: 0 2mm; }
  .fill { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 22mm; padding: 0 2mm; }
  .box { border: 1.5px dashed #c4925a; border-radius: 3mm; padding: 4mm; margin: 3mm 0; }
  .lined { background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 8mm, #e6cfa9 8mm, #e6cfa9 8.5mm); min-height: 48mm; padding: 2mm 4mm; }
  .draw-box { border: 1.5px dashed #c4925a; border-radius: 3mm; min-height: 55mm; margin: 3mm 0; }
  .create-box { border: 2px solid #c4925a; border-radius: 4mm; padding: 5mm; margin: 4mm 0; background: #fffdf9; }
  .obs-grid { border: 1.5px solid #e6cfa9; border-radius: 3mm; padding: 4mm; margin: 3mm 0; }
  .obs-field { margin: 2mm 0; }
  .obs-label { display: inline-block; width: 14mm; color: #8a5f33; font-weight: 600; font-size: 11pt; }
  .obs-checks { margin-top: 3mm; font-size: 11pt; display: flex; flex-wrap: wrap; gap: 4mm; }
  .quiz { background: #fffbf5; border-left: 4px solid #d5b07c; padding: 4mm 5mm; margin: 4mm 0; border-radius: 0 3mm 3mm 0; }
  .quiz-q { margin: 0 0 3mm; font-size: 12pt; }
  .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; font-size: 11pt; }
  .achievement { background: #fffbf0; border: 2px solid #f0c060; border-radius: 4mm; padding: 5mm; margin: 5mm 0; }
  .achievement h3 { margin: 0 0 3mm; }
  .ach-item { display: block; font-size: 11pt; padding: 1.5mm 0; }
  .ach-star { color: #8a5f33; font-weight: 600; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
  .buddy { font-size: 32pt; text-align: right; margin: 4mm 0 0; }
  footer { margin-top: 10mm; border-top: 1px solid #e6cfa9; padding-top: 3mm; display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt; color: #a9773f; }
  .screen-only { display: none; }
  @media screen {
    body { background: #f3e8d5; padding: 20px; }
    .page { background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin: 0 auto 20px; max-width: 210mm; padding: 14mm 14mm 20mm; }
    .screen-only { display: block; text-align: center; padding: 10px 0 20px; color: #6b4a2a; font-size: 13px; }
  }
  @media print { body { background: none; } .screen-only { display: none; } }
</style>
</head>
<body>
<div class="screen-only">按 ⌘P 列印，或存成 PDF。</div>
<!-- pages go here -->
</body>
</html>
```

For English version: `lang="en"`, screen-only hint in English, footer `"Bookworm Worksheets"`.

---

## SVG icon library

All icons live in `public/icons/preview.html` for browsing. Open that file in a browser to see the full library visually. When building a printable worksheet, copy the `<svg>…</svg>` block directly into HTML — no external files needed, prints crisply.

**Available icons by ID:**

| ID | Description | Best used for |
|---|---|---|
| `star-badge` | Gold star medal | Achievement unlock |
| `done-badge` | Green checkmark badge | Completion achievement |
| `challenge-star` | Large 8-point star | Star/challenge achievement |
| `explore-badge` | Pentagon + magnifier | Explore achievement |
| `magnifier` | Magnifying glass with crystal inside | Observe activity heading |
| `pencil` | Pencil icon | Write/record activity |
| `think` | Brain with gear | Judge/decide activity |
| `create` | Magic wand + sparkles | Creative activity |
| `question` | Speech bubble with ? | Quiz / question block |
| `observe` | Eye icon | Observation block |
| `globe` | Earth with continents | Country / world topics |
| `crystal` | Faceted gemstone | Minerals topic |
| `compass` | Compass rose | Explore / travel topics |
| `explorer-hat` | Safari/explorer hat | Travel / fieldwork topics |
| `crystal-buddy` | Crystal with face | Minerals mascot buddy |
| `owl-buddy` | Owl with glasses | General mascot buddy |
| `mission-frame` | Dashed border with corner gems | Mission briefing box |
| `mohs-scale` | Hardness bar chart 1–9 | Minerals worksheet only |

**Usage pattern** — set size via inline style or CSS:
```html
<!-- 48×48px inline in a heading or activity box -->
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px;vertical-align:middle">
  ...paste SVG contents here...
</svg>
```

**Key SVG snippets for the most common use-cases:**

### crystal-buddy (礦石精靈 mascot)
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px">
  <path d="M32 8 L50 24 L44 52 L20 52 L14 24 Z" fill="#d5b07c" stroke="#8a5f33" stroke-width="2.5"/>
  <path d="M32 8 L50 24 L36 26 Z" fill="white" opacity="0.35"/>
  <circle cx="26" cy="33" r="4" fill="white" stroke="#8a5f33" stroke-width="1.5"/>
  <circle cx="38" cy="33" r="4" fill="white" stroke="#8a5f33" stroke-width="1.5"/>
  <circle cx="27" cy="33" r="2" fill="#2f2018"/>
  <circle cx="39" cy="33" r="2" fill="#2f2018"/>
  <path d="M25 42 Q32 47 39 42" fill="none" stroke="#8a5f33" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="28" cy="32" r="1" fill="white"/>
  <circle cx="40" cy="32" r="1" fill="white"/>
</svg>
```

### owl-buddy (貓頭鷹教授 mascot)
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px">
  <ellipse cx="32" cy="40" rx="18" ry="20" fill="#d5b07c" stroke="#8a5f33" stroke-width="2.5"/>
  <circle cx="32" cy="22" r="16" fill="#c4925a" stroke="#8a5f33" stroke-width="2.5"/>
  <path d="M20 10 L17 4 L24 9" fill="#c4925a" stroke="#8a5f33" stroke-width="2"/>
  <path d="M44 10 L47 4 L40 9" fill="#c4925a" stroke="#8a5f33" stroke-width="2"/>
  <circle cx="26" cy="22" r="6" fill="white" stroke="#8a5f33" stroke-width="2"/>
  <circle cx="38" cy="22" r="6" fill="white" stroke="#8a5f33" stroke-width="2"/>
  <circle cx="26" cy="22" r="7" fill="none" stroke="#8a5f33" stroke-width="1.5"/>
  <circle cx="38" cy="22" r="7" fill="none" stroke="#8a5f33" stroke-width="1.5"/>
  <line x1="33" y1="22" x2="31" y2="22" stroke="#8a5f33" stroke-width="1.5"/>
  <circle cx="27" cy="22" r="3" fill="#2f2018"/>
  <circle cx="39" cy="22" r="3" fill="#2f2018"/>
  <circle cx="28" cy="21" r="1" fill="white"/>
  <circle cx="40" cy="21" r="1" fill="white"/>
  <path d="M32 26 L29 30 L35 30 Z" fill="#f0a030"/>
</svg>
```

### star-badge (achievement — star)
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:40px">
  <circle cx="32" cy="32" r="28" fill="#fffbf0" stroke="#c4925a" stroke-width="3"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#d5b07c" stroke-width="1.5" stroke-dasharray="3,2"/>
  <path d="M32 13 L35.9 24.5 H48.1 L38.1 31.5 L42 43 L32 36 L22 43 L25.9 31.5 L15.9 24.5 H28.1 Z"
        fill="#f0c060" stroke="#c4925a" stroke-width="1.5" stroke-linejoin="round"/>
</svg>
```

### done-badge (achievement — completed)
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:40px">
  <circle cx="32" cy="32" r="28" fill="#f0f9f0" stroke="#6a9a5a" stroke-width="3"/>
  <circle cx="32" cy="32" r="20" fill="#d4ecd4" stroke="#6a9a5a" stroke-width="1.5"/>
  <path d="M20 32 L28 40 L44 24" stroke="#3a7a3a" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### crystal (礦石晶體 — inline decoration)
```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px">
  <path d="M32 6 L52 26 L44 56 L20 56 L12 26 Z" fill="#d5b07c" stroke="#8a5f33" stroke-width="2.5"/>
  <path d="M32 6 L52 26 L32 30 Z" fill="white" opacity="0.35"/>
  <path d="M32 6 L12 26 L32 30 Z" fill="#8a5f33" opacity="0.2"/>
  <path d="M22 16 L30 8" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
  <circle cx="24" cy="20" r="2" fill="white" opacity="0.6"/>
</svg>
```

### mission-frame (任務框 border)
```html
<!-- Use as a wrapper around mission text — scale viewBox width to your content -->
<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <rect x="3" y="3" width="114" height="54" rx="6" fill="#fffbf0" stroke="#c4925a" stroke-width="2.5" stroke-dasharray="6,3"/>
  <path d="M10 6 L14 10 L10 14 L6 10 Z" fill="#d5b07c"/>
  <path d="M110 6 L114 10 L110 14 L106 10 Z" fill="#d5b07c"/>
  <path d="M10 54 L14 50 L10 46 L6 50 Z" fill="#d5b07c"/>
  <path d="M110 54 L114 50 L110 46 L106 50 Z" fill="#d5b07c"/>
</svg>
```

**Icon placement tip** — float a buddy to the right of a section heading:
```html
<div style="display:flex; align-items:flex-start; gap:8mm; margin-bottom:4mm;">
  <div style="flex:1">
    <h2>🔍 任務一：觀察礦石</h2>
    <p>仔細觀察...</p>
  </div>
  <!-- crystal-buddy SVG here, width:48px -->
</div>
```

---

## Step 7 — Report back

After Step 6 is complete (HTML saved + MD files written + pushed):

1. **File paths**: `public/printable/<slug>-zh.html` + MD files
2. **Mode used**: 任務型 or 知識型，brief reason why
3. **One sentence**: what makes this worksheet different from existing ones
4. **Print reminder**:
   > 「請在瀏覽器開啟 `public/printable/<slug>-zh.html`，按 ⌘P，確認 **N 頁**，沒有內容被裁切。確認 OK 後，把它存成 PDF 放進 `public/pdfs/<slug>-zh.pdf`，學習單就完整上線了。」

---

## Don'ts

- Don't advance past Step 4 without outputting the Fact-Check Brief and waiting.
- Don't advance past Step 5 without outputting the Design Brief and waiting.
- Don't invent facts. WebSearch if unsure. Flag uncertainties explicitly.
- Don't skip the FAQ. 5 per language, always.
- Don't use external image URLs or Google Fonts links in any saved HTML (offline print must work).
- Don't forget `translationOf` linking both MD files together.
- Don't use rare emoji flags or complex ZWJ sequences on covers — cross-platform rendering is inconsistent.
- Don't put `min-height` on `.page`. Don't use `position: absolute` for footer.
- Don't put 4+ content blocks on one page.
