import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 text-center border border-slate-800 ${className}`}
      >
        <Layers className="w-8 h-8 text-blue-400 mb-2" />
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Technical Specimen Illustration
        </span>
        <span className="text-sm font-medium text-white mt-1">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
