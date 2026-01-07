import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/data/blogPosts";

// Helper to generate srcset for blog carousel images
const generateBlogCardSrcSet = (src: string) => {
  // Only process local images
  if (!src.startsWith('/images/') && !src.startsWith('/blog/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  return {
    src,
    srcSet: `${basePath}-sm${extension} 260w, ${basePath}-md${extension} 340w, ${src} 480w`,
    sizes: '(max-width: 400px) 260px, (max-width: 768px) 280px, 340px',
  };
};

interface BlogCarouselSectionProps {
  /** Filter posts by categories. If not provided, shows all posts. */
  categories?: string[];
  /** Custom title for the section */
  title?: string;
  /** Custom subtitle for the section */
  subtitle?: string;
}

const CARD_WIDTH_XS = 260;
const CARD_WIDTH_SM = 280;
const CARD_WIDTH_MD = 320;
const CARD_WIDTH_LG = 340;
const MARGIN = 16;

// Helper to get card width based on screen size
const getCardWidth = () => {
  if (typeof window === 'undefined') return CARD_WIDTH_LG;
  if (window.innerWidth < 400) return CARD_WIDTH_XS;
  if (window.innerWidth < 640) return CARD_WIDTH_SM;
  if (window.innerWidth < 768) return CARD_WIDTH_MD;
  return CARD_WIDTH_LG;
};

// Memoized blog card component
const BlogCard = memo(({ post, cardWidth }: { post: BlogPost; cardWidth: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate responsive srcset for the blog image
  const imageSet = useMemo(() => generateBlogCardSrcSet(post.image), [post.image]);

  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: cardWidth,
        marginLeft: MARGIN,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/blog/${post.slug}`} className="block group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light">
        {/* Image Container - Responsive with srcset */}
        <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
          <motion.img
            src={imageSet.src}
            srcSet={imageSet.srcSet}
            sizes={imageSet.sizes}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-nexo-charcoal backdrop-blur-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1.5 sm:space-y-2">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-nexo-ash">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} דקות קריאה
            </span>
            <span>-</span>
            <span>{post.date}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-nexo-charcoal leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-nexo-steel line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Read more link */}
          <motion.div
            className="flex items-center gap-1 text-primary text-sm font-medium pt-1"
            animate={{ x: isHovered ? -4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>קרא עוד</span>
            <ArrowLeft className="w-4 h-4" />
          </motion.div>
        </div>
      </Link>
    </div>
  );
});

BlogCard.displayName = "BlogCard";

const BlogCarouselSection = ({
  categories,
  title = "תובנות ומחשבות",
  subtitle = "מאמרים, טיפים ותובנות מעולם הדיגיטל שיעזרו לכם להצליח"
}: BlogCarouselSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(getCardWidth);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load blog posts on mount
  useEffect(() => {
    async function loadPosts() {
      try {
        const posts = await getBlogPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Handle responsive card width
  useEffect(() => {
    const handleResize = () => {
      setCardWidth(getCardWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CARD_SIZE = cardWidth + MARGIN;

  // Filter posts by categories if provided, otherwise show all
  const posts = useMemo(() => {
    if (!categories || categories.length === 0) {
      return allPosts;
    }
    return allPosts.filter(post => categories.includes(post.category));
  }, [categories, allPosts]);

  const totalPosts = posts.length;

  // Memoize duplicated posts array to prevent recreation on every render
  const duplicatedPosts = useMemo(() => [...posts, ...posts], [posts]);

  // Start in the middle (at original array start) so we can go both directions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Normalize index using modulo for true infinite loop
  const normalizeIndex = useCallback((index: number): number => {
    if (totalPosts === 0) return 0;
    return ((index % totalPosts) + totalPosts) % totalPosts;
  }, [totalPosts]);

  // Calculate offset - use the actual index for smooth animation
  const offset = useMemo(() => -(currentIndex * CARD_SIZE), [currentIndex, CARD_SIZE]);

  // Handle seamless loop reset after animation completes
  const handleTransitionEnd = useCallback(() => {
    // If we've gone past the bounds, reset to equivalent position
    if (currentIndex >= totalPosts || currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(normalizeIndex(currentIndex));
    }
  }, [currentIndex, totalPosts, normalizeIndex]);

  // Re-enable transition after instant jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 20);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Navigate forward (next)
  const shiftRight = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Navigate backward (previous) - true infinite in both directions
  const shiftLeft = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section
        className="py-16 md:py-24 bg-nexo-light"
        dir="rtl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // If no posts match the filter, don't render the section
  if (totalPosts === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 bg-nexo-light"
      dir="rtl"
    >
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="h-1 w-[50px] bg-primary mb-4 origin-right"
              />
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary text-sm font-medium">הבלוג שלנו</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-nexo-charcoal">
                {title}
              </h2>
              <p className="text-nexo-steel mt-2 max-w-md">
                {subtitle}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-nexo-mist bg-white text-nexo-charcoal transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light"
                onClick={shiftRight}
                aria-label="הבא"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-nexo-mist bg-white text-nexo-charcoal transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light"
                onClick={shiftLeft}
                aria-label="הקודם"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel with proper infinite loop */}
          <motion.div
            animate={{ x: offset }}
            transition={isTransitioning ? {
              ease: [0.16, 1, 0.3, 1],
              duration: 0.6
            } : {
              duration: 0
            }}
            onAnimationComplete={handleTransitionEnd}
            className="flex"
            style={{ direction: 'ltr' }}
          >
            {duplicatedPosts.map((post, index) => (
              <BlogCard
                key={`${post.id}-${index}`}
                post={post}
                cardWidth={cardWidth}
              />
            ))}
          </motion.div>

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nexo-charcoal text-white font-medium hover:bg-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light"
            >
              <span>לכל המאמרים</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogCarouselSection;
