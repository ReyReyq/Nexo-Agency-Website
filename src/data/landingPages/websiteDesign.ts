// ============================================
// WEBSITE DESIGN LANDING PAGE DATA
// עיצוב אתרים - Website Design
// ============================================
// SEO-optimized landing page for website design services in Israel
// All content in Hebrew with English translations in comments
// Keywords researched: עיצוב אתרים, עיצוב אתר, מעצב אתרים
// Monthly searches: 880

import type { LandingPageData } from "@/types/landingPage";

export const websiteDesignLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-design",
  slug: "website-design",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "עיצוב אתרים" (main keyword)
    title: "עיצוב אתרים | אתר מעוצב שמשאיר רושם ומייצר תוצאות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "עיצוב אתרים מקצועי שמשלב אסתטיקה מודרנית עם חוויית משתמש מושלמת. עיצוב מותאם אישית, ממשק אינטואיטיבי, ותוצאות שמדברות בעד עצמן. שיחת ייעוץ חינם.",
    keywords: [
      // Primary keywords (high volume)
      "עיצוב אתרים",                      // Website design
      "עיצוב אתר",                        // Website design (singular)
      "מעצב אתרים",                       // Website designer
      // Secondary keywords (medium volume, less competition)
      "עיצוב אתר אינטרנט",                // Internet website design
      "עיצוב ממשק משתמש",                 // User interface design
      "עיצוב UI UX",                      // UI UX design
      "עיצוב אתר מודרני",                 // Modern website design
      "עיצוב אתר רספונסיבי",              // Responsive website design
      // Long-tail keywords (high conversion intent)
      "כמה עולה עיצוב אתר",               // How much does website design cost
      "עיצוב אתר לעסק קטן",               // Website design for small business
      "עיצוב אתר תדמית",                  // Portfolio website design
      "עיצוב אתר מקצועי",                 // Professional website design
      // Location-based keywords
      "עיצוב אתרים תל אביב",              // Tel Aviv
      "עיצוב אתרים ירושלים",              // Jerusalem
      "עיצוב אתרים חיפה",                 // Haifa
    ],
    canonicalUrl: "https://nexo.co.il/lp/website-design",
    ogImage: "/images/landing/website-design-og.webp",
    schema: {
      type: "ProfessionalService",
      serviceType: "Website Design Services",
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
    // Creative pink/magenta - conveys creativity, modernity, and design excellence
    accentColor: "#EC4899",
    gradient: "from-pink-900 via-fuchsia-900 to-purple-900",
    // Hero image - creative design workspace (Unsplash)
    heroImage: "/images/landing/website-design-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "עיצוב אתרים שמשאיר רושם ומייצר תוצאות",
    // Subtitle - clear benefits
    subtitle: "האתר שלכם הוא הפנים של העסק באינטרנט. הגיע הזמן שייראה בהתאם",
    // Description - creates urgency
    description: "גולשים שופטים את העסק שלכם תוך שלוש שניות. עיצוב מקצועי הוא לא מותרות - זו הכרח.",
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
    title: "מכירים את התסכול הזה?",
    subtitle: "הבעיות שעסקים מתמודדים איתם כשהאתר לא מעוצב נכון",
    items: [
      {
        icon: "Frown",
        title: "האתר נראה מיושן ולא מקצועי",
        description: "לקוחות פוטנציאליים נוטשים תוך שניות כי האתר נראה כמו משנות ה-2000. הרושם הראשוני נהרס לפני שהספקתם להציג את עצמכם.",
      },
      {
        icon: "MousePointerClick",
        title: "גולשים לא מוצאים מה שהם מחפשים",
        description: "ניווט מבלבל, מידע מפוזר, ואף אחד לא מבין מה אתם רוצים שיעשו. התוצאה? נטישה גבוהה ואפס פניות.",
      },
      {
        icon: "Smartphone",
        title: "האתר לא עובד טוב בנייד",
        description: "יותר מ-70% מהגולשים מגיעים מהטלפון, אבל האתר שלכם נראה שבור במסך קטן. אתם מפסידים את רוב הקהל.",
      },
      {
        icon: "Palette",
        title: "העיצוב לא משקף את המותג",
        description: "האתר לא מתאים לזהות שלכם - צבעים לא נכונים, פונטים לא מתאימים, ותחושה כללית שלא מייצגת אתכם.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל עיצוב אתר מקצועי?",
    subtitle: "עיצוב שמשלב יופי עם פונקציונליות - כי לא צריך לבחור",
    items: [
      {
        icon: "Sparkles",
        title: "עיצוב מותאם אישית",
        description: "לא תבניות גנריות. כל אתר מעוצב מאפס בהתאם למותג, לקהל היעד ולמטרות העסקיות שלכם.",
        highlight: true,
      },
      {
        icon: "Layout",
        title: "חוויית משתמש אינטואיטיבית (UX)",
        description: "ניווט פשוט וברור שמוביל את הגולשים בדיוק לאן שאתם רוצים. כל לחיצה מרגישה טבעית והגיונית.",
        highlight: true,
      },
      {
        icon: "Monitor",
        title: "עיצוב רספונסיבי מושלם",
        description: "האתר נראה מדהים בכל מכשיר - מחשב, טאבלט, וסמארטפון. כל פיקסל במקום הנכון.",
        highlight: true,
      },
      {
        icon: "Zap",
        title: "מהירות וביצועים",
        description: "עיצוב אופטימלי שנטען במהירות. אנחנו לא מתפשרים על חוויה חלקה וזורמת.",
      },
      {
        icon: "Paintbrush",
        title: "זהות ויזואלית עקבית",
        description: "שפה עיצובית אחידה שמחזקת את המותג - צבעים, פונטים, אייקונים וסגנון שעובדים יחד.",
      },
      {
        icon: "Target",
        title: "עיצוב ממוקד המרות",
        description: "כל אלמנט מתוכנן להוביל לפעולה - כפתורים בולטים, קריאות לפעולה ברורות, וזרימה שממירה.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "תהליך העיצוב שלנו",
    subtitle: "איך אנחנו יוצרים אתר שאתם תתגאו בו",
    steps: [
      {
        number: "01",
        title: "גילוי והבנה",
        description: "נכיר את העסק, המותג, הקהל והמטרות. נבין מה אתם צריכים, מה עובד אצל המתחרים, ומה יהפוך את האתר שלכם למיוחד.",
        icon: "Search",
      },
      {
        number: "02",
        title: "סקיצות ומוקאפים",
        description: "ניצור עיצובים ראשוניים של העמודים המרכזיים. תראו בדיוק איך האתר ייראה לפני שמתחילים לפתח - ונתאים עד שתהיו מרוצים.",
        icon: "Pencil",
      },
      {
        number: "03",
        title: "עיצוב מלא ושיפורים",
        description: "נשלים את העיצוב עם כל הפרטים - צבעים, פונטים, תמונות ואנימציות. תקבלו סבבי משוב עד שהכל מושלם.",
        icon: "Layers",
      },
      {
        number: "04",
        title: "פיתוח והשקה",
        description: "נהפוך את העיצוב לאתר חי ונושם. בדיקות מקיפות בכל מכשיר, ואז - השקה לעולם עם תמיכה שוטפת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרים שעיצבנו",
    subtitle: "הצצה לעיצובים שיצרנו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על עיצוב אתרים",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "מה ההבדל בין עיצוב אתר לבניית אתר?",
            answer: "עיצוב אתר מתמקד באיך האתר נראה ומרגיש - הצבעים, הפונטים, הפריסה וחוויית המשתמש. בניית אתר (פיתוח) היא הפיכת העיצוב לאתר עובד עם קוד. אנחנו עושים את שניהם - מעיצוב ראשוני ועד אתר מוכן לשימוש.",
          },
          {
            question: "למה עיצוב מקצועי חשוב כל כך?",
            answer: "מחקרים מראים שגולשים שופטים אתר תוך 0.05 שניות. עיצוב לא מקצועי יוצר חוסר אמון מיידי. מעבר לזה, עיצוב טוב משפר את חוויית המשתמש, מפחית נטישה, ומגדיל המרות. זה לא רק 'נראה יפה' - זה משפיע ישירות על העסק.",
          },
          {
            question: "האם אתם משתמשים בתבניות מוכנות?",
            answer: "לא. כל עיצוב נוצר מאפס בהתאם לצרכים הייחודיים שלכם. תבניות נראות גנריות ומגבילות. כשאנחנו מעצבים מאפס, אתם מקבלים אתר שבאמת מייצג את המותג שלכם ומותאם לקהל היעד.",
          },
        ],
      },
      {
        name: "תהליך ותיקונים",
        questions: [
          {
            question: "כמה סבבי תיקונים כלולים?",
            answer: "אנחנו כוללים 2-3 סבבי תיקונים בכל שלב של העיצוב. המטרה שלנו שתהיו מרוצים לחלוטין, אז אנחנו גמישים ועובדים איתכם עד שהעיצוב מושלם.",
          },
          {
            question: "כמה זמן לוקח לעצב אתר?",
            answer: "עיצוב אתר סטנדרטי (5-7 עמודים) לוקח בדרך כלל 2-3 שבועות. אתרים מורכבים יותר יכולים לקחת 4-6 שבועות. הזמן תלוי גם בכמה מהר אתם מספקים משוב ומאשרים את השלבים.",
          },
          {
            question: "מה קורה אם העיצוב לא מתאים לי?",
            answer: "לגמרי בסדר! לכן יש לנו תהליך מובנה עם מוקאפים ואישורים. אם הכיוון לא מדויק, נתאים או נתחיל מכיוון אחר. המטרה היא שתהיו גאים באתר.",
          },
        ],
      },
      {
        name: "טכני ואיכות",
        questions: [
          {
            question: "איך אתם מבטיחים שהעיצוב יהיה נגיש לכולם?",
            answer: "נגישות היא חלק בלתי נפרד מתהליך העיצוב שלנו. אנחנו מקפידים על ניגודיות צבעים מספקת, גדלי טקסט קריאים, ומבנה ברור שמאפשר ניווט קל גם למשתמשים עם מוגבלויות. כל אתר עומד בתקני WCAG.",
          },
          {
            question: "האם העיצוב יהיה מותאם לנייד?",
            answer: "בהחלט. כל עיצוב שאנחנו יוצרים הוא רספונסיבי מהיום הראשון - נראה ועובד מושלם במחשב, טאבלט וסמארטפון. זה לא תוספת, זה חלק בסיסי מהעבודה.",
          },
          {
            question: "מה אני מקבל בסוף התהליך?",
            answer: "אתם מקבלים אתר חי ועובד עם כל העיצובים מיושמים. בנוסף, נספק קבצי עיצוב מקוריים (Figma), מדריך סגנון (Brand Guidelines), והדרכה על איך לתחזק ולעדכן את האתר.",
          },
          {
            question: "איך מודדים הצלחה של עיצוב אתר?",
            answer: "עיצוב מוצלח נמדד בתוצאות: שיעור נטישה נמוך, זמן שהייה גבוה באתר, ובעיקר - יותר פניות והמרות. אנחנו עוקבים אחרי המדדים האלה ומשפרים בהתאם.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per user request)
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
    title: "מוכנים לאתר שתתגאו בו?",
    description: "בואו נדבר על איך עיצוב מקצועי יכול לשנות את הנראות של העסק שלכם באינטרנט. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב מותאם אישית",
      "חוויית משתמש מושלמת",
      "רספונסיבי לכל מכשיר",
      "תוצאות מוכחות",
    ],
  },

  // ============================================
  // RELATED SERVICES (Simple list for footer/sidebar)
  // ============================================
  relatedServices: [
    {
      name: "בניית אתרים",
      slug: "web-development",
      description: "הפכו את העיצוב לאתר חי ועובד",
    },
    {
      name: "מיתוג ועיצוב גרפי",
      slug: "branding",
      description: "זהות ויזואלית שלמה למותג שלכם",
    },
    {
      name: "קידום אורגני SEO",
      slug: "seo",
      description: "שהאתר היפה יופיע גם בתוצאות גוגל",
    },
  ],

  // ============================================
  // RELATED SERVICES BENTO GRID
  // ============================================
  relatedServicesBento: {
    title: "עיצוב הוא רק ההתחלה",
    subtitle: "שירותים משלימים לנוכחות דיגיטלית מרשימה",
    items: [
      {
        name: "מיתוג ולוגו",
        description: "זהות ויזואלית אחידה שמחזקת את המותג בכל נקודת מגע",
        href: "/services/branding",
      },
      {
        name: "עיצוב UI/UX",
        description: "חוויית משתמש מושלמת שמובילה להמרות",
        href: "/services/web-development/ui-ux-design",
      },
      {
        name: "בניית אתרים",
        description: "פיתוח מקצועי שמביא את העיצוב לחיים",
        href: "/services/web-development",
      },
      {
        name: "קידום אורגני SEO",
        description: "שהאתר המעוצב יופיע גם בתוצאות החיפוש",
        href: "/services/seo",
      },
      {
        name: "דפי נחיתה",
        description: "עמודים ממוקדי המרה לקמפיינים",
        href: "/services/web-development/landing-pages",
      },
      {
        name: "תחזוקת אתרים",
        description: "שהאתר ישאר מעודכן, מאובטח ומהיר",
        href: "/services/web-development/website-maintenance",
      },
    ],
  },
};

export default websiteDesignLandingPage;
