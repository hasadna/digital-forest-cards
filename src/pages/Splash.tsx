import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import logo from "@/assets/tu-bishvat-logo.webp";
import treeOne from "@/assets/donate.svg";
import treeTwo from "@/assets/tree-identification.svg";
import treeThree from "@/assets/vision.svg";

const Splash = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate("/app", { 
        state: { 
          initialSearchValue: searchValue.trim(),
          initialSearchType: searchValue.includes("+") ? "tree-id" : "internal-id"
        } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8FF]" dir="rtl">
      <Header />

      <main className="relative flex-1 px-4 py-10 pb-[150px] flex flex-col items-center justify-center">
        <div className={`mx-auto w-full max-w-[430px] transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                <p>רואים מידע שהעירייה שיתפה</p>
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
