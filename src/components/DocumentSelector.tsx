import { useEffect, useState } from 'react';

interface Document {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
}

interface DocumentSelectorProps {
  documents: Document[];
  activeDocument: string;
}

export function DocumentSelector({ documents, activeDocument: initialActive }: DocumentSelectorProps) {
  const [activeDocument, setActiveDocument] = useState(initialActive);
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && documents.some(doc => doc.id === hash)) {
        setActiveDocument(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [documents]);

  const handleSelect = (id: string) => {
    setActiveDocument(id);
    setHoveredDocument(null);
    
    // First scroll smoothly
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Then update URL without causing a jump
    history.pushState(null, '', `#${id}`);
  };

  const getButtonStyle = (docId: string) => {
    const isActive = activeDocument === docId && !hoveredDocument;
    const isHovered = hoveredDocument === docId;
    
    if (isActive || isHovered) {
      return 'bg-[#f8f7f3] text-black border-black shadow-lg';
    }
    return 'bg-fa-bg-primary text-[#f8f7f3] border-[#f8f7f3]';
  };

  return (
    <nav className="w-full max-w-3xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelect(doc.id)}
            onMouseEnter={() => setHoveredDocument(doc.id)}
            onMouseLeave={() => setHoveredDocument(null)}
            className={`
              p-4 text-left border rounded-lg transition-all
              hover:border-black
              ${getButtonStyle(doc.id)}
            `}
          >
            <h3 className="font-inter font-medium text-sm mb-1">{doc.title}</h3>
            {doc.subtitle && (
              <p className="text-sm opacity-80 mb-2 line-clamp-2">{doc.subtitle}</p>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium">{doc.author}</p>
              <time className="block text-xs opacity-60">{doc.date}</time>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
