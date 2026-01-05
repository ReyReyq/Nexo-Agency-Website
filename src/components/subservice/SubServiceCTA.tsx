import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Magnet from "@/components/Magnet";
import { cn } from "@/lib/utils";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const VIEWPORT_ONCE = { once: true };

export interface SubServiceCTAProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceCTA = memo(({ subService, parentService }: SubServiceCTAProps) => {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(var(--background)) 0%, ${parentService.bgColor} 50%, hsl(var(--background)) 100%)`,
      }}
      dir="rtl"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: parentService.accentColor }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: parentService.accentColor }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={INITIAL_FADE_UP_40}
          whileInView={ANIMATE_VISIBLE}
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl mx-auto text-center"
        >
          <Sparkles
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-6"
            style={{ color: parentService.accentColor }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            {subService.ctaTitle}
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            {subService.ctaDescription}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* Primary CTA */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className={cn(
                  "group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden",
                  `bg-gradient-to-r ${parentService.gradient}`
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  צרו קשר עכשיו
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            {/* Secondary CTA */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to={`/services/${parentService.slug}`}
                className="group relative inline-flex items-center gap-2 bg-muted text-foreground px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all border border-border overflow-hidden"
              >
                <span className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  חזרה ל{parentService.name}
                </span>
              </Link>
            </Magnet>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

SubServiceCTA.displayName = 'SubServiceCTA';

export default SubServiceCTA;
