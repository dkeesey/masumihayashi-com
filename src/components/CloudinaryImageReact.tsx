import React from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CloudinaryImageReact: React.FC<CloudinaryImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
};

export default CloudinaryImageReact;
