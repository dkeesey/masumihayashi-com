export interface SEOConfig {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  keywords?: string[];
}

const DEFAULT_DESCRIPTION = "Explore the photographic legacy of Masumi Hayashi, featuring panoramic photo collages documenting Japanese American internment camps, EPA Superfund sites, and abandoned prisons.";
const SITE_NAME = "Masumi Hayashi Foundation";
const DEFAULT_KEYWORDS = ["Masumi Hayashi", "panoramic photography", "photo collage", "Japanese American", "internment camps", "documentary photography"];

export function generateTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_NAME;
  // Remove any existing separators to standardize
  const cleanTitle = pageTitle.replace(/\s*[|/-]\s*${SITE_NAME}$/, '').trim();
  return `${cleanTitle} | ${SITE_NAME}`;
}

export function generateDescription(desc?: string): string {
  return desc || DEFAULT_DESCRIPTION;
}

export function generateKeywords(additionalKeywords: string[] = []): string {
  const uniqueKeywords = [...new Set([...DEFAULT_KEYWORDS, ...additionalKeywords])];
  return uniqueKeywords.join(', ');
}

export function generateSEOTags(config: SEOConfig): {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage?: string;
} {
  const title = generateTitle(config.title);
  const description = generateDescription(config.description);
  const keywords = generateKeywords(config.keywords);
  
  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogType: config.type || 'website',
    ...(config.image && { ogImage: config.image })
  };
}
