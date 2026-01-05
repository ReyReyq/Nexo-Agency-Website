import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import { subscribeToNewsletter, isValidEmail } from "@/utils/newsletterSubscription";
import {
  getBlogPostsMeta,
  getAllCategoriesMeta,
  getPostsMetaByCategory,
  getFeaturedPostsMeta,
  getPaginatedPostsMeta,
  POSTS_PER_PAGE,
  type BlogPostMeta
} from "@/data/blogPostsMeta";

// BreadcrumbList JSON-LD Schema
const blogBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
    { "@type": "ListItem", "position": 2, "name": "בלוג", "item": "https://nexo.agency/blog" }
  ]
};

const Blog = () => {
  const heroRef = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("הכל");

  // Blog posts state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPostMeta[]>([]);
  const [categories, setCategories] = useState<string[]>(["הכל"]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // Load blog posts on mount
  useEffect(() => {
    async function loadBlogPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const [posts, cats] = await Promise.all([
          getBlogPostsMeta(),
          getAllCategoriesMeta()
        ]);
        setAllPosts(posts);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError('שגיאה בטעינת המאמרים. נסו לרענן את הדף.');
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogPosts();
  }, []);

  // Newsletter submission handler
  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsletterEmail) {
      setNewsletterStatus("error");
      setNewsletterMessage("נא להזין כתובת אימייל");
      return;
    }

    if (!isValidEmail(newsletterEmail)) {
      setNewsletterStatus("error");
      setNewsletterMessage("כתובת האימייל אינה תקינה");
      return;
    }

    setNewsletterStatus("loading");

    const result = await subscribeToNewsletter(newsletterEmail, "Blog");

    if (result.success) {
      setNewsletterStatus("success");
      setNewsletterMessage("תודה! נרשמת בהצלחה לניוזלטר");
      setNewsletterEmail("");
    } else {
      setNewsletterStatus("error");
      setNewsletterMessage(result.message || "אירעה שגיאה, נסו שוב");
    }
  }, [newsletterEmail]);

  // Get current page from URL
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  // Get filtered posts based on category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "הכל") return allPosts;
    return allPosts.filter(post => post.category === activeCategory);
  }, [activeCategory, allPosts]);

  // Get featured article (first featured or first article)
  const featuredArticle = useMemo(() => {
    const featured = allPosts.filter(post => post.featured);
    return featured.length > 0 ? featured[0] : filteredPosts[0];
  }, [filteredPosts, allPosts]);

  // Regular articles (excluding featured) with pagination
  const { paginatedArticles, totalPages, hasMore } = useMemo(() => {
    const postsWithoutFeatured = filteredPosts.filter(post => post.id !== featuredArticle?.id);
    const { posts, totalPages, hasMore } = getPaginatedPostsMeta(postsWithoutFeatured, currentPage);
    return { paginatedArticles: posts, totalPages, hasMore };
  }, [filteredPosts, featuredArticle, currentPage]);

  // Memoized category change handler - resets to page 1
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setSearchParams({});
  }, [setSearchParams]);

  // Page change handler with scroll to top of grid
  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams({ page: String(newPage) });
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setSearchParams]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <CustomCursor />
        <GlassNavbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">טוען מאמרים...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <CustomCursor />
        <GlassNavbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              רענן דף
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <main id="main-content">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>הבלוג של נקסו | NEXO AGENCY</title>
        <meta name="description" content="מאמרים, מדריכים ותובנות מעולם הדיגיטל, המיתוג והטכנולוגיה. קראו על הטרנדים החמים, טיפים מקצועיים ועוד." />
        <link rel="canonical" href="https://nexo.agency/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="הבלוג של נקסו | NEXO AGENCY" />
        <meta property="og:description" content="מאמרים, מדריכים ותובנות מעולם הדיגיטל, המיתוג והטכנולוגיה. קראו על הטרנדים החמים, טיפים מקצועיים ועוד." />
        <meta property="og:url" content="https://nexo.agency/blog" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="הבלוג של נקסו | NEXO AGENCY" />
        <meta name="twitter:description" content="מאמרים, מדריכים ותובנות מעולם הדיגיטל, המיתוג והטכנולוגיה. קראו על הטרנדים החמים, טיפים מקצועיים ועוד." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/blog" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/blog" />
        <script type="application/ld+json">
          {JSON.stringify(blogBreadcrumbSchema)}
        </script>
      </Helmet>

      <CustomCursor />
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-[50vh] min-h-[50dvh] flex items-center bg-hero-bg pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isHeroInView ? { width: 80 } : {}}
              transition={{ duration: 0.6 }}
              className="h-1 bg-primary mb-8"
            />

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.9] mb-6 sm:mb-8">
              תובנות
              <br />
              <span className="text-gradient">ומחשבות.</span>
            </h1>

            <p className="text-hero-fg/70 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl">
              מאמרים, מדריכים ותובנות מעולם הדיגיטל, המיתוג והטכנולוגיה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${featuredArticle.slug}`}>
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center glass rounded-2xl sm:rounded-3xl overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-4">
                      {featuredArticle.featured && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          מאמר מומלץ
                        </span>
                      )}
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {featuredArticle.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredArticle.readTime} דקות קריאה
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-3 sm:py-4 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 sm:px-5 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 sm:py-16 md:py-24 bg-background" ref={gridRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {paginatedArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${article.slug}`}>
                  {/* Image */}
                  <div className="aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={375}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} דקות קריאה
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Empty State */}
          {paginatedArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                אין עוד מאמרים בקטגוריה זו
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline">הקודם</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and adjacent pages
                  const shouldShow =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!shouldShow) {
                    // Show ellipsis for gaps
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <span key={page} className="px-1 sm:px-2 py-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 min-w-[44px] min-h-[44px] rounded-full text-sm font-medium transition-all ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasMore}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
                  !hasMore
                    ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <span className="hidden sm:inline">הבא</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Post Count */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            מציג {((currentPage - 1) * POSTS_PER_PAGE) + 1}-{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} מתוך {filteredPosts.length} מאמרים
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 sm:py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-hero-fg mb-4 sm:mb-6">
              רוצים לקבל תובנות ישירות למייל?
            </h2>
            <p className="text-hero-fg/70 text-base sm:text-lg mb-6 sm:mb-8">
              הצטרפו לניוזלטר שלנו וקבלו מאמרים, טיפים ועדכונים אחת לשבוע.
            </p>
            {newsletterStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-green-400"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">{newsletterMessage}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus === "error") setNewsletterStatus("idle");
                  }}
                  placeholder="הכניסו אימייל"
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 min-h-[44px] rounded-full bg-hero-fg/10 border text-hero-fg placeholder:text-hero-fg/40 focus:outline-none transition-colors ${
                    newsletterStatus === "error"
                      ? "border-red-400 focus:border-red-400"
                      : "border-hero-fg/20 focus:border-primary"
                  }`}
                  disabled={newsletterStatus === "loading"}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {newsletterStatus === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>שולח...</span>
                    </>
                  ) : (
                    "הרשמה"
                  )}
                </button>
              </form>
            )}
            {newsletterStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3"
              >
                {newsletterMessage}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
