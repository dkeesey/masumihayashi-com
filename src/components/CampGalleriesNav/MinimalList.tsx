import React from 'react';
import { campGalleries } from './types';
import CloudinaryImageReact from '../CloudinaryImageReact';

export const MinimalList: React.FC = () => {
  const [hoveredGallery, setHoveredGallery] = React.useState<string | null>(null);

  return (
    <nav className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Explore All Camp Galleries</h2>
      
      <div className="flex gap-12">
        {/* List of camps */}
        <div className="flex-1">
          <div className="space-y-4">
            {campGalleries.map(gallery => (
              <a 
                key={gallery.slug}
                href={`/galleries/${gallery.slug}`}
                className="block group"
                onMouseEnter={() => setHoveredGallery(gallery.slug)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {gallery.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {gallery.location} • {gallery.yearActive}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {gallery.photoCount} photographs →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Preview image */}
        <div className="w-96 sticky top-8 hidden lg:block">
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-lg">
            {hoveredGallery ? (
              <CloudinaryImageReact
                src={campGalleries.find(g => g.slug === hoveredGallery)?.previewImage || ''}
                alt={campGalleries.find(g => g.slug === hoveredGallery)?.name || ''}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                Hover over a camp to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
