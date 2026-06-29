import { useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Image with a skeleton placeholder while loading, a fade-in on load, and a
 * graceful branded gradient fallback if the source fails — so the UI never
 * shows a broken-image icon (important when remote sample images are used).
 */
export default function SmartImage({ src, alt = '', className, imgClassName, ...props }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  return (
    <div className={cn('relative overflow-hidden bg-beige', className)}>
      {status !== 'error' ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          {...props}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-glow via-beige to-sand">
          <span className="font-heading text-2xl text-gold-dark/60">Wornora</span>
        </div>
      )}
      {status === 'loading' && <div className="skeleton absolute inset-0" />}
    </div>
  );
}
