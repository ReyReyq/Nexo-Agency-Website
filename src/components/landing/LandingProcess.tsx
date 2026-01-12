import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getIcon } from "@/data/iconMap";
import type { LandingProcessContent } from "@/types/landingPage";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

export interface LandingProcessProps {
  content: LandingProcessContent;
  accentColor: string;
}

const LandingProcess = memo(({ content, accentColor }: LandingProcessProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-nexo-charcoal relative overflow-hidden"
      dir="rtl"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative blur */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP}
          animate={isInView ? ANIMATE_VISIBLE : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            {content.title}
          </h2>

          {content.subtitle && (
            <p className="text-white/60 text-lg sm:text-xl">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          {content.steps.map((step, index) => {
            const Icon = step.icon ? getIcon(step.icon) : null;
            const isLast = index === content.steps.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                className="relative"
              >
                <div className="flex gap-6 items-start pb-12">
                  {/* Step Number & Line */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white relative z-10 shadow-lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Connecting line */}
                    {!isLast && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={isInView ? { height: '100%' } : {}}
                        transition={{ delay: 0.5 + index * 0.15, duration: 0.4 }}
                        className="w-0.5 flex-1 mt-2"
                        style={{ backgroundColor: `${accentColor}40` }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      {Icon && (
                        <Icon
                          className="w-6 h-6"
                          style={{ color: accentColor }}
                        />
                      )}
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LandingProcess.displayName = 'LandingProcess';

export default LandingProcess;
