"use client";

import { memo, useMemo, useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { type Service } from "@/data/services";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Globe,
  Users,
  Zap,
  Award,
  ShoppingCart,
  Palette,
  Brain,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

// ============================================
// ANIMATION CONSTANTS (stable references)
// ============================================

const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_STAGGER_BASE = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };
const IN_VIEW_OPTIONS = { once: true, margin: "-50px" as const };

// ============================================
// STATS DATA BY SERVICE TYPE
// ============================================

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  icon: LucideIcon;
}

type ServiceStatsMap = {
  [key: string]: StatItem[];
};

const SERVICE_STATS: ServiceStatsMap = {
  // Web Development
  "web-development": [
    { value: 340, suffix: "%", label: "ROI ממוצע", icon: TrendingUp },
    { value: 500, suffix: "+", label: "אתרים", icon: Globe },
    { value: 7, suffix: "+", label: "שנות ניסיון", icon: Award },
    { value: 98, suffix: "%", label: "לקוחות מרוצים", icon: Users },
  ],
  // E-commerce
  ecommerce: [
    { value: 2.8, suffix: "x", label: "גידול במכירות", icon: TrendingUp },
    { value: 150, suffix: "+", label: "חנויות", icon: ShoppingCart },
    { value: 10, suffix: "M+", prefix: "₪", label: "מכירות", icon: Award },
    { value: 95, suffix: "%", label: "זמן פעולה", icon: Zap },
  ],
  // Branding
  branding: [
    { value: 500, suffix: "+", label: "מותגים", icon: Palette },
    { value: 98, suffix: "%", label: "שביעות רצון", icon: Users },
    { value: 200, suffix: "+", label: "לוגואים", icon: Award },
    { value: 7, suffix: "+", label: "שנות ניסיון", icon: TrendingUp },
  ],
  // AI & Automation
  "ai-automation": [
    { value: 20, suffix: "h", label: "חיסכון שבועי", icon: Zap },
    { value: 50, suffix: "+", label: "פתרונות AI", icon: Brain },
    { value: 85, suffix: "%", label: "שיפור יעילות", icon: TrendingUp },
    { value: 24, suffix: "/7", label: "זמינות", icon: Award },
  ],
  // Digital Marketing
  "digital-marketing": [
    { value: 2.5, suffix: "x", label: "שיפור בהמרות", icon: TrendingUp },
    { value: 5, suffix: "M+", prefix: "₪", label: "תקציב מנוהל", icon: Award },
    { value: 300, suffix: "+", label: "קמפיינים", icon: Megaphone },
    { value: 150, suffix: "%", label: "גידול בלידים", icon: Users },
  ],
  // SEO
  seo: [
    { value: 3, suffix: "", prefix: "Top ", label: "מיקום בגוגל", icon: TrendingUp },
    { value: 200, suffix: "%", label: "גידול בתנועה", icon: Users },
    { value: 100, suffix: "+", label: "מילות מפתח", icon: Globe },
    { value: 90, suffix: "%", label: "שימור דירוג", icon: Award },
  ],
  // Social Media
  "social-media": [
    { value: 150, suffix: "%", label: "גידול במעורבות", icon: TrendingUp },
    { value: 50, suffix: "+", label: "מותגים מנוהלים", icon: Users },
    { value: 1000, suffix: "+", label: "פוסטים בחודש", icon: Megaphone },
    { value: 3, suffix: "x", label: "חשיפה", icon: Award },
  ],
  // AI Images
  "ai-images": [
    { value: 10, suffix: "x", label: "מהירות הפקה", icon: Zap },
    { value: 500, suffix: "+", label: "תמונות בחודש", icon: Award },
    { value: 80, suffix: "%", label: "חיסכון בעלויות", icon: TrendingUp },
    { value: 100, suffix: "%", label: "ייחודיות", icon: Palette },
  ],
  // Strategy
  strategy: [
    { value: 85, suffix: "%", label: "שיפור בביצועים", icon: TrendingUp },
    { value: 100, suffix: "+", label: "אסטרטגיות", icon: Award },
    { value: 3, suffix: "x", label: "ROI", icon: Zap },
    { value: 95, suffix: "%", label: "יעדים שהושגו", icon: Users },
  ],
  // App Development
  "app-development": [
    { value: 4.8, suffix: "", label: "דירוג ממוצע", icon: Award },
    { value: 50, suffix: "+", label: "אפליקציות", icon: Globe },
    { value: 1, suffix: "M+", label: "הורדות", icon: Users },
    { value: 99, suffix: "%", label: "יציבות", icon: Zap },
  ],
  // Custom Development
  "custom-development": [
    { value: 100, suffix: "%", label: "התאמה לצרכים", icon: Award },
    { value: 30, suffix: "+", label: "מערכות", icon: Globe },
    { value: 99, suffix: "%", label: "זמן פעולה", icon: Zap },
    { value: 5, suffix: "x", label: "יעילות", icon: TrendingUp },
  ],
};

// Default stats for services not in the map
const DEFAULT_STATS: StatItem[] = [
  { value: 98, suffix: "%", label: "לקוחות מרוצים", icon: Users },
  { value: 500, suffix: "+", label: "פרויקטים", icon: Award },
  { value: 7, suffix: "+", label: "שנות ניסיון", icon: TrendingUp },
  { value: 24, suffix: "h", label: "זמן תגובה", icon: Zap },
];

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================

interface AnimatedNumberProps {
  value: number;
  suffix: string;
  prefix?: string;
  delay?: number;
  isInView: boolean;
}

const AnimatedNumber = memo(
  ({ value, suffix, prefix = "", delay = 0, isInView }: AnimatedNumberProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const rafIdRef = useRef<number | null>(null);
    const hasAnimated = useRef(false);

    // Determine if value has decimals
    const decimalPlaces = useMemo(() => {
      const str = value.toString();
      const decimalIndex = str.indexOf(".");
      return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
    }, [value]);

    useEffect(() => {
      if (isInView && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTime: number;
        const duration = 2000;
        const delayMs = delay * 1000;

        const startAnimation = () => {
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = easeOutQuart * value;

            // Format based on decimal places
            if (decimalPlaces > 0) {
              setDisplayValue(parseFloat(currentValue.toFixed(decimalPlaces)));
            } else {
              setDisplayValue(Math.round(currentValue));
            }

            if (progress < 1) {
              rafIdRef.current = requestAnimationFrame(animate);
            }
          };

          rafIdRef.current = requestAnimationFrame(animate);
        };

        const timer = setTimeout(startAnimation, delayMs);

        return () => {
          clearTimeout(timer);
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
        };
      }
    }, [isInView, value, delay, decimalPlaces]);

    // Format display value
    const formattedValue = useMemo(() => {
      if (decimalPlaces > 0) {
        return displayValue.toFixed(decimalPlaces);
      }
      return displayValue.toString();
    }, [displayValue, decimalPlaces]);

    return (
      <span className="tabular-nums font-black">
        {prefix}
        {formattedValue}
        {suffix}
      </span>
    );
  }
);

AnimatedNumber.displayName = "AnimatedNumber";

// ============================================
// STAT ITEM COMPONENT
// ============================================

interface StatItemComponentProps {
  stat: StatItem;
  index: number;
  isInView: boolean;
  accentColor: string;
}

const StatItemComponent = memo(
  ({ stat, index, isInView, accentColor }: StatItemComponentProps) => {
    const Icon = stat.icon;

    // Memoize styles
    const iconStyle = useMemo(() => ({ color: accentColor }), [accentColor]);
    const animateState = isInView ? ANIMATE_VISIBLE : ANIMATE_EMPTY;
    const transition = useMemo(
      () => ({ ...TRANSITION_STAGGER_BASE, delay: index * 0.1 }),
      [index]
    );

    return (
      <motion.div
        initial={INITIAL_FADE_UP_20}
        animate={animateState}
        transition={transition}
        className="flex items-center gap-3 px-4 py-2 md:px-6 md:py-3"
      >
        <div
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10"
          style={iconStyle}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xl md:text-2xl lg:text-3xl text-white leading-none">
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              delay={0.2 + index * 0.1}
              isInView={isInView}
            />
          </span>
          <span className="text-xs md:text-sm text-white/70 whitespace-nowrap">
            {stat.label}
          </span>
        </div>
      </motion.div>
    );
  }
);

StatItemComponent.displayName = "StatItemComponent";

// ============================================
// SOCIAL PROOF BAR COMPONENT
// ============================================

interface SocialProofBarProps {
  service: Service;
  className?: string;
}

const SocialProofBar = memo(({ service, className }: SocialProofBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, IN_VIEW_OPTIONS);

  // Get stats based on service slug, fallback to default
  const stats = useMemo(() => {
    return SERVICE_STATS[service.slug] || DEFAULT_STATS;
  }, [service.slug]);

  // Memoize background style with service accent color
  const backgroundStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, ${service.bgColor.replace(
        "0.15",
        "0.3"
      )} 50%, rgba(0, 0, 0, 0.95) 100%)`,
    }),
    [service.bgColor]
  );

  // Memoize border style
  const borderStyle = useMemo(
    () => ({
      borderColor: `${service.accentColor}30`,
    }),
    [service.accentColor]
  );

  return (
    <div
      ref={barRef}
      className={cn(
        "relative w-full overflow-hidden border-y",
        className
      )}
      style={borderStyle}
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0" style={backgroundStyle} />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10">
        {/* Desktop: Static display */}
        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-6 py-4 md:py-6">
          {stats.map((stat, index) => (
            <StatItemComponent
              key={`${stat.label}-${index}`}
              stat={stat}
              index={index}
              isInView={isInView}
              accentColor={service.accentColor}
            />
          ))}
        </div>

        {/* Mobile: Scrolling marquee */}
        <div className="md:hidden py-4 overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={
              isInView
                ? {
                    x: ["0%", "-50%"],
                  }
                : {}
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate stats for seamless loop */}
            {[...stats, ...stats].map((stat, index) => (
              <StatItemComponent
                key={`mobile-${stat.label}-${index}`}
                stat={stat}
                index={index % stats.length}
                isInView={isInView}
                accentColor={service.accentColor}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-20 md:hidden"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20 md:hidden"
        aria-hidden="true"
      />
    </div>
  );
});

SocialProofBar.displayName = "SocialProofBar";

export default SocialProofBar;
