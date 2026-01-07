import { useState, useCallback, memo, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { ChevronDown } from "lucide-react";

// FAQ Categories (Tabs) - כללי first for RTL (appears on right)
const TABS = ["כללי", "תהליך העבודה", "מחירים וזמנים", "טכנולוגיה"];

// Questions organized by category
const QUESTIONS: Record<string, { question: string; answer: string }[]> = {
  "כללי": [
    {
      question: "למי שייך האתר והתוכן לאחר סיום העבודה?",
      answer: "האתר הוא 100% שלכם. בניגוד לפלטפורמות השכרה, אנו בונים נכס דיגיטלי ומעבירים אותו לבעלותכם המלאה עם סיום הפרויקט. קוד האתר, העיצוב והנתונים (כולל בסיס הנתונים של הלקוחות בחנות) שייכים לכם בלעדית, מה שמבטיח לכם עצמאות עסקית מלאה."
    },
    {
      question: "מה קורה אם אצטרך שינויים או עדכונים באתר בעתיד?",
      answer: "אנחנו לא נעלמים לאחר ההשקה. אנו מציעים חבילות שירות (\"בנק שעות\") או ריטיינר תחזוקה ללקוחות שרוצים ראש שקט, ודואגים לכל השינויים, העדכונים והתוספות הנדרשות באתר באופן שוטף ומקצועי."
    },
    {
      question: "מה מבדיל אתכם מסוכנויות אחרות בשוק?",
      answer: "השילוב בין מהירות, טכנולוגיה ובעלות. אנו משלבים כלי AI מתקדמים לייעול העסק, מתחייבים ללוחות זמנים קצרים (עד 3 שבועות לחנות!), והכי חשוב – משחררים אתכם ממודל ה\"חתונה הקתולית\". אצלנו אתם משלמים על הקמה ומקבלים נכס משלכם, לא שוכרים אותו חודשית."
    },
    {
      question: "האם יש אחריות על האתר לאחר העלייה לאוויר?",
      answer: "כן, אנו מעניקים תקופת אחריות של 3 חודשים על באגים ותקלות טכניות הקשורות לבנייה שלנו. המטרה שלנו היא שתצאו לדרך בביטחון מלא, בידיעה שהמערכת יציבה, נבדקה ועובדת בצורה חלקה."
    },
    {
      question: "האם אפשר לראות דוגמאות לאתרים שבניתם?",
      answer: "בוודאי. אנו גאים בתוצרים שלנו. נשמח לשלוח לכם קישורים לאתרים פעילים שבנינו, כדי שתוכלו להתרשם מרמת העיצוב, המהירות וחוויית המשתמש המוקפדת שאנו מספקים ללקוחותינו."
    },
  ],
  "תהליך העבודה": [
    {
      question: "מה אני צריך להכין כדי שנוכל להתחיל לעבוד?",
      answer: "כדי לעמוד בלוחות הזמנים המהירים, נצטרך מכם את חומרי הגלם: לוגו (קובץ פתוח/איכותי), תמונות אווירה/מוצרים וטקסטים בסיסיים. אם חסרים לכם חומרים, נוכל להמליץ על אנשי מקצוע משלימים לעיצוב גרפי וכתיבה שיווקית שיסייעו לכם."
    },
    {
      question: "האם אראה את עיצוב האתר לפני הבנייה?",
      answer: "חד משמעית. אנחנו לא מתחילים לתכנת לפני שאנחנו מסונכרנים ויזואלית. בשלב הראשון נציג לכם קו עיצובי או סקיצה ראשונית לאישור. רק לאחר שתאהבו את הכיוון ותאשרו אותו, נמשיך לשלב הבנייה והפיתוח המלא."
    },
    {
      question: "מי אחראי על כתיבת התוכן לאתר?",
      answer: "כברירת מחדל, התוכן מסופק על ידיכם שכן אתם המומחים בתחום שלכם. עם זאת, במידה ותרצו שהאתר ישדר מקצועיות שיווקית גבוהה יותר, אנו מציעים שירותי קופירייטינג בתוספת תשלום לכתיבת הטקסטים בצורה חדה ומכירתית."
    },
    {
      question: "האם אוכל לבקש שינויים במהלך הבנייה?",
      answer: "התהליך שלנו שקוף ומשתף. יהיו נקודות ביקורת מוגדרות במהלך הפרויקט בהן תוכלו לתת פידבק ולבקש דיוקים. אנו עובדים יחד איתכם כדי שהתוצאה הסופית תתאים בדיוק לאפיון שסיכמנו בתחילת הדרך."
    },
    {
      question: "איך מתבצעת ההשקה והמסירה של האתר?",
      answer: "לאחר סיום הפיתוח ואישורכם הסופי, אנו מבצעים סדרת בדיקות איכות (QA) מקיפה, מחברים את הדומיין, ומוודאים שהכל תקין. לאחר מכן נעביר לכם את האתר ונספק לכם את כל הפרטים הטכניים הנדרשים כדי שהנכס יהיה רשום על שמכם."
    },
  ],
  "מחירים וזמנים": [
    {
      question: "כמה זמן לוקח לבנות אתר תדמית או חנות וירטואלית?",
      answer: "תהליך הפיתוח אצלנו מהיר ויעיל: בניית אתר תדמית אורכת עד שבועיים, והקמת חנות וירטואלית מלאה מסתיימת תוך 3 שבועות. אנו מתחייבים ללוחות זמנים אלו בזכות תהליך עבודה מובנה וממוקד, המאפשר לכם להשיק את העסק דיגיטלית במינימום זמן המתנה."
    },
    {
      question: "האם התשלום הוא חד-פעמי או שיש דמי מנוי חודשיים?",
      answer: "המודל שלנו הוא תשלום חד-פעמי עבור הפיתוח. אין אצלנו דמי מנוי נסתרים על עצם קיום האתר. לאחר התשלום, האתר הוא שלכם. כחלק מהשירות, אנו מעניקים לכם במתנה את הדומיין (כתובת האתר) ואחסון מהיר לשנה הראשונה."
    },
    {
      question: "מה קורה בתום השנה הראשונה לגבי הדומיין והאחסון?",
      answer: "הדומיין והאחסון כלולים בחבילת ההקמה למשך 12 חודשים. לקראת סוף השנה, תוכלו לבחור האם לחדש את האחסון והדומיין דרכנו בעלות שנתית סטנדרטית, או להעביר את האתר לכל ספק אחסון אחר לבחירתכם. האתר הוא הנכס שלכם, והבחירה בידיים שלכם."
    },
    {
      question: "מהם תנאי התשלום?",
      answer: "אנו עובדים במודל של מקדמה לתחילת עבודה, כאשר היתרה משולמת עם סיום הפרויקט ומסירת האתר לשביעות רצונכם. צורת עבודה זו מבטיחה מחויבות הדדית להצלחת הפרויקט ולעמידה בלוחות הזמנים."
    },
    {
      question: "האם יש עלויות נסתרות שלא מופיעות בהצעת המחיר?",
      answer: "אנו דוגלים בשקיפות מלאה. המחיר כולל את כל מה שמוגדר באפיון. עלויות נוספות ייתכנו רק אם תבקשו במהלך העבודה תוספות מיוחדות שלא סוכמו מראש (כגון רכישת תמונות ממאגרים, פלאגינים בתשלום מיוחד או פיתוחים מורכבים), וגם אז – הכל יעשה באישור ותמחור מראש."
    },
  ],
  "טכנולוגיה": [
    {
      question: "האם המחיר כולל גם קידום בגוגל (SEO)?",
      answer: "האתר נמסר לכם כ-\"SEO Ready\" – עם תשתית טכנית מצוינת שגוגל יודע לסרוק. עם זאת, קידום אורגני פעיל (הכולל כתיבת מאמרים שוטפת, מחקר מילים מתמיד וקישורים) הוא תהליך נפרד הדורש מומחיות, ואנו מציעים אותו כשירות פרימיום נפרד ללקוחות המעוניינים בצמיחה עקבית."
    },
    {
      question: "האם האתר יהיה מותאם לגלישה בסמארטפון (מובייל)?",
      answer: "חד משמעית כן. אנו בונים את האתר בגישת Mobile-First, מתוך הבנה שרוב הלקוחות שלכם יגיעו דרך הנייד. העיצוב והממשק מותאמים מראש לכל המסכים כדי להבטיח חוויית משתמש חלקה ומקסימום המרות."
    },
    {
      question: "איך פתרונות ה-AI שלכם יכולים לשדרג את העסק שלי?",
      answer: "ה-AI הופך את האתר מכרטיס ביקור לכלי חכם. אנו משלבים צ'אטבוטים לשירות לקוחות, מנועי המלצות וכלי אוטומציה שחוסכים זמן יקר. המטרה היא לייעל את העבודה ולהגדיל מכירות באמצעות טכנולוגיה מתקדמת."
    },
    {
      question: "באיזו פלטפורמה טכנולוגית האתר ייבנה?",
      answer: "אנחנו לא מאמינים בפתרון אחד שמתאים לכולם (\"One size fits all\"). אנו שולטים במגוון טכנולוגיות ומתאימים את הפלטפורמה (וורדפרס, שופיפיי, או פיתוח בקוד מותאם אישית) בהתאם לצרכים המדויקים של העסק שלכם. המטרה שלנו היא לבנות את האתר על ה\"מנוע\" המהיר, היציב והנכון ביותר עבורכם, שישרת אתכם לטווח ארוך."
    },
    {
      question: "איך אתם שומרים על אבטחת האתר?",
      answer: "אבטחת המידע קריטית לנו. כל אתר נמסר עם תעודת אבטחה (SSL) ויושב על שרתים הכוללים הגנות מתקדמות וגיבויים אוטומטיים. כך המידע שלכם ושל הלקוחות שלכם נשמר בטוח, ואתם נהנים מראש שקט."
    },
  ],
};

const FAQSection = () => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-nexo-light">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--nexo-charcoal) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 bg-primary mx-auto mb-6 origin-center"
          />

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            <span className="text-nexo-charcoal">שאלות </span>
            <span className="text-primary">
              נפוצות
            </span>
          </h2>

          <p className="text-nexo-steel text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            כל מה שרציתם לדעת על העבודה איתנו - במקום אחד
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs selected={selectedTab} setSelected={setSelectedTab} />

        {/* Questions */}
        <Questions selected={selectedTab} />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-nexo-ash text-base mb-4">
            לא מצאתם תשובה לשאלה שלכם?
          </p>
          <a
            href="/contact#contact-form"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            <span>דברו איתנו ישירות</span>
            <AnimatedArrow />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Tabs Component - memoized to prevent re-renders
interface TabsProps {
  selected: string;
  setSelected: (tab: string) => void;
}

const Tabs = memo(({ selected, setSelected }: TabsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10"
      dir="rtl"
      role="tablist"
      aria-label="קטגוריות שאלות נפוצות"
    >
      {TABS.map((tab, index) => {
        const tabId = `faq-tab-${tab.replace(/\s+/g, '-')}`;
        const panelId = `faq-tabpanel-${tab.replace(/\s+/g, '-')}`;
        const isSelected = selected === tab;

        return (
          <button
            id={tabId}
            role="tab"
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => setSelected(tab)}
            className={`
              relative overflow-hidden whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 sm:py-3
              text-sm md:text-base font-medium transition-colors duration-300 min-h-[44px]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light
              ${isSelected
                ? "text-white"
                : "bg-white text-nexo-steel hover:text-primary border border-nexo-mist hover:border-primary/30"
              }
            `}
            key={tab}
          >
            <span className="relative z-10">{tab}</span>
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-0 z-0 bg-primary rounded-full"
                />
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.div>
  );
});

Tabs.displayName = 'Tabs';

// Questions Container Component - manages which question is open (only one at a time)
interface QuestionsProps {
  selected: string;
}

const Questions = memo(({ selected }: QuestionsProps) => {
  // Track which question index is open (-1 means none are open)
  const [openIndex, setOpenIndex] = useState<number>(-1);

  // Reset open question when tab changes
  const handleToggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  }, []);

  // Memoize the questions entries to prevent recreation on each render
  const questionsEntries = useMemo(() => Object.entries(QUESTIONS), []);

  // Get the current tab's questions
  const currentQuestions = useMemo(() => QUESTIONS[selected] || [], [selected]);

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        {questionsEntries.map(([tab]) => {
          const tabId = `faq-tab-${tab.replace(/\s+/g, '-')}`;
          const panelId = `faq-tabpanel-${tab.replace(/\s+/g, '-')}`;

          return selected === tab ? (
            <motion.div
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              key={tab}
              onAnimationStart={() => setOpenIndex(-1)}
            >
              {currentQuestions.map((q, idx) => {
                // Create URL-safe ID from tab name for accordion items
                const accordionId = `${tab.replace(/\s+/g, '-')}-${idx}`;
                return (
                  <Question
                    key={idx}
                    id={accordionId}
                    title={q.question}
                    isOpen={openIndex === idx}
                    onToggle={() => handleToggle(idx)}
                  >
                    {q.answer}
                  </Question>
                );
              })}
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
});

Questions.displayName = 'Questions';

// Animation variants for Question component - defined outside to prevent recreation
const questionTitleVariants = {
  open: {
    color: "rgba(26, 26, 26, 0)",
  },
  closed: {
    color: "rgba(26, 26, 26, 1)",
  },
};

const questionChevronVariants = {
  open: {
    rotate: "180deg",
    color: "hsl(328 100% 54%)",
  },
  closed: {
    rotate: "0deg",
    color: "var(--nexo-charcoal)",
  },
};

// Animated Arrow Component with proper cleanup for infinite animation
const AnimatedArrow = memo(() => {
  const controls = useAnimationControls();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const runAnimation = async () => {
      while (isMountedRef.current) {
        await controls.start({ x: -4, transition: { duration: 0.75 } });
        if (!isMountedRef.current) break;
        await controls.start({ x: 0, transition: { duration: 0.75 } });
      }
    };

    runAnimation();

    return () => {
      isMountedRef.current = false;
      controls.stop();
    };
  }, [controls]);

  return (
    <motion.span animate={controls} initial={{ x: 0 }}>
      ←
    </motion.span>
  );
});

AnimatedArrow.displayName = 'AnimatedArrow';

// Individual Question Component - controlled by parent (only one open at a time)
interface QuestionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

const Question = memo(({ title, children, isOpen, onToggle, id }: QuestionProps) => {
  const triggerId = `faq-trigger-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className="border-b border-nexo-mist"
    >
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light rounded-lg"
        dir="rtl"
      >
        <motion.span
          variants={questionTitleVariants}
          className="text-primary text-right text-base sm:text-lg md:text-xl font-medium"
          style={{ WebkitTextFillColor: 'currentColor' }}
        >
          {title}
        </motion.span>
        <motion.span variants={questionChevronVariants}>
          <ChevronDown className="text-2xl w-6 h-6" aria-hidden="true" />
        </motion.span>
      </button>
      {/* GPU-accelerated accordion using CSS Grid */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out text-nexo-steel"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          marginBottom: isOpen ? '24px' : '0px',
        }}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed" dir="rtl">
            {children}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

Question.displayName = 'Question';

export default FAQSection;
