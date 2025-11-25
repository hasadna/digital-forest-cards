import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TreeIdInputProps {
  onSearch: (treeId: string) => void;
}

export const TreeIdInput = ({ onSearch }: TreeIdInputProps) => {
  const [treeId, setTreeId] = useState("8G4P4VXP+GR5V");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (treeId.trim()) {
      onSearch(treeId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" dir="rtl">
      <div className="flex gap-2">
        <Input
          type="text"
          value={treeId}
          onChange={(e) => setTreeId(e.target.value)}
          placeholder="הזן מזהה עץ"
          className="flex-1 text-right"
        />
        <Button type="submit" size="icon" className="flex-shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground text-right">
        דוגמה: 8G4P4VXP+GR5V
      </p>
    </form>
  );
};
