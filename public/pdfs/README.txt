Worksheet PDFs live in per-theme folders.

Expected structure:
  /pdfs/earths-treasures/zh-mission-journal.pdf
  /pdfs/earths-treasures/zh-adventure-guide.pdf
  /pdfs/earths-treasures/en-mission-journal.pdf
  /pdfs/earths-treasures/en-adventure-guide.pdf
  /pdfs/finland/zh-mission-journal.pdf
  /pdfs/finland/en-adventure-guide.pdf

Rule:
  Put every PDF for one theme in the same folder and include both the language and style in the filename.

Use `npm run audit:worksheets` to check which required HTML files are missing and which PDFs are still optional warnings.
