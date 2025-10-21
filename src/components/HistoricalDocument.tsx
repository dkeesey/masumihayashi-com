

interface HistoricalDocumentProps {
  title: string;
  date: string;
  location: string;
  content: string;
  source: string;
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

export function HistoricalDocument({ title, date, location, content, source, images }: HistoricalDocumentProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12 bg-[#f8f7f3] text-[#2c2c2c]">
      {/* Document Header */}
      <header className="text-center mb-12 space-y-4">
        <h1 className="font-inter text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
        <div className="flex flex-col items-center space-y-2 text-[#2c2c2c]/80">
          <div className="font-typewriter">{location}</div>
          <time className="font-typewriter">{date}</time>
        </div>
      </header>

      {/* Document Images */}
      {images && images.length > 0 && (
        <div className="mb-12 space-y-8">
          {images.map((image, index) => (
            <figure key={index} className="w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-contain"
              />
              {image.caption && (
                <figcaption className="mt-2 text-sm text-center text-[#2c2c2c]/70 italic">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* Document Content */}
      {content && (
        <div className="relative">
          {/* Decorative quotation mark */}
          <div className="absolute -left-8 -top-8 text-8xl text-[#2c2c2c]/10 font-serif">
            "
          </div>
          
          {/* Main content */}
          <div className="relative font-typewriter leading-relaxed text-lg space-y-6 mx-12">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="indent-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Signature Section */}
      {title === "Executive Order 9066" && (
        <div className="mt-12 space-y-2 text-right font-typewriter mr-12">
          <p className="text-xl">FRANKLIN D. ROOSEVELT</p>
          <p className="text-[#2c2c2c]/80">President of the United States</p>
          <p className="text-[#2c2c2c]/80">The White House,</p>
          <p className="text-[#2c2c2c]/80">February 19, 1942</p>
        </div>
      )}

      {/* Source Citation */}
      <footer className="mt-16 pt-8 border-t border-[#2c2c2c]/20">
        <cite className="block text-sm text-[#2c2c2c]/70 font-inter">
          Source: {source}
        </cite>
      </footer>
    </article>
  );
}
