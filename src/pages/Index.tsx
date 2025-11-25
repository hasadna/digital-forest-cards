import { useState } from "react";
import { TreeCard } from "@/components/TreeCard";
import { TreeIdInput } from "@/components/TreeIdInput";
import { TreePine } from "lucide-react";

const Index = () => {
  const [treeId, setTreeId] = useState("8G4P4VXP+GR5V");

  // Mock data - in real app, this would be fetched from the API
  const mockTreeData = {
    id: treeId,
    species: "אקליפטוס",
    trunkDiameter: 45,
    height: 12,
    canopyArea: 28,
    age: 25,
    location: "הוד השרון, רחוב הבנים 12",
    environment: "רחוב",
    status: "identified" as const,
  };

  const handleSearch = (newTreeId: string) => {
    setTreeId(newTreeId);
    // Here you would fetch the actual tree data from the Digital Forest API
    console.log("Searching for tree:", newTreeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background" dir="rtl">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">יער דיגיטלי</h1>
              <p className="text-xs text-muted-foreground">מידע על עצים עירוניים</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        {/* Search Section */}
        <div className="bg-card p-4 rounded-lg shadow-md border border-primary/10">
          <h2 className="text-lg font-semibold mb-3 text-foreground text-right">חיפוש עץ</h2>
          <TreeIdInput onSearch={handleSearch} />
        </div>

        {/* Tree Card */}
        <TreeCard data={mockTreeData} />

        {/* Info Section */}
        <div className="bg-card p-4 rounded-lg shadow-sm border border-primary/10">
          <p className="text-sm text-muted-foreground text-right leading-relaxed">
            המידע מתבסס על בסיס הנתונים הלאומי של הערים הדיגיטליות. 
            כל הנתונים מקורם ממיפוי ומדידות של עצים עירוניים ברחבי הארץ.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
