---
name: create-worksheet
description: Create a new bilingual (zh-TW + English) worksheet for the Bookworm Worksheets site (worksheet.bookwormtw.com). Guides the user through topic, learning objectives, activity format, and illustration style, then writes the site MD content and a printable HTML worksheet. Trigger when the user says "做一份學習單", "做一張學習單", "新增學習單", "加一份學習單", "create a worksheet", "new worksheet", or mentions they want to add a country / mineral / animal / any new subject to the site.
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

## Step 4 — Content design rules

Apply these to both MD files and printable HTML.

### Voice
- Story voice, not textbook. Imagine explaining to a curious 9-year-old.
- Each paragraph ≤ 3–4 lines. Use short sentences.
- Page must be scannable even without full reading — kids should be able to start the activity after a quick glance.

### Activities — do's and don'ts

| ❌ Don't | ✅ Do instead |
|---|---|
| 「請寫下你的觀察」(open) | Structured fields: 顏色＿＿ / 形狀＿＿ / 像＿＿ / ☐規則 ☐不規則 |
| 傳統問答題 | 選擇題（≤4 選項，至少 1 個有趣選項）|
| 長篇敘述作答 | 勾選 / 填一個詞 / 畫圖 |
| 「畫一畫」 | 命名 + 能力設定 + 畫圖（任務導向）|
| 4+ 活動在同一頁 | 1 heading + 2–3 activity blocks per page max |

### Observation block standard format
```html
<div class="obs-grid">
  <div class="obs-field"><span class="obs-label">顏色</span><span class="fill"></span></div>
  <div class="obs-field"><span class="obs-label">形狀</span><span class="fill"></span></div>
  <div class="obs-field"><span class="obs-label">像什麼</span><span class="fill"></span></div>
  <div class="obs-checks">
    ☐ 規則  ☐ 不規則  ☐ 會發光  ☐ 透明  ☐ 有條紋
  </div>
</div>
```

### Multiple choice standard format
```html
<div class="quiz">
  <p class="quiz-q">❓ <strong>問題文字</strong></p>
  <div class="quiz-options">
    <label>☐ A. 選項一</label>
    <label>☐ B. 選項二</label>
    <label>☐ C. 選項三（有趣或幽默的選項）</label>
    <label>☐ D. 選項四</label>
  </div>
</div>
```

### Creative naming standard format
```html
<div class="box create-box">
  <p>🌟 幫你最喜歡的礦石取一個名字，給它一個超能力！</p>
  <p>礦石名字：<span class="fill" style="min-width:60mm"></span></p>
  <p>超能力：<span class="fill" style="min-width:80mm"></span></p>
  <div class="draw-box" style="min-height:55mm; margin-top:4mm;"></div>
</div>
```

### Achievement system standard format (last content block, before footer)
```html
<div class="achievement">
  <h3>🏅 今日成就</h3>
  <label class="ach-item">☐ 我找到了一顆讓我印象深刻的礦石</label>
  <label class="ach-item">☐ 我完成了所有主任務</label>
  <label class="ach-item">☐ 我幫礦石取了一個超棒的名字</label>
  <label class="ach-item ach-star">⭐ 我找到了一顆形狀特別的礦石，並且知道它的名字</label>
</div>
```

---

## Step 5 — Write the site MD files

### Frontmatter schema

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

## Step 6 — Write the printable HTML

`public/printable/<slug>-zh.html` (and `-en.html` for bilingual)

### Print layout rules (critical — GPT's guide v2.0 incorporated)

**❌ Never:**
```css
min-height: 260mm;          /* causes content to be pushed off-page */
position: absolute; bottom: 0;  /* footer gets orphaned or overlaps */
```

**✅ Always:**
```css
.page {
  page-break-after: always;
  padding-bottom: 20mm;   /* breathing room, not min-height */
}
.box, .lined, .quiz, .obs-grid, .achievement, .draw-box, .create-box {
  page-break-inside: avoid;  /* activity blocks never split across pages */
}
footer {
  margin-top: 10mm;       /* normal document flow, not absolute */
}
```

**Content budget per page** (1 heading + max 2–3 blocks):

| Block type | Approx height |
|---|---|
| H2 heading | ~10mm |
| Short paragraph (3–4 lines) | ~20mm |
| Observation grid | ~30mm |
| Activity box (min 30mm) | ~40mm |
| Draw box (min 55mm) | ~65mm |
| Lined writing area | ~65mm |
| Achievement list (4 items) | ~35mm |
| Footer | ~15mm |

If a page's estimated height > **250mm**: split into two pages or cut one block.

**Manual page break when needed:**
```html
<div style="page-break-before: always;"></div>
```

### Mission cover template (任務型)

```html
<section class="page">
  <div class="hero">
    <div class="emoji">{{COVER_EMOJI}}</div>
    <div class="mission-role">你是一位 <strong>{{ROLE}}</strong></div>
    <h1>{{TITLE}}</h1>
    <div class="mission-box">
      🎯 你的任務：{{MISSION_STATEMENT}}
    </div>
  </div>
  <div class="name-fields">
    <p>探險家姓名：<span class="field"></span> 　日期：<span class="field"></span></p>
    <p>今天我最想發現的是：<span class="field" style="min-width:90mm"></span></p>
  </div>
  <footer>worksheet.bookwormtw.com · 書蟲學習單</footer>
</section>
```

### Full printable template

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

  /* ── Page structure ── */
  .page {
    page-break-after: always;
    padding-bottom: 20mm;   /* NO min-height — content determines height */
  }
  .page:last-child { page-break-after: auto; }

  /* ── Prevent activity blocks from splitting mid-print ── */
  .box, .lined, .quiz, .obs-grid, .achievement,
  .draw-box, .create-box, .mission-box, .name-fields {
    page-break-inside: avoid;
  }

  /* ── Typography ── */
  h1 { font-size: 28pt; margin: 0 0 4mm; color: #6b4a2a; line-height: 1.1; }
  h2 { font-size: 16pt; margin: 6mm 0 3mm; color: #8a5f33; border-bottom: 2px dashed #d5b07c; padding-bottom: 2mm; }
  h3 { font-size: 12pt; margin: 4mm 0 2mm; color: #6b4a2a; }
  p, li, label { font-size: 11pt; line-height: 1.7; }

  /* ── Hero / Cover ── */
  .hero { background: {{COVER_COLOR}}; border-radius: 8mm; padding: 10mm; text-align: center; margin-bottom: 6mm; }
  .hero .emoji { font-size: 64pt; line-height: 1; }
  .mission-role { font-size: 13pt; color: #8a5f33; margin: 3mm 0 1mm; }
  .mission-box { background: rgba(255,255,255,0.7); border: 2px solid #d5b07c; border-radius: 4mm; padding: 4mm 6mm; margin-top: 4mm; font-size: 12pt; text-align: left; }

  /* ── Input fields ── */
  .name-fields { margin-top: 6mm; }
  .field { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 45mm; height: 7mm; margin: 0 2mm; }
  .fill { display: inline-block; border-bottom: 1.5px solid #a9773f; min-width: 22mm; padding: 0 2mm; }

  /* ── Activity boxes ── */
  .box { border: 1.5px dashed #c4925a; border-radius: 3mm; padding: 4mm; margin: 3mm 0; }
  .lined { background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 8mm, #e6cfa9 8mm, #e6cfa9 8.5mm); min-height: 48mm; padding: 2mm 4mm; }
  .draw-box { border: 1.5px dashed #c4925a; border-radius: 3mm; min-height: 55mm; margin: 3mm 0; }
  .create-box { border: 2px solid #c4925a; border-radius: 4mm; padding: 5mm; margin: 4mm 0; background: #fffdf9; }

  /* ── Observation grid ── */
  .obs-grid { border: 1.5px solid #e6cfa9; border-radius: 3mm; padding: 4mm; margin: 3mm 0; }
  .obs-field { margin: 2mm 0; }
  .obs-label { display: inline-block; width: 14mm; color: #8a5f33; font-weight: 600; font-size: 11pt; }
  .obs-checks { margin-top: 3mm; font-size: 11pt; display: flex; flex-wrap: wrap; gap: 4mm; }

  /* ── Quiz / multiple choice ── */
  .quiz { background: #fffbf5; border-left: 4px solid #d5b07c; padding: 4mm 5mm; margin: 4mm 0; border-radius: 0 3mm 3mm 0; }
  .quiz-q { margin: 0 0 3mm; font-size: 12pt; }
  .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; font-size: 11pt; }
  .quiz-options label { padding: 1mm 0; }

  /* ── Achievement ── */
  .achievement { background: #fffbf0; border: 2px solid #f0c060; border-radius: 4mm; padding: 5mm; margin: 5mm 0; }
  .achievement h3 { margin: 0 0 3mm; }
  .ach-item { display: block; font-size: 11pt; padding: 1.5mm 0; }
  .ach-star { color: #8a5f33; font-weight: 600; }

  /* ── Layout helpers ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
  .buddy { font-size: 32pt; text-align: right; margin: 4mm 0 0; }

  /* ── Footer — normal flow, NOT absolute ── */
  footer {
    margin-top: 10mm;
    border-top: 1px solid #e6cfa9;
    padding-top: 3mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8.5pt;
    color: #a9773f;
  }

  /* ── Screen preview ── */
  .screen-only { display: none; }
  @media screen {
    body { background: #f3e8d5; padding: 20px; }
    .page { background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin: 0 auto 20px; max-width: 210mm; padding: 14mm 14mm 20mm; }
    .screen-only { display: block; text-align: center; padding: 10px 0 20px; color: #6b4a2a; font-size: 13px; }
  }
  @media print {
    body { background: none; }
    .screen-only { display: none; }
  }
</style>
</head>
<body>

<div class="screen-only">按 ⌘P 列印，或存成 PDF。列印時不會出現這行字。</div>

<!-- PAGE 1 · Cover / Mission -->
<section class="page">
  <div class="hero">
    <div class="emoji">{{COVER_EMOJI}}</div>
    <div class="mission-role">你是一位 <strong>{{ROLE}}</strong></div>
    <h1>{{TITLE}}</h1>
    <div class="mission-box">🎯 你的任務：{{MISSION_STATEMENT}}</div>
  </div>
  <div class="name-fields">
    <p>探險家姓名：<span class="field"></span> 　日期：<span class="field"></span></p>
    <p>今天最想發現的：<span class="field" style="min-width:90mm"></span></p>
  </div>
  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>
    <span>worksheet.bookwormtw.com · 書蟲學習單</span>
    <span>{{TITLE}}</span>
    <span>1</span>
  </footer>
</section>

<!-- PAGE 2 · Observe (任務型) / Learn (知識型) -->
<section class="page">
  <h2>🔍 任務一：{{MISSION_1_TITLE}}</h2>
  <p>{{MISSION_1_INTRO}}</p>

  <div class="obs-grid">
    <div class="obs-field"><span class="obs-label">顏色</span><span class="fill" style="min-width:50mm"></span></div>
    <div class="obs-field"><span class="obs-label">形狀</span><span class="fill" style="min-width:50mm"></span></div>
    <div class="obs-field"><span class="obs-label">像什麼</span><span class="fill" style="min-width:50mm"></span></div>
    <div class="obs-checks">
      ☐ 規則　☐ 不規則　☐ 會發光　☐ 透明　☐ 有條紋
    </div>
  </div>

  <div class="quiz">
    <p class="quiz-q">❓ <strong>{{QUIZ_1_QUESTION}}</strong></p>
    <div class="quiz-options">
      <label>☐ A. {{OPT_A}}</label>
      <label>☐ B. {{OPT_B}}</label>
      <label>☐ C. {{OPT_C}}（有趣選項）</label>
      <label>☐ D. {{OPT_D}}</label>
    </div>
  </div>

  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>
    <span>worksheet.bookwormtw.com · 書蟲學習單</span>
    <span>{{TITLE}}</span>
    <span>2</span>
  </footer>
</section>

<!-- PAGE 3 · Judge + Record -->
<section class="page">
  <h2>🧠 任務二：{{MISSION_2_TITLE}}</h2>
  <p>{{MISSION_2_INTRO}}</p>

  <!-- Knowledge content or second observation -->
  <div class="box">
    <h3>{{SUBSECTION_TITLE}}</h3>
    <p>{{CONTENT}}</p>
  </div>

  <div class="quiz">
    <p class="quiz-q">❓ <strong>{{QUIZ_2_QUESTION}}</strong></p>
    <div class="quiz-options">
      <label>☐ A. {{OPT_A}}</label>
      <label>☐ B. {{OPT_B}}</label>
      <label>☐ C. {{OPT_C}}</label>
      <label>☐ D. {{OPT_D}}</label>
    </div>
  </div>

  <div class="buddy">{{BUDDY_EMOJI}}</div>
  <footer>
    <span>worksheet.bookwormtw.com · 書蟲學習單</span>
    <span>{{TITLE}}</span>
    <span>3</span>
  </footer>
</section>

<!-- PAGE 4 · Create + Achievement -->
<section class="page">
  <h2>✨ 任務三：{{MISSION_3_TITLE}}</h2>

  <div class="create-box">
    <p>🌟 {{CREATE_PROMPT}}</p>
    <p>名字：<span class="fill" style="min-width:60mm"></span></p>
    <p>超能力：<span class="fill" style="min-width:80mm"></span></p>
    <div class="draw-box"></div>
  </div>

  <!-- Open challenge -->
  <div class="box">
    <h3>🔭 開放探索（沒有標準答案）</h3>
    <p>{{OPEN_CHALLENGE}}</p>
    <div class="lined"></div>
  </div>

  <!-- Achievement — always last content block -->
  <div class="achievement">
    <h3>🏅 今日成就</h3>
    <label class="ach-item">☐ {{ACH_1}}</label>
    <label class="ach-item">☐ {{ACH_2}}</label>
    <label class="ach-item">☐ {{ACH_3}}</label>
    <label class="ach-item ach-star">⭐ {{ACH_CHALLENGE}}</label>
  </div>

  <!-- One-line reflection -->
  <p style="margin-top:5mm;">今天最讓我驚訝的是：<span class="fill" style="min-width:100mm"></span></p>

  <footer>
    <span>worksheet.bookwormtw.com · 書蟲學習單</span>
    <span>{{TITLE}}</span>
    <span>4</span>
  </footer>
</section>

<!-- PAGE 5 · Answer key (optional) -->
<section class="page">
  <h2>給大人的解答與延伸</h2>
  <p><strong>選擇題答案：</strong>{{ANSWERS}}</p>
  <p><strong>延伸活動：</strong>{{EXTENSIONS}}</p>
  <footer>
    <span>worksheet.bookwormtw.com · 書蟲學習單</span>
    <span>{{TITLE}}</span>
    <span>5</span>
  </footer>
</section>

</body>
</html>
```

For English version: `lang="en"`, screen-only hint in English, footer `"Bookworm Worksheets"`.

---

## Step 7 — Print verification checklist (do before reporting done)

Estimate each page's height by summing block sizes from the content budget table. For each `.page`:

- [ ] Estimated height < 250mm?
- [ ] No block uses `position: absolute`?
- [ ] Footer is in normal document flow (last element, `margin-top`)?
- [ ] Every activity block has `page-break-inside: avoid` class?
- [ ] No more than 3 activity blocks on one page?

Tell the user explicitly:
> 「請在瀏覽器開啟 `public/printable/<slug>-zh.html`，按 ⌘P，確認預覽顯示 **N 頁**，沒有內容被裁切或區塊被切一半。如果有破版，告訴我是第幾頁。」

---

## Step 8 — Report back

1. **File paths**: site MD pages + printable HTML
2. **Page count**: e.g. "中文 4 頁 / 英文 4 頁"
3. **Mode used**: 任務型 or 知識型，brief reason why
4. **One sentence**: what makes this worksheet different from existing ones
5. **Verify flag**: anything to double-check for accuracy

---

## Don'ts

- Don't write MD + HTML simultaneously — show the plan (Step 3) and wait for OK.
- Don't invent facts. WebSearch if unsure. Flag uncertainties in Step 8.
- Don't skip the FAQ. 5 per language, always.
- Don't use external image URLs in printable HTML (offline print must work).
- Don't forget `translationOf` linking both MD files together.
- Don't use rare emoji flags or complex ZWJ sequences on covers — cross-platform rendering is inconsistent.
- Don't put `min-height` on `.page`. Don't use `position: absolute` for footer.
- Don't put 4+ content blocks on one page.
