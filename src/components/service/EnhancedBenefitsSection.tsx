"use client";

import { memo, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Service } from "@/data/services";
import {
  // Web Development
  Zap,
  Shield,
  Search,
  Smartphone,
  HeartHandshake,
  TrendingUp,
  // E-commerce
  CreditCard,
  Package,
  Truck,
  BarChart3,
  RefreshCcw,
  Star,
  // Branding
  Palette,
  Award,
  Target,
  Layers,
  Sparkles,
  Eye,
  // AI Automation
  Brain,
  Bot,
  Clock,
  Workflow,
  MessageSquare,
  Cpu,
  // Digital Marketing
  Megaphone,
  Users,
  MousePointerClick,
  LineChart,
  Mail,
  Share2,
  // SEO
  Globe,
  Link2,
  FileText,
  Gauge,
  TrendingDown,
  CheckCircle2,
  // Social Media
  Instagram,
  Heart,
  MessageCircle,
  Calendar,
  Repeat,
  // AI Images
  ImageIcon,
  Wand2,
  Film,
  PenTool,
  Aperture,
  Brush,
  // Strategy
  Compass,
  Map,
  Lightbulb,
  PieChart,
  Focus,
  Milestone,
  // App Development
  AppWindow,
  Download,
  Bell,
  Fingerprint,
  CloudCog,
  TabletSmartphone,
  // Custom Development
  Code,
  Database,
  Settings,
  Puzzle,
  Lock,
  Server,
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface EnhancedBenefitsSectionProps {
  service: Service;
  className?: string;
}

// ============================================
// BENEFITS DATA
// ============================================

const serviceBenefits: Record<string, Benefit[]> = {
  "web-development": [
    {
      icon: Zap,
      title: "מהירות טעינה",
      description: "אתרים מהירים במיוחד שמקבלים ציון מושלם בגוגל",
    },
    {
      icon: Shield,
      title: "אבטחה מתקדמת",
      description: "SSL, הגנה מפני התקפות ואחסון מאובטח",
    },
    {
      icon: Search,
      title: "SEO מובנה",
      description: "אופטימיזציה למנועי חיפוש מהיום הראשון",
    },
    {
      icon: Smartphone,
      title: "רספונסיבי מושלם",
      description: "נראה מצוין בכל מכשיר ובכל גודל מסך",
    },
    {
      icon: HeartHandshake,
      title: "ליווי מתמשך",
      description: "תמיכה ועדכונים גם אחרי ההשקה",
    },
    {
      icon: TrendingUp,
      title: "ממוקד המרות",
      description: "כל אתר בנוי להפוך מבקרים ללקוחות",
    },
  ],
  ecommerce: [
    {
      icon: CreditCard,
      title: "תשלומים מאובטחים",
      description: "כל ספקי התשלום המובילים",
    },
    {
      icon: Package,
      title: "ניהול מלאי",
      description: "מערכת מלאי אוטומטית וחכמה",
    },
    {
      icon: Truck,
      title: "אינטגרציות משלוחים",
      description: "חיבור לכל חברות השילוח",
    },
    {
      icon: BarChart3,
      title: "אנליטיקס מתקדם",
      description: "דאשבורד עם כל הנתונים החשובים",
    },
    {
      icon: RefreshCcw,
      title: "עגלות נטושות",
      description: "מערכת החזרת לקוחות אוטומטית",
    },
    {
      icon: Star,
      title: "ביקורות ודירוגים",
      description: "מערכת ביקורות מובנית",
    },
  ],
  branding: [
    {
      icon: Palette,
      title: "זהות ויזואלית ייחודית",
      description: "עיצוב שמבדיל אתכם מהמתחרים",
    },
    {
      icon: Award,
      title: "מיתוג מקצועי",
      description: "ספר מותג מלא עם כל ההנחיות",
    },
    {
      icon: Target,
      title: "מיצוב אסטרטגי",
      description: "הגדרת מיקום המותג בשוק",
    },
    {
      icon: Layers,
      title: "עקביות בכל המדיומים",
      description: "שפה אחידה בכל נקודות המגע",
    },
    {
      icon: Sparkles,
      title: "עיצוב שנשאר בזיכרון",
      description: "לוגו וגרפיקה שאי אפשר לשכוח",
    },
    {
      icon: Eye,
      title: "נראות מקצועית",
      description: "מראה שמשדר אמינות ואיכות",
    },
  ],
  "ai-automation": [
    {
      icon: Bot,
      title: "צ'אטבוטים חכמים",
      description: "שירות לקוחות אוטומטי 24/7",
    },
    {
      icon: Clock,
      title: "חיסכון בזמן",
      description: "אוטומציה של משימות חוזרות",
    },
    {
      icon: Workflow,
      title: "תהליכים אוטומטיים",
      description: "אינטגרציות עם Make ו-Zapier",
    },
    {
      icon: Brain,
      title: "בינה מלאכותית מתקדמת",
      description: "GPT ומודלים מובילים",
    },
    {
      icon: MessageSquare,
      title: "תקשורת חכמה",
      description: "מענה אוטומטי ללקוחות",
    },
    {
      icon: Cpu,
      title: "עיבוד נתונים",
      description: "ניתוח ותובנות אוטומטיות",
    },
  ],
  "digital-marketing": [
    {
      icon: Megaphone,
      title: "קמפיינים ממוקדים",
      description: "הגעה לקהל היעד המדויק",
    },
    {
      icon: Users,
      title: "הרחבת קהלים",
      description: "גידול בחשיפה ומודעות למותג",
    },
    {
      icon: MousePointerClick,
      title: "אופטימיזציית המרות",
      description: "שיפור מתמיד של ביצועים",
    },
    {
      icon: LineChart,
      title: "דוחות מפורטים",
      description: "מעקב אחרי כל שקל שהושקע",
    },
    {
      icon: Mail,
      title: "שיווק במייל",
      description: "קמפיינים אוטומטיים ואפקטיביים",
    },
    {
      icon: Share2,
      title: "רב-ערוצי",
      description: "נוכחות בכל הפלטפורמות הרלוונטיות",
    },
  ],
  seo: [
    {
      icon: Globe,
      title: "דירוג גבוה בגוגל",
      description: "עלייה למיקומים הראשונים",
    },
    {
      icon: Link2,
      title: "בניית קישורים",
      description: "פרופיל קישורים חזק ואיכותי",
    },
    {
      icon: FileText,
      title: "תוכן ממוקד SEO",
      description: "תוכן שגוגל אוהב",
    },
    {
      icon: Gauge,
      title: "אופטימיזציה טכנית",
      description: "שיפור ביצועים ומהירות",
    },
    {
      icon: TrendingDown,
      title: "הורדת עלות לליד",
      description: "תנועה אורגנית חינמית",
    },
    {
      icon: CheckCircle2,
      title: "תוצאות מדידות",
      description: "דוחות חודשיים מפורטים",
    },
  ],
  "social-media": [
    {
      icon: Instagram,
      title: "נוכחות חזקה",
      description: "פרופילים מקצועיים בכל הרשתות",
    },
    {
      icon: Heart,
      title: "מעורבות גבוהה",
      description: "קהילה פעילה ומגיבה",
    },
    {
      icon: MessageCircle,
      title: "ניהול קהילה",
      description: "תגובות ואינטראקציה שוטפת",
    },
    {
      icon: Calendar,
      title: "תכנון תוכן",
      description: "לוח שנה מסודר ועקבי",
    },
    {
      icon: Repeat,
      title: "צמיחה אורגנית",
      description: "גידול עוקבים איכותיים",
    },
    {
      icon: TrendingUp,
      title: "חשיפה מקסימלית",
      description: "אלגוריתמים שעובדים בשבילכם",
    },
  ],
  "ai-images": [
    {
      icon: ImageIcon,
      title: "תמונות ייחודיות",
      description: "גרפיקה שלא קיימת בשום מקום אחר",
    },
    {
      icon: Wand2,
      title: "יצירה מהירה",
      description: "עשרות תמונות בדקות",
    },
    {
      icon: Film,
      title: "וידאו AI",
      description: "אנימציות וסרטונים חכמים",
    },
    {
      icon: PenTool,
      title: "התאמה אישית",
      description: "עריכה ושכלול לפי הצורך",
    },
    {
      icon: Aperture,
      title: "איכות גבוהה",
      description: "רזולוציה מושלמת לכל שימוש",
    },
    {
      icon: Brush,
      title: "סגנונות מגוונים",
      description: "מפוטוריאליסטי ועד אילוסטרציה",
    },
  ],
  strategy: [
    {
      icon: Compass,
      title: "כיוון ברור",
      description: "מפת דרכים דיגיטלית מפורטת",
    },
    {
      icon: Map,
      title: "תוכנית מקיפה",
      description: "אסטרטגיה לטווח קצר וארוך",
    },
    {
      icon: Lightbulb,
      title: "תובנות עסקיות",
      description: "ניתוח שוק ומתחרים מעמיק",
    },
    {
      icon: PieChart,
      title: "חלוקת תקציב חכמה",
      description: "השקעה נכונה בכל ערוץ",
    },
    {
      icon: Focus,
      title: "מיקוד במטרות",
      description: "KPIs ברורים ומדידים",
    },
    {
      icon: Milestone,
      title: "יעדים מדורגים",
      description: "אבני דרך להצלחה",
    },
  ],
  "app-development": [
    {
      icon: AppWindow,
      title: "חווית משתמש מעולה",
      description: "UI/UX שנבנה לנייד",
    },
    {
      icon: Download,
      title: "בחנויות האפליקציות",
      description: "App Store ו-Google Play",
    },
    {
      icon: Bell,
      title: "התראות Push",
      description: "תקשורת ישירה עם המשתמשים",
    },
    {
      icon: Fingerprint,
      title: "אבטחה מתקדמת",
      description: "הזדהות ביומטרית והצפנה",
    },
    {
      icon: CloudCog,
      title: "סנכרון בענן",
      description: "נתונים זמינים בכל מקום",
    },
    {
      icon: TabletSmartphone,
      title: "Cross-Platform",
      description: "iOS ואנדרואיד מבסיס קוד אחד",
    },
  ],
  "custom-development": [
    {
      icon: Code,
      title: "פיתוח מותאם",
      description: "פתרון שנבנה בדיוק לצרכים שלכם",
    },
    {
      icon: Database,
      title: "מערכות מידע",
      description: "CRM, ERP ומערכות ניהול",
    },
    {
      icon: Settings,
      title: "אינטגרציות",
      description: "חיבור לכל מערכת קיימת",
    },
    {
      icon: Puzzle,
      title: "APIs מתקדמים",
      description: "ממשקים לשילוב עם צד שלישי",
    },
    {
      icon: Lock,
      title: "אבטחת מידע",
      description: "תקני אבטחה מחמירים",
    },
    {
      icon: Server,
      title: "תשתית סקיילבילית",
      description: "צמיחה ללא מגבלות",
    },
  ],
};

// Default benefits for services not in the list
const defaultBenefits: Benefit[] = [
  {
    icon: Award,
    title: "מקצועיות",
    description: "צוות מומחים עם ניסיון רב שנים",
  },
  {
    icon: HeartHandshake,
    title: "ליווי אישי",
    description: "תמיכה צמודה לאורך כל הדרך",
  },
  {
    icon: TrendingUp,
    title: "תוצאות מוכחות",
    description: "מאות לקוחות מרוצים",
  },
  {
    icon: Zap,
    title: "יעילות",
    description: "עמידה בלוחות זמנים",
  },
  {
    icon: Shield,
    title: "אמינות",
    description: "שקיפות מלאה בכל שלב",
  },
  {
    icon: Sparkles,
    title: "חדשנות",
    description: "טכנולוגיות וגישות עדכניות",
  },
];

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ============================================
// BENEFIT CARD COMPONENT
// ============================================

interface BenefitCardProps {
  benefit: Benefit;
  accentColor: string;
  index: number;
}

const BenefitCard = memo(({ benefit, accentColor, index }: BenefitCardProps) => {
  const Icon = benefit.icon;

  const cardStyle = useMemo(
    () => ({
      "--accent-color": accentColor,
      "--accent-color-10": `${accentColor}1A`,
      "--accent-color-20": `${accentColor}33`,
    }),
    [accentColor]
  );

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      style={cardStyle as React.CSSProperties}
    >
      {/* Card Background with Gradient */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                   backdrop-blur-sm border border-white/10 p-6 h-full
                   transition-all duration-300 ease-out
                   hover:border-[var(--accent-color)]/30 hover:shadow-lg hover:shadow-[var(--accent-color)]/10
                   hover:translate-y-[-2px]"
      >
        {/* Subtle gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent pointer-events-none"
        />

        {/* Icon Container */}
        <div
          className="relative w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                      bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-color)]/5
                      group-hover:from-[var(--accent-color)]/30 group-hover:to-[var(--accent-color)]/10
                      transition-all duration-300"
        >
          {/* Icon glow effect */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-[var(--accent-color)]/20 blur-md"
          />
          <Icon
            className="relative w-7 h-7 transition-transform duration-300 group-hover:scale-110"
            style={{ color: accentColor }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-[var(--accent-color)]">
            {benefit.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {benefit.description}
          </p>
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-br from-[var(--accent-color)]/10 to-transparent rounded-br-full pointer-events-none"
        />
      </div>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";

// ============================================
// MAIN COMPONENT
// ============================================

const EnhancedBenefitsSection = memo(
  ({ service, className = "" }: EnhancedBenefitsSectionProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Get benefits for this service or use defaults
    const benefits = useMemo(() => {
      return serviceBenefits[service.id] || defaultBenefits;
    }, [service.id]);

    // Memoized styles
    const accentColorStyle = useMemo(
      () => ({
        "--service-accent": service.accentColor,
      }),
      [service.accentColor]
    );

    return (
      <section
        ref={sectionRef}
        dir="rtl"
        className={`relative py-20 md:py-28 overflow-hidden ${className}`}
        style={accentColorStyle as React.CSSProperties}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-hero-bg" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                             linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${service.accentColor}40, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${service.accentColor}30, transparent 70%)` }}
        />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={headerVariants} className="mb-4">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                           bg-white/5 border border-white/10 text-white/70"
              >
                <Award className="w-4 h-4" style={{ color: service.accentColor }} />
                למה לבחור בנו
              </span>
            </motion.div>

            <motion.h2
              variants={headerVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
            >
              היתרונות שלנו
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l"
                    style={{ backgroundImage: `linear-gradient(to left, ${service.accentColor}, ${service.accentColor}99)` }}>
                ב{service.name}
              </span>
            </motion.h2>

            <motion.p
              variants={headerVariants}
              className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              אנחנו לא מספקים שירות סטנדרטי. כל פרויקט מקבל את מלוא תשומת הלב,
              המומחיות והמסירות שמבטיחים תוצאות יוצאות מהכלל.
            </motion.p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={`${service.id}-benefit-${index}`}
                benefit={benefit}
                accentColor={service.accentColor}
                index={index}
              />
            ))}
          </motion.div>

          {/* Why Choose Us Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 text-center"
          >
            <div
              className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 rounded-2xl
                         bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10
                         backdrop-blur-sm"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center
                           bg-gradient-to-br from-white/10 to-white/5"
                style={{ background: `linear-gradient(135deg, ${service.accentColor}30, ${service.accentColor}10)` }}
              >
                <HeartHandshake className="w-6 h-6" style={{ color: service.accentColor }} />
              </div>
              <div className="text-center sm:text-right">
                <p className="text-white font-semibold text-lg">
                  מעל 500 לקוחות בחרו בנו
                </p>
                <p className="text-white/50 text-sm">
                  הצטרפו למאות העסקים שכבר נהנים משירות מקצועי ותוצאות מוכחות
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
);

EnhancedBenefitsSection.displayName = "EnhancedBenefitsSection";

export default EnhancedBenefitsSection;
