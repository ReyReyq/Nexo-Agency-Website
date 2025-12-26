// Re-export all hooks and utilities for easy imports

// Lenis smooth scrolling
export { useLenis, useScrollTo, useScrollControl, LenisProvider } from '../lenis';

// Lazy loading utilities
export {
  useInView,
  LazyImage,
  LazySection,
  lazyLoadComponent,
  preloadImage,
  preloadImages,
  preloadComponent,
  Skeleton,
  SkeletonText,
  SkeletonImage,
  SkeletonCard,
} from '../lazy-loading';
