import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Contact from "@/components/Contact";
import { blogPosts, getAllCategories, getPostsByCategory, getFeaturedPosts } from "@/data/blogPosts";

const Blog = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [activeCategory, setActiveCategory] = useState("הכל");

  // Get categories and filtered posts
  const categories = useMemo(() => getAllCategories(), []);
  const filteredPosts = useMemo(() => getPostsByCategory(activeCategory), [activeCategory]);

  // Get featured article (first featured or first article)
  const featuredArticle = useMemo(() => {
    const featured = getFeaturedPosts();
    return featured.length > 0 ? featured[0] : filteredPosts[0];
  }, [filteredPosts]);

  // Regular articles (excluding featured)
  const regularArticles = useMemo(() => {
    return filteredPosts.filter(post => post.id !== featuredArticle?.id);
  }, [filteredPosts, featuredArticle]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-[50vh] flex items-center bg-hero-bg pt-20">
        <div className="container mx-auto px-6">
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

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.9] mb-8">
              תובנות
              <br />
              <span className="text-gradient">ומחשבות.</span>
            </h1>

            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              מאמרים, מדריכים ותובנות מעולם הדיגיטל, המיתוג והטכנולוגיה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${featuredArticle.slug}`}>
                <div className="grid lg:grid-cols-2 gap-8 items-center glass rounded-3xl overflow-hidden group">
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
                  <div className="p-8 lg:p-12">
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
                    <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
      <section className="py-4 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
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
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4">
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
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          {regularArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                אין עוד מאמרים בקטגוריה זו
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black text-hero-fg mb-6">
              רוצים לקבל תובנות ישירות למייל?
            </h2>
            <p className="text-hero-fg/70 text-lg mb-8">
              הצטרפו לניוזלטר שלנו וקבלו מאמרים, טיפים ועדכונים אחת לשבוע.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="הכניסו אימייל"
                className="flex-1 px-6 py-4 rounded-full bg-hero-fg/10 border border-hero-fg/20 text-hero-fg placeholder:text-hero-fg/40 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors">
                הרשמה
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default Blog;
