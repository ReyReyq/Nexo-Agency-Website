import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { Monitor, Palette, Brain, ArrowLeft, Zap, TrendingUp, Clock } from "lucide-react";

// Service cards with optimized local images
const services = [
  {
    icon: Monitor,
    title: "אתרים שמוכרים בשינה",
    subtitle: "בניית אתרים וחנויות",
    description: "לא סתם אתרים יפים. אתרים שעובדים 24/7 ומביאים לקוחות חדשים כל יום. אנחנו בונים מכונות מכירה דיגיטליות.",
    image: "/images/services/web-development.webp",
    stats: { value: "340%", label: "ROI ממוצע" },
  },
  {
    icon: Palette,
    title: "מיתוג שגורם לזכור אותך",
    subtitle: "מיתוג וזהות ויזואלית",
    description: "לא סתם לוגו. שפה ויזואלית שלמה שמשדרת יוקרה, בידול ומקצועיות. המותג שלך ייחרט בזיכרון.",
    image: "/images/services/branding-design.webp",
    stats: { value: "500+", label: "מותגים שעיצבנו" },
  },
  {
    icon: Brain,
    title: "AI שחוסך לך 20 שעות בשבוע",
    subtitle: "פתרונות AI לעסקים",
    description: "אוטומציות ובינה מלאכותית שעובדות בשבילך. צ'אטבוטים, אוטומציות, ומערכות חכמות שמייעלות את העסק.",
    image: "/images/services/ai-automation.webp",
    stats: { value: "20h", label: "חיסכון שבועי" },
  },
];

const features = [
  { icon: Zap, text: "משלוח מהיר" },
  { icon: TrendingUp, text: "תוצאות מוכחות" },
  { icon: Clock, text: "תמיכה 24/7" },
];

const ServiceCard = React.memo(({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: 10 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative">
        <motion.img
          src={service.image}
          alt={service.title}
          loading="lazy"
          decoding="async"
          width={600}
          height={750}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <motion.div 
          animate={{ opacity: isHovered ? 0.9 : 0.7 }}
          className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/50 to-transparent" 
        />

        {/* Glow Effect on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6 md:p-8">
        {/* Stats Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-4"
        >
          <span className="text-primary font-bold">{service.stats.value}</span>
          <span className="text-hero-fg/80 text-sm">{service.stats.label}</span>
        </motion.div>

        {/* Icon */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4"
        >
          <service.icon className="w-6 h-6 text-primary" />
        </motion.div>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-sm font-medium mb-1">{service.subtitle}</p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-hero-fg mb-3">
              {service.title}
            </h3>
            <motion.p 
              animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 10 }}
              className="text-hero-fg/70 text-sm md:text-base max-w-xs leading-relaxed"
            >
              {service.description}
            </motion.p>
          </div>
          
          <motion.div
            animate={{ 
              x: isHovered ? 0 : 20, 
              opacity: isHovered ? 1 : 0,
              rotate: isHovered ? 0 : 45,
            }}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </motion.div>
        </div>
      </div>

      {/* Border Glow */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 rounded-2xl border-2 border-primary/50 pointer-events-none"
      />
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 md:py-40 bg-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px" 
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6 }}
              className="h-1 w-[60px] bg-primary mb-6 origin-left"
            />
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1]">
              לא סתם שירותים.
              <br />
              <span className="text-gradient">פתרונות שעובדים.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-end"
          >
            <p className="text-muted-foreground text-lg mb-6">
              אנחנו לא מוכרים שעות עבודה. אנחנו מוכרים תוצאות. כל פרויקט נבנה עם מטרה אחת - להביא לך יותר לקוחות ויותר הכנסות.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
