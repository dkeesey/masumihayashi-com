// HistoricalContextReact.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
  title: string;
  content: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export const HistoricalContextReact = () => {
  const sections: Section[] = [
    {
      title: "Executive Order 9066",
      content: `Two months after Pearl Harbor, President Franklin D. Roosevelt signed Executive Order 9066 on February 19, 1942, 
      authorizing the removal of any or all people from military areas "as deemed necessary or desirable." 
      This order led to the forced relocation and incarceration of approximately 120,000 Japanese Americans, 
      two-thirds of whom were U.S. citizens.`,
      image: {
        src: '',
        alt: 'Executive Order 9066',
      },
    },
    {
      title: "Civilian Exclusion Order No. 5",
      content: `This order specifically targeted Japanese Americans living in specific geographic zones. 
      Families were given just days to dispose of nearly all their possessions, except what they could carry. 
      Businesses were sold, homes abandoned, and communities torn apart as people were forced to report to 
      assembly centers.`,
      image: {
        src: '',
        alt: 'Civilian Exclusion Order No. 5',
      },
    },
    {
      title: "Presidential Apology",
      content: `Five decades later, President Bill Clinton issued a formal letter of apology to Japanese 
      Americans incarcerated during World War II, accompanied by reparations. This marked a crucial step in 
      acknowledging this dark chapter in American history and the importance of protecting civil rights.`,
      image: {
        src: '',
        alt: 'Presidential Apology',
      },
    },
  ];

  const [activeSection, setActiveSection] = useState(0);

  const handlePrevious = () => {
    setActiveSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const handleNext = () => {
    setActiveSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mb-8">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeSection ? 'bg-fa-text-accent' : 'bg-gray-400'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Content Section */}
      <div className="relative bg-fa-bg-secondary p-8 rounded-lg shadow-lg">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Previous section"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Next section"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Section Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-inter font-semibold mb-4 text-center">
            {sections[activeSection].title}
          </h2>

          <div className="prose prose-lg mx-auto font-inter">
            {sections[activeSection]?.image && (
              <figure className="mb-6">
                <img
                  src={sections[activeSection]?.image?.src ?? ''}
                  alt={sections[activeSection]?.image?.alt ?? ''}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {sections[activeSection]?.image?.caption && (
                  <figcaption className="text-sm text-center mt-2 text-fa-text-secondary">
                    {sections[activeSection]?.image?.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="text-fa-text-secondary space-y-4">
              {sections[activeSection].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};