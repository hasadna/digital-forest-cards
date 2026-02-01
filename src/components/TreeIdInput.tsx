import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { trackUiEvent } from "@/lib/analytics";

interface TreeIdInputProps {
  onSearch: (searchValue: string, searchType: "tree-id" | "internal-id") => void;
}

export const TreeIdInput = ({ onSearch }: TreeIdInputProps) => {
  const [searchValue, setSearchValue] = useState("");

  // Detect search type: if it contains a '+', it's a tree-id, otherwise it's an internal-id
  const detectSearchType = (value: string): "tree-id" | "internal-id" => {
    return value.includes("+") ? "tree-id" : "internal-id";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const trimmedValue = searchValue.trim();
      const searchType = detectSearchType(trimmedValue);
      trackUiEvent("tree_search_submit", {
        element_label: "tree_search_submit",
        search_value: trimmedValue,
        search_type: searchType,
        source: "tree_page",
      });
      onSearch(trimmedValue, searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2" dir="rtl">
      <div className="space-y-1">
        <label htmlFor="tree-search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          מזהה רשות
        </label>
        <div className="flex gap-2">
          <Input
            id="tree-search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="הזן מספר עץ..."
            data-analytics-label="tree_search_input"
            data-analytics-event="tree_search_input_change"
            className="flex-1 text-right"
          />
          <Button
            type="submit"
            className="flex-shrink-0 gap-2 px-6"
            data-analytics-label="tree_search_submit"
            data-analytics-ignore
          >
            <Search className="h-4 w-4" />
            <span>חפש</span>
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-right">
        מספר העץ שמחובר לעץ
      </p>
    </form>
  );
};
