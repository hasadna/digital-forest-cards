import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import logo from "@/assets/tu-bishvat-logo.png";
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
            {/* Festive Tu BiShvat Background Element */}
            <div className="absolute top-0 left-0 w-full h-24 bg-[#354F3D] opacity-10" />
            
            <div className="absolute left-1/2 top-[20px] -translate-x-1/2 transform transition-transform duration-700 hover:scale-110">
              <div className="h-[120px] w-[120px] rounded-full bg-white p-1 shadow-md border-4 border-[#354F3D]">
                <img 
                  src={logo} 
                  alt="המזעץ - לוגו טו בשבט" 
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="text-black mt-12">
              <p className="text-[48px] font-bold leading-[56px] text-[#354F3D]">המְּזַעֵץ</p>
              <div className="mt-2 space-y-1">
                <h1 className="text-[26px] font-bold leading-[34px] text-[#2D3A2F]">
                  לדעת יותר על עצי הרחוב
                </h1>
                <p className="text-[18px] font-medium text-[#4A5D4E] italic">
                  חג לאילנות, חג ליער העירוני
                </p>
              </div>
              
              <div className="mt-6 text-[20px] font-medium leading-[28px] text-[#383838]">
                <p>עוזרים לנהל את היער העירוני</p>
                <p>ומגלים את הסיפור של כל עץ</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="relative mt-10 h-[54px] overflow-hidden rounded-[15px] border-2 border-[#354F3D] bg-white shadow-sm">
              <button type="submit" className="absolute left-0 top-0 h-full">
                <span className="inline-flex h-full items-center justify-center bg-[#354F3D] px-8 text-[18px] font-bold text-white transition-colors hover:bg-[#2D3A2F]">
                  חיפוש
                </span>
              </button>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="הכנס מספר עץ..."
                className="h-full w-full bg-transparent pl-28 pr-6 text-right text-[20px] text-[#053856] placeholder:text-[#053856]/40 focus:outline-none"
              />
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[#666]">
              <div className="h-px w-8 bg-gray-300" />
              <p className="text-[14px]">כי לכל עץ יש שם</p>
              <div className="h-px w-8 bg-gray-300" />
            </div>
          </div>
        </div>

        {/* Decorative Trees */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-6 pb-4 opacity-80">
          <img src={treeOne} alt="" className="h-[140px] w-auto transition-transform hover:scale-105" />
          <img src={treeTwo} alt="" className="h-[160px] w-auto transition-transform hover:scale-105" />
          <img src={treeThree} alt="" className="h-[140px] w-auto transition-transform hover:scale-105" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Splash;
