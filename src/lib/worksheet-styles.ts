import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { Lang } from '../i18n/ui';

export interface WorksheetStyleOverride {
  id: string;
  label?: string;
  description?: string;
  order?: number;
  previewHtml?: string;
  pdf?: string;
}

export interface WorksheetStyle {
  id: string;
  label: string;
  description?: string;
  previewHtml: string;
  pdf?: string;
}

const LABEL_MAP: Record<string, Record<Lang, string>> = {
  'boy-explorer': {
    zh: '藍調版',
    en: 'Blue Edition',
  },
  'girl-mission': {
    zh: '玫瑰版',
    en: 'Rose Edition',
  },
};

const STYLE_ORDER = ['boy-explorer', 'girl-mission'];

function titleCaseStyle(id: string) {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function defaultStyleLabel(id: string, lang: Lang) {
  return LABEL_MAP[id]?.[lang] ?? titleCaseStyle(id);
}

function publicPathExists(publicPath: string) {
  return existsSync(path.join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}

export function discoverWorksheetStyles({
  slug,
  lang,
  overrides = [],
}: {
  slug: string;
  lang: Lang;
  overrides?: WorksheetStyleOverride[];
}): WorksheetStyle[] {
  const printableDir = path.join(process.cwd(), 'public', 'printable', slug);
  const prefix = `${lang}-`;

  const htmlFiles = existsSync(printableDir)
    ? readdirSync(printableDir)
        .filter((file) => file.startsWith(prefix) && file.endsWith('.html'))
        .sort((a, b) => a.localeCompare(b))
    : [];

  return htmlFiles
    .map((file) => {
      const id = file.slice(prefix.length, -'.html'.length);
      const override = overrides.find((item) => item.id === id);
      const previewHtml = override?.previewHtml ?? `/printable/${slug}/${file}`;
      const defaultPdf = `/pdfs/${slug}/${lang}-${id}.pdf`;
      const pdf = override?.pdf ?? (publicPathExists(defaultPdf) ? defaultPdf : undefined);

      return {
        id,
        label: override?.label ?? defaultStyleLabel(id, lang),
        description: override?.description,
        previewHtml,
        pdf,
        order: override?.order ?? STYLE_ORDER.indexOf(id),
      };
    })
    .sort((a, b) => {
      const aOrder = a.order === -1 ? Number.MAX_SAFE_INTEGER : a.order;
      const bOrder = b.order === -1 ? Number.MAX_SAFE_INTEGER : b.order;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.label.localeCompare(b.label);
    })
    .map(({ order: _order, ...style }) => style);
}
