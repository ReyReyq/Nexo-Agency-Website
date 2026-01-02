import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts, type BlogPost } from "@/data/blogPosts";

interface BlogCarouselSectionProps {
  /** Filter posts by categories. If not provided, shows all posts. */
  categories?: string[];
  /** Custom title for the section */
  title?: string;
  /** Custom subtitle for the section */
  subtitle?: string;
}

const CARD_WIDTH = 340;
const MARGIN = 16;
const CARD_SIZE = CARD_WIDTH + MARGIN;

// Memoized blog card component
const BlogCard = memo(({ post }: { post: BlogPost }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: CARD_WIDTH,
        marginLeft: MARGIN,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/blog/${post.slug}`} className="block group">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl mb-4">
          <motion.img
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-[200px] object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#1a1a1a] backdrop-blur-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-[#666]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} דקות קריאה
            </span>
            <span>•</span>
            <span>{post.date}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#555] line-clamp-2 leading-relaxed">
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

  // Filter posts by categories if provided, otherwise show all
  const posts = useMemo(() => {
    if (!categories || categories.length === 0) {
      return blogPosts;
    }
    return blogPosts.filter(post => categories.includes(post.category));
  }, [categories]);

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
  const offset = -(currentIndex * CARD_SIZE);

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

  // If no posts match the filter, don't render the section
  if (totalPosts === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24"
      style={{ backgroundColor: "#FAF9F6" }}
      dir="rtl"
    >
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 50 }}
                viewport={{ once: true }}
                className="h-1 bg-primary mb-4"
              />
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary text-sm font-medium">הבלוג שלנו</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a]">
                {title}
              </h2>
              <p className="text-[#555] mt-2 max-w-md">
                {subtitle}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                className="p-2.5 rounded-full border border-[#ddd] bg-white text-[#1a1a1a] transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                onClick={shiftRight}
                aria-label="הבא"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className="p-2.5 rounded-full border border-[#ddd] bg-white text-[#1a1a1a] transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] text-white font-medium hover:bg-primary transition-colors duration-300"
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
