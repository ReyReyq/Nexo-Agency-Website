// Vision board data for SubServiceFeatures component

// Pre-defined card positions for vision board layout (non-overlapping grid)
export const visionBoardPositions = [
  // Top row - 4 cards across the top
  { top: '0%', left: '1%', rotate: -4 },
  { top: '2%', left: '21%', rotate: 2 },
  { top: '0%', right: '21%', rotate: -2 },
  { top: '2%', right: '1%', rotate: 5 },
  // Upper side - 2 cards (17-35% from top)
  { top: '17%', left: '0%', rotate: -3 },
  { top: '19%', right: '0%', rotate: 3 },
  // Lower side - 2 cards (17-35% from bottom)
  { bottom: '17%', left: '0%', rotate: 4 },
  { bottom: '19%', right: '0%', rotate: -4 },
  // Bottom row - 4 cards across the bottom
  { bottom: '0%', left: '1%', rotate: 3 },
  { bottom: '2%', left: '21%', rotate: -2 },
  { bottom: '0%', right: '21%', rotate: 4 },
  { bottom: '2%', right: '1%', rotate: -5 },
];

// Vision board items per service slug
export type VisionItem = { icon: string; title: string; description: string };

export const visionBoardItemsByService: Record<string, VisionItem[]> = {
  // Chatbots
  'chatbots': [
    { icon: 'Clock', title: '24/7 זמינות', description: 'מענה ללקוחות בכל שעה' },
    { icon: 'TrendingDown', title: '60% חיסכון', description: 'בעלויות שירות לקוחות' },
    { icon: 'Zap', title: 'מענה ב-3 שניות', description: 'ללא תורים וללא המתנה' },
    { icon: 'Heart', title: 'לקוחות מרוצים', description: 'חוויית שירות מעולה' },
    { icon: 'Globe', title: 'עברית מושלמת', description: 'הבנת סלנג וניסוחים' },
    { icon: 'Shield', title: 'אבטחה מלאה', description: 'הצפנה ועמידה בתקנים' },
    { icon: 'Rocket', title: 'השקה מהירה', description: 'מוכן תוך ימים' },
    { icon: 'Users', title: 'קיבולת אינסופית', description: 'אלפי פניות במקביל' },
    { icon: 'Target', title: 'התאמה מלאה', description: 'בשפה של המותג שלכם' },
    { icon: 'Smile', title: 'אפס תסכול', description: 'תשובות מדויקות מיד' },
    { icon: 'Coffee', title: 'צוות רגוע', description: 'פחות שאלות חוזרות' },
    { icon: 'Star', title: 'חוויה אנושית', description: 'שיחה טבעית ונעימה' },
  ],
  // Workflow Automation
  'automation': [
    { icon: 'Zap', title: 'אוטומציה מלאה', description: 'תהליכים ללא מגע יד' },
    { icon: 'Clock', title: 'חיסכון בזמן', description: 'שעות עבודה בדקות' },
    { icon: 'TrendingDown', title: '80% פחות טעויות', description: 'דיוק מכונה מושלם' },
    { icon: 'RefreshCw', title: 'סנכרון מערכות', description: 'הכל מדבר עם הכל' },
    { icon: 'Users', title: 'שחרור הצוות', description: 'למשימות משמעותיות' },
    { icon: 'Eye', title: 'מעקב בזמן אמת', description: 'דשבורד מקיף' },
    { icon: 'Shield', title: 'אמינות גבוהה', description: 'תהליכים יציבים' },
    { icon: 'Settings', title: 'גמישות מלאה', description: 'מתאים לכל תהליך' },
    { icon: 'Bell', title: 'התראות חכמות', description: 'רק מה שחשוב באמת' },
    { icon: 'Database', title: 'מידע מרוכז', description: 'כל הנתונים במקום אחד' },
    { icon: 'TrendingUp', title: 'צמיחה ללא גבול', description: 'סקייל אוטומטי' },
    { icon: 'Star', title: 'איכות קבועה', description: 'תוצאות אחידות תמיד' },
  ],
  // AI Images
  'ai-images': [
    { icon: 'Image', title: 'תמונות מותאמות', description: 'ויזואל ייחודי למותג' },
    { icon: 'Zap', title: 'יצירה מהירה', description: 'תמונות בשניות' },
    { icon: 'TrendingDown', title: '90% חיסכון', description: 'לעומת צילום מקצועי' },
    { icon: 'Palette', title: 'סגנון אחיד', description: 'התאמה לשפת המותג' },
    { icon: 'RefreshCw', title: 'וריאציות אינסופיות', description: 'גרסאות שונות בלחיצה' },
    { icon: 'Target', title: 'דיוק בפרטים', description: 'שליטה מלאה בתוצאה' },
    { icon: 'Maximize', title: 'כל רזולוציה', description: 'מרשת ועד שלט' },
    { icon: 'Shield', title: 'זכויות יוצרים', description: 'תמונות שלכם לגמרי' },
    { icon: 'Users', title: 'אנשים מציאותיים', description: 'ללא צורך במודלים' },
    { icon: 'Layers', title: 'עריכה מתקדמת', description: 'שינויים בקלות' },
    { icon: 'Rocket', title: 'סקייל ללא גבול', description: 'כמה שצריך' },
    { icon: 'Star', title: 'איכות מקצועית', description: 'תוצאות מרהיבות' },
  ],
  // AI Content
  'ai-content': [
    { icon: 'Type', title: 'תוכן מותאם', description: 'בטון הדיבור שלכם' },
    { icon: 'Zap', title: 'יצירה מהירה', description: 'מאמרים בדקות' },
    { icon: 'Globe', title: 'עברית מקצועית', description: 'ניסוח שוטף וטבעי' },
    { icon: 'Target', title: 'SEO מובנה', description: 'אופטימיזציה אוטומטית' },
    { icon: 'RefreshCw', title: 'עדכון שוטף', description: 'תוכן תמיד רלוונטי' },
    { icon: 'Users', title: 'קהל מדויק', description: 'התאמה לפרסונות' },
    { icon: 'TrendingUp', title: 'המרות גבוהות', description: 'תוכן שמוכר' },
    { icon: 'Shield', title: 'ייחודיות מובטחת', description: '100% תוכן מקורי' },
    { icon: 'Clock', title: 'עקביות', description: 'פרסום קבוע ומתוכנן' },
    { icon: 'Lightbulb', title: 'רעיונות אינסופיים', description: 'בנק נושאים מתעדכן' },
    { icon: 'BarChart', title: 'מדידה מתקדמת', description: 'ביצועים בזמן אמת' },
    { icon: 'Star', title: 'איכות אנושית', description: 'עריכה מקצועית' },
  ],
  // Landing Pages
  'landing-pages': [
    { icon: 'Target', title: 'המרות גבוהות', description: 'כל קליק הופך ללקוח' },
    { icon: 'Zap', title: 'טעינה מהירה', description: 'פחות מ-2 שניות' },
    { icon: 'TrendingUp', title: 'ROI משופר', description: 'מקסימום מהקמפיין' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'מושלם בכל מכשיר' },
    { icon: 'Eye', title: 'עיצוב שמושך', description: 'מסרים ויזואליים חזקים' },
    { icon: 'BarChart', title: 'A/B טסטינג', description: 'אופטימיזציה מתמדת' },
    { icon: 'Clock', title: 'השקה מהירה', description: 'מוכן תוך ימים' },
    { icon: 'MessageSquare', title: 'CTA ממוקד', description: 'קריאה לפעולה ברורה' },
    { icon: 'Search', title: 'מותאם לגוגל', description: 'ציון איכות גבוה' },
    { icon: 'DollarSign', title: 'עלות מודעה נמוכה', description: 'חיסכון בפרסום' },
    { icon: 'Users', title: 'לידים איכותיים', description: 'פניות רלוונטיות בלבד' },
    { icon: 'Rocket', title: 'סטארט מהיר', description: 'קמפיין באוויר מחר' },
  ],
  // WordPress
  'wordpress': [
    { icon: 'Edit', title: 'עריכה עצמאית', description: 'ניהול תוכן קל' },
    { icon: 'Puzzle', title: 'תוספים עשירים', description: 'אלפי אפשרויות' },
    { icon: 'TrendingDown', title: 'עלות תחזוקה נמוכה', description: 'חיסכון לאורך זמן' },
    { icon: 'Search', title: 'SEO מובנה', description: 'דירוג גבוה בגוגל' },
    { icon: 'Shield', title: 'אבטחה מתקדמת', description: 'הגנה מלאה על האתר' },
    { icon: 'RefreshCw', title: 'עדכונים אוטומטיים', description: 'תמיד מעודכן' },
    { icon: 'Globe', title: 'רב-לשוני', description: 'עברית ושפות נוספות' },
    { icon: 'Layers', title: 'עיצוב גמיש', description: 'התאמה מלאה למותג' },
    { icon: 'ShoppingBag', title: 'WooCommerce', description: 'חנות בקלות' },
    { icon: 'Users', title: 'קהילה ענקית', description: 'תמיכה ופתרונות' },
    { icon: 'Gauge', title: 'ביצועים מהירים', description: 'אופטימיזציה מקסימלית' },
    { icon: 'BookOpen', title: 'בלוג מובנה', description: 'תוכן שמוכר' },
  ],
  // Web Apps
  'web-apps': [
    { icon: 'Code', title: 'פיתוח מותאם', description: 'בדיוק מה שצריך' },
    { icon: 'Database', title: 'ניהול נתונים', description: 'מערכות מידע חכמות' },
    { icon: 'Users', title: 'ריבוי משתמשים', description: 'הרשאות ותפקידים' },
    { icon: 'Lock', title: 'אבטחה קריטית', description: 'הצפנה והגנה מלאה' },
    { icon: 'Zap', title: 'תגובה מהירה', description: 'חוויה חלקה' },
    { icon: 'RefreshCw', title: 'סנכרון בזמן אמת', description: 'נתונים תמיד עדכניים' },
    { icon: 'Smartphone', title: 'PWA', description: 'כמו אפליקציה נייטיב' },
    { icon: 'Settings', title: 'אוטומציה', description: 'תהליכים חכמים' },
    { icon: 'Link', title: 'אינטגרציות', description: 'חיבור למערכות קיימות' },
    { icon: 'LineChart', title: 'דשבורדים', description: 'תובנות בזמן אמת' },
    { icon: 'TrendingUp', title: 'סקייל ללא גבול', description: 'צומח עם העסק' },
    { icon: 'Wrench', title: 'תחזוקה שוטפת', description: 'תמיד עובד מושלם' },
  ],
  // Corporate Sites
  'corporate-sites': [
    { icon: 'Award', title: 'מראה מקצועי', description: 'רושם ראשוני מנצח' },
    { icon: 'Globe', title: 'נוכחות דיגיטלית', description: 'זמינים 24/7' },
    { icon: 'Heart', title: 'אמון לקוחות', description: 'קרדיט ואמינות' },
    { icon: 'Palette', title: 'מיתוג אחיד', description: 'שפת עיצוב מותג' },
    { icon: 'FileText', title: 'תוכן מוביל', description: 'מסרים ברורים' },
    { icon: 'Mail', title: 'טפסי פניה', description: 'לידים ישירות' },
    { icon: 'Image', title: 'גלריית עבודות', description: 'הצגת הפורטפוליו' },
    { icon: 'Users', title: 'דף צוות', description: 'פנים לחברה' },
    { icon: 'Star', title: 'המלצות', description: 'עדויות לקוחות' },
    { icon: 'Calendar', title: 'חדשות ועדכונים', description: 'תוכן דינמי' },
    { icon: 'Search', title: 'SEO מובנה', description: 'נמצאים בגוגל' },
    { icon: 'Maximize', title: 'חווית משתמש', description: 'ניווט אינטואיטיבי' },
  ],
  // Catalog Sites
  'catalog-sites': [
    { icon: 'Grid', title: 'תצוגת מוצרים', description: 'קטלוג מסודר' },
    { icon: 'Filter', title: 'סינון חכם', description: 'מציאה מהירה' },
    { icon: 'Search', title: 'חיפוש מתקדם', description: 'כל מוצר בשניות' },
    { icon: 'Image', title: 'גלריות מוצר', description: 'תמונות באיכות גבוהה' },
    { icon: 'FileDown', title: 'הורדת קטלוג', description: 'PDF אוטומטי' },
    { icon: 'Layers', title: 'קטגוריות', description: 'ארגון היררכי' },
    { icon: 'Eye', title: 'תצוגה מהירה', description: 'פרטים בקליק' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'גלישה בכל מקום' },
    { icon: 'RefreshCw', title: 'עדכון קל', description: 'ניהול מלאי פשוט' },
    { icon: 'Mail', title: 'בקשת הצעת מחיר', description: 'לידים חמים' },
    { icon: 'BarChart2', title: 'השוואת מוצרים', description: 'החלטה מושכלת' },
    { icon: 'Bell', title: 'התראות מלאי', description: 'עדכוני זמינות' },
  ],
  // Shopify
  'shopify': [
    { icon: 'ShoppingBag', title: 'חנות מוכנה', description: 'מוכנים למכור מהיום' },
    { icon: 'Smartphone', title: 'מותאם למובייל', description: 'קנייה נוחה בנייד' },
    { icon: 'CreditCard', title: 'תשלומים מאובטחים', description: 'ללא חששות ללקוח' },
    { icon: 'TrendingUp', title: 'צמיחה מהירה', description: 'מכירות בעלייה מתמדת' },
    { icon: 'Gauge', title: 'מהירות טעינה', description: 'חוויית גלישה חלקה' },
    { icon: 'Globe', title: 'מכירות גלובליות', description: 'לקוחות מכל העולם' },
    { icon: 'Truck', title: 'משלוחים אוטומטיים', description: 'מעקב בזמן אמת' },
    { icon: 'Star', title: 'עיצוב פרימיום', description: 'מותג שמוכר את עצמו' },
    { icon: 'RefreshCw', title: 'עדכונים אוטומטיים', description: 'תמיד בגרסה הטובה' },
    { icon: 'Lock', title: 'אבטחה מקסימלית', description: 'עסקאות מוגנות 100%' },
    { icon: 'BarChart2', title: 'אנליטיקס מתקדם', description: 'הבנת התנהגות לקוחות' },
    { icon: 'Zap', title: 'ביצועים גבוהים', description: 'אפס השבתות' },
  ],
  // WooCommerce
  'woocommerce': [
    { icon: 'Code', title: 'שליטה מלאה', description: 'התאמה אישית מושלמת' },
    { icon: 'Puzzle', title: 'תוספים ללא הגבלה', description: 'הרחבות לכל צורך' },
    { icon: 'Wallet', title: 'ללא עמלות', description: 'חיסכון בכל עסקה' },
    { icon: 'Database', title: 'בעלות על המידע', description: 'הכל אצלכם בשרת' },
    { icon: 'Layout', title: 'עיצוב ללא גבולות', description: 'כל דמיון אפשרי' },
    { icon: 'Settings', title: 'גמישות מקסימלית', description: 'מתאים לכל עסק' },
    { icon: 'TrendingUp', title: 'סקייל ללא גבול', description: 'גדלים איתכם' },
    { icon: 'Shield', title: 'קוד פתוח מאובטח', description: 'קהילה עולמית' },
    { icon: 'DollarSign', title: 'עלויות נמוכות', description: 'יותר רווח לעסק' },
    { icon: 'Users', title: 'ניהול לקוחות', description: 'CRM מובנה בחנות' },
    { icon: 'Layers', title: 'אינטגרציות רבות', description: 'חיבור לכל מערכת' },
    { icon: 'Rocket', title: 'השקה מהירה', description: 'אונליין תוך ימים' },
  ],
  // Payments
  'payments': [
    { icon: 'CreditCard', title: 'כל אמצעי תשלום', description: 'ויזה, מאסטר, פייפאל' },
    { icon: 'Lock', title: 'הצפנה מלאה', description: 'PCI DSS מאושר' },
    { icon: 'Zap', title: 'אישור מיידי', description: 'עסקה בשניות' },
    { icon: 'RefreshCw', title: 'תשלומים חוזרים', description: 'מנויים אוטומטיים' },
    { icon: 'Globe', title: 'מטבעות מרובים', description: 'שקל, דולר, יורו' },
    { icon: 'Shield', title: 'מניעת הונאות', description: 'הגנה מתקדמת' },
    { icon: 'Smartphone', title: 'תשלום במובייל', description: 'Apple Pay, Google Pay' },
    { icon: 'FileText', title: 'חשבוניות אוטומטיות', description: 'הכל לפי החוק' },
    { icon: 'TrendingDown', title: 'עמלות מינימליות', description: 'יותר כסף בכיס' },
    { icon: 'Check', title: 'אימות חכם', description: '3D Secure מובנה' },
    { icon: 'Clock', title: 'העברה מהירה', description: 'כסף תוך 24 שעות' },
    { icon: 'HeadphonesIcon', title: 'תמיכה בתקלות', description: 'פתרון בזמן אמת' },
  ],
  // Inventory
  'inventory': [
    { icon: 'Database', title: 'מעקב בזמן אמת', description: 'מלאי מדויק תמיד' },
    { icon: 'Bell', title: 'התראות חכמות', description: 'מלאי נמוך? נודיע' },
    { icon: 'RefreshCw', title: 'סנכרון אוטומטי', description: 'כל הערוצים מחוברים' },
    { icon: 'BarChart', title: 'תחזיות מכירה', description: 'הזמנה חכמה מראש' },
    { icon: 'Truck', title: 'ניהול ספקים', description: 'הזמנות אוטומטיות' },
    { icon: 'Search', title: 'סריקת ברקודים', description: 'עדכון מהיר ומדויק' },
    { icon: 'Layers', title: 'ריבוי מחסנים', description: 'ניהול מרכזי אחד' },
    { icon: 'TrendingDown', title: 'צמצום פחת', description: 'אפס אובדן מלאי' },
    { icon: 'FileCheck', title: 'דוחות מפורטים', description: 'תמונה ברורה תמיד' },
    { icon: 'Zap', title: 'אוטומציה מלאה', description: 'פחות עבודה ידנית' },
    { icon: 'Target', title: 'דיוק מקסימלי', description: 'אפס טעויות ספירה' },
    { icon: 'DollarSign', title: 'חיסכון בעלויות', description: 'מלאי אופטימלי' },
  ],
  // Logo Design
  'logo-design': [
    { icon: 'Eye', title: 'זיהוי מיידי', description: 'מותג שנחרט בזיכרון' },
    { icon: 'Target', title: 'בידול מתחרים', description: 'ייחודיות שאי אפשר להתעלם' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'לוגו שמרגישים' },
    { icon: 'Star', title: 'רושם ראשוני', description: 'פתיחה בלתי נשכחת' },
    { icon: 'Maximize', title: 'כל פורמט', description: 'מכרטיס ועד שלט' },
    { icon: 'Clock', title: 'עיצוב נצחי', description: 'לא יוצא מהאופנה' },
    { icon: 'Award', title: 'מקצועיות', description: 'רושם של הצלחה' },
    { icon: 'Puzzle', title: 'גמישות מלאה', description: 'מתאים לכל שימוש' },
    { icon: 'Lightbulb', title: 'סיפור במבט', description: 'מסר ויזואלי חזק' },
    { icon: 'Shield', title: 'זכויות מלאות', description: 'הלוגו שלכם לתמיד' },
    { icon: 'TrendingUp', title: 'ערך עולה', description: 'נכס שמתחזק' },
    { icon: 'Sparkles', title: 'איכות פרימיום', description: 'עיצוב ברמה עולמית' },
  ],
  // Visual Identity
  'visual-identity': [
    { icon: 'Layers', title: 'שפה אחידה', description: 'עקביות בכל נקודת מגע' },
    { icon: 'Palette', title: 'פלטת צבעים', description: 'צבעים שמזהים רק אתכם' },
    { icon: 'Type', title: 'טיפוגרפיה', description: 'גופנים שמדברים בשמכם' },
    { icon: 'Grid', title: 'מערכת סדר', description: 'לייאאוט שעובד תמיד' },
    { icon: 'Image', title: 'סגנון תמונות', description: 'שפה ויזואלית ייחודית' },
    { icon: 'Globe', title: 'נוכחות מותגית', description: 'מוכרים בכל פלטפורמה' },
    { icon: 'Lock', title: 'מותג מוגן', description: 'קשה לחקות' },
    { icon: 'Users', title: 'אמון לקוחות', description: 'מראה מקצועי ואמין' },
    { icon: 'Repeat', title: 'חזרתיות', description: 'זיכרון מותג חזק' },
    { icon: 'PenTool', title: 'עיצוב גרפי', description: 'אלמנטים ייחודיים' },
    { icon: 'Layout', title: 'תבניות מוכנות', description: 'יצירת חומרים בקלות' },
    { icon: 'Rocket', title: 'מותג בוגר', description: 'תדמית של הצלחה' },
  ],
  // Brand Book
  'brand-book': [
    { icon: 'BookOpen', title: 'מדריך מקיף', description: 'הכל במקום אחד' },
    { icon: 'FileCheck', title: 'חוקים ברורים', description: 'איך להשתמש נכון' },
    { icon: 'Shield', title: 'שמירה על המותג', description: 'מניעת טעויות' },
    { icon: 'Users', title: 'העברת ידע', description: 'כל עובד מבין' },
    { icon: 'RefreshCw', title: 'עקביות לאורך זמן', description: 'מותג שלא משתנה' },
    { icon: 'Scale', title: 'סטנדרט אחיד', description: 'איכות קבועה' },
    { icon: 'Zap', title: 'יעילות בעבודה', description: 'חיסכון בזמן יצירה' },
    { icon: 'Target', title: 'מיקוד המסר', description: 'תקשורת ברורה' },
    { icon: 'Settings', title: 'פרטים טכניים', description: 'קודי צבע ומידות' },
    { icon: 'Truck', title: 'מוכן להעברה', description: 'לספקים ושותפים' },
    { icon: 'Award', title: 'מקצועיות', description: 'רושם של ארגון רציני' },
    { icon: 'Key', title: 'שליטה במותג', description: 'הבעלות בידיים שלכם' },
  ],
  // Copywriting
  'copywriting': [
    { icon: 'MessageSquare', title: 'טון דיבור', description: 'קול ייחודי למותג' },
    { icon: 'Target', title: 'מסרים שפוגעים', description: 'במלאה ובמדויק' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'מילים שנוגעות' },
    { icon: 'TrendingUp', title: 'המרות גבוהות', description: 'טקסט שמוכר' },
    { icon: 'Brain', title: 'פסיכולוגיה', description: 'שכנוע מבוסס מדע' },
    { icon: 'Star', title: 'בידול חד', description: 'לא עוד אחד' },
    { icon: 'Smile', title: 'אישיות', description: 'מותג עם אופי' },
    { icon: 'Repeat', title: 'סיסמאות חזקות', description: 'משפטים שנשארים' },
    { icon: 'FileText', title: 'תוכן מותג', description: 'כל הטקסטים מוכנים' },
    { icon: 'Globe', title: 'עברית מושלמת', description: 'ניסוח מקומי אותנטי' },
    { icon: 'Zap', title: 'כותרות חזקות', description: 'תופסים תשומת לב' },
    { icon: 'Award', title: 'מסר מנצח', description: 'יתרון על המתחרים' },
  ],
  // Google Ads
  'google-ads': [
    { icon: 'Target', title: 'מיקוד מדויק', description: 'הגעה לקהל הנכון' },
    { icon: 'DollarSign', title: 'ROI מוכח', description: 'תשואה על כל שקל' },
    { icon: 'Search', title: 'כוונת רכישה', description: 'לקוחות שמחפשים אתכם' },
    { icon: 'TrendingUp', title: 'צמיחה מהירה', description: 'תוצאות מהיום הראשון' },
    { icon: 'Gauge', title: 'שליטה מלאה', description: 'תקציב גמיש ומדיד' },
    { icon: 'Eye', title: 'חשיפה מקסימלית', description: 'ראשונים בתוצאות גוגל' },
    { icon: 'BarChart2', title: 'נתונים בזמן אמת', description: 'מעקב וניתוח מתמיד' },
    { icon: 'Filter', title: 'קהלים מותאמים', description: 'פילוח דמוגרפי מדויק' },
    { icon: 'RefreshCw', title: 'אופטימיזציה יומית', description: 'שיפור ביצועים קבוע' },
    { icon: 'Zap', title: 'תגובה מיידית', description: 'המרות בזמן אמת' },
    { icon: 'Scale', title: 'סקייל חכם', description: 'הגדלה בלי בזבוז' },
    { icon: 'Award', title: 'מעמד מוביל', description: 'ניצחון על המתחרים' },
  ],
  // Meta Ads
  'meta-ads': [
    { icon: 'Users', title: 'קהלים מותאמים', description: 'טירגוט לפי התנהגות' },
    { icon: 'Heart', title: 'מעורבות גבוהה', description: 'לייקים, שיתופים, תגובות' },
    { icon: 'Image', title: 'קריאייטיב שמוכר', description: 'עיצובים שעוצרים גלילה' },
    { icon: 'Video', title: 'וידאו ממיר', description: 'סטוריז וריילס אפקטיביים' },
    { icon: 'Repeat', title: 'ריטרגטינג חכם', description: 'חזרה ללקוחות מתעניינים' },
    { icon: 'Layers', title: 'פאנל מלא', description: 'מודעות לכל שלב' },
    { icon: 'Smartphone', title: 'מובייל פירסט', description: 'אופטימיזציה לסלולר' },
    { icon: 'Globe', title: 'חשיפה רחבה', description: '3 מיליון ישראלים' },
    { icon: 'ShoppingBag', title: 'קטלוג דינמי', description: 'מוצרים מותאמים אישית' },
    { icon: 'TrendingUp', title: 'לידים איכותיים', description: 'טפסים מובנים בפלטפורמה' },
    { icon: 'Sparkles', title: 'מיתוג ויראלי', description: 'בניית מודעות למותג' },
    { icon: 'BarChart', title: 'פיקסל חכם', description: 'מעקב המרות מדויק' },
  ],
  // Email Marketing
  'email-marketing': [
    { icon: 'Mail', title: 'הגעה ישירה', description: 'לתיבה של הלקוח' },
    { icon: 'DollarSign', title: 'עלות אפסית', description: 'החזר השקעה הגבוה ביותר' },
    { icon: 'Users', title: 'קשר אישי', description: 'פרסונליזציה מתקדמת' },
    { icon: 'Calendar', title: 'אוטומציה מלאה', description: 'שליחה בזמן הנכון' },
    { icon: 'BarChart2', title: 'מדידה מדויקת', description: 'פתיחות, קליקים, המרות' },
    { icon: 'Repeat', title: 'נאמנות לקוחות', description: 'שימור וחזרה לרכישה' },
    { icon: 'Zap', title: 'מענה מהיר', description: 'הודעות טריגר אוטומטיות' },
    { icon: 'Edit', title: 'תוכן מותאם', description: 'סגמנטציה חכמה' },
    { icon: 'Target', title: 'A/B טסטינג', description: 'אופטימיזציה מתמדת' },
    { icon: 'ShoppingBag', title: 'עגלות נטושות', description: 'שחזור מכירות אבודות' },
    { icon: 'Bell', title: 'עדכונים שוטפים', description: 'ניוזלטרים שנפתחים' },
    { icon: 'Lock', title: 'רשימה שלכם', description: 'נכס דיגיטלי בבעלותכם' },
  ],
  // Influencer Marketing
  'influencer': [
    { icon: 'Star', title: 'אמינות גבוהה', description: 'המלצה מאדם אמיתי' },
    { icon: 'Users', title: 'קהל נאמן', description: 'עוקבים שמקשיבים' },
    { icon: 'Heart', title: 'חיבור רגשי', description: 'תוכן אותנטי ומחבר' },
    { icon: 'Eye', title: 'חשיפה אורגנית', description: 'נראות ללא מודעות' },
    { icon: 'MessageSquare', title: 'שיח אמיתי', description: 'מעורבות בתגובות' },
    { icon: 'TrendingUp', title: 'ויראליות', description: 'פוטנציאל להתפשטות' },
    { icon: 'Video', title: 'תוכן יצירתי', description: 'סטוריז, ריילס, לייבים' },
    { icon: 'Target', title: 'נישה מדויקת', description: 'הקהל הרלוונטי בדיוק' },
    { icon: 'Award', title: 'שיתופי פעולה', description: 'קמפיינים ייחודיים' },
    { icon: 'Rocket', title: 'השקות מוצרים', description: 'באז מיידי לחדשות' },
    { icon: 'Link', title: 'קודי הנחה', description: 'מעקב וייחוס מדויק' },
    { icon: 'Globe', title: 'מותג חזק', description: 'בניית מודעות ארוכת טווח' },
  ],
};

// Default/fallback vision items
export const defaultVisionItems: VisionItem[] = [
  { icon: 'Zap', title: 'יעילות מקסימלית', description: 'תוצאות מהירות יותר' },
  { icon: 'TrendingUp', title: 'צמיחה עסקית', description: 'הגדלת ההכנסות' },
  { icon: 'Users', title: 'חווית לקוח', description: 'שביעות רצון גבוהה' },
  { icon: 'Shield', title: 'אמינות מוכחת', description: 'תוצאות עקביות' },
  { icon: 'Clock', title: 'חיסכון בזמן', description: 'יותר שעות פנויות' },
  { icon: 'Target', title: 'מיקוד בתוצאות', description: 'השגת יעדים' },
  { icon: 'Heart', title: 'שירות אישי', description: 'ליווי צמוד' },
  { icon: 'Star', title: 'איכות גבוהה', description: 'ללא פשרות' },
  { icon: 'Rocket', title: 'התקדמות מהירה', description: 'צעדים גדולים' },
  { icon: 'Eye', title: 'שקיפות מלאה', description: 'תקשורת פתוחה' },
  { icon: 'Settings', title: 'התאמה אישית', description: 'פתרון מדויק' },
  { icon: 'Award', title: 'מומחיות', description: 'ניסיון עשיר' },
];

/**
 * Get vision items for a specific service
 */
export const getVisionItems = (slug: string): VisionItem[] => {
  return visionBoardItemsByService[slug] || defaultVisionItems;
};

/**
 * Get card colors based on accent color and index
 */
export const getCardColors = (accentColor: string, index: number) => {
  const variations = [
    { bg: accentColor, text: '#ffffff', light: false },
    { bg: '#ffffff', text: '#1f2937', light: true },
    { bg: `${accentColor}20`, text: '#1f2937', light: true },
    { bg: '#fef3c7', text: '#92400e', light: true },
    { bg: '#dbeafe', text: '#1e40af', light: true },
    { bg: '#f3e8ff', text: '#7c3aed', light: true },
    { bg: '#dcfce7', text: '#166534', light: true },
    { bg: '#ffe4e6', text: '#be123c', light: true },
    { bg: '#ffffff', text: '#1f2937', light: true },
    { bg: accentColor, text: '#ffffff', light: false },
    { bg: '#e0e7ff', text: '#3730a3', light: true },
    { bg: '#fef9c3', text: '#854d0e', light: true },
  ];
  return variations[index % variations.length];
};
