import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashTreePanel } from "@/components/SplashTreePanel";
import logo from "@/assets/tu-bishvat-logo.webp";
import treeOne from "@/assets/donate.svg";
import treeOneSelected from "@/assets/donate-selected.svg";
import treeTwo from "@/assets/tree-identification.svg";
import treeTwoSelected from "@/assets/tree-identification-selected.svg";
import treeThree from "@/assets/vision.svg";
import treeThreeSelected from "@/assets/vision-selected.svg";

const Splash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIdentificationOpen, setIsIdentificationOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate("/tree", { 
        state: { 
          initialSearchValue: searchValue.trim(),
          initialSearchType: searchValue.includes("+") ? "tree-id" : "internal-id"
        } 
      });
    }
  };

  const handleDonateToggle = () => {
    setIsDonateOpen((current) => {
      const next = !current;
      if (next) {
        setIsVisionOpen(false);
        setIsIdentificationOpen(false);
      }
      return next;
    });
  };

  const handleIdentificationToggle = () => {
    setIsIdentificationOpen((current) => {
      const nextValue = !current;
      if (nextValue) {
        setIsVisionOpen(false);
        setIsDonateOpen(false);
      }
      return nextValue;
    });
  };

  const handleVisionToggle = () => {
    setIsVisionOpen((current) => {
      const next = !current;
      if (next) {
        setIsDonateOpen(false);
        setIsIdentificationOpen(false);
      }
      return next;
    });
  };

  const isPanelOpen = isIdentificationOpen || isVisionOpen || isDonateOpen;

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8FF]" dir="rtl">
      <Header />

      <main className="relative flex-1 pt-10 flex flex-col items-center">
        <div className={`mx-auto w-full max-w-[430px] px-4 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-[20px] border border-[#D1CFCF] bg-white px-6 pb-10 pt-[100px] text-center shadow-lg overflow-hidden">
            
            <div className="absolute left-1/2 top-[20px] -translate-x-1/2 transform transition-transform duration-700 hover:scale-110">
              <div className="h-[140px] w-[140px] rounded-full bg-white p-3 overflow-hidden">
                <img 
                  src={logo} 
                  alt="המזעץ - לוגו טו בשבט" 
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="text-black mt-16">
              <p className="mt-6 text-[40px] font-bold leading-[46px]">המְּזַעֵץ</p>
              <h1 className="mt-0 text-[24px] font-bold leading-[38px]">
              מידע אזרחי למען היער העירוני  
              </h1>
              <div className="mt-10 text-[16px] font-medium leading-[28px]">
                <p>מקלידים מספר עץ עירוני</p>
                <p className="text-[#354F3D]">רואים מידע שהעירייה שיתפה</p>
                <p>ומתעדים בעזרת תמונה עדכנית משלכם</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="relative mt-6 h-[47px] overflow-hidden rounded-[11px] border border-[#D1CFCF] bg-white">
              <button type="submit" className="absolute left-0 top-0 h-full">
                <span className="inline-flex h-full items-center justify-center rounded-[11px] bg-[#354F3D] px-6 text-[16px] font-medium text-white">
                  חיפוש
                </span>
              </button>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="מספר העץ..."
                className="h-full w-full bg-transparent pl-24 pr-4 text-right text-[20px] text-[#053856] placeholder:text-[#053856]/60 focus:outline-none"
              />
            </form>

            <p className="mt-4 text-center text-[14px] leading-[35px] text-[#383838]">
              חשוב לדעת: אם אין לעץ תגית מספר, לא ניתן לחפשו
            </p>
          </div>
        </div>

        <div className="mt-10 w-full flex-1 flex flex-col items-center">
          <div className={`relative z-10 flex items-end gap-4 px-4 ${isPanelOpen ? "mt-0" : "mt-auto"}`}>
            <button
              type="button"
              onClick={handleDonateToggle}
              className="group"
              aria-pressed={isDonateOpen}
            >
              <img
                src={isDonateOpen ? treeOneSelected : treeOne}
                alt="לתרום"
                className={`h-[127px] w-auto transition-transform duration-800 group-hover:scale-105 ${isDonateOpen ? "scale-105" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={handleIdentificationToggle}
              className="group"
              aria-pressed={isIdentificationOpen}
            >
              <img
                src={isIdentificationOpen ? treeTwoSelected : treeTwo}
                alt="זיהוי עץ"
                className={`h-[127px] w-auto transition-transform duration-800 group-hover:scale-105 ${isIdentificationOpen ? "scale-105" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={handleVisionToggle}
              className="group"
              aria-pressed={isVisionOpen}
            >
              <img
                src={isVisionOpen ? treeThreeSelected : treeThree}
                alt="חזון"
                className={`h-[127px] w-auto transition-transform duration-800 group-hover:scale-105 ${isVisionOpen ? "scale-105" : ""}`}
              />
            </button>
          </div>

          <SplashTreePanel
            isOpen={isDonateOpen}
            className="bg-[#493F3F] px-[42px] pt-[30px] pb-[24px]"
          >
            <h2 className="text-center text-[30px] font-bold leading-[36px] text-[#CAA241]">
              לתרום
            </h2>
            <p className="mt-3 text-center text-[16px] leading-[26px] text-white">
              תרמו לנו. כך נוכל להמשיך ולפתוח מידע ציבורי ולהפוך אתכם לשותפים
              למיפוי היער העירוני.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="https://www.jgive.com/new/he/ils/charity-organizations/652"
                className="inline-flex items-center justify-center rounded-[14px] bg-[#CAA241] px-12 py-3 text-[18px] font-bold text-white transition-opacity hover:opacity-90"
              >
                לתרומה
              </a>
            </div>
            <div className="mt-6 text-center text-[14px] leading-[24px] text-white">
              <p>
                עלינו.{" "}
                <a
                  href="https://www.hasadna.org.il/"
                  className="underline underline-offset-2 transition-opacity hover:opacity-90"
                >
                  הסדנא לידע ציבורי
                </a>{" "}
                היא ארגון ללא מטרת רווח. אנו פועלים לפתיחת מידע ציבורי והנגשתו
                בעזרת מתנדבים ואנשי קוד פתוח משנת 2011.
              </p>
              <p className="mt-4">
                אנחנו פועלים לקידום היער העירוני באמצעות נתונים. פרויקט המזעץ
                נולד מתוך פרויקט יער עירוני דיגיטלי בו יצרנו תשתית נתונים ארצית
                ליער העירוני עם מאות אלפי עצים מזוהים ועוד למעלה מ-2.5 מיליון
                עצים נוספים.
              </p>
              <p className="mt-4">
                <a
                  href="https://www.treecatalog.org.il/"
                  className="underline underline-offset-2 transition-opacity hover:opacity-90"
                >
                  קטלוג עצי רחוב וצל
                </a>{" "}
                הוא פרויקט נוסף בו אספנו והנגשנו מידע ציבורי אודות מיני עצים.
              </p>
              <p className="mt-4 font-bold">תודה!</p>
            </div>
          </SplashTreePanel>

          <SplashTreePanel isOpen={isIdentificationOpen} className="bg-[#493F3F]">
            <h2 className="text-center text-[30px] font-bold leading-[36px] text-[#CAA241]">
              זיהוי עץ
            </h2>
            <p className="mt-2 text-center text-[18px] font-bold leading-[26px]">
              משפט ליד-אין הולך לכאן
            </p>
            <div className="pl-0 text-[14px] leading-[24px]">
              <p className="mt-6 font-bold">למה בכלל עצים מסומנים?</p>
              <p className="mt-2">
                כדי שעצים ישגשגו צריך לטפל בהם. גיזום, השקייה, הדברת מזיקים
                ועוד. הטיפולים נעשים על ידי אנשי שטח, ובשאיפה לכל עץ יש תיק
                המתעד את הטיפולים בו. העץ מסומן כדי להקל על זיהוי העץ בשטח
                ותיעוד ההיסטוריה שלו.
              </p>
              <p className="mt-4 font-bold">מי מסמן אותם?</p>
              <p className="mt-2">
                הרשות המקומית (או במילים פשוטות - העירייה שלכם) אחראית על כל
                העצים במרחב הציבורי. בדר&quot;כ זו מחלקת שפ&quot;ע או איכות
                הסביבה שאחראית על העצים וכל הגינון בעיר.
              </p>
              <p className="mt-4 font-bold">למה לא כל העצים מסומנים?</p>
              <p className="mt-2">
                הסימונים מתבצעים בדר&quot;כ במסגרת סקר עצים מרוכז הנעשה ע&quot;י
                אגרונומים או אילנאים המופעלים ע&quot;י קבלן חיצוני. בסקר אוספים
                הרבה מידע על העץ, כולל מיקום GPS מדוייק. מסיבה זו מדובר בסקר
                יקר למדי, ולכן קשה מאוד לסמן את כל העצים.
              </p>
              <p className="mt-4 font-bold">כאן אתם נכנסים לתמונה!</p>
              <p className="mt-2">
                קשה לסמן את כל העצים, אבל קשה לא פחות לעדכן את המידע. עזרו
                לעיר שלכם לעדכן את סקר העצים באמצעות התמונות שתעלו דרך המזעץ.
              </p>
            </div>
          </SplashTreePanel>

          <SplashTreePanel isOpen={isVisionOpen}>
            <h2 className="text-center text-[30px] font-bold leading-[36px] text-[#CAA241]">
              החָזוֹן שלנו
            </h2>
            <p className="mt-2 text-center text-[18px] font-bold leading-[26px]">
              העצים הם התשתית הירוקה של העיר
            </p>
            <div className="pl-0 text-[12px] leading-[20px]">
              <p className="mt-6">
                החלום הירוק שלנו הוא שלכל עץ יהיה מספר, ימופה וינוהל ממש כמו
                שמנהלים עמודי תאורה או כל תשתיות אחרת.
              </p>
              <p className="mt-4 space-y-0">
                כל עץ ביער העירוני שלנו הוא חלק בלתי נפרד מהתשתית העירונית. אך
                בניגוד לבטון ומתכת, &quot;התשתית הירוקה&quot; היא חיה, צומחת
                ומורכבת לניהול - וזה בדיוק המקום שבו אתם נכנסים לתמונה.
              </p>
              <p className="mt-0 space-y-0">
                אנחנו מאמינים שמידע על הטבע העירוני שייך לכולם. כשהמידע נגיש
                ושקוף, כל אזרח ואזרחית הופכים לשותפים עוצמתיים בשמירה על
                הריאות הירוקות שלנו. יחד, נעזור לרשויות למפות, לעדכן ולטפח את
                היער העירוני - לטובת כולנו.
              </p>
            </div>
          </SplashTreePanel>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Splash;
