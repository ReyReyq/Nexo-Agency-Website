// ============================================
// SALES WEBSITE LANDING PAGE DATA
// בניית אתר מכירות - Sales Website Building
// ============================================
// SEO-optimized landing page for e-commerce and sales websites in Israel
// Target keyword: בניית אתר מכירות (720 monthly searches)
// All content in Hebrew with English translations in comments

import type { LandingPageData } from "@/types/landingPage";

export const salesWebsiteLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "sales-website",
  slug: "sales-website",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית אתר מכירות" (main keyword)
    title: "בניית אתר מכירות | אתר איקומרס שמוכר 24/7 | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "בניית אתר מכירות מקצועי שעובד עבורכם מסביב לשעון. חנות אינטרנטית מותאמת לנייד, ממוטבת להמרות, עם מערכת סליקה מאובטחת. התחילו למכור היום.",
    keywords: [
      // Primary keywords (high volume)
      "בניית אתר מכירות",                 // Sales website building
      "אתר מכירות",                        // Sales website
      "חנות אינטרנטית",                    // Online store
      // Secondary keywords (medium volume, less competition)
      "בניית אתר איקומרס",                 // E-commerce website building
      "אתר e-commerce",                    // E-commerce website
      "חנות וירטואלית",                    // Virtual store
      "הקמת חנות אונליין",                 // Setting up online store
      // Long-tail keywords (high conversion intent)
      "כמה עולה אתר מכירות",               // How much does a sales website cost
      "בניית אתר למכירת מוצרים",           // Building website to sell products
      "אתר מכירות עם סליקה",               // Sales website with payment processing
      "אתר מכירות מותאם נייד",             // Mobile-friendly sales website
      "חנות אינטרנטית לעסק קטן",           // Online store for small business
      // Platform-related keywords
      "אתר מכירות וורדפרס",                // WordPress sales website
      "אתר ווקומרס",                       // WooCommerce website
      "חנות שופיפיי",                      // Shopify store
      // Location-based keywords
      "בניית אתר מכירות תל אביב",          // Tel Aviv
      "חנות אינטרנטית ירושלים",            // Jerusalem
      "אתר איקומרס חיפה",                  // Haifa
    ],
    canonicalUrl: "https://nexo.agency/lp/sales-website",
    ogImage: "/images/landing/sales-website-og.webp",
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
    // Sales red - conveys urgency, action, and conversion focus
    accentColor: "#ef4444",
    gradient: "from-slate-900 via-red-900 to-slate-800",
    // E-commerce/shopping hero image (Unsplash)
    heroImage: "/images/landing/sales-website-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בניית אתר מכירות שעובד בשבילכם 24/7",
    // Subtitle - clear benefits
    subtitle: "הפכו את העסק שלכם למכונת מכירות אוטומטית",
    // Description - creates urgency
    description: "בזמן שאתם ישנים, הלקוחות קונים. אתר מכירות מקצועי עם מערכת סליקה מאובטחת, ממשק ניהול פשוט, ועיצוב שממיר מבקרים לקונים.",
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
    title: "מכירים את האתגרים האלה?",
    subtitle: "הבעיות שבעלי עסקים מתמודדים איתן כשרוצים למכור אונליין",
    items: [
      {
        icon: "ShoppingCart",
        title: "מפסידים מכירות ללא אתר",
        description: "כל יום בלי אתר מכירות הוא יום של הכנסה אבודה. הלקוחות שלכם קונים מהמתחרים כי לכם אין נוכחות דיגיטלית.",
      },
      {
        icon: "Clock",
        title: "מוגבלים לשעות פעילות",
        description: "חנות פיזית סגורה בלילה ובסופי שבוע. אתר מכירות פתוח 24/7, 365 ימים בשנה - גם כשאתם בחופשה.",
      },
      {
        icon: "MapPin",
        title: "תקועים בגיאוגרפיה",
        description: "חנות פיזית מוגבלת לסביבה הקרובה. עם אתר מכירות אתם מגיעים ללקוחות בכל הארץ - ואפילו בעולם.",
      },
      {
        icon: "TrendingDown",
        title: "אחוזי המרה נמוכים",
        description: "אתר שלא בנוי נכון מבריח לקוחות. עיצוב לא מקצועי, תהליך רכישה מסובך, או מהירות איטית - וההזמנה הולכת למתחרה.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל אתר מכירות מקצועי?",
    subtitle: "כל מה שצריך כדי למכור אונליין בהצלחה",
    items: [
      {
        icon: "CreditCard",
        title: "מערכת סליקה מאובטחת",
        description: "תשלום בכרטיס אשראי, ביט, פייפאל ועוד. כל העסקאות מוצפנות ומאובטחות לפי תקן PCI-DSS.",
        highlight: true,
      },
      {
        icon: "Package",
        title: "ניהול מוצרים פשוט",
        description: "ממשק ניהול ידידותי להוספה, עריכה וארגון מוצרים. תמונות, תיאורים, מחירים ומלאי - הכל במקום אחד.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מותאם לנייד בצורה מושלמת",
        description: "יותר מ-60% מהקניות מתבצעות מהנייד. האתר שלכם יעבוד ויראה מעולה בכל מכשיר.",
        highlight: true,
      },
      {
        icon: "Truck",
        title: "אינטגרציה עם חברות משלוח",
        description: "חיבור לדואר ישראל, חברות שליחויות ונקודות איסוף. חישוב משלוח אוטומטי ומעקב הזמנות.",
      },
      {
        icon: "Search",
        title: "אופטימיזציה לגוגל",
        description: "מבנה SEO נכון כדי שמוצרים יופיעו בחיפושים. תגיות מותאמות, מהירות טעינה, ו-Schema מובנה.",
      },
      {
        icon: "BarChart",
        title: "דוחות ואנליטיקס",
        description: "מעקב מכירות, התנהגות לקוחות ואחוזי המרה. נתונים שעוזרים לקבל החלטות עסקיות חכמות.",
      },
      {
        icon: "Users",
        title: "ניהול לקוחות",
        description: "מאגר לקוחות עם היסטוריית הזמנות. אפשרות לקופונים, מבצעים ותוכניות נאמנות.",
      },
      {
        icon: "Shield",
        title: "אבטחה ברמה הגבוהה ביותר",
        description: "תעודת SSL, גיבויים אוטומטיים והגנה מפני התקפות. השקט הנפשי שאתם והלקוחות שלכם צריכים.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך זה עובד?",
    subtitle: "מהרעיון ועד לחנות אונליין פעילה - בתהליך פשוט ושקוף",
    steps: [
      {
        number: "01",
        title: "שיחת אפיון ותכנון",
        description: "נבין את העסק, המוצרים, וקהל היעד שלכם. יחד נגדיר את המבנה, הפיצ'רים הנדרשים, ואת התקציב.",
        icon: "ClipboardList",
      },
      {
        number: "02",
        title: "עיצוב שממיר",
        description: "נעצב חנות שמזמינה לקנות. עיצוב נקי, קריאה לפעולה ברורה, ותהליך רכישה קצר ופשוט.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ואינטגרציות",
        description: "נבנה את האתר, נחבר סליקה ומשלוחים, נעלה את המוצרים ונוודא שהכל עובד חלק.",
        icon: "Code",
      },
      {
        number: "04",
        title: "השקה והדרכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה מלאה על ניהול החנות ותמיכה שוטפת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "חנויות שבנינו",
    subtitle: "דוגמאות לאתרי מכירות שבנינו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "תשובות לשאלות הכי נפוצות על בניית אתר מכירות",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "כמה זמן לוקח לבנות אתר מכירות?",
            answer: "אתר מכירות סטנדרטי לוקח 2-4 שבועות. פרויקטים גדולים יותר עם מאות מוצרים ואפיון מורכב יכולים לקחת 6-8 שבועות. לוח הזמנים המדויק נקבע בשיחת האפיון.",
          },
          {
            question: "האם אוכל לנהל את החנות בעצמי?",
            answer: "בהחלט. אנחנו בונים את האתר עם ממשק ניהול פשוט וידידותי. תוכלו להוסיף מוצרים, לשנות מחירים, לנהל הזמנות ולעקוב אחרי מכירות - בלי צורך בידע טכני. אתם גם מקבלים הדרכה מלאה.",
          },
          {
            question: "האם האתר יהיה בבעלותי המלאה?",
            answer: "כן, 100%. בניגוד לפלטפורמות השכרה, האתר עובר לבעלותכם המלאה. הקוד, העיצוב, התכנים - הכל שלכם. אתם לא תלויים בנו ויכולים להעביר את האתר לכל מקום.",
          },
          {
            question: "איך מגדילים את אחוזי ההמרה בחנות?",
            answer: "אנחנו מיישמים שיטות מוכחות להגדלת המרות: תהליך רכישה קצר ופשוט, תמונות מוצר איכותיות, ביקורות לקוחות, כפתורי קריאה לפעולה בולטים, ומהירות טעינה גבוהה. בנוסף, מערכת האנליטיקס מאפשרת לזהות נקודות נטישה ולשפר אותן.",
          },
          {
            question: "אילו תכונות חיוניות לחנות אונליין מצליחה?",
            answer: "חנות מצליחה כוללת: חיפוש מתקדם וסינון מוצרים, עמודי מוצר עשירים עם תמונות וסרטונים, המלצות למוצרים משלימים, סל קניות שמור, מגוון אמצעי תשלום, ומעקב הזמנות ללקוח. כל אלה כלולים באתרים שלנו.",
          },
        ],
      },
      {
        name: "תשלומים ומשלוחים",
        questions: [
          {
            question: "אילו אמצעי תשלום אפשר לחבר?",
            answer: "נחבר כל אמצעי תשלום שתרצו: כרטיסי אשראי (ויזה, מאסטרקארד, אמריקן אקספרס), ביט, פייפאל, אפל פיי, גוגל פיי ועוד. אנחנו עובדים עם כל חברות הסליקה בישראל - טרנזילה, קארדקום, פלאקארד ואחרות.",
          },
          {
            question: "איך מתנהל נושא המשלוחים?",
            answer: "נחבר את האתר לשירותי המשלוחים שאתם עובדים איתם - דואר ישראל, שליחים עד הבית, נקודות איסוף ועוד. הלקוח יראה את עלות המשלוח בזמן אמת ויוכל לבחור את האפשרות המתאימה לו.",
          },
          {
            question: "האם אפשר לשלוח לחו\"ל?",
            answer: "כן. נגדיר אזורי משלוח, מחירים שונים לכל אזור, ואפילו מטבעות שונים אם צריך. אפשר גם לחשב מיסים ומכסים אוטומטית עבור משלוחים בינלאומיים.",
          },
        ],
      },
      {
        name: "טכנולוגיה",
        questions: [
          {
            question: "באיזו פלטפורמה האתר נבנה?",
            answer: "בדרך כלל אנחנו ממליצים על וורדפרס עם ווקומרס - הפלטפורמה הפופולרית בעולם לחנויות אינטרנטיות. היא גמישה, ניתנת להתאמה אישית מלאה, וקוד פתוח כך שאתם לא תקועים. לפרויקטים גדולים במיוחד יש גם אופציות אחרות.",
          },
          {
            question: "האם האתר יהיה מאובטח?",
            answer: "בהחלט. כל אתר כולל תעודת SSL (הכרחי לסליקה), גיבויים אוטומטיים, הגנה מפני התקפות, ועמידה בתקני אבטחה. הלקוחות שלכם יכולים לקנות בביטחון מלא.",
          },
          {
            question: "מה קורה אם יש תקלה?",
            answer: "אנחנו מציעים חבילות תחזוקה ותמיכה שוטפת. אם משהו לא עובד - אנחנו כאן לטפל. גם בלי חבילת תמיכה, אפשר לפנות אלינו לתיקונים בתשלום.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per template)
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
    description: "בואו נדבר על איך חנות אינטרנטית מקצועית יכולה להגדיל את ההכנסות שלכם. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "מערכת סליקה מאובטחת",
      "מותאם לנייד",
      "ניהול מוצרים פשוט",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים משלימים לחנות שלכם",
    subtitle: "פתרונות שיעזרו למכור יותר",
    items: [
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממוקדים שמביאים לקוחות לחנות",
        href: "/services/digital-marketing",
      },
      {
        name: "קידום אורגני",
        description: "תנועה איכותית מגוגל לעמודי המוצרים",
        href: "/services/seo",
      },
      {
        name: "כתיבת תוכן שיווקי",
        description: "תיאורי מוצרים שמניעים לפעולה",
        href: "/services/branding",
      },
      {
        name: "ניהול רשתות חברתיות",
        description: "בניית קהילה סביב המותג שלכם",
        href: "/services/social-media",
      },
      {
        name: "אוטומציות עסקיות",
        description: "חיסכון בזמן עם תהליכים אוטומטיים",
        href: "/services/ai-automation",
      },
      {
        name: "תחזוקה ותמיכה",
        description: "שקט נפשי עם טיפול שוטף באתר",
        href: "/services/web-development",
      },
    ],
  },
};

export default salesWebsiteLandingPage;
