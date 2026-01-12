// ============================================
// BUSINESS WEBSITES LANDING PAGE DATA
// בניית אתרים לעסקים - Website Building for Businesses
// ============================================
// SEO-optimized landing page for small and medium businesses in Israel
// All content in Hebrew with English translations in comments
// Keywords researched: בניית אתרים לעסקים, אתר לעסק, בניית אתר לעסק קטן

import type { LandingPageData } from "@/types/landingPage";

export const businessWebsitesLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "business-websites",
  slug: "business-websites",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית אתרים לעסקים" (main keyword - 1,300 monthly searches)
    title: "בניית אתרים לעסקים | אתר מקצועי שמגדיל מכירות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "אתר לעסק שעובד 24/7, מביא לקוחות חדשים ובונה אמינות. מותאם לנייד, ממוטב לגוגל, עם תמיכה מלאה. שיחת ייעוץ ראשונית ללא עלות.",
    keywords: [
      // Primary keywords (high volume)
      "בניית אתרים לעסקים",              // Website building for businesses (main keyword)
      "אתר לעסק",                         // Website for business
      "בניית אתר לעסק קטן",               // Building website for small business
      // Secondary keywords (medium volume, less competition)
      "אתר לעסק קטן",                     // Website for small business
      "בניית אתרים לעסקים קטנים",         // Website building for small businesses
      "עיצוב אתר לעסק",                   // Website design for business
      "אתר תדמית לעסק",                   // Portfolio website for business
      // Long-tail keywords (high conversion intent)
      "כמה עולה אתר לעסק",                // How much does a business website cost
      "בניית אתר לעסק מחיר",              // Building business website price
      "אתר לעסק עם מערכת ניהול",          // Business website with CMS
      "אתר מותאם לנייד לעסק",             // Mobile-friendly business website
      // Location-based keywords
      "בניית אתרים לעסקים תל אביב",       // Tel Aviv
      "אתר לעסק ירושלים",                 // Jerusalem
      "בניית אתר לעסק חיפה",              // Haifa
      "בניית אתרים לעסקים באר שבע",       // Be'er Sheva
    ],
    canonicalUrl: "https://nexo.co.il/lp/business-websites",
    ogImage: "/images/landing/business-websites-og.webp",
    schema: {
      type: "ProfessionalService",
      serviceType: "Website Development for Businesses",
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
    // Professional teal/green - conveys growth, trust and professionalism
    accentColor: "#0D9488",
    gradient: "from-slate-900 via-teal-900 to-slate-800",
    // Business office professional setting
    heroImage: "/images/landing/business-websites-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בניית אתרים לעסקים שמביאים לקוחות",
    // Subtitle - clear benefits
    subtitle: "נוכחות דיגיטלית מקצועית שבונה אמינות ומגדילה מכירות",
    // Description - creates urgency
    description: "הלקוחות שלכם מחפשים עסקים כמו שלכם בגוגל - ברגע זה ממש. האם הם מוצאים אתכם עם אתר מקצועי, או פונים למתחרים?",
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
    subtitle: "הבעיות שעסקים מתמודדים איתן בעולם הדיגיטלי",
    items: [
      {
        icon: "TrendingDown",
        // Losing customers to competitors
        title: "לקוחות פונים למתחרים",
        description: "בלי אתר מקצועי, לקוחות פוטנציאליים שמחפשים בגוגל פשוט לא מוצאים אתכם. הם מגיעים למתחרים שלכם - ונשארים שם.",
      },
      {
        icon: "Clock",
        // No time for marketing
        title: "אין זמן לשיווק דיגיטלי",
        description: "אתם עסוקים בניהול העסק, בשירות לקוחות ובמכירות. אתם צריכים אתר שעובד בשבילכם 24/7 - גם כשאתם לא ליד המחשב.",
      },
      {
        icon: "Eye",
        // Lack of credibility without website
        title: "חוסר אמינות בעיני לקוחות",
        description: "עסק בלי אתר או עם אתר מיושן נראה לא מקצועי. לקוחות בודקים אתכם אונליין לפני שהם פונים - מה הם מגלים?",
      },
      {
        icon: "Smartphone",
        // Old website not mobile-friendly
        title: "האתר לא מותאם לנייד",
        description: "למעלה מ-70% מהגלישות נעשות מהנייד. אתר שלא עובד טוב בסמארטפון מרחיק לקוחות ופוגע בדירוג שלכם בגוגל.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל אתר לעסק שלכם?",
    subtitle: "פתרון מלא שנבנה במיוחד לצרכים של עסקים קטנים ובינוניים",
    items: [
      {
        icon: "Users",
        // Generates leads and customers
        title: "מייצר פניות ולקוחות חדשים",
        description: "אתר שנבנה להמיר מבקרים ללקוחות - עם טפסי יצירת קשר חכמים, כפתורי התקשרות בולטים וקריאות לפעולה ברורות.",
        highlight: true,
      },
      {
        icon: "Search",
        // SEO optimized
        title: "ממוטב לגוגל מהיום הראשון",
        description: "תשתית SEO מובנית: מבנה טכני נכון, מהירות טעינה גבוהה ותגיות מותאמות - כדי שלקוחות ימצאו אתכם בחיפוש.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        // Mobile responsive
        title: "מושלם בכל מכשיר",
        description: "עיצוב רספונסיבי שנראה ועובד מעולה בנייד, טאבלט ומחשב. הלקוחות שלכם יקבלו חוויה מושלמת מכל מקום.",
        highlight: true,
      },
      {
        icon: "Shield",
        // Professional credibility
        title: "בונה אמינות ומקצועיות",
        description: "עיצוב מודרני ומקצועי שמשדר אמון. הלקוחות יבינו מיד שאתם עסק רציני שאפשר לסמוך עליו.",
      },
      {
        icon: "Zap",
        // Fast loading
        title: "מהירות טעינה גבוהה",
        description: "אתר איטי = לקוחות שעוזבים. האתר שלכם ייטען תוך שניות ויספק חוויה חלקה ומהירה.",
      },
      {
        icon: "Settings",
        // Easy to manage
        title: "קל לניהול ועדכון",
        description: "מערכת ניהול פשוטה שמאפשרת לכם לעדכן תכנים, להוסיף מוצרים או שירותים ולנהל את האתר בעצמכם - בלי צורך בידע טכני.",
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
        // Discovery and requirements
        title: "שיחת היכרות ואפיון",
        description: "נכיר את העסק שלכם לעומק, נבין את הצרכים והמטרות. יחד נגדיר מה האתר צריך לכלול ואיך הוא יעזור לכם להשיג את היעדים.",
        icon: "Users",
      },
      {
        number: "02",
        // Design mockups
        title: "עיצוב והצגת מוקאפים",
        description: "ניצור עיצוב ייחודי שמתאים לזהות העסקית שלכם. תקבלו לראות את העמודים המרכזיים לפני שמתחילים לבנות.",
        icon: "Palette",
      },
      {
        number: "03",
        // Development
        title: "פיתוח ובנייה",
        description: "נבנה את האתר עם טכנולוגיות מתקדמות. לאורך הדרך תקבלו עדכונים שוטפים ונקודות ביקורת לאישור.",
        icon: "Code",
      },
      {
        number: "04",
        // Launch and training
        title: "השקה והדרכה",
        description: "לאחר בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה מלאה על מערכת הניהול וליווי לתקופה שאחרי.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "עבודות שעשינו",
    subtitle: "הצצה לאתרים שבנינו לעסקים כמו שלכם",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בניית אתר לעסק",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            // Why does a business need a website?
            question: "למה העסק שלי צריך אתר?",
            answer: "כיום רוב הלקוחות מחפשים עסקים בגוגל לפני שהם מתקשרים או מגיעים פיזית. אתר מקצועי בונה אמינות, מציג את המוצרים והשירותים שלכם, ומאפשר ללקוחות להגיע אליכם 24/7. עסק בלי אתר פשוט לא קיים עבור חלק גדול מהלקוחות הפוטנציאליים.",
          },
          {
            // What types of websites do you build?
            question: "איזה סוגי אתרים אתם בונים?",
            answer: "אנחנו בונים מגוון אתרים לעסקים: אתרי תדמית, דפי נחיתה, אתרי חנות (e-commerce), אתרי קטלוג מוצרים, ואתרים עם מערכות מותאמות אישית. נתאים את הפתרון לצרכים ולתקציב שלכם.",
          },
          {
            // Will the website be mine?
            question: "האם האתר יהיה שלי לחלוטין?",
            answer: "כן, 100%. בניגוד לפלטפורמות השכרה, אנחנו מעבירים את האתר לבעלותכם המלאה. הקוד, העיצוב, התכנים - הכל שלכם. אתם לא תלויים בנו ויכולים להעביר את האתר לכל מקום אחר.",
          },
        ],
      },
      {
        name: "איכות ותוצאות",
        questions: [
          {
            // What makes your websites different?
            question: "מה מבדיל את האתרים שאתם בונים?",
            answer: "אנחנו לא משתמשים בתבניות מוכנות. כל אתר נבנה מאפס, מותאם לעסק שלכם ולקהל היעד. אנחנו משלבים עיצוב מקצועי עם תשתית טכנית מתקדמת - כך שהאתר גם נראה מעולה וגם מביא תוצאות אמיתיות.",
          },
          {
            // How do you ensure quality?
            question: "איך אתם מבטיחים איכות?",
            answer: "כל אתר עובר תהליך בדיקות מקיף: בדיקות תצוגה בכל המכשירים, בדיקות מהירות, בדיקות נגישות, ובדיקות SEO טכני. אנחנו לא משיקים אתר לפני שהוא עומד בסטנדרטים הגבוהים שלנו.",
          },
          {
            // What results can I expect?
            question: "אילו תוצאות אני יכול לצפות?",
            answer: "אתר מקצועי הוא הבסיס לכל הפעילות הדיגיטלית. לקוחות מדווחים על עלייה בפניות, שיפור באמינות מול לקוחות, והרבה יותר קל להם לשווק את העסק. התוצאות המדויקות תלויות בתחום ובאסטרטגיה השיווקית הכוללת.",
          },
        ],
      },
      {
        name: "תהליך ולוחות זמנים",
        questions: [
          {
            // How long does it take?
            question: "כמה זמן לוקח לבנות אתר?",
            answer: "תלוי בהיקף הפרויקט. דף נחיתה יכול להיות מוכן תוך שבוע-שבועיים. אתר תדמית סטנדרטי לוקח 3-4 שבועות. אתר עם חנות או מערכות מורכבות יכול לקחת 6-8 שבועות. נספק לכם לוח זמנים מדויק בתחילת הפרויקט.",
          },
          {
            // What do I need to provide?
            question: "מה אני צריך לספק?",
            answer: "בעיקר תכנים: טקסטים על העסק והשירותים, תמונות (או שנעזור למצוא), לוגו אם יש, ופרטי קשר. אנחנו מלווים אתכם בכל השלבים ועוזרים לארגן את החומרים.",
          },
          {
            // Can I make changes during the process?
            question: "אפשר לעשות שינויים תוך כדי התהליך?",
            answer: "בהחלט. יש נקודות ביקורת לאורך הדרך - אחרי העיצוב, באמצע הפיתוח, ולפני ההשקה. זה הזמן לעשות שינויים והתאמות. שינויים גדולים אחרי שהאתר עלה לאוויר עשויים להיות בתוספת עלות.",
          },
        ],
      },
      {
        name: "קידום ותמיכה",
        questions: [
          {
            // Will the site appear in Google?
            question: "האם האתר יופיע בגוגל?",
            answer: "האתר נבנה עם תשתית SEO: מבנה טכני נכון, מהירות טעינה גבוהה, ותגיות מותאמות. זה נותן לכם בסיס טוב. לקידום אקטיבי מתמשך (בניית קישורים, כתיבת תוכן, אופטימיזציה) אנחנו מציעים שירותי SEO נפרדים.",
          },
          {
            // What support do you provide?
            question: "איזו תמיכה אתם נותנים?",
            answer: "אחרי ההשקה אתם מקבלים הדרכה מלאה על מערכת הניהול ותקופת תמיכה טכנית. לאחר מכן, אפשר להצטרף לחבילת תחזוקה חודשית שכוללת עדכונים, גיבויים, אבטחה ותמיכה שוטפת.",
          },
          {
            // Can you connect to external systems?
            question: "אפשר לחבר את האתר למערכות אחרות?",
            answer: "כן. אפשר לחבר לסליקה (ישראכרט, פייבוקס), לרשתות חברתיות, ל-Google Analytics, למערכות דיוור, ל-CRM ועוד. נבדוק יחד מה רלוונטי לעסק שלכם.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per template structure)
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
    title: "מוכנים לאתר שמביא תוצאות?",
    description: "בואו נדבר על איך אתר מקצועי יכול לקחת את העסק שלכם לשלב הבא. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב מקצועי ומותאם אישית",
      "מותאם לנייד וממוטב לגוגל",
      "בעלות מלאה על האתר",
      "ליווי ותמיכה מקצועית",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid
  // ============================================
  relatedServices: {
    title: "שירותים נוספים לעסק שלכם",
    subtitle: "פתרונות דיגיטליים משלימים שיעזרו לכם לצמוח",
    items: [
      {
        name: "קידום אתרים SEO",
        description: "עלו לראש תוצאות גוגל והביאו לקוחות חדשים באופן אורגני",
        href: "/services/seo",
      },
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממומנים שמביאים תוצאות מיידיות",
        href: "/services/digital-marketing",
      },
      {
        name: "חנות אונליין",
        description: "מכרו את המוצרים שלכם ישירות באינטרנט, 24/7",
        href: "/services/ecommerce",
      },
      {
        name: "מיתוג ועיצוב גרפי",
        description: "זהות חזותית מקצועית שמבדלת אתכם מהמתחרים",
        href: "/services/branding",
      },
      {
        name: "ניהול רשתות חברתיות",
        description: "בנו קהילה ונוכחות חזקה ברשתות החברתיות",
        href: "/services/social-media",
      },
      {
        name: "כתיבת תוכן שיווקי",
        description: "תוכן איכותי שמושך לקוחות ומשפר את הדירוג בגוגל",
        href: "/services/content",
      },
    ],
  },
};

export default businessWebsitesLandingPage;
