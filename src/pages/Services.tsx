import { motion, useInView } from "framer-motion";
import { useRef, useState, lazy, Suspense, memo, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import ErrorBoundary, { SectionErrorFallback } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";

// Lazy load heavy WebGL Globe component for better performance
const Globe = lazy(() => import("@/components/ui/globe").then(mod => ({ default: mod.Globe })));
import {
  getMainServices,
  getSecondaryServices,
  type Service,
} from "@/data/services";

// Lazy load heavy components for better performance
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const BlogCarouselSection = lazy(() => import("@/components/BlogCarouselSection"));

// ============================================
// BENTO CARD COMPONENT - Golden Ratio Based
// ============================================

// Golden ratio = 1.618 - used for proportional card sizing
// Card sizes based on golden ratio grid units
type CardSize = "golden" | "square" | "wide" | "tall";

interface ServiceBentoCardProps {
  service: Service;
  index: number;
  size: CardSize;
  customImage?: string;
}

// Grid uses golden ratio: base unit 100px, golden = 162px
const sizeClasses: Record<CardSize, string> = {
  square: "col-span-1 row-span-1",      // 1:1 ratio
  golden: "col-span-2 row-span-2",      // Golden rectangle (large)
  wide: "col-span-2 row-span-1",        // 1.618:1 horizontal
  tall: "col-span-1 row-span-2",        // 1:1.618 vertical
};

// New images for services (different from other pages)
const serviceImages: Record<string, string> = {
  "web-development": "/images/services/web-development.webp",
  "ecommerce": "/images/services/ecommerce.webp",
  "branding": "/images/services/branding-design.webp",
  "ai-automation": "/images/services/ai-automation.webp",
  "digital-marketing": "/images/services/digital-marketing.webp",
  "seo": "/images/services/seo-optimization.webp",
  "social-media": "/images/services/social-media-marketing.webp",
  "strategy": "/images/services/business-strategy.webp",
  "app-development": "/images/services/app-development.webp",
  "custom-development": "/images/services/custom-development.webp",
};

const ServiceBentoCard = memo(({ service, index, size }: ServiceBentoCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-20px" });
  const [isHovered, setIsHovered] = useState(false);

  // Memoize handlers to prevent recreation on every render
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Show images on ALL cards for consistent visual style
  const imageUrl = serviceImages[service.slug] || service.image;
  const isLarge = size === "golden";
  const isWide = size === "wide";
  const isSmall = size === "square";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("group", sizeClasses[size])}
    >
      <Link to={`/services/${service.slug}`} className="block h-full">
        <div className="relative h-full rounded-xl overflow-hidden transition-all duration-300 bg-muted/50 hover:shadow-xl">
          {/* Background image for ALL cards */}
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
            isSmall ? "via-black/50" : "via-black/40"
          )} />

          {/* Content */}
          <div className={cn(
            "relative h-full flex flex-col justify-end",
            isSmall ? "p-3" : "p-4"
          )}>
            <div>
              {/* Title */}
              <h3 className={cn(
                "font-bold leading-tight text-white",
                isSmall ? "text-sm" : "text-base md:text-lg"
              )}>
                {service.name}
              </h3>

              {/* Description - hide on small cards */}
              {!isSmall && (
                <p className={cn(
                  "text-white/70 mt-1 text-xs",
                  isWide ? "line-clamp-1" : "line-clamp-2"
                )}>
                  {service.description}
                </p>
              )}

              {/* CTA arrow */}
              <motion.div
                className={cn(
                  "flex items-center gap-1 text-white/80",
                  isSmall ? "text-[10px] mt-1" : "text-xs mt-2"
                )}
                animate={{ x: isHovered ? -3 : 0 }}
              >
                <span>למידע נוסף</span>
                <ArrowLeft className={isSmall ? "w-2.5 h-2.5" : "w-3 h-3"} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ServiceBentoCard.displayName = 'ServiceBentoCard';

// ============================================
// HERO SECTION WITH GLOBE
// ============================================

const ServicesHero = memo(() => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <section className="relative min-h-[85vh] flex items-center bg-hero-bg pt-20 overflow-hidden">
      {/* Globe Background - Centered with lazy loading */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] opacity-60">
          <ErrorBoundary fallback={<SectionErrorFallback />}>
            <Suspense fallback={<div className="animate-pulse bg-muted h-full w-full rounded-full" />}>
              <Globe className="w-full h-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-hero-bg via-transparent to-hero-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-hero-bg via-transparent to-hero-bg pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="h-1 w-20 bg-primary mb-8 origin-left"
          />

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-hero-fg leading-[0.9] mb-6 sm:mb-8">
            השירותים
            <br />
            <span className="text-gradient">שלנו.</span>
          </h1>

          <p className="text-hero-fg/70 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mb-8 sm:mb-10">
            עיצוב, טכנולוגיה ובינה עסקית שנועדו למטרה אחת - להצמיח את העסק שלך. מהרעיון הראשוני ועד להשקה והלאה.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link
              to="/contact#contact-form"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              בואו נדבר
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-white/10 text-hero-fg px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:bg-white/20 transition-all border border-white/20"
            >
              גלו את השירותים
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

ServicesHero.displayName = 'ServicesHero';

// ============================================
// SERVICES BENTO GRID SECTION
// ============================================

// Size pattern defined outside component to prevent recreation
const SIZE_PATTERN: CardSize[] = [
  "golden",  // Web Development - 2x2 (4 units)
  "golden",  // AI & Automation - 2x2 (4 units) - BIG SERVICE!
  "tall",    // Branding + Social Media - 1x2 (2 units) - includes Social Media!
  "tall",    // E-commerce - 1x2 (2 units)
  "tall",    // Digital Marketing - 1x2 (2 units)
  "tall",    // SEO - 1x2 (2 units) - expanded vertically to fill space
  "wide",    // Digital Strategy - 2x1 (2 units)
  "square",  // App Development - 1x1 (1 unit)
  "square",  // Custom Development - 1x1 (1 unit)
];
// Total: 4+4+2+2+2+2+2+1+1 = 20 units = 5 rows exactly!

const ServicesBentoGrid = memo(() => {
  // Memoize service computation to prevent recalculation on every render
  const customOrderedServices = useMemo(() => {
    const mainServices = getMainServices();
    const secondaryServices = getSecondaryServices();
    const allServicesData = [...mainServices, ...secondaryServices];

    // Custom order: AI & Automation bigger, Social Media INSIDE Branding
    // Find services by slug for custom ordering
    const findService = (slug: string) => allServicesData.find(s => s.slug === slug)!;

    // Social Media is now part of Branding (tall card), so we have 9 cards
    return [
      findService("web-development"),      // 1. Golden - prominent
      findService("ai-automation"),         // 2. Golden - NOW BIGGER (important service!)
      findService("branding"),              // 3. Tall - includes Social Media inside!
      findService("ecommerce"),             // 4. Tall
      findService("digital-marketing"),     // 5. Tall
      findService("seo"),                   // 6. Square
      findService("strategy"),              // 7. Wide
      findService("app-development"),       // 8. Square
      findService("custom-development"),    // 9. Square
    ];
  }, []);

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-0.5 w-[50px] bg-primary mx-auto mb-4 origin-center"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2">
            כל מה שהעסק שלכם צריך
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-lg mx-auto">
            פתרונות דיגיטליים מקיפים שמביאים תוצאות אמיתיות
          </p>
        </motion.div>

        {/* Golden Ratio Bento Grid
            Base row: 186px (300/1.618 = 185.4 ≈ 186) for TRUE golden ratio
            1×1 = 300×186 = 1.61:1 ≈ φ | 2×2 = 600×372 = 1.61:1 ≈ φ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 auto-rows-[155px] md:auto-rows-[186px]">
          {customOrderedServices.map((service, index) => (
            <ServiceBentoCard
              key={service.id}
              service={service}
              index={index}
              size={SIZE_PATTERN[index] || "square"}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesBentoGrid.displayName = 'ServicesBentoGrid';

// ProcessSection and FAQSection are imported from shared components

// ============================================
// CTA SECTION
// ============================================

const CTASection = memo(() => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 sm:mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
            בואו נדבר על איך אנחנו יכולים לעזור לכם להגיע למטרות שלכם.
            שיחת ייעוץ ראשונית - ללא התחייבות.
          </p>
          <Link
            to="/contact#contact-form"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/20"
          >
            צרו קשר
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// ============================================
// MAIN SERVICES PAGE
// ============================================

// Loading fallback for lazy components - memoized since it's a static component
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

// BreadcrumbList JSON-LD Schema
const servicesBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
    { "@type": "ListItem", "position": 2, "name": "שירותים", "item": "https://nexo.agency/services" }
  ]
};

// ItemList JSON-LD Schema for Services
const servicesListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "שירותי נקסו",
  "description": "שירותי דיגיטל מקצועיים - בניית אתרים, מיתוג, שיווק דיגיטלי ופתרונות AI לעסקים",
  "numberOfItems": 9,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "בניית אתרים ופיתוח",
        "description": "אתרים מותאמים אישית שממירים מבקרים ללקוחות. טכנולוגיה מתקדמת, עיצוב מרהיב, וביצועים יוצאי דופן.",
        "url": "https://nexo.agency/services/web-development",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Service",
        "name": "בינה מלאכותית ואוטומציה",
        "description": "פתרונות AI חכמים שחוסכים זמן וכסף. מצ'אטבוטים ועד אוטומציות מורכבות - הטכנולוגיה של המחר, היום.",
        "url": "https://nexo.agency/services/ai-automation",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Service",
        "name": "מיתוג וזהות חזותית",
        "description": "מותג חזק זה הנכס היקר ביותר שלכם. אנחנו יוצרים זהויות שמספרות סיפור ובונות אמון מהרגע הראשון.",
        "url": "https://nexo.agency/services/branding",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Service",
        "name": "חנויות אונליין",
        "description": "חנויות אונליין שמייצרות מכירות. מ-Shopify ועד פתרונות מותאמים - הכל עם דגש על המרות ונוחות.",
        "url": "https://nexo.agency/services/ecommerce",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Service",
        "name": "שיווק דיגיטלי",
        "description": "קמפיינים חכמים שמביאים לקוחות אמיתיים. לא סתם קליקים - המרות, מכירות, וROI שאפשר למדוד.",
        "url": "https://nexo.agency/services/digital-marketing",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Service",
        "name": "קידום אורגני SEO",
        "description": "קידום אורגני שמביא תנועה איכותית לאורך זמן. אסטרטגיית SEO מקיפה שעובדת.",
        "url": "https://nexo.agency/services/seo",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 7,
      "item": {
        "@type": "Service",
        "name": "אסטרטגיה דיגיטלית",
        "description": "אסטרטגיה דיגיטלית מקיפה שמנחה כל החלטה ומובילה לתוצאות מדידות.",
        "url": "https://nexo.agency/services/strategy",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 8,
      "item": {
        "@type": "Service",
        "name": "פיתוח אפליקציות",
        "description": "פיתוח אפליקציות לאנדרואיד ו-iOS. מאפליקציות פשוטות ועד פלטפורמות מורכבות.",
        "url": "https://nexo.agency/services/app-development",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 9,
      "item": {
        "@type": "Service",
        "name": "פיתוח מותאם אישית",
        "description": "כשפתרונות מדף לא מספיקים - אנחנו בונים בדיוק מה שצריך. פיתוח מותאם לצרכים הייחודיים שלכם.",
        "url": "https://nexo.agency/services/custom-development",
        "provider": {
          "@type": "Organization",
          "name": "נקסו",
          "url": "https://nexo.agency"
        }
      }
    }
  ]
};

const Services = () => {
  return (
    <>
      <Helmet>
        <title>השירותים שלנו - נקסו | NEXO AGENCY</title>
        <meta name="description" content="כל שירותי הדיגיטל במקום אחד. בניית אתרים, מיתוג, שיווק דיגיטלי ופתרונות AI לעסקים." />
        <link rel="canonical" href="https://nexo.agency/services" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="השירותים שלנו - נקסו" />
        <meta property="og:description" content="כל שירותי הדיגיטל במקום אחד. בניית אתרים, מיתוג, שיווק דיגיטלי ופתרונות AI לעסקים." />
        <meta property="og:url" content="https://nexo.agency/services" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="השירותים שלנו - נקסו" />
        <meta name="twitter:description" content="כל שירותי הדיגיטל במקום אחד. בניית אתרים, מיתוג, שיווק דיגיטלי ופתרונות AI לעסקים." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/services" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/services" />
        <script type="application/ld+json">
          {JSON.stringify(servicesBreadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(servicesListSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-clip">
        <GlassNavbar />
      <main id="main-content">
        {/* Hero with Globe - wrapped in ErrorBoundary for WebGL safety */}
        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <ServicesHero />
        </ErrorBoundary>

        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <ServicesBentoGrid />
        </ErrorBoundary>

        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<SectionLoader />}>
            <ProcessSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
          <Suspense fallback={<SectionLoader />}>
            <BlogCarouselSection
              categories={["שיווק", "שיווק דיגיטלי", "עסקים", "AI & טכנולוגיה", "שיווק תוכן"]}
              title="מאמרים רלוונטיים"
              subtitle="טיפים ותובנות לשיפור הנוכחות הדיגיטלית של העסק שלכם"
            />
          </Suspense>
        </ErrorBoundary>

        <CTASection />
      </main>
        <Footer />
      </div>
    </>
  );
};

export default Services;
