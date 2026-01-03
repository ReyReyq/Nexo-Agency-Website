import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/caseStudies";

// Memoized animation variants to prevent recreating objects on each render
const heroInitial = { opacity: 0, y: 60 } as const;
const heroAnimate = { opacity: 1, y: 0 } as const;
const heroTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;
const lineInitial = { width: 0 } as const;
const lineAnimate = { width: 80 } as const;
const lineTransition = { duration: 0.6 } as const;
const projectInitial = { opacity: 0, y: 60 } as const;
const projectAnimate = { opacity: 1, y: 0 } as const;
const ctaInitial = { opacity: 0, y: 40 } as const;
const ctaAnimate = { opacity: 1, y: 0 } as const;
const viewportOnce = { once: true } as const;

// Map case studies to portfolio format with proper category tags
const projects = caseStudies.map(cs => ({
  id: cs.id,
  slug: cs.slug,
  title: cs.title,
  category: cs.category,
  description: cs.overview.slice(0, 120) + "...",
  image: cs.heroImage,
  results: cs.results.slice(0, 3).map(r => `${r.value} ${r.label}`),
  tags: getCategoryTags(cs.category),
}));

// Helper function to get tags based on category
function getCategoryTags(category: string): string[] {
  const tagMap: Record<string, string[]> = {
    "EdTech": ["מיתוג", "פיתוח", "אסטרטגיה"],
    "E-Commerce": ["E-commerce", "UX/UI", "פיתוח"],
    "Web App": ["פיתוח", "אסטרטגיה", "UX/UI"],
    "Mobile App": ["אפליקציה", "פיתוח", "UX/UI"],
  };
  return tagMap[category] || ["מיתוג", "פיתוח"];
}

// Stable viewport config for useInView
const inViewConfig = { once: true } as const;

const Portfolio = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, inViewConfig);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Memoize hover handlers to prevent creating new functions on each render
  const handleProjectHover = useCallback((projectId: string) => {
    setHoveredProject(projectId);
  }, []);

  const handleProjectLeave = useCallback(() => {
    setHoveredProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-[60vh] flex items-center bg-hero-bg pt-20">
        <div className="container mx-auto px-6">
          <motion.div
            ref={heroRef}
            initial={heroInitial}
            animate={isHeroInView ? heroAnimate : undefined}
            transition={heroTransition}
            className="max-w-4xl"
          >
            <motion.div
              initial={lineInitial}
              animate={isHeroInView ? lineAnimate : undefined}
              transition={lineTransition}
              className="h-1 bg-primary mb-8"
            />
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.9] mb-8">
              העבודות
              <br />
              <span className="text-gradient">שלנו.</span>
            </h1>
            
            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              מבחר פרויקטים שמדגימים את היכולות שלנו. כל פרויקט הוא סיפור הצלחה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={projectInitial}
                whileInView={projectAnimate}
                viewport={viewportOnce}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => handleProjectHover(project.id)}
                onMouseLeave={handleProjectLeave}
                className="group cursor-pointer"
              >
                <Link to={`/portfolio/${project.slug}`}>
                  {/* Image */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={500}
                      animate={{ scale: hoveredProject === project.id ? 1.05 : 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      animate={{ opacity: hoveredProject === project.id ? 0.9 : 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/30 to-transparent"
                    />
                    
                    {/* Overlay Content */}
                    <motion.div
                      animate={{ 
                        opacity: hoveredProject === project.id ? 1 : 0,
                        y: hoveredProject === project.id ? 0 : 20 
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-medium text-hero-fg/80 bg-hero-bg/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                    </div>

                    <motion.div
                      animate={{ x: hoveredProject === project.id ? 0 : 10, opacity: hoveredProject === project.id ? 1 : 0 }}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={ctaInitial}
            whileInView={ctaAnimate}
            viewport={viewportOnce}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-hero-fg mb-6">
              הפרויקט הבא
              <br />
              <span className="text-gradient">יכול להיות שלכם.</span>
            </h2>
            <p className="text-hero-fg/70 text-lg mb-8">
              מוכנים להצטרף לרשימת ההצלחות שלנו?
            </p>
            <Link
              to="/contact#contact-form"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              בואו נדבר
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
