import React from 'react';
import { ExternalLinkIcon } from './ExternalLinkIcon';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  withIcon?: boolean;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ 
  href, 
  children, 
  className = "text-gray-400 hover:text-white transition-colors",
  iconClassName = "h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity",
  withIcon = true
}) => (
  <a 
    href={href}
    className={`${className} group`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {withIcon ? (
      <span className="inline-flex items-center">
        <span>{children}</span>
        <ExternalLinkIcon className={iconClassName} />
      </span>
    ) : (
      children
    )}
  </a>
);
