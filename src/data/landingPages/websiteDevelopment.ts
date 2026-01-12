// ============================================
// WEBSITE DEVELOPMENT LANDING PAGE DATA
// פיתוח אתרים - Website Development
// ============================================
// SEO-optimized landing page targeting "פיתוח אתרים" (320 monthly searches)
// All content in Hebrew with English translations in comments
// Focus: Custom web development, technical excellence, scalability

import type { LandingPageData } from "@/types/landingPage";

export const websiteDevelopmentLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-development",
  slug: "website-development",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "פיתוח אתרים" (main keyword)
    title: "פיתוח אתרים מקצועי | פתרונות מותאמים אישית | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "פיתוח אתרים בהתאמה אישית לעסקים. טכנולוגיות מתקדמות, קוד נקי, ביצועים גבוהים וסקיילביליות. שיחת ייעוץ טכני ללא עלות.",
    keywords: [
      // Primary keywords (high volume)
      "פיתוח אתרים",                    // Website development
      "פיתוח אתרים מקצועי",             // Professional website development
      "פיתוח אתר אינטרנט",              // Internet website development
      // Secondary keywords (medium volume)
      "פיתוח אתרים בהתאמה אישית",       // Custom website development
      "פיתוח אתרים לעסקים",             // Website development for businesses
      "פיתוח אתר מתקדם",                // Advanced website development
      "חברת פיתוח אתרים",               // Website development company
      // Long-tail keywords (high conversion intent)
      "פיתוח אתר על פי דרישה",          // Custom website development on demand
      "פיתוח אתרים עם React",           // Website development with React
      "פיתוח Full Stack",               // Full Stack development
      // Location-based keywords
      "פיתוח אתרים תל אביב",            // Tel Aviv
      "פיתוח אתרים ישראל",              // Israel
      "מפתחי אתרים מקצועיים",           // Professional website developers
    ],
    canonicalUrl: "https://nexo.co.il/lp/website-development",
    ogImage: "/images/landing/website-development-hero.jpg",
    schema: {
      type: "ProfessionalService",
      serviceType: "Custom Website Development",
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
    // Emerald green - represents tech/growth/innovation
    accentColor: "#059669",
    gradient: "from-slate-900 via-emerald-900 to-slate-800",
    // Code/development background image
    heroImage: "/images/landing/website-development-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "פיתוח אתרים שבנויים להצלחה",
    // Subtitle - clear benefits
    subtitle: "פתרונות פיתוח מתקדמים שמותאמים בדיוק לצרכים שלכם",
    // Description - creates urgency
    description: "אתר מותאם אישית הוא לא רק נוכחות ברשת - זה כלי עסקי שעובד בשבילכם. אנחנו מפתחים אתרים עם קוד נקי, ביצועים מעולים, ויכולת צמיחה ללא הגבלה.",
    primaryCTA: {
      text: "לשיחת ייעוץ טכני",
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
    title: "מתמודדים עם האתגרים האלה?",
    subtitle: "הבעיות שעסקים פוגשים כשצריכים פיתוח אתר מקצועי",
    items: [
      {
        icon: "Snail",
        title: "האתר הנוכחי איטי ומיושן",
        description: "אתר שנבנה לפני שנים עם טכנולוגיות ישנות. מהירות טעינה איטית, לא מותאם לנייד, וחווית משתמש גרועה שמרחיקה לקוחות.",
      },
      {
        icon: "Lock",
        title: "מוגבלים ביכולות של התבנית",
        description: "תבניות מוכנות לא מאפשרות את הפונקציונליות שאתם צריכים. כל שינוי דורש פשרות או עלויות נסתרות.",
      },
      {
        icon: "RefreshCcw",
        title: "קשה לתחזק ולעדכן",
        description: "כל עדכון פשוט הופך לפרויקט. אין גישה לקוד, תלויים בספק יחיד, ואין שליטה אמיתית על האתר.",
      },
      {
        icon: "TrendingDown",
        title: "האתר לא ממיר מבקרים ללקוחות",
        description: "יש תנועה לאתר, אבל אנשים עוזבים בלי לפנות. ממשק לא אינטואיטיבי וחוויה לא מותאמת לקהל היעד.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה מייחד את הפיתוח שלנו?",
    subtitle: "פיתוח מקצועי עם דגש על איכות, ביצועים, וחווית משתמש",
    items: [
      {
        icon: "Code2",
        title: "קוד נקי ומתועד",
        description: "קוד שנכתב לפי סטנדרטים מקצועיים, מתועד היטב, וקל לתחזוקה. אתם לא תלויים בנו - כל מפתח יוכל להמשיך את העבודה.",
        highlight: true,
      },
      {
        icon: "Gauge",
        title: "ביצועים ומהירות",
        description: "אופטימיזציה מקסימלית לזמני טעינה. אתרים שנטענים במהירות, עומדים בתקני Core Web Vitals, ומספקים חוויה חלקה.",
        highlight: true,
      },
      {
        icon: "Blocks",
        title: "ארכיטקטורה מודולרית",
        description: "מבנה שמאפשר להוסיף פיצ'רים ולהתרחב בקלות. האתר גדל יחד עם העסק שלכם, בלי לבנות מאפס.",
        highlight: true,
      },
      {
        icon: "Shield",
        title: "אבטחה ברמה גבוהה",
        description: "הגנה מפני התקפות נפוצות, הצפנת מידע, ואימות משתמשים. האתר שלכם מוגן לפי תקני האבטחה העדכניים.",
      },
      {
        icon: "Smartphone",
        title: "Responsive Design מושלם",
        description: "עיצוב שמותאם לכל מכשיר - מחשב, טאבלט, ונייד. חוויה אחידה ומעולה בכל גודל מסך.",
      },
      {
        icon: "Database",
        title: "אינטגרציות וממשקים",
        description: "חיבור למערכות קיימות - CRM, תשלומים, שיווק, ולוגיסטיקה. כל הכלים שלכם עובדים יחד בצורה חלקה.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "תהליך הפיתוח שלנו",
    subtitle: "גישה מקצועית ושקופה מהרגע הראשון ועד להשקה",
    steps: [
      {
        number: "01",
        title: "אפיון ותכנון",
        description: "מבינים את הצרכים העסקיים, מגדירים דרישות טכניות, ובונים תכנית פיתוח מפורטת עם לוחות זמנים ברורים.",
        icon: "ClipboardList",
      },
      {
        number: "02",
        title: "עיצוב UI/UX",
        description: "יוצרים עיצוב ממשק שמבוסס על חווית משתמש. Wireframes, מוקאפים, ואישור העיצוב לפני תחילת הפיתוח.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח Front-End",
        description: "בניית הממשק עם React ו-TypeScript. קוד נקי, קומפוננטות גמישות, ואנימציות חלקות.",
        icon: "Monitor",
      },
      {
        number: "04",
        title: "פיתוח Back-End",
        description: "הקמת השרת, בסיס הנתונים, וה-API. ארכיטקטורה שתומכת בסקייל ובטוחה מפני איומים.",
        icon: "Server",
      },
      {
        number: "05",
        title: "בדיקות ואופטימיזציה",
        description: "בדיקות מקיפות - פונקציונליות, ביצועים, תאימות, ואבטחה. תיקון באגים ואופטימיזציה לפני השקה.",
        icon: "TestTube",
      },
      {
        number: "06",
        title: "השקה ותמיכה",
        description: "העלאה לייצור, הדרכה על מערכת הניהול, ותמיכה טכנית שוטפת. אנחנו כאן גם אחרי ההשקה.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "פרויקטים שפיתחנו",
    subtitle: "הצצה לפתרונות הפיתוח שבנינו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על פיתוח אתרים מקצועי",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "מה ההבדל בין בניית אתר לפיתוח אתר?",
            answer: "בניית אתר בדרך כלל מתייחסת ליצירת אתר על בסיס תבנית קיימת או פלטפורמה כמו WordPress. פיתוח אתר זה תהליך מקיף יותר - כתיבת קוד מותאם אישית, תכנון ארכיטקטורה, ובניית פונקציונליות ייחודית בדיוק לפי הצרכים שלכם. התוצאה היא אתר ייחודי, מהיר יותר, וללא מגבלות של תבנית.",
          },
          {
            question: "באילו טכנולוגיות אתם משתמשים?",
            answer: "אנחנו עובדים עם הטכנולוגיות המובילות: React, Next.js, ו-TypeScript בצד הלקוח. Node.js עם Express או NestJS בצד השרת. PostgreSQL או MongoDB לבסיס נתונים. התשתית מותאמת לכל פרויקט לפי הדרישות הספציפיות.",
          },
          {
            question: "האם הקוד יהיה שלי?",
            answer: "כן, לחלוטין. בסיום הפרויקט אתם מקבלים את כל קוד המקור, תיעוד טכני, וגישה לכל המערכות. אתם לא תלויים בנו - אפשר להמשיך פיתוח עם כל צוות שתבחרו.",
          },
        ],
      },
      {
        name: "טכני",
        questions: [
          {
            question: "האם האתר יהיה מהיר?",
            answer: "מהירות היא עדיפות עליונה. אנחנו מקפידים על אופטימיזציה של תמונות, טעינה עצלה, מטמון יעיל, וקוד מינימלי. האתרים שלנו עוברים את בדיקות Google Core Web Vitals ונטענים תוך שניות.",
          },
          {
            question: "איך מבטיחים שהאתר יהיה מאובטח?",
            answer: "אבטחה מובנית מההתחלה: הצפנת SSL, הגנה מפני XSS ו-SQL Injection, אימות משתמשים מאובטח, וניהול הרשאות. בנוסף, עדכונים שוטפים של ספריות ומעקב אחר חולשות אבטחה.",
          },
          {
            question: "האם אפשר לחבר את האתר למערכות קיימות?",
            answer: "בהחלט. אנחנו מפתחים אינטגרציות ל-CRM, מערכות תשלום, שירותי שיווק, ERP, ועוד. אם יש API - אפשר להתחבר. ואם אין, אפשר לבנות פתרון מותאם.",
          },
        ],
      },
      {
        name: "תהליך העבודה",
        questions: [
          {
            question: "כמה זמן לוקח פיתוח אתר?",
            answer: "תלוי בהיקף הפרויקט. אתר תדמית מותאם - 4-6 שבועות. מערכת מורכבת עם פונקציונליות מתקדמת - 2-4 חודשים. בשיחת האפיון נגדיר לוח זמנים מדויק עם אבני דרך ברורות.",
          },
          {
            question: "איך מתנהל תהליך הפיתוח?",
            answer: "התהליך כולל שלבים מוגדרים: אפיון דרישות, עיצוב UI/UX, פיתוח Front-End ו-Back-End, בדיקות מקיפות, והשקה. בכל שלב תקבלו עדכונים ותוכלו לראות התקדמות. אנחנו עובדים בשיטת Agile עם ספרינטים קצרים שמאפשרים גמישות ושקיפות.",
          },
          {
            question: "מה קורה אחרי ההשקה?",
            answer: "אנחנו מציעים חבילות תמיכה ותחזוקה שוטפת - עדכוני אבטחה, גיבויים, תיקון באגים, ושינויים קטנים. אפשר גם להמשיך פיתוח של פיצ'רים חדשים לפי הצורך.",
          },
          {
            question: "איך מבטיחים את איכות הקוד?",
            answer: "אנחנו מיישמים Code Review על כל שינוי, כותבים בדיקות אוטומטיות, ומקפידים על סטנדרטים מקצועיים. הקוד מתועד, מסודר לפי קונבנציות מקובלות, ועובר בדיקות לפני כל השקה.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - Empty (following lawyers template)
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
    title: "מוכנים לאתר שבנוי בדיוק בשבילכם?",
    description: "בואו נדבר על איך פיתוח מותאם אישית יכול לקדם את העסק שלכם. שיחת ייעוץ טכני ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "קוד נקי ומתועד",
      "ביצועים מעולים",
      "סקיילביליות",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותי פיתוח נוספים",
    subtitle: "פתרונות טכנולוגיים משלימים לעסק שלכם",
    items: [
      {
        name: "פיתוח אפליקציות",
        description: "אפליקציות מותאמות לנייד ולווב עם חוויית משתמש מעולה",
        href: "/services/app-development",
      },
      {
        name: "עיצוב UI/UX",
        description: "עיצוב ממשקים אינטואיטיביים שמניעים לפעולה",
        href: "/services/web-design",
      },
      {
        name: "קידום אורגני SEO",
        description: "הגדלת החשיפה והתנועה האורגנית לאתר",
        href: "/services/seo",
      },
      {
        name: "מסחר אלקטרוני",
        description: "חנויות אונליין מתקדמות עם מערכות ניהול מובנות",
        href: "/services/ecommerce",
      },
      {
        name: "אוטומציה ובינה מלאכותית",
        description: "ייעול תהליכים עסקיים באמצעות טכנולוגיות AI",
        href: "/services/ai-automation",
      },
      {
        name: "תחזוקה ותמיכה",
        description: "שירותי תמיכה טכנית, עדכונים ואבטחה שוטפת",
        href: "/services/maintenance",
      },
    ],
  },
};

export default websiteDevelopmentLandingPage;
