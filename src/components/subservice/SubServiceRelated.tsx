import { memo, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Grid } from "lucide-react";
import { getSubServicesByParent } from "@/data/subServices";
import type { Service } from "@/data/services";
import BentoSpringCard, { bentoCardColors } from "./BentoSpringCard";

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_DURATION_06 = { duration: 0.6 };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

export interface SubServiceRelatedProps {
  currentSubServiceId: string;
  parentService: Service;
  parentSlug: string;
}

const SubServiceRelated = memo(({ currentSubServiceId, parentService, parentSlug }: SubServiceRelatedProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  // Get all sibling sub-services (excluding current one)
  const relatedServices = useMemo(() => {
    const allSiblings = getSubServicesByParent(parentSlug);
    return allSiblings
      .filter(s => s.id !== currentSubServiceId)
      .slice(0, 4) // Show max 4 related services
      .map((sub, index) => ({
        ...sub,
        colorClass: bentoCardColors[index % bentoCardColors.length],
        href: `/services/${parentSlug}/${sub.slug}`,
      }));
  }, [parentSlug, currentSubServiceId]);

  // Don't render if no related services
  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-neutral-100"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-6">
            <Grid className="w-4 h-4" style={{ color: parentService.accentColor }} />
            <span className="text-sm font-medium text-neutral-700">שירותים נוספים</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
            עוד ב{parentService.name}
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            גלו את כל השירותים שלנו בתחום {parentService.name}
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Desktop Layout - Bento Grid */}
          <div
            className="hidden md:grid gap-3 md:gap-4"
            style={{
              gridTemplateColumns: relatedServices.length >= 3 ? "1fr 1fr 1fr" : `repeat(${relatedServices.length}, 1fr)`,
              gridTemplateRows: relatedServices.length >= 3 ? "180px 180px" : "200px",
              gridTemplateAreas: relatedServices.length >= 3
                ? `"s1 s1 s2" "s3 s4 s2"`
                : undefined,
              height: relatedServices.length >= 3 ? "380px" : "200px",
            }}
          >
            {relatedServices.map((item, index) => (
              <div
                key={item.id}
                style={relatedServices.length >= 3 ? {
                  gridArea: index === 0 ? "s1" : index === 1 ? "s2" : index === 2 ? "s3" : "s4"
                } : undefined}
              >
                <BentoSpringCard
                  name={item.name}
                  description={item.subtitle}
                  colorClass={item.colorClass}
                  index={index}
                  href={item.href}
                />
              </div>
            ))}
          </div>

          {/* Mobile Layout - Stacked cards */}
          <div className="md:hidden flex flex-col gap-3">
            {relatedServices.map((item, index) => (
              <div key={item.id} className="h-[160px]">
                <BentoSpringCard
                  name={item.name}
                  description={item.subtitle}
                  colorClass={item.colorClass}
                  index={index}
                  href={item.href}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10 md:mt-14"
        >
          <Link
            to={`/services/${parentSlug}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            <span>כל השירותים ב{parentService.name}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

SubServiceRelated.displayName = 'SubServiceRelated';

export default SubServiceRelated;
