import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Monitor, Palette, Brain, Megaphone, BarChart3, Code, Sparkles, ArrowLeft, Check, Zap, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import Contact from "@/components/Contact";

// Service cards with optimized images: 800px for card display, WebP format
const services = [
  {
    id: "digital",
    icon: Monitor,
    title: "אתרים שמוכרים בשבילך",
    subtitle: "פיתוח אתרים ופלטפורמות",
    headline: "הנוכחות הדיגיטלית שלך",
    description: "לא סתם אתר יפה - פלטפורמה עסקית שממירה מבקרים ללקוחות. כל פיקסל מתוכנן להביא תוצאות.",
    features: [
      "אתרי תדמית מעוררי השראה",
      "חנויות אונליין עם המרות גבוהות",
      "אפליקציות ווב מתקדמות",
      "מהירות טעינה אולטרא-מהירה",
    ],
    stat: { value: "340%", label: "ROI ממוצע" },
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    bgColor: "rgba(139, 92, 246, 0.15)",
    accentColor: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fm=webp&fit=crop",
  },
  {
    id: "branding",
    icon: Palette,
    title: "מיתוג שנשאר בזיכרון",
    subtitle: "מיתוג ועיצוב",
    headline: "הזהות שלך בעולם",
    description: "מותג חזק זה לא רק לוגו - זו שפה שלמה שמספרת את הסיפור שלך ובונה אמון מהרגע הראשון.",
    features: [
      "אסטרטגיית מותג מנצחת",
      "לוגו וזהות ויזואלית ייחודית",
      "שפה עיצובית שלמה",
      "מדריכי מותג מקצועיים",
    ],
    stat: { value: "500+", label: "מותגים שעיצבנו" },
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgColor: "rgba(236, 72, 153, 0.15)",
    accentColor: "#ec4899",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80&fm=webp&fit=crop",
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI שחוסך לך זמן וכסף",
    subtitle: "בינה מלאכותית ואוטומציה",
    headline: "העתיד כבר כאן",
    description: "פתרונות AI חכמים שעובדים 24/7. אוטומציות שחוסכות שעות עבודה ומייצרות תובנות שאי אפשר להשיג אחרת.",
    features: [
      "צ'אטבוטים חכמים שמוכרים",
      "אוטומציות עסקיות מתקדמות",
      "ניתוח נתונים ותובנות AI",
      "אינטגרציות GPT מותאמות",
    ],
    stat: { value: "20h", label: "חיסכון שבועי" },
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgColor: "rgba(6, 182, 212, 0.15)",
    accentColor: "#06b6d4",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&fm=webp&fit=crop",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "שיווק שמביא תוצאות",
    subtitle: "שיווק דיגיטלי",
    headline: "להגיע לקהל הנכון",
    description: "לא סתם קליקים - לקוחות אמיתיים. קמפיינים חכמים שמשלבים קריאטיב מדויק עם אופטימיזציה מתמדת.",
    features: [
      "קמפיינים ממומנים מדויקים",
      "ניהול רשתות חברתיות",
      "SEO שמביא תנועה איכותית",
      "אימייל מרקטינג ממיר",
    ],
    stat: { value: "2.5x", label: "שיפור בהמרות" },
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgColor: "rgba(249, 115, 22, 0.15)",
    accentColor: "#f97316",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80&fm=webp&fit=crop",
  },
  {
    id: "strategy",
    icon: BarChart3,
    title: "אסטרטגיה שמנחה הצלחה",
    subtitle: "אסטרטגיה דיגיטלית",
    headline: "התוכנית להצלחה",
    description: "לפני שבונים - מתכננים. אסטרטגיה דיגיטלית מקיפה שמנחה כל החלטה ומובילה לתוצאות מדידות.",
    features: [
      "מחקר שוק ומתחרים מעמיק",
      "מיפוי מסע לקוח מלא",
      "הגדרת KPIs ומטרות",
      "תוכנית פעולה מפורטת",
    ],
    stat: { value: "85%", label: "שיפור בביצועים" },
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bgColor: "rgba(16, 185, 129, 0.15)",
    accentColor: "#10b981",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fm=webp&fit=crop",
  },
  {
    id: "development",
    icon: Code,
    title: "פיתוח שמתאים בדיוק לך",
    subtitle: "פיתוח מותאם אישית",
    headline: "פתרונות ייחודיים",
    description: "כשפתרונות מדף לא מספיקים - בונים בדיוק מה שצריך. פיתוח מותאם לצרכים הייחודיים של העסק.",
    features: [
      "אפליקציות מותאמות אישית",
      "אינטגרציות בין מערכות",
      "APIs ושירותי Backend",
      "פתרונות SaaS ייחודיים",
    ],
    stat: { value: "100%", label: "התאמה לצרכים" },
    gradient: "from-slate-600 via-zinc-600 to-gray-600",
    bgColor: "rgba(113, 113, 122, 0.15)",
    accentColor: "#71717a",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&fm=webp&fit=crop",
  },
];

const process = [
  { step: "01", title: "גילוי", desc: "מבינים את העסק, המטרות והאתגרים" },
  { step: "02", title: "אסטרטגיה", desc: "מפתחים תוכנית פעולה מדויקת" },
  { step: "03", title: "עיצוב", desc: "יוצרים את החזון הויזואלי" },
  { step: "04", title: "פיתוח", desc: "בונים ומממשים" },
  { step: "05", title: "השקה", desc: "יוצאים לאוויר ומודדים" },
  { step: "06", title: "צמיחה", desc: "משפרים ומפתחים בהתמדה" },
];

// Service Card Component with improved glassmorphism design
const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500">

        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orb */}
          <motion.div
            className={`absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br ${service.gradient} opacity-20 blur-3xl`}
            animate={{
              scale: isHovered ? 1.3 : 1,
              opacity: isHovered ? 0.35 : 0.2,
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className={`absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-br ${service.gradient} opacity-10 blur-3xl`}
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.25 : 0.1,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={service.image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            width={800}
            height={500}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Stat Badge */}
          <motion.div
            className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
            style={{ backgroundColor: service.bgColor }}
            animate={{
              scale: isHovered ? 1.05 : 1,
              y: isHovered ? -2 : 0,
            }}
          >
            <span className="font-bold text-lg" style={{ color: service.accentColor }}>
              {service.stat.value}
            </span>
            <span className="text-foreground/70 text-sm mr-2">{service.stat.label}</span>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="relative p-6 md:p-8">
          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}
            animate={{
              rotate: isHovered ? 5 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          {/* Subtitle */}
          <span
            className="inline-block text-sm font-medium mb-2"
            style={{ color: service.accentColor }}
          >
            {service.subtitle}
          </span>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {service.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: service.bgColor }}
                >
                  <Check className="w-3 h-3" style={{ color: service.accentColor }} />
                </div>
                <span className="text-foreground/80 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}
          >
            בואו נדבר
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Hover border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${service.accentColor}`,
            opacity: 0,
          }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
        />
      </div>
    </motion.div>
  );
};

const Services = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlassNavbar />

      {/* Hero */}
      <section className="min-h-[70vh] flex items-center bg-hero-bg pt-20">
        <div className="container mx-auto px-6">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isHeroInView ? { width: 80 } : {}}
              transition={{ duration: 0.6 }}
              className="h-1 bg-primary mb-8"
            />
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.9] mb-8">
              מה אנחנו
              <br />
              <span className="text-gradient">עושים.</span>
            </h1>
            
            <p className="text-hero-fg/70 text-xl md:text-2xl leading-relaxed max-w-2xl">
              עיצוב, טכנולוגיה ובינה עסקית שנועדו למטרה אחת - להצמיח את העסק שלך.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -25, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              className="h-1 bg-primary mx-auto mb-6"
            />
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4">
              השירותים שלנו
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              פתרונות דיגיטליים שמביאים תוצאות אמיתיות. כל שירות בנוי עם מטרה אחת - להצמיח את העסק שלך.
            </p>
          </motion.div>

          {/* Services Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 bg-hero-bg">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-hero-fg mb-6">
              תהליך העבודה שלנו
            </h2>
            <p className="text-hero-fg/70 text-lg max-w-xl mx-auto">
              שש שלבים מוכחים שמבטיחים הצלחה בכל פרויקט
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-8 group hover:border-primary/50 transition-colors"
              >
                <span className="text-6xl font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-2xl font-bold text-hero-fg mt-4 mb-2">{item.title}</h3>
                <p className="text-hero-fg/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              מוכנים להתחיל?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              בואו נדבר על איך אנחנו יכולים לעזור לכם להגיע למטרות שלכם.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              צרו קשר
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Contact />
    </div>
  );
};

export default Services;
