import { useEffect, useState } from 'react';
import { Button } from './button';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.gallery-scroll-container');
    
    const handleScroll = () => {
      if (container) {
        setIsVisible(container.scrollTop > 100);
      }
    };

    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector('.gallery-scroll-container');
    container?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 gap-2 border-2 border-white rounded-full bg-black/80 text-white hover:bg-black/90 hover:text-white hover:border-white/60 hover:-translate-y-1 transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } px-4 py-2`}
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
      <span>Back to Top</span>
    </Button>
  );
}
