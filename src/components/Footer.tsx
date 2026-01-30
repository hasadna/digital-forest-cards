import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="w-full bg-[#354F3D] py-6 text-center text-sm text-white" dir="rtl">
            <div className="container px-4">
                <div className="flex items-center justify-center gap-3 text-sm font-medium text-white/90">
                    <Link to="/usage-policy" className="hover:text-white">
                        תנאי שימוש
                    </Link>
                    <span className="text-white/70">|</span>
                    <a href="#" className="hover:text-white">
                        הצהרת נגישות
                    </a>
                </div>
                <div className="mx-auto my-4 h-px w-full max-w-4xl bg-white/25" />
                <p className="mx-auto max-w-4xl text-sm leading-relaxed text-white/90">
                    האתר מציג מידע ציבורי פתוח כפי שנאסף ע&quot;י הסדנא לידע ציבורי בפרויקט{" "}
                    <a href="https://www.digital-forest.org.il/" className="font-medium underline underline-offset-2 hover:text-white">
                        יער עירוני דיגיטלי
                    </a>{" "}
                    ו-
                    <a href="https://www.treecatalog.org.il/" className="font-medium underline underline-offset-2 hover:text-white">
                        קטלוג עצי רחוב וצל
                    </a>{" "}
                    כשירות לציבור. ייתכנו הבדלים בין המידע המוצג למצב בשטח בשל שגיאות באיסוף הנתונים במקור, בעיבוד
                    הנתונים או בשינויים שקרו בשטח.
                </p>
                <div className="mx-auto my-4 h-px w-full max-w-4xl bg-white/25" />
                <p className="text-sm text-white/90">
                    גרסת פיילוט. נשמח ללמוד ולשמוע רעיונות והצעות לשיפור{" "}
                    <a href="mailto:trees@hasadna.org.il" className="font-semibold underline underline-offset-2 hover:text-white">
                        trees@hasadna.org.il
                    </a>
                </p>
            </div>
        </footer>
    );
};
