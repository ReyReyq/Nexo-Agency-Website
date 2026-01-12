import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Phone, Check } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Magnet from "@/components/Magnet";
import type { LandingCTAContent } from "@/types/landingPage";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

export interface LandingCTAProps {
  content: LandingCTAContent;
  accentColor: string;
  gradient: string;
}

const LandingCTA = memo(({ content, accentColor, gradient }: LandingCTAProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}
      dir="rtl"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-30 bg-white" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[120px] opacity-20 bg-white" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.h2
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
          >
            {content.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>

          {/* Features list */}
          {content.features && content.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={INITIAL_FADE_UP}
            animate={isInView ? ANIMATE_VISIBLE : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Magnet magnetStrength={3} padding={60}>
              <Link to={content.primaryCTA.href}>
                <ShimmerButton
                  className="text-base sm:text-lg font-bold px-8 py-4"
                  shimmerColor="rgba(255,255,255,0.4)"
                  background="white"
                >
                  <span
                    className="flex items-center gap-2"
                    style={{ color: accentColor }}
                  >
                    {content.primaryCTA.text}
                    <ArrowLeft className="w-5 h-5" />
                  </span>
                </ShimmerButton>
              </Link>
            </Magnet>

            {content.secondaryCTA && (
              <Magnet magnetStrength={3} padding={60}>
                <a
                  href={content.secondaryCTA.href}
                  className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium hover:bg-white/20 transition-all border border-white/30 min-h-[44px]"
                >
                  <Phone className="w-5 h-5" />
                  <span>{content.secondaryCTA.text}</span>
                </a>
              </Magnet>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

LandingCTA.displayName = 'LandingCTA';

export default LandingCTA;
