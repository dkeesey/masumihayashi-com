import React from 'react';
import { campGalleries } from './types';
import CloudinaryImageReact from '../CloudinaryImageReact';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export const HorizontalScroll: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav className="mt-12 border-t pt-8 relative">
      <h2 className="text-2xl font-semibold mb-6">Explore All Camp Galleries</h2>
      
      <button 
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg"
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar"
      >
        {campGalleries.map(gallery => (
          <a 
            key={gallery.slug}
            href={`/galleries/${gallery.slug}`}
            className="flex-none w-[300px] snap-start group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-lg">
              <CloudinaryImageReact
                src={gallery.previewImage}
                alt={gallery.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
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

      <button 
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg"
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </nav>
  );
};
