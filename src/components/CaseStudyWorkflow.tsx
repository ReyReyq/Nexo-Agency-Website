"use client";

import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useRef, useState, useMemo, useCallback } from "react";

// Type definitions
interface BrandIdentityColor {
  name: string;
  hex: string;
  usage: string;
}

interface BrandIdentityFont {
  name: string;
  usage: string;
}

interface BrandIdentity {
  logo: {
    description: string;
    rationale: string;
  };
  colorPalette: {
    description: string;
    colors: BrandIdentityColor[];
  };
  typography: {
    description: string;
    fonts: BrandIdentityFont[];
  };
  visualLanguage: string;
}

interface BrandStory {
  title: string;
  narrative: string;
  clientVision: string;
}

interface AIModelsData {
  title: string;
  description: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

interface CaseStudyWorkflowProps {
  brandStory?: BrandStory;
  brandIdentity?: BrandIdentity;
  clientName?: string;
  aiModels?: AIModelsData;
}

interface WorkflowStep {
  number: string;
  label: string;
  title: string;
  subtitle: string;
  challenge: string;
  approach: string;
  bullets: string[];
  visual: "discovery" | "strategy" | "design" | "development" | "launch";
}

// Enhanced workflow step data with substantial content
const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    label: "השלב הראשון",
    title: "גילוי",
    subtitle: "להבין את החזון שלכם",
    challenge: "SIONÉ הגיעו אלינו עם חזון ברור: ליצור נוכחות דיגיטלית שתלכוד את אסתטיקת ה-\"Old Money\" תוך שמירה על חוויית קנייה נגישה ופשוטה. האתגר? לתרגם ערכי מותג של יוקרה שקטה לחוויה דיגיטלית אותנטית.",
    approach: "התחלנו בפגישות עומק עם המייסדים להבין לא רק מה הם רוצים לבנות, אלא למה זה חשוב לקהל היעד שלהם. גילינו שהלקוח האידיאלי מעריך איכות על פני כמות, מורשת על פני טרנדים, ואלגנטיות שקטה על פני הצגה ראוותנית.",
    bullets: [
      "ניתוח מעמיק של קהל היעד והעדפות הסגנון שלהם",
      "מחקר מותגי יוקרה מובילים בשוק הבינלאומי",
      "סדנת מיצוב מותג להגדרת עמודי התווך של SIONÉ",
      "יצירת פרופיל לקוח אידיאלי (ICP) מפורט",
    ],
    visual: "discovery",
  },
  {
    number: "02",
    label: "השלב השני",
    title: "אסטרטגיה",
    subtitle: "התוכנית לניצחון",
    challenge: "עם התובנות מהמחקר, הבנו שהתשתית הטכנית חייבת לתמוך בצמיחה מהירה בלי להתפשר על איכות. גם הבנו שקהל היעד מבקר בעשרות אתרי יוקרה - הם יזהו מיד חוויה בינונית.",
    approach: "בנינו תוכנית פעולה תלת-שלבית: ארכיטקטורת חוויה שממפה את מסע הלקוח, בסיס טכני שיכול לגדול מ-100 ל-10,000 מוצרים, ואסטרטגיית תוכן שמספרת את סיפור המותג בכל נקודת מגע.",
    bullets: [
      "מיפוי מסע לקוח מלא: מגילוי ועד לאחר רכישה",
      "תכנון ארכיטקטורת Shopify מודולרית להרחבה עתידית",
      "הגדרת KPIs ברורים: המרה, זמן שהייה, שיעור חזרה",
      "אסטרטגיית תוכן לשיווק דיגיטלי ורשתות חברתיות",
    ],
    visual: "strategy",
  },
  {
    number: "03",
    label: "השלב השלישי",
    title: "עיצוב",
    subtitle: "להפוך חזון למציאות ויזואלית",
    challenge: "כאן הקסם קורה. כל החלטה עיצובית שירתה מטרה אחת: לתקשר יוקרה, איכות ונגישות - בלי יומרנות. בדקנו שלושה כיוונים ויזואליים שונים לפני שבחרנו את הסופי.",
    approach: "השפה הויזואלית הסופית שואלת מעיצוב עיתונאי-עריכתי: קווים נקיים, מרחב לבן נדיב וטיפוגרפיה בטוחה. הימנענו במכוון מהמלכודת הנפוצה של מותגי יוקרה - עיצוב יתר. במקום זה, נתנו למוצרים ולקול המותג לזרוח.",
    bullets: [
      "לוגו טיפוגרפי קלאסי עם נגיעה צרפתית-איטלקית",
      "פלטת צבעים של שחור אוניקס, זהב טוסקני וקרם פשתן",
      "עיצוב UX אינטואיטיבי עם דגש על נגישות מובייל",
      "כיוון אמנותי לצילום: אסתטיקת ריוויירה ים-תיכונית",
    ],
    visual: "design",
  },
  {
    number: "05",
    label: "השלב החמישי",
    title: "פיתוח",
    subtitle: "בנייה ללא פשרות",
    challenge: "הפכנו את העיצובים לחנות חיה ונושמת. אבל זה לא רק על פיקסלים מושלמים - זה על יצירת מערכת שתגדל עם המותג. גילינו שהגישה הטכנית הראשונית לא תתמוך בסינון מוצרים יעיל, אז שינינו כיוון.",
    approach: "עברנו לארכיטקטורה מבוססת קומפוננטות שמאפשרת ל-SIONÉ להוסיף פיצ'רים בלי להמתין להנדסה. כל אינטראקציה אופטימזית לזמן תגובה של פחות מ-200ms - כי משתמשי יוקרה מצפים למהירות כחלק מהחוויה.",
    bullets: [
      "פיתוח Shopify מותאם אישית עם תמה ייעודית",
      "אופטימיזציה למובייל עם זמן טעינה מתחת ל-2.5 שניות",
      "אינטגרציית תשלומים מאובטחת (כרטיסי אשראי, Apple Pay)",
      "מערכת ניהול מלאי אוטומטית וסינכרון עם ספקים",
    ],
    visual: "development",
  },
  {
    number: "06",
    label: "השלב השישי",
    title: "השקה",
    subtitle: "רק ההתחלה של המסע",
    challenge: "ההשקה היא לא סוף הדרך - היא רק ההתחלה. SIONÉ יצאו לאוויר עם בסיס איתן, אבל העבודה האמיתית - להוכיח את הקונספט - התחילה ביום הראשון.",
    approach: "בשבוע הראשון ניטרנו הכל: שיעורי המרה, משוב לקוחות, מדדי ביצועים ודפוסי התנהגות. שינויים קטנים שצמחו מהנתונים הביאו לתוצאות משמעותיות. אנחנו לא מתייחסים ל-SIONÉ כפרויקט \"גמור\" - אלא כמותג שרק התחיל.",
    bullets: [
      "השקה חלקה ללא תקלות טכניות",
      "חוויית משתמש אופטימלית מיום הראשון",
      "הדרכת הלקוח לניהול עצמאי של החנות והתוכן",
      "שותפות מתמשכת עם תמיכה ופיתוח נוסף",
    ],
    visual: "launch",
  },
];

// Compact Brand Identity Section - positioned on the LEFT side in Design step
const BrandIdentityShowcase = ({ brandIdentity }: { brandIdentity: BrandIdentity }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="h-full flex flex-col justify-center"
      dir="rtl"
    >
      <h4 className="text-2xl md:text-3xl font-display font-bold mb-3 text-primary">
        חלק מהזהות שיצרנו
      </h4>
      <p className="text-base text-foreground/60 mb-10 max-w-md">
        כמה מהאלמנטים המרכזיים שמרכיבים את השפה הויזואלית של SIONÉ
      </p>

      {/* Vertical stacked layout for left column */}
      <div className="space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-3">הלוגו</p>
          <p className="text-base leading-relaxed text-foreground/80">
            {brandIdentity.logo.description}
          </p>
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-4">טיפוגרפיה</p>
          <div className="flex flex-wrap gap-3">
            {brandIdentity.typography.fonts.map((font, i) => (
              <span key={i} className="text-sm px-4 py-2 rounded-full bg-primary/10 text-foreground/80 font-medium">
                {font.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Colors - larger swatches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05]"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-4">פלטת צבעים</p>
          <div className="grid grid-cols-2 gap-4">
            {brandIdentity.colorPalette.colors.map((color, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-sm ring-1 ring-foreground/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-foreground/70">{color.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// AI Photography Step Section - Step 04 with vertical marquee
interface AIPhotographySectionProps {
  aiModels: AIModelsData;
}

const AIPhotographySection = ({ aiModels }: AIPhotographySectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parallax effect for background number
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const numberY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const smoothNumberY = useSpring(numberY, { stiffness: 80, damping: 25 });

  // Memoize duplicated image arrays to avoid recreation on every render
  const duplicatedImages = useMemo(
    () => [...aiModels.images, ...aiModels.images, ...aiModels.images, ...aiModels.images],
    [aiModels.images]
  );
  const duplicatedImagesReversed = useMemo(
    () => [...duplicatedImages].reverse(),
    [duplicatedImages]
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-28 md:py-36 bg-[#FAF9F6] text-foreground relative overflow-hidden"
    >
      {/* HUGE Background Number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: smoothNumberY }}
      >
        <span
          className="font-display font-black text-[50vh] md:text-[65vh] lg:text-[80vh] leading-none text-foreground"
          style={{ opacity: 0.025 }}
        >
          04
        </span>
      </motion.div>

      <div ref={ref} className="container mx-auto px-6 md:px-12 relative z-10" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content - Right side (RTL) */}
          <div className="order-1 lg:order-1">
            {/* Step Label */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-primary">
                השלב הרביעי
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden mb-6">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.85] tracking-[-0.02em]"
              >
                צילומי AI
              </motion.h3>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold mb-10 text-primary"
            >
              גישה חדשנית להפקת תוכן
            </motion.p>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-lg md:text-xl font-heebo leading-relaxed text-foreground/90">
                {aiModels.description}
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary/70 mb-4">
                היתרונות
              </p>
              <ul className="space-y-4">
                {[
                  "חיסכון משמעותי בעלויות צילום סטודיו",
                  "זמן הפקה מהיר יותר - מרעיון לתוצר תוך שעות",
                  "גמישות יצירתית ללא הגבלות לוקיישן",
                  "עקביות מושלמת באסתטיקה לאורך כל המותג",
                ].map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-4 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-base md:text-lg font-heebo text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Vertical Marquee Images - Left side (RTL) */}
          <div className="order-2 lg:order-2 relative h-[450px] md:h-[550px]">
            {/* Gradient Overlays */}
            <div
              className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, #FAF9F6, transparent)' }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #FAF9F6, transparent)' }}
            />

            {/* Marquee Container */}
            <div className="flex gap-4 md:gap-5 h-full justify-center overflow-hidden">
              {/* First Column - Moving Up */}
              <motion.div
                className="flex flex-col gap-4 md:gap-5"
                animate={{ y: [0, -500] }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 18,
                    ease: "linear",
                  },
                }}
              >
                {/* Duplicate images for seamless loop */}
                {duplicatedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden rounded-xl flex-shrink-0 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-44 md:w-52 h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.6), transparent)' }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Second Column - Moving Down */}
              <motion.div
                className="flex flex-col gap-4 md:gap-5"
                animate={{ y: [-500, 0] }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 22,
                    ease: "linear",
                  },
                }}
              >
                {/* Duplicate images for seamless loop - reversed order */}
                {duplicatedImagesReversed.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden rounded-xl flex-shrink-0 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-44 md:w-52 h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.6), transparent)' }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Individual Step Section - Editorial magazine style with HUGE background numbers
interface StepSectionProps {
  step: WorkflowStep;
  index: number;
  brandIdentity?: BrandIdentity;
}

const StepSection = ({ step, index, brandIdentity }: StepSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isDesignStep = index === 2;

  // Parallax effect for background number
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const numberY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const smoothNumberY = useSpring(numberY, { stiffness: 80, damping: 25 });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-28 md:py-36 bg-[#FAF9F6] text-foreground relative overflow-hidden"
    >
      {/* HUGE Background Number - Editorial style - positioned behind everything */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: smoothNumberY }}
      >
        <span
          className="font-display font-black text-[50vh] md:text-[65vh] lg:text-[80vh] leading-none text-foreground"
          style={{ opacity: 0.025 }}
        >
          {step.number}
        </span>
      </motion.div>

      <div ref={ref} className="container mx-auto px-6 md:px-12 relative z-10" dir="rtl">
        {/* Two-column layout for Design step with brand identity */}
        {isDesignStep && brandIdentity ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Main content on the RIGHT side (RTL) */}
            <div className="order-1 lg:order-1">
              {/* Step Label */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-primary">
                  {step.label}
                </span>
              </motion.div>

              {/* Title */}
              <div className="overflow-hidden mb-6">
                <motion.h3
                  initial={{ y: "100%" }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-[-0.02em]"
                >
                  {step.title}
                </motion.h3>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl font-semibold mb-10 text-primary"
              >
                {step.subtitle}
              </motion.p>

              {/* Challenge paragraph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-lg md:text-xl font-heebo leading-relaxed text-foreground/90">
                  {step.challenge}
                </p>
              </motion.div>

              {/* Approach paragraph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <p className="text-base md:text-lg font-heebo leading-relaxed text-foreground/70">
                  {step.approach}
                </p>
              </motion.div>

              {/* Bullets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary/70 mb-4">
                  מה עשינו
                </p>
                <ul className="space-y-4">
                  {step.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                      className="flex items-start gap-4 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-base md:text-lg font-heebo text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                        {bullet}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Brand Identity on the LEFT side visually (second column in RTL grid) */}
            <div className="order-2 lg:order-2">
              <BrandIdentityShowcase brandIdentity={brandIdentity} />
            </div>
          </div>
        ) : (
          /* Regular single-column layout for other steps */
          <div className="max-w-3xl mr-0 ml-auto">
            {/* Step Label */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-primary">
                {step.label}
              </span>
            </motion.div>

            {/* Title - Much larger */}
            <div className="overflow-hidden mb-6">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-[-0.02em]"
              >
                {step.title}
              </motion.h3>
            </div>

            {/* Subtitle - Larger and bolder */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold mb-10 text-primary"
            >
              {step.subtitle}
            </motion.p>

            {/* Challenge paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-lg md:text-xl font-heebo leading-relaxed text-foreground/90">
                {step.challenge}
              </p>
            </motion.div>

            {/* Approach paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <p className="text-base md:text-lg font-heebo leading-relaxed text-foreground/70">
                {step.approach}
              </p>
            </motion.div>

            {/* Bullets - Simple typographic list without icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary/70 mb-4">
                מה עשינו
              </p>
              <ul className="space-y-4">
                {step.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                    className="flex items-start gap-4 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-base md:text-lg font-heebo text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

// Website Preview Section - Shows the full homepage in a browser mockup with independent scroll
const WebsitePreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollActive, setIsScrollActive] = useState(false);

  // Handle click to activate scroll mode - memoized to prevent recreation
  const handleActivateScroll = useCallback(() => {
    setIsScrollActive(true);
    // Focus the scroll container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus();
    }
  }, []);

  // Handle mouse leave to deactivate scroll mode - memoized to prevent recreation
  const handleDeactivateScroll = useCallback(() => {
    setIsScrollActive(false);
  }, []);

  // Prevent main page scroll when scrolling inside the preview - memoized with isScrollActive dependency
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isScrollActive && scrollContainerRef.current) {
      e.stopPropagation();
      const container = scrollContainerRef.current;
      const isAtTop = container.scrollTop === 0;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;

      // Only prevent default if we're not at the edges, or if scrolling into the content
      if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        container.scrollTop += e.deltaY;
      }
    }
  }, [isScrollActive]);

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 bg-[#FAF9F6] text-foreground relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text Content - Right side (RTL) */}
          <div className="order-2 lg:order-1">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-primary">
                התוצאה הסופית
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden mb-5">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[0.9] tracking-[-0.02em] text-foreground"
              >
                האתר
                <br />
                <span className="text-primary">שיצרנו</span>
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg font-heebo leading-relaxed text-foreground/70 mb-6 max-w-md"
            >
              חנות Shopify יוקרתית שמשלבת אסתטיקת "Old Money" עם חוויית קנייה מודרנית ונוחה.
              כל פיקסל עוצב לשדר אלגנטיות שקטה.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <ul className="space-y-2.5">
                {[
                  "עיצוב רספונסיבי מושלם למובייל",
                  "מהירות טעינה מתחת ל-2.5 שניות",
                  "חוויית משתמש אינטואיטיבית",
                  "אסתטיקה של יוקרה שקטה"
                ].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3 text-foreground/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm font-heebo">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="https://sioneofficial.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-full font-bold text-base hover:bg-primary/90 transition-colors duration-300 group"
              >
                <span>בקרו באתר החי</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-[-4px] transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Browser Mockup with Full Page Screenshot - Left side (RTL) with independent scroll */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Browser Frame - LTR for proper browser UI */}
              <div
                className={`bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-300 ${
                  isScrollActive ? 'shadow-primary/20 ring-2 ring-primary/30' : 'shadow-black/20'
                }`}
                dir="ltr"
                onClick={handleActivateScroll}
                onMouseLeave={handleDeactivateScroll}
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#333] border-b border-white/5">
                  {/* Traffic Lights - on the left */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
                  </div>
                  {/* URL Bar - centered, LTR */}
                  <div className="flex-1 mx-4">
                    <div className="bg-[#1a1a1a] rounded-lg px-4 py-1.5 text-sm text-white/50 font-mono flex items-center justify-center gap-2">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      sioneofficial.com
                    </div>
                  </div>
                </div>

                {/* Website Screenshot Container - Independent scrollable, scrollbar on right */}
                <div
                  ref={scrollContainerRef}
                  tabIndex={0}
                  onWheel={handleWheel}
                  className={`relative h-[400px] md:h-[450px] overflow-y-auto outline-none cursor-grab ${
                    isScrollActive ? 'cursor-grabbing' : ''
                  }`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,255,255,0.2) transparent'
                  }}
                >
                  <img
                    src="/portfolio/sione/sione-fullpage.png"
                    alt="SIONÉ Website Full Homepage"
                    className="w-full pointer-events-none select-none"
                    draggable={false}
                  />

                  {/* Click to scroll indicator - shows when not active */}
                  {!isScrollActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-3 text-white">
                        <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </motion.div>
                        <span className="text-sm font-medium">לחצו לגלילה באתר</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main workflow component
const CaseStudyWorkflow = ({
  brandStory,
  brandIdentity,
  clientName = "SIONÉ",
  aiModels
}: CaseStudyWorkflowProps) => {
  const introRef = useRef(null);
  const isIntroInView = useInView(introRef, { once: true });

  return (
    <div className="relative">
      {/* ========== INTRO SECTION (sticky) ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 0 }}>
        <section
          ref={introRef}
          className="min-h-screen text-foreground flex items-center justify-center overflow-hidden py-20 relative"
        >
          {/* Subtle gradient accent */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 0%, hsl(var(--neon-pink)) 100%)`
            }}
          />

          <div className="container mx-auto px-6 md:px-12 text-center relative z-10" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={isIntroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium mb-10 text-primary"
              >
                המסע שלנו יחד
              </motion.span>

              {/* Title */}
              <div className="overflow-hidden mb-10">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={isIntroInView ? { y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.85] tracking-[-0.02em]"
                >
                  איך בנינו את
                  <br />
                  <span className="text-primary">{clientName}</span>
                </motion.h2>
              </div>

              {/* Brand Story Narrative */}
              {brandStory?.narrative && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg md:text-xl font-heebo max-w-2xl mx-auto leading-relaxed mb-14 text-foreground/70"
                >
                  {brandStory.narrative}
                </motion.p>
              )}

              {/* Client Quote */}
              {brandStory?.clientVision && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="inline-block"
                >
                  <blockquote className="text-lg md:text-xl font-heebo italic leading-relaxed text-foreground/80 max-w-xl mx-auto">
                    "{brandStory.clientVision}"
                  </blockquote>
                  <p className="text-sm mt-6 font-medium text-primary">
                    — {clientName}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      {/* ========== STEP 1: גילוי (Discovery) ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 10 }}>
        <StepSection step={workflowSteps[0]} index={0} />
      </div>

      {/* ========== STEP 2: אסטרטגיה (Strategy) ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 20 }}>
        <StepSection step={workflowSteps[1]} index={1} />
      </div>

      {/* ========== STEP 3: עיצוב (Design) - includes Brand Identity ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 30 }}>
        <StepSection step={workflowSteps[2]} index={2} brandIdentity={brandIdentity} />
      </div>

      {/* ========== STEP 4: צילומי AI (AI Photography) ========== */}
      {aiModels && (
        <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 40 }}>
          <AIPhotographySection aiModels={aiModels} />
        </div>
      )}

      {/* ========== STEP 5: פיתוח (Development) ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 50 }}>
        <StepSection step={workflowSteps[3]} index={3} />
      </div>

      {/* ========== STEP 6: השקה (Launch) ========== */}
      <div className="sticky top-0 bg-[#FAF9F6]" style={{ zIndex: 60 }}>
        <StepSection step={workflowSteps[4]} index={4} />
      </div>

      {/* ========== CONCLUSION SECTION ========== */}
      <div className="relative bg-primary" style={{ zIndex: 65 }}>
        <section className="py-28 md:py-36 text-white">
          <div className="container mx-auto px-6 md:px-12 text-center" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium mb-6 text-white/50">
                התוצאה
              </span>
              <h3 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-[-0.02em]">
                והתוצאה?
              </h3>
              <p className="text-xl md:text-2xl font-heebo max-w-xl mx-auto text-white/80 leading-relaxed">
                מותג יוקרה דיגיטלי שמדבר אל הג'נטלמן המודרני - חוויית קנייה מושלמת שמשקפת את ערכי היוקרה השקטה
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ========== WEBSITE PREVIEW SECTION ========== */}
      <div className="relative" style={{ zIndex: 70 }}>
        <WebsitePreviewSection />
      </div>
    </div>
  );
};

export default CaseStudyWorkflow;
