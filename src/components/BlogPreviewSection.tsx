"use client";

import { useRef, useMemo, memo, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Lazy load GridMotion - uses GSAP which adds to bundle size
const GridMotion = lazy(() => import("./ui/GridMotion"));

// Blog data - defined outside component to prevent recreation
// Optimized images: 400px width for small cards, WebP format
// TODO: Consider converting external Unsplash URLs to local optimized images for better performance
const blogPosts = [
  {
    id: 1,
    title: "10 טרנדים בעיצוב אתרים שישלטו ב-2025",
    excerpt: "מהאנימציות המיקרו ועד הצבעים הניאון החדשים - כל מה שצריך לדעת",
    category: "עיצוב",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80&fm=webp&fit=crop",
    slug: "/blog/design-trends-2025",
  },
  {
    id: 2,
    title: "איך AI משנה את עולם הפיתוח",
    excerpt: "הכלים החדשים שמאיצים את העבודה של מפתחים בכל הרמות",
    category: "פיתוח",
    readTime: 3,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80&fm=webp&fit=crop",
    slug: "/blog/ai-development",
  },
  {
    id: 3,
    title: "המדריך המלא לשיווק דיגיטלי",
    excerpt: "אסטרטגיות שעובדות להגדלת החשיפה והמכירות שלך",
    category: "שיווק",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fm=webp&fit=crop",
    slug: "/blog/digital-marketing-guide",
  },
] as const;

type BlogPost = typeof blogPosts[number];

// Compact Article Card - memoized to prevent re-renders
const ArticleCard = memo(({ post }: { post: BlogPost }) => (
  <Link
    to={post.slug}
    className="group block w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-[#e5e5e5] hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
  >
    {/* Flex container to fill the aspect-ratio box */}
    <div className="h-full flex flex-col">
      {/* Image - 45% of card height */}
      <div className="relative h-[45%] flex-shrink-0 overflow-hidden">
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
        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#1a1a1a] rounded-full shadow-sm">
          {post.category}
        </span>
      </div>
      {/* Content - remaining 55% with overflow handling */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden" dir="rtl">
        <h4 className="text-sm font-bold text-[#1a1a1a] leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h4>
        <p className="mt-1.5 text-xs text-[#6a6a6a] leading-snug line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-1.5 flex items-center justify-between border-t border-[#f0f0f0]">
          <div className="flex items-center gap-1 text-[#9a9a9a]">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium">{post.readTime} דק׳</span>
          </div>
          <span className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            קרא עוד
            <ArrowLeft className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  </Link>
));

ArticleCard.displayName = 'ArticleCard';

// Pre-generate dot colors to avoid random generation on each render
const DOT_COLORS = Array.from({ length: 9 }, (_, i) => ({
  color: i % 3 === 0 ? 'hsl(328, 100%, 54%)' : '#e5e5e5',
  opacity: 0.5 + (i * 0.05),
}));

// Simple placeholder for non-article grid cells - memoized
const GridPlaceholder = memo(({ variant }: { variant: 'gradient' | 'dots' | 'empty' }) => {
  switch (variant) {
    case 'gradient':
      return (
        <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/10 via-[#8330c2]/5 to-transparent" />
      );
    case 'dots':
      return (
        <div className="w-full aspect-[4/3] rounded-xl bg-white/80 border border-[#e5e5e5]/50 p-4 grid grid-cols-3 gap-2 place-items-center">
          {DOT_COLORS.map((dot, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: dot.color,
                opacity: dot.opacity,
              }}
            />
          ))}
        </div>
      );
    case 'empty':
    default:
      return (
        <div className="w-full aspect-[4/3] rounded-xl bg-white/40 border border-[#e5e5e5]/30" />
      );
  }
});

GridPlaceholder.displayName = 'GridPlaceholder';

const BlogPreviewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Grid items - memoized to prevent recreation on each render
  const gridItems = useMemo(() => [
    <GridPlaceholder key="p1" variant="gradient" />,
    <GridPlaceholder key="p2" variant="empty" />,
    <ArticleCard key="a1" post={blogPosts[0]} />,
    <GridPlaceholder key="p3" variant="dots" />,
    <GridPlaceholder key="p4" variant="gradient" />,
    <GridPlaceholder key="p5" variant="empty" />,
    <GridPlaceholder key="p6" variant="gradient" />,

    <GridPlaceholder key="p7" variant="empty" />,
    <GridPlaceholder key="p8" variant="gradient" />,
    <GridPlaceholder key="p9" variant="dots" />,
    <ArticleCard key="a2" post={blogPosts[1]} />,
    <GridPlaceholder key="p10" variant="gradient" />,
    <GridPlaceholder key="p11" variant="empty" />,
    <GridPlaceholder key="p12" variant="dots" />,

    <GridPlaceholder key="p13" variant="gradient" />,
    <GridPlaceholder key="p14" variant="empty" />,
    <GridPlaceholder key="p15" variant="gradient" />,
    <ArticleCard key="a3" post={blogPosts[2]} />,
    <GridPlaceholder key="p16" variant="dots" />,
    <GridPlaceholder key="p17" variant="empty" />,
    <GridPlaceholder key="p18" variant="gradient" />,

    <GridPlaceholder key="p19" variant="dots" />,
    <GridPlaceholder key="p20" variant="gradient" />,
    <GridPlaceholder key="p21" variant="empty" />,
    <GridPlaceholder key="p22" variant="gradient" />,
    <GridPlaceholder key="p23" variant="dots" />,
    <GridPlaceholder key="p24" variant="empty" />,
    <GridPlaceholder key="p25" variant="gradient" />,
  ], []); // Empty deps - grid items never change

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#FAF9F6" }}
      dir="rtl"
    >
      {/* Header Block - Centered above grid */}
      <div className="container mx-auto px-6 md:px-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[0.9] tracking-tight">
            חושבים{" "}
            <span className="bg-gradient-to-l from-primary to-[#8330c2] bg-clip-text text-transparent">
              קדימה
            </span>
          </h2>
        </motion.div>
      </div>

      {/* GridMotion - Contained section (lazy loaded to reduce initial bundle) */}
      <div className="relative h-[550px] md:h-[650px]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#e5e5e5] border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <GridMotion
            items={gridItems}
            gradientColor="rgba(250, 249, 246, 0.95)"
          />
        </Suspense>

        {/* Fade edges for smooth blending */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FAF9F6] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#FAF9F6] to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#FAF9F6] to-transparent" />
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
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold text-lg shadow-lg hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
        >
          <span>כל המאמרים</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
};

export default BlogPreviewSection;
