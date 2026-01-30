import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import treeOne from "@/assets/tree-1.svg";
import treeTwo from "@/assets/tree-2.svg";
import treeThree from "@/assets/tree-3.svg";

const Splash = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8FF]" dir="rtl">
      <Header />

      <main className="relative flex-1 px-4 py-10 pb-[150px]">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="relative rounded-[11px] border border-[#D1CFCF] bg-white px-6 pb-8 pt-[96px] text-center">
            <div className="absolute left-1/2 top-[20px] flex h-[86px] w-[86px] -translate-x-1/2 items-center justify-center rounded-full bg-[#354F3D] text-lg font-medium text-white">
              לוגו
            </div>

            <div className="text-black">
              <p className="mt-6 text-[40px] font-bold leading-[46px]">המְּזַעֵץ</p>
              <h1 className="mt-0 text-[24px] font-bold leading-[38px]">
                לדעת יותר עצי רחוב מסומנים
              </h1>
              <div className="mt-4 text-[20px] font-medium leading-[30px]">
                <p>להוסיף מידע עדכני</p>
                <p>ולעזור לנהל את היער העירוני</p>
              </div>
            </div>

            <div className="relative mt-10 h-[47px] overflow-hidden rounded-[11px] border border-[#D1CFCF] bg-white">
              <Link to="/app" className="absolute left-0 top-0 h-full">
                <span className="inline-flex h-full items-center justify-center rounded-[11px] bg-[#354F3D] px-6 text-[16px] font-medium text-white">
                  חיפוש
                </span>
              </Link>
              <input
                type="text"
                placeholder="מספר העץ..."
                className="h-full w-full bg-transparent pl-24 pr-4 text-right text-[20px] text-[#053856] placeholder:text-[#053856]/60 focus:outline-none"
              />
            </div>

            <p className="mt-4 text-center text-[14px] leading-[35px] text-[#383838]">
              חשוב לדעת: אם אין לעץ תגית מספר, לא ניתן לחפשו
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-4">
          <img src={treeOne} alt="" className="h-[127px] w-auto" />
          <img src={treeTwo} alt="" className="h-[127px] w-auto" />
          <img src={treeThree} alt="" className="h-[127px] w-auto" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Splash;
