import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * API endpoint to fetch artworks for a specific series
 * Used for infinite scroll to load next series dynamically
 */

// Define valid series slugs for static path generation
export async function getStaticPaths() {
  return [
    { params: { slug: 'japanese-american-internment-camps' } },
    { params: { slug: 'prisons' } },
    { params: { slug: 'post-industrial' } },
    { params: { slug: 'war-military' } },
    { params: { slug: 'city-works' } },
    { params: { slug: 'sacred-architectures' } },
    { params: { slug: 'epa-superfund' } },
    { params: { slug: 'commissions' } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Series slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Map URL slugs to series names in content collection
    const seriesNameMap: Record<string, string> = {
      'japanese-american-internment-camps': 'Japanese-American Internment Camps',
      'prisons': 'Prisons',
      'post-industrial': 'Post-Industrial',
      'war-military': 'War/Military',
      'city-works': 'City Works',
      'sacred-architectures': 'Sacred Architectures',
      'epa-superfund': 'EPA Superfund',
      'commissions': 'Commissions'
    };

    const seriesName = seriesNameMap[slug];

    if (!seriesName) {
      return new Response(JSON.stringify({ error: 'Unknown series' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch artworks for this series
    const allArtworks = await getCollection('artwork');
    const seriesArtworks = allArtworks.filter(
      artwork => artwork.data.series === seriesName
    );

    // Return artwork data for client-side rendering
    const artworkData = seriesArtworks.map(artwork => ({
      slug: artwork.slug,
      name: artwork.data.name,
      year: artwork.data.year,
      city: artwork.data.city,
      state: artwork.data.state,
      country: artwork.data.country,
      media: artwork.data.media,
      size: artwork.data.size,
      altTag: artwork.data.altTag,
      cloudinaryId: artwork.data.cloudinaryId
    }));

    return new Response(JSON.stringify({
      series: seriesName,
      slug,
      artworks: artworkData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching series:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch series' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
