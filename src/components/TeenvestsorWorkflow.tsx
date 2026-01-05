"use client";

import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useRef, useMemo, memo } from "react";

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

interface TeenvestsorWorkflowProps {
  brandStory?: BrandStory;
  brandIdentity?: BrandIdentity;
  clientName?: string;
}

interface WorkflowStep {
  number: string;
  label: string;
  title: string;
  subtitle: string;
  challenge: string;
  approach: string;
  bullets: string[];
}

// Teenvestsor specific workflow steps
const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    label: "השלב הראשון",
    title: "מחקר",
    subtitle: "להבין קהל יעד כפול",
    challenge: "Teenvestsor הגיעו אלינו עם אתגר ייחודי: לדבר בו-זמנית לשני קהלים שונים לחלוטין - בני נוער שצריכים להתלהב מהתוכן, והורים שצריכים להוציא את כרטיס האשראי. איך יוצרים דף שמרגיש מגניב לנוער אבל גם אמין ומקצועי להורים?",
    approach: "התחלנו בהבנה עמוקה של שני הצדדים. חקרנו מה מושך בני נוער - אסתטיקה מודרנית, טכנולוגית ואנרגטית. במקביל, הבנו שהורים מחפשים ערך מוכח, מרצים מוכרים ותחושת רצינות. המפתח היה למצוא את השפה הוויזואלית שמדברת לשניהם.",
    bullets: [
      "מחקר קהל יעד כפול - נוער והורים",
      "ניתוח מתחרים בתחום החינוך הפיננסי",
      "הגדרת נקודות כאב ומניעי רכישה",
      "מיפוי מסע משתמש מהורה לרכישה"
    ]
  },
  {
    number: "02",
    label: "השלב השני",
    title: "אסטרטגיה",
    subtitle: "מסרים שמדברים לשני הצדדים",
    challenge: "חינוך פיננסי לנוער הוא תחום חדש בישראל. היינו צריכים לשכנע הורים שזו השקעה משתלמת ולא 'עוד קורס אינטרנטי'. במקביל, רצינו שהנוער ירגיש שזה משהו שהם רוצים לעשות - לא שההורים מכריחים אותם.",
    approach: "בנינו אסטרטגיית מסרים בשכבות: הוויזואליה הצעירה והאנרגטית מושכת את הנוער, בזמן שהתוכן והמרצים המוכרים בונים אמון אצל ההורים. הדגשנו את המרצים כיתרון תחרותי - משפיענים מוכרים עם מיליוני צפיות.",
    bullets: [
      "פיתוח מסרים מותאמים לנוער והורים",
      "בניית סיפור סביב עצמאות פיננסית",
      "הדגשת המרצים כיתרון תחרותי",
      "יצירת תחושת דחיפות עם מבצע מוגבל"
    ]
  },
  {
    number: "03",
    label: "השלב השלישי",
    title: "עיצוב",
    subtitle: "צעיר, טכנולוגי ואמין",
    challenge: "האתגר העיצובי היה ליצור שפה ויזואלית שמרגישה מודרנית וטכנולוגית כמו אפליקציות פינטק, אבל גם חמה ואמינה. רצינו שהדף ייראה כמו משהו שנוער ישראלי היה בוחר לבקר בו - לא כמו עוד אתר משעמם של קורס אונליין.",
    approach: "בחרנו בגרדיאנטים סגולים-כחולים אנרגטיים שמשדרים טכנולוגיה וחדשנות. הוספנו אנימציות דינמיות, כרטיסי מרצים אטרקטיביים עם תמונות אמיתיות של משפיענים מוכרים, וטיימר ספירה לאחור שיוצר דחיפות. כל אלמנט עוצב לדחוף להמרה.",
    bullets: [
      "פלטת צבעים דינמית עם גרדיאנטים",
      "עיצוב כרטיסי מרצים אטרקטיבי",
      "אנימציות ואפקטים ויזואליים",
      "עיצוב רספונסיבי מושלם למובייל"
    ]
  },
  {
    number: "04",
    label: "השלב הרביעי",
    title: "פיתוח",
    subtitle: "מהיר, מותאם ומתמיר",
    challenge: "78% מהתנועה מגיעה מהמובייל - בני נוער גולשים מהטלפון. היה קריטי שהדף יעבוד מושלם על מסכים קטנים, עם זמני טעינה מהירים ואינטראקציות חלקות. כל שנייה של עיכוב = נטישה.",
    approach: "פיתחנו דף נחיתה מותאם מובייל-first עם דגש על מהירות. שילבנו טופס הרשמה פשוט, אינטגרציה ישירה לוואטסאפ לתקשורת מהירה, וטיימר ספירה לאחור שיוצר תחושת דחיפות. כל האנימציות אופטימזו לביצועים.",
    bullets: [
      "טופס הרשמה פשוט ומהיר",
      "אינטגרציית וואטסאפ לתקשורת מהירה",
      "טיימר ספירה לאחור למבצע",
      "אופטימיזציה למהירות ו-SEO"
    ]
  }
];

// Brand Identity Showcase Component - Teenvestsor themed
// Memoized to prevent unnecessary re-renders when parent re-renders
const BrandIdentityShowcase = memo(function BrandIdentityShowcase({ brandIdentity }: { brandIdentity: BrandIdentity }) {
  const ref = useRef<HTMLDivElement>(null);
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
      <h4 className="text-2xl md:text-3xl font-display font-bold mb-3 text-white">
        הזהות שיצרנו
      </h4>
      <p className="text-base text-white/60 mb-10 max-w-md">
        האלמנטים המרכזיים שמרכיבים את השפה הוויזואלית של Teenvestsor
      </p>

      <div className="space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3 text-purple-400">
            הלוגו
          </p>
          <p className="text-base leading-relaxed text-white/80">
            {brandIdentity.logo.description}
          </p>
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4 text-purple-400">
            טיפוגרפיה
          </p>
          <div className="flex flex-wrap gap-3">
            {brandIdentity.typography.fonts.map((font, i) => (
              <span
                key={i}
                className="text-sm px-4 py-2 rounded-full font-medium bg-purple-500/20 text-purple-300"
              >
                {font.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4 text-purple-400">
            פלטת צבעים
          </p>
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
                  className="w-8 h-8 rounded-lg shadow-sm ring-1 ring-white/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-white/70">{color.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

// Individual Step Section
interface StepSectionProps {
  step: WorkflowStep;
  index: number;
  brandIdentity?: BrandIdentity;
}

// Memoized to prevent unnecessary re-renders when parent re-renders
const StepSection = memo(function StepSection({ step, index, brandIdentity }: StepSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Memoize computed value to prevent recalculation on every render
  const isDesignStep = useMemo(() => index === 2, [index]); // Design step shows brand identity

  // Parallax effect for background number
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Memoize transform config to prevent recreation
  const numberY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const smoothNumberY = useSpring(numberY, { stiffness: 80, damping: 25 });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-28 md:py-36 relative overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Gradient background accent */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${index % 2 === 0 ? 'top right' : 'bottom left'}, rgba(124, 58, 237, 0.3) 0%, transparent 60%)`
        }}
      />

      {/* HUGE Background Number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: smoothNumberY }}
      >
        <span
          className="font-display font-black text-[50vh] md:text-[65vh] lg:text-[80vh] leading-none"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {step.number}
        </span>
      </motion.div>

      <div ref={ref} className="container mx-auto px-6 md:px-12 relative z-10" dir="rtl">
        {/* Two-column layout for Design step */}
        {isDesignStep && brandIdentity ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Main content */}
            <div className="order-1 lg:order-1">
              {/* Step Label */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-purple-400">
                  {step.label}
                </span>
              </motion.div>

              {/* Title */}
              <div className="overflow-hidden mb-6">
                <motion.h3
                  initial={{ y: "100%" }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-[-0.02em] text-white"
                >
                  {step.title}
                </motion.h3>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl font-semibold mb-10 text-cyan-400"
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
                <p className="text-lg md:text-xl font-heebo leading-relaxed text-white/90">
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
                <p className="text-base md:text-lg font-heebo leading-relaxed text-white/70">
                  {step.approach}
                </p>
              </motion.div>

              {/* Bullets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4 text-purple-400/70">
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
                      <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform bg-cyan-400" />
                      <span className="text-base md:text-lg font-heebo text-white/80 group-hover:text-white transition-colors leading-relaxed">
                        {bullet}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Brand Identity */}
            <div className="order-2 lg:order-2">
              <BrandIdentityShowcase brandIdentity={brandIdentity} />
            </div>
          </div>
        ) : (
          /* Regular single-column layout */
          <div className="max-w-3xl mr-0 ml-auto">
            {/* Step Label */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-purple-400">
                {step.label}
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden mb-6">
              <motion.h3
                initial={{ y: "100%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-[-0.02em] text-white"
              >
                {step.title}
              </motion.h3>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold mb-10 text-cyan-400"
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
              <p className="text-lg md:text-xl font-heebo leading-relaxed text-white/90">
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
              <p className="text-base md:text-lg font-heebo leading-relaxed text-white/70">
                {step.approach}
              </p>
            </motion.div>

            {/* Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4 text-purple-400/70">
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
                    <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform bg-cyan-400" />
                    <span className="text-base md:text-lg font-heebo text-white/80 group-hover:text-white transition-colors leading-relaxed">
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
});

// Main workflow component
const TeenvestsorWorkflow = ({
  brandStory,
  brandIdentity,
  clientName = "Teenvestsor"
}: TeenvestsorWorkflowProps) => {
  const introRef = useRef<HTMLElement>(null);
  const isIntroInView = useInView(introRef, { once: true });

  // Memoize workflow steps to prevent recreation on every render
  // Note: workflowSteps is already defined outside component, but we ensure stable reference
  const memoizedSteps = useMemo(() => workflowSteps, []);

  return (
    <div className="relative">
      {/* ========== INTRO SECTION (sticky) ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#0f172a', zIndex: 0 }}>
        <section
          ref={introRef}
          className="min-h-screen flex items-center justify-center overflow-hidden py-20 relative"
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
                           radial-gradient(ellipse at bottom right, rgba(37, 99, 235, 0.2) 0%, transparent 50%)`
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
                className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium mb-10 text-purple-400"
              >
                המסע שלנו יחד
              </motion.span>

              {/* Title */}
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={isIntroInView ? { y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-[-0.02em] mb-8 text-white"
                >
                  איך יצרנו את
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    דף הנחיתה ל-Teenvestsor
                  </span>
                </motion.h2>
              </div>

              {/* Narrative */}
              {brandStory && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg md:text-xl font-heebo leading-relaxed text-white/70 max-w-2xl mx-auto mb-10"
                >
                  {brandStory.narrative}
                </motion.p>
              )}

              {/* Client Vision Quote */}
              {brandStory?.clientVision && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="relative max-w-xl mx-auto"
                >
                  <div className="absolute -top-4 -right-4 text-6xl text-purple-500/30 font-serif">"</div>
                  <p className="text-base md:text-lg italic text-white/60 leading-relaxed pr-6">
                    {brandStory.clientVision}
                  </p>
                </motion.blockquote>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      {/* ========== WORKFLOW STEPS ========== */}
      {memoizedSteps.map((step, index) => (
        <div
          key={step.number}
          className="sticky top-0"
          style={{ zIndex: (index + 1) * 10 }}
        >
          <StepSection
            step={step}
            index={index}
            brandIdentity={brandIdentity}
          />
        </div>
      ))}

      {/* ========== CONCLUSION SECTION ========== */}
      <div className="sticky top-0" style={{ zIndex: 30 }}>
        <section
          className="min-h-[60vh] flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
          }}
        >
          <div className="container mx-auto px-6 md:px-12 text-center" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6">
                והתוצאה?
              </h3>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
                דף נחיתה שממיר - מדבר לנוער בשפה שלהם, ובונה אמון אצל ההורים. חוויה דיגיטלית שהופכת מבקרים ללקוחות.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeenvestsorWorkflow;
