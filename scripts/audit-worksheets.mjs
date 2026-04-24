import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const worksheetsDir = path.join(root, 'src', 'content', 'worksheets');
const langs = ['zh', 'en'];

const slugs = readdirSync(worksheetsDir)
  .filter((name) => statSync(path.join(worksheetsDir, name)).isDirectory())
  .sort();

const errors = [];
const warnings = [];

for (const slug of slugs) {
  for (const lang of langs) {
    const mdPath = path.join(worksheetsDir, slug, `${lang}.md`);
    if (!existsSync(mdPath)) {
      errors.push({
        slug,
        lang,
        kind: 'md',
        path: path.relative(root, mdPath),
      });
      continue;
    }

    const printableDir = path.join(root, 'public', 'printable', slug);
    const pdfDir = path.join(root, 'public', 'pdfs', slug);
    const prefix = `${lang}-`;

    const htmlFiles = existsSync(printableDir)
      ? readdirSync(printableDir).filter((file) => file.startsWith(prefix) && file.endsWith('.html'))
      : [];

    if (htmlFiles.length === 0) {
      errors.push({
        slug,
        lang,
        kind: 'html',
        path: `public/printable/${slug}/${lang}-*.html`,
      });
    }

    for (const htmlFile of htmlFiles) {
      const styleId = htmlFile.slice(prefix.length, -'.html'.length);
      const pdfPath = path.join(pdfDir, `${lang}-${styleId}.pdf`);
      if (!existsSync(pdfPath)) {
        warnings.push({
          slug,
          lang,
          kind: 'pdf',
          path: path.relative(root, pdfPath),
        });
      }
    }
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('All worksheet theme files are present.');
  process.exit(0);
}

if (errors.length > 0) {
  console.log('Missing required worksheet files:\n');
  for (const item of errors) {
    console.log(`- ${item.slug} [${item.lang}] missing ${item.kind}: ${item.path}`);
  }
}

if (warnings.length > 0) {
  console.log('\nOptional files not uploaded yet:\n');
  for (const item of warnings) {
    console.log(`- ${item.slug} [${item.lang}] missing ${item.kind}: ${item.path}`);
  }
}

process.exit(errors.length > 0 ? 1 : 0);
