"use client";

import { useRef, useMemo, memo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/data/blogPosts";
import { type Service } from "@/data/services";

// ============================================
// SERVICE TO BLOG CATEGORY MAPPING
// ============================================

const serviceToBlogCategories: Record<string, string[]> = {
  "web-development": ["המרות", "UX/UI", "עיצוב"],
  "ecommerce": ["E-commerce", "המרות"],
  "branding": ["מיתוג", "עיצוב"],
  "ai-automation": ["AI & טכנולוגיה", "פיתוח"],
  "digital-marketing": ["שיווק", "טרנדים"],
  "seo": ["SEO"],
  "social-media": ["שיווק"],
  "ai-images": ["AI & טכנולוגיה"],
  "strategy": ["טרנדים", "שיווק"],
  "app-development": ["פיתוח", "UX"],
  "custom-development": ["פיתוח"],
};

// ============================================
// ANIMATION CONSTANTS
// ============================================

const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const INITIAL_FADE_UP_30 = { opacity: 0, y: 30 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_MAIN = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

// ============================================
// ARTICLE CARD COMPONENT
// ============================================

interface ArticleCardProps {
  post: BlogPost;
  index: number;
  isInView: boolean;
}

const ArticleCard = memo(({ post, index, isInView }: ArticleCardProps) => {
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  return (
    <motion.div
      initial={INITIAL_FADE_UP_30}
      animate={animateState}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            width={600}
            height={375}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category Badge */}
          <span className="absolute bottom-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-foreground rounded-full shadow-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5" dir="rtl">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">{post.readTime} דק׳ קריאה</span>
            </div>

            <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              קרא עוד
              <ArrowLeft className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ArticleCard.displayName = "ArticleCard";

// ============================================
// SERVICE BLOG SECTION COMPONENT
// ============================================

interface ServiceBlogSectionProps {
  service: Service;
}

const ServiceBlogSection = memo(({ service }: ServiceBlogSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);
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

  // Filter blog posts based on service category mapping
  const relatedPosts = useMemo(() => {
    if (allPosts.length === 0) return [];

    const categories = serviceToBlogCategories[service.id] || [];

    if (categories.length === 0) {
      // Fallback: return first 3 posts if no mapping exists
      return allPosts.slice(0, 3);
    }

    // Filter posts that match any of the service's categories
    const filtered = allPosts.filter((post) =>
      categories.some((category) =>
        post.category === category ||
        post.tags?.some((tag) => categories.includes(tag))
      )
    );

    // If we have enough filtered posts, return top 3
    if (filtered.length >= 3) {
      return filtered.slice(0, 3);
    }

    // If not enough, supplement with other posts (avoiding duplicates)
    const remaining = allPosts.filter(
      (post) => !filtered.some((f) => f.id === post.id)
    );

    return [...filtered, ...remaining].slice(0, 3);
  }, [service.id, allPosts]);

  // Memoize animation states
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 md:py-32 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no posts
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-muted/30"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={animateState}
          transition={TRANSITION_MAIN}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            מאמרים שיעניינו אתכם
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            תוכן מקצועי שיעזור לכם להבין יותר את התחום ולקבל החלטות מושכלות
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {relatedPosts.map((post, index) => (
            <ArticleCard
              key={post.id}
              post={post}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* View All Articles Button */}
        <motion.div
          initial={INITIAL_FADE_UP_30}
          animate={animateState}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-background border-2 border-border text-foreground font-bold text-lg hover:border-primary hover:text-primary transition-all duration-300"
          >
            <span>כל המאמרים</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

ServiceBlogSection.displayName = "ServiceBlogSection";

export default ServiceBlogSection;
