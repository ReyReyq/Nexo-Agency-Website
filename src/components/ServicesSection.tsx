import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Monitor, Palette, Brain, ArrowLeft } from "lucide-react";
import FanCarousel from "./FanCarousel";
import RibbonBackground from "./RibbonBackground";
import GooeyButton from "./GooeyButton";
import RippleButton from "./RippleButton";
import { Spotlight } from "./ui/spotlight";
import ClickSpark from "./ClickSpark";

const services = [
  {
    id: 1,
    icon: Monitor,
    title: "אתר שהופך גולשים ללקוחות",
    subtitle: "פיתוח אתרים",
    description: "לא עוד אתרים יפים שלא מביאים תוצאות. אנחנו בונים מכונות מכירה דיגיטליות.",
    color: "linear-gradient(145deg, #5a67d8 0%, #553c9a 100%)",
    primaryColor: "#5a67d8",
    link: "/services#digital",
  },
  {
    id: 2,
    icon: Palette,
    title: "מותג שזוכרים ובוחרים",
    subtitle: "מיתוג ועיצוב",
    description: "שפה ויזואלית שמבדילה אתכם מכל השאר ובונה אמון עוד לפני המילה הראשונה.",
    color: "linear-gradient(145deg, #c05621 0%, #9c4221 100%)",
    primaryColor: "#c05621",
    link: "/services#branding",
  },
  {
    id: 3,
    icon: Brain,
    title: "תנו למכונות לעבוד בשבילכם",
    subtitle: "בינה מלאכותית",
    description: "אוטומציות חכמות שחוסכות שעות עבודה ונותנות לכם לעסוק במה שחשוב באמת.",
    color: "linear-gradient(145deg, #2c5282 0%, #234e52 100%)",
    primaryColor: "#2c5282",
    link: "/services#ai",
  },
];

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <ClickSpark sparkColor="#FF1493" sparkSize={20} sparkRadius={40} sparkCount={10}>
      <section
        id="services"
        ref={sectionRef}
        className="min-h-screen py-20 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        {/* Spotlight Effect - Subtle pink accent on left side */}
      <Spotlight
        className="-top-40 left-0 md:left-80 md:-top-20 opacity-30"
        fill="#FF1493"
      />

      {/* Animated Ribbon Background */}
      <RibbonBackground />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Split layout - Cards on LEFT, Text on RIGHT - centered */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-8 items-center justify-center min-h-[70vh] max-w-5xl mx-auto" dir="ltr">

          {/* LEFT side - Fan Card Carousel */}
          <div className="w-full lg:w-[58%] flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <FanCarousel cards={services} />
            </motion.div>
          </div>

          {/* RIGHT side - Text content */}
          <div className="w-full lg:w-[42%] max-w-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-right"
            >
              {/* Main headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.15] mb-6 text-[#1a1a1a]"
              >
                אנחנו בונים לכם את המכונה
                <br />
                שתביא את הלקוחות הבאים
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-base md:text-lg leading-[1.8] mb-10 text-[#3d3d3d] max-w-[400px]"
              >
                לא עוד אתרים יפים שלא עובדים. אנחנו בונים מערכות שמייצרות תוצאות אמיתיות לעסק שלכם.
              </motion.p>

              {/* Dual CTA Buttons with Gooey Effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap items-center gap-4"
              >
                {/* SVG Filter for Gooey Effect */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                  <defs>
                    <filter id="gooey">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                      <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                        result="goo"
                      />
                      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                  </defs>
                </svg>

                {/* Primary CTA - Contact */}
                <GooeyButton to="/contact" variant="primary">
                  <span>צרו קשר</span>
                  <ArrowLeft className="w-4 h-4" />
                </GooeyButton>

                {/* Secondary CTA - View Services with Ripple Effect */}
                <RippleButton to="/services" variant="dark" size="md">
                  <span className="flex items-center gap-2">
                    <span>לכל השירותים</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </RippleButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      </section>
    </ClickSpark>
  );
};

export default ServicesSection;
