import React from 'react';
import { campGalleries } from './types';
import CloudinaryImageReact from '../CloudinaryImageReact';

export const GridLayout: React.FC = () => {
  return (
    <nav className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Explore All Camp Galleries</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {campGalleries.map(gallery => (
          <a 
            key={gallery.slug}
            href={`/galleries/${gallery.slug}`}
            className="group"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              <CloudinaryImageReact
                src={gallery.previewImage}
                alt={gallery.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                {gallery.name}
              </h3>
              <p className="text-sm text-gray-500">
                {gallery.location} • {gallery.yearActive}
              </p>
              <p className="text-sm text-gray-400">
                {gallery.photoCount} photographs
              </p>
            </div>
          </a>
        ))}
      </div>
    </nav>
  );
};
