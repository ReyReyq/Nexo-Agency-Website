import { useEffect, useRef, useMemo, memo, useCallback, lazy, Suspense, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import ServiceHeroBackground from "@/components/ServiceHeroBackground";
import Magnet from "@/components/Magnet";
import ErrorBoundary, { SectionErrorFallback } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
import {
  getServiceBySlug,
  getRelatedServices,
  getServicesByParent,
  type Service,
} from "@/data/services";

// Lazy load new service sections to reduce initial bundle
const SubServicesGridSection = lazy(() => import("@/components/service/SubServicesGridSection"));
const DifferentiatorsSection = lazy(() => import("@/components/service/DifferentiatorsSection"));
const CaseStudyHighlight = lazy(() => import("@/components/service/CaseStudyHighlight"));
const ServiceBlogSection = lazy(() => import("@/components/service/ServiceBlogSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

// ============================================
// ANIMATION CONSTANTS (stable references)
// ============================================

const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const INITIAL_FADE_UP_30 = { opacity: 0, y: 30 };
const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const INITIAL_FADE_LEFT_60 = { opacity: 0, x: -60 };
const INITIAL_FADE_RIGHT_60 = { opacity: 0, x: 60 };
const INITIAL_FADE_RIGHT_20 = { opacity: 0, x: 20 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_VISIBLE_X = { opacity: 1, x: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_MAIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const TRANSITION_DURATION_06 = { duration: 0.6 };
const TRANSITION_DELAY_02 = { delay: 0.2 };
const TRANSITION_DELAY_03 = { delay: 0.3 };
const TRANSITION_DELAY_04 = { delay: 0.4 };
const TRANSITION_DELAY_05 = { delay: 0.5 };
const TRANSITION_CONTENT = { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const };
const FLOATING_ANIMATE = { y: [0, -10, 0], rotate: [0, 5, 0] };
const FLOATING_TRANSITION = { duration: 5, repeat: Infinity, ease: "easeInOut" as const };
const IN_VIEW_OPTIONS_ONCE = { once: true };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

// ============================================
// HERO SECTION
// ============================================

interface ServiceHeroProps {
  service: Service;
}

const ServiceHero = memo(({ service }: ServiceHeroProps) => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, IN_VIEW_OPTIONS_ONCE);

  // Memoize styles that depend on service
  const sparklesStyle = useMemo(() => ({ color: service.accentColor }), [service.accentColor]);
  const fallbackGradient = useMemo(
    () => `linear-gradient(135deg, hsl(var(--hero-bg)) 0%, ${service.bgColor} 100%)`,
    [service.bgColor]
  );

  // Memoize animation states based on isInView
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  return (
    <section
      className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden bg-hero-bg"
    >
      {/* Animated Background - Service Specific */}
      <ServiceHeroBackground
        slug={service.slug}
        fallbackGradient={fallbackGradient}
      />

      {/* Centered Content - pointer-events-none allows mouse to pass through to background */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <motion.div
          ref={heroRef}
          initial={INITIAL_FADE_UP_40}
          animate={animateState}
          transition={TRANSITION_MAIN}
          className="flex flex-col items-center"
        >
          {/* Main Headline */}
          <motion.h1
            initial={INITIAL_FADE_UP_30}
            animate={animateState}
            transition={TRANSITION_DELAY_03}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-hero-fg leading-[1.1] mb-4 sm:mb-6 max-w-4xl"
          >
            {service.headline}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={TRANSITION_DELAY_04}
            className="text-hero-fg/60 text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10"
          >
            {service.subtitle}
          </motion.p>

          {/* CTA Buttons - pointer-events-auto to make buttons clickable */}
          <motion.div
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={TRANSITION_DELAY_05}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 pointer-events-auto"
          >
            {/* Primary CTA - White button with magnetic pull */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold bg-white text-black transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden"
              >
                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  בואו נתחיל
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            {/* Secondary CTA - Glass button with magnetic pull */}
            <Magnet magnetStrength={3} padding={60}>
              <a
                href="#details"
                className="group relative inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-hero-fg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-white/20 hover:scale-105 active:scale-95 transition-all border border-white/20 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  למידע נוסף
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </a>
            </Magnet>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

ServiceHero.displayName = 'ServiceHero';

// ============================================
// SUB-SERVICES SECTION
// ============================================

interface SubServicesSectionProps {
  service: Service;
}

const SubServicesSection = memo(({ service }: SubServicesSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  // Memoize expensive computations
  const childServices = useMemo(() => getServicesByParent(service.id), [service.id]);
  const subServices = useMemo(
    () => (service.subServices.length > 0 ? service.subServices : null),
    [service.subServices]
  );

  // Memoize animation states
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  if (!subServices && childServices.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={animateState}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4">
            השירותים שלנו בתחום
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            פתרונות מקיפים שמותאמים לצרכים שלכם
          </p>
        </motion.div>

        {/* Sub-services grid */}
        {subServices && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {subServices.map((sub, i) => {
              const SubIcon = sub.icon || service.icon;
              return (
                <motion.div
                  key={sub.id}
                  initial={INITIAL_FADE_UP_40}
                  animate={animateState}
                  transition={{ delay: i * 0.1 }}
                  className="group p-4 sm:p-5 md:p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all"
                >
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4",
                      `bg-gradient-to-br ${service.gradient}`
                    )}
                  >
                    <SubIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{sub.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{sub.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Child services as cards */}
        {childServices.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8">
            {childServices.map((child, i) => {
              const ChildIcon = child.icon;
              return (
                <motion.div
                  key={child.id}
                  initial={INITIAL_FADE_UP_40}
                  animate={animateState}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/services/${child.slug}`}
                    className="group block p-4 sm:p-5 md:p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all h-full"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4",
                        `bg-gradient-to-br ${child.gradient}`
                      )}
                    >
                      <ChildIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {child.name}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">{child.description}</p>
                    <div
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                      style={{ color: child.accentColor }}
                    >
                      <span>למידע נוסף</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

SubServicesSection.displayName = 'SubServicesSection';

// ============================================
// RELATED SERVICES SECTION - BENTO GRID
// ============================================

// Service images for bento cards
const serviceImages: Record<string, string> = {
  "web-development": "/images/services/web-development.webp",
  "ecommerce": "/images/services/ecommerce.webp",
  "branding": "/images/services/branding-design.webp",
  "ai-automation": "/images/services/ai-automation.webp",
  "digital-marketing": "/images/services/digital-marketing.webp",
  "seo": "/images/services/seo-optimization.webp",
  "social-media": "/images/services/social-media-marketing.webp",
  "ai-images": "/images/services/ai-images.webp",
  "strategy": "/images/services/business-strategy.webp",
  "app-development": "/images/services/app-development.webp",
  "custom-development": "/images/services/custom-development.webp",
};

// Bento card sizes for 3 cards layout
type BentoSize = "large" | "medium" | "small";

interface RelatedBentoCardProps {
  service: Service;
  index: number;
  size: BentoSize;
  isInView: boolean;
}

const bentSizeClasses: Record<BentoSize, string> = {
  large: "col-span-2 row-span-2",   // Large card - 2x2
  medium: "col-span-1 row-span-1",  // Medium card - 1x1
  small: "col-span-1 row-span-1",   // Small card - 1x1
};

const RelatedBentoCard = memo(({ service, index, size, isInView }: RelatedBentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = serviceImages[service.slug] || service.image;
  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("group", bentSizeClasses[size])}
    >
      <Link to={`/services/${service.slug}`} className="block h-full">
        <div className="relative h-full rounded-xl overflow-hidden transition-all duration-300 bg-muted/50 hover:shadow-xl">
          {/* Background image */}
          <motion.img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/90 to-transparent",
            isLarge ? "via-black/40" : "via-black/50"
          )} />

          {/* Content */}
          <div className={cn(
            "relative h-full flex flex-col justify-end",
            isLarge ? "p-3 sm:p-4 md:p-6" : "p-2 sm:p-3 md:p-4"
          )}>
            <div>
              {/* Title */}
              <h3 className={cn(
                "font-bold leading-tight text-white",
                isLarge ? "text-base sm:text-lg md:text-xl lg:text-2xl" : "text-sm sm:text-base md:text-lg"
              )}>
                {service.name}
              </h3>

              {/* Description */}
              <p className={cn(
                "text-white/70 mt-1 sm:mt-2",
                isLarge ? "text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3" : "text-xs line-clamp-2"
              )}>
                {service.description}
              </p>

              {/* CTA arrow */}
              <motion.div
                className={cn(
                  "flex items-center gap-1 sm:gap-2 text-white/80 mt-2 sm:mt-3",
                  isLarge ? "text-xs sm:text-sm" : "text-xs"
                )}
                animate={{ x: isHovered ? -3 : 0 }}
              >
                <span>גלה עוד</span>
                <ArrowLeft className={isLarge ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3"} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

RelatedBentoCard.displayName = 'RelatedBentoCard';

interface RelatedServicesSectionProps {
  service: Service;
}

// Size pattern for 3 cards: 1 large on left, 2 stacked on right
const RELATED_SIZE_PATTERN: BentoSize[] = ["large", "medium", "small"];

const RelatedServicesSection = memo(({ service }: RelatedServicesSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  // Memoize expensive computation
  const relatedServices = useMemo(() => getRelatedServices(service.id, 3), [service.id]);

  if (relatedServices.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4">
            שירותים נוספים שיכולים לעניין אתכם
          </h2>
        </motion.div>

        {/* Bento Grid: 3 columns, 2 rows - Large card spans 2x2, two smaller cards stack on right */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[180px] max-w-4xl mx-auto">
          {relatedServices.map((related, i) => (
            <RelatedBentoCard
              key={related.id}
              service={related}
              index={i}
              size={RELATED_SIZE_PATTERN[i] || "small"}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

RelatedServicesSection.displayName = 'RelatedServicesSection';

// ============================================
// CTA SECTION
// ============================================

interface CTASectionProps {
  service: Service;
}

const VIEWPORT_ONCE = { once: true };

// Loading fallback for lazy components
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center bg-nexo-light">
    <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

const CTASection = memo(({ service }: CTASectionProps) => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={INITIAL_FADE_UP_40}
          whileInView={ANIMATE_VISIBLE}
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl mx-auto"
        >
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4 sm:mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8">
            בואו נדבר על איך {service.name} יכול לעזור לעסק שלכם לצמוח.
            שיחת ייעוץ ראשונית - ללא התחייבות.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* Primary CTA - Service gradient with magnetic pull */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className={cn(
                  "group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden",
                  `bg-gradient-to-r ${service.gradient}`
                )}
              >
                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  צרו קשר
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            {/* Secondary CTA - Muted with magnetic pull */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/services"
                className="group relative inline-flex items-center gap-2 bg-muted text-foreground px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all border border-border overflow-hidden"
              >
                {/* Glow effect on hover */}
                <span className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  כל השירותים
                </span>
              </Link>
            </Magnet>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// ============================================
// MAIN SERVICE DETAIL PAGE
// ============================================

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Memoize service lookup - only recalculate when slug changes
  const service = useMemo(() => (slug ? getServiceBySlug(slug) : undefined), [slug]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Redirect to services page if service not found
  useEffect(() => {
    if (slug && !service) {
      navigate("/services", { replace: true });
    }
  }, [slug, service, navigate]);

  if (!service) {
    return null;
  }

  // JSON-LD Structured Data Schema for Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description || `${service.name} - שירותי נקסו`,
    "provider": {
      "@type": "Organization",
      "name": "NEXO AGENCY",
      "url": "https://nexo.agency"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Israel"
    },
    "url": `https://nexo.agency/services/${service.slug}`
  };

  // BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
      { "@type": "ListItem", "position": 2, "name": "שירותים", "item": "https://nexo.agency/services" },
      { "@type": "ListItem", "position": 3, "name": service.name, "item": `https://nexo.agency/services/${service.slug}` }
    ]
  };

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      {/* SEO Meta Tags and JSON-LD Structured Data */}
      <Helmet>
        <title>{service.name} | NEXO AGENCY</title>
        <meta name="description" content={service.description || `${service.name} - שירותי נקסו`} />
        <link rel="canonical" href={`https://nexo.agency/services/${service.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${service.name} | NEXO AGENCY`} />
        <meta property="og:description" content={service.description || `${service.name} - שירותי נקסו`} />
        <meta property="og:url" content={`https://nexo.agency/services/${service.slug}`} />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${service.name} | NEXO AGENCY`} />
        <meta name="twitter:description" content={service.description || `${service.name} - שירותי נקסו`} />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href={`https://nexo.agency/services/${service.slug}`} />
        <link rel="alternate" hreflang="x-default" href={`https://nexo.agency/services/${service.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <GlassNavbar />

      <main id="main-content">
        {/* Hero with animated background - wrapped in ErrorBoundary for WebGL safety */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <ServiceHero service={service} />
        </ErrorBoundary>

        {/* Sub-Services Grid - Our services in the field */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<div className="h-96 bg-white" />}>
            <SubServicesGridSection service={service} />
          </Suspense>
        </ErrorBoundary>

        {/* Differentiators Section - Why choose us (Bento Grid) */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<div className="h-96 bg-background" />}>
            <DifferentiatorsSection service={service} />
          </Suspense>
        </ErrorBoundary>

        {/* Case Study Highlight - Success story */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<div className="h-96 bg-background" />}>
            <CaseStudyHighlight service={service} />
          </Suspense>
        </ErrorBoundary>

        {/* How it Works - Process Section with scroll-driven animation */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<SectionLoader />}>
            <ProcessSection serviceId={service.slug} />
          </Suspense>
        </ErrorBoundary>

        {/* FAQ Section - Common questions (same as homepage) */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </ErrorBoundary>

        {/* Related Services - Other services */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <RelatedServicesSection service={service} />
        </ErrorBoundary>

        {/* Service Blog Section - Related articles */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<div className="h-96 bg-background" />}>
            <ServiceBlogSection service={service} />
          </Suspense>
        </ErrorBoundary>

        {/* CTA Section */}
        <CTASection service={service} />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
