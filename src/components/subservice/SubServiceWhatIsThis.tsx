import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";

// Animation constants
const INITIAL_FADE_UP_30 = { opacity: 0, y: 30 };
const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const INITIAL_FADE_LEFT_60 = { opacity: 0, x: -60 };
const INITIAL_FADE_RIGHT_60 = { opacity: 0, x: 60 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_VISIBLE_X = { opacity: 1, x: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_MAIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

export interface SubServiceWhatIsThisProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceWhatIsThis = memo(({ subService, parentService }: SubServiceWhatIsThisProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  return (
    <section
      id="what-is-this"
      ref={sectionRef}
      className="py-24 md:py-32 bg-background"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text Content - Right side in RTL */}
          <motion.div
            initial={INITIAL_FADE_RIGHT_60}
            animate={isInView ? ANIMATE_VISIBLE_X : ANIMATE_EMPTY}
            transition={TRANSITION_MAIN}
            className="order-1"
          >
            {/* Section label */}
            <motion.div
              initial={INITIAL_FADE_UP_20}
              animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 mb-6"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: parentService.accentColor }}
              />
              <span className="text-sm font-medium text-muted-foreground">הסבר</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={INITIAL_FADE_UP_30}
              animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6"
            >
              {subService.whatIsThis.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={INITIAL_FADE_UP_20}
              animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              {subService.whatIsThis.description}
            </motion.p>

            {/* Bullet Points */}
            <motion.ul
              initial={INITIAL_FADE_UP_20}
              animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              {subService.whatIsThis.points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${parentService.accentColor}20` }}
                  >
                    <Check className="w-4 h-4" style={{ color: parentService.accentColor }} />
                  </div>
                  <span className="text-foreground">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Image - Left side in RTL */}
          <motion.div
            initial={INITIAL_FADE_LEFT_60}
            animate={isInView ? ANIMATE_VISIBLE_X : ANIMATE_EMPTY}
            transition={{ delay: 0.3, ...TRANSITION_MAIN }}
            className="order-2"
          >
            <div className="relative">
              {/* Decorative background */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                style={{ backgroundColor: parentService.accentColor }}
              />
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={subService.whatIsThis.image}
                  alt={subService.whatIsThis.title}
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

SubServiceWhatIsThis.displayName = 'SubServiceWhatIsThis';

export default SubServiceWhatIsThis;
