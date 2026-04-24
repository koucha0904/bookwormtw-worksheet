import type { Lang } from '../i18n/ui';

const SITE_URL = 'https://worksheet.bookwormtw.com';

export function abs(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path}`;
}

// ─── Shared publisher entity (reused across schemas) ──────────────────────────
function publisher(lang: Lang) {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: lang === 'zh' ? '書蟲學習單' : 'Bookworm Worksheets',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: abs('/og-default.svg'),
    },
    sameAs: ['https://bookwormtw.com'],
  };
}

// ─── Organization ─────────────────────────────────────────────────────────────
export function organizationJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    ...publisher(lang),
  };
}

// ─── WebSite ──────────────────────────────────────────────────────────────────
export function websiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: lang === 'zh' ? '書蟲學習單' : 'Bookworm Worksheets',
    url: SITE_URL,
    inLanguage: lang === 'zh' ? 'zh-TW' : 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${lang}/worksheets?q={query}`,
      },
      'query-input': 'required name=query',
    },
  };
}

// ─── Worksheet (LearningResource + Article) ───────────────────────────────────
interface WorksheetLdInput {
  lang: Lang;
  slug: string;
  title: string;
  description: string;
  grade: 'lower' | 'middle' | 'upper' | 'all';
  topicTitle: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  coverColor?: string;
  /** Optional per-worksheet OG image path (relative or absolute). Falls back to og-default.svg. */
  ogImage?: string;
}

const gradeToEducationalLevel: Record<string, string> = {
  lower: 'Grade 1-2',
  middle: 'Grade 3-4',
  upper: 'Grade 5-6',
  all: 'Elementary school',
};

export function worksheetJsonLd(input: WorksheetLdInput) {
  const url = `${SITE_URL}/${input.lang}/worksheets/${input.slug}`;
  const imageUrl = input.ogImage ? abs(input.ogImage) : abs('/og-default.svg');

  const sharedFields = {
    name: input.title,
    headline: input.title,
    description: input.description,
    url,
    '@id': `${url}#content`,
    inLanguage: input.lang === 'zh' ? 'zh-TW' : 'en',
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    keywords: input.tags.join(', '),
    isAccessibleForFree: true,
    datePublished: input.publishedAt.toISOString(),
    dateModified: (input.updatedAt ?? input.publishedAt).toISOString(),
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  // LearningResource — used by AI engines / AEO
  const learningResource = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    ...sharedFields,
    learningResourceType: 'Worksheet',
    educationalLevel: gradeToEducationalLevel[input.grade],
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
    about: input.topicTitle,
  };

  // Article — used by Google Rich Results (shows date + author in SERP)
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    ...sharedFields,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return [learningResource, article];
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────
export function faqJsonLd(faq: Array<{ q: string; a: string }>) {
  if (faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

// ─── CollectionPage ───────────────────────────────────────────────────────────
export function collectionPageJsonLd(lang: Lang, title: string, url: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${abs(url)}#collection`,
    name: title,
    url: abs(url),
    description,
    inLanguage: lang === 'zh' ? 'zh-TW' : 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
