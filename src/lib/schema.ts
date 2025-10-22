/**
 * Schema.org structured data generators for AI SEO optimization
 *
 * These functions generate JSON-LD structured data to help AI assistants
 * (ChatGPT, Claude, Perplexity, Gemini) cite and attribute content correctly.
 *
 * @see /Users/deankeesey/.claude/docs/ai-seo-schema-guide.md
 */

import type { Thing, WithContext } from 'schema-dts';

const SITE_URL = 'https://masumihayashi.com';
const FOUNDATION_URL = 'https://masumihayashifoundation.org';

/**
 * Person schema for Masumi Hayashi
 * Used on: Homepage, About page, all artwork pages
 */
export function generatePersonSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#masumi`,
    "name": "Masumi Hayashi",
    "alternateName": "Masumi Mitsui Hayashi",
    "birthDate": "1945-05-04",
    "deathDate": "2006-11-06",
    "birthPlace": {
      "@type": "Place",
      "name": "Los Angeles, California",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    },
    "nationality": "American",
    "jobTitle": "Artist",
    "description": "Japanese-American artist and photographer known for panoramic photo-collages documenting Japanese American internment camps and other sites of social significance",
    "knowsAbout": [
      "Photography",
      "Japanese American Internment",
      "Panoramic Photo-collage",
      "Photo-based Installation",
      "Documentary Photography",
      "Social Documentary"
    ],
    "award": [
      "National Endowment for the Arts Fellowship",
      "Ohio Arts Council Individual Artist Fellowship"
    ],
    "url": SITE_URL,
    "sameAs": [
      "https://en.wikipedia.org/wiki/Masumi_Hayashi",
      "https://www.janm.org/collections/artist/masumi-hayashi",
      "https://encyclopedia.densho.org/Masumi_Hayashi/"
    ]
  };
}

/**
 * Organization schema for Masumi Hayashi Foundation
 * Used on: Footer, About page
 */
export function generateOrganizationSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${FOUNDATION_URL}/#organization`,
    "name": "Masumi Hayashi Foundation",
    "url": FOUNDATION_URL,
    "foundingDate": "2007",
    "founder": {
      "@type": "Person",
      "name": "Dean Akira Keesey"
    },
    "description": "Foundation dedicated to preserving and promoting the artistic legacy of Masumi Hayashi, with focus on Japanese American internment documentation",
    "sameAs": [
      "https://www.facebook.com/MasumiHayashiFoundation",
      "https://www.instagram.com/masumi_hayashi_foundation/",
      "https://www.youtube.com/@MasumiLegacyProject"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General Inquiries",
      "url": `${FOUNDATION_URL}/contact`
    },
    "areaServed": "Worldwide",
    "knowsAbout": "Japanese American Internment Art and History"
  };
}

/**
 * Event schema for Japanese American Internment
 * Used on: Historical documents page, artist statement
 */
export function generateInternmentEventSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_URL}/#internment`,
    "name": "Japanese American Internment",
    "alternateName": [
      "Japanese American Incarceration",
      "World War II Internment of Japanese Americans"
    ],
    "description": "Forced relocation and incarceration of approximately 120,000 Japanese Americans in concentration camps during World War II",
    "startDate": "1942-02-19",
    "endDate": "1946-03-20",
    "location": {
      "@type": "Place",
      "name": "United States"
    },
    "organizer": {
      "@type": "Organization",
      "name": "War Relocation Authority",
      "parentOrganization": {
        "@type": "Organization",
        "name": "United States Government"
      }
    }
  };
}

/**
 * VisualArtwork schema for individual artworks
 * Used on: Individual artwork pages
 */
export interface ArtworkData {
  cloudinaryId: string;
  title: string;
  year: string;
  media?: string;
  city?: string;
  state?: string;
  country?: string;
  size?: string;
  description?: string;
  campName?: string;
}

export function generateArtworkSchema(artwork: ArtworkData): WithContext<Thing> {
  const imageUrl = `https://res.cloudinary.com/masumi-hayashi-foundation/image/upload/${artwork.cloudinaryId}.jpg`;

  const schema: WithContext<Thing> = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${SITE_URL}/artwork/${artwork.cloudinaryId}`,
    "name": artwork.title,
    "creator": {
      "@id": `${SITE_URL}/#masumi`
    },
    "dateCreated": artwork.year,
    "artMedium": artwork.media || "Panoramic photo-collage",
    "artform": "Photography",
    "image": imageUrl,
    "description": artwork.description || `Panoramic photo-collage of ${artwork.title}`,
    "genre": "Documentary Photography",
    "inLanguage": "en-US"
  };

  // Add location if available
  if (artwork.city || artwork.state) {
    schema.locationCreated = {
      "@type": "Place",
      "name": `${artwork.city}${artwork.state ? ', ' + artwork.state : ''}`,
      "address": {
        "@type": "PostalAddress",
        ...(artwork.state && { "addressRegion": artwork.state }),
        ...(artwork.country && { "addressCountry": artwork.country })
      }
    };
  }

  // Add internment context if this is a camp artwork
  if (artwork.campName) {
    schema.about = {
      "@type": "Event",
      "@id": `${SITE_URL}/#internment`,
      "name": "Japanese American Internment"
    };
  }

  return schema;
}

/**
 * ImageObject schema for artwork images
 * Used on: Artwork pages with images
 */
export function generateImageObjectSchema(artwork: ArtworkData): WithContext<Thing> {
  const imageUrl = `https://res.cloudinary.com/masumi-hayashi-foundation/image/upload/${artwork.cloudinaryId}.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": imageUrl,
    "creator": {
      "@id": `${SITE_URL}/#masumi`
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Estate of Masumi Hayashi"
    },
    "copyrightYear": artwork.year,
    "creditText": `© ${artwork.year} Estate of Masumi Hayashi. All rights reserved.`,
    "acquireLicensePage": `${FOUNDATION_URL}/licensing`,
    "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    "description": artwork.description || artwork.title,
    "representativeOfPage": true
  };
}

/**
 * WebSite schema for homepage
 * Used on: Homepage only
 */
export function generateWebSiteSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Masumi Hayashi - Panoramic Photography and Social Documentary",
    "url": SITE_URL,
    "description": "Official website of Masumi Hayashi, featuring panoramic photo-collages documenting Japanese American internment camps and other sites of social significance",
    "publisher": {
      "@id": `${FOUNDATION_URL}/#organization`
    },
    "inLanguage": "en-US"
  };
}

/**
 * BreadcrumbList schema for navigation
 * Used on: All pages except homepage
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`
    }))
  };
}

/**
 * CreativeWorkSeries schema for artwork series
 * Used on: Series landing pages (e.g., /artwork/japanese-american-internment-camps/)
 */
export interface SeriesData {
  name: string;
  description: string;
  url: string;
  artworkCount: number;
  dateCreated: string;
  genre: string[];
}

export function generateSeriesSchema(series: SeriesData): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    "@id": `${SITE_URL}${series.url}#series`,
    "name": series.name,
    "description": series.description,
    "url": `${SITE_URL}${series.url}`,
    "creator": {
      "@id": `${SITE_URL}/#masumi`
    },
    "dateCreated": series.dateCreated,
    "genre": series.genre,
    "numberOfItems": series.artworkCount,
    "inLanguage": "en-US"
  };
}
