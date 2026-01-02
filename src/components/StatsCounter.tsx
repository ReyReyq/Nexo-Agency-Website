import { motion, useInView, useAnimationControls } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { number: 500, suffix: "+", label: "פרויקטים מוצלחים", description: "אתרים, אפליקציות ומותגים" },
  { number: 98, suffix: "%", label: "לקוחות מרוצים", description: "שחוזרים אלינו שוב ושוב" },
  { number: 24, suffix: "h", label: "זמן תגובה", description: "תמיד זמינים בשבילכם" },
  { number: 340, suffix: "%", label: "ROI ממוצע", description: "תשואה על ההשקעה" },
];

const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef(null);
  const rafIdRef = useRef<number | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 2000;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(easeOutQuart * value));

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
};

const StatsCounter = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isAnimationInView = useInView(sectionRef, { once: false, margin: "100px" });

  // Animation controls for gradient orbs with proper cleanup
  const orbControls1 = useAnimationControls();
  const orbControls2 = useAnimationControls();

  // Manage orb animations with proper cleanup when out of view or unmounting
  useEffect(() => {
    if (isAnimationInView) {
      orbControls1.start({
        x: [0, 50, 0],
        y: [0, 30, 0],
        transition: { duration: 10, repeat: Infinity, ease: "linear" },
      });
      orbControls2.start({
        x: [0, -30, 0],
        y: [0, 50, 0],
        transition: { duration: 15, repeat: Infinity, ease: "linear" },
      });
    } else {
      orbControls1.stop();
      orbControls2.stop();
    }

    // Cleanup: stop animations when component unmounts
    return () => {
      orbControls1.stop();
      orbControls2.stop();
    };
  }, [isAnimationInView, orbControls1, orbControls2]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-hero-bg via-hero-bg to-primary/20" />
      
      {/* Animated Gradient Orbs - controlled animations with cleanup */}
      <motion.div
        animate={orbControls1}
        className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={orbControls2}
        className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-hero-fg leading-tight mb-6">
            המספרים
            <br />
            <span className="text-gradient">מדברים בעד עצמם</span>
          </h2>
          <p className="text-hero-fg/60 text-lg max-w-xl mx-auto">
            לא סתם מילים - תוצאות אמיתיות שמוכיחות את הערך שלנו
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              <div className="glass-dark rounded-2xl p-6 md:p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                {/* Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg mb-2">
                    <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-hero-fg mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-hero-fg/50">
                    {stat.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
