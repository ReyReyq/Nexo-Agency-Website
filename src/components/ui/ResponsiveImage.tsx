import { useState, useCallback, memo, useMemo, ImgHTMLAttributes, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// RESPONSIVE IMAGE COMPONENT
// =============================================================================
// A reusable image component that supports:
// - srcset for responsive image loading based on viewport width
// - picture element with WebP/fallback support
// - Native lazy loading
// - Placeholder/skeleton during load
// - Error handling with fallback
// =============================================================================

/**
 * Image size configuration for srcset generation
 */
interface ImageSize {
  /** Width in pixels */
  width: number;
  /** Optional height in pixels (for aspect ratio) */
  height?: number;
  /** Media query for picture element source */
  media?: string;
  /** Image source URL for this size */
  src?: string;
}

/**
 * Standard responsive breakpoints for images
 * Following common device widths
 */
export const IMAGE_BREAKPOINTS = {
  sm: 640,   // Mobile
  md: 768,   // Tablet portrait
  lg: 1024,  // Tablet landscape / small desktop
  xl: 1280,  // Desktop
  '2xl': 1536, // Large desktop
} as const;

/**
 * Predefined size configurations for common use cases
 */
export const IMAGE_PRESETS = {
  /** Full-width hero images */
  hero: [
    { width: 640, media: '(max-width: 640px)' },
    { width: 1024, media: '(max-width: 1024px)' },
    { width: 1920 },
  ],
  /** Card images in grids */
  card: [
    { width: 320, media: '(max-width: 640px)' },
    { width: 480, media: '(max-width: 1024px)' },
    { width: 640 },
  ],
  /** Thumbnail images */
  thumbnail: [
    { width: 160, media: '(max-width: 640px)' },
    { width: 240, media: '(max-width: 1024px)' },
    { width: 320 },
  ],
  /** Portfolio project images */
  portfolio: [
    { width: 400, media: '(max-width: 640px)' },
    { width: 600, media: '(max-width: 1024px)' },
    { width: 800 },
  ],
  /** Blog article images */
  blog: [
    { width: 360, media: '(max-width: 640px)' },
    { width: 560, media: '(max-width: 1024px)' },
    { width: 800 },
  ],
} as const;

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> {
  /** Primary image source (largest size or default) */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Width for layout (used for aspect ratio calculation) */
  width?: number;
  /** Height for layout (used for aspect ratio calculation) */
  height?: number;
  /**
   * Responsive image sizes configuration
   * Can use IMAGE_PRESETS values or custom configuration
   */
  sizes?: readonly ImageSize[] | ImageSize[];
  /**
   * srcset string for simple responsive images
   * Format: "image-320.jpg 320w, image-640.jpg 640w, image-1280.jpg 1280w"
   */
  srcSet?: string;
  /**
   * sizes attribute for srcset
   * Format: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizesAttr?: string;
  /** Enable picture element with multiple sources */
  usePicture?: boolean;
  /** Custom class name */
  className?: string;
  /** Container class name (for wrapper div) */
  containerClassName?: string;
  /** Loading strategy - eager for above-the-fold, lazy for below */
  loading?: 'lazy' | 'eager';
  /** Decode priority */
  decoding?: 'async' | 'sync' | 'auto';
  /** Fetch priority for important images */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Show placeholder while loading */
  showPlaceholder?: boolean;
  /** Custom placeholder element */
  placeholder?: React.ReactNode;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Object-fit style */
  objectFit?: CSSProperties['objectFit'];
  /** Object-position style */
  objectPosition?: CSSProperties['objectPosition'];
  /** Enable fade-in animation on load */
  fadeIn?: boolean;
}

/**
 * Generates srcset string from image path and sizes
 * Assumes image naming convention: image.webp -> image-640.webp
 *
 * @param src - Base image source
 * @param sizes - Array of widths to include in srcset
 * @returns srcset string
 */
export function generateSrcSet(src: string, widths: number[]): string {
  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  return widths
    .map(width => `${basePath}-${width}${extension} ${width}w`)
    .join(', ');
}

/**
 * Generates sizes attribute string from breakpoint configuration
 *
 * @param config - Array of {breakpoint, size} objects
 * @returns sizes attribute string
 */
export function generateSizesAttr(config: { breakpoint?: number; size: string }[]): string {
  return config
    .map(({ breakpoint, size }) =>
      breakpoint ? `(max-width: ${breakpoint}px) ${size}` : size
    )
    .join(', ');
}

/**
 * ResponsiveImage Component
 *
 * A performant image component with responsive loading capabilities.
 * Supports srcset, picture element, lazy loading, and graceful error handling.
 *
 * @example
 * // Basic usage with lazy loading
 * <ResponsiveImage
 *   src="/images/photo.webp"
 *   alt="Photo description"
 *   width={800}
 *   height={600}
 * />
 *
 * @example
 * // With srcset for responsive loading
 * <ResponsiveImage
 *   src="/images/hero.webp"
 *   alt="Hero image"
 *   srcSet="/images/hero-640.webp 640w, /images/hero-1024.webp 1024w, /images/hero-1920.webp 1920w"
 *   sizesAttr="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
 *   loading="eager"
 *   fetchPriority="high"
 * />
 *
 * @example
 * // With picture element for art direction
 * <ResponsiveImage
 *   src="/images/product.webp"
 *   alt="Product photo"
 *   usePicture
 *   sizes={IMAGE_PRESETS.portfolio}
 * />
 */
const ResponsiveImage = memo(function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes,
  srcSet,
  sizesAttr,
  usePicture = false,
  className,
  containerClassName,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  showPlaceholder = true,
  placeholder,
  fallbackSrc,
  onLoad,
  onError,
  objectFit = 'cover',
  objectPosition = 'center',
  fadeIn = true,
  style,
  ...imgProps
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error with fallback
  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    onError?.();
  }, [fallbackSrc, currentSrc, onError]);

  // Memoize image styles
  const imageStyles = useMemo<CSSProperties>(() => ({
    objectFit,
    objectPosition,
    transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined,
    opacity: fadeIn && !isLoaded ? 0 : 1,
    ...style,
  }), [objectFit, objectPosition, fadeIn, isLoaded, style]);

  // Memoize container styles
  const containerStyles = useMemo<CSSProperties>(() => ({
    position: 'relative',
    overflow: 'hidden',
  }), []);

  // Generate sources for picture element
  const pictureSource = useMemo(() => {
    if (!usePicture || !sizes?.length) return null;

    const extension = currentSrc.substring(currentSrc.lastIndexOf('.'));
    const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('.'));

    return sizes.slice(0, -1).map((size, index) => ({
      key: `source-${index}`,
      media: size.media,
      srcSet: size.src || `${basePath}-${size.width}${extension}`,
    }));
  }, [usePicture, sizes, currentSrc]);

  // Default placeholder
  const defaultPlaceholder = (
    <div
      className="absolute inset-0 bg-muted animate-pulse"
      aria-hidden="true"
    />
  );

  // Error state display
  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          containerClassName
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  // Common img element props
  const imgElement = (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={srcSet}
      sizes={sizesAttr}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'w-full h-full',
        className
      )}
      style={imageStyles}
      {...imgProps}
    />
  );

  // Render with picture element for art direction / multiple sources
  if (usePicture && pictureSource) {
    return (
      <div
        className={cn("relative", containerClassName)}
        style={containerStyles}
      >
        {/* Placeholder */}
        {showPlaceholder && !isLoaded && (placeholder || defaultPlaceholder)}

        <picture>
          {pictureSource.map(source => (
            <source
              key={source.key}
              media={source.media}
              srcSet={source.srcSet}
            />
          ))}
          {imgElement}
        </picture>
      </div>
    );
  }

  // Render simple responsive image
  return (
    <div
      className={cn("relative", containerClassName)}
      style={containerStyles}
    >
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && (placeholder || defaultPlaceholder)}

      {imgElement}
    </div>
  );
});

export default ResponsiveImage;

// =============================================================================
// PICTURE ELEMENT COMPONENT (for explicit art direction)
// =============================================================================

interface PictureSourceProps {
  /** Media query for this source */
  media: string;
  /** Image source for this breakpoint */
  srcSet: string;
  /** Image type (e.g., 'image/webp') */
  type?: string;
}

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  /** Array of picture sources for different breakpoints */
  sources: PictureSourceProps[];
  /** Default/fallback image source */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Container class name */
  containerClassName?: string;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Show placeholder */
  showPlaceholder?: boolean;
  /** Enable fade-in animation */
  fadeIn?: boolean;
}

/**
 * Picture Component
 *
 * Explicit picture element for art direction scenarios where
 * different images should be shown at different breakpoints.
 *
 * @example
 * <Picture
 *   sources={[
 *     { media: "(max-width: 640px)", srcSet: "/images/hero-mobile.webp" },
 *     { media: "(max-width: 1024px)", srcSet: "/images/hero-tablet.webp" },
 *   ]}
 *   src="/images/hero-desktop.webp"
 *   alt="Hero image"
 *   loading="eager"
 * />
 */
export const Picture = memo(function Picture({
  sources,
  src,
  alt,
  containerClassName,
  className,
  loading = 'lazy',
  showPlaceholder = true,
  fadeIn = true,
  width,
  height,
  ...imgProps
}: PictureProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const imageStyles = useMemo<CSSProperties>(() => ({
    transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined,
    opacity: fadeIn && !isLoaded ? 0 : 1,
  }), [fadeIn, isLoaded]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}

      <picture>
        {sources.map((source, index) => (
          <source
            key={`${source.media}-${index}`}
            media={source.media}
            srcSet={source.srcSet}
            type={source.type}
          />
        ))}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          className={cn('w-full h-full object-cover', className)}
          style={imageStyles}
          {...imgProps}
        />
      </picture>
    </div>
  );
});
