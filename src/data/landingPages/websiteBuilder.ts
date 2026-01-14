// ============================================
// WEBSITE BUILDER LANDING PAGE DATA
// בונה אתרים - Professional Website Builder Services
// ============================================
// SEO-optimized landing page targeting "בונה אתרים" keyword
// Monthly searches: 720 | Position: Professional service vs DIY builders
// All content in Hebrew with English translations in comments

import type { LandingPageData } from "@/types/landingPage";

export const websiteBuilderLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-builder",
  slug: "website-builder",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בונה אתרים" (main keyword)
    title: "בונה אתרים מקצועי | אתרים שמביאים תוצאות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "בונה אתרים מקצועי שבונה אתרים בהתאמה אישית לעסקים. לא תבניות מוכנות - אתר ייחודי שמותאם לקידום בגוגל וממיר מבקרים ללקוחות. שיחת ייעוץ חינם.",
    keywords: [
      // Primary keywords (high volume)
      "בונה אתרים",                          // Website builder
      "בונה אתרים מומלץ",                    // Recommended website builder
      "בונה אתרים מקצועי",                   // Professional website builder
      // Secondary keywords (medium volume)
      "בניית אתרים",                         // Website building
      "בניית אתר לעסק",                      // Website for business
      "בניית אתר בהתאמה אישית",              // Custom website building
      // Long-tail keywords (high conversion intent)
      "בונה אתרים עם קידום אורגני",          // Website builder with SEO
      "בונה אתרים וורדפרס",                  // WordPress website builder
      "בונה אתרים לעסקים קטנים",             // Website builder for small businesses
      // Comparison keywords
      "בונה אתרים מקצועי או תבנית",          // Professional builder vs template
      "בונה אתרים לא וויקס",                 // Website builder not Wix
      // Location-based keywords
      "בונה אתרים תל אביב",                  // Tel Aviv
      "בונה אתרים ישראל",                    // Israel
    ],
    canonicalUrl: "https://nexo.agency/lp/website-builder",
    ogImage: "/images/landing/website-builder-hero.jpg",
    schema: {
      type: "ProfessionalService",
      serviceType: "Website Development and Design",
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
    // Purple accent - represents creativity and building/construction
    accentColor: "#8b5cf6",
    gradient: "from-slate-900 via-purple-900 to-slate-800",
    // Hero background - modern tech workspace
    heroImage: "/images/landing/website-builder-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בונה אתרים שמבין עסקים",
    // Subtitle - clear benefits
    subtitle: "אתרים בהתאמה אישית שמביאים לקוחות - לא תבניות זולות שנראות כמו כולם",
    // Description - creates urgency and differentiates from DIY
    description: "המתחרים שלכם כבר באינטרנט. עם אתר מקצועי שנבנה במיוחד בשבילכם, תמשכו את הלקוחות הנכונים ותסגרו יותר עסקאות.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "לצפייה בעבודות",
      href: "#portfolio",
    },
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "הבעיות עם בנייה עצמית",
    subtitle: "למה בעלי עסקים מתאכזבים מתבניות מוכנות ובוני אתרים DIY",
    items: [
      {
        icon: "Copy",
        title: "האתר נראה כמו כל האחרים",
        description: "תבניות מוכנות אומרות שהאתר שלכם נראה בדיוק כמו אלפי אתרים אחרים. קשה לבלוט ולהשאיר רושם כשאתם נראים כמו כולם.",
      },
      {
        icon: "SearchX",
        title: "גוגל לא מוצא אתכם",
        description: "בוני אתרים DIY יוצרים קוד מנופח ואיטי. גוגל מעדיף אתרים מהירים ונקיים - ומדרג אותם גבוה יותר בתוצאות החיפוש.",
      },
      {
        icon: "Clock",
        title: "מבזבזים זמן במקום לעבוד",
        description: "שעות על גרירה ושחרור, התעסקות עם עיצוב ותוכן - במקום להתמקד בעסק. הזמן שלכם שווה יותר מזה.",
      },
      {
        icon: "Ban",
        title: "נתקעים עם מגבלות הפלטפורמה",
        description: "צריכים פיצ'ר מסוים? תשלמו על תוסף. רוצים שינוי בעיצוב? לא אפשרי. בונים על פלטפורמה סגורה - נשארים תלויים בה לנצח.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה מקבלים מבונה אתרים מקצועי?",
    subtitle: "ההבדל בין אתר שעובד לאתר שפשוט קיים",
    items: [
      {
        icon: "Fingerprint",
        title: "עיצוב ייחודי בהתאמה אישית",
        description: "לא תבניות. עיצוב שנבנה מאפס, מותאם לברנד שלכם ולקהל היעד. תבלטו מהמתחרים מהרגע הראשון.",
        highlight: true,
      },
      {
        icon: "Rocket",
        title: "מהירות טעינה מרשימה",
        description: "קוד נקי ואופטימיזציה ברמה הגבוהה ביותר. האתר נטען תוך שניות - מבקרים לא עוזבים וגוגל מתגמל אתכם.",
        highlight: true,
      },
      {
        icon: "Search",
        title: "מוכן לקידום בגוגל מהיום הראשון",
        description: "תשתית SEO מובנית: מבנה נכון, תגיות מותאמות, מהירות גבוהה. הבסיס שצריך כדי לעלות בתוצאות החיפוש.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מושלם בכל מכשיר",
        description: "70% מהגלישה נעשית מנייד. האתר שלכם ייראה ויעבוד מצוין בכל גודל מסך - מחשב, טאבלט, סמארטפון.",
      },
      {
        icon: "MousePointer",
        title: "ממוטב להמרות",
        description: "לא רק יפה - גם אפקטיבי. כל אלמנט מתוכנן להוביל את המבקר לפעולה: להתקשר, להשאיר פרטים, לרכוש.",
      },
      {
        icon: "Key",
        title: "בעלות מלאה שלכם",
        description: "האתר שייך לכם לחלוטין. הקוד, העיצוב, התכנים - הכל בידיים שלכם. לא תשלום חודשי ותלות בפלטפורמה.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך בונים אתר מקצועי?",
    subtitle: "תהליך ברור ושקוף מההתחלה ועד ההשקה",
    steps: [
      {
        number: "01",
        title: "שיחת היכרות ואפיון",
        description: "נכיר את העסק, הלקוחות והמתחרים. נגדיר יחד מה האתר צריך להשיג ואיך הוא צריך להיראות.",
        icon: "MessageCircle",
      },
      {
        number: "02",
        title: "עיצוב ייחודי",
        description: "מעצב מקצועי יצור עיצוב מותאם אישית. תראו איך האתר ייראה לפני שמתחילים לבנות ותוכלו לבקש שינויים.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ובנייה",
        description: "צוות המפתחים בונה את האתר עם טכנולוגיות מתקדמות. קוד נקי, מהיר, ומותאם לקידום.",
        icon: "Code",
      },
      {
        number: "04",
        title: "בדיקות והשקה",
        description: "בדיקות מקיפות בכל הדפדפנים והמכשירים. אחרי אישור סופי - האתר עולה לאוויר ואתם מקבלים הדרכה.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרים שבנינו",
    subtitle: "דוגמאות לאתרים שבנינו לעסקים כמו שלכם",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בניית אתר מקצועי",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "למה לא לבנות אתר לבד עם וויקס או סקוורספייס?",
            answer: "כלים כמו וויקס מתאימים לתחביבים ובלוגים אישיים, אבל לעסק שרוצה להתחרות ברצינות - הם מגבילים. אתרים איטיים, קוד מנופח שפוגע בקידום, עיצוב שנראה כמו כולם. אתר מקצועי מותאם אישית נותן לכם יתרון תחרותי אמיתי.",
          },
          {
            question: "כמה זמן לוקח לבנות אתר?",
            answer: "אתר תדמית סטנדרטי לוקח 2-4 שבועות. אתר גדול יותר או חנות מקוונת - 4-8 שבועות. הזמנים תלויים במורכבות הפרויקט ובמהירות שאתם מספקים תכנים ומשוב.",
          },
          {
            question: "האם אני צריך לספק תכנים?",
            answer: "כן, אתם מכירים את העסק הכי טוב. אנחנו מלווים אתכם בתהליך - מספקים מבנה והנחיות לכתיבה. לחלופין, אפשר להזמין שירותי קופירייטינג מקצועי.",
          },
        ],
      },
      {
        name: "תהליך ואיכות",
        questions: [
          {
            question: "מה ההבדל בין אתר מותאם אישית לתבנית מוכנה?",
            answer: "אתר מותאם אישית נבנה מאפס עבורכם - עיצוב ייחודי, קוד נקי ומהיר, והתאמה מדויקת לצרכי העסק. תבניות מוכנות מגבילות בעיצוב, יוצרות קוד מנופח, ומקשות על הבידול מהמתחרים.",
          },
          {
            question: "איך אתם מבטיחים איכות?",
            answer: "כל פרויקט עובר תהליך מסודר: אפיון מעמיק, עיצוב לאישורכם לפני הפיתוח, בדיקות בכל הדפדפנים והמכשירים, ובדיקות ביצועים. אתם מעורבים בכל שלב ומאשרים לפני ההשקה.",
          },
          {
            question: "מה כלול בשירות בניית האתר?",
            answer: "עיצוב ייחודי בהתאמה אישית, פיתוח מלא, התאמה לנייד, תשתית SEO, חיבור לגוגל אנליטיקס, טופס יצירת קשר, הדרכה על מערכת הניהול, ותמיכה טכנית לאחר ההשקה.",
          },
        ],
      },
      {
        name: "טכני",
        questions: [
          {
            question: "באיזו טכנולוגיה אתם בונים?",
            answer: "אנחנו בונים עם הטכנולוגיות המתקדמות ביותר - React, Next.js, או WordPress לפי הצורך. הבחירה נעשית לפי דרישות הפרויקט - מהירות, יכולת עדכון עצמאי, ואינטגרציות נדרשות.",
          },
          {
            question: "האם אוכל לעדכן את האתר בעצמי?",
            answer: "בהחלט. כל אתר מגיע עם מערכת ניהול תוכן פשוטה ואינטואיטיבית. תוכלו לעדכן טקסטים, תמונות, ולהוסיף עמודים בעצמכם. אנחנו מספקים הדרכה מלאה.",
          },
          {
            question: "מה עם אחסון ודומיין?",
            answer: "נעזור לכם לרכוש דומיין ואחסון על שמכם, כך שהאתר שייך לכם לחלוטין. אנחנו ממליצים על ספקים איכותיים ויכולים לנהל את זה בשבילכם.",
          },
        ],
      },
      {
        name: "קידום",
        questions: [
          {
            question: "האם האתר יופיע בגוגל?",
            answer: "כל אתר נבנה עם תשתית SEO מוכנה - מבנה נכון, תגיות מותאמות, מהירות גבוהה, ומפת אתר. זה נותן לכם יתרון משמעותי. לקידום אקטיבי מתמשך יש לנו שירות נפרד.",
          },
          {
            question: "כמה זמן עד שרואים תוצאות בגוגל?",
            answer: "קידום אורגני לוקח זמן - בדרך כלל 3-6 חודשים לראות תוצאות משמעותיות. עם תשתית טובה ותוכן איכותי, התהליך מהיר יותר. לתוצאות מיידיות, אפשר לשלב גם פרסום ממומן.",
          },
          {
            question: "האם אתם מציעים גם קידום אורגני?",
            answer: "כן, יש לנו צוות SEO מנוסה. אפשר להתחיל עם בניית האתר ולהוסיף קידום אורגני בהמשך, או לבחור בחבילה משולבת מהתחלה.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - Empty for now
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
    description: "בואו נדבר על העסק שלכם ונבין יחד מה האתר צריך. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב ייחודי בהתאמה אישית",
      "מהיר ומותאם לנייד",
      "מוכן לקידום בגוגל",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים שיכולים לעניין אתכם",
    subtitle: "פתרונות משלימים לאתר שלכם",
    items: [
      {
        name: "קידום אורגני SEO",
        description: "הביאו את האתר לראש תוצאות גוגל ומשכו לקוחות חדשים באופן אורגני",
        href: "/services/seo",
      },
      {
        name: "מיתוג ועיצוב גרפי",
        description: "זהות ויזואלית מקצועית שמבדלת אתכם מהמתחרים",
        href: "/services/branding",
      },
      {
        name: "חנויות מקוונות",
        description: "חנות וירטואלית מקצועית שמוכרת לכם סביב השעון",
        href: "/services/ecommerce",
      },
      {
        name: "כתיבת תוכן שיווקי",
        description: "תוכן איכותי שממיר מבקרים ללקוחות ומקדם את האתר בגוגל",
        href: "/services/content-marketing",
      },
      {
        name: "פרסום ממומן",
        description: "קמפיינים ממוקדים בגוגל ובפייסבוק שמביאים תוצאות מיידיות",
        href: "/services/digital-marketing",
      },
      {
        name: "תחזוקה ותמיכה",
        description: "שקט נפשי עם תחזוקה שוטפת ותמיכה טכנית מקצועית",
        href: "/services/web-development/website-maintenance",
      },
    ],
  },
};

export default websiteBuilderLandingPage;
