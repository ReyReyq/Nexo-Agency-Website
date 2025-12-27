import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useMeasure from "react-use-measure";

// FAQ Categories (Tabs)
const TABS = ["תהליך העבודה", "מחירים וזמנים", "טכנולוגיה", "כללי"];

// Questions organized by category
const QUESTIONS: Record<string, { question: string; answer: string }[]> = {
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
      question: "כמה עולה לבנות אתר?",
      answer: "העלות תלויה בהיקף ובמורכבות הפרויקט. אתר תדמית מתחיל מ-8,000₪, חנות אונליין מ-15,000₪, ופרויקטים מותאמים אישית מתומחרים בהתאם לדרישות. נשמח לתת הצעת מחיר מפורטת לאחר הבנת הצרכים שלכם."
    },
    {
      question: "כמה זמן לוקח לבנות אתר?",
      answer: "זמני האספקה משתנים בהתאם למורכבות הפרויקט. אתר תדמית בסיסי יכול להיות מוכן תוך 2-3 שבועות, בעוד פרויקטים מורכבים יותר כמו חנויות אונליין או מערכות מותאמות אישית יכולים לקחת 6-8 שבועות. נספק לכם לוח זמנים מדויק בהצעה."
    },
  ],
  "טכנולוגיה": [
    {
      question: "מה הטכנולוגיות שאתם משתמשים בהן?",
      answer: "אנו עובדים עם הטכנולוגיות המתקדמות ביותר בשוק: React, Next.js, TypeScript לפיתוח, Figma לעיצוב, ופתרונות AI מתקדמים לאוטומציה. אנו בוחרים את הטכנולוגיה המתאימה ביותר לצרכים הספציפיים של כל פרויקט."
    },
    {
      question: "האם האתר יהיה מותאם לנייד?",
      answer: "בהחלט! כל האתרים שלנו נבנים בגישת Mobile-First ומותאמים באופן מושלם לכל המכשירים - מטלפונים ניידים, דרך טאבלטים ועד מסכי מחשב גדולים. אנו מקפידים על חוויית משתמש מעולה בכל מכשיר."
    },
  ],
  "כללי": [
    {
      question: "מה מבדיל אתכם מסוכנויות אחרות?",
      answer: "אנחנו לא בונים סתם אתרים יפים - אנחנו בונים מכונות שמביאות תוצאות. הגישה שלנו משלבת אסטרטגיה עסקית, עיצוב ממיר ופיתוח מתקדם. בנוסף, אנו מתמחים בשילוב פתרונות AI ואוטומציה שחוסכים לכם זמן וכסף."
    },
    {
      question: "האם אפשר לראות דוגמאות לעבודות שלכם?",
      answer: "אנו עובדים כרגע על מספר פרויקטים מרגשים שיתווספו לפורטפוליו שלנו בקרוב. בינתיים, נשמח להציג לכם את היכולות שלנו בפגישה אישית ולהראות כיצד נוכל לעזור לעסק שלכם לצמוח."
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
            <span className="bg-gradient-to-l from-primary to-[#8330c2] bg-clip-text text-transparent">
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
                className="absolute inset-0 z-0 bg-gradient-to-l from-primary to-[#8330c2] rounded-full"
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
                  defaultOpen={idx === 0}
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
          className="bg-gradient-to-l from-primary to-[#8330c2] bg-clip-text text-right text-lg md:text-xl font-medium"
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
