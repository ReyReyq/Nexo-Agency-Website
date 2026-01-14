// ============================================
// WEBSITE BUILDING COMPANY LANDING PAGE DATA
// חברה לבניית אתרים - Website Building Company
// ============================================
// SEO-optimized landing page for businesses searching for a website company in Israel
// Target keyword: "חברה לבניית אתרים" (590 monthly searches)
// All content in Hebrew with English translations in comments

import type { LandingPageData } from "@/types/landingPage";

export const websiteCompanyLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-company",
  slug: "website-company",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "חברה לבניית אתרים" (main keyword)
    title: "חברה לבניית אתרים מקצועית | אתרים שמביאים תוצאות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "חברה לבניית אתרים עם ניסיון של שנים בבניית אתרים לעסקים בישראל. עיצוב מותאם אישית, קידום בגוגל, ותמיכה מלאה. שיחת ייעוץ חינם.",
    keywords: [
      // Primary keywords (high volume)
      "חברה לבניית אתרים",                 // Website building company
      "חברת בניית אתרים",                  // Website building company (alt)
      "בניית אתרים לעסקים",                // Website building for businesses
      // Secondary keywords (medium volume, less competition)
      "חברה לבניית אתרים מומלצת",          // Recommended website company
      "חברת אתרים מקצועית",               // Professional website company
      "פיתוח אתרים לעסקים",               // Website development for businesses
      // Long-tail keywords (high conversion intent)
      "חברה לבניית אתרי אינטרנט",          // Internet website building company
      "חברה לבניית אתרים בישראל",          // Website company in Israel
      "שירותי בניית אתרים לחברות",         // Website services for companies
      "חברה לעיצוב ובניית אתרים",          // Design and website building company
      // Location-based keywords
      "חברה לבניית אתרים תל אביב",         // Tel Aviv
      "חברת בניית אתרים ירושלים",          // Jerusalem
      "בניית אתרים לעסקים חיפה",           // Haifa
    ],
    canonicalUrl: "https://nexo.agency/lp/website-company",
    ogImage: "/images/landing/website-company-og.webp",
    schema: {
      type: "ProfessionalService",
      serviceType: "Website Development and Design Services",
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
    // Professional dark blue - conveys corporate trust and reliability
    accentColor: "#1e40af",
    gradient: "from-slate-900 via-blue-900 to-slate-800",
    // Professional team in modern office (Unsplash)
    heroImage: "/images/landing/website-company-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "חברה לבניית אתרים שעובדת בשבילכם",
    // Subtitle - clear benefits
    subtitle: "אתרים מעוצבים שמביאים לקוחות ותוצאות עסקיות אמיתיות",
    // Description - creates urgency
    description: "לא סתם בונים אתרים - בונים כלים דיגיטליים שמגדילים מכירות, מייצרים פניות איכותיות, ומקדמים את העסק שלכם קדימה.",
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
    subtitle: "הבעיות שעסקים מתמודדים איתן כשמחפשים חברה לבניית אתרים",
    items: [
      {
        icon: "AlertTriangle",
        title: "חברות שמבטיחות הרבה ומספקות מעט",
        description: "פגשתם חברות שהבטיחו עיצוב מדהים ותוצאות מיידיות, אבל קיבלתם אתר תבניתי שנראה כמו כל האחרים. לא ככה אנחנו עובדים.",
      },
      {
        icon: "Clock",
        title: "פרויקטים שנמשכים ונמשכים",
        description: "האתר היה אמור להיות מוכן לפני חודשים, אבל עדיין אין תאריך סיום ברור? אצלנו עובדים עם לוחות זמנים ברורים ושקיפות מלאה.",
      },
      {
        icon: "DollarSign",
        title: "הפתעות לא נעימות בהצעת המחיר",
        description: "ההצעה נראתה משתלמת, אבל פתאום צצות תוספות - על עיצוב, על תוכן, על תמיכה. אצלנו תדעו בדיוק מה אתם מקבלים מראש.",
      },
      {
        icon: "HeadphonesOff",
        title: "תמיכה שנעלמת אחרי ההשקה",
        description: "ברגע שהאתר עלה לאוויר, החברה נעלמה - לא עונים, לא מעדכנים, לא זמינים. אצלנו התמיכה לא נגמרת עם השקת האתר.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "למה לבחור בנו כחברה לבניית האתר שלכם?",
    subtitle: "גישה מקצועית שמתמקדת בתוצאות עסקיות ולא רק בעיצוב יפה",
    items: [
      {
        icon: "Target",
        title: "אתרים שמותאמים למטרות העסקיות שלכם",
        description: "לפני שמתחילים לעצב, מבינים מה העסק שלכם צריך - יותר פניות? יותר מכירות? נוכחות דיגיטלית? כל החלטה נובעת מהמטרות.",
        highlight: true,
      },
      {
        icon: "Palette",
        title: "עיצוב ייחודי ומותאם אישית",
        description: "לא תבניות - כל אתר מעוצב מאפס לפי הזהות העסקית שלכם. עיצוב שמבדיל אתכם מהמתחרים ומשאיר רושם.",
        highlight: true,
      },
      {
        icon: "Search",
        title: "קידום בגוגל מובנה מהיום הראשון",
        description: "האתר נבנה עם תשתית SEO מוכנה: מבנה נכון, מהירות גבוהה, ותוכן ממוטב. כדי שלקוחות ימצאו אתכם בגוגל.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מותאם מושלם לכל מכשיר",
        description: "יותר ממחצית הגולשים מגיעים מהנייד. האתר שלכם ייראה ויעבוד מצוין במחשב, טאבלט, וסמארטפון.",
      },
      {
        icon: "Zap",
        title: "מהירות טעינה מהירה במיוחד",
        description: "אתר איטי מאבד לקוחות. אנחנו בונים אתרים מהירים שגוגל מעדיף והגולשים אוהבים.",
      },
      {
        icon: "Shield",
        title: "אבטחה ואמינות",
        description: "תעודת SSL, גיבויים אוטומטיים, והגנה מפריצות. האתר שלכם בידיים בטוחות.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך זה עובד?",
    subtitle: "תהליך עבודה שקוף ומקצועי מההתחלה ועד ההשקה",
    steps: [
      {
        number: "01",
        title: "פגישת אפיון והיכרות",
        description: "נבין את העסק, המטרות, והקהל שלכם. יחד נגדיר מה האתר צריך להשיג ומה צריך לכלול.",
        icon: "Users",
      },
      {
        number: "02",
        title: "עיצוב והצגת דמויות",
        description: "ניצור עיצוב ייחודי שמשקף את הזהות העסקית שלכם. תראו את העמודים המרכזיים לפני הפיתוח ותוכלו לבקש התאמות.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ובנייה",
        description: "נבנה את האתר עם טכנולוגיות מתקדמות. תקבלו עדכונים שוטפים וגישה לצפייה בהתקדמות.",
        icon: "Code",
      },
      {
        number: "04",
        title: "השקה, הדרכה ותמיכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה על מערכת הניהול ותמיכה מתמשכת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "עבודות שעשינו",
    subtitle: "הצצה לאתרים שבנינו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בחירת חברה לבניית אתרים",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "למה לעבוד עם חברה ולא לבנות אתר לבד?",
            answer: "בניית אתר מקצועי דורשת ידע בעיצוב, פיתוח, SEO ואבטחה. חברה מקצועית חוסכת לכם זמן יקר, מספקת תוצאה איכותית משמעותית יותר, ומבטיחה שהאתר יעבוד כמו שצריך. בנוסף, אתם מקבלים תמיכה שוטפת ולא נשארים לבד מול בעיות טכניות.",
          },
          {
            question: "איך בוחרים את החברה הנכונה?",
            answer: "כמה דברים שחשוב לבדוק: תיק עבודות ואתרים קודמים, המלצות של לקוחות אמיתיים, שקיפות בתהליך העבודה, ותמיכה לאחר ההשקה. חשוב גם לוודא שהחברה מבינה את התחום העסקי שלכם.",
          },
          {
            question: "האם האתר שייך לי לחלוטין?",
            answer: "בהחלט. בניגוד לפלטפורמות השכרה, אנחנו מעבירים את האתר לבעלותכם המלאה. הקוד, העיצוב, התכנים - הכל שלכם. אתם לא תלויים בנו ויכולים להעביר את האתר לכל מקום.",
          },
        ],
      },
      {
        name: "תהליך ואיכות",
        questions: [
          {
            question: "כמה זמן לוקח לבנות אתר?",
            answer: "אתר תדמית: 2-4 שבועות. אתר עסקי מורכב: 4-8 שבועות. חנות אונליין: 6-12 שבועות. לוחות הזמנים תלויים גם בקצב אספקת התכנים מצדכם.",
          },
          {
            question: "איך מבטיחים שהאתר יהיה איכותי?",
            answer: "אנחנו עובדים בתהליך מובנה: אפיון מעמיק, עיצוב ייחודי (לא תבניות), פיתוח בקוד נקי, ובדיקות מקיפות לפני העלייה לאוויר. בכל שלב תקבלו עדכונים ותוכלו לבקש שינויים.",
          },
          {
            question: "מה ההבדל בין תבנית לאתר מותאם אישית?",
            answer: "אתר תבנית זול יותר אבל מוגבל - נראה דומה לאתרים אחרים וקשה להתאים. אתר מותאם אישית מעוצב בדיוק לפי הצרכים שלכם, עם גמישות מלאה ותוצאה ייחודית שמבדילה אתכם מהמתחרים.",
          },
        ],
      },
      {
        name: "טכני ותמיכה",
        questions: [
          {
            question: "אוכל לערוך את האתר בעצמי?",
            answer: "בהחלט. אנחנו בונים אתרים עם מערכת ניהול תוכן נוחה שמאפשרת לעדכן טקסטים, תמונות ולהוסיף עמודים בקלות - בלי צורך בידע טכני. גם מספקים הדרכה מלאה.",
          },
          {
            question: "מה קורה אם נתקלתי בבעיה?",
            answer: "אנחנו מספקים תמיכה טכנית לכל הלקוחות. בעיות דחופות נפתרות תוך שעות, ובעיות רגילות תוך 1-2 ימי עבודה. צוות התמיכה שלנו זמין בטלפון ובמייל.",
          },
          {
            question: "האם האתר יופיע בגוגל?",
            answer: "האתר נבנה עם תשתית SEO מוכנה: מבנה טכני נכון, מהירות גבוהה, ותגיות מותאמות. זה נותן לכם יתרון משמעותי. לקידום אקטיבי מתמשך (בניית קישורים, כתיבת תוכן שוטף) אנחנו מציעים שירות נפרד.",
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
    title: "מוכנים לאתר שעובד בשבילכם?",
    description: "בואו נדבר על איך אתר מקצועי יכול לקדם את העסק שלכם. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
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
      "קידום בגוגל מובנה",
      "תשלום חד פעמי",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "השירותים שלנו",
    subtitle: "פתרונות דיגיטליים מקיפים לעסק שלכם",
    items: [
      {
        name: "בניית אתרים",
        description: "אתרים מותאמים אישית שממירים מבקרים ללקוחות",
        href: "/services/web-development",
      },
      {
        name: "מיתוג ועיצוב",
        description: "זהות ויזואלית חזקה שמבדילה אתכם מהמתחרים",
        href: "/services/branding",
      },
      {
        name: "קידום אורגני SEO",
        description: "עלו לראש תוצאות גוגל והגיעו ללקוחות חדשים",
        href: "/services/seo",
      },
      {
        name: "חנות אונליין",
        description: "פתרון מסחר אלקטרוני מקצועי שמוכר 24/7",
        href: "/services/ecommerce",
      },
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממוקדים שמביאים תוצאות מדידות",
        href: "/services/digital-marketing",
      },
      {
        name: "בינה מלאכותית",
        description: "פתרונות AI שחוסכים זמן ומייעלים תהליכים",
        href: "/services/ai-automation",
      },
    ],
  },
};

export default websiteCompanyLandingPage;
