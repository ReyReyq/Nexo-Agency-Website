import { useEffect, useMemo, memo, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  Sparkles,
  Target,
  Zap,
  Shield,
  Award,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Rocket,
  Coffee,
  Bell,
  LineChart,
  Eye,
  RefreshCw,
  Heart,
  Star,
  Repeat,
  Key,
  Wrench,
  Scale,
  Smile,
  Globe,
  Lightbulb,
  Layers,
  Type,
  FileCheck,
  BookOpen,
  Palette,
  Image,
  PenTool,
  Layout,
  MessageSquare,
  Brain,
  ArrowRightLeft,
  BarChart,
  Link as LinkIcon,
  Mail,
  Calendar,
  Database,
  Code,
  Gauge,
  FileText,
  Search,
  Filter,
  FileDown,
  Grid,
  Settings,
  Puzzle,
  Lock,
  ShoppingBag,
  CreditCard,
  Truck,
  HeadphonesIcon,
  Wallet,
  Video,
  RotateCw,
  Wand,
  Maximize,
  Edit,
  Smartphone,
  BarChart2,
  type LucideIcon,
} from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import Magnet from "@/components/Magnet";
import SteppedProcessSection from "@/components/SteppedProcessSection";
import Ballpit from "@/components/Ballpit";
import SubServiceBlogSection from "@/components/service/SubServiceBlogSection";
import { cn } from "@/lib/utils";
import { getSubServiceBySlug, getSubServicesByParent, type SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import { getServiceBySlug, type Service } from "@/data/services";
import useMeasure from "react-use-measure";

// ============================================
// ICON MAPPING
// ============================================

const iconMap: Record<string, LucideIcon> = {
  Target,
  Zap,
  Shield,
  Award,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Rocket,
  Coffee,
  Bell,
  LineChart,
  Eye,
  RefreshCw,
  Heart,
  Star,
  Repeat,
  Key,
  Wrench,
  Scale,
  Smile,
  Globe,
  Lightbulb,
  Layers,
  Type,
  FileCheck,
  BookOpen,
  Palette,
  Image,
  PenTool,
  Layout,
  MessageSquare,
  Brain,
  ArrowRightLeft,
  BarChart,
  Link: LinkIcon,
  Mail,
  Calendar,
  Database,
  Code,
  Gauge,
  FileText,
  Search,
  Filter,
  FileDown,
  Grid,
  Settings,
  Puzzle,
  Lock,
  ShoppingBag,
  CreditCard,
  Truck,
  HeadphonesIcon,
  Wallet,
  Video,
  RotateCw,
  Wand,
  Maximize,
  Edit,
  Smartphone,
  BarChart2,
  Sparkles,
  Check,
};

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Sparkles;
};

// ============================================
// ANIMATION CONSTANTS
// ============================================

const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const INITIAL_FADE_UP_30 = { opacity: 0, y: 30 };
const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const INITIAL_FADE_LEFT_60 = { opacity: 0, x: -60 };
const INITIAL_FADE_RIGHT_60 = { opacity: 0, x: 60 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_VISIBLE_X = { opacity: 1, x: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_MAIN = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const TRANSITION_DURATION_06 = { duration: 0.6 };
const IN_VIEW_OPTIONS_ONCE = { once: true };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };
const VIEWPORT_ONCE = { once: true };

// ============================================
// HERO SECTION
// ============================================

interface HeroSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const HeroSection = memo(({ subService, parentService }: HeroSectionProps) => {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, IN_VIEW_OPTIONS_ONCE);
  const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;

  // Convert hex accent color to number for Three.js
  const accentColorNum = parseInt(parentService.accentColor.replace('#', ''), 16);

  return (
    <section
      className="relative overflow-hidden bg-black min-h-screen min-h-[100dvh]"
      style={{ minHeight: 'min(700px, 100svh)', height: '100svh', maxHeight: '900px' }}
    >
      {/* Ballpit Background Effect - Service-specific colors */}
      <div className="absolute inset-0">
        <Ballpit
          className="w-full h-full"
          count={200}
          colors={[0xffffff, 0x000000, accentColorNum]}
          gravity={0.2}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center h-full">
        <motion.div
          ref={heroRef}
          initial={INITIAL_FADE_UP_40}
          animate={animateState}
          transition={TRANSITION_MAIN}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-hero-fg/60 mb-6 flex-wrap"
            dir="rtl"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-hero-fg transition-colors">
              <Home className="w-4 h-4" />
              <span>ראשי</span>
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to="/services" className="hover:text-hero-fg transition-colors">
              שירותים
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to={`/services/${parentService.slug}`} className="hover:text-hero-fg transition-colors">
              {parentService.name}
            </Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-hero-fg font-medium">{subService.name}</span>
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={INITIAL_FADE_UP_30}
            animate={animateState}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg leading-tight mb-4"
          >
            {subService.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-hero-fg/80 font-medium mb-4"
          >
            {subService.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-hero-fg/60 text-base sm:text-lg max-w-2xl mx-auto mb-10"
          >
            {subService.heroDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={INITIAL_FADE_UP_20}
            animate={animateState}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold bg-white text-black transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  בואו נתחיל
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            <Magnet magnetStrength={3} padding={60}>
              <a
                href="#what-is-this"
                className="group relative inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-hero-fg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-white/20 hover:scale-105 active:scale-95 transition-all border border-white/20 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  למידע נוסף
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </a>
            </Magnet>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// ============================================
// WHAT IS THIS SECTION
// ============================================

interface WhatIsThisSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const WhatIsThisSection = memo(({ subService, parentService }: WhatIsThisSectionProps) => {
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
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
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

WhatIsThisSection.displayName = 'WhatIsThisSection';

// ============================================
// VISION BOARD FEATURES SECTION
// ============================================

interface FeaturesGridSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

// Pre-defined card positions for vision board layout (non-overlapping grid)
// Cards are ~160px wide x ~150px tall, positions ensure NO overlap
// Container height: 850px minimum
const visionBoardPositions = [
  // Top row - 4 cards across the top
  { top: '0%', left: '1%', rotate: -4 },
  { top: '2%', left: '21%', rotate: 2 },
  { top: '0%', right: '21%', rotate: -2 },
  { top: '2%', right: '1%', rotate: 5 },
  // Upper side - 2 cards (17-35% from top)
  { top: '17%', left: '0%', rotate: -3 },
  { top: '19%', right: '0%', rotate: 3 },
  // Lower side - 2 cards (17-35% from bottom) - far from upper side
  { bottom: '17%', left: '0%', rotate: 4 },
  { bottom: '19%', right: '0%', rotate: -4 },
  // Bottom row - 4 cards across the bottom
  { bottom: '0%', left: '1%', rotate: 3 },
  { bottom: '2%', left: '21%', rotate: -2 },
  { bottom: '0%', right: '21%', rotate: 4 },
  { bottom: '2%', right: '1%', rotate: -5 },
];

// Vision board items per service slug
type VisionItem = { icon: string; title: string; description: string };

const visionBoardItemsByService: Record<string, VisionItem[]> = {
  // Chatbots
  'chatbots': [
    { icon: 'Clock', title: '24/7 זמינות', description: 'מענה ללקוחות בכל שעה' },
    { icon: 'TrendingDown', title: '60% חיסכון', description: 'בעלויות שירות לקוחות' },
    { icon: 'Zap', title: 'מענה ב-3 שניות', description: 'ללא תורים וללא המתנה' },
    { icon: 'Heart', title: 'לקוחות מרוצים', description: 'חוויית שירות מעולה' },
    { icon: 'Globe', title: 'עברית מושלמת', description: 'הבנת סלנג וניסוחים' },
    { icon: 'Shield', title: 'אבטחה מלאה', description: 'הצפנה ועמידה בתקנים' },
    { icon: 'Rocket', title: 'השקה מהירה', description: 'מוכן תוך ימים' },
    { icon: 'Users', title: 'קיבולת אינסופית', description: 'אלפי פניות במקביל' },
    { icon: 'Target', title: 'התאמה מלאה', description: 'בשפה של המותג שלכם' },
    { icon: 'Smile', title: 'אפס תסכול', description: 'תשובות מדויקות מיד' },
    { icon: 'Coffee', title: 'צוות רגוע', description: 'פחות שאלות חוזרות' },
    { icon: 'Star', title: 'חוויה אנושית', description: 'שיחה טבעית ונעימה' },
  ],
  // Workflow Automation (slug: automation)
  'automation': [
    { icon: 'Zap', title: 'אוטומציה מלאה', description: 'תהליכים ללא מגע יד' },
    { icon: 'Clock', title: 'חיסכון בזמן', description: 'שעות עבודה בדקות' },
    { icon: 'TrendingDown', title: '80% פחות טעויות', description: 'דיוק מכונה מושלם' },
    { icon: 'RefreshCw', title: 'סנכרון מערכות', description: 'הכל מדבר עם הכל' },
    { icon: 'Users', title: 'שחרור הצוות', description: 'למשימות משמעותיות' },
    { icon: 'Eye', title: 'מעקב בזמן אמת', description: 'דשבורד מקיף' },
    { icon: 'Shield', title: 'אמינות גבוהה', description: 'תהליכים יציבים' },
    { icon: 'Settings', title: 'גמישות מלאה', description: 'מתאים לכל תהליך' },
    { icon: 'Bell', title: 'התראות חכמות', description: 'רק מה שחשוב באמת' },
    { icon: 'Database', title: 'מידע מרוכז', description: 'כל הנתונים במקום אחד' },
    { icon: 'TrendingUp', title: 'צמיחה ללא גבול', description: 'סקייל אוטומטי' },
    { icon: 'Star', title: 'איכות קבועה', description: 'תוצאות אחידות תמיד' },
  ],
  // AI Images (slug: ai-images)
  'ai-images': [
    { icon: 'Image', title: 'תמונות מותאמות', description: 'ויזואל ייחודי למותג' },
    { icon: 'Zap', title: 'יצירה מהירה', description: 'תמונות בשניות' },
    { icon: 'TrendingDown', title: '90% חיסכון', description: 'לעומת צילום מקצועי' },
    { icon: 'Palette', title: 'סגנון אחיד', description: 'התאמה לשפת המותג' },
    { icon: 'RefreshCw', title: 'וריאציות אינסופיות', description: 'גרסאות שונות בלחיצה' },
    { icon: 'Target', title: 'דיוק בפרטים', description: 'שליטה מלאה בתוצאה' },
    { icon: 'Maximize', title: 'כל רזולוציה', description: 'מרשת ועד שלט' },
    { icon: 'Shield', title: 'זכויות יוצרים', description: 'תמונות שלכם לגמרי' },
    { icon: 'Users', title: 'אנשים מציאותיים', description: 'ללא צורך במודלים' },
    { icon: 'Layers', title: 'עריכה מתקדמת', description: 'שינויים בקלות' },
    { icon: 'Rocket', title: 'סקייל ללא גבול', description: 'כמה שצריך' },
    { icon: 'Star', title: 'איכות מקצועית', description: 'תוצאות מרהיבות' },
  ],
  // AI Content (slug: ai-content)
  'ai-content': [
    { icon: 'Type', title: 'תוכן מותאם', description: 'בטון הדיבור שלכם' },
    { icon: 'Zap', title: 'יצירה מהירה', description: 'מאמרים בדקות' },
    { icon: 'Globe', title: 'עברית מקצועית', description: 'ניסוח שוטף וטבעי' },
    { icon: 'Target', title: 'SEO מובנה', description: 'אופטימיזציה אוטומטית' },
    { icon: 'RefreshCw', title: 'עדכון שוטף', description: 'תוכן תמיד רלוונטי' },
    { icon: 'Users', title: 'קהל מדויק', description: 'התאמה לפרסונות' },
    { icon: 'TrendingUp', title: 'המרות גבוהות', description: 'תוכן שמוכר' },
    { icon: 'Shield', title: 'ייחודיות מובטחת', description: '100% תוכן מקורי' },
    { icon: 'Clock', title: 'עקביות', description: 'פרסום קבוע ומתוכנן' },
    { icon: 'Lightbulb', title: 'רעיונות אינסופיים', description: 'בנק נושאים מתעדכן' },
    { icon: 'BarChart', title: 'מדידה מתקדמת', description: 'ביצועים בזמן אמת' },
    { icon: 'Star', title: 'איכות אנושית', description: 'עריכה מקצועית' },
  ],
  // Landing Pages
  'landing-pages': [
    { icon: 'Target', title: 'המרות גבוהות', description: 'כל קליק הופך ללקוח' },
    { icon: 'Zap', title: 'טעינה מהירה', description: 'פחות מ-2 שניות' },
    { icon: 'TrendingUp', title: 'ROI משופר', description: 'מקסימום מהקמפיין' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'מושלם בכל מכשיר' },
    { icon: 'Eye', title: 'עיצוב שמושך', description: 'מסרים ויזואליים חזקים' },
    { icon: 'BarChart', title: 'A/B טסטינג', description: 'אופטימיזציה מתמדת' },
    { icon: 'Clock', title: 'השקה מהירה', description: 'מוכן תוך ימים' },
    { icon: 'MessageSquare', title: 'CTA ממוקד', description: 'קריאה לפעולה ברורה' },
    { icon: 'Search', title: 'מותאם לגוגל', description: 'ציון איכות גבוה' },
    { icon: 'DollarSign', title: 'עלות מודעה נמוכה', description: 'חיסכון בפרסום' },
    { icon: 'Users', title: 'לידים איכותיים', description: 'פניות רלוונטיות בלבד' },
    { icon: 'Rocket', title: 'סטארט מהיר', description: 'קמפיין באוויר מחר' },
  ],
  // WordPress
  'wordpress': [
    { icon: 'Edit', title: 'עריכה עצמאית', description: 'ניהול תוכן קל' },
    { icon: 'Puzzle', title: 'תוספים עשירים', description: 'אלפי אפשרויות' },
    { icon: 'TrendingDown', title: 'עלות תחזוקה נמוכה', description: 'חיסכון לאורך זמן' },
    { icon: 'Search', title: 'SEO מובנה', description: 'דירוג גבוה בגוגל' },
    { icon: 'Shield', title: 'אבטחה מתקדמת', description: 'הגנה מלאה על האתר' },
    { icon: 'RefreshCw', title: 'עדכונים אוטומטיים', description: 'תמיד מעודכן' },
    { icon: 'Globe', title: 'רב-לשוני', description: 'עברית ושפות נוספות' },
    { icon: 'Layers', title: 'עיצוב גמיש', description: 'התאמה מלאה למותג' },
    { icon: 'ShoppingBag', title: 'WooCommerce', description: 'חנות בקלות' },
    { icon: 'Users', title: 'קהילה ענקית', description: 'תמיכה ופתרונות' },
    { icon: 'Gauge', title: 'ביצועים מהירים', description: 'אופטימיזציה מקסימלית' },
    { icon: 'BookOpen', title: 'בלוג מובנה', description: 'תוכן שמוכר' },
  ],
  // Web Apps
  'web-apps': [
    { icon: 'Code', title: 'פיתוח מותאם', description: 'בדיוק מה שצריך' },
    { icon: 'Database', title: 'ניהול נתונים', description: 'מערכות מידע חכמות' },
    { icon: 'Users', title: 'ריבוי משתמשים', description: 'הרשאות ותפקידים' },
    { icon: 'Lock', title: 'אבטחה קריטית', description: 'הצפנה והגנה מלאה' },
    { icon: 'Zap', title: 'תגובה מהירה', description: 'חוויה חלקה' },
    { icon: 'RefreshCw', title: 'סנכרון בזמן אמת', description: 'נתונים תמיד עדכניים' },
    { icon: 'Smartphone', title: 'PWA', description: 'כמו אפליקציה נייטיב' },
    { icon: 'Settings', title: 'אוטומציה', description: 'תהליכים חכמים' },
    { icon: 'Link', title: 'אינטגרציות', description: 'חיבור למערכות קיימות' },
    { icon: 'LineChart', title: 'דשבורדים', description: 'תובנות בזמן אמת' },
    { icon: 'TrendingUp', title: 'סקייל ללא גבול', description: 'צומח עם העסק' },
    { icon: 'Wrench', title: 'תחזוקה שוטפת', description: 'תמיד עובד מושלם' },
  ],
  // Corporate Sites
  'corporate-sites': [
    { icon: 'Award', title: 'מראה מקצועי', description: 'רושם ראשוני מנצח' },
    { icon: 'Globe', title: 'נוכחות דיגיטלית', description: 'זמינים 24/7' },
    { icon: 'Heart', title: 'אמון לקוחות', description: 'קרדיט ואמינות' },
    { icon: 'Palette', title: 'מיתוג אחיד', description: 'שפת עיצוב מותג' },
    { icon: 'FileText', title: 'תוכן מוביל', description: 'מסרים ברורים' },
    { icon: 'Mail', title: 'טפסי פניה', description: 'לידים ישירות' },
    { icon: 'Image', title: 'גלריית עבודות', description: 'הצגת הפורטפוליו' },
    { icon: 'Users', title: 'דף צוות', description: 'פנים לחברה' },
    { icon: 'Star', title: 'המלצות', description: 'עדויות לקוחות' },
    { icon: 'Calendar', title: 'חדשות ועדכונים', description: 'תוכן דינמי' },
    { icon: 'Search', title: 'SEO מובנה', description: 'נמצאים בגוגל' },
    { icon: 'Maximize', title: 'חווית משתמש', description: 'ניווט אינטואיטיבי' },
  ],
  // Catalog Sites
  'catalog-sites': [
    { icon: 'Grid', title: 'תצוגת מוצרים', description: 'קטלוג מסודר' },
    { icon: 'Filter', title: 'סינון חכם', description: 'מציאה מהירה' },
    { icon: 'Search', title: 'חיפוש מתקדם', description: 'כל מוצר בשניות' },
    { icon: 'Image', title: 'גלריות מוצר', description: 'תמונות באיכות גבוהה' },
    { icon: 'FileDown', title: 'הורדת קטלוג', description: 'PDF אוטומטי' },
    { icon: 'Layers', title: 'קטגוריות', description: 'ארגון היררכי' },
    { icon: 'Eye', title: 'תצוגה מהירה', description: 'פרטים בקליק' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'גלישה בכל מקום' },
    { icon: 'RefreshCw', title: 'עדכון קל', description: 'ניהול מלאי פשוט' },
    { icon: 'Mail', title: 'בקשת הצעת מחיר', description: 'לידים חמים' },
    { icon: 'BarChart2', title: 'השוואת מוצרים', description: 'החלטה מושכלת' },
    { icon: 'Bell', title: 'התראות מלאי', description: 'עדכוני זמינות' },
  ],
  // Shopify
  'shopify': [
    { icon: 'ShoppingBag', title: 'חנות מוכנה', description: 'מוכנים למכור מהיום' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'קנייה נוחה בנייד' },
    { icon: 'CreditCard', title: 'תשלומים מאובטחים', description: 'ללא חששות ללקוח' },
    { icon: 'TrendingUp', title: 'צמיחה מהירה', description: 'מכירות בעלייה מתמדת' },
    { icon: 'Gauge', title: 'מהירות טעינה', description: 'חוויית גלישה חלקה' },
    { icon: 'Globe', title: 'מכירות גלובליות', description: 'לקוחות מכל העולם' },
    { icon: 'Truck', title: 'משלוחים אוטומטיים', description: 'מעקב בזמן אמת' },
    { icon: 'Star', title: 'עיצוב פרימיום', description: 'מותג שמוכר את עצמו' },
    { icon: 'RefreshCw', title: 'עדכונים אוטומטיים', description: 'תמיד בגרסה הטובה' },
    { icon: 'Lock', title: 'אבטחה מקסימלית', description: 'עסקאות מוגנות 100%' },
    { icon: 'BarChart2', title: 'אנליטיקס מתקדם', description: 'הבנת התנהגות לקוחות' },
    { icon: 'Zap', title: 'ביצועים גבוהים', description: 'אפס השבתות' },
  ],
  // WooCommerce
  'woocommerce': [
    { icon: 'Code', title: 'שליטה מלאה', description: 'התאמה אישית מושלמת' },
    { icon: 'Puzzle', title: 'תוספים ללא הגבלה', description: 'הרחבות לכל צורך' },
    { icon: 'Wallet', title: 'ללא עמלות', description: 'חיסכון בכל עסקה' },
    { icon: 'Database', title: 'בעלות על המידע', description: 'הכל אצלכם בשרת' },
    { icon: 'Layout', title: 'עיצוב ללא גבולות', description: 'כל דמיון אפשרי' },
    { icon: 'Settings', title: 'גמישות מקסימלית', description: 'מתאים לכל עסק' },
    { icon: 'TrendingUp', title: 'סקייל ללא גבול', description: 'גדלים איתכם' },
    { icon: 'Shield', title: 'קוד פתוח מאובטח', description: 'קהילה עולמית' },
    { icon: 'DollarSign', title: 'עלויות נמוכות', description: 'יותר רווח לעסק' },
    { icon: 'Users', title: 'ניהול לקוחות', description: 'CRM מובנה בחנות' },
    { icon: 'Layers', title: 'אינטגרציות רבות', description: 'חיבור לכל מערכת' },
    { icon: 'Rocket', title: 'השקה מהירה', description: 'אונליין תוך ימים' },
  ],
  // Payments
  'payments': [
    { icon: 'CreditCard', title: 'כל אמצעי תשלום', description: 'ויזה, מאסטר, פייפאל' },
    { icon: 'Lock', title: 'הצפנה מלאה', description: 'PCI DSS מאושר' },
    { icon: 'Zap', title: 'אישור מיידי', description: 'עסקה בשניות' },
    { icon: 'RefreshCw', title: 'תשלומים חוזרים', description: 'מנויים אוטומטיים' },
    { icon: 'Globe', title: 'מטבעות מרובים', description: 'שקל, דולר, יורו' },
    { icon: 'Shield', title: 'מניעת הונאות', description: 'הגנה מתקדמת' },
    { icon: 'Smartphone', title: 'תשלום במובייל', description: 'Apple Pay, Google Pay' },
    { icon: 'FileText', title: 'חשבוניות אוטומטיות', description: 'הכל לפי החוק' },
    { icon: 'TrendingDown', title: 'עמלות מינימליות', description: 'יותר כסף בכיס' },
    { icon: 'Check', title: 'אימות חכם', description: '3D Secure מובנה' },
    { icon: 'Clock', title: 'העברה מהירה', description: 'כסף תוך 24 שעות' },
    { icon: 'HeadphonesIcon', title: 'תמיכה בתקלות', description: 'פתרון בזמן אמת' },
  ],
  // Inventory
  'inventory': [
    { icon: 'Database', title: 'מעקב בזמן אמת', description: 'מלאי מדויק תמיד' },
    { icon: 'Bell', title: 'התראות חכמות', description: 'מלאי נמוך? נודיע' },
    { icon: 'RefreshCw', title: 'סנכרון אוטומטי', description: 'כל הערוצים מחוברים' },
    { icon: 'BarChart', title: 'תחזיות מכירה', description: 'הזמנה חכמה מראש' },
    { icon: 'Truck', title: 'ניהול ספקים', description: 'הזמנות אוטומטיות' },
    { icon: 'Search', title: 'סריקת ברקודים', description: 'עדכון מהיר ומדויק' },
    { icon: 'Layers', title: 'ריבוי מחסנים', description: 'ניהול מרכזי אחד' },
    { icon: 'TrendingDown', title: 'צמצום פחת', description: 'אפס אובדן מלאי' },
    { icon: 'FileCheck', title: 'דוחות מפורטים', description: 'תמונה ברורה תמיד' },
    { icon: 'Zap', title: 'אוטומציה מלאה', description: 'פחות עבודה ידנית' },
    { icon: 'Target', title: 'דיוק מקסימלי', description: 'אפס טעויות ספירה' },
    { icon: 'DollarSign', title: 'חיסכון בעלויות', description: 'מלאי אופטימלי' },
  ],
  // Logo Design
  'logo-design': [
    { icon: 'Eye', title: 'זיהוי מיידי', description: 'מותג שנחרט בזיכרון' },
    { icon: 'Target', title: 'בידול מתחרים', description: 'ייחודיות שאי אפשר להתעלם' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'לוגו שמרגישים' },
    { icon: 'Star', title: 'רושם ראשוני', description: 'פתיחה בלתי נשכחת' },
    { icon: 'Maximize', title: 'כל פורמט', description: 'מכרטיס ועד שלט' },
    { icon: 'Clock', title: 'עיצוב נצחי', description: 'לא יוצא מהאופנה' },
    { icon: 'Award', title: 'מקצועיות', description: 'רושם של הצלחה' },
    { icon: 'Puzzle', title: 'גמישות מלאה', description: 'מתאים לכל שימוש' },
    { icon: 'Lightbulb', title: 'סיפור במבט', description: 'מסר ויזואלי חזק' },
    { icon: 'Shield', title: 'זכויות מלאות', description: 'הלוגו שלכם לתמיד' },
    { icon: 'TrendingUp', title: 'ערך עולה', description: 'נכס שמתחזק' },
    { icon: 'Sparkles', title: 'איכות פרימיום', description: 'עיצוב ברמה עולמית' },
  ],
  // Visual Identity
  'visual-identity': [
    { icon: 'Layers', title: 'שפה אחידה', description: 'עקביות בכל נקודת מגע' },
    { icon: 'Palette', title: 'פלטת צבעים', description: 'צבעים שמזהים רק אתכם' },
    { icon: 'Type', title: 'טיפוגרפיה', description: 'גופנים שמדברים בשמכם' },
    { icon: 'Grid', title: 'מערכת סדר', description: 'לייאאוט שעובד תמיד' },
    { icon: 'Image', title: 'סגנון תמונות', description: 'שפה ויזואלית ייחודית' },
    { icon: 'Globe', title: 'נוכחות מותגית', description: 'מוכרים בכל פלטפורמה' },
    { icon: 'Lock', title: 'מותג מוגן', description: 'קשה לחקות' },
    { icon: 'Users', title: 'אמון לקוחות', description: 'מראה מקצועי ואמין' },
    { icon: 'Repeat', title: 'חזרתיות', description: 'זיכרון מותג חזק' },
    { icon: 'PenTool', title: 'עיצוב גרפי', description: 'אלמנטים ייחודיים' },
    { icon: 'Layout', title: 'תבניות מוכנות', description: 'יצירת חומרים בקלות' },
    { icon: 'Rocket', title: 'מותג בוגר', description: 'תדמית של הצלחה' },
  ],
  // Brand Book
  'brand-book': [
    { icon: 'BookOpen', title: 'מדריך מקיף', description: 'הכל במקום אחד' },
    { icon: 'FileCheck', title: 'חוקים ברורים', description: 'איך להשתמש נכון' },
    { icon: 'Shield', title: 'שמירה על המותג', description: 'מניעת טעויות' },
    { icon: 'Users', title: 'העברת ידע', description: 'כל עובד מבין' },
    { icon: 'RefreshCw', title: 'עקביות לאורך זמן', description: 'מותג שלא משתנה' },
    { icon: 'Scale', title: 'סטנדרט אחיד', description: 'איכות קבועה' },
    { icon: 'Zap', title: 'יעילות בעבודה', description: 'חיסכון בזמן יצירה' },
    { icon: 'Target', title: 'מיקוד המסר', description: 'תקשורת ברורה' },
    { icon: 'Settings', title: 'פרטים טכניים', description: 'קודי צבע ומידות' },
    { icon: 'Truck', title: 'מוכן להעברה', description: 'לספקים ושותפים' },
    { icon: 'Award', title: 'מקצועיות', description: 'רושם של ארגון רציני' },
    { icon: 'Key', title: 'שליטה במותג', description: 'הבעלות בידיים שלכם' },
  ],
  // Copywriting
  'copywriting': [
    { icon: 'MessageSquare', title: 'טון דיבור', description: 'קול ייחודי למותג' },
    { icon: 'Target', title: 'מסרים שפוגעים', description: 'במלאה ובמדויק' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'מילים שנוגעות' },
    { icon: 'TrendingUp', title: 'המרות גבוהות', description: 'טקסט שמוכר' },
    { icon: 'Brain', title: 'פסיכולוגיה', description: 'שכנוע מבוסס מדע' },
    { icon: 'Star', title: 'בידול חד', description: 'לא עוד אחד' },
    { icon: 'Smile', title: 'אישיות', description: 'מותג עם אופי' },
    { icon: 'Repeat', title: 'סיסמאות חזקות', description: 'משפטים שנשארים' },
    { icon: 'FileText', title: 'תוכן מותג', description: 'כל הטקסטים מוכנים' },
    { icon: 'Globe', title: 'עברית מושלמת', description: 'ניסוח מקומי אותנטי' },
    { icon: 'Zap', title: 'כותרות חזקות', description: 'תופסים תשומת לב' },
    { icon: 'Award', title: 'מסר מנצח', description: 'יתרון על המתחרים' },
  ],
  // Google Ads
  'google-ads': [
    { icon: 'Target', title: 'מיקוד מדויק', description: 'הגעה לקהל הנכון' },
    { icon: 'DollarSign', title: 'ROI מוכח', description: 'תשואה על כל שקל' },
    { icon: 'Search', title: 'כוונת רכישה', description: 'לקוחות שמחפשים אתכם' },
    { icon: 'TrendingUp', title: 'צמיחה מהירה', description: 'תוצאות מהיום הראשון' },
    { icon: 'Gauge', title: 'שליטה מלאה', description: 'תקציב גמיש ומדיד' },
    { icon: 'Eye', title: 'חשיפה מקסימלית', description: 'ראשונים בתוצאות גוגל' },
    { icon: 'BarChart2', title: 'נתונים בזמן אמת', description: 'מעקב וניתוח מתמיד' },
    { icon: 'Filter', title: 'קהלים מותאמים', description: 'פילוח דמוגרפי מדויק' },
    { icon: 'RefreshCw', title: 'אופטימיזציה יומית', description: 'שיפור ביצועים קבוע' },
    { icon: 'Zap', title: 'תגובה מיידית', description: 'המרות בזמן אמת' },
    { icon: 'Scale', title: 'סקייל חכם', description: 'הגדלה בלי בזבוז' },
    { icon: 'Award', title: 'מעמד מוביל', description: 'ניצחון על המתחרים' },
  ],
  // Meta Ads (Facebook/Instagram)
  'meta-ads': [
    { icon: 'Users', title: 'קהלים מותאמים', description: 'טירגוט לפי התנהגות' },
    { icon: 'Heart', title: 'מעורבות גבוהה', description: 'לייקים, שיתופים, תגובות' },
    { icon: 'Image', title: 'קריאייטיב שמוכר', description: 'עיצובים שעוצרים גלילה' },
    { icon: 'Video', title: 'וידאו ממיר', description: 'סטוריז וריילס אפקטיביים' },
    { icon: 'Repeat', title: 'ריטרגטינג חכם', description: 'חזרה ללקוחות מתעניינים' },
    { icon: 'Layers', title: 'פאנל מלא', description: 'מודעות לכל שלב' },
    { icon: 'Smartphone', title: 'מובייל פירסט', description: 'אופטימיזציה לסלולר' },
    { icon: 'Globe', title: 'חשיפה רחבה', description: '3 מיליון ישראלים' },
    { icon: 'ShoppingBag', title: 'קטלוג דינמי', description: 'מוצרים מותאמים אישית' },
    { icon: 'TrendingUp', title: 'לידים איכותיים', description: 'טפסים מובנים בפלטפורמה' },
    { icon: 'Sparkles', title: 'מיתוג ויראלי', description: 'בניית מודעות למותג' },
    { icon: 'BarChart', title: 'פיקסל חכם', description: 'מעקב המרות מדויק' },
  ],
  // Email Marketing
  'email-marketing': [
    { icon: 'Mail', title: 'הגעה ישירה', description: 'לתיבה של הלקוח' },
    { icon: 'DollarSign', title: 'עלות אפסית', description: 'החזר השקעה הגבוה ביותר' },
    { icon: 'Users', title: 'קשר אישי', description: 'פרסונליזציה מתקדמת' },
    { icon: 'Calendar', title: 'אוטומציה מלאה', description: 'שליחה בזמן הנכון' },
    { icon: 'BarChart2', title: 'מדידה מדויקת', description: 'פתיחות, קליקים, המרות' },
    { icon: 'Repeat', title: 'נאמנות לקוחות', description: 'שימור וחזרה לרכישה' },
    { icon: 'Zap', title: 'מענה מהיר', description: 'הודעות טריגר אוטומטיות' },
    { icon: 'Edit', title: 'תוכן מותאם', description: 'סגמנטציה חכמה' },
    { icon: 'Target', title: 'A/B טסטינג', description: 'אופטימיזציה מתמדת' },
    { icon: 'ShoppingBag', title: 'עגלות נטושות', description: 'שחזור מכירות אבודות' },
    { icon: 'Bell', title: 'עדכונים שוטפים', description: 'ניוזלטרים שנפתחים' },
    { icon: 'Lock', title: 'רשימה שלכם', description: 'נכס דיגיטלי בבעלותכם' },
  ],
  // Influencer Marketing
  'influencer': [
    { icon: 'Star', title: 'אמינות גבוהה', description: 'המלצה מאדם אמיתי' },
    { icon: 'Users', title: 'קהל נאמן', description: 'עוקבים שמקשיבים' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'תוכן אותנטי ומחבר' },
    { icon: 'Eye', title: 'חשיפה אורגנית', description: 'נראות ללא מודעות' },
    { icon: 'MessageSquare', title: 'שיח אמיתי', description: 'מעורבות בתגובות' },
    { icon: 'TrendingUp', title: 'ויראליות', description: 'פוטנציאל להתפשטות' },
    { icon: 'Video', title: 'תוכן יצירתי', description: 'סטוריז, ריילס, לייבים' },
    { icon: 'Target', title: 'נישה מדויקת', description: 'הקהל הרלוונטי בדיוק' },
    { icon: 'Award', title: 'שיתופי פעולה', description: 'קמפיינים ייחודיים' },
    { icon: 'Rocket', title: 'השקות מוצרים', description: 'באז מיידי לחדשות' },
    { icon: 'Link', title: 'קודי הנחה', description: 'מעקב וייחוס מדויק' },
    { icon: 'Globe', title: 'מותג חזק', description: 'בניית מודעות ארוכת טווח' },
  ],
};

// Default/fallback vision items
const defaultVisionItems: VisionItem[] = [
  { icon: 'Zap', title: 'יעילות מקסימלית', description: 'תוצאות מהירות יותר' },
  { icon: 'TrendingUp', title: 'צמיחה עסקית', description: 'הגדלת ההכנסות' },
  { icon: 'Users', title: 'חווית לקוח', description: 'שביעות רצון גבוהה' },
  { icon: 'Shield', title: 'אמינות מוכחת', description: 'תוצאות עקביות' },
  { icon: 'Clock', title: 'חיסכון בזמן', description: 'יותר שעות פנויות' },
  { icon: 'Target', title: 'מיקוד בתוצאות', description: 'השגת יעדים' },
  { icon: 'Heart', title: 'שירות אישי', description: 'ליווי צמוד' },
  { icon: 'Star', title: 'איכות גבוהה', description: 'ללא פשרות' },
  { icon: 'Rocket', title: 'התקדמות מהירה', description: 'צעדים גדולים' },
  { icon: 'Eye', title: 'שקיפות מלאה', description: 'תקשורת פתוחה' },
  { icon: 'Settings', title: 'התאמה אישית', description: 'פתרון מדויק' },
  { icon: 'Award', title: 'מומחיות', description: 'ניסיון עשיר' },
];

// Get vision items for a specific service
const getVisionItems = (slug: string): VisionItem[] => {
  return visionBoardItemsByService[slug] || defaultVisionItems;
};

// Color variations for cards
const getCardColors = (accentColor: string, index: number) => {
  const variations = [
    { bg: accentColor, text: '#ffffff', light: false },
    { bg: '#ffffff', text: '#1f2937', light: true },
    { bg: `${accentColor}20`, text: '#1f2937', light: true },
    { bg: '#fef3c7', text: '#92400e', light: true }, // Warm yellow
    { bg: '#dbeafe', text: '#1e40af', light: true }, // Light blue
    { bg: '#f3e8ff', text: '#7c3aed', light: true }, // Light purple
    { bg: '#dcfce7', text: '#166534', light: true }, // Light green
    { bg: '#ffe4e6', text: '#be123c', light: true }, // Light pink
    { bg: '#ffffff', text: '#1f2937', light: true },
    { bg: accentColor, text: '#ffffff', light: false },
    { bg: '#e0e7ff', text: '#3730a3', light: true }, // Light indigo
    { bg: '#fef9c3', text: '#854d0e', light: true }, // Light amber
  ];
  return variations[index % variations.length];
};

const FeaturesGridSection = memo(({ subService, parentService }: FeaturesGridSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: '#f8fafc' }}
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

        {/* ===== DESKTOP LAYOUT - Vision Board ===== */}
        <div className="hidden lg:block relative" style={{ minHeight: '850px' }}>

          {/* Center Headline - truly centered */}
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
              <p className="text-gray-600 text-lg">
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
                      style={{ color: colors.light ? parentService.accentColor : '#ffffff' }}
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
                    style={{ color: colors.light ? '#6b7280' : 'rgba(255,255,255,0.85)' }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== TABLET/MOBILE LAYOUT ===== */}
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
            <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
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
                          style={{ color: colors.light ? parentService.accentColor : '#ffffff' }}
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
                          style={{ color: colors.light ? '#6b7280' : 'rgba(255,255,255,0.85)' }}
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

FeaturesGridSection.displayName = 'FeaturesGridSection';

// ============================================
// WHY CHOOSE US SECTION
// ============================================

interface WhyChooseUsSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const WhyChooseUsSection = memo(({ subService, parentService }: WhyChooseUsSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-neutral-50 to-white"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6">
            <Award className="w-4 h-4" style={{ color: parentService.accentColor }} />
            <span className="text-sm font-medium text-neutral-700">למה לבחור בנו</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
            {subService.whyChooseUs.title}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            {subService.whyChooseUs.description}
          </p>
        </motion.div>

        {/* Benefits Cards - Modern Numbered Design */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {subService.whyChooseUs.benefits.map((benefit, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="group relative"
              >
                {/* Card with soft shadow */}
                <div className="relative h-full p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${parentService.accentColor} 0%, transparent 70%)`
                    }}
                  />

                  {/* Number badge */}
                  <div className="relative mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
                      style={{
                        backgroundColor: parentService.accentColor,
                        boxShadow: `0 4px 14px -2px ${parentService.accentColor}40`
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative text-xl font-bold text-neutral-900 mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-neutral-600 leading-relaxed text-sm md:text-base">
                    {benefit.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0"
                    style={{ backgroundColor: parentService.accentColor }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

WhyChooseUsSection.displayName = 'WhyChooseUsSection';

// ============================================
// FAQ SECTION
// ============================================

// Animation variants for FAQ
const faqChevronVariants = {
  open: { rotate: 180, color: "hsl(328 100% 54%)" },
  closed: { rotate: 0, color: "#1a1a1a" },
};

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}

const FAQItem = memo(({ question, answer, isOpen, onToggle, accentColor }: FAQItemProps) => {
  const [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className="border-b border-[#e5e5e5]"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6"
        dir="rtl"
      >
        <span
          className="text-right text-lg md:text-xl font-medium transition-colors"
          style={{ color: isOpen ? accentColor : '#1a1a1a' }}
        >
          {question}
        </span>
        <motion.span variants={faqChevronVariants}>
          <ChevronDown className="text-2xl w-6 h-6" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? height : 0,
          marginBottom: isOpen ? 24 : 0,
        }}
        className="overflow-hidden text-[#4a4a4a]"
      >
        <p ref={ref} className="text-base md:text-lg leading-relaxed" dir="rtl">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
});

FAQItem.displayName = 'FAQItem';

interface FAQSectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const FAQSection = memo(({ subService, parentService }: FAQSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-background"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-muted-foreground text-lg">
            תשובות לשאלות שנשאלות הכי הרבה
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={INITIAL_FADE_UP_20}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {subService.faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              accentColor={parentService.accentColor}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

// ============================================
// RELATED SUB-SERVICES SECTION (BENTO GRID)
// ============================================

// Vibrant card colors for bento grid
const bentoCardColors = [
  "bg-emerald-300",
  "bg-indigo-300",
  "bg-rose-300",
  "bg-amber-300",
  "bg-cyan-300",
];

// Arrow Icon for bento cards
const BentoArrowIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
));

BentoArrowIcon.displayName = "BentoArrowIcon";

// Bento Spring Card component with 3 stacked layers
interface BentoSpringCardProps {
  name: string;
  description: string;
  colorClass: string;
  index: number;
  href: string;
}

const BentoSpringCard = memo(({ name, description, colorClass, index, href }: BentoSpringCardProps) => {
  return (
    <Link to={href} className="block h-full w-full">
      <motion.div
        whileHover="hovered"
        className={`group h-full w-full border-2 border-black ${colorClass}`}
        dir="rtl"
      >
        {/* Layer 2 (middle) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          variants={{ hovered: { x: -5, y: -5 } }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`-m-0.5 h-full border-2 border-black ${colorClass}`}
        >
          {/* Layer 3 (top - main content) */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -5, y: -5 } }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`relative -m-0.5 flex h-full flex-col justify-between overflow-hidden border-2 border-black ${colorClass} p-3 md:p-4`}
          >
            {/* Arrow + Title */}
            <p className="flex items-center text-sm font-medium uppercase md:text-base">
              <BentoArrowIcon className="-mr-5 ml-1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100 md:h-5 md:w-5" />
              <span className="font-bold leading-tight">{name}</span>
            </p>

            {/* Description + Button */}
            <div>
              <p className="text-[11px] leading-relaxed line-clamp-2 transition-[margin] duration-300 group-hover:mb-8 md:text-xs md:line-clamp-3">
                {description}
              </p>
              <span className="absolute bottom-1 left-1 right-1 translate-y-full border-2 border-black bg-white px-2 py-1.5 text-xs font-bold uppercase text-center opacity-0 transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100 md:bottom-1.5 md:left-1.5 md:right-1.5 md:px-3 md:py-2 md:text-sm">
                למידע נוסף
              </span>
            </div>

            {/* Rotating text circle in corner */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute -left-2 -top-2 h-12 w-12 md:h-14 md:w-14"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id={`relatedCirclePath-${index}`}
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="fill-black text-[10px] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <textPath href={`#relatedCirclePath-${index}`}>
                  למידע נוסף • למידע נוסף • למידע נוסף •
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
});

BentoSpringCard.displayName = "BentoSpringCard";

interface RelatedSubServicesSectionProps {
  currentSubServiceId: string;
  parentService: Service;
  parentSlug: string;
}

const RelatedSubServicesSection = memo(({ currentSubServiceId, parentService, parentSlug }: RelatedSubServicesSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS_MARGIN);

  // Get all sibling sub-services (excluding current one)
  const relatedServices = useMemo(() => {
    const allSiblings = getSubServicesByParent(parentSlug);
    return allSiblings
      .filter(s => s.id !== currentSubServiceId)
      .slice(0, 4) // Show max 4 related services
      .map((sub, index) => ({
        ...sub,
        colorClass: bentoCardColors[index % bentoCardColors.length],
        href: `/services/${parentSlug}/${sub.slug}`,
      }));
  }, [parentSlug, currentSubServiceId]);

  // Don't render if no related services
  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-neutral-100"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP_40}
          animate={isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY}
          transition={TRANSITION_DURATION_06}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-6">
            <Grid className="w-4 h-4" style={{ color: parentService.accentColor }} />
            <span className="text-sm font-medium text-neutral-700">שירותים נוספים</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
            עוד ב{parentService.name}
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            גלו את כל השירותים שלנו בתחום {parentService.name}
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Desktop Layout - Bento Grid */}
          <div
            className="hidden md:grid gap-3 md:gap-4"
            style={{
              gridTemplateColumns: relatedServices.length >= 3 ? "1fr 1fr 1fr" : `repeat(${relatedServices.length}, 1fr)`,
              gridTemplateRows: relatedServices.length >= 3 ? "180px 180px" : "200px",
              gridTemplateAreas: relatedServices.length >= 3
                ? `"s1 s1 s2" "s3 s4 s2"`
                : undefined,
              height: relatedServices.length >= 3 ? "380px" : "200px",
            }}
          >
            {relatedServices.map((item, index) => (
              <div
                key={item.id}
                style={relatedServices.length >= 3 ? {
                  gridArea: index === 0 ? "s1" : index === 1 ? "s2" : index === 2 ? "s3" : "s4"
                } : undefined}
              >
                <BentoSpringCard
                  name={item.name}
                  description={item.subtitle}
                  colorClass={item.colorClass}
                  index={index}
                  href={item.href}
                />
              </div>
            ))}
          </div>

          {/* Mobile Layout - Stacked cards */}
          <div className="md:hidden flex flex-col gap-3">
            {relatedServices.map((item, index) => (
              <div key={item.id} className="h-[160px]">
                <BentoSpringCard
                  name={item.name}
                  description={item.subtitle}
                  colorClass={item.colorClass}
                  index={index}
                  href={item.href}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10 md:mt-14"
        >
          <Link
            to={`/services/${parentSlug}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            <span>כל השירותים ב{parentService.name}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

RelatedSubServicesSection.displayName = 'RelatedSubServicesSection';

// ============================================
// CTA SECTION
// ============================================

interface CTASectionProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const CTASection = memo(({ subService, parentService }: CTASectionProps) => {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(var(--background)) 0%, ${parentService.bgColor} 50%, hsl(var(--background)) 100%)`,
      }}
      dir="rtl"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: parentService.accentColor }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: parentService.accentColor }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={INITIAL_FADE_UP_40}
          whileInView={ANIMATE_VISIBLE}
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl mx-auto text-center"
        >
          <Sparkles
            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-6"
            style={{ color: parentService.accentColor }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            {subService.ctaTitle}
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            {subService.ctaDescription}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* Primary CTA */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to="/contact#contact-form"
                className={cn(
                  "group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl overflow-hidden",
                  `bg-gradient-to-r ${parentService.gradient}`
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  צרו קשר עכשיו
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </Magnet>

            {/* Secondary CTA */}
            <Magnet magnetStrength={3} padding={60}>
              <Link
                to={`/services/${parentService.slug}`}
                className="group relative inline-flex items-center gap-2 bg-muted text-foreground px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-full text-base sm:text-lg font-medium hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all border border-border overflow-hidden"
              >
                <span className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  חזרה ל{parentService.name}
                </span>
              </Link>
            </Magnet>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// ============================================
// LOADING COMPONENT
// ============================================

const LoadingState = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
));

LoadingState.displayName = 'LoadingState';

// ============================================
// NOT FOUND COMPONENT
// ============================================

const NotFoundState = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
    <div className="text-center">
      <h1 className="text-4xl font-black text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-8">השירות המבוקש לא נמצא</p>
      <Link
        to="/services"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity"
      >
        חזרה לשירותים
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  </div>
));

NotFoundState.displayName = 'NotFoundState';

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const SubServiceDetail = () => {
  const { parentSlug, subSlug } = useParams<{ parentSlug: string; subSlug: string }>();
  const navigate = useNavigate();

  // Memoize lookups
  const subService = useMemo(
    () => (parentSlug && subSlug ? getSubServiceBySlug(parentSlug, subSlug) : undefined),
    [parentSlug, subSlug]
  );

  const parentService = useMemo(
    () => (parentSlug ? getServiceBySlug(parentSlug) : undefined),
    [parentSlug]
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [parentSlug, subSlug]);

  // Redirect if not found
  useEffect(() => {
    if (parentSlug && subSlug && (!subService || !parentService)) {
      // Try to navigate to parent service first
      if (parentService) {
        navigate(`/services/${parentSlug}`, { replace: true });
      } else {
        navigate("/services", { replace: true });
      }
    }
  }, [parentSlug, subSlug, subService, parentService, navigate]);

  // Loading state
  if (!subService || !parentService) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-clip" dir="rtl">
      <GlassNavbar />

      <HeroSection subService={subService} parentService={parentService} />

      <WhatIsThisSection subService={subService} parentService={parentService} />

      <SubServiceBlogSection subService={subService} parentService={parentService} />

      <FeaturesGridSection subService={subService} parentService={parentService} />

      <WhyChooseUsSection subService={subService} parentService={parentService} />

      <SteppedProcessSection
        title={subService.process.title}
        description={subService.process.description}
        steps={subService.process.steps}
        accentColor={parentService.accentColor}
      />

      <FAQSection subService={subService} parentService={parentService} />

      <RelatedSubServicesSection
        currentSubServiceId={subService.id}
        parentService={parentService}
        parentSlug={parentSlug}
      />

      <CTASection subService={subService} parentService={parentService} />

      <Footer />
    </div>
  );
};

export default SubServiceDetail;
