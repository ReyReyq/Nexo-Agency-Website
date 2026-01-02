import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { BarChart3, Zap, MessageCircle, Rocket, ArrowLeft } from "lucide-react";
import AboutRibbonBackground from "./AboutRibbonBackground";
import RippleButton from "./RippleButton";
import VariableProximity from "./ui/VariableProximity";

// Values data defined outside component - stable reference prevents unnecessary re-renders
const values = [
  {
    icon: BarChart3,
    title: "תוצאות מדידות",
    desc: "אתרים שהופכים מבקרים ללקוחות משלמים",
  },
  {
    icon: Zap,
    title: "זמן חופשי",
    desc: "אוטומציות שעושות עבודה של 3 עובדים",
  },
  {
    icon: MessageCircle,
    title: "תמיד זמינים",
    desc: "תמיכה טכנית ללא המתנה, תיקונים תוך שעות",
  },
  {
    icon: Rocket,
    title: "גדלים איתכם",
    desc: "מערכות שמתרחבות בלי להתחיל מאפס",
  },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const line1ContainerRef = useRef<HTMLDivElement>(null);
  const line2ContainerRef = useRef<HTMLDivElement>(null);

  // Memoize useInView options to prevent unnecessary re-subscriptions
  const inViewOptions = useMemo(() => ({ once: true, margin: "-100px" as const }), []);
  const isInView = useInView(sectionRef, inViewOptions);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-visible h-full"
    >
      {/* Section with Cream Background - full height to fill sticky container */}
      <div
        className="h-screen pt-8 md:pt-12 pb-16 md:pb-24 relative flex items-center justify-center overflow-visible"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        {/* Ribbon Background - without top ribbons */}
        <AboutRibbonBackground />

        {/* Centered Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center"
            dir="rtl"
          >
            <div className="mb-6">
              <div
                ref={line1ContainerRef}
                style={{
                  position: 'relative',
                  fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                  lineHeight: 1.1,
                  color: '#1a1a1a'
                }}
              >
                <VariableProximity
                  label="בונים את הטכנולוגיה"
                  fromFontVariationSettings="'wght' 300, 'opsz' 9"
                  toFontVariationSettings="'wght' 900, 'opsz' 144"
                  containerRef={line1ContainerRef as React.MutableRefObject<HTMLElement | null>}
                  radius={120}
                  falloff="exponential"
                />
              </div>
              <div
                ref={line2ContainerRef}
                style={{
                  position: 'relative',
                  fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                  lineHeight: 1.1,
                  color: 'hsl(328, 100%, 54%)'
                }}
              >
                <VariableProximity
                  label="שמניעה צמיחה אמיתית."
                  fromFontVariationSettings="'wght' 300, 'opsz' 9"
                  toFontVariationSettings="'wght' 900, 'opsz' 144"
                  containerRef={line2ContainerRef as React.MutableRefObject<HTMLElement | null>}
                  radius={120}
                  falloff="exponential"
                />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#3d3d3d] text-lg leading-relaxed mb-10"
            >
              לא סתם אתרים יפים. מערכות חכמות שמייצרות לקוחות, חוסכות זמן ומגדילות רווחים - אוטומטית.
            </motion.p>

            {/* Values Grid - Centered with Enhanced Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-10 max-w-4xl mx-auto">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group text-center"
                  >
                    {/* Icon container with hover effect */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                      <IconComponent className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {/* Title */}
                    <span className="text-[#1a1a1a] font-bold text-sm md:text-base block mb-1.5">{value.title}</span>
                    {/* Description */}
                    <p className="text-[#666666] text-xs md:text-sm leading-relaxed">{value.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <RippleButton to="/about" variant="secondary" size="md">
                <span className="flex items-center gap-2">
                  הכירו אותנו
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </RippleButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
