"use client";

import { useRef, useMemo, memo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/data/blogPosts";
import { type SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import { type Service } from "@/data/services";

// ============================================
// SUB-SERVICE TO BLOG CATEGORY MAPPING
// Maps each sub-service ID to relevant blog categories and tags
// ============================================

const subServiceToBlogMapping: Record<string, { categories: string[]; tags: string[] }> = {
  // Web Development sub-services
  "landing-pages": {
    categories: ["המרות", "UX/UI"],
    tags: ["המרות", "דפי נחיתה", "CRO", "עיצוב"]
  },
  "wordpress": {
    categories: ["פיתוח", "טרנדים"],
    tags: ["וורדפרס", "WordPress", "CMS", "אתרים"]
  },
  "web-apps": {
    categories: ["פיתוח", "UX/UI"],
    tags: ["אפליקציות", "פיתוח", "SaaS", "טכנולוגיה"]
  },
  "corporate-sites": {
    categories: ["עיצוב", "המרות"],
    tags: ["עיצוב", "עסקים", "מיתוג"]
  },
  "catalog-sites": {
    categories: ["E-commerce", "עיצוב"],
    tags: ["קטלוג", "מוצרים", "עיצוב"]
  },

  // E-commerce sub-services
  "shopify": {
    categories: ["E-commerce", "המרות"],
    tags: ["Shopify", "חנות", "מכירות", "איקומרס"]
  },
  "woocommerce": {
    categories: ["E-commerce", "פיתוח"],
    tags: ["WooCommerce", "וורדפרס", "חנות"]
  },
  "payments": {
    categories: ["E-commerce", "טכנולוגיה"],
    tags: ["תשלומים", "סליקה", "אבטחה"]
  },
  "inventory": {
    categories: ["E-commerce", "AI & טכנולוגיה"],
    tags: ["מלאי", "ניהול", "אוטומציה"]
  },

  // Branding sub-services
  "logo-design": {
    categories: ["מיתוג", "עיצוב"],
    tags: ["לוגו", "עיצוב", "מיתוג", "זהות"]
  },
  "visual-identity": {
    categories: ["מיתוג", "עיצוב"],
    tags: ["זהות ויזואלית", "מיתוג", "עיצוב"]
  },
  "brand-book": {
    categories: ["מיתוג", "עיצוב"],
    tags: ["ספר מותג", "מיתוג", "הנחיות"]
  },
  "copywriting": {
    categories: ["מיתוג", "שיווק"],
    tags: ["קופירייטינג", "כתיבה", "שיווק", "תוכן"]
  },

  // AI Automation sub-services
  "chatbots": {
    categories: ["AI & טכנולוגיה", "שיווק"],
    tags: ["צ'אטבוטים", "AI", "בינה מלאכותית", "שירות לקוחות"]
  },
  "automation": {
    categories: ["AI & טכנולוגיה", "פיתוח"],
    tags: ["אוטומציה", "AI", "תהליכים", "יעילות"]
  },
  "ai-images": {
    categories: ["AI & טכנולוגיה", "עיצוב"],
    tags: ["AI", "תמונות", "עיצוב", "Midjourney"]
  },
  "ai-content": {
    categories: ["AI & טכנולוגיה", "שיווק"],
    tags: ["AI", "תוכן", "כתיבה", "ChatGPT"]
  },

  // Digital Marketing sub-services
  "google-ads": {
    categories: ["שיווק", "המרות"],
    tags: ["Google Ads", "PPC", "פרסום", "גוגל"]
  },
  "meta-ads": {
    categories: ["שיווק", "טרנדים"],
    tags: ["Facebook", "Instagram", "Meta", "פרסום"]
  },
  "email-marketing": {
    categories: ["שיווק", "המרות"],
    tags: ["דוא״ל", "מיילים", "שיווק", "המרות"]
  },
  "influencer": {
    categories: ["שיווק", "טרנדים"],
    tags: ["משפיענים", "רשתות חברתיות", "שיווק"]
  }
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
  accentColor: string;
}

const ArticleCard = memo(({ post, index, isInView, accentColor }: ArticleCardProps) => {
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
          <span
            className="absolute bottom-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm text-white"
            style={{ backgroundColor: accentColor }}
          >
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

            <span
              className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              style={{ color: accentColor }}
            >
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
// SUB-SERVICE BLOG SECTION COMPONENT
// ============================================

interface SubServiceBlogSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceBlogSection = memo(({ subService, parentService }: SubServiceBlogSectionProps) => {
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

  // Filter blog posts based on sub-service mapping
  const relatedPosts = useMemo(() => {
    if (allPosts.length === 0) return [];

    const mapping = subServiceToBlogMapping[subService.id];

    if (!mapping) {
      // Fallback: return first 3 posts if no mapping exists
      return allPosts.slice(0, 3);
    }

    const { categories, tags } = mapping;

    // Score posts based on relevance
    const scoredPosts = allPosts.map((post) => {
      let score = 0;

      // Category match gives higher score
      if (categories.includes(post.category)) {
        score += 3;
      }

      // Tag matches
      if (post.tags) {
        const tagMatches = post.tags.filter(tag =>
          tags.some(t => t.toLowerCase() === tag.toLowerCase())
        ).length;
        score += tagMatches * 2;
      }

      // Boost featured posts
      if (post.featured) {
        score += 1;
      }

      return { post, score };
    });

    // Sort by score (highest first) and filter out zero-score posts
    const relevant = scoredPosts
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ post }) => post);

    // If we have enough relevant posts, return top 3
    if (relevant.length >= 3) {
      return relevant.slice(0, 3);
    }

    // If not enough, supplement with other posts (avoiding duplicates)
    const remaining = allPosts.filter(
      (post) => !relevant.some((r) => r.id === post.id)
    );

    return [...relevant, ...remaining].slice(0, 3);
  }, [subService.id, allPosts]);

  // Memoize animation states
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 md:py-28 bg-muted/30" dir="rtl">
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
      className="py-20 md:py-28 bg-muted/30"
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${parentService.accentColor}20` }}
            >
              <BookOpen className="w-6 h-6" style={{ color: parentService.accentColor }} />
            </div>
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: parentService.accentColor }}
            >
              מאמרים בנושא
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            מאמרים שיעניינו אתכם
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            תוכן מקצועי על {subService.name} שיעזור לכם להבין יותר את התחום
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
              accentColor={parentService.accentColor}
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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-background border-2 border-border text-foreground font-bold text-lg hover:text-white transition-all duration-300"
            style={{
              ['--hover-bg' as string]: parentService.accentColor,
              ['--hover-border' as string]: parentService.accentColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = parentService.accentColor;
              e.currentTarget.style.borderColor = parentService.accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '';
            }}
          >
            <span>כל המאמרים</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

SubServiceBlogSection.displayName = "SubServiceBlogSection";

export default SubServiceBlogSection;
