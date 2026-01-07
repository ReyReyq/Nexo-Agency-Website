import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getIcon } from "@/data/iconMap";
import { cn } from "@/lib/utils";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";
import { visionBoardPositions, getVisionItems, getCardColors } from "./visionBoardData";

// Re-export getVisionItems for backward compatibility
export { getVisionItems } from "./visionBoardData";

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_DURATION_06 = { duration: 0.6 };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

export interface SubServiceFeaturesProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceFeatures = memo(({ subService, parentService }: SubServiceFeaturesProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: 'var(--nexo-section)' }}
      dir="rtl"
    >
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(${parentService.accentColor}30 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative accent blurs */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full blur-[100px] opacity-20"
        style={{ backgroundColor: parentService.accentColor }}
      />
      <div
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-[120px] opacity-15"
        style={{ backgroundColor: parentService.accentColor }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Desktop Layout - Vision Board */}
        <div className="hidden lg:block relative" style={{ minHeight: '850px' }}>

          {/* Center Headline */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-md px-4"
            >
              <h2 className="text-5xl xl:text-6xl font-black text-gray-900 mb-4 leading-tight">
                {subService.features.title}
              </h2>
              <p className="text-gray-700 text-lg">
                {subService.features.description}
              </p>
            </motion.div>
          </div>

          {/* Scattered Vision Board Cards */}
          {getVisionItems(subService.slug).map((item, index) => {
            const FeatureIcon = getIcon(item.icon);
            const position = visionBoardPositions[index % visionBoardPositions.length];
            const colors = getCardColors(parentService.accentColor, index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: position.rotate + 10 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: position.rotate } : {}}
                whileHover={{
                  scale: 1.08,
                  rotate: 0,
                  zIndex: 30,
                  transition: { duration: 0.3 }
                }}
                transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-40 xl:w-48 cursor-pointer group"
                style={{
                  top: position.top,
                  bottom: position.bottom,
                  left: position.left,
                  right: position.right,
                }}
              >
                <div
                  className={cn(
                    "p-4 rounded-2xl shadow-lg transition-shadow duration-300 relative overflow-hidden",
                    "hover:shadow-2xl"
                  )}
                  style={{
                    backgroundColor: colors.bg,
                    border: colors.light ? `2px solid ${parentService.accentColor}25` : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110",
                    )}
                    style={{
                      backgroundColor: colors.light ? `${parentService.accentColor}15` : 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <FeatureIcon
                      className="w-5 h-5"
                      style={{ color: colors.light ? parentService.accentColor : 'white' }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm font-black mb-1 leading-tight"
                    style={{ color: colors.text }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: colors.light ? 'var(--nexo-ash)' : 'rgba(255,255,255,0.85)' }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tablet/Mobile Layout */}
        <div className="lg:hidden">
          {/* Headline */}
          <motion.div
            initial={INITIAL_FADE_UP_40}
            animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
            transition={TRANSITION_DURATION_06}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
              {subService.features.title}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base max-w-lg mx-auto">
              {subService.features.description}
            </p>
          </motion.div>

          {/* Cards Grid with rotations */}
          <div className="grid md:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
            {getVisionItems(subService.slug).map((item, index) => {
              const FeatureIcon = getIcon(item.icon);
              const colors = getCardColors(parentService.accentColor, index);
              const rotation = [-2, 1.5, -1.5, 2, -2.5, 2.5][index % 6];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, rotate: rotation * 2 }}
                  animate={isInView ? { opacity: 1, y: 0, rotate: rotation } : {}}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <div
                    className="p-4 rounded-xl shadow-md"
                    style={{
                      backgroundColor: colors.bg,
                      border: colors.light ? `2px solid ${parentService.accentColor}15` : 'none',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: colors.light ? `${parentService.accentColor}12` : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        <FeatureIcon
                          className="w-4 h-4"
                          style={{ color: colors.light ? parentService.accentColor : 'white' }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-sm font-bold mb-0.5"
                          style={{ color: colors.text }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: colors.light ? 'var(--nexo-ash)' : 'rgba(255,255,255,0.85)' }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

SubServiceFeatures.displayName = 'SubServiceFeatures';

export default SubServiceFeatures;
