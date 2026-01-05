import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_DURATION_06 = { duration: 0.6 };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

export interface SubServiceWhyChooseUsProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceWhyChooseUs = memo(({ subService, parentService }: SubServiceWhyChooseUsProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-neutral-50 to-white"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6">
            <Award className="w-4 h-4" style={{ color: parentService.accentColor }} />
            <span className="text-sm font-medium text-neutral-700">למה לבחור בנו</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
            {subService.whyChooseUs.title}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            {subService.whyChooseUs.description}
          </p>
        </motion.div>

        {/* Benefits Cards - Modern Numbered Design */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {subService.whyChooseUs.benefits.map((benefit, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="group relative"
              >
                {/* Card with soft shadow */}
                <div className="relative h-full p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${parentService.accentColor} 0%, transparent 70%)`
                    }}
                  />

                  {/* Number badge */}
                  <div className="relative mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
                      style={{
                        backgroundColor: parentService.accentColor,
                        boxShadow: `0 4px 14px -2px ${parentService.accentColor}40`
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative text-xl font-bold text-neutral-900 mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-neutral-600 leading-relaxed text-sm md:text-base">
                    {benefit.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0"
                    style={{ backgroundColor: parentService.accentColor }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

SubServiceWhyChooseUs.displayName = 'SubServiceWhyChooseUs';

export default SubServiceWhyChooseUs;
