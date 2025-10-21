import { useState, useEffect } from 'react';
import { cn } from "@lib/utils";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="hidden xl:block">
      <div className="fixed top-24 right-8 w-64 p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
        <h2 className="text-lg font-inter font-semibold mb-4 text-fa-text-primary">
          On this page
        </h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "block py-2 px-3 text-sm rounded-md transition-all duration-300",
                "hover:bg-fa-bg-secondary hover:text-fa-text-primary",
                activeSection === section.id
                  ? "bg-fa-bg-secondary text-fa-text-primary font-medium scale-120 origin-left"
                  : "text-[#E6F0FF] hover:text-white"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
