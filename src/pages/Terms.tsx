import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";

const Terms = memo(() => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "ינואר 2025";

  return (
    <>
      <Helmet>
        <html lang="he" dir="rtl" />
        <title>תנאי שימוש | NEXO Agency</title>
        <meta name="description" content="תנאי השימוש של נקסו - הסכם משפטי המסדיר את השימוש באתר ובשירותים שלנו. קרא לפני השימוש באתר." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nexoagency.org/terms" />
      </Helmet>

      <GlassNavbar />

      <main dir="rtl" lang="he" className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              תנאי שימוש
            </h1>
            <p className="text-muted-foreground mb-8">
              עודכן לאחרונה: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">מבוא והגדרות</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ברוכים הבאים לאתר של NEXO Agency (להלן: "החברה", "אנחנו" או "נקסו").
                  תנאי שימוש אלה מהווים הסכם משפטי מחייב בינך לבין החברה. השימוש באתר מהווה
                  הסכמה לתנאים אלה. אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>"האתר"</strong> - אתר האינטרנט של NEXO Agency הזמין בכתובת nexoagency.org
                  וכל תת-הדומיינים שלו.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>"השירותים"</strong> - שירותי עיצוב, פיתוח, שיווק דיגיטלי וכל שירות אחר
                  שמסופק על ידי החברה.
                </p>
              </section>

              {/* Use of Website */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שימוש באתר</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  בעת השימוש באתר, הנך מתחייב:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>להשתמש באתר למטרות חוקיות בלבד</li>
                  <li>לא להפריע לפעילות התקינה של האתר</li>
                  <li>לא לנסות לגשת למערכות או מידע שאינם מיועדים לך</li>
                  <li>לא להעלות תוכן פוגעני, מזיק או בלתי חוקי</li>
                  <li>לא להשתמש באתר להפצת ספאם או תוכן פרסומי</li>
                  <li>לספק מידע מדויק ועדכני בטפסי יצירת קשר</li>
                </ul>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">השירותים שלנו</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  החברה מספקת שירותים בתחומים הבאים:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>עיצוב ופיתוח אתרי אינטרנט</li>
                  <li>מיתוג ועיצוב גרפי</li>
                  <li>שיווק דיגיטלי וקידום אתרים (SEO)</li>
                  <li>פתרונות AI ואוטומציה</li>
                  <li>ניהול רשתות חברתיות</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  פרטי השירותים, מחירים ותנאי התקשרות יסוכמו בהסכם נפרד בין הצדדים.
                  המידע באתר מוצג למטרות מידע כללי בלבד ואינו מהווה הצעה מחייבת.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">קניין רוחני</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  כל התכנים באתר, לרבות אך לא רק:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>טקסטים, תמונות, גרפיקה ועיצובים</li>
                  <li>לוגואים, סימני מסחר ושמות מותג</li>
                  <li>קוד, תוכנה ורכיבים טכניים</li>
                  <li>סרטונים, אנימציות ותוכן מולטימדיה</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  הינם קניינה הבלעדי של החברה או של צדדים שלישיים שהעניקו לנו רישיון.
                  אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור מראש ובכתב.
                </p>
              </section>

              {/* User Content */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">תוכן משתמשים</h2>
                <p className="text-muted-foreground leading-relaxed">
                  בשליחת תוכן דרך האתר (טפסים, הודעות וכו'), הנך מאשר כי:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>התוכן אינו מפר זכויות של צד שלישי</li>
                  <li>התוכן אינו בלתי חוקי, פוגעני או מזיק</li>
                  <li>אתה מעניק לנו רישיון לשימוש בתוכן לצורכי מתן השירותים</li>
                  <li>המידע שסיפקת הינו מדויק ועדכני</li>
                </ul>
              </section>

              {/* Disclaimer */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">הגבלת אחריות</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  האתר והתכנים בו מסופקים "כמות שהם" (AS IS) ללא כל מצג או אחריות מכל סוג.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>איננו מתחייבים שהאתר יהיה זמין באופן רציף וללא הפרעות</li>
                  <li>איננו אחראים לנזקים כתוצאה משימוש או חוסר יכולת לשימוש באתר</li>
                  <li>המידע באתר הוא כללי ואינו מהווה ייעוץ מקצועי</li>
                  <li>קישורים לאתרים חיצוניים אינם מעידים על המלצה או אחריות מצדנו</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  בכל מקרה, אחריותנו הכוללת לא תעלה על הסכום ששילמת לנו עבור השירותים
                  ב-12 החודשים שקדמו לאירוע.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שיפוי</h2>
                <p className="text-muted-foreground leading-relaxed">
                  הנך מתחייב לשפות ולפצות את החברה, עובדיה ונציגיה מפני כל תביעה, נזק,
                  הוצאה או אובדן הנובעים מ:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>הפרת תנאי שימוש אלה על ידך</li>
                  <li>הפרת זכויות צד שלישי על ידך</li>
                  <li>שימוש בלתי חוקי או בלתי מורשה באתר</li>
                </ul>
              </section>

              {/* Modifications */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שינויים בתנאים</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. שינויים מהותיים
                  יפורסמו באתר עם תאריך העדכון. המשך השימוש באתר לאחר פרסום השינויים
                  מהווה הסכמה לתנאים המעודכנים.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">הפסקת שימוש</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו רשאים להגביל או לחסום את גישתך לאתר בכל עת, ללא הודעה מוקדמת,
                  במקרה של הפרת תנאי שימוש אלה או מכל סיבה אחרת לפי שיקול דעתנו.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">דין וסמכות שיפוט</h2>
                <p className="text-muted-foreground leading-relaxed">
                  תנאי שימוש אלה כפופים לחוקי מדינת ישראל. כל מחלוקת תידון בבתי המשפט
                  המוסמכים במחוז תל אביב-יפו בלבד.
                </p>
              </section>

              {/* Severability */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">הפרדה</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אם תנאי כלשהו מתנאים אלה יימצא בלתי חוקי או בלתי אכיף, שאר התנאים
                  ימשיכו לחול במלואם.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">יצירת קשר</h2>
                <p className="text-muted-foreground leading-relaxed">
                  לשאלות בנוגע לתנאי השימוש, ניתן לפנות אלינו:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li><strong>דוא"ל:</strong> sales@nexoagency.org</li>
                  <li><strong>טלפון:</strong> 053-362-2423</li>
                  <li><strong>כתובת:</strong> תל אביב, ישראל</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
});

Terms.displayName = 'Terms';

export default Terms;
