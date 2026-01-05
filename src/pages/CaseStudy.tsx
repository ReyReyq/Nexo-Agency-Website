import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, Calendar, Tag, ChevronLeft } from "lucide-react";
import { getCaseStudyBySlug } from "@/data/caseStudies";
import GlassNavbar from "@/components/GlassNavbar";
import CaseStudyWorkflow from "@/components/CaseStudyWorkflow";
import SimplyHebrewWorkflow from "@/components/SimplyHebrewWorkflow";
import TeenvestsorWorkflow from "@/components/TeenvestsorWorkflow";
import LiveWebsitePreview from "@/components/LiveWebsitePreview";
import Footer from "@/components/Footer";
import TypeformPopup from "@/components/TypeformPopup";
import ErrorBoundary, { WebGLErrorFallback } from "@/components/ErrorBoundary";
import { dispatchPreloaderComplete } from "@/lib/lenis";

// Lazy load heavy Three.js WebGL Silk component for better performance
const Silk = lazy(() => import("@/components/ui/Silk"));

// Stable animation configurations to prevent re-creation on each render
const textRevealTransitionBase = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const };
const textRevealInitial = { y: "100%" };
const textRevealAnimate = { y: 0 };

// Animated text reveal component - memoized to prevent unnecessary re-renders
const TextReveal = memo(({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const transition = useMemo(() => ({ ...textRevealTransitionBase, delay }), [delay]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={textRevealInitial}
        animate={isInView ? textRevealAnimate : undefined}
        transition={transition}
      >
        {children}
      </motion.div>
    </div>
  );
});
TextReveal.displayName = 'TextReveal';

// Stable spring transition for magnetic button
const magneticSpringTransition = { type: "spring" as const, stiffness: 150, damping: 15 };
const defaultPosition = { x: 0, y: 0 };

// Magnetic button component - memoized with stable callbacks
const MagneticButton = memo(({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  const [position, setPosition] = useState(defaultPosition);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition(defaultPosition);
  }, []);

  const animateValue = useMemo(() => ({ x: position.x, y: position.y }), [position.x, position.y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={animateValue}
      transition={magneticSpringTransition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
});
MagneticButton.displayName = 'MagneticButton';

// Stable animation values for FloatingOrb
const floatingOrbAnimate = {
  y: [0, -30, 0],
  x: [0, 15, 0],
  scale: [1, 1.1, 1],
};

// Floating decorative element - memoized
const FloatingOrb = memo(({ color, size = 200, delay = 0, className = "" }: { color: string; size?: number; delay?: number; className?: string }) => {
  const style = useMemo(() => ({
    width: size,
    height: size,
    background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
  }), [color, size]);

  const transition = useMemo(() => ({
    duration: 8,
    delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
  }), [delay]);

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={style}
      animate={floatingOrbAnimate}
      transition={transition}
    />
  );
});
FloatingOrb.displayName = 'FloatingOrb';

// Stable animation configurations for motion components
const fadeInUpInitial = { opacity: 0, y: 20 };
const fadeInUpAnimate = { opacity: 1, y: 0 };
const fadeInInitial = { opacity: 0 };
const fadeInAnimate = { opacity: 1 };
const fadeInLeftInitial = { opacity: 0, x: -20 };
const fadeInLeftAnimate = { opacity: 1, x: 0 };
const slideUpInitial = { y: "100%" };
const slideUpAnimate = { y: 0 };
const fadeInUp30Initial = { opacity: 0, y: 30 };
const fadeInUp30Animate = { opacity: 1, y: 0 };
const scaleInInitial = { opacity: 0, scale: 0.9 };
const scaleInAnimate = { opacity: 1, scale: 1 };
const viewportOnce = { once: true };

// Stable transition configurations
const transition05 = { duration: 0.5 };
const transition05Delay01 = { duration: 0.5, delay: 0.1 };
const transition05Delay02 = { duration: 0.5, delay: 0.2 };
const transition06 = { duration: 0.6 };
const transition06Delay03 = { duration: 0.6, delay: 0.3 };
const transition06Delay1 = { duration: 0.6, delay: 1 };
const transition08Delay07 = { duration: 0.8, delay: 0.7 };
const transitionDelay0 = { delay: 0 };
const transitionDelay01 = { delay: 0.1 };
const transitionDelay02 = { delay: 0.2 };
const transitionDelay03 = { delay: 0.3 };
const transitionDelay04Spring = { delay: 0.4, type: "spring" as const, stiffness: 200 };
const titleTransition = { duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as const };

// Stable style for silk overlay gradient
const silkOverlayStyle = {
  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.7) 100%)'
};

// Spring config for scroll animations
const springConfig = { stiffness: 100, damping: 30 };

// Helper to generate srcset for case study hero images
// Supports responsive loading for full-width hero images
const generateCaseStudySrcSet = (src: string) => {
  if (!src.startsWith('/portfolio/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  return {
    src,
    srcSet: `${basePath}-sm${extension} 640w, ${basePath}-md${extension} 1024w, ${src} 1920w`,
    sizes: '100vw', // Hero images are full viewport width
  };
};

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const caseStudy = getCaseStudyBySlug(slug || "");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const heroImageY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const heroImageScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);

  // Stable callback for popup close
  const handlePopupClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  // Stable callback for popup open
  const handlePopupOpen = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  // Ensure Lenis smooth scroll is activated (for direct navigation to case study)
  useEffect(() => {
    // Set session storage and dispatch event to start Lenis
    sessionStorage.setItem("nexo-preloader-shown", "true");
    dispatchPreloaderComplete();
  }, []);

  // Memoize brandColors to prevent unnecessary recalculations
  const brandColors = useMemo(() => caseStudy?.brandColors, [caseStudy?.brandColors]);

  // Detect if background is dark for text color adjustments
  const isDarkBackground = useMemo(() => {
    if (!brandColors) return false;
    const bg = brandColors.background;
    const hex = bg.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 0.5;
  }, [brandColors]);

  // Dynamic text colors based on background brightness
  const textColors = useMemo(() => {
    if (!brandColors) return null;
    return {
      primary: isDarkBackground ? '#ffffff' : brandColors.primary,
      secondary: isDarkBackground ? '#e2e8f0' : `${brandColors.primary}99`,
      muted: isDarkBackground ? 'rgba(255,255,255,0.6)' : `${brandColors.primary}60`,
      accent: brandColors.secondary,
      cardBg: isDarkBackground ? 'rgba(255,255,255,0.08)' : `${brandColors.primary}08`,
      cardBgAlt: isDarkBackground ? 'rgba(255,255,255,0.12)' : `${brandColors.secondary}15`,
    };
  }, [isDarkBackground, brandColors]);

  // Memoized style objects to prevent re-creation on every render
  const heroSectionStyle = useMemo(() =>
    brandColors ? { backgroundColor: brandColors.primary } : undefined,
    [brandColors]
  );

  const containerStyle = useMemo(() =>
    brandColors ? { backgroundColor: brandColors.background } : undefined,
    [brandColors]
  );

  const heroImageOverlayStyle = useMemo(() =>
    brandColors ? { background: `linear-gradient(135deg, ${brandColors.primary}60 0%, ${brandColors.primary}95 100%)` } : undefined,
    [brandColors]
  );

  const borderStyle = useMemo(() => ({
    borderColor: isDarkBackground ? 'rgba(255,255,255,0.1)' : brandColors ? `${brandColors.primary}10` : undefined
  }), [isDarkBackground, brandColors]);

  const serviceTagStyle = useMemo(() => ({
    backgroundColor: isDarkBackground ? 'rgba(255,255,255,0.15)' : brandColors ? `${brandColors.secondary}20` : undefined,
    color: textColors?.primary
  }), [isDarkBackground, brandColors, textColors]);

  const websiteButtonStyle = useMemo(() =>
    brandColors ? {
      backgroundColor: brandColors.secondary,
      color: isDarkBackground ? '#1a1a1a' : brandColors.primary
    } : undefined,
    [brandColors, isDarkBackground]
  );

  const overviewButtonStyle = useMemo(() =>
    brandColors ? {
      backgroundColor: isDarkBackground ? brandColors.secondary : brandColors.primary,
      color: isDarkBackground ? '#ffffff' : brandColors.background
    } : undefined,
    [brandColors, isDarkBackground]
  );

  const titleStyle = useMemo(() =>
    brandColors ? { color: isDarkBackground ? '#ffffff' : brandColors.background } : undefined,
    [brandColors, isDarkBackground]
  );

  const taglineStyle = useMemo(() =>
    brandColors ? { color: isDarkBackground ? 'rgba(255,255,255,0.9)' : `${brandColors.background}dd` } : undefined,
    [brandColors, isDarkBackground]
  );

  const categoryStyle = useMemo(() =>
    brandColors ? { color: brandColors.secondary } : undefined,
    [brandColors]
  );

  if (!caseStudy || !brandColors || !textColors) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-nexo-light">
        <h1 className="text-4xl font-black text-nexo-charcoal mb-4">פרויקט לא נמצא</h1>
        <p className="text-nexo-ash mb-8">הפרויקט שחיפשת לא קיים במערכת</p>
        <Link
          to="/portfolio"
          className="flex items-center gap-2 px-6 py-3 bg-nexo-charcoal text-white rounded-full hover:bg-primary transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לפורטפוליו
        </Link>
      </div>
    );
  }

  // BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
      { "@type": "ListItem", "position": 2, "name": "תיק עבודות", "item": "https://nexo.agency/portfolio" },
      { "@type": "ListItem", "position": 3, "name": caseStudy.title, "item": `https://nexo.agency/portfolio/${caseStudy.slug}` }
    ]
  };

  return (
    <div className="min-h-screen" style={containerStyle}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{caseStudy.title} | תיק עבודות | NEXO AGENCY</title>
        <meta name="description" content={caseStudy.overview.slice(0, 155)} />
        <link rel="canonical" href={`https://nexo.agency/portfolio/${caseStudy.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${caseStudy.title} | תיק עבודות | NEXO AGENCY`} />
        <meta property="og:description" content={caseStudy.overview.slice(0, 155)} />
        <meta property="og:image" content={caseStudy.heroImage} />
        <meta property="og:url" content={`https://nexo.agency/portfolio/${caseStudy.slug}`} />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${caseStudy.title} | תיק עבודות | NEXO AGENCY`} />
        <meta name="twitter:description" content={caseStudy.overview.slice(0, 155)} />
        <meta name="twitter:image" content={caseStudy.heroImage} />
        <link rel="alternate" hreflang="he" href={`https://nexo.agency/portfolio/${caseStudy.slug}`} />
        <link rel="alternate" hreflang="x-default" href={`https://nexo.agency/portfolio/${caseStudy.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <GlassNavbar />

      <main id="main-content">
        {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen min-h-screen min-h-[100dvh] overflow-hidden"
        style={heroSectionStyle}
      >
        {/* Silk Background for Teenvestsor with lazy loading and error handling */}
        {slug === 'teenvestsor' && (
          <div className="absolute inset-0 z-0">
            <ErrorBoundary variant="component" fallback={<WebGLErrorFallback />}>
              <Suspense fallback={<div className="animate-pulse bg-muted h-full w-full" />}>
                <Silk
                  speed={3}
                  scale={1.2}
                  color="#5B21B6"
                  noiseIntensity={1.2}
                  rotation={0}
                />
              </Suspense>
            </ErrorBoundary>
            {/* Overlay gradient for better text readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={silkOverlayStyle}
            />
          </div>
        )}

        {/* Floating Decorative Orbs - hide for Teenvestsor since we have Silk */}
        {slug !== 'teenvestsor' && (
          <>
            <FloatingOrb color={brandColors.secondary} size={400} delay={0} className="top-20 -right-32 opacity-60" />
            <FloatingOrb color={brandColors.accent} size={300} delay={2} className="bottom-40 -left-20 opacity-40" />
          </>
        )}

        {/* Parallax Hero Image with Scale - hide for Teenvestsor */}
        {slug !== 'teenvestsor' && (
          <motion.div
            className="absolute inset-0"
            style={{ y: heroImageY, scale: heroImageScale }}
          >
            {(() => {
              const imageSet = generateCaseStudySrcSet(caseStudy.heroImage);
              return (
                <img
                  src={imageSet.src}
                  srcSet={imageSet.srcSet}
                  sizes={imageSet.sizes}
                  alt={caseStudy.title}
                  width={1920}
                  height={1080}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              );
            })()}
            <div
              className="absolute inset-0"
              style={heroImageOverlayStyle}
            />
          </motion.div>
        )}


        {/* Hero Content with Text Reveal */}
        <motion.div
          className="absolute inset-0 flex items-end pb-16 sm:pb-24 md:pb-36"
          style={{ opacity: heroOpacity, y: heroTextY }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
            <motion.div
              initial={fadeInInitial}
              animate={fadeInAnimate}
              transition={transition05}
            >
              {/* Category */}
              <motion.div
                initial={fadeInLeftInitial}
                animate={fadeInLeftAnimate}
                transition={transition06Delay03}
                className="mb-6"
              >
                <p
                  className="text-sm uppercase tracking-[0.3em] font-medium"
                  style={categoryStyle}
                >
                  {caseStudy.category}
                </p>
              </motion.div>

              {/* Animated Title */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={slideUpInitial}
                  animate={slideUpAnimate}
                  transition={titleTransition}
                  className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] mb-6 sm:mb-8 tracking-tight"
                  style={titleStyle}
                >
                  {caseStudy.title}
                </motion.h1>
              </div>

              {/* Tagline with stagger */}
              <motion.p
                initial={fadeInUp30Initial}
                animate={fadeInUp30Animate}
                transition={transition08Delay07}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-2xl leading-relaxed"
                style={taglineStyle}
              >
                {caseStudy.tagline}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

      </motion.section>

      {/* Project Meta */}
      <section className="py-12 sm:py-16 md:py-24 border-b" style={borderStyle}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <motion.div
              initial={fadeInUpInitial}
              whileInView={fadeInUpAnimate}
              viewport={viewportOnce}
              transition={transitionDelay0}
            >
              <p className="text-sm uppercase tracking-wider mb-2" style={{ color: textColors.muted }}>
                לקוח
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.client}
              </p>
            </motion.div>
            <motion.div
              initial={fadeInUpInitial}
              whileInView={fadeInUpAnimate}
              viewport={viewportOnce}
              transition={transitionDelay01}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Calendar className="w-4 h-4" /> שנה
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.year}
              </p>
            </motion.div>
            <motion.div
              initial={fadeInUpInitial}
              whileInView={fadeInUpAnimate}
              viewport={viewportOnce}
              transition={transitionDelay02}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Clock className="w-4 h-4" /> משך הפרויקט
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.duration}
              </p>
            </motion.div>
            <motion.div
              initial={fadeInUpInitial}
              whileInView={fadeInUpAnimate}
              viewport={viewportOnce}
              transition={transitionDelay03}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Tag className="w-4 h-4" /> שירותים
              </p>
              <div className="flex flex-wrap gap-2">
                {caseStudy.services.map((service, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1 rounded-full"
                    style={serviceTagStyle}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Immersive Workflow Journey - Project-specific */}
      {slug === 'sione' && (
        <CaseStudyWorkflow
          brandStory={caseStudy.brandStory}
          brandIdentity={caseStudy.brandIdentity}
          clientName={caseStudy.client}
          aiModels={caseStudy.aiModels}
        />
      )}

      {/* SimplyHebrew Workflow */}
      {slug === 'simplyhebrew' && (
        <>
          <SimplyHebrewWorkflow
            brandStory={caseStudy.brandStory}
            brandIdentity={caseStudy.brandIdentity}
            clientName={caseStudy.client}
          />
          {/* Live Website Preview with iframe */}
          {caseStudy.website && (
            <LiveWebsitePreview
              url={caseStudy.website}
              title={caseStudy.title}
              brandColors={caseStudy.brandColors}
            />
          )}
        </>
      )}

      {/* Teenvestsor Workflow */}
      {slug === 'teenvestsor' && (
        <>
          <TeenvestsorWorkflow
            brandStory={caseStudy.brandStory}
            brandIdentity={caseStudy.brandIdentity}
            clientName={caseStudy.client}
          />
          {/* Live Website Preview with iframe */}
          {caseStudy.website && (
            <LiveWebsitePreview
              url={caseStudy.website}
              title={caseStudy.title}
              brandColors={caseStudy.brandColors}
            />
          )}
        </>
      )}

      {/* Overview Section - Compact Layout */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
          {/* Overview Title & Text */}
          <motion.div
            initial={fadeInUpInitial}
            whileInView={fadeInUpAnimate}
            viewport={viewportOnce}
            transition={transition06}
            className="max-w-3xl mb-10"
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight"
              style={{ color: textColors.primary }}
            >
              סקירה כללית
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: textColors.secondary }}
            >
              {caseStudy.overview}
            </p>
          </motion.div>

          {/* Challenge & Solution - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={fadeInUp30Initial}
              whileInView={fadeInUp30Animate}
              viewport={viewportOnce}
              transition={transition05}
              className="p-5 sm:p-6 md:p-8 rounded-2xl"
              style={{ backgroundColor: textColors.cardBg }}
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-3"
                style={{ color: textColors.primary }}
              >
                האתגר
              </h3>
              <p
                className="leading-relaxed text-sm sm:text-base"
                style={{ color: textColors.secondary }}
              >
                {caseStudy.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={fadeInUp30Initial}
              whileInView={fadeInUp30Animate}
              viewport={viewportOnce}
              transition={transition05Delay01}
              className="p-5 sm:p-6 md:p-8 rounded-2xl"
              style={{ backgroundColor: textColors.cardBgAlt }}
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-3"
                style={{ color: textColors.primary }}
              >
                הפתרון
              </h3>
              <p
                className="leading-relaxed text-sm sm:text-base"
                style={{ color: textColors.secondary }}
              >
                {caseStudy.solution}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Conversational */}
      <section className="py-16 sm:py-24 md:py-32 bg-nexo-light relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" dir="rtl">
          {/* Conversational headline */}
          <TextReveal>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-[1.1] text-foreground">
              אהבתם את מה שראיתם?
            </h2>
          </TextReveal>

          <TextReveal delay={0.1}>
            <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-[1.1]">
              <span className="text-primary">בואו נדבר על הפרויקט הבא שלכם</span>
            </h3>
          </TextReveal>

          <motion.p
            initial={fadeInUpInitial}
            whileInView={fadeInUpAnimate}
            viewport={viewportOnce}
            transition={transitionDelay03}
            className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed text-foreground/70"
          >
            אנחנו כבר מתרגשים לשמוע את הסיפור שלכם ולהפוך אותו למשהו מיוחד
          </motion.p>

          <motion.div
            initial={scaleInInitial}
            whileInView={scaleInAnimate}
            viewport={viewportOnce}
            transition={transitionDelay04Spring}
          >
            <MagneticButton>
              <button
                onClick={handlePopupOpen}
                className="inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-10 py-4 sm:py-5 min-h-[44px] rounded-full font-bold text-base sm:text-lg transition-all group bg-primary text-white hover:bg-primary/90"
              >
                <span>בואו נתחיל</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
              </button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Typeform Popup */}
      <TypeformPopup isOpen={isPopupOpen} onClose={handlePopupClose} />

      {/* Project Navigation - Bottom */}
      <section className="bg-nexo-charcoal text-white">
        <div className="container mx-auto px-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Next Project */}
            {caseStudy.nextProject ? (
              <Link
                to={`/portfolio/${caseStudy.nextProject}`}
                className="group relative py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 border-b md:border-b-0 md:border-l border-white/10 transition-colors hover:bg-white/5 min-h-[44px]"
              >
                <div className="flex flex-col items-end text-right" dir="rtl">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2 sm:mb-3">
                    הפרויקט הבא
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    {caseStudy.nextProject.charAt(0).toUpperCase() + caseStudy.nextProject.slice(1)}
                  </h3>
                  <div className="flex items-center gap-2 text-white/60 group-hover:text-primary transition-colors">
                    <span className="text-sm">לפרויקט</span>
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 border-b md:border-b-0 md:border-l border-white/10" />
            )}

            {/* All Projects */}
            <Link
              to="/portfolio"
              className="group relative py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 transition-colors hover:bg-white/5 min-h-[44px]"
            >
              <div className="flex flex-col items-start text-right" dir="rtl">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2 sm:mb-3">
                  עוד פרויקטים
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                  כל הפרויקטים
                </h3>
                <div className="flex items-center gap-2 text-white/60 group-hover:text-primary transition-colors">
                  <span className="text-sm">לתיק העבודות</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaseStudy;
