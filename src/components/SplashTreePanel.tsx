import type { ReactNode } from "react";

type SplashTreePanelProps = {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
};

export const SplashTreePanel = ({
  isOpen,
  children,
  className = "",
}: SplashTreePanelProps) => {
  return (
    <div
      className={`w-full overflow-hidden transition-all duration-800 ease-out ${isOpen ? "flex-1 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      aria-hidden={!isOpen}
    >
      <section
        className={`-mt-2 w-full min-h-full bg-[#4C4040] px-6 py-10 text-white shadow-lg ${className}`}
      >
        {children}
      </section>
    </div>
  );
};
