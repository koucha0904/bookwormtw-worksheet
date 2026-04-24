export const languages = {
  zh: '繁體中文',
  en: 'English',
} as const;

export const defaultLang = 'zh' as const;

export type Lang = keyof typeof languages;

export const ui = {
  zh: {
    'site.name': '書蟲學習單',
    'site.tagline': '陪孩子從世界與萬物開始學習',
    'site.description': '免費的小學學習單，陪孩子走進每一個國家、每一塊礦石、每一個有趣的主題。可線上閱讀，也能下載 PDF 列印。',
    'nav.home': '首頁',
    'nav.worksheets': '所有學習單',
    'nav.topics': '主題分類',
    'nav.about': '關於我們',
    'nav.switch_lang': 'English',
    'home.hero.title': '陪孩子，把世界做成一張張學習單',
    'home.hero.subtitle': '由媽媽親手設計、適合小學生的免費學習單，每一張都是我們家旅行與探索的紀錄。',
    'home.hero.cta': '瀏覽所有學習單',
    'home.featured.title': '最新學習單',
    'home.topics.title': '主題分類',
    'home.about.title': '關於這個網站',
    'home.about.body': '每次帶女兒出國，我都會事先為她準備一份當地的學習單：地圖、國旗、當地食物、有趣的冷知識。旅行結束後，這些學習單就成了她最珍貴的旅行筆記。後來我想，這些內容或許也能幫到別的小朋友，於是有了這個網站。從國家擴展到礦石、動物⋯⋯希望每一個孩子，都能透過學習單，好奇地看世界。',
    'worksheet.download_pdf': '下載 PDF',
    'worksheet.download_hint': '可自由列印給孩子使用',
    'worksheet.grade': '適合年級',
    'worksheet.topic': '主題',
    'worksheet.tags': '標籤',
    'worksheet.updated': '更新於',
    'worksheet.faq.title': '常見問答',
    'worksheet.related.title': '延伸學習單',
    'worksheets.title': '所有學習單',
    'worksheets.count': '共 {count} 份學習單',
    'topics.title': '主題分類',
    'topics.count': '{count} 份學習單',
    'grade.lower': '小學低年級',
    'grade.middle': '小學中年級',
    'grade.upper': '小學高年級',
    'grade.all': '小學適用',
    'footer.rights': '© {year} 書蟲學習單．由一位台灣媽媽手工製作',
    'footer.contact': '聯絡我們',
  },
  en: {
    'site.name': 'Bookworm Worksheets',
    'site.tagline': 'Learning the world, one worksheet at a time',
    'site.description': 'Free printable elementary worksheets about countries, minerals, animals and more — handcrafted by a mom in Taiwan, available in English and Traditional Chinese.',
    'nav.home': 'Home',
    'nav.worksheets': 'All Worksheets',
    'nav.topics': 'Topics',
    'nav.about': 'About',
    'nav.switch_lang': '繁體中文',
    'home.hero.title': 'Turn the world into worksheets your kids love',
    'home.hero.subtitle': 'Free, handcrafted worksheets for elementary students — made by a traveling mom, for curious kids everywhere.',
    'home.hero.cta': 'Browse all worksheets',
    'home.featured.title': 'Latest worksheets',
    'home.topics.title': 'Browse by topic',
    'home.about.title': 'About this site',
    'home.about.body': 'Every time I travel abroad with my daughter, I make her a little worksheet about the place we are going — the flag, the map, the food, the fun facts. After each trip, those worksheets become her favorite travel journal. I thought other kids might enjoy them too, so I started this site. We are now expanding from countries to minerals, animals, and anything else that sparks curiosity.',
    'worksheet.download_pdf': 'Download PDF',
    'worksheet.download_hint': 'Free to print for home or classroom use',
    'worksheet.grade': 'Grade level',
    'worksheet.topic': 'Topic',
    'worksheet.tags': 'Tags',
    'worksheet.updated': 'Updated',
    'worksheet.faq.title': 'Frequently asked questions',
    'worksheet.related.title': 'Related worksheets',
    'worksheets.title': 'All worksheets',
    'worksheets.count': '{count} worksheets',
    'topics.title': 'Topics',
    'topics.count': '{count} worksheets',
    'grade.lower': 'Grades 1–2',
    'grade.middle': 'Grades 3–4',
    'grade.upper': 'Grades 5–6',
    'grade.all': 'Elementary',
    'footer.rights': '© {year} Bookworm Worksheets. Handmade by a mom in Taiwan.',
    'footer.contact': 'Contact us',
  },
} as const;

export function t(lang: Lang, key: keyof typeof ui['zh'], vars: Record<string, string | number> = {}): string {
  const dict = ui[lang] ?? ui[defaultLang];
  let str: string = (dict as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v));
  }
  return str;
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/' ? '' : clean}`;
}
