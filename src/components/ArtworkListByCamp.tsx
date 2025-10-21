import type { Artwork } from '../types/artwork';

// Map location names to camp names
const CAMP_NAME_MAP: { [key: string]: string } = {
  'Delta': 'Topaz',
  'Desha County': 'Rohwer',
  'Inyo County': 'Manzanar',
  'La Paz County': 'Poston',
  'Jerome County': 'Minidoka',
  'Park County': 'Heart Mountain'
};

interface CampArtworks {
  [key: string]: Artwork[];
}

export interface ArtworkListByCampProps {
  artworks: Artwork[];
}

export function ArtworkListByCamp({ artworks }: ArtworkListByCampProps) {
  // Group artworks by camp name (city)
  const artworksByCamp = artworks.reduce((acc: CampArtworks, artwork) => {
    // Use the camp name mapping if it exists, otherwise use the city
    const campName = CAMP_NAME_MAP[artwork.city] || artwork.city;
    if (!acc[campName]) {
      acc[campName] = [];
    }
    acc[campName].push(artwork);
    return acc;
  }, {});

  // Sort camp names alphabetically
  const sortedCampNames = Object.keys(artworksByCamp).sort();

  return (
    <nav className="w-full max-w-4xl mx-auto py-16 px-8">
      <h3 className="font-robotoCondensed text-gray-800 text-2xl mb-12 uppercase tracking-wide">
        Internment Camp Artworks
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {sortedCampNames.map((campName) => (
          <div key={campName} className="space-y-4">
            {/* <h4 className="font-robotoCondensed text-xl text-gray-700">
              {campName}
            </h4> */}
            <ul className="space-y-3">
              {artworksByCamp[campName].map((artwork) => (
                <li key={artwork.slug}>
                  <a
                    href={`/artwork/internment-camps/${artwork.slug}`}
                    className="font-robotoCondensed text-lg text-gray-600 hover:text-black transition-colors block"
                  >
                    {artwork.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
