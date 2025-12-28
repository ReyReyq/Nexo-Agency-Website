import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useMeasure from "react-use-measure";

// FAQ Categories (Tabs) - כללי first for RTL (appears on right)
const TABS = ["כללי", "תהליך העבודה", "מחירים וזמנים", "טכנולוגיה"];

// Questions organized by category
const QUESTIONS: Record<string, { question: string; answer: string }[]> = {
  "כללי": [
    {
      question: "למי שייך האתר והתוכן לאחר סיום העבודה?",
      answer: "האתר הוא 100% שלכם. בניגוד לפלטפורמות השכרה, אנו בונים נכס דיגיטלי ומעבירים אותו ללקוח באופן מלא עם סיום הפרויקט. קוד האתר, העיצוב, והנתונים (כולל בסיס הנתונים של הלקוחות בחנות) שייכים לכם בלעדית, מה שמבטיח לכם עצמאות עסקית מלאה."
    },
    {
      question: "מה מבדיל אתכם מסוכנויות אחרות?",
      answer: "אנחנו לא בונים סתם אתרים יפים - אנחנו בונים מכונות שמביאות תוצאות. הגישה שלנו משלבת אסטרטגיה עסקית, עיצוב ממיר ופיתוח מתקדם. בנוסף, אנו מתמחים בשילוב פתרונות AI ואוטומציה שחוסכים לכם זמן וכסף."
    },
    {
      question: "האם אפשר לראות דוגמאות לעבודות שלכם?",
      answer: "כמובן! בדף הפורטפוליו שלנו תוכלו לראות פרויקטים שביצענו כמו SimplyHebrew, SIONÉ ו-TeenVestor. נשמח גם להציג לכם את היכולות שלנו בפגישה אישית ולהראות כיצד נוכל לעזור לעסק שלכם לצמוח."
    },
  ],
  "תהליך העבודה": [
    {
      question: "איך תהליך העבודה איתכם נראה?",
      answer: "התהליך שלנו מתחיל בפגישת היכרות חינמית בה אנו מבינים את הצרכים והמטרות שלכם. לאחר מכן אנו בונים תכנית עבודה מפורטת, מעצבים, מפתחים ומשיקים - כשאתם מעודכנים בכל שלב. כל פרויקט מקבל מנהל פרויקט ייעודי שזמין עבורכם."
    },
    {
      question: "איך מתחילים?",
      answer: "פשוט השאירו פרטים בטופס יצירת הקשר או התקשרו אלינו. נקבע פגישת היכרות חינמית (פיזית או בזום) בה נבין את הצרכים שלכם ונציג כיצד נוכל לעזור. אין התחייבות - רק שיחה פתוחה על האפשרויות."
    },
    {
      question: "האם אתם מציעים תחזוקה אחרי ההשקה?",
      answer: "בהחלט! אנו מציעים חבילות תחזוקה שכוללות עדכוני אבטחה, גיבויים, תמיכה טכנית וביצוע שינויים קטנים. ההצלחה שלכם היא ההצלחה שלנו, ואנחנו כאן לטווח הארוך."
    },
  ],
  "מחירים וזמנים": [
    {
      question: "כמה זמן לוקח לבנות אתר תדמית או חנות וירטואלית?",
      answer: "תהליך הפיתוח אצלנו מהיר ויעיל: בניית אתר תדמית אורכת עד שבועיים, והקמת חנות וירטואלית מלאה מסתיימת תוך 3 שבועות. אנו מתחייבים ללוחות זמנים אלו בזכות תהליך עבודה מובנה וממוקד, המאפשר לכם להשיק את העסק דיגיטלית במינימום זמן המתנה."
    },
    {
      question: "האם התשלום הוא חד-פעמי או שיש דמי מנוי חודשיים?",
      answer: "המודל שלנו הוא תשלום חד-פעמי עבור בניית האתר. אין אצלנו \"חתונה קתולית\" או דמי מנוי נסתרים על הפיתוח. לאחר התשלום, האתר מועבר לבעלותכם המלאה. כחלק מהשירות, אנו מעניקים לכם במתנה את הדומיין (כתובת האתר) וחבילת אחסון מהירה וכלולה לשנה הראשונה."
    },
    {
      question: "מה קורה בתום השנה הראשונה לגבי הדומיין והאחסון?",
      answer: "הדומיין והאחסון כלולים בחבילת ההקמה למשך 12 חודשים. לקראת סוף השנה, תוכלו לבחור האם לחדש את האחסון והדומיין דרכנו בעלות שנתית סטנדרטית, או להעביר את האתר לכל ספק אחסון אחר לבחירתכם. האתר הוא הנכס שלכם, והבחירה בידיים שלכם."
    },
  ],
  "טכנולוגיה": [
    {
      question: "האם האתר יהיה מותאם לגלישה בסמארטפון (מובייל)?",
      answer: "חד משמעית כן. אנו בונים את האתר בגישת Mobile-First, מתוך הבנה שרוב הלקוחות שלכם יגיעו דרך הטלפון הנייד. העיצוב, גודל הכפתורים והתפריטים מותאמים מראש לכל סוגי המסכים כדי להבטיח חוויית משתמש חלקה ומקסימום המרות."
    },
    {
      question: "האם המחיר כולל גם קידום בגוגל (SEO)?",
      answer: "האתר נמסר לכם כ-\"SEO Ready\" – כלומר, עם תשתית טכנית מעולה, מהירות טעינה גבוהה והתאמה למובייל שגוגל אוהב. עם זאת, קידום אורגני פעיל (כתיבת תוכן, מחקר מילים ושיפור מיקומים שוטף) הוא תהליך נפרד הדורש מומחיות ייעודית, ואנו מציעים אותו כשירות נוסף (אקסטרה) ללקוחות המעוניינים בכך."
    },
    {
      question: "איך פתרונות ה-AI שלכם יכולים לשדרג את העסק שלי מעבר לאתר רגיל?",
      answer: "פתרונות ה-AI שלנו הופכים את האתר מ\"כרטיס ביקור\" סטטי לכלי עבודה חכם. אנו יכולים לשלב צ'אטבוטים לשירות לקוחות, מנועי המלצות, או כלי אוטומציה שחוסכים לכם זמן יקר. המטרה היא להקטין את החיכוך עם הלקוח ולהגביר את המכירות באמצעות טכנולוגיה מתקדמת ושקופה."
    },
  ],
};

const FAQSection = () => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#FAF9F6' }}>
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
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
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-primary mx-auto mb-6"
          />

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="text-[#1a1a1a]">שאלות </span>
            <span className="text-primary">
              נפוצות
            </span>
          </h2>

          <p className="text-[#4a4a4a] text-lg md:text-xl max-w-2xl mx-auto">
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
          <p className="text-[#6a6a6a] text-base mb-4">
            לא מצאתם תשובה לשאלה שלכם?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            <span>דברו איתנו ישירות</span>
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ←
            </motion.span>
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
      className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-10"
      dir="rtl"
    >
      {TABS.map((tab) => (
        <button
          onClick={() => setSelected(tab)}
          className={`
            relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2.5
            text-sm md:text-base font-medium transition-colors duration-300
            ${selected === tab
              ? "text-white"
              : "bg-white text-[#4a4a4a] hover:text-primary border border-[#e5e5e5] hover:border-primary/30"
            }
          `}
          key={tab}
        >
          <span className="relative z-10">{tab}</span>
          <AnimatePresence>
            {selected === tab && (
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
      ))}
    </motion.div>
  );
});

Tabs.displayName = 'Tabs';

// Questions Container Component - memoized
interface QuestionsProps {
  selected: string;
}

const Questions = memo(({ selected }: QuestionsProps) => {
  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        {Object.entries(QUESTIONS).map(([tab, questions]) => {
          return selected === tab ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              key={tab}
            >
              {questions.map((q, idx) => (
                <Question
                  key={idx}
                  title={q.question}
                  defaultOpen={false}
                >
                  {q.answer}
                </Question>
              ))}
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
    color: "#1a1a1a",
  },
};

// Individual Question Component - memoized with stable variants
interface QuestionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Question = memo(({ title, children, defaultOpen = false }: QuestionProps) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className="border-b border-[#e5e5e5]"
    >
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-4 py-6"
        dir="rtl"
      >
        <motion.span
          variants={questionTitleVariants}
          className="text-primary text-right text-lg md:text-xl font-medium"
          style={{ WebkitTextFillColor: 'currentColor' }}
        >
          {title}
        </motion.span>
        <motion.span variants={questionChevronVariants}>
          <ChevronDown className="text-2xl w-6 h-6" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-[#4a4a4a]"
      >
        <p ref={ref} className="text-base md:text-lg leading-relaxed" dir="rtl">
          {children}
        </p>
      </motion.div>
    </motion.div>
  );
});

Question.displayName = 'Question';

export default FAQSection;
