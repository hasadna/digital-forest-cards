import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TreeIdInputProps {
  onSearch: (searchValue: string, searchType: "tree-id" | "internal-id") => void;
}

export const TreeIdInput = ({ onSearch }: TreeIdInputProps) => {
  const [searchValue, setSearchValue] = useState("8G4P4VXP+GR5V");

  // Detect search type: if it contains a '+', it's a tree-id, otherwise it's an internal-id
  const detectSearchType = (value: string): "tree-id" | "internal-id" => {
    return value.includes("+") ? "tree-id" : "internal-id";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const trimmedValue = searchValue.trim();
      const searchType = detectSearchType(trimmedValue);
      onSearch(trimmedValue, searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" dir="rtl">
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="הזן מזהה עץ או מספר פנימי"
          className="flex-1 text-right"
        />
        <Button type="submit" size="icon" className="flex-shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground text-right">
        דוגמה למזהה עץ: 8G4P4VXP+GR5V | דוגמה למספר פנימי: 3913
      </p>
    </form>
  );
};
