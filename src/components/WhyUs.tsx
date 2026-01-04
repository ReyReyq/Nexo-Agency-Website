import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import Scene3D from "./Scene3D";
import { Check, Award, Users, Lightbulb } from "lucide-react";

const benefits = [
  { icon: Check, text: "אסטרטגיה מותאמת אישית" },
  { icon: Award, text: "20 שנות ניסיון" },
  { icon: Users, text: "צוות מומחים" },
  { icon: Lightbulb, text: "חדשנות מתמדת" },
];

const WhyUs = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false, // Prevent layout thrashing
  });

  const sceneY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Memoize inline style objects to prevent unnecessary re-renders
  const gridBackgroundStyle = useMemo(() => ({
    backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
    backgroundSize: "50px 50px"
  }), []);

  const visionBackgroundStyle = useMemo(() => ({
    backgroundImage: `url('/images/gallery/team-office-meeting.jpg')`,
  }), []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Split Section - Text on Dark, 3D on Light */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Dark with Text */}
        <div className="bg-hero-bg py-24 md:py-32 px-6 lg:px-12 flex flex-col justify-center order-2 lg:order-1 relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">מאז 2005</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg leading-[1.1] mb-6">
              20 שנה של
              <br />
              <span className="text-gradient">הובלה דיגיטלית</span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-hero-fg/70 text-lg leading-relaxed mb-8"
            >
              לא סתם עוד סוכנות. אנחנו חלוצים דיגיטליים שהובילו מהפכות, בנו מותגים אייקוניים, 
              ושינו את הנוף הישראלי של עיצוב וחוויית משתמש.
            </motion.p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-hero-fg/80 text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <a href="#contact" className="text-hero-fg font-medium link-underline">
                הצטרפו ל-500+ לקוחות מרוצים
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - 3D Element */}
        <motion.div
          style={{ y: sceneY }}
          className="bg-background py-24 lg:py-0 flex items-center justify-center order-1 lg:order-2 relative"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={gridBackgroundStyle} />
          </div>
          <Scene3D />
        </motion.div>
      </div>

      {/* Full Width Section - Vision */}
      {/* Background image optimized: WebP format for full-width hero */}
      <div className="relative min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-cover bg-center"
          style={visionBackgroundStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/40" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex items-center min-h-screen">
          <div className="max-w-3xl">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-1 bg-primary mb-8"
            />
            
            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-hero-fg leading-[1.1] mb-8"
            >
              אנחנו לא מסתפקים
              <br />
              ב"טוב מספיק".
              <br />
              <span className="text-gradient">אנחנו שואפים למצוינות.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-hero-fg/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl"
            >
              כל פיקסל, כל שורת קוד, כל החלטה עיצובית - נבחנת מול סטנדרטים הגבוהים ביותר. 
              זו לא רק עבודה בשבילנו. זה אומנות. זה מקצוענות. זה אנחנו.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <a href="#services" className="text-hero-fg font-medium link-underline">
                  צפה בעבודות שלנו
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <a href="#contact" className="text-hero-fg font-medium link-underline">
                  התחל פרויקט
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
