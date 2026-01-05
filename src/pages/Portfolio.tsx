import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Orb from "@/components/Orb";
import ErrorBoundary, { SectionErrorFallback, WebGLErrorFallback } from "@/components/ErrorBoundary";
import { caseStudies } from "@/data/caseStudies";
import { Marquee } from "@/components/ui/marquee";

// Website showcase images - equally distributed (18 each)
const websiteImages = {
  row1: [
    "/images/websites-pictures/Gemini Generated Image (1).webp",
    "/images/websites-pictures/Gemini Generated Image (2).webp",
    "/images/websites-pictures/Gemini Generated Image (3).webp",
    "/images/websites-pictures/Gemini Generated Image (4).webp",
    "/images/websites-pictures/Gemini Generated Image (5).webp",
    "/images/websites-pictures/Gemini Generated Image (6).webp",
    "/images/websites-pictures/Gemini Generated Image (7).webp",
    "/images/websites-pictures/Gemini Generated Image (8).webp",
    "/images/websites-pictures/Gemini Generated Image.webp",
    "/images/websites-pictures/Gemini_Generated_Image_ubgf3rubgf3rubgf.webp",
    "/images/websites-pictures/Gemini_Generated_Image_1rnbic1rnbic1rnb.webp",
    "/images/websites-pictures/Gemini_Generated_Image_q4yb80q4yb80q4yb.webp",
    "/images/websites-pictures/Gemini_Generated_Image_rr1pmlrr1pmlrr1p.webp",
    "/images/websites-pictures/Gemini_Generated_Image_jvgltxjvgltxjvgl.webp",
    "/images/websites-pictures/Gemini_Generated_Image_ld0r21ld0r21ld0r.webp",
    "/images/websites-pictures/Google Gemini Generated Image.webp",
    "/images/websites-pictures/Google Gemini Image (1).webp",
    "/images/websites-pictures/Google Gemini Image (2).webp",
  ],
  row2: [
    "/images/websites-pictures/Google Gemini Image (3).webp",
    "/images/websites-pictures/Google Gemini Image (4).webp",
    "/images/websites-pictures/Google Gemini Image (5).webp",
    "/images/websites-pictures/Google Gemini Image (6).webp",
    "/images/websites-pictures/Google Gemini Image (7).webp",
    "/images/websites-pictures/Google Gemini Image (8).webp",
    "/images/websites-pictures/Google Gemini Image (9).webp",
    "/images/websites-pictures/Google Gemini Image (10).webp",
    "/images/websites-pictures/Google Gemini Image (11).webp",
    "/images/websites-pictures/Google Gemini Image (12).webp",
    "/images/websites-pictures/Google Gemini Image (13).webp",
    "/images/websites-pictures/Google Gemini Image (14).webp",
    "/images/websites-pictures/Google Gemini Image (15).webp",
    "/images/websites-pictures/Google Gemini Image (16).webp",
    "/images/websites-pictures/Google Gemini Image.webp",
    "/images/websites-pictures/Gemini Generated Image (3).webp",
    "/images/websites-pictures/Gemini Generated Image (5).webp",
    "/images/websites-pictures/Gemini Generated Image (7).webp",
  ],
};

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

// BreadcrumbList JSON-LD Schema
const portfolioBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
    { "@type": "ListItem", "position": 2, "name": "תיק עבודות", "item": "https://nexo.agency/portfolio" }
  ]
};

// Helper to generate srcset for portfolio images
// Naming convention: image.webp -> image-sm.webp, image-md.webp
const generatePortfolioSrcSet = (src: string | undefined, isWide = false) => {
  if (!src || !src.startsWith('/portfolio/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  // Wide/hero images (21:9 aspect ratio)
  if (isWide) {
    return {
      src,
      srcSet: `${basePath}-sm${extension} 640w, ${basePath}-md${extension} 1024w, ${src} 1200w`,
      sizes: '100vw',
    };
  }

  // Standard project cards (4:3 aspect ratio)
  return {
    src,
    srcSet: `${basePath}-sm${extension} 400w, ${basePath}-md${extension} 600w, ${src} 800w`,
    sizes: '(max-width: 768px) 100vw, 50vw',
  };
};

// Helper for marquee images
const generateMarqueeSrcSet = (src: string) => {
  if (!src.startsWith('/images/websites-pictures/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  return {
    src,
    srcSet: `${basePath}-sm${extension} 240w, ${src} 400w`,
    sizes: '(max-width: 640px) 240px, (max-width: 1024px) 300px, 400px',
  };
};

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
      <main id="main-content">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>תיק עבודות | NEXO AGENCY</title>
        <meta name="description" content="תיק העבודות של נקסו - פרויקטים נבחרים בעיצוב, פיתוח ושיווק דיגיטלי. צפו בסיפורי ההצלחה שלנו." />
        <link rel="canonical" href="https://nexo.agency/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="תיק עבודות | NEXO AGENCY" />
        <meta property="og:description" content="תיק העבודות של נקסו - פרויקטים נבחרים בעיצוב, פיתוח ושיווק דיגיטלי. צפו בסיפורי ההצלחה שלנו." />
        <meta property="og:url" content="https://nexo.agency/portfolio" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="תיק עבודות | NEXO AGENCY" />
        <meta name="twitter:description" content="תיק העבודות של נקסו - פרויקטים נבחרים בעיצוב, פיתוח ושיווק דיגיטלי. צפו בסיפורי ההצלחה שלנו." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/portfolio" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/portfolio" />
        <script type="application/ld+json">
          {JSON.stringify(portfolioBreadcrumbSchema)}
        </script>
      </Helmet>

      <CustomCursor />
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-hero-bg pt-16 sm:pt-20 pb-8 sm:pb-12 relative overflow-hidden">
        {/* Orb and Content Container */}
        <div className="relative w-full max-w-[600px] aspect-square md:max-w-[800px] flex items-center justify-center">
          {/* Orb Background - wrapped in ErrorBoundary for WebGL safety */}
          <div className="absolute inset-0 opacity-60">
            <ErrorBoundary variant="component" fallback={<WebGLErrorFallback />}>
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </ErrorBoundary>
          </div>

          {/* Hero Content - Staged inside the Orb */}
          <div className="relative z-10 text-center px-4 sm:px-8 md:px-12 pointer-events-none" dir="rtl">
            <motion.div
              ref={heroRef}
              initial={heroInitial}
              animate={isHeroInView ? heroAnimate : undefined}
              transition={heroTransition}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={lineInitial}
                animate={isHeroInView ? lineAnimate : undefined}
                transition={lineTransition}
                className="h-1 bg-primary mb-8"
              />

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-hero-fg leading-[0.9] mb-6 sm:mb-8">
                העבודות
                <br />
                <span className="text-gradient">שלנו.</span>
              </h1>

              <p className="text-hero-fg/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-md font-medium">
                חזון שהופך למציאות דיגיטלית.
                <br />
                המבחר המדויק של היצירות שלנו.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Bento Grid */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Sioné - Full Width Top Card */}
            {projects.find(p => p.slug === 'sione') && (
              <motion.div
                initial={projectInitial}
                whileInView={projectAnimate}
                viewport={viewportOnce}
                transition={{ delay: 0.1 }}
                onMouseEnter={() => handleProjectHover('sione')}
                onMouseLeave={handleProjectLeave}
                className="group cursor-pointer col-span-1 md:col-span-2"
              >
                <Link to="/portfolio/sione">
                  {/* Mobile: taller aspect ratio (4/3), Desktop: wide cinematic (21/9) */}
                  <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-6">
                    {(() => {
                      const imageSet = generatePortfolioSrcSet(projects.find(p => p.slug === 'sione')?.image, true);
                      return (
                        <motion.img
                          src={imageSet.src}
                          srcSet={imageSet.srcSet}
                          sizes={imageSet.sizes}
                          alt="SIONÉ"
                          loading="lazy"
                          decoding="async"
                          width={1200}
                          height={514}
                          animate={{ scale: hoveredProject === 'sione' ? 1.05 : 1 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full object-cover object-top"
                        />
                      );
                    })()}
                    <motion.div
                      animate={{ opacity: hoveredProject === 'sione' ? 0.9 : 0.5 }}
                      className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/50 md:via-hero-bg/30 to-transparent"
                    />

                    {/* Overlay Content - Hidden on mobile */}
                    <motion.div
                      animate={{
                        opacity: hoveredProject === 'sione' ? 1 : 0,
                        y: hoveredProject === 'sione' ? 0 : 20
                      }}
                      className="absolute inset-0 hidden md:flex items-center justify-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <span className="text-xs md:text-sm font-medium text-hero-fg/90 bg-hero-bg/60 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                        E-Commerce
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-3 group-hover:text-primary transition-colors drop-shadow-lg">
                            SIONÉ
                          </h3>
                          {/* Hide description on mobile */}
                          <p className="text-white/70 text-sm md:text-xl max-w-2xl hidden md:block">
                            {projects.find(p => p.slug === 'sione')?.description}
                          </p>
                        </div>

                        {/* Arrow button - hidden on mobile */}
                        <motion.div
                          animate={{ x: hoveredProject === 'sione' ? 0 : 10, opacity: hoveredProject === 'sione' ? 1 : 0 }}
                          className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-white/30 hidden md:flex items-center justify-center flex-shrink-0"
                        >
                          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* SimplyHebrew - Left Card */}
            {projects.find(p => p.slug === 'simplyhebrew') && (
              <motion.div
                initial={projectInitial}
                whileInView={projectAnimate}
                viewport={viewportOnce}
                transition={{ delay: 0.2 }}
                onMouseEnter={() => handleProjectHover('simplyhebrew')}
                onMouseLeave={handleProjectLeave}
                className="group cursor-pointer"
              >
                <Link to="/portfolio/simplyhebrew">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6">
                    {(() => {
                      const imageSet = generatePortfolioSrcSet(projects.find(p => p.slug === 'simplyhebrew')?.image);
                      return (
                        <motion.img
                          src={imageSet.src}
                          srcSet={imageSet.srcSet}
                          sizes={imageSet.sizes}
                          alt="SimplyHebrew"
                          loading="lazy"
                          decoding="async"
                          width={800}
                          height={600}
                          animate={{ scale: hoveredProject === 'simplyhebrew' ? 1.05 : 1 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full object-cover"
                        />
                      );
                    })()}
                    <motion.div
                      animate={{ opacity: hoveredProject === 'simplyhebrew' ? 0.9 : 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/20 to-transparent"
                    />

                    {/* Overlay Content */}
                    <motion.div
                      animate={{
                        opacity: hoveredProject === 'simplyhebrew' ? 1 : 0,
                        y: hoveredProject === 'simplyhebrew' ? 0 : 20
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Category Tag */}
                    <div className="absolute top-5 right-5">
                      <span className="text-xs font-medium text-hero-fg/90 bg-hero-bg/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        EdTech
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors">
                            SimplyHebrew
                          </h3>
                          <p className="text-white/70 text-sm md:text-base max-w-md hidden md:block">
                            {projects.find(p => p.slug === 'simplyhebrew')?.description}
                          </p>
                        </div>

                        <motion.div
                          animate={{ x: hoveredProject === 'simplyhebrew' ? 0 : 10, opacity: hoveredProject === 'simplyhebrew' ? 1 : 0 }}
                          className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center flex-shrink-0"
                        >
                          <ArrowLeft className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* TeenVestor - Right Card */}
            {projects.find(p => p.slug === 'teenvestsor') && (
              <motion.div
                initial={projectInitial}
                whileInView={projectAnimate}
                viewport={viewportOnce}
                transition={{ delay: 0.3 }}
                onMouseEnter={() => handleProjectHover('teenvestsor')}
                onMouseLeave={handleProjectLeave}
                className="group cursor-pointer"
              >
                <Link to="/portfolio/teenvestsor">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6">
                    {(() => {
                      const imageSet = generatePortfolioSrcSet(projects.find(p => p.slug === 'teenvestsor')?.image);
                      return (
                        <motion.img
                          src={imageSet.src}
                          srcSet={imageSet.srcSet}
                          sizes={imageSet.sizes}
                          alt="TeenVestor"
                          loading="lazy"
                          decoding="async"
                          width={800}
                          height={600}
                          animate={{ scale: hoveredProject === 'teenvestsor' ? 1.05 : 1 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full object-cover object-top"
                        />
                      );
                    })()}
                    <motion.div
                      animate={{ opacity: hoveredProject === 'teenvestsor' ? 0.9 : 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/20 to-transparent"
                    />

                    {/* Overlay Content */}
                    <motion.div
                      animate={{
                        opacity: hoveredProject === 'teenvestsor' ? 1 : 0,
                        y: hoveredProject === 'teenvestsor' ? 0 : 20
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </motion.div>

                    {/* Category Tag */}
                    <div className="absolute top-5 right-5">
                      <span className="text-xs font-medium text-hero-fg/90 bg-hero-bg/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        FinTech
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors">
                            TeenVestor
                          </h3>
                          <p className="text-white/70 text-sm md:text-base max-w-md hidden md:block">
                            {projects.find(p => p.slug === 'teenvestsor')?.description}
                          </p>
                        </div>

                        <motion.div
                          animate={{ x: hoveredProject === 'teenvestsor' ? 0 : 10, opacity: hoveredProject === 'teenvestsor' ? 1 : 0 }}
                          className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center flex-shrink-0"
                        >
                          <ArrowLeft className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Website Showcase Marquees */}
      <section className="py-10 sm:py-12 md:py-20 bg-hero-bg overflow-hidden">
        <div className="mb-6 sm:mb-8 md:mb-12 text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-hero-fg mb-3 sm:mb-4"
          >
            עוד עבודות <span className="text-gradient">שלנו</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
            className="text-hero-fg/60 text-base sm:text-lg"
          >
            גלריית אתרים שעיצבנו ופיתחנו
          </motion.p>
        </div>

        {/* First Marquee Row - Left to Right */}
        <div className="mb-4 sm:mb-6">
          <Marquee
            className="[--duration:20s] [--gap:1rem] sm:[--gap:1.5rem]"
          >
            {websiteImages.row1.map((src, index) => (
              <div
                key={index}
                className="relative w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
              >
                <img
                  src={src}
                  alt={`Website showcase ${index + 1}`}
                  width={400}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Second Marquee Row - Right to Left */}
        <Marquee
          className="[--duration:20s] [--gap:1rem] sm:[--gap:1.5rem]"
          reverse
        >
          {websiteImages.row2.map((src, index) => (
            <div
              key={index}
              className="relative w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
            >
              <img
                src={src}
                alt={`Website showcase ${index + 10}`}
                width={400}
                height={250}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </Marquee>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={ctaInitial}
            whileInView={ctaAnimate}
            viewport={viewportOnce}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg mb-4 sm:mb-6">
              הפרויקט הבא
              <br />
              <span className="text-gradient">יכול להיות שלכם.</span>
            </h2>
            <p className="text-hero-fg/70 text-base sm:text-lg mb-6 sm:mb-8">
              מוכנים להצטרף לרשימת ההצלחות שלנו?
            </p>
            <Link
              to="/contact#contact-form"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              בואו נדבר
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
