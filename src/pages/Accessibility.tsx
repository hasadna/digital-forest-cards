import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Accessibility = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8FF] text-slate-900" dir="rtl">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[430px] px-4 pb-16 pt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-right shadow-sm">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#1B4332]">הצהרת נגישות</h1>
              <p className="text-sm text-slate-500">עדכון אחרון 15 ינואר 2026</p>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-800">
              <p className="mt-0">
                אנחנו, באתר כרטיס עץ (&quot;המזעץ&quot;) מכבדים את כל פלחי האוכלוסיה. לכן, ניסחנו הצהרת נגישות זו כדי להבהיר לך בדיוק מה הצעדים שננקטו להבטיח הכלה ושמירה על כל האוכלוסיות.
              </p>
              <p className="mt-0">
                הצהרת הנגישות שלנו נוצרה על ידי מחולל הצהרת הנגישות של יהונתן קלינגר, אך יהונתן אינו ערב לטיבה של ההצהרה, והוא לא בדק את הנתונים שהוזנו בטפסים. השימוש בהצהרת נגישות זו הוא על אחריות המשתמש בלבד, ובהתאם למידע שהוזן.
              </p>

              <h3 className="mt-4 text-base font-bold text-[#1B4332]">רמת הנגישות באתר</h3>
              <p className="mt-0">
                כללי התוכן האינטרנטי לנגישות (WCAG) מגדירים דרישות למעצבים לשפר את הנגישות לאנשים עם מוגבלויות. הם מגדירים שלוש רמות תאימות: רמה A, רמה AA ורמה AAA.
              </p>
              <p className="mt-0">
                האתר שלנו עומד ברמת נגישות AA לפי תקן WCAG.
              </p>
              <p className="mt-0">
                עם זאת, יתכנו חריגות ועמודים שלא עומדים בתקן זה, ובמקרה כזה, אנא הודיעו לנו ונעשה כמיטב יכולתנו לתקן.
              </p>

              <h3 className="mt-4 text-base font-bold text-[#1B4332]">הדרך בה ביצענו את ההתאמות</h3>
              <p className="mt-0">
                ביצענו את ההתאמות באמצעות התאמת קוד האתר ובדיקה באמצעות כלי פיתוח אוטומטיים (lighthouse, קורא מסך).
              </p>

              <h3 className="mt-4 text-base font-bold text-[#1B4332]">ההתאמות שביצענו באתר</h3>
              <p className="mt-0">לצורך עמידה בהוראות הנגישות, ביצענו מספר התאמות באתר. אלה כוללות:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>הטקסטים נכתבו בשפה קריאה</li>
                <li>נבחרו צבעים המקלים על קריאה של המשתמשים</li>
                <li>לכל התמונות והאלמנטים האינטראקטיביים יש חיווי טקסטואלי</li>
                <li>מבנה הניווט באתר קבוע</li>
                <li>ניתן להשתמש במקלדת ובגלגלת העכבר להגדלת והקטנת הטקסט</li>
              </ul>

              <h3 className="mt-4 text-base font-bold text-[#1B4332]">החרגות בנגישות</h3>
              <p className="mt-0">
                ישנן מספר החרגות, שנובעות מכך שלמרות מאמצים, לא הצלחנו לסדרן. החרגות אלה הן:
              </p>
              <p className="mt-0">
                הנגשת תצוגת מפה. הפרויקט הינו פיילוט הנמצא בבנייה (גרסת בטא), ולכן התאמות נוספות יתבצעו בהמשך. בכל שאלה ניתן לפנות אלינו וניתן מענה ישיר ואישי.
              </p>

              <h3 className="mt-4 text-base font-bold text-[#1B4332]">יצירת קשר ופניות</h3>
              <p className="mt-0">
                לכל שאלה או פניה, ממונה הנגישות באתר יהא זמין וניתן ליצור עמו קשר כך:
              </p>
              <p className="mt-0">
                אמרי בריקנר, הסדנא לידע ציבורי,{" "}
                <a href="mailto:emri@hasadna.org.il" className="font-semibold underline underline-offset-2 hover:text-[#1B4332]">
                  emri@hasadna.org.il
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accessibility;
