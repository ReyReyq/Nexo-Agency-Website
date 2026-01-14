// ============================================
// ONLINE STORE LANDING PAGE DATA
// בניית חנות אינטרנטית - Online Store Building
// ============================================
// SEO-optimized landing page for e-commerce in Israel
// All content in Hebrew with English translations in comments
// Target keyword: "בניית חנות אינטרנטית" (390 monthly searches)

import type { LandingPageData } from "@/types/landingPage";

export const onlineStoreLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "online-store",
  slug: "online-store",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית חנות אינטרנטית" (main keyword)
    title: "בניית חנות אינטרנטית | חנות וירטואלית שמוכרת 24/7 | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "בניית חנות אינטרנטית מקצועית עם סליקת אשראי, ניהול מלאי, ותשתית SEO. חנות וירטואלית שמביאה מכירות. שיחת ייעוץ ראשונית ללא עלות.",
    keywords: [
      // Primary keywords (high volume)
      "בניית חנות אינטרנטית",           // Online store building
      "חנות וירטואלית",                 // Virtual store
      "הקמת חנות אונליין",              // Setting up online store
      // Secondary keywords (medium volume, less competition)
      "בניית אתר מסחר אלקטרוני",        // E-commerce website building
      "חנות אינטרנט לעסק",              // Online store for business
      "פתיחת חנות אינטרנטית",           // Opening online store
      // Long-tail keywords (high conversion intent)
      "כמה עולה לבנות חנות אינטרנטית",  // How much does online store cost
      "חנות עם סליקת אשראי",            // Store with credit card processing
      "חנות אונליין עם ניהול מלאי",     // Online store with inventory
      "בניית חנות שופיפיי",             // Building Shopify store
      "בניית חנות ווקומרס",             // Building WooCommerce store
      // Location-based keywords
      "בניית חנות אינטרנטית ישראל",     // Online store Israel
      "חנות אונליין תל אביב",           // Online store Tel Aviv
      "מסחר אלקטרוני בישראל",           // E-commerce in Israel
    ],
    canonicalUrl: "https://nexo.agency/lp/online-store",
    ogImage: "/images/landing/online-store-hero.jpg",
    schema: {
      type: "Service",
      serviceType: "E-commerce Website Development",
      areaServed: "Israel",
      provider: {
        name: "Nexo Digital",
        url: "https://nexo.agency",
      },
    },
  },

  // ============================================
  // VISUAL THEMING
  // ============================================
  theme: {
    // Commerce/shopping orange - conveys energy, action, and trust
    accentColor: "#f59e0b",
    gradient: "from-amber-900 via-orange-900 to-amber-800",
    // E-commerce shopping background
    heroImage: "/images/landing/online-store-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בניית חנות אינטרנטית שמוכרת 24/7",
    // Subtitle - clear benefits
    subtitle: "חנות וירטואלית מקצועית עם סליקה, ניהול מלאי, ושיווק מובנה",
    // Description - creates urgency
    description: "הלקוחות שלכם כבר קונים אונליין. השאלה היא אם הם קונים מכם - או מהמתחרים.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "צפו בחנויות שבנינו",
      href: "#portfolio",
    },
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "מכירים את האתגרים האלה?",
    subtitle: "הבעיות שעסקים מתמודדים איתן בעולם המסחר האונליין",
    items: [
      {
        icon: "TrendingDown",
        title: "מפסידים מכירות למתחרים באונליין",
        description: "בזמן שהחנות הפיזית סגורה, המתחרים ממשיכים למכור. חנות אונליין פתוחה 24/7 ונגישה ללקוחות מכל הארץ.",
      },
      {
        icon: "CreditCard",
        title: "סליקת אשראי נראית מסובכת",
        description: "חיבור לחברות אשראי, דרישות אבטחה, והתממשקות טכנית - כל אלה יכולים להרתיע. צריך פתרון פשוט שעובד.",
      },
      {
        icon: "Package",
        title: "קשה לנהל מלאי ומשלוחים",
        description: "מעקב אחרי מלאי, סנכרון בין ערוצי מכירה, וחיבור לחברות משלוחים - בלי מערכת מסודרת זה הופך לכאב ראש.",
      },
      {
        icon: "Smartphone",
        title: "האתר לא מותאם לקנייה מהנייד",
        description: "רוב הישראלים קונים מהסמארטפון. אתר שלא מותאם לנייד מאבד לקוחות ויוצר חוויה מתסכלת.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כוללת חנות אינטרנטית מקצועית?",
    subtitle: "פתרון מלא למכירה אונליין - מהזמנה ראשונה ועד לקוח חוזר",
    items: [
      {
        icon: "CreditCard",
        title: "סליקת אשראי מאובטחת",
        description: "חיבור לכל חברות האשראי בישראל, ביט, PayPal ועוד. אבטחה ברמה הגבוהה ביותר לפי תקן PCI DSS.",
        highlight: true,
      },
      {
        icon: "Package",
        title: "ניהול מלאי חכם",
        description: "מערכת שמעדכנת מלאי בזמן אמת, שולחת התראות על מוצרים שנגמרים, ומסתנכרנת עם מערכות קיימות.",
        highlight: true,
      },
      {
        icon: "Truck",
        title: "חיבור לחברות משלוחים",
        description: "אינטגרציה לחברות שליחויות בישראל. חישוב עלות משלוח אוטומטי, מעקב הזמנות, והדפסת תוויות משלוח.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "חוויית קנייה מושלמת בנייד",
        description: "עיצוב שמתאים לכל גודל מסך. תהליך רכישה חלק שמעלה המרות ומפחית נטישת עגלות.",
      },
      {
        icon: "Search",
        title: "SEO למוצרים וקטגוריות",
        description: "כל מוצר וקטגוריה ממוטבים לגוגל. נתונים מובנים למוצרים, חיפוש מתקדם, וכתובות URL נקיות.",
      },
      {
        icon: "BarChart3",
        title: "דשבורד ניהול ודוחות",
        description: "מעקב אחרי מכירות, לקוחות, מוצרים פופולריים ומגמות. נתונים שעוזרים לקבל החלטות עסקיות.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך מקימים חנות אונליין?",
    subtitle: "תהליך מובנה מאפיון ועד למכירה הראשונה",
    steps: [
      {
        number: "01",
        title: "אפיון ובחירת פלטפורמה",
        description: "נבין את הצרכים העסקיים שלכם, נבחר את הפלטפורמה המתאימה - Shopify, WooCommerce, או פתרון מותאם - ונגדיר את מבנה החנות.",
        icon: "ClipboardList",
      },
      {
        number: "02",
        title: "עיצוב והתאמה למותג",
        description: "נעצב חנות ייחודית שמשקפת את המותג שלכם. חוויית משתמש שמעודדת רכישה מהדף הראשי ועד להשלמת התשלום.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח והעלאת מוצרים",
        description: "נבנה את החנות, נחבר סליקה ומשלוחים, ונעלה את קטלוג המוצרים עם תמונות, תיאורים ומחירים.",
        icon: "Code",
      },
      {
        number: "04",
        title: "השקה והדרכה",
        description: "לאחר בדיקות מקיפות, החנות עולה לאוויר. תקבלו הדרכה מלאה על ניהול הזמנות, עדכון מוצרים ושיווק.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "חנויות שבנינו",
    subtitle: "הצצה לחנויות אונליין שהקמנו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בניית חנות אינטרנטית",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "כמה זמן לוקח לבנות חנות אונליין?",
            answer: "חנות בסיסית מוכנה תוך 2-3 שבועות. חנות מתקדמת עם התאמות אישיות, אינטגרציות, והעלאת קטלוג גדול - בין 4-8 שבועות. לוחות הזמנים המדויקים נקבעים בשלב האפיון.",
          },
          {
            question: "באיזו פלטפורמה כדאי לבנות?",
            answer: "זה תלוי בעסק שלכם. Shopify מצוין להתחלה מהירה עם תחזוקה מינימלית. WooCommerce מתאים לגמישות מקסימלית ושליטה מלאה. פתרון מותאם אישית נדרש לצרכים ייחודיים. נעזור לכם לבחור את הפלטפורמה הנכונה.",
          },
          {
            question: "האם אני צריך ידע טכני כדי לנהל את החנות?",
            answer: "לא. מערכת הניהול ידידותית ופשוטה לתפעול. תקבלו הדרכה מלאה על ניהול מוצרים, הזמנות, ולקוחות. בנוסף, אנחנו זמינים לתמיכה שוטפת בכל שאלה.",
          },
        ],
      },
      {
        name: "סליקה ותשלומים",
        questions: [
          {
            question: "איך עובדת סליקת האשראי?",
            answer: "נחבר את החנות לסולק מורשה כמו PayPlus, Tranzila, או ישראכרט. הלקוח משלם באתר בצורה מאובטחת, והכסף מועבר לחשבון שלכם. הכל עומד בתקן האבטחה PCI DSS.",
          },
          {
            question: "אילו אמצעי תשלום אפשר להציע ללקוחות?",
            answer: "אנחנו מחברים את כל אמצעי התשלום הפופולריים: כרטיסי אשראי, ביט, PayPal, Apple Pay, ו-Google Pay. מגוון אפשרויות תשלום מעלה את שיעור ההמרות ומקל על הלקוחות.",
          },
          {
            question: "האם התשלומים מאובטחים?",
            answer: "לחלוטין. כל החנויות שלנו עומדות בתקני האבטחה המחמירים ביותר. הסליקה מתבצעת דרך ספקים מורשים עם הצפנה מלאה, כך שפרטי הלקוחות מוגנים.",
          },
        ],
      },
      {
        name: "משלוחים ומלאי",
        questions: [
          {
            question: "איך מנהלים משלוחים מהחנות?",
            answer: "החנות מחוברת לחברות שליחות כמו שליחי נתפץ, בורקס ודואר ישראל. לכל הזמנה נוצרת תווית משלוח אוטומטית והלקוח מקבל מספר מעקב. אפשר להציע גם איסוף עצמי.",
          },
          {
            question: "איך מסנכרנים מלאי עם חנות פיזית?",
            answer: "אפשר לחבר את החנות האונליין למערכת ERP או לתוכנת הקופה שלכם. כל מכירה - באונליין או בחנות - מעדכנת את המלאי בזמן אמת. נבדוק אילו אינטגרציות מתאימות לכם.",
          },
          {
            question: "מה קורה כשמוצר נגמר מהמלאי?",
            answer: "המערכת מאפשרת הגדרות גמישות: להסתיר מוצרים שנגמרו, להציג הודעת 'אזל מהמלאי', או לאפשר הזמנה מראש. אפשר להגדיר התראות אוטומטיות כשמוצר יורד מתחת לכמות מינימלית.",
          },
        ],
      },
      {
        name: "שיווק וקידום",
        questions: [
          {
            question: "האם החנות תופיע בגוגל?",
            answer: "החנות נבנית עם תשתית SEO מלאה: מוצרים וקטגוריות ממוטבים, נתונים מובנים לגוגל שופינג, מפת אתר אוטומטית וכתובות URL נקיות. זה נותן בסיס חזק לנראות בחיפוש.",
          },
          {
            question: "אפשר לשלוח מיילים ללקוחות?",
            answer: "בהחלט. נחבר מערכת דיוור כמו Mailchimp או Klaviyo. תוכלו לשלוח עדכונים על מבצעים, קופונים, תזכורות לעגלות נטושות, ולבנות מועדון לקוחות.",
          },
          {
            question: "איך מפעילים מבצעים והנחות?",
            answer: "מערכת ההנחות מאפשרת קופונים, הנחות כמותיות, מבצעי 1+1, הנחות לחברי מועדון ומכירות פלאש. הכל מנוהל בקלות מלוח הבקרה.",
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
    title: "מוכנים להתחיל למכור אונליין?",
    description: "בואו נדבר על איך חנות אינטרנטית מקצועית יכולה להכפיל את המכירות שלכם. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "סליקת אשראי מאובטחת",
      "ניהול מלאי חכם",
      "מותאם לנייד",
      "תמיכה שוטפת",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים משלימים לחנות",
    subtitle: "פתרונות להגדלת המכירות והצמחת העסק",
    items: [
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממומנים בגוגל ובפייסבוק שמביאים לקוחות לחנות",
        href: "/services/digital-marketing",
      },
      {
        name: "קידום אורגני SEO",
        description: "מיקום גבוה בגוגל למוצרים ולקטגוריות שלכם",
        href: "/services/seo",
      },
      {
        name: "מיתוג ועיצוב גרפי",
        description: "זהות ויזואלית שמייחדת את החנות ובונה אמון",
        href: "/services/branding",
      },
      {
        name: "ניהול רשתות חברתיות",
        description: "נוכחות פעילה שמחברת לקוחות למותג שלכם",
        href: "/services/social-media",
      },
    ],
  },
};

export default onlineStoreLandingPage;
