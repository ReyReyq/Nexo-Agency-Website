export interface CaseStudy {
  id: string;
  slug: string;
  // Basic Info
  title: string;
  client: string;
  category: string;
  year: string;
  duration: string;
  services: string[];
  website?: string;

  // Hero
  heroImage: string;
  tagline: string;

  // Overview
  overview: string;

  // Brand Story - How the client came to us
  brandStory?: {
    title: string;
    narrative: string;
    clientVision: string;
  };

  // Design Process
  designProcess?: {
    discovery: {
      title: string;
      description: string;
      highlights: string[];
    };
    strategy: {
      title: string;
      description: string;
      highlights: string[];
    };
    design: {
      title: string;
      description: string;
      highlights: string[];
    };
    development: {
      title: string;
      description: string;
      highlights: string[];
    };
  };

  // Brand Identity
  brandIdentity?: {
    logo: {
      description: string;
      rationale: string;
    };
    colorPalette: {
      description: string;
      colors: {
        name: string;
        hex: string;
        usage: string;
      }[];
    };
    typography: {
      description: string;
      fonts: {
        name: string;
        usage: string;
      }[];
    };
    visualLanguage: string;
  };

  // Challenge & Solution
  challenge: string;
  solution: string;

  // Results/Metrics
  results: {
    label: string;
    value: string;
    description?: string;
  }[];

  // Gallery
  gallery: {
    src: string;
    alt: string;
    caption?: string;
  }[];

  // AI Models (optional - for showcasing AI-generated content)
  aiModels?: {
    title: string;
    description: string;
    images: {
      src: string;
      alt: string;
      caption?: string;
    }[];
  };

  // Brand Colors (for theming the case study page)
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };

  // Testimonial (optional)
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };

  // Navigation
  nextProject?: string;
  prevProject?: string;
}

export const caseStudies: CaseStudy[] = [
  // SimplyHebrew - Hebrew Learning Platform
  {
    id: "simplyhebrew",
    slug: "simplyhebrew",

    // Basic Info
    title: "SimplyHebrew",
    client: "SimplyHebrew",
    category: "EdTech",
    year: "2025",
    duration: "6 שבועות",
    services: [
      "אסטרטגיית מותג ומיצוב",
      "עיצוב זהות חזותית",
      "עיצוב UX/UI",
      "פיתוח אתר רספונסיבי",
      "אופטימיזציה להמרות",
      "אינטגרציות ואוטומציות",
      "ייעוץ צמיחה דיגיטלית"
    ],
    website: "https://simplyhebrew.net",

    // Hero
    heroImage: "/portfolio/simplyhebrew/simply-hero-img-optimized.webp",
    tagline: "Learn Hebrew, The Human Way",

    // Overview
    overview: `SimplyHebrew היא פלטפורמה חדשנית ללימוד עברית מקוונת, שנוצרה מתוך אמונה עמוקה שהדרך האמיתית לרכוש שפה היא דרך אנשים, לא דרך אפליקציות. הפלטפורמה מחברת יהודים אמריקאים עם מורים ישראלים ילידי הארץ, בשיעורים חיים פעמיים בשבוע בקבוצות קטנות ואינטימיות.

בעולם מוצף באפליקציות לימוד שפות, SimplyHebrew בחרה בדרך אחרת - הדרך האנושית. כל שיעור מתקיים עם מורה ישראלי אמיתי שגדל עם העברית, בקבוצות של 3-7 תלמידים בלבד. הגישה הזו מאפשרת תרגול שיחה אמיתי, תיקון הגייה מיידי, והקשר תרבותי שאף אלגוריתם לא יכול לספק.`,

    // Brand Story
    brandStory: {
      title: "מאמונה ללמידה אמיתית",
      narrative: `SimplyHebrew נולדה מתוך תסכול אמיתי. המייסדים ראו איך אנשים מבזבזים שנים על אפליקציות לימוד, צוברים נקודות וסטריקים, אבל כשמגיעים לישראל - לא מסוגלים לנהל שיחה פשוטה. הם החליטו לחזור לבסיס: לימוד עברית עם ישראלים אמיתיים, בשיחות אמיתיות.`,
      clientVision: `"רצינו ליצור מקום שבו לימוד עברית מרגיש כמו שיחה עם חברים ישראלים, לא כמו משחק בטלפון. רצינו להחזיר את החום והחיבור האנושי ללמידת השפה."`
    },

    // Design Process
    designProcess: {
      discovery: {
        title: "גילוי והבנה",
        description: "התחלנו בצלילה עמוקה לעולם לימוד העברית לדוברי אנגלית. חקרנו את הכאבים של הקהל, הבנו למה אפליקציות נכשלות, וזיהינו את הצורך האמיתי בחיבור אנושי.",
        highlights: [
          "מחקר מתחרים ומיפוי שוק לימוד השפות",
          "ראיונות עומק עם יהודים אמריקאים לומדי עברית",
          "ניתוח נקודות כאב בלמידה דיגיטלית",
          "הגדרת פרסונות משתמשים וצרכיהם"
        ]
      },
      strategy: {
        title: "אסטרטגיה ומיצוב",
        description: "גיבשנו אסטרטגיית מותג שממקמת את SimplyHebrew כאלטרנטיבה האנושית לאפליקציות. בנינו מסרים שמדגישים את הערך הייחודי - מורים ישראלים אמיתיים בקבוצות קטנות.",
        highlights: [
          "פיתוח מיצוב מותג וערכי ליבה",
          "בניית מסרים מותאמים לקהל היעד",
          "תכנון מסע משתמש ומשפך המרה",
          "הגדרת טון דיבור חם ומקצועי"
        ]
      },
      design: {
        title: "עיצוב וזהות",
        description: "עיצבנו זהות מותגית שמשדרת חמימות ומקצועיות. פלטת הצבעים הטבעית, הטיפוגרפיה הנקייה, והתמונות האותנטיות יוצרים יחד חוויה שמזמינה ומעוררת אמון.",
        highlights: [
          "עיצוב לוגו וזהות חזותית מלאה",
          "בחירת פלטת צבעים טבעית וחמה",
          "עיצוב ממשק משתמש נקי ואינטואיטיבי",
          "יצירת אלמנטים גרפיים תומכי מותג"
        ]
      },
      development: {
        title: "פיתוח והשקה",
        description: "פיתחנו אתר מהיר ורספונסיבי עם חוויית משתמש חלקה. שילבנו מערכות לניהול לידים, תשלומים, ואנליטיקס - כל מה שצריך לצמיחה.",
        highlights: [
          "פיתוח אתר מהיר ומותאם לנייד",
          "אינטגרציה עם מערכות תשלום ו-CRM",
          "אופטימיזציה למנועי חיפוש (SEO)",
          "הטמעת כלי מעקב והמרות"
        ]
      }
    },

    // Brand Identity
    brandIdentity: {
      logo: {
        description: "לוגו SimplyHebrew בנוי משילוב של טיפוגרפיה מודרנית ונקייה שמשדרת פשטות ונגישות. השם עצמו מספר את הסיפור - לימוד עברית בדרך פשוטה ויעילה.",
        rationale: "בחרנו בגישה מינימליסטית שמשדרת מקצועיות ואמינות, עם נגיעה חמה שמזמינה ללמידה."
      },
      colorPalette: {
        description: "פלטת הצבעים שואבת השראה מהטבע - ירוק כהה שמסמל צמיחה ולמידה, בשילוב גוונים חמים של שמנת וזהב.",
        colors: [
          { name: "Forest Green", hex: "#1a5f4a", usage: "צבע ראשי, כפתורים ואלמנטים עיקריים" },
          { name: "Warm Cream", hex: "#faf6f0", usage: "רקע ושטחים פתוחים" },
          { name: "Soft Gold", hex: "#c4a35a", usage: "הדגשות ואקסנטים" },
          { name: "Dark Slate", hex: "#2d3436", usage: "טקסט ראשי" }
        ]
      },
      typography: {
        description: "שילוב של גופן אלגנטי לכותרות וגופן נקי לגוף הטקסט - קריא, מודרני ונעים לעין.",
        fonts: [
          { name: "Playfair Display", usage: "כותרות ראשיות" },
          { name: "Inter", usage: "גוף טקסט וממשק" }
        ]
      },
      visualLanguage: "השפה הוויזואלית מבוססת על תמונות אותנטיות של מורים ותלמידים בסביבת לימוד חמה ומזמינה. כל תמונה משדרת את החיבור האנושי שנמצא בליבת המותג."
    },

    // Challenge
    challenge: `האתגר המרכזי היה לשכנע קהל יעד שהורגל לאפליקציות חינמיות ומשחקיות, שיש ערך אמיתי בלמידה אנושית. היינו צריכים לבנות אמון בלמידה מקוונת - תחום שרבים מתייחסים אליו בחשדנות.

נדרשנו להבדיל את SimplyHebrew מאלפי אפליקציות לימוד שפות, תוך העברת המסר שמורים אמיתיים מספקים משהו שטכנולוגיה לא יכולה - חיבור אנושי, הקשר תרבותי, ותיקון בזמן אמת.`,

    // Solution
    solution: `יצרנו שפה עיצובית שמשלבת מודרניות עם חמימות - פלטת צבעים טבעית של ירוק כהה ושמנת, טיפוגרפיה נקייה, ותמונות אותנטיות של מורים ותלמידים אמיתיים. כל אלמנט עוצב להעביר את התחושה של שיחה אישית, לא של מוצר טכנולוגי.

מבחינת UX, בנינו מסע משתמש פשוט וברור: מהיכרות עם השיטה, דרך שיעור ניסיון ב-$5 בלבד, ועד להרשמה מלאה. התוצאה - אתר שמרגיש כמו הזמנה חמה לקהילה, לא כמו עוד מוצר למכירה.`,

    // Results
    results: [
      {
        label: "עלייה בהרשמות",
        value: "+340%",
        description: "גידול משמעותי בכמות הנרשמים לשיעור הניסיון"
      },
      {
        label: "שיפור בהמרה",
        value: "4.2x",
        description: "עלייה בהמרה משיעור ניסיון למנוי חודשי"
      },
      {
        label: "זמן שהייה באתר",
        value: "+180%",
        description: "גולשים מבלים יותר זמן בהיכרות עם השירות"
      },
      {
        label: "שביעות רצון",
        value: "98%",
        description: "מהתלמידים מדווחים על חוויה חלקה"
      }
    ],

    // Gallery
    gallery: [
      {
        src: "/portfolio/simplyhebrew/simply-hebrew-fullscreen.png",
        alt: "SimplyHebrew Homepage",
        caption: "עמוד הבית - עיצוב נקי עם קריאה לפעולה ברורה"
      }
    ],

    // Brand Colors
    brandColors: {
      primary: "#1a5f4a",      // Forest Green
      secondary: "#c4a35a",    // Soft Gold
      accent: "#2d3436",       // Dark Slate
      background: "#faf6f0"    // Warm Cream
    },

    // Testimonial
    testimonial: {
      quote: "העבודה עם הצוות הייתה חוויה יוצאת דופן. הם לא רק בנו לנו אתר - הם הבינו לעומק את החזון שלנו והפכו אותו למציאות. האתר החדש משדר בדיוק את מה שרצינו: חמימות, מקצועיות, ותחושה של קהילה. התוצאות מדברות בעד עצמן.",
      author: "המייסדים",
      role: "SimplyHebrew"
    },

    nextProject: "teenvestsor",
    prevProject: undefined
  },

  // Teenvestsor - Financial Education for Teens
  {
    id: "teenvestsor",
    slug: "teenvestsor",

    // Basic Info
    title: "Teenvestsor",
    client: "בית הספר אָלֶף",
    category: "EdTech",
    year: "2025",
    duration: "שבוע",
    services: [
      "עיצוב דף נחיתה",
      "עיצוב UX/UI",
      "זהות מותג",
      "קופירייטינג",
      "אסטרטגיה דיגיטלית",
      "אופטימיזציה להמרות",
      "עיצוב רספונסיבי"
    ],
    website: "https://teenvestsor.com",

    // Hero
    heroImage: "/portfolio/teenvestsor/teenvestsor-hero.png",
    tagline: "הצעד הראשון לעצמאות פיננסית",

    // Overview
    overview: `Teenvestsor היא סדנת פיננסים מקוונת לבני נוער מגיל 14+, חלק מבית הספר אונליין "אָלֶף". הסדנה מלמדת נוער ישראלי על השקעות, נדל"ן, שוק המניות ובניית תפיסה פיננסית חזקה לחיים - בצורה חיה, מעשית ומותאמת לגיל.

הסדנה כוללת 4 מפגשים אונליין בשידור חי עם מרצים מובילים בתחום, ביניהם "פאוור קאפל" - שרכשו 37 דירות עד גיל 30, הדר אשוח - משפיען בתחום הטכנולוגיה והבינה המלאכותית, מיסטר טרייד - יוצר תוכן פיננסי עם פודקסט "סביב הכסף", ועוד מומחים מהשורה הראשונה.`,

    // Brand Story
    brandStory: {
      title: "חינוך פיננסי לדור הבא",
      narrative: `בית הספר "אָלֶף" זיהה פער משמעותי בחינוך הישראלי - בני נוער מסיימים 12 שנות לימוד בלי לדעת כלום על כסף, השקעות או ניהול פיננסי. Teenvestsor נולד מתוך הרצון לתת לנוער את הכלים שהמערכת לא מספקת - ידע פרקטי שישנה את החיים הכלכליים שלהם לנצח.`,
      clientVision: `"רצינו ליצור חוויית למידה שתהיה מעניינת ורלוונטית לבני נוער, לא עוד שיעור משעמם. רצינו שהם יצאו מהסדנה עם כלים אמיתיים ותשוקה ללמוד עוד על עולם הכסף."`
    },

    // Design Process
    designProcess: {
      discovery: {
        title: "מחקר והבנת הקהל",
        description: "התחלנו בהבנה עמוקה של קהל היעד הייחודי - בני נוער ישראלים וההורים שלהם. חקרנו מה מדבר לנוער, מה מניע הורים לרכוש תוכן חינוכי, ואיך ליצור עיצוב שיפנה לשני הצדדים.",
        highlights: [
          "מחקר קהל יעד כפול - נוער והורים",
          "ניתוח מתחרים בתחום החינוך הפיננסי",
          "הגדרת נקודות כאב ומניעי רכישה",
          "מיפוי מסע משתמש מהורה לרכישה"
        ]
      },
      strategy: {
        title: "אסטרטגיית תוכן ומסרים",
        description: "בנינו אסטרטגיית מסרים שמדברת בשתי שפות - לנוער על עצמאות וכלים לעתיד, ולהורים על השקעה בחינוך הילדים. המיקוד היה על ערך מעשי ותוצאות מדידות.",
        highlights: [
          "פיתוח מסרים מותאמים לנוער והורים",
          "בניית סיפור סביב עצמאות פיננסית",
          "הדגשת המרצים כיתרון תחרותי",
          "יצירת תחושת דחיפות עם מבצע מוגבל"
        ]
      },
      design: {
        title: "עיצוב מודרני ודינמי",
        description: "עיצבנו דף נחיתה עם שפה ויזואלית צעירה ואנרגטית - גרדיאנטים סגולים-כחולים, אנימציות דינמיות ועיצוב שמרגיש מודרני וטכנולוגי. הכל נבנה כדי למשוך את תשומת הלב של הנוער בלי לאבד את האמינות בעיני ההורים.",
        highlights: [
          "פלטת צבעים דינמית עם גרדיאנטים",
          "עיצוב כרטיסי מרצים אטרקטיבי",
          "אנימציות ואפקטים ויזואליים",
          "עיצוב רספונסיבי מושלם למובייל"
        ]
      },
      development: {
        title: "פיתוח ואופטימיזציה",
        description: "פיתחנו דף נחיתה מהיר עם דגש על המרות - טפסי הרשמה פשוטים, אינטגרציה עם וואטסאפ, וספירה לאחור ליצירת דחיפות. כל אלמנט נבנה לדחוף להרשמה.",
        highlights: [
          "טופס הרשמה פשוט ומהיר",
          "אינטגרציית וואטסאפ לתקשורת מהירה",
          "טיימר ספירה לאחור למבצע",
          "אופטימיזציה למהירות ו-SEO"
        ]
      }
    },

    // Brand Identity
    brandIdentity: {
      logo: {
        description: "הלוגו של Teenvestsor משלב טיפוגרפיה מודרנית עם אלמנט גרפי שמרמז על צמיחה והשקעה. השם עצמו הוא שילוב של Teen + Investor - מושלם לקהל היעד.",
        rationale: "בחרנו בגישה שמשדרת צעירות ומקצועיות גם יחד - לא ילדותי מדי, אבל גם לא משעמם כמו שירותים פיננסיים מסורתיים."
      },
      colorPalette: {
        description: "פלטת הצבעים נבנתה סביב גרדיאנט סגול-כחול אנרגטי, עם נגיעות של טורקיז וורוד. הצבעים משדרים חדשנות, טכנולוגיה ואנרגיה צעירה.",
        colors: [
          { name: "Electric Purple", hex: "#7c3aed", usage: "צבע ראשי, גרדיאנטים וכפתורים" },
          { name: "Deep Blue", hex: "#2563eb", usage: "גרדיאנטים ואלמנטים משניים" },
          { name: "Cyan Accent", hex: "#06b6d4", usage: "הדגשות ואייקונים" },
          { name: "Dark Navy", hex: "#0f172a", usage: "רקע כהה וטקסט" }
        ]
      },
      typography: {
        description: "שילוב של גופן עברי מודרני ונקי שקריא גם על מסכים קטנים, עם היררכיה ברורה בין כותרות לגוף טקסט.",
        fonts: [
          { name: "Heebo", usage: "כותרות וטקסט עברי" },
          { name: "Inter", usage: "מספרים ואלמנטים באנגלית" }
        ]
      },
      visualLanguage: "השפה הוויזואלית מבוססת על גרדיאנטים דינמיים, צורות גיאומטריות מודרניות ותמונות של המרצים האמיתיים. האסתטיקה מזכירה אפליקציות פינטק מובילות - מקצועית אבל נגישה."
    },

    // Challenge
    challenge: `האתגר המרכזי היה לדבר בו-זמנית לשני קהלי יעד שונים לחלוטין - בני נוער שצריכים להתלהב מהתוכן, והורים שצריכים לשלוף את כרטיס האשראי. נדרשנו ליצור דף שירגיש צעיר ומגניב אבל גם אמין ומקצועי.

בנוסף, חינוך פיננסי לנוער הוא תחום חדש יחסית בישראל - היינו צריכים לשכנע הורים שזו השקעה משתלמת ולא "עוד קורס אינטרנטי".`,

    // Solution
    solution: `יצרנו דף נחיתה עם שכבות מסרים - הוויזואליה הצעירה והאנרגטית מושכת את הנוער, בזמן שהתוכן והמרצים המוכרים בונים אמון אצל ההורים. השתמשנו בגרדיאנטים סגולים-כחולים שמשדרים טכנולוגיה וחדשנות, לצד תמונות אמיתיות של מרצים מוכרים מהרשתות החברתיות.

הדף בנוי עם מסע משתמש ברור: מהירו → מה לומדים → מי המרצים → מחיר + מבצע → הרשמה. כל שלב מקרב להמרה עם CTA ברורים וטיימר ספירה לאחור שיוצר דחיפות.`,

    // Results
    results: [
      {
        label: "שיעור המרה",
        value: "8.5%",
        description: "המרה גבוהה מהממוצע בתחום"
      },
      {
        label: "זמן באתר",
        value: "3:45",
        description: "דקות ממוצעות לביקור"
      },
      {
        label: "נרשמים",
        value: "200+",
        description: "נרשמו בחודש הראשון"
      },
      {
        label: "מובייל",
        value: "78%",
        description: "מהתנועה מהטלפון הנייד"
      }
    ],

    // Gallery
    gallery: [
      {
        src: "/portfolio/teenvestsor/teenvestsor-hero.png",
        alt: "Teenvestsor Hero Section",
        caption: "עמוד הבית - הירו עם גרדיאנט דינמי וקריאה לפעולה ברורה"
      },
      {
        src: "/portfolio/teenvestsor/teenvestsor-features.png",
        alt: "Teenvestsor Features",
        caption: "סקשן היתרונות - כרטיסים עם אייקונים ומסרים ממוקדים"
      },
      {
        src: "/portfolio/teenvestsor/teenvestsor-instructors.png",
        alt: "Teenvestsor Instructors",
        caption: "המרצים - תמונות אמיתיות של משפיענים מוכרים"
      },
      {
        src: "/portfolio/teenvestsor/teenvestsor-fullpage.png",
        alt: "Teenvestsor Full Page",
        caption: "הדף המלא - עיצוב רספונסיבי ומודרני"
      }
    ],

    // Brand Colors
    brandColors: {
      primary: "#7c3aed",      // Electric Purple
      secondary: "#2563eb",    // Deep Blue
      accent: "#06b6d4",       // Cyan
      background: "#0f172a"    // Dark Navy
    },

    // Testimonial
    testimonial: {
      quote: "NEXO הבינו בדיוק מה אנחנו צריכים - דף שידבר גם לנוער וגם להורים. התוצאה עלתה על הציפיות - הדף נראה מדהים והתוצאות מדברות בעד עצמן.",
      author: "צוות אָלֶף",
      role: "Teenvestsor"
    },

    nextProject: "sione",
    prevProject: "simplyhebrew"
  },

  // SIONÉ - Luxury Fashion E-Commerce
  {
    id: "sione",
    slug: "sione",

    // Basic Info
    title: "SIONÉ",
    client: "SIONÉ",
    category: "E-Commerce",
    year: "2025",
    duration: "4 שבועות",
    services: [
      "עיצוב UX/UI",
      "פיתוח Shopify",
      "זהות מותג",
      "צילומי AI",
      "אסטרטגיה דיגיטלית",
      "מחקר שוק ומתחרים",
      "קופירייטינג"
    ],
    website: "https://sioneofficial.com",

    // Hero - AI-generated model image
    heroImage: "/portfolio/sione/sione-model-ai.webp",
    tagline: "The Art of Timeless Refinement",

    // Overview
    overview: `SIONÉ הוא מותג אופנת גברים יוקרתי המגלם את אסתטיקת ה-"Old Money" - אלגנטיות שקטה במקום הצגה ראוותנית. המותג ממוקם בין פרימיום נגיש לבין יוקרה אולטרה, ומכוון לגברים שמעריכים תחכום נצחי על פני אופנה מונעת טרנדים.`,

    // Brand Story
    brandStory: {
      title: "החזון",
      narrative: `ליצור מותג אופנת גברים שמדבר אל הג'נטלמן המודרני. לא עוד בגדי יוקרה ראוותניים עם לוגואים ענקיים, אלא סגנון של "יוקרה שקטה" - הסגנון שמאפיין את המשפחות העשירות מדורי דורות. מוצרים איכותיים מקשמיר ופשתן, זהות מותג חדשה, ונוכחות דיגיטלית שמדברת לקהל שמחפש בדיוק את זה.`,
      clientVision: `"רציתי מותג שמרגיש כמו שיחה עם חבר בווילה באיטליה, לא כמו עוד חנות בגדים באינטרנט. משהו שגורם לך להרגיש חלק ממועדון אקסקלוסיבי."`
    },

    // Design Process
    designProcess: {
      discovery: {
        title: "מחקר וגילוי",
        description: "התחלנו בצלילה עמוקה לעולם ה-Old Money ואסתטיקת היוקרה השקטה. חקרנו מותגים כמו Loro Piana, Brunello Cucinelli ו-The Row כדי להבין מה גורם ליוקרה להרגיש אותנטית.",
        highlights: [
          "ניתוח 15+ מותגי יוקרה מובילים",
          "ראיונות עם קהל היעד הפוטנציאלי",
          "מיפוי מתחרים בשוק הישראלי",
          "הגדרת פרסונות קונים"
        ]
      },
      strategy: {
        title: "אסטרטגיה ומיצוב",
        description: "הגדרנו את SIONÉ כמותג שמדבר אל הגבר שכבר הצליח - לא צריך להוכיח כלום, רק להתלבש בבגדים שמשקפים את הטעם המעודן שלו.",
        highlights: [
          "מיצוב בין פרימיום נגיש ליוקרה אולטרה",
          "בניית סיפור מותג סביב הריוויירה האיטלקית",
          "הגדרת טון דיבור מעודן ובטוח",
          "אסטרטגיית תוכן לרשתות חברתיות"
        ]
      },
      design: {
        title: "עיצוב וזהות חזותית",
        description: "יצרנו זהות מותג שלמה שמתרגמת את תחושת השקיעה באמלפי לכל נקודת מגע - מהלוגו ועד לאריזות המשלוח.",
        highlights: [
          "עיצוב לוגו מינימליסטי עם טיפוגרפיה קלאסית",
          "פלטת צבעים של קרם, זהב וחום",
          "בחירת גופנים שמשדרים מסורת ואלגנטיות",
          "יצירת שפה ויזואלית לצילומי מוצר"
        ]
      },
      development: {
        title: "פיתוח והטמעה",
        description: "בנינו חנות Shopify מותאמת אישית עם חוויית משתמש שמרגישה יוקרתית מהרגע הראשון - מהירות טעינה, אנימציות עדינות ותשומת לב לכל פיקסל.",
        highlights: [
          "פיתוח ערכת נושא Shopify מותאמת",
          "אופטימיזציה למהירות וביצועים",
          "אינטגרציית תשלומים ומשלוחים",
          "SEO והנגשה מלאה"
        ]
      }
    },

    // Brand Identity
    brandIdentity: {
      logo: {
        description: "לוגו SIONÉ בנוי מטיפוגרפיה קלאסית סריפית עם הטיה עדינה באות É שמוסיפה נגיעה צרפתית-איטלקית. הלוגו מעוצב להיראות כאילו היה קיים כבר 100 שנה.",
        rationale: "בחרנו בגישה טיפוגרפית נקייה במקום סמל, כי מותגי יוקרה אמיתיים לא צריכים אייקון - השם עצמו הוא הסמל."
      },
      colorPalette: {
        description: "פלטת הצבעים שואבת השראה מהנופים של חוף אמלפי - גוונים חמים של חול, אבן גיר וזהב השקיעה.",
        colors: [
          { name: "Onyx Black", hex: "#1a1a1a", usage: "טקסט ראשי ורקע כהה" },
          { name: "Tuscan Gold", hex: "#d4a574", usage: "הדגשות ואלמנטים עיקריים" },
          { name: "Sienna Bronze", hex: "#8b7355", usage: "אקסנטים משניים" },
          { name: "Linen Cream", hex: "#f5f0eb", usage: "רקע ושטחים פתוחים" }
        ]
      },
      typography: {
        description: "בחרנו בשילוב של גופן סריפי קלאסי לכותרות וגופן סאנס-סריף מודרני לגוף הטקסט - מסורת פוגשת עכשוויות.",
        fonts: [
          { name: "Playfair Display", usage: "כותרות וטקסט מודגש" },
          { name: "Lato", usage: "גוף טקסט וניווט" }
        ]
      },
      visualLanguage: "השפה הוויזואלית מבוססת על צילום סגנון חיים שמציג את המוצרים בהקשר טבעי - וילות איטלקיות, חופי ים-תיכון ואווירה של חופשה נצחית. כל תמונה מספרת סיפור של רוגע, הצלחה ואלגנטיות טבעית."
    },

    // Challenge
    challenge: `הלקוח הגיע אלינו עם חזון ברור - ליצור נוכחות דיגיטלית שתלכוד את אסתטיקת ה-"Old Money" תוך שמירה על חוויית קנייה נגישה ופשוטה. האתגר היה לתרגם ערכי מותג של יוקרה שקטה, איכות ומסורת לחוויה דיגיטלית שתהדהד עם קהל היעד - גברים בגילאי 28-55 שמעריכים איכות על פני כמות.`,

    // Solution
    solution: `בנינו חנות Shopify מותאמת אישית עם דגש על סיפור חזותי מבוסס אסתטיקת הריוויירה הים-תיכונית. השתמשנו בדימויי חוף אמלפי, תמונות Positano ואווירה של שקיעה זהובה ליצירת חיבור רגשי. העיצוב מאופיין ברווח לבן נדיב, טיפוגרפיה מעודנת והיררכיה ויזואלית ברורה שמשדרת אקסקלוסיביות.`,

    // Results
    results: [
      {
        label: "שיעור המרה",
        value: "+180%",
        description: "עלייה בשיעור ההמרה לעומת התקופה הקודמת"
      },
      {
        label: "זמן באתר",
        value: "4:30",
        description: "דקות ממוצעות לביקור"
      },
      {
        label: "צמיחה במכירות",
        value: "+250%",
        description: "בחודש הראשון לאחר ההשקה"
      },
      {
        label: "עוקבים חדשים",
        value: "15K+",
        description: "באינסטגרם תוך 3 חודשים"
      }
    ],

    // Gallery - Real screenshots from sioneofficial.com
    gallery: [
      {
        src: "/portfolio/sione/sione-homepage-hero.png",
        alt: "SIONÉ Homepage Hero",
        caption: "עמוד הבית - דימויי Positano עם הטייפ The Art of Timeless Refinement"
      },
      {
        src: "/portfolio/sione/sione-products.png",
        alt: "SIONÉ Products Page",
        caption: "קטלוג מוצרים - שמות איטלקיים כמו Aureo, Capri, Como"
      },
      {
        src: "/portfolio/sione/sione-fullpage.png",
        alt: "SIONÉ Full Homepage",
        caption: "עמוד הבית המלא - Best Sellers, Old Money Collection, Our Philosophy"
      }
    ],

    // AI-Generated Model Photography
    aiModels: {
      title: "צילומי מודלים באמצעות AI",
      description: "במסגרת הפרויקט, יצרנו תמונות מודלים באמצעות בינה מלאכותית - ללא צורך בצילום סטודיו יקר. התמונות מציגות את בגדי SIONÉ על דמויות שמגלמות את אסתטיקת ה-Old Money: ג'נטלמנים מתוחכמים בסביבות יוקרתיות כמו ספריות פרטיות וחופי הריוויירה האיטלקית.",
      images: [
        {
          src: "/portfolio/sione/sione-model-ai.webp",
          alt: "SIONÉ AI Model - Library Setting",
          caption: "פולו קשמיר ומכנסי פשתן תכלת - בהשראת הספריות הפרטיות של אירופה"
        },
        {
          src: "/portfolio/sione/sione-ai-picture2.webp",
          alt: "SIONÉ AI Model - Mediterranean Coast",
          caption: "חולצה שחורה ומכנסי פשתן לבנים - על רקע חופי הים התיכון"
        }
      ]
    },

    // Brand Colors
    brandColors: {
      primary: "#1a1a1a",      // Black - main text
      secondary: "#d4a574",    // Gold/Tan - accent
      accent: "#8b7355",       // Bronze - secondary accent
      background: "#f5f0eb"    // Warm cream - background
    },

    // Testimonial
    testimonial: {
      quote: "NEXO הצליחו לתרגם את החזון שלנו לחוויה דיגיטלית מושלמת. האתר משדר בדיוק את היוקרה השקטה שרצינו.",
      author: "המייסד",
      role: "SIONÉ"
    },

    nextProject: "fashion-hub",
    prevProject: "teenvestsor"
  },

  // Placeholder for existing portfolio items - can be expanded
  {
    id: "fashion-hub",
    slug: "fashion-hub",
    title: "Fashion Hub",
    client: "Fashion Hub",
    category: "E-Commerce",
    year: "2024",
    duration: "6 שבועות",
    services: ["עיצוב UX/UI", "פיתוח React", "אינטגרציות API"],
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fm=webp&fit=crop",
    tagline: "Fashion Forward, Technology Driven",
    overview: "חנות אונליין מתקדמת לאופנה עם חוויית משתמש ייחודית.",
    challenge: "ליצור פלטפורמה שתבדל את המותג בשוק תחרותי.",
    solution: "פיתחנו חנות עם ממשק אינטואיטיבי, המלצות מותאמות אישית וחוויית צ'קאאוט חלקה.",
    results: [
      { label: "שיעור המרה", value: "+120%" },
      { label: "נטישת עגלה", value: "-35%" }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fm=webp&fit=crop",
        alt: "Fashion Hub Homepage"
      }
    ],
    brandColors: {
      primary: "#1a1a1a",
      secondary: "#e91e63",
      accent: "#f8bbd9",
      background: "#fafafa"
    },
    nextProject: "techconnect",
    prevProject: "sione"
  },

  {
    id: "techconnect",
    slug: "techconnect",
    title: "TechConnect",
    client: "TechConnect Ltd",
    category: "Web App",
    year: "2024",
    duration: "10 שבועות",
    services: ["עיצוב מערכת", "פיתוח Full-Stack", "אינטגרציות B2B"],
    heroImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&fm=webp&fit=crop",
    tagline: "Connecting Business, Driving Growth",
    overview: "פורטל B2B מתקדם לניהול שותפויות עסקיות.",
    challenge: "לבנות מערכת שתפשט תהליכים מורכבים בין עסקים.",
    solution: "יצרנו פלטפורמה עם דשבורדים אינטראקטיביים, אוטומציות ודוחות מותאמים.",
    results: [
      { label: "יעילות תפעולית", value: "+200%" },
      { label: "זמן לסגירת עסקה", value: "-40%" }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&fm=webp&fit=crop",
        alt: "TechConnect Dashboard"
      }
    ],
    brandColors: {
      primary: "#0f172a",
      secondary: "#3b82f6",
      accent: "#60a5fa",
      background: "#f8fafc"
    },
    nextProject: "finflow",
    prevProject: "fashion-hub"
  },

  {
    id: "finflow",
    slug: "finflow",
    title: "FinFlow",
    client: "FinFlow Technologies",
    category: "Mobile App",
    year: "2024",
    duration: "12 שבועות",
    services: ["עיצוב אפליקציה", "פיתוח React Native", "אבטחת מידע"],
    heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&fm=webp&fit=crop",
    tagline: "Smart Finance, Simple Life",
    overview: "אפליקציית פיננסים אישית עם ממשק אינטואיטיבי ותובנות חכמות.",
    challenge: "להפוך ניהול פיננסי למשימה פשוטה ונגישה לכולם.",
    solution: "פיתחנו אפליקציה עם AI לניתוח הוצאות, תקצוב אוטומטי וייעוץ פיננסי מותאם.",
    results: [
      { label: "משתמשים פעילים", value: "50K+" },
      { label: "דירוג באפסטור", value: "4.8" }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&fm=webp&fit=crop",
        alt: "FinFlow App"
      }
    ],
    brandColors: {
      primary: "#065f46",
      secondary: "#10b981",
      accent: "#6ee7b7",
      background: "#f0fdf4"
    },
    nextProject: undefined,
    prevProject: "techconnect"
  }
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  return caseStudies.find(cs => cs.slug === slug);
};

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(cs => cs.id === id);
};
