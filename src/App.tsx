import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import ReviewDashboard from "./pages/ReviewDashboard";
import UsagePolicy from "./pages/UsagePolicy";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";
import { trackButtonClick, trackInputChange } from "@/lib/analytics";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button || !(button instanceof HTMLButtonElement)) return;
      if (button.hasAttribute("data-analytics-ignore")) return;
      if (!button.hasAttribute("data-analytics-label") && !button.hasAttribute("data-analytics-event")) return;

      trackButtonClick(button);
    };

    const handleChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type === "hidden") return;
      if (target.hasAttribute("data-analytics-ignore")) return;
      if (!target.hasAttribute("data-analytics-label") && !target.hasAttribute("data-analytics-event")) return;

      trackInputChange(target);
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("change", handleChange, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("change", handleChange, true);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/tree" element={<Index />} />
            <Route path="/review" element={<ReviewDashboard />} />
            <Route path="/usage-policy" element={<UsagePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
