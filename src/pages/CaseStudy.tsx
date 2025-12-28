import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { getCaseStudyBySlug, caseStudies } from "@/data/caseStudies";
import GlassNavbar from "@/components/GlassNavbar";
import CaseStudyWorkflow from "@/components/CaseStudyWorkflow";
import SimplyHebrewWorkflow from "@/components/SimplyHebrewWorkflow";
import TeenvestsorWorkflow from "@/components/TeenvestsorWorkflow";
import LiveWebsitePreview from "@/components/LiveWebsitePreview";
import Footer from "@/components/Footer";
import TypeformPopup from "@/components/TypeformPopup";
import Silk from "@/components/ui/Silk";
import { dispatchPreloaderComplete } from "@/lib/lenis";

// Animated text reveal component
const TextReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// Floating decorative element
const FloatingOrb = ({ color, size = 200, delay = 0, className = "" }: { color: string; size?: number; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

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
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroImageY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const heroImageScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Ensure Lenis smooth scroll is activated (for direct navigation to case study)
  useEffect(() => {
    // Set session storage and dispatch event to start Lenis
    sessionStorage.setItem("nexo-preloader-shown", "true");
    dispatchPreloaderComplete();
  }, []);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
        <h1 className="text-4xl font-black text-[#1a1a1a] mb-4">פרויקט לא נמצא</h1>
        <p className="text-[#666] mb-8">הפרויקט שחיפשת לא קיים במערכת</p>
        <Link
          to="/portfolio"
          className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-full hover:bg-primary transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לפורטפוליו
        </Link>
      </div>
    );
  }

  const { brandColors } = caseStudy;

  // Detect if background is dark for text color adjustments
  const isDarkBackground = useMemo(() => {
    const bg = brandColors.background;
    const hex = bg.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 0.5;
  }, [brandColors.background]);

  // Dynamic text colors based on background brightness
  const textColors = useMemo(() => ({
    primary: isDarkBackground ? '#ffffff' : brandColors.primary,
    secondary: isDarkBackground ? '#e2e8f0' : `${brandColors.primary}99`,
    muted: isDarkBackground ? 'rgba(255,255,255,0.6)' : `${brandColors.primary}60`,
    accent: brandColors.secondary,
    cardBg: isDarkBackground ? 'rgba(255,255,255,0.08)' : `${brandColors.primary}08`,
    cardBgAlt: isDarkBackground ? 'rgba(255,255,255,0.12)' : `${brandColors.secondary}15`,
  }), [isDarkBackground, brandColors]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: brandColors.background }}>
      <GlassNavbar />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-[100vh] overflow-hidden"
        style={{ backgroundColor: brandColors.primary }}
      >
        {/* Silk Background for Teenvestsor */}
        {slug === 'teenvestsor' && (
          <div className="absolute inset-0 z-0">
            <Silk
              speed={3}
              scale={1.2}
              color="#5B21B6"
              noiseIntensity={1.2}
              rotation={0}
            />
            {/* Overlay gradient for better text readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.7) 100%)'
              }}
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
            <img
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary}60 0%, ${brandColors.primary}95 100%)`
              }}
            />
          </motion.div>
        )}


        {/* Hero Content with Text Reveal */}
        <motion.div
          className="absolute inset-0 flex items-end pb-24 md:pb-36"
          style={{ opacity: heroOpacity, y: heroTextY }}
        >
          <div className="container mx-auto px-6 md:px-12" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <p
                  className="text-sm uppercase tracking-[0.3em] font-medium"
                  style={{ color: brandColors.secondary }}
                >
                  {caseStudy.category}
                </p>
              </motion.div>

              {/* Animated Title */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-7xl md:text-9xl lg:text-[12rem] font-black leading-[0.85] mb-8 tracking-tight"
                  style={{ color: isDarkBackground ? '#ffffff' : brandColors.background }}
                >
                  {caseStudy.title}
                </motion.h1>
              </div>

              {/* Tagline with stagger */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-xl md:text-2xl lg:text-3xl font-light max-w-2xl leading-relaxed"
                style={{ color: isDarkBackground ? 'rgba(255,255,255,0.9)' : `${brandColors.background}dd` }}
              >
                {caseStudy.tagline}
              </motion.p>

              {/* View Website Button */}
              {caseStudy.website && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-10"
                >
                  <MagneticButton>
                    <a
                      href={caseStudy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 group"
                      style={{
                        backgroundColor: brandColors.secondary,
                        color: isDarkBackground ? '#1a1a1a' : brandColors.primary
                      }}
                    >
                      <span>צפייה באתר החי</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </MagneticButton>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

      </motion.section>

      {/* Project Meta */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: isDarkBackground ? 'rgba(255,255,255,0.1)' : `${brandColors.primary}10` }}>
        <div className="container mx-auto px-6 md:px-12" dir="rtl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <p className="text-sm uppercase tracking-wider mb-2" style={{ color: textColors.muted }}>
                לקוח
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.client}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Calendar className="w-4 h-4" /> שנה
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.year}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Clock className="w-4 h-4" /> משך הפרויקט
              </p>
              <p className="text-lg font-semibold" style={{ color: textColors.primary }}>
                {caseStudy.duration}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: textColors.muted }}>
                <Tag className="w-4 h-4" /> שירותים
              </p>
              <div className="flex flex-wrap gap-2">
                {caseStudy.services.map((service, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: isDarkBackground ? 'rgba(255,255,255,0.15)' : `${brandColors.secondary}20`,
                      color: textColors.primary
                    }}
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12" dir="rtl">
          {/* Overview Title & Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-10"
          >
            <h2
              className="text-3xl md:text-4xl font-black mb-4 leading-tight"
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
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 md:p-8 rounded-2xl"
              style={{ backgroundColor: textColors.cardBg }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: textColors.primary }}
              >
                האתגר
              </h3>
              <p
                className="leading-relaxed text-base"
                style={{ color: textColors.secondary }}
              >
                {caseStudy.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 md:p-8 rounded-2xl"
              style={{ backgroundColor: textColors.cardBgAlt }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: textColors.primary }}
              >
                הפתרון
              </h3>
              <p
                className="leading-relaxed text-base"
                style={{ color: textColors.secondary }}
              >
                {caseStudy.solution}
              </p>
            </motion.div>
          </div>

          {/* View Website Button */}
          {caseStudy.website && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <a
                href={caseStudy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:gap-4"
                style={{
                  backgroundColor: isDarkBackground ? brandColors.secondary : brandColors.primary,
                  color: isDarkBackground ? '#ffffff' : brandColors.background
                }}
              >
                <span>לצפייה באתר החי</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section - Conversational */}
      <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10" dir="rtl">
          {/* Conversational headline */}
          <TextReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-[1.1] text-foreground">
              אהבתם את מה שראיתם?
            </h2>
          </TextReveal>

          <TextReveal delay={0.1}>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1]">
              <span className="text-primary">בואו נדבר על הפרויקט הבא שלכם</span>
            </h3>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed text-foreground/70"
          >
            אנחנו כבר מתרגשים לשמוע את הסיפור שלכם ולהפוך אותו למשהו מיוחד
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <MagneticButton>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex items-center gap-4 px-10 py-5 rounded-full font-bold text-lg transition-all group bg-primary text-white hover:bg-primary/90"
              >
                <span>בואו נתחיל</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
              </button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Typeform Popup */}
      <TypeformPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Project Navigation - Bottom */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Next Project */}
            {caseStudy.nextProject ? (
              <Link
                to={`/case-studies/${caseStudy.nextProject}`}
                className="group relative py-16 md:py-24 px-8 md:px-12 border-b md:border-b-0 md:border-l border-white/10 transition-colors hover:bg-white/5"
              >
                <div className="flex flex-col items-end text-right" dir="rtl">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
                    הפרויקט הבא
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {caseStudy.nextProject.charAt(0).toUpperCase() + caseStudy.nextProject.slice(1)}
                  </h3>
                  <div className="flex items-center gap-2 text-white/60 group-hover:text-primary transition-colors">
                    <span className="text-sm">לפרויקט</span>
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="py-16 md:py-24 px-8 md:px-12 border-b md:border-b-0 md:border-l border-white/10" />
            )}

            {/* All Projects */}
            <Link
              to="/portfolio"
              className="group relative py-16 md:py-24 px-8 md:px-12 transition-colors hover:bg-white/5"
            >
              <div className="flex flex-col items-start text-right" dir="rtl">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
                  עוד פרויקטים
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaseStudy;
