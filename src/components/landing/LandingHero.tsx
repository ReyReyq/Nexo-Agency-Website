import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ChevronDown, Star } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import type { LandingHeroContent } from "@/types/landingPage";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const TRANSITION_MAIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

export interface LandingHeroProps {
  content: LandingHeroContent;
  theme: {
    accentColor: string;
    gradient: string;
    heroImage?: string;
  };
}

const LandingHero = memo(({ content, theme }: LandingHeroProps) => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  // Determine if we're using a hero image or gradient background
  const hasHeroImage = !!theme.heroImage;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden"
      dir="rtl"
    >
      {/* Background - either image or gradient */}
      {hasHeroImage ? (
        <>
          {/* Hero image background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${theme.heroImage})`,
            }}
          />
          {/* Dark overlay for text readability - neutral dark gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </>
      ) : (
        <>
          {/* Fallback gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
          />
          {/* Animated background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Decorative blur elements */}
          <div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-20"
            style={{ backgroundColor: theme.accentColor }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {content.badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/90 text-sm font-medium">{content.badge}</span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.2, ...TRANSITION_MAIN }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            {content.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.3, ...TRANSITION_MAIN }}
            className="text-lg sm:text-xl md:text-2xl text-white/80 font-medium mb-4 max-w-3xl mx-auto"
          >
            {content.subtitle}
          </motion.p>

          {/* Description */}
          {content.description && (
            <motion.p
              initial={INITIAL_FADE_UP}
              animate={isInView ? ANIMATE_VISIBLE : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-8"
            >
              {content.description}
            </motion.p>
          )}

          {/* Trust Badge */}
          {content.trustBadge && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/70 text-sm mb-8"
            >
              {content.trustBadge}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to={content.primaryCTA.href}>
              <ShimmerButton
                className="text-base sm:text-lg font-bold px-8 py-4"
                shimmerColor="rgba(255,255,255,0.3)"
                background={theme.accentColor}
              >
                <span className="flex items-center gap-2">
                  {content.primaryCTA.text}
                  <ArrowLeft className="w-5 h-5" />
                </span>
              </ShimmerButton>
            </Link>

            {content.secondaryCTA && (
              <a
                href={content.secondaryCTA.href}
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium hover:bg-white/20 transition-all border border-white/20 min-h-[44px]"
              >
                <span>{content.secondaryCTA.text}</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
            )}
          </motion.div>

          {/* Stats */}
          {content.stats && content.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 sm:gap-12"
            >
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
});

LandingHero.displayName = 'LandingHero';

export default LandingHero;
