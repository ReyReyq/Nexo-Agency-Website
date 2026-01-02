import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Zap,
  Shield,
  Search,
  HeartHandshake,
  Rocket,
  Award,
  Clock,
  Settings,
  Smartphone,
  TrendingUp,
  CreditCard,
  Package,
  Truck,
  BarChart3,
  RefreshCcw,
  Star,
  Palette,
  Target,
  Layers,
  Sparkles,
  Eye,
  Bot,
  Workflow,
  Brain,
  MessageSquare,
  Cpu,
  Megaphone,
  Users,
  MousePointerClick,
  LineChart,
  Mail,
  Share2,
  Wrench,
  Globe,
  HardDrive,
  ShieldCheck,
  Headphones,
  Gift,
  Coins,
  ClipboardList,
  Bell,
  ShoppingCart,
  BookOpen,
  Printer,
  FileImage,
  Type,
  Frame,
  Link,
  FileBarChart,
  GraduationCap,
  Repeat,
  FlaskConical,
  UserPlus,
  Calendar,
  type LucideIcon
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Marquee } from "@/components/ui/marquee";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

interface FeaturedStat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  title: string;
  description: string;
}

interface BenefitCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceCopywriting {
  headline: string;
  phrases: string[];
}

interface ServiceData {
  featured: FeaturedStat;
  benefits: BenefitCard[];
  copywriting: ServiceCopywriting;
}

// ============================================
// SERVICE DATA - Combined differentiators + benefits
// ============================================

const serviceData: Record<string, ServiceData> = {
  "web-development": {
    featured: {
      icon: Zap,
      value: 97,
      suffix: "%",
      label: "ציון Google PageSpeed",
      title: "מהירות שמרגישים",
      description: "האתרים שלנו נטענים ברגע. מבקרים לא מחכים - הם פועלים.",
    },
    benefits: [
      { icon: Shield, title: "אבטחה מלאה", description: "SSL, גיבויים והגנה 24/7" },
      { icon: Rocket, title: "צומחים איתכם", description: "האתר מוכן להתרחב" },
      { icon: HeartHandshake, title: "איתכם לטווח ארוך", description: "תמיכה גם אחרי ההשקה" },
      { icon: Smartphone, title: "מושלם בכל מסך", description: "רספונסיבי לכל מכשיר" },
      { icon: TrendingUp, title: "ממוקד המרות", description: "הפכו מבקרים ללקוחות" },
      { icon: Award, title: "איכות ללא פשרות", description: "קוד נקי ומקצועי" },
      { icon: Wrench, title: "תחזוקה כלולה", description: "שנה ראשונה עלינו" },
      { icon: Search, title: "SEO מובנה", description: "מבנה שגוגל אוהב" },
      { icon: HardDrive, title: "גיבוי יומי", description: "שום דבר לא ילך לאיבוד" },
      { icon: Globe, title: "דומיין + אחסון", description: "שנה ראשונה עלינו" },
      { icon: ShieldCheck, title: "עדכונים שוטפים", description: "אבטחה תמיד מעודכנת" },
      { icon: Headphones, title: "מענה מהיר", description: "לא משאירים אתכם תקועים" },
      { icon: BarChart3, title: "אנליטיקס מובנה", description: "עוקבים אחרי הנתונים" },
      { icon: Users, title: "מנהל פרויקט צמוד", description: "כתובת אחת לכל שאלה" },
      { icon: MessageSquare, title: "וואטסאפ מובנה", description: "לקוחות פונים בקליק" },
      { icon: Mail, title: "מיילים עסקיים", description: "כתובת מקצועית" },
    ],
    copywriting: {
      headline: "אנחנו בונים אתרים מנצחים עבור",
      phrases: [
        "סטארטאפים בצמיחה",
        "עסקים שרוצים יותר לידים",
        "חברות שזקוקות לנוכחות דיגיטלית",
        "יזמים עם חזון",
        "מותגים שרוצים לבלוט",
      ],
    },
  },
  ecommerce: {
    featured: {
      icon: TrendingUp,
      value: 280,
      suffix: "%",
      label: "גידול במכירות בממוצע",
      title: "יותר מכירות, אותה תנועה",
      description: "לא צריך יותר תנועה - צריך שיותר מבקרים יקנו.",
    },
    benefits: [
      { icon: CreditCard, title: "תשלום מאובטח", description: "כל ספקי התשלום" },
      { icon: Package, title: "מלאי חכם", description: "סנכרון אוטומטי" },
      { icon: Truck, title: "משלוחים מחוברים", description: "כל חברות השילוח" },
      { icon: BarChart3, title: "נתונים בזמן אמת", description: "דאשבורד מקיף" },
      { icon: RefreshCcw, title: "החזרת עגלות", description: "מערכת אוטומטית" },
      { icon: Star, title: "ביקורות מובנות", description: "דירוגים שמוכרים" },
      { icon: Zap, title: "טעינה בזק", description: "מהירות שמוכרת" },
      { icon: Search, title: "SEO לחנויות", description: "מוצרים שמוצאים" },
      { icon: Gift, title: "קופונים והנחות", description: "מערכת מבצעים מלאה" },
      { icon: Coins, title: "ריבוי מטבעות", description: "מכרו לכל העולם" },
      { icon: ClipboardList, title: "דוחות מלאי", description: "תמיד יודעים מה יש" },
      { icon: Bell, title: "התראות מכירה", description: "יודעים על כל הזמנה" },
      { icon: ShoppingCart, title: "אפסיילינג חכם", description: "הגדילו את העגלה" },
    ],
    copywriting: {
      headline: "אנחנו בונים חנויות אונליין מצליחות עבור",
      phrases: [
        "מותגי אופנה וביוטי",
        "יבואנים ומשווקים",
        "עסקים שרוצים למכור אונליין",
        "יצרנים שמוכרים ישירות",
        "עסקים קמעונאיים",
      ],
    },
  },
  branding: {
    featured: {
      icon: Award,
      value: 500,
      suffix: "+",
      label: "מותגים שעיצבנו",
      title: "מותג שלא שוכחים",
      description: "זהות חזותית שנחרטת בזיכרון ובונה אמון.",
    },
    benefits: [
      { icon: Palette, title: "זהות ייחודית", description: "עיצוב שמבדיל" },
      { icon: Target, title: "מיצוב אסטרטגי", description: "מיקום ברור בשוק" },
      { icon: Layers, title: "עקביות מלאה", description: "שפה אחידה בכל מקום" },
      { icon: Sparkles, title: "עיצוב שנשאר", description: "לוגו בלתי נשכח" },
      { icon: Eye, title: "נראות מקצועית", description: "מראה שמשדר אמינות" },
      { icon: Settings, title: "קבצים מוכנים", description: "כל הפורמטים" },
      { icon: HeartHandshake, title: "יוצרים ביחד", description: "תהליך שיתופי" },
      { icon: Clock, title: "בזמן, תמיד", description: "עמידה בדדליינים" },
      { icon: BookOpen, title: "מדריך מותג", description: "כללים ברורים לשימוש" },
      { icon: Printer, title: "קבצים לדפוס", description: "מוכן להדפסה" },
      { icon: FileImage, title: "וריאציות לוגו", description: "גרסה לכל שימוש" },
      { icon: Type, title: "פונטים מורשים", description: "חוקי ומוכן" },
      { icon: Frame, title: "מוקאפים", description: "רואים איך זה נראה" },
    ],
    copywriting: {
      headline: "אנחנו מעצבים מותגים בלתי נשכחים עבור",
      phrases: [
        "סטארטאפים חדשים",
        "עסקים שעוברים ריברנדינג",
        "חברות שרוצות לבלוט",
        "יזמים שמשיקים מוצר",
        "מותגים שמחפשים זהות",
      ],
    },
  },
  "ai-automation": {
    featured: {
      icon: Clock,
      value: 40,
      suffix: "%",
      label: "חיסכון בזמן עבודה",
      title: "שעות עבודה חזרה",
      description: "משימות שלקחו שעות - עכשיו קורות לבד.",
    },
    benefits: [
      { icon: Bot, title: "צ'אטבוטים חכמים", description: "שירות 24/7" },
      { icon: Workflow, title: "תהליכים אוטומטיים", description: "Make ו-Zapier" },
      { icon: Brain, title: "AI מתקדם", description: "GPT ומודלים מובילים" },
      { icon: MessageSquare, title: "תקשורת חכמה", description: "מענה אוטומטי" },
      { icon: Cpu, title: "עיבוד נתונים", description: "תובנות אוטומטיות" },
      { icon: Shield, title: "מידע מוגן", description: "הצפנה מלאה" },
      { icon: Settings, title: "מותאם לכם", description: "פתרון ספציפי" },
      { icon: Rocket, title: "ROI מהיר", description: "החזר תוך חודשים" },
      { icon: Link, title: "אינטגרציות", description: "מתחבר לכלים שלכם" },
      { icon: FileBarChart, title: "דוחות ביצועים", description: "רואים את החיסכון" },
      { icon: GraduationCap, title: "הדרכה מלאה", description: "יודעים להשתמש" },
      { icon: Repeat, title: "התאמות בהמשך", description: "משתפרים עם הזמן" },
    ],
    copywriting: {
      headline: "אנחנו בונים אוטומציות חכמות עבור",
      phrases: [
        "עסקים שרוצים לחסוך זמן",
        "חברות שצומחות מהר",
        "צוותים שטובעים במשימות",
        "עסקים שמחפשים יעילות",
        "יזמים שרוצים לגדול",
      ],
    },
  },
  "digital-marketing": {
    featured: {
      icon: Rocket,
      value: 340,
      suffix: "%",
      label: "החזר על השקעה בממוצע",
      title: "כל שקל עובד קשה",
      description: "כל קמפיין מביא לידים אמיתיים שהופכים ללקוחות.",
    },
    benefits: [
      { icon: Megaphone, title: "קמפיינים ממוקדים", description: "הגעה לקהל הנכון" },
      { icon: Users, title: "הרחבת קהלים", description: "גידול בחשיפה" },
      { icon: MousePointerClick, title: "המרות גבוהות", description: "שיפור מתמיד" },
      { icon: LineChart, title: "דוחות מפורטים", description: "שקיפות מלאה" },
      { icon: Mail, title: "שיווק במייל", description: "קמפיינים אוטומטיים" },
      { icon: Share2, title: "רב-ערוצי", description: "נוכחות בכל מקום" },
      { icon: Search, title: "דאטה דריבן", description: "החלטות מבוססות" },
      { icon: HeartHandshake, title: "מנהל אישי", description: "מישהו שמכיר אתכם" },
      { icon: FlaskConical, title: "A/B טסטינג", description: "מה עובד יותר" },
      { icon: RefreshCcw, title: "רימרקטינג", description: "מחזירים מבקרים" },
      { icon: UserPlus, title: "קהלים דומים", description: "מוצאים עוד כמוהם" },
      { icon: Calendar, title: "דוחות שבועיים", description: "תמיד יודעים מה קורה" },
    ],
    copywriting: {
      headline: "אנחנו מנהלים קמפיינים מנצחים עבור",
      phrases: [
        "עסקים שרוצים יותר לידים",
        "חברות שמשיקות מוצר",
        "מותגים שרוצים חשיפה",
        "עסקים בצמיחה",
        "יזמים שרוצים תוצאות",
      ],
    },
  },
};

// Default data for services not in the list
const defaultServiceData: ServiceData = {
  featured: {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "לקוחות ממליצים עלינו",
    title: "לקוחות מרוצים - תמיד",
    description: "הסוד שלנו? פשוט לא עוצרים עד שאתם מרוצים.",
  },
  benefits: [
    { icon: Rocket, title: "תוצאות מוכחות", description: "המספרים מדברים" },
    { icon: Shield, title: "ניסיון רב", description: "מאות פרויקטים" },
    { icon: Settings, title: "התאמה מלאה", description: "פתרון מותאם" },
    { icon: HeartHandshake, title: "ליווי צמוד", description: "שותפים אמיתיים" },
    { icon: Clock, title: "עמידה בזמנים", description: "דדליין זה דדליין" },
    { icon: Sparkles, title: "חדשנות", description: "טכנולוגיות עדכניות" },
    { icon: Award, title: "איכות", description: "ללא פשרות" },
    { icon: TrendingUp, title: "צמיחה", description: "שותפים להצלחה" },
  ],
  copywriting: {
    headline: "אנחנו עובדים עם",
    phrases: [
      "סטארטאפים",
      "עסקים קטנים",
      "חברות בצמיחה",
      "יזמים",
      "מותגים",
    ],
  },
};

// ============================================
// DRAW CIRCLE SVG COMPONENT
// ============================================

interface DrawCircleProps {
  accentColor: string;
}

const DrawCircle = memo(({ accentColor }: DrawCircleProps) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: circleRef,
    offset: ["start end", "center center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={circleRef} className="absolute inset-0 pointer-events-none">
      <svg
        viewBox="0 0 286 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[155%]"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{
            pathLength,
          }}
        />
      </svg>
    </div>
  );
});

DrawCircle.displayName = "DrawCircle";

// ============================================
// ANIMATED TEXT COMPONENT (for "Who we work with")
// ============================================

interface AnimatedTextProps {
  phrases: string[];
  accentColor: string;
  interval?: number;
}

const AnimatedText = memo(({ phrases, accentColor, interval = 2500 }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateText = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
  }, [phrases.length]);

  useEffect(() => {
    const timer = setInterval(rotateText, interval);
    return () => clearInterval(timer);
  }, [rotateText, interval]);

  return (
    <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="inline-block font-bold"
          style={{ color: accentColor }}
        >
          {phrases[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

AnimatedText.displayName = "AnimatedText";

// ============================================
// FEATURED STAT CARD (for Marquee - larger, prominent)
// ============================================

interface FeaturedMarqueeCardProps {
  stat: FeaturedStat;
  accentColor: string;
  bgColor: string;
}

// Golden ratio: 1.618 - Card dimensions: 260px width x 160px height
const CARD_WIDTH = 260;
const CARD_HEIGHT = 160; // 260 / 1.618 ≈ 160

const FeaturedMarqueeCard = memo(({ stat, accentColor, bgColor }: FeaturedMarqueeCardProps) => {
  const Icon = stat.icon;

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-card p-4",
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
      )}
      style={{
        borderColor: accentColor,
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${bgColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>

        {/* Stat */}
        <div>
          <div className="flex items-baseline gap-0.5" dir="ltr">
            <span
              className="text-3xl font-black tracking-tight"
              style={{ color: accentColor }}
            >
              <NumberTicker value={stat.value} />
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: accentColor }}
            >
              {stat.suffix}
            </span>
          </div>
          <p className="text-[10px] font-medium text-foreground/70">{stat.label}</p>
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative mt-2">
        <h3 className="text-sm font-bold text-foreground mb-0.5">{stat.title}</h3>
        <p className="text-muted-foreground text-xs leading-snug line-clamp-2">{stat.description}</p>
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8 rounded-full opacity-30 blur-xl"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
});

FeaturedMarqueeCard.displayName = "FeaturedMarqueeCard";

// ============================================
// BENEFIT CARD COMPONENT (for Marquee)
// ============================================

interface BenefitCardProps {
  benefit: BenefitCard;
  accentColor: string;
  bgColor: string;
}

const BenefitCardComponent = memo(({ benefit, accentColor, bgColor }: BenefitCardProps) => {
  const Icon = benefit.icon;

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-card p-4",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
      }}
    >
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${bgColor} 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-sm font-bold text-foreground mb-0.5">{benefit.title}</h3>
        <p className="text-muted-foreground text-xs leading-snug line-clamp-2">{benefit.description}</p>
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 h-16 w-16 translate-x-8 translate-y-8 rounded-full opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
});

BenefitCardComponent.displayName = "BenefitCardComponent";

// ============================================
// MAIN COMPONENT
// ============================================

interface DifferentiatorsSectionProps {
  service: Service;
}

const DifferentiatorsSection = memo(({ service }: DifferentiatorsSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get data for this service
  const data = useMemo(
    () => serviceData[service.slug] || defaultServiceData,
    [service.slug]
  );

  // Split benefits for two rows
  const firstRow = data.benefits.slice(0, Math.ceil(data.benefits.length / 2));
  const secondRow = data.benefits.slice(Math.ceil(data.benefits.length / 2));

  return (
    <section
      ref={sectionRef}
      id="details"
      className="py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: service.bgColor,
              color: service.accentColor
            }}
          >
            למה דווקא אנחנו?
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            מה אתם{" "}
            <span className="relative inline-block" style={{ color: service.accentColor }}>
              מקבלים
              <DrawCircle accentColor={service.accentColor} />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            לא רק הבטחות - תוצאות אמיתיות שמשנות את העסק שלכם
          </p>
        </motion.div>

        {/* Benefits Marquee */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10" />

          {/* First row - scrolls right (includes featured stat card) */}
          <Marquee pauseOnHover className="[--duration:40s] mb-4">
            {/* Featured stat card as first item */}
            <FeaturedMarqueeCard
              stat={data.featured}
              accentColor={service.accentColor}
              bgColor={service.bgColor}
            />
            {firstRow.map((benefit, index) => (
              <BenefitCardComponent
                key={`first-${index}`}
                benefit={benefit}
                accentColor={service.accentColor}
                bgColor={service.bgColor}
              />
            ))}
          </Marquee>

          {/* Second row - scrolls left (reverse) */}
          <Marquee reverse pauseOnHover className="[--duration:35s]">
            {secondRow.map((benefit, index) => (
              <BenefitCardComponent
                key={`second-${index}`}
                benefit={benefit}
                accentColor={service.accentColor}
                bgColor={service.bgColor}
              />
            ))}
          </Marquee>
        </div>

        {/* AnimatedText - Who we work with */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 mb-14 text-center"
        >
          <h3 className="text-3xl font-medium text-muted-foreground sm:text-4xl md:text-5xl">
            {data.copywriting.headline}
          </h3>
          <div className="mt-4">
            <span className="text-3xl font-bold sm:text-4xl md:text-5xl">
              <AnimatedText
                phrases={data.copywriting.phrases}
                accentColor={service.accentColor}
                interval={2500}
              />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

DifferentiatorsSection.displayName = "DifferentiatorsSection";

export default DifferentiatorsSection;
