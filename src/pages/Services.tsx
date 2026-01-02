import { motion, useInView } from "framer-motion";
import { useRef, useState, lazy, Suspense, memo, useMemo, useCallback } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import { Globe } from "@/components/ui/globe";
import { cn } from "@/lib/utils";
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
  "web-development": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
  "ecommerce": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  "branding": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "ai-automation": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "digital-marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "seo": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  "social-media": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
  "strategy": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "app-development": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  "custom-development": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
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
      {/* Globe Background - Centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-60">
          <Globe className="w-full h-full" />
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-hero-bg via-transparent to-hero-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-hero-bg via-transparent to-hero-bg pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
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
            השירותים
            <br />
            <span className="text-gradient">שלנו.</span>
          </h1>

          <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl mb-10">
            עיצוב, טכנולוגיה ובינה עסקית שנועדו למטרה אחת - להצמיח את העסק שלך. מהרעיון הראשוני ועד להשקה והלאה.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/contact#contact-form"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              בואו נדבר
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 bg-white/10 text-hero-fg px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all border border-white/20"
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
    <section id="services" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 50 }}
            viewport={{ once: true }}
            className="h-0.5 bg-primary mx-auto mb-4"
          />
          <h2 className="text-2xl md:text-4xl font-black text-foreground mb-2">
            כל מה שהעסק שלכם צריך
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
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
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            בואו נדבר על איך אנחנו יכולים לעזור לכם להגיע למטרות שלכם.
            שיחת ייעוץ ראשונית - ללא התחייבות.
          </p>
          <Link
            to="/contact#contact-form"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/20"
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

const Services = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <GlassNavbar />
      <ServicesHero />
      <ServicesBentoGrid />
      <Suspense fallback={<SectionLoader />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BlogCarouselSection
          categories={["שיווק", "שיווק דיגיטלי", "עסקים", "AI & טכנולוגיה", "שיווק תוכן"]}
          title="מאמרים רלוונטיים"
          subtitle="טיפים ותובנות לשיפור הנוכחות הדיגיטלית של העסק שלכם"
        />
      </Suspense>
      <CTASection />
      <Footer />
    </div>
  );
};

export default Services;
