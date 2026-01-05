import { memo, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useMeasure from "react-use-measure";
import type { SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import type { Service } from "@/data/services";

// Animation constants
const INITIAL_FADE_UP_40 = { opacity: 0, y: 40 };
const INITIAL_FADE_UP_20 = { opacity: 0, y: 20 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const ANIMATE_EMPTY = {};
const TRANSITION_DURATION_06 = { duration: 0.6 };
const IN_VIEW_OPTIONS_MARGIN = { once: true, margin: "-100px" as const };

// Animation variants for FAQ chevron
// Note: Using CSS variable reference for nexo-charcoal token
const faqChevronVariants = {
  open: { rotate: 180, color: "hsl(328 100% 54%)" },
  closed: { rotate: 0, color: "var(--nexo-charcoal)" },
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
      className="border-b border-nexo-mist"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        dir="rtl"
      >
        <span
          className="text-right text-lg md:text-xl font-medium transition-colors"
          style={{ color: isOpen ? accentColor : 'var(--nexo-charcoal)' }}
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
        className="overflow-hidden text-nexo-steel"
      >
        <p ref={ref} className="text-base md:text-lg leading-relaxed" dir="rtl">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
});

FAQItem.displayName = 'FAQItem';

export interface SubServiceFAQProps {
  subService: SubServiceDetailType;
  parentService: Service;
}

const SubServiceFAQ = memo(({ subService, parentService }: SubServiceFAQProps) => {
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

SubServiceFAQ.displayName = 'SubServiceFAQ';

export default SubServiceFAQ;
