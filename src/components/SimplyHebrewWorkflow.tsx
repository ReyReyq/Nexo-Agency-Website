"use client";

import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useRef } from "react";

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

interface SimplyHebrewWorkflowProps {
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

// SimplyHebrew specific workflow steps
const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    label: "השלב הראשון",
    title: "גילוי",
    subtitle: "להבין את הקהל והצורך",
    challenge: "SimplyHebrew הגיעו אלינו עם רעיון פשוט אך עוצמתי: לימוד עברית דרך אנשים אמיתיים, לא דרך אפליקציות. האתגר? להבין לעומק את קהל היעד - יהודים אמריקאים שרוצים ללמוד עברית אבל מתוסכלים מפתרונות קיימים.",
    approach: "התחלנו במחקר מעמיק של שוק לימוד השפות. ראיינו לומדי עברית פוטנציאליים, ניתחנו מתחרים, והבנו את הכאבים האמיתיים: אפליקציות לא מלמדות לדבר, חסר החיבור האנושי, ואין הקשר תרבותי.",
    bullets: [
      "מחקר מתחרים ומיפוי שוק לימוד השפות",
      "ראיונות עומק עם יהודים אמריקאים לומדי עברית",
      "ניתוח נקודות כאב בלמידה דיגיטלית",
      "הגדרת פרסונות משתמשים וצרכיהם"
    ]
  },
  {
    number: "02",
    label: "השלב השני",
    title: "אסטרטגיה",
    subtitle: "למצב את המותג כאלטרנטיבה אנושית",
    challenge: "איך משכנעים אנשים לשלם $159 לחודש כשיש אפליקציות חינמיות? הבנו שהמפתח הוא לא להתחרות במחיר, אלא להדגיש את מה שאפליקציות לא יכולות לספק: חיבור אנושי, תיקון בזמן אמת, והקשר תרבותי.",
    approach: "מיקמנו את SimplyHebrew כ'הדרך האנושית ללמוד עברית'. בנינו מסרים שמדגישים את המורים הישראלים האמיתיים, הקבוצות הקטנות, והגישה האישית. שיעור הניסיון ב-$5 הפך לכלי המרה מרכזי.",
    bullets: [
      "פיתוח מיצוב מותג וערכי ליבה",
      "בניית מסרים מותאמים לקהל היעד",
      "תכנון מסע משתמש ומשפך המרה",
      "הגדרת טון דיבור חם ומקצועי"
    ]
  },
  {
    number: "03",
    label: "השלב השלישי",
    title: "עיצוב",
    subtitle: "חמימות שמשדרת אמון",
    challenge: "האתגר העיצובי היה ליצור חוויה דיגיטלית שמרגישה אישית וחמה - לא קרה וטכנולוגית כמו רוב אתרי EdTech. רצינו שהגולש ירגיש שהוא מוזמן לקהילה, לא שמוכרים לו מוצר.",
    approach: "בחרנו בפלטת צבעים טבעית של ירוק כהה ושמנת חמה. השתמשנו בתמונות אותנטיות של מורים ותלמידים אמיתיים. כל אלמנט עוצב להעביר את התחושה של שיחה עם חבר ישראלי, לא של רכישה באינטרנט.",
    bullets: [
      "עיצוב לוגו וזהות חזותית מלאה",
      "בחירת פלטת צבעים טבעית וחמה",
      "עיצוב ממשק משתמש נקי ואינטואיטיבי",
      "יצירת אלמנטים גרפיים תומכי מותג"
    ]
  },
  {
    number: "04",
    label: "השלב הרביעי",
    title: "פיתוח",
    subtitle: "מהירות, אמינות וצמיחה",
    challenge: "הפכנו את העיצובים לאתר חי. היה חשוב לנו לא רק שייראה טוב, אלא שיעבוד מהר, יהיה נגיש לכולם, וישלב את כל הכלים שהעסק צריך כדי לצמוח.",
    approach: "פיתחנו אתר רספונסיבי מלא עם זמן טעינה מהיר. שילבנו מערכות תשלום, CRM לניהול לידים, ואנליטיקס מתקדם. כל טופס יצירת קשר עובר ישירות למערכת, מאפשר מעקב ותגובה מהירה.",
    bullets: [
      "פיתוח אתר מהיר ומותאם לנייד",
      "אינטגרציה עם מערכות תשלום ו-CRM",
      "אופטימיזציה למנועי חיפוש (SEO)",
      "הטמעת כלי מעקב והמרות"
    ]
  }
];

// Brand Identity Showcase Component
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
      <h4 className="text-2xl md:text-3xl font-display font-bold mb-3" style={{ color: '#1a5f4a' }}>
        הזהות שיצרנו
      </h4>
      <p className="text-base text-foreground/60 mb-10 max-w-md">
        האלמנטים המרכזיים שמרכיבים את השפה הוויזואלית של SimplyHebrew
      </p>

      <div className="space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-2xl bg-[#1a5f4a]/5 border border-[#1a5f4a]/10"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#1a5f4a' }}>
            הלוגו
          </p>
          <p className="text-base leading-relaxed text-foreground/80">
            {brandIdentity.logo.description}
          </p>
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 rounded-2xl bg-[#1a5f4a]/5 border border-[#1a5f4a]/10"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: '#1a5f4a' }}>
            טיפוגרפיה
          </p>
          <div className="flex flex-wrap gap-3">
            {brandIdentity.typography.fonts.map((font, i) => (
              <span
                key={i}
                className="text-sm px-4 py-2 rounded-full font-medium"
                style={{ backgroundColor: '#1a5f4a15', color: '#1a5f4a' }}
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
          className="p-6 rounded-2xl bg-[#1a5f4a]/5 border border-[#1a5f4a]/10"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: '#1a5f4a' }}>
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

// Individual Step Section
interface StepSectionProps {
  step: WorkflowStep;
  index: number;
  brandIdentity?: BrandIdentity;
}

const StepSection = ({ step, index, brandIdentity }: StepSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isDesignStep = index === 2; // Design step shows brand identity

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
      className="min-h-screen py-28 md:py-36 text-foreground relative overflow-hidden"
      style={{ backgroundColor: '#faf6f0' }}
    >
      {/* HUGE Background Number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: smoothNumberY }}
      >
        <span
          className="font-display font-black text-[50vh] md:text-[65vh] lg:text-[80vh] leading-none"
          style={{ color: '#1a5f4a', opacity: 0.03 }}
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
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-medium"
                  style={{ color: '#1a5f4a' }}
                >
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
                  style={{ color: '#2d3436' }}
                >
                  {step.title}
                </motion.h3>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl font-semibold mb-10"
                style={{ color: '#1a5f4a' }}
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
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#1a5f4a99' }}>
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
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"
                        style={{ backgroundColor: '#1a5f4a' }}
                      />
                      <span className="text-base md:text-lg font-heebo text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
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
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-medium"
                style={{ color: '#1a5f4a' }}
              >
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
                style={{ color: '#2d3436' }}
              >
                {step.title}
              </motion.h3>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold mb-10"
              style={{ color: '#1a5f4a' }}
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
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#1a5f4a99' }}>
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
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"
                      style={{ backgroundColor: '#1a5f4a' }}
                    />
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

// Main workflow component
const SimplyHebrewWorkflow = ({
  brandStory,
  brandIdentity,
  clientName = "SimplyHebrew"
}: SimplyHebrewWorkflowProps) => {
  const introRef = useRef(null);
  const isIntroInView = useInView(introRef, { once: true });

  return (
    <div className="relative">
      {/* ========== INTRO SECTION (sticky) ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#faf6f0', zIndex: 0 }}>
        <section
          ref={introRef}
          className="min-h-screen text-foreground flex items-center justify-center overflow-hidden py-20 relative"
        >
          {/* Subtle gradient accent */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 0%, #1a5f4a 100%)`
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
                className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium mb-10"
                style={{ color: '#1a5f4a' }}
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
                  style={{ color: '#2d3436' }}
                >
                  איך בנינו את
                  <br />
                  <span style={{ color: '#1a5f4a' }}>{clientName}</span>
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
                  <p className="text-sm mt-6 font-medium" style={{ color: '#1a5f4a' }}>
                    — {clientName}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      {/* ========== STEP 1: גילוי ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#faf6f0', zIndex: 10 }}>
        <StepSection step={workflowSteps[0]} index={0} />
      </div>

      {/* ========== STEP 2: אסטרטגיה ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#faf6f0', zIndex: 20 }}>
        <StepSection step={workflowSteps[1]} index={1} />
      </div>

      {/* ========== STEP 3: עיצוב - includes Brand Identity ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#faf6f0', zIndex: 30 }}>
        <StepSection step={workflowSteps[2]} index={2} brandIdentity={brandIdentity} />
      </div>

      {/* ========== STEP 4: פיתוח ========== */}
      <div className="sticky top-0" style={{ backgroundColor: '#faf6f0', zIndex: 40 }}>
        <StepSection step={workflowSteps[3]} index={3} />
      </div>

      {/* ========== CONCLUSION SECTION ========== */}
      <div className="relative" style={{ backgroundColor: '#1a5f4a', zIndex: 50 }}>
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
                פלטפורמה ללימוד עברית שמחברת אנשים אמיתיים - חוויה דיגיטלית חמה שמשדרת את הערך האנושי בכל נקודת מגע
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SimplyHebrewWorkflow;
