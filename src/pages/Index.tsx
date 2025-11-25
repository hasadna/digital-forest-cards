import { useState } from "react";
import { TreeCard } from "@/components/TreeCard";
import { TreeIdInput } from "@/components/TreeIdInput";
import { TreePine } from "lucide-react";

const Index = () => {
  const [treeId, setTreeId] = useState("8G4P4VXP+GR5V");

  // Mock data based on the original tree data from Digital Forest
  const mockTreeData = {
    id: treeId,
    species: "מייש דרומי",
    trunkDiameter: 17.0,
    height: 5.0,
    canopyArea: 47.7,
    crownDiameter: 7.0,
    ageEstimated: true,
    municipality: "הוד השרון",
    street: "שלמה בן יוסף",
    parcel: "6442/410",
    coordinates: "32.14877, 34.8871",
    treeSpace: "מדרכה",
    internalIds: ["3913", "canopy-1140206"],
    photoUrl: "https://s3.eu-west-2.wasabisys.com/opentreebase-public/source/hod-hasharon/photos/3913.jpg",
    dataSources: [
      { name: "מיפוי חופות עצים", date: "2023-02-06" },
      { name: "סקר עצים הוד השרון", date: "2023-12-01" }
    ],
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
