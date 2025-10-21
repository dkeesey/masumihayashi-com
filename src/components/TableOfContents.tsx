'use client'

import { useEffect, useState, useRef } from 'react'
import { ScrollArea } from "@components/ui/scroll-area"
import { cn } from "@lib/utils"

// Styling constants for Table of Contents
/**
 * Table of Contents Styles - FINAL VERSION
 * 
 * Color Schema:
 * - Main title: blue-400
 * - Section titles: blue-400 (inactive) → amber-300 (active)
 * - Descriptions: gray-300 (inactive) → amber-300 (active)
 * - Vertical bar: amber-400
 * 
 * Typography:
 * - Main title: text-lg
 * - Section titles: text-base
 * - Descriptions: text-sm
 */
const tocStyles = {
  container: 'hidden lg:block sticky top-24 ml-8 w-64',
  wrapper: 'space-y-4',
  headerTitle: 'text-blue-400 text-lg font-medium mb-4',
  scrollArea: 'h-[calc(100vh-200px)] pr-4',
  list: 'space-y-2',
  link: {
    base: [
      // Layout
      'block py-2 text-base pl-4',
      'relative',
      // Colors & Transitions
      'transition-all duration-300 ease-in-out',
      // Vertical Bar
      'before:content-[""]',
      'before:absolute before:left-0 before:top-1/2',
      'before:h-[80%] before:w-0.5',
      'before:bg-amber-400',
      'before:-translate-y-1/2',
      'before:transition-all before:duration-300 before:ease-in-out',
      'before:origin-center',
      'before:scale-y-0 before:opacity-0',
      // Hover effect
      'hover:before:scale-y-50 hover:before:opacity-100'
    ].join(' '),
    active: 'before:!scale-y-100 before:!opacity-100 transform scale-[1.02] origin-left text-base font-medium'
  },
  title: {
    base: 'transition-all duration-300 ease-in-out font-normal text-base text-blue-400',
    active: 'text-amber-300 font-medium'
  },
  description: {
    base: [
      'text-sm text-gray-300',
      'transition-colors duration-300'
    ].join(' '),
    active: 'text-amber-300'
  }
} as const

interface TableOfContentsProps {
  sections: {
    id: string
    title: string
    description?: string
  }[]
}

const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [userClicked, setUserClicked] = useState(false);
  const userClickTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update if user just clicked (within last 1.5s)
        if (userClicked) return;

        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) => {
            return (current.intersectionRatio > prev.intersectionRatio) ? current : prev;
          });
          setActiveSection(mostVisible.target.id);
        }
      },
      {
        rootMargin: '-10% 0% -45% 0%',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    );

    // Observe all section elements
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections, userClicked]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userClickTimeout.current) {
        clearTimeout(userClickTimeout.current);
      }
    };
  }, []);

  const handleClick = (id: string) => {
    setActiveSection(id);
    setUserClicked(true);
    
    // Clear any existing timeout
    if (userClickTimeout.current) {
      clearTimeout(userClickTimeout.current);
    }
    
    // Reset userClicked after 1.5s to allow intersection observer to take over again
    userClickTimeout.current = setTimeout(() => {
      setUserClicked(false);
    }, 1500);

    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    history.pushState(null, '', `#${id}`);
  };

  return (
    <div className={tocStyles.container}>
      <div className={tocStyles.wrapper}>
        <p className={tocStyles.headerTitle}>On this page</p>
        {/* Debug info - uncomment to show active section
        <div className="text-xs text-gray-500 mb-2">
          Active: {activeSection}
        </div>
        */}
        <ScrollArea className={tocStyles.scrollArea}>
          <div className={tocStyles.list}>
            {sections.map(({ id, title, description }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(id);
                }}
                className={cn(
                  tocStyles.link.base,
                  activeSection === id && tocStyles.link.active
                )}
              >
                <div className="relative">
                  <span className={cn(
                    tocStyles.title.base,
                    activeSection === id && tocStyles.title.active
                  )}>
                    {title}
                  </span>
                  {description && (
                    <p className={cn(
                      tocStyles.description.base,
                      activeSection === id && tocStyles.description.active
                    )}>
                      {description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default TableOfContents;
