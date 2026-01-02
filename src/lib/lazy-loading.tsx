import { useState, useEffect, useRef, ReactNode, ComponentType, Suspense, lazy } from 'react';

// ============================================
// INTERSECTION OBSERVER HOOK
// ============================================

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export const useInView = (options: UseInViewOptions = {}) => {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, skip
    if (triggerOnce && hasTriggered) return;

    // Disconnect any existing observer before creating a new one
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            setHasTriggered(true);
            observerRef.current?.unobserve(element);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, root]);

  return { ref, inView };
};

// ============================================
// LAZY IMAGE COMPONENT
// ============================================

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  rootMargin = '100px',
  onLoad,
  onError,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({ rootMargin, triggerOnce: true });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${placeholderClassName}`}
        />
      )}

      {/* Actual image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// LAZY SECTION COMPONENT
// ============================================

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  fallback?: ReactNode;
  animateIn?: boolean;
}

export const LazySection = ({
  children,
  className = '',
  rootMargin = '200px',
  fallback = null,
  animateIn = true,
}: LazySectionProps) => {
  const { ref, inView } = useInView({ rootMargin, triggerOnce: true });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`${className} ${
        animateIn
          ? inView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
          : ''
      } transition-all duration-700 ease-out`}
    >
      {inView ? children : fallback}
    </section>
  );
};

// ============================================
// LAZY COMPONENT LOADER
// ============================================

interface LazyComponentOptions {
  fallback?: ReactNode;
  rootMargin?: string;
}

export function lazyLoadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const { fallback = null, rootMargin = '100px' } = options;
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    const { ref, inView } = useInView({ rootMargin, triggerOnce: true });

    return (
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        {inView ? (
          <Suspense fallback={fallback}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          fallback
        )}
      </div>
    );
  };
}

// ============================================
// PRELOAD UTILITIES
// ============================================

// Preload an image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};

// Preload a component
export const preloadComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>
) => {
  return importFn();
};

// ============================================
// SKELETON COMPONENTS
// ============================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton = ({ className = '', animate = true }: SkeletonProps) => (
  <div
    className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
  />
);

export const SkeletonText = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonImage = ({ className = '' }: { className?: string }) => (
  <Skeleton className={`w-full aspect-video ${className}`} />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    <SkeletonImage />
    <SkeletonText lines={3} />
  </div>
);
