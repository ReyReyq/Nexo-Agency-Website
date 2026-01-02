"use client";

import { memo, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { type Service } from "@/data/services";

// ============================================
// TYPES
// ============================================

interface Testimonial {
  text: string;
  name: string;
  role: string;
  company: string;
  rating?: number;
}

// ============================================
// TESTIMONIAL DATA
// ============================================

const serviceTestimonials: Record<string, Testimonial[]> = {
  "web-development": [
    {
      text: "האתר החדש הגדיל לנו את הפניות ב-300%. הצוות הבין בדיוק מה אנחנו צריכים והתוצאה עלתה על כל הציפיות.",
      name: "יוסי כהן",
      role: 'מנכ"ל',
      company: "טכנולוגיות מתקדמות",
      rating: 5,
    },
    {
      text: "מקצועיות ברמה הגבוהה ביותר. האתר מהיר, יפה ומביא תוצאות. ההשקעה החזירה את עצמה תוך חודשיים.",
      name: "שירה לוי",
      role: 'סמנכ"ל שיווק',
      company: "StartUp Pro",
      rating: 5,
    },
    {
      text: "עבדנו עם הרבה חברות בעבר, אבל הרמה כאן היא משהו אחר לגמרי. תודה על השירות המדהים!",
      name: "אורי גולדברג",
      role: "מייסד",
      company: "TechVision",
      rating: 5,
    },
  ],
  ecommerce: [
    {
      text: "המכירות באונליין הכפילו את עצמן תוך חודשיים. החנות עובדת מצוין ומנוהלת בקלות.",
      name: "דני אברהם",
      role: "בעלים",
      company: "Fashion IL",
      rating: 5,
    },
    {
      text: "חנות מושלמת שעובדת 24/7. הלקוחות מרוצים מחווית הקנייה והמכירות רק עולות.",
      name: "מיכל ברק",
      role: "מנהלת מכירות",
      company: "Home & Style",
      rating: 5,
    },
    {
      text: "מעולם לא חשבתי שחנות אונליין יכולה להיות כל כך קלה לניהול. המערכת פשוט עובדת.",
      name: "רוני שמש",
      role: "יזם",
      company: "GadgetWorld",
      rating: 5,
    },
  ],
  branding: [
    {
      text: "המיתוג החדש שינה לנו את הפנים של העסק. לקוחות מגיבים בהתלהבות לזהות החדשה.",
      name: "אלון שפירא",
      role: "מייסד",
      company: "CreativeHub",
      rating: 5,
    },
    {
      text: "סוף סוף יש לנו זהות שאנחנו גאים בה. המיתוג מדויק ומשדר בדיוק את מה שרצינו.",
      name: "נועה פרץ",
      role: "בעלת עסק",
      company: "Beauty Lab",
      rating: 5,
    },
    {
      text: "תהליך המיתוג היה מקצועי ומעמיק. התוצאה - מותג שבאמת בולט בשוק תחרותי.",
      name: "גיל מזרחי",
      role: "מנהל שיווק",
      company: "FoodTech IL",
      rating: 5,
    },
  ],
  "ai-automation": [
    {
      text: "חיסכון של 20 שעות בשבוע הודות לאוטומציות. הצוות יכול סוף סוף להתמקד במה שחשוב.",
      name: "רון כץ",
      role: "COO",
      company: "LogiTech",
      rating: 5,
    },
    {
      text: "הבוט החכם משפר את שירות הלקוחות משמעותית. לקוחות מקבלים מענה מיידי 24/7.",
      name: "ליאור גולן",
      role: "מנהל לקוחות",
      company: "ServicePro",
      rating: 5,
    },
    {
      text: "לא האמנתי כמה AI יכול לשנות את העסק. האוטומציות חוסכות לנו זמן וכסף כל יום.",
      name: "יעל שרון",
      role: 'סמנכ"לית תפעול',
      company: "SmartOps",
      rating: 5,
    },
  ],
  "digital-marketing": [
    {
      text: "הקמפיינים הביאו לנו ROI שלא חלמנו עליו. כל שקל שהושקע חזר פי שלוש.",
      name: "עומר דוד",
      role: 'מנכ"ל',
      company: "GrowthCo",
      rating: 5,
    },
    {
      text: "ניהול מקצועי שמביא תוצאות. סוף סוף אנחנו רואים את ההשקעה בפרסום משתלמת.",
      name: "תמר יוסף",
      role: 'סמנכ"ל',
      company: "MarketLeader",
      rating: 5,
    },
    {
      text: "השיווק הדיגיטלי הפך להיות המנוע של העסק שלנו. תוצאות מדהימות כל חודש.",
      name: "איתי לב",
      role: "מנהל שיווק",
      company: "ScaleUp",
      rating: 5,
    },
  ],
  seo: [
    {
      text: "הגענו לעמוד הראשון בגוגל תוך 4 חודשים. התנועה האורגנית הכפילה את עצמה.",
      name: "משה דהן",
      role: "בעלים",
      company: "LocalBiz",
      rating: 5,
    },
    {
      text: "הקידום האורגני מביא לנו לידים איכותיים כל יום. ההשקעה הטובה ביותר שעשינו.",
      name: "רחל אבני",
      role: "מנהלת דיגיטל",
      company: "TravelPro",
      rating: 5,
    },
    {
      text: "מדירוג 50 לדירוג 3 במילות המפתח החשובות. תוצאות שמדברות בעד עצמן.",
      name: "אמיר נחום",
      role: 'מנכ"ל',
      company: "LegalTech",
      rating: 5,
    },
  ],
  "social-media": [
    {
      text: "המעורבות ברשתות החברתיות שלנו עלתה ב-200%. הקהילה גדלה כל יום.",
      name: "שני מלכה",
      role: "מנהלת מותג",
      company: "LifeStyle Brand",
      rating: 5,
    },
    {
      text: "ניהול מקצועי של הסושיאל שלנו. התוכן איכותי והתגובות מהקהל מדהימות.",
      name: "יונתן ברק",
      role: "בעלים",
      company: "FitnessPro",
      rating: 5,
    },
    {
      text: "הנוכחות שלנו ברשתות השתנתה מקצה לקצה. יותר עוקבים, יותר לקוחות.",
      name: "מירב כהן",
      role: "יזמית",
      company: "EcoLiving",
      rating: 5,
    },
  ],
  "ai-images": [
    {
      text: "תמונות AI באיכות שלא האמנתי שאפשרית. חסכנו אלפי שקלים על צילומים.",
      name: "דור לוי",
      role: "מנהל קריאייטיב",
      company: "DesignStudio",
      rating: 5,
    },
    {
      text: "הויז'ואלים שנוצרו הם בדיוק מה שחלמנו עליו. מהירות ואיכות יוצאת דופן.",
      name: "הילה גרין",
      role: "ארט דירקטורית",
      company: "AdAgency",
      rating: 5,
    },
    {
      text: "מהפכה בהפקת התוכן שלנו. תמונות מקצועיות בזמן שיא.",
      name: "עידן סער",
      role: "מנהל שיווק",
      company: "ProductCo",
      rating: 5,
    },
  ],
  strategy: [
    {
      text: "האסטרטגיה ששורטטה לנו שינתה את הכיוון של העסק. סוף סוף יש תוכנית ברורה.",
      name: "אורן וייס",
      role: 'מנכ"ל',
      company: "ConsultingPro",
      rating: 5,
    },
    {
      text: "הייעוץ האסטרטגי היה שווה כל שקל. קיבלנו כיוון ברור ותוצאות מדידות.",
      name: "דנה רוזנברג",
      role: "מייסדת",
      company: "StartupX",
      rating: 5,
    },
    {
      text: "מחקר השוק והאסטרטגיה עזרו לנו להבין בדיוק לאן לכוון את המאמצים.",
      name: "אלי קמחי",
      role: "בעלים",
      company: "RetailChain",
      rating: 5,
    },
  ],
  "app-development": [
    {
      text: "האפליקציה שלנו מדורגת 4.9 באפסטור. הפיתוח היה מקצועי מהתחלה ועד הסוף.",
      name: "נדב אשכנזי",
      role: "מייסד-שותף",
      company: "AppStartup",
      rating: 5,
    },
    {
      text: "אפליקציה שעובדת מושלם באנדרואיד ובאייפון. הלקוחות מרוצים ואנחנו עוד יותר.",
      name: "שרית מור",
      role: 'סמנכ"לית מוצר',
      company: "HealthTech",
      rating: 5,
    },
    {
      text: "מרעיון לאפליקציה עובדת תוך 3 חודשים. תהליך מסודר ומקצועי.",
      name: "גל פרידמן",
      role: "יזם",
      company: "DeliveryApp",
      rating: 5,
    },
  ],
  "custom-development": [
    {
      text: "המערכת המותאמת שפיתחו לנו חסכה לנו מיליונים. בדיוק מה שהיינו צריכים.",
      name: "אבי מנדל",
      role: "CTO",
      company: "EnterpriseCo",
      rating: 5,
    },
    {
      text: "ה-API שפותח לנו עובד מצוין כבר שנתיים. אמינות ויציבות יוצאי דופן.",
      name: "מיקי בן דוד",
      role: "מנהל טכנולוגיות",
      company: "FinTech IL",
      rating: 5,
    },
    {
      text: "הפתרון המותאם נתן לנו יתרון תחרותי משמעותי. השקעה שהחזירה את עצמה פי עשר.",
      name: "רונית שלום",
      role: 'מנכ"לית',
      company: "IndustrySolutions",
      rating: 5,
    },
  ],
};

// Default testimonials for services without specific ones
const defaultTestimonials: Testimonial[] = [
  {
    text: "השירות המקצועי והתוצאות המדהימות הפכו את שיתוף הפעולה לחוויה מצוינת.",
    name: "דוד ישראלי",
    role: "בעל עסק",
    company: "Business Pro",
    rating: 5,
  },
  {
    text: "מרגע הפגישה הראשונה הבנו שאנחנו בידיים טובות. התוצאות עלו על הציפיות.",
    name: "רינת אלון",
    role: "מנהלת",
    company: "ServiceCo",
    rating: 5,
  },
];

// ============================================
// ANIMATION CONSTANTS
// ============================================

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const CARD_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const HEADER_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

// ============================================
// SUB-COMPONENTS
// ============================================

interface StarRatingProps {
  rating: number;
  accentColor: string;
}

const StarRating = memo(({ rating, accentColor }: StarRatingProps) => {
  const stars = useMemo(() => Array.from({ length: rating }, (_, i) => i), [rating]);

  return (
    <div className="flex gap-1 mb-4">
      {stars.map((i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current"
          style={{ color: accentColor }}
        />
      ))}
    </div>
  );
});

StarRating.displayName = "StarRating";

interface TestimonialCardProps {
  testimonial: Testimonial;
  accentColor: string;
  bgColor: string;
  index: number;
}

const TestimonialCard = memo(
  ({ testimonial, accentColor, bgColor }: TestimonialCardProps) => {
    // Memoize styles
    const quoteIconStyle = useMemo(
      () => ({ color: accentColor }),
      [accentColor]
    );

    const quoteBgStyle = useMemo(
      () => ({ backgroundColor: bgColor }),
      [bgColor]
    );

    const companyStyle = useMemo(
      () => ({ color: accentColor }),
      [accentColor]
    );

    return (
      <motion.div
        variants={CARD_VARIANTS}
        className="relative group"
      >
        <div
          className="relative h-full p-6 md:p-8 rounded-2xl bg-background border border-border
                     shadow-sm hover:shadow-lg transition-all duration-300
                     hover:border-primary/30"
          dir="rtl"
        >
          {/* Quote Icon */}
          <div
            className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-full
                       flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
            style={quoteBgStyle}
          >
            <Quote className="w-5 h-5 md:w-6 md:h-6" style={quoteIconStyle} />
          </div>

          {/* Star Rating */}
          <StarRating rating={testimonial.rating || 5} accentColor={accentColor} />

          {/* Testimonial Text */}
          <p className="text-foreground text-base md:text-lg leading-relaxed mb-6 pr-0 pl-8 md:pl-12">
            "{testimonial.text}"
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {/* Avatar Placeholder */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: accentColor }}
            >
              {testimonial.name.charAt(0)}
            </div>

            <div className="flex-1 text-right">
              <div className="font-bold text-foreground text-base">
                {testimonial.name}
              </div>
              <div className="text-muted-foreground text-sm">
                {testimonial.role},{" "}
                <span className="font-medium" style={companyStyle}>
                  {testimonial.company}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

// ============================================
// MAIN COMPONENT
// ============================================

interface ServiceTestimonialsSectionProps {
  service: Service;
}

const ServiceTestimonialsSection = memo(
  ({ service }: ServiceTestimonialsSectionProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

    // Get testimonials for this service, with fallback to default
    const testimonials = useMemo(() => {
      const serviceSpecific = serviceTestimonials[service.slug];
      if (serviceSpecific && serviceSpecific.length > 0) {
        // Return up to 3 testimonials
        return serviceSpecific.slice(0, 3);
      }
      return defaultTestimonials;
    }, [service.slug]);

    // Memoize accent line style
    const accentLineStyle = useMemo(
      () => ({ backgroundColor: service.accentColor }),
      [service.accentColor]
    );

    return (
      <section
        ref={sectionRef}
        className="py-24 md:py-32 bg-muted/30 overflow-hidden"
        dir="rtl"
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={HEADER_VARIANTS}
            className="text-center mb-12 md:mb-16"
          >
            {/* Accent Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 80 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 mx-auto mb-6 rounded-full"
              style={accentLineStyle}
            />

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
              מה הלקוחות שלנו{" "}
              <span style={{ color: service.accentColor }}>אומרים</span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              לקוחות שכבר נהנים מ{service.name} משתפים את החוויה שלהם
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={CONTAINER_VARIANTS}
            className={`grid gap-6 md:gap-8 ${
              testimonials.length === 2
                ? "md:grid-cols-2 max-w-4xl mx-auto"
                : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
                accentColor={service.accentColor}
                bgColor={service.bgColor}
                index={index}
              />
            ))}
          </motion.div>

          {/* Trust Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: service.accentColor }}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                דירוג 5 כוכבים מלקוחות מרוצים
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
);

ServiceTestimonialsSection.displayName = "ServiceTestimonialsSection";

export default ServiceTestimonialsSection;
