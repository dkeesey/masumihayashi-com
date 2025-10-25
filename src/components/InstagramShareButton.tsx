/**
 * Instagram Share Button Component
 *
 * Provides one-click download of pre-processed Instagram images with:
 * - Letterboxed artwork with credits baked in
 * - Pre-written caption ready to copy
 * - Hashtags optimized for discovery
 */

import { useState } from 'react';

interface InstagramShareButtonProps {
  artwork: any; // CollectionEntry<'artwork'>
  className?: string;
}

export function InstagramShareButton({ artwork, className = '' }: InstagramShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const slug = artwork.slug;
  const data = artwork.data;

  // Instagram image path (pre-processed with letterboxing + credits)
  const instagramImagePath = `/images/instagram/${slug}-instagram-feed.jpg`;

  // Generate caption
  const caption = generateCaption(data);

  const handleDownload = () => {
    // Download Instagram-ready image
    const link = document.createElement('a');
    link.href = instagramImagePath;
    link.download = `${slug}-instagram.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all ${className}`}
        aria-label="Share on Instagram"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
          <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/>
          <circle cx="18.406" cy="5.594" r="1.44"/>
        </svg>
        <span>Share on Instagram</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Share on Instagram</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <img
                src={instagramImagePath}
                alt={`Instagram preview: ${data.name}`}
                className="w-full rounded"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Image includes baked-in credits and letterboxing
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Download Image</h3>
                  <p className="text-sm text-gray-600">Click below to download the Instagram-optimized image</p>
                  <button
                    onClick={handleDownload}
                    className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Download Image
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Copy Caption</h3>
                  <p className="text-sm text-gray-600 mb-2">Pre-written caption with credits and hashtags</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                    {caption}
                  </div>
                  <button
                    onClick={handleCopyCaption}
                    className={`mt-2 px-4 py-2 rounded-lg transition-colors ${
                      captionCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {captionCopied ? '✓ Copied!' : 'Copy Caption'}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Post to Instagram</h3>
                  <p className="text-sm text-gray-600">Open Instagram app, create new post, select downloaded image, paste caption</p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-xs text-gray-500 border-t pt-4">
              <p>💡 <strong>Tip:</strong> Instagram favors posts with 15-20 hashtags. This caption is pre-optimized for maximum discovery.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Generate Instagram caption with credits and hashtags
 */
function generateCaption(data: any): string {
  const { name, year, location, medium, series } = data;

  // Title line
  let titleLine = name;
  if (year) titleLine += ` (${year})`;

  // Location line
  const locationLine = location || '';

  // Medium line
  const mediumLine = medium || 'Panoramic photo collage';

  // Series-specific description and hashtags
  const seriesInfo = getSeriesInfo(series);

  // Build caption
  const caption = `${titleLine}
Masumi Hayashi
${mediumLine}
${locationLine ? locationLine + '\n' : ''}
${seriesInfo.description}

View the complete series: masumihayashi.com/artwork

${seriesInfo.hashtags}`;

  return caption.trim();
}

/**
 * Get series-specific description and hashtags
 */
function getSeriesInfo(series: string): { description: string; hashtags: string } {
  const seriesMap: Record<string, { description: string; hashtags: string }> = {
    'Japanese-American Internment Camps': {
      description: 'Hayashi, born in a Japanese American internment camp, returned decades later to document these sites of historical trauma through innovative panoramic photography.',
      hashtags: '#MasumiHayashi #PanoramicPhotography #PhotoCollage #JapaneseAmericanHistory #WWII #Incarceration #DocumentaryPhotography #ContemporaryArt #PhotographyHistory #WomenPhotographers #AsianAmericanArt #MuseumQuality #NeverAgain #HistoricalTrauma #SocialJustice'
    },
    'EPA Superfund Sites': {
      description: 'Documenting America\'s most toxic landscapes - EPA Superfund sites where industrial contamination created environmental disasters.',
      hashtags: '#MasumiHayashi #PanoramicPhotography #PhotoCollage #EnvironmentalPhotography #Anthropocene #IndustrialDecay #ToxicWaste #EPASuperfund #DocumentaryPhotography #ContemporaryArt #PhotographyHistory #WomenPhotographers #EnvironmentalJustice #LandscapePhotography #SocialDocumentary'
    },
    'American Prisons': {
      description: 'A visual exploration of the American prison system through panoramic photography, examining architecture, confinement, and mass incarceration.',
      hashtags: '#MasumiHayashi #PanoramicPhotography #PhotoCollage #PrisonPhotography #MassIncarceration #CriminalJustice #DocumentaryPhotography #ContemporaryArt #PhotographyHistory #WomenPhotographers #SocialJustice #InstitutionalSpaces #ArchitecturalPhotography #CriticalPhotography #JusticeReform'
    },
    'Sacred Architectures': {
      description: 'Exploring religious architecture across cultures through panoramic photo collage - temples, churches, mosques, and sacred spaces.',
      hashtags: '#MasumiHayashi #PanoramicPhotography #PhotoCollage #SacredArchitecture #ReligiousArt #ArchitecturalPhotography #Temples #Churches #DocumentaryPhotography #ContemporaryArt #PhotographyHistory #WomenPhotographers #CulturalHeritage #SpiritualSpaces #TravelPhotography'
    },
    // Add more series as needed
  };

  return seriesMap[series] || {
    description: 'Pioneering panoramic photo collage work by Professor Masumi Hayashi (1945-2006).',
    hashtags: '#MasumiHayashi #PanoramicPhotography #PhotoCollage #DocumentaryPhotography #ContemporaryArt #PhotographyHistory #WomenPhotographers #AsianAmericanArt #MuseumQuality #FineArtPhotography'
  };
}
