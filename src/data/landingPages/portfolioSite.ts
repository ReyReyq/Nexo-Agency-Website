// ============================================
// PORTFOLIO SITE LANDING PAGE DATA
// אתר תדמיתי - Portfolio/Image Website
// ============================================
// SEO-optimized landing page for businesses seeking portfolio/image websites in Israel
// All content in Hebrew with English translations in comments
// Target keyword: אתר תדמיתי (320 monthly searches)

import type { LandingPageData } from "@/types/landingPage";

export const portfolioSiteLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "portfolio-site",
  slug: "portfolio-site",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "אתר תדמיתי" (main keyword)
    title: "בניית אתר תדמיתי | אתר תדמית מעוצב שמשדר מקצועיות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "אתר תדמיתי מעוצב שמייצג את העסק שלכם בצורה מקצועית. עיצוב ייחודי, מותאם לנייד, וממותג בהתאם לזהות העסקית שלכם. שיחת ייעוץ חינם.",
    keywords: [
      // Primary keywords (high volume)
      "אתר תדמיתי",                     // Portfolio/image website
      "אתר תדמית",                      // Image website
      "בניית אתר תדמיתי",               // Building portfolio website
      // Secondary keywords (medium volume, less competition)
      "עיצוב אתר תדמית",                // Image website design
      "אתר תדמית לעסק",                 // Business portfolio website
      "אתר תדמיתי מעוצב",               // Designed portfolio website
      // Long-tail keywords (high conversion intent)
      "כמה עולה אתר תדמיתי",            // How much does a portfolio site cost
      "בניית אתר תדמית לעסק קטן",       // Building image site for small business
      "אתר תדמית מותאם אישית",          // Custom portfolio website
      "אתר תדמיתי מקצועי",              // Professional portfolio website
      // Related keywords
      "אתר תדמית למיתוג",               // Portfolio site for branding
      "אתר ייצוגי לעסק",                // Representative website for business
      "אתר עסקי תדמיתי",                // Business image website
    ],
    canonicalUrl: "https://nexo.co.il/lp/portfolio-site",
    ogImage: "/images/landing/portfolio-site-hero.jpg",
    schema: {
      type: "ProfessionalService",
      serviceType: "Portfolio Website Development",
      areaServed: "Israel",
      provider: {
        name: "Nexo Digital",
        url: "https://nexo.co.il",
      },
    },
  },

  // ============================================
  // VISUAL THEMING
  // ============================================
  theme: {
    // Creative pink - conveys creativity, branding, and innovation
    accentColor: "#ec4899",
    gradient: "from-slate-900 via-pink-900 to-slate-800",
    // Professional branding/collaboration image from Unsplash
    heroImage: "/images/landing/portfolio-site-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "אתר תדמיתי שמשדר מקצועיות ובונה אמון",
    // Subtitle - clear benefits
    subtitle: "כרטיס הביקור הדיגיטלי שמייצג את העסק שלכם 24/7",
    // Description - creates urgency
    description: "הלקוחות שלכם בודקים אתכם באינטרנט לפני שהם מתקשרים. אתר תדמיתי מעוצב הוא ההזדמנות שלכם לעשות רושם ראשוני מושלם.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "צפו בעבודות שלנו",
      href: "#portfolio",
    },
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "מכירים את המצבים האלה?",
    subtitle: "האתגרים שעסקים מתמודדים איתם בעולם הדיגיטלי",
    items: [
      {
        icon: "Eye",
        title: "הרושם הראשוני לא משקף את האיכות שלכם",
        description: "אתם יודעים שהעסק שלכם מקצועי ואיכותי, אבל באינטרנט זה לא מורגש. בלי אתר תדמיתי מעוצב, אתם נראים פחות רציניים מהמתחרים.",
      },
      {
        icon: "Users",
        title: "לקוחות פוטנציאליים לא מוצאים אתכם",
        description: "כשמחפשים עסק בגוגל, התוצאות הראשונות מקבלות את תשומת הלב. בלי נוכחות דיגיטלית חזקה, אתם מפסידים לקוחות למתחרים.",
      },
      {
        icon: "Smartphone",
        title: "האתר הנוכחי לא נראה טוב בנייד",
        description: "רוב הגלישה היום מהנייד. אתר שלא מותאם לנייד גורם למבקרים לעזוב תוך שניות - ופוגע באמינות שלכם.",
      },
      {
        icon: "RefreshCw",
        title: "האתר נראה מיושן ולא מעודכן",
        description: "עיצוב ישן, תכנים לא רלוונטיים, או טכנולוגיה מיושנת - כל אלה משדרים חוסר מקצועיות ופוגעים בתדמית העסק.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל אתר תדמיתי מקצועי?",
    subtitle: "פתרון מלא שבונה את הנוכחות הדיגיטלית של העסק שלכם",
    items: [
      {
        icon: "Palette",
        title: "עיצוב ייחודי ומותאם אישית",
        description: "עיצוב שמשקף את זהות המותג שלכם - צבעים, סגנון, ושפה ויזואלית שמבדילה אתכם מהמתחרים.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מותאם לכל המכשירים",
        description: "האתר נראה ועובד מושלם בכל מכשיר - מחשב, טאבלט, וסמארטפון. חוויית משתמש חלקה בכל מסך.",
        highlight: true,
      },
      {
        icon: "Sparkles",
        title: "אנימציות ואפקטים מרשימים",
        description: "אלמנטים אינטראקטיביים שמושכים תשומת לב ויוצרים חוויה זכירה - מבלי לפגוע במהירות הטעינה.",
      },
      {
        icon: "Image",
        title: "גלריה מרשימה לעבודות",
        description: "הצגה אסתטית של הפרויקטים והעבודות שלכם - כי תמונה אחת שווה אלף מילים.",
      },
      {
        icon: "Search",
        title: "תשתית SEO מובנית",
        description: "מבנה טכני נכון שעוזר לגוגל למצוא ולדרג את האתר שלכם. תגיות, מהירות, ומבנה אופטימלי.",
        highlight: true,
      },
      {
        icon: "Zap",
        title: "מהירות טעינה גבוהה",
        description: "אתר מהיר = לקוחות שנשארים. אופטימיזציה מלאה לחוויית גלישה חלקה ומהירה.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך זה עובד?",
    subtitle: "תהליך פשוט ושקוף מהפגישה הראשונה ועד להשקה",
    steps: [
      {
        number: "01",
        title: "פגישת היכרות ואפיון",
        description: "נכיר את העסק, הערכים, והמטרות שלכם. יחד נגדיר את החזון לאתר התדמיתי המושלם.",
        icon: "Users",
      },
      {
        number: "02",
        title: "עיצוב ומיתוג",
        description: "ניצור עיצוב ייחודי שמשקף את זהות המותג. תראו מוקאפים ותאשרו לפני שמתחילים לבנות.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ובנייה",
        description: "נבנה את האתר עם טכנולוגיות מתקדמות. עדכונים שוטפים ונקודות ביקורת לאורך הדרך.",
        icon: "Code",
      },
      {
        number: "04",
        title: "השקה ותמיכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה ותמיכה שוטפת גם אחרי ההשקה.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "עבודות שעשינו",
    subtitle: "הצצה לאתרי תדמית שבנינו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בניית אתר תדמיתי",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "מה זה אתר תדמיתי ולמה צריך אחד?",
            answer: "אתר תדמיתי הוא כרטיס הביקור הדיגיטלי של העסק שלכם. הוא מציג את השירותים, הערכים, והמקצועיות שלכם בצורה אסתטית ומשכנעת. בעידן שבו לקוחות בודקים עסקים באינטרנט לפני שהם יוצרים קשר, אתר תדמיתי מקצועי הוא הכרחי לבניית אמון ויצירת רושם ראשוני חיובי.",
          },
          {
            question: "מה ההבדל בין אתר תדמיתי לאתר מכירות?",
            answer: "אתר תדמיתי מתמקד ביצירת רושם חיובי, הצגת המותג, ובניית אמון עם הלקוחות. הוא מציג את הערכים, השירותים, והסיפור של העסק. אתר מכירות (חנות אונליין) מתמקד במכירה ישירה של מוצרים. לעסקים שונים מתאים סוג אתר שונה - ולפעמים שילוב של השניים.",
          },
          {
            question: "האם האתר יהיה בבעלותי המלאה?",
            answer: "כן, 100%. בניגוד לפלטפורמות השכרה, אנחנו מעבירים את האתר לבעלותכם המלאה. הקוד, העיצוב, התכנים - הכל שלכם. אתם לא תלויים בנו ויכולים להמשיך באופן עצמאי או לעבור לכל מקום אחר.",
          },
        ],
      },
      {
        name: "עיצוב ומיתוג",
        questions: [
          {
            question: "איך מבטיחים שהעיצוב ישקף את המותג שלי?",
            answer: "התהליך מתחיל בפגישת אפיון מעמיקה שבה נלמד את הערכים, קהל היעד, והחזון של העסק שלכם. נבחן את המתחרים ונגדיר יחד את השפה הוויזואלית - צבעים, טיפוגרפיה, וסגנון. תראו מוקאפים ותוכלו לתת משוב לפני שמתחילים לבנות.",
          },
          {
            question: "האם אפשר לשלב את הלוגו והצבעים הקיימים שלי?",
            answer: "בהחלט. אם יש לכם זהות מותגית קיימת (לוגו, צבעים, פונטים), נשלב אותה בעיצוב האתר. אם אין - נוכל לעזור לכם לפתח שפה ויזואלית חדשה שתשקף את העסק בצורה הטובה ביותר.",
          },
          {
            question: "כמה שינויים אפשר לבקש בעיצוב?",
            answer: "אנחנו עובדים בשיטה איטרטיבית שכוללת סבבי משוב ותיקונים. המטרה שלנו שתהיו מרוצים לחלוטין. נתחיל עם מוקאפים ראשוניים, תיתנו משוב, ונתקן עד שנגיע לתוצאה המושלמת.",
          },
        ],
      },
      {
        name: "טכני וקידום",
        questions: [
          {
            question: "האם האתר יופיע בגוגל?",
            answer: "האתר נבנה עם תשתית SEO מובנית - מבנה טכני נכון, מהירות טעינה גבוהה, תגיות מותאמות, וכותרות אופטימליות. זה נותן לכם בסיס מצוין להופעה בתוצאות החיפוש. לקידום אקטיבי מתמשך כמו בניית קישורים וכתיבת תוכן, אנחנו מציעים שירות ייעודי.",
          },
          {
            question: "מה לגבי תחזוקה ועדכונים?",
            answer: "אנחנו מציעים חבילות תחזוקה חודשיות שכוללות עדכוני אבטחה, גיבויים, ותמיכה טכנית. גם אם תבחרו לא לקחת חבילת תחזוקה, תקבלו הדרכה מלאה על איך לנהל ולעדכן את האתר בעצמכם.",
          },
          {
            question: "האם האתר יהיה מאובטח?",
            answer: "כן. כל אתר שאנחנו בונים כולל תעודת SSL (הצפנה), הגנה מפני התקפות נפוצות, וגיבויים אוטומטיים. האבטחה היא חלק בלתי נפרד מהבנייה ולא תוספת.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - Empty (per template pattern)
  // ============================================
  testimonials: {
    title: "",
    subtitle: "",
    items: [], // Empty - not using testimonials
  },

  // ============================================
  // CTA SECTION
  // ============================================
  cta: {
    title: "מוכנים לאתר תדמיתי שעושה רושם?",
    description: "בואו נדבר על איך אתר מעוצב ומקצועי יכול לקחת את העסק שלכם לשלב הבא. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב ייחודי ומותאם אישית",
      "מותאם לנייד ולגוגל",
      "תהליך עבודה שקוף",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים משלימים",
    subtitle: "לנוכחות דיגיטלית מלאה",
    items: [
      {
        name: "מיתוג עסקי",
        description: "זהות ויזואלית חזקה שמבדלת אתכם מהמתחרים",
        href: "/services/branding",
      },
      {
        name: "קידום אורגני SEO",
        description: "הגיעו לראש תוצאות גוגל והביאו לקוחות איכותיים",
        href: "/services/seo",
      },
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממומנים שמגיעים לקהל היעד הנכון",
        href: "/services/digital-marketing",
      },
      {
        name: "כתיבת תוכן",
        description: "תוכן שיווקי שמושך ומניע לפעולה",
        href: "/services/content",
      },
    ],
  },
};

export default portfolioSiteLandingPage;
