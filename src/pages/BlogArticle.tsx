import { motion, useScroll, useSpring } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Tag, Share2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import { getBlogPostBySlug, blogPosts, BlogPost } from "@/data/blogPosts";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState<BlogPost | undefined>(undefined);

  // Progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (slug) {
      const post = getBlogPostBySlug(slug);
      if (post) {
        setArticle(post);
      } else {
        navigate("/blog", { replace: true });
      }
    }
  }, [slug, navigate]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Get related articles (same category, excluding current)
  const relatedArticles = article
    ? blogPosts
        .filter(p => p.category === article.category && p.id !== article.id)
        .slice(0, 3)
    : [];

  // Generate schema for SEO
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.date,
    "dateModified": article.lastUpdated || article.date,
    "author": {
      "@type": "Organization",
      "name": article.author?.name || "NEXO",
      "url": "https://nexo.agency"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NEXO AGENCY",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nexo.agency/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://nexo.agency/blog/${article.slug}`
    },
    "inLanguage": "he",
    "keywords": article.tags?.join(", ")
  } : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">טוען מאמר...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | NEXO AGENCY</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.tags?.join(", ")} />
        <link rel="canonical" href={`https://nexo.agency/blog/${article.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:url" content={`https://nexo.agency/blog/${article.slug}`} />
        <meta property="og:locale" content="he_IL" />
        <meta property="article:published_time" content={article.date} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <CustomCursor />
      <GlassNavbar />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-right"
        style={{ scaleX }}
        role="progressbar"
        aria-label="התקדמות קריאה"
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end bg-hero-bg pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={`תמונה ראשית - ${article.title}`}
            className="w-full h-full object-cover opacity-30"
            width={1200}
            height={630}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-hero-fg/60 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>חזרה לכל המאמרים</span>
            </Link>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                {article.category}
              </span>
              <span className="flex items-center gap-2 text-sm text-hero-fg/60">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-2 text-sm text-hero-fg/60">
                <Clock className="w-4 h-4" />
                {article.readTime} דקות קריאה
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-hero-fg leading-tight mb-6 max-w-4xl">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg md:text-xl text-hero-fg/70 max-w-2xl leading-relaxed">
              {article.excerpt}
            </p>

            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-hero-fg/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-hero-fg">{article.author.name}</p>
                  {article.author.role && (
                    <p className="text-sm text-hero-fg/60">{article.author.role}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Share Button */}
            <div className="flex justify-end mb-6 sm:mb-8">
              <button
                onClick={handleShare}
                aria-label={copied ? "הקישור הועתק" : "שתף מאמר"}
                className="flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>הקישור הועתק!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>שתף</span>
                  </>
                )}
              </button>
            </div>

            {/* Article Body */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-slate max-w-none
                prose-headings:font-black prose-headings:text-foreground
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:sm:mt-10 prose-h2:md:mt-12 prose-h2:mb-4 prose-h2:sm:mb-5 prose-h2:md:mb-6
                prose-h3:text-lg prose-h3:sm:text-xl prose-h3:md:text-2xl prose-h3:mt-6 prose-h3:sm:mt-7 prose-h3:md:mt-8 prose-h3:mb-3 prose-h3:sm:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:sm:mb-5 prose-p:md:mb-6
                prose-p.lead:text-base prose-p.lead:sm:text-lg prose-p.lead:md:text-xl prose-p.lead:text-foreground prose-p.lead:font-medium
                prose-ul:my-4 prose-ul:sm:my-5 prose-ul:md:my-6 prose-ul:space-y-2
                prose-ol:my-4 prose-ol:sm:my-5 prose-ol:md:my-6 prose-ol:space-y-2
                prose-li:text-muted-foreground
                prose-strong:text-foreground prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-primary
                prose-blockquote:bg-primary/5 prose-blockquote:py-3 prose-blockquote:sm:py-4 prose-blockquote:px-4 prose-blockquote:sm:px-6
                prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-blockquote:text-foreground prose-blockquote:font-medium
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              מאמרים נוספים שיעניינו אותך
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {relatedArticles.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        loading="lazy"
                        width={800}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogArticle;
