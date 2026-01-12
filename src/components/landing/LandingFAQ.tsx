import { memo, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LandingFAQContent, LandingFAQItem, LandingFAQCategory } from "@/types/landingPage";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

// Animation variants for FAQ chevron
const faqChevronVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

// Animation variants for question title
const questionTitleVariants = {
  open: {
    color: "rgba(26, 26, 26, 0)",
  },
  closed: {
    color: "rgba(26, 26, 26, 1)",
  },
};

interface FAQItemComponentProps {
  item: LandingFAQItem;
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}

const FAQItemComponent = memo(({ item, id, isOpen, onToggle, accentColor }: FAQItemComponentProps) => {
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
        className="flex w-full items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
        style={{
          // @ts-expect-error CSS custom properties
          '--tw-ring-color': accentColor,
        }}
        dir="rtl"
      >
        <motion.span
          variants={questionTitleVariants}
          className="text-right text-base sm:text-lg md:text-xl font-medium"
          style={{
            color: accentColor,
            WebkitTextFillColor: 'currentColor'
          }}
        >
          {item.question}
        </motion.span>
        <motion.span
          variants={faqChevronVariants}
          style={{ color: isOpen ? accentColor : 'var(--nexo-charcoal)' }}
        >
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
            {item.answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

FAQItemComponent.displayName = 'FAQItemComponent';

// Tabs Component for categorized FAQs
interface TabsProps {
  tabs: string[];
  selected: string;
  setSelected: (tab: string) => void;
  accentColor: string;
}

const Tabs = memo(({ tabs, selected, setSelected, accentColor }: TabsProps) => {
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
      {tabs.map((tab) => {
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
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-light
              ${isSelected
                ? "text-white"
                : "bg-white text-nexo-steel hover:text-nexo-charcoal border border-nexo-mist hover:border-nexo-ash"
              }
            `}
            style={{
              // @ts-expect-error CSS custom properties
              '--tw-ring-color': accentColor,
            }}
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
                  className="absolute inset-0 z-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
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

// Questions Container for categorized FAQs
interface CategorizedQuestionsProps {
  categories: LandingFAQCategory[];
  selectedTab: string;
  accentColor: string;
}

const CategorizedQuestions = memo(({ categories, selectedTab, accentColor }: CategorizedQuestionsProps) => {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  }, []);

  const currentQuestions = useMemo(() => {
    const category = categories.find(c => c.name === selectedTab);
    return category?.questions || [];
  }, [categories, selectedTab]);

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        {categories.map((category) => {
          const tabId = `faq-tab-${category.name.replace(/\s+/g, '-')}`;
          const panelId = `faq-tabpanel-${category.name.replace(/\s+/g, '-')}`;

          return selectedTab === category.name ? (
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
              key={category.name}
              onAnimationStart={() => setOpenIndex(-1)}
            >
              {currentQuestions.map((q, idx) => {
                const accordionId = `${category.name.replace(/\s+/g, '-')}-${idx}`;
                return (
                  <FAQItemComponent
                    key={idx}
                    item={q}
                    id={accordionId}
                    isOpen={openIndex === idx}
                    onToggle={() => handleToggle(idx)}
                    accentColor={accentColor}
                  />
                );
              })}
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
});

CategorizedQuestions.displayName = 'CategorizedQuestions';

// Simple Questions Container (flat list without tabs)
interface SimpleQuestionsProps {
  items: LandingFAQItem[];
  accentColor: string;
}

const SimpleQuestions = memo(({ items, accentColor }: SimpleQuestionsProps) => {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      {items.map((item, index) => (
        <FAQItemComponent
          key={index}
          item={item}
          id={`simple-${index}`}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          accentColor={accentColor}
        />
      ))}
    </motion.div>
  );
});

SimpleQuestions.displayName = 'SimpleQuestions';

export interface LandingFAQProps {
  content: LandingFAQContent;
  accentColor: string;
  /** Generate FAQ JSON-LD Schema */
  generateSchema?: boolean;
}

const LandingFAQ = memo(({ content, accentColor, generateSchema = true }: LandingFAQProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

  // Determine if we're using categories (tabs) or flat items
  const useCategories = content.categories && content.categories.length > 0;
  const tabs = useMemo(() =>
    useCategories ? content.categories!.map(c => c.name) : [],
    [content.categories, useCategories]
  );
  const [selectedTab, setSelectedTab] = useState(tabs[0] || '');

  // Gather all FAQ items for schema (from either format)
  const allFAQItems = useMemo(() => {
    if (useCategories && content.categories) {
      return content.categories.flatMap(c => c.questions);
    }
    return content.items || [];
  }, [content.categories, content.items, useCategories]);

  // Generate FAQ Schema for SEO
  const faqSchema = generateSchema && allFAQItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } : null;

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-nexo-light relative overflow-hidden"
      dir="rtl"
      id="faq"
    >
      {/* FAQ Schema JSON-LD */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Subtle pattern background */}
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
          initial={INITIAL_FADE_UP}
          animate={isInView ? ANIMATE_VISIBLE : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            <span className="text-nexo-charcoal">שאלות </span>
            <span style={{ color: accentColor }}>נפוצות</span>
          </h2>

          {content.subtitle && (
            <p className="text-nexo-steel text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Tabs (if using categories) */}
        {useCategories && (
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            setSelected={setSelectedTab}
            accentColor={accentColor}
          />
        )}

        {/* Questions */}
        {useCategories && content.categories ? (
          <CategorizedQuestions
            categories={content.categories}
            selectedTab={selectedTab}
            accentColor={accentColor}
          />
        ) : content.items ? (
          <SimpleQuestions
            items={content.items}
            accentColor={accentColor}
          />
        ) : null}

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
            className="inline-flex items-center gap-2 font-semibold hover:underline underline-offset-4 transition-all"
            style={{ color: accentColor }}
          >
            <span>דברו איתנו ישירות</span>
            <motion.span
              animate={{ x: [-4, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, repeatType: "reverse" }}
            >
              ←
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
});

LandingFAQ.displayName = 'LandingFAQ';

export default LandingFAQ;
