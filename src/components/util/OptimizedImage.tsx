import React from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * A wrapper around Next.js Image component that handles common properties
 * and fixes fetchPriority warnings by using appropriate attributes
 */
type OptimizedImageProps = Omit<ImageProps, 'priority'> & {
  isPriority?: boolean;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  isPriority = false,
  alt = "",
  className = "",
  ...props
}) => {
  // Ensure alt text is always provided for accessibility
  const safeAlt = alt || "PaperMC image";
  
  // If no class is provided, set a default
  const imageClass = className || "object-cover";
  
  // We use priority prop for Next.js Image component instead of loading
  // as it properly handles the priority without fetchPriority warnings
  return (
    <Image
      alt={safeAlt}
      className={imageClass}
      priority={isPriority}
      {...props}
    />
  );
};

export default OptimizedImage;