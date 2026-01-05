"use client";

import { useRef, useMemo, memo, lazy, Suspense, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/data/blogPosts";

// Lazy load GridMotion - uses GSAP which adds to bundle size
const GridMotion = lazy(() => import("./ui/GridMotion"));

// Compact Article Card - memoized to prevent re-renders
const ArticleCard = memo(({ post }: { post: BlogPost }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group block w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-nexo-mist hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
  >
    {/* Flex container to fill the aspect-ratio box */}
    <div className="h-full flex flex-col">
      {/* Image - 45% of card height on desktop, 50% on mobile for bigger visual */}
      <div className="relative h-[50%] md:h-[45%] flex-shrink-0 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Category badge - hidden on mobile, visible on md+ screens */}
        <span className="hidden md:inline-block absolute bottom-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-nexo-charcoal rounded-full shadow-sm">
          {post.category}
        </span>
        {/* Title overlay on mobile for better visibility */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2" dir="rtl">
            {post.title}
          </h4>
        </div>
      </div>
      {/* Content - remaining space with overflow handling */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col overflow-hidden" dir="rtl">
        {/* Title hidden on mobile (shown in image overlay), visible on desktop */}
        <h4 className="hidden md:block text-sm sm:text-base font-bold text-nexo-charcoal leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h4>
        {/* Excerpt - hidden on mobile, visible on desktop */}
        <p className="hidden md:block mt-1.5 text-xs text-nexo-ash leading-snug line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        {/* Mobile: Just show read time and CTA */}
        <div className="mt-auto pt-1 md:pt-1.5 flex items-center justify-between border-t border-nexo-mist/60">
          <div className="flex items-center gap-1 text-nexo-silver">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{post.readTime} דק׳</span>
          </div>
          <span className="text-[10px] font-semibold text-primary md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            קרא עוד
            <ArrowLeft className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  </Link>
));

ArticleCard.displayName = 'ArticleCard';

const BlogPreviewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
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

  // Dynamically get posts and create 28 grid items for GridMotion effect
  // Takes up to 12 unique posts and repeats them to fill all 28 slots
  const gridItems = useMemo(() => {
    if (allPosts.length === 0) return [];

    const GRID_SLOTS = 28;
    const MAX_UNIQUE_POSTS = 12;

    // Get the latest posts (up to 12)
    const posts = allPosts.slice(0, Math.min(MAX_UNIQUE_POSTS, allPosts.length));

    // Create 28 items by cycling through available posts
    const items: React.ReactNode[] = [];
    for (let i = 0; i < GRID_SLOTS; i++) {
      const post = posts[i % posts.length];
      items.push(<ArticleCard key={`grid-${i}-${post.slug}`} post={post} />);
    }

    return items;
  }, [allPosts]);

  // Loading state - show minimal placeholder
  if (isLoading) {
    return (
      <section
        className="relative py-20 md:py-28 overflow-hidden bg-nexo-light"
        dir="rtl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden bg-nexo-light"
      dir="rtl"
    >
      {/* Header Block - Centered above grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-nexo-charcoal leading-[0.9] tracking-tight">
            חושבים{" "}
            <span className="bg-gradient-to-l from-primary to-brand-purple bg-clip-text text-transparent">
              קדימה
            </span>
          </h2>
        </motion.div>
      </div>

      {/* GridMotion - Contained section (lazy loaded to reduce initial bundle) */}
      <div className="relative h-[550px] md:h-[650px]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-nexo-mist border-t-primary rounded-full animate-spin" />
          </div>
        }>
          {gridItems.length > 0 && (
            <GridMotion
              items={gridItems}
              gradientColor="rgba(250, 249, 246, 0.95)"
            />
          )}
        </Suspense>

        {/* Fade edges for smooth blending */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-nexo-light to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-nexo-light to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-nexo-light to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-nexo-light to-transparent" />
        </div>
      </div>

      {/* CTA Button - BELOW the grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-20 mt-10 text-center"
      >
        <Link
          to="/blog"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-nexo-charcoal text-nexo-charcoal font-bold text-lg shadow-lg hover:bg-nexo-charcoal hover:text-white transition-all duration-300 min-h-[44px]"
        >
          <span>כל המאמרים</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
};

export default BlogPreviewSection;
