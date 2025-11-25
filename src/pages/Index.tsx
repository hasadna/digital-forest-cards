import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TreeCard } from "@/components/TreeCard";
import { TreeIdInput } from "@/components/TreeIdInput";
import { TreePine, Loader2, AlertCircle } from "lucide-react";
import { fetchTreeData, transformTreeData } from "@/services/treeApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [treeId, setTreeId] = useState("8G4P4VXP+GR5V");

  // Fetch tree data using React Query
  const { data: apiData, isLoading, error, refetch } = useQuery({
    queryKey: ["tree", treeId],
    queryFn: () => fetchTreeData(treeId),
    enabled: !!treeId,
    retry: 1,
  });

  // Transform API data to component format
  const treeData = transformTreeData(apiData ?? []);

  const handleSearch = (newTreeId: string) => {
    setTreeId(newTreeId);
    // React Query will automatically refetch when treeId changes
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

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card p-8 rounded-lg shadow-md border border-primary/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-foreground">טוען נתוני עץ...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">שגיאה</AlertTitle>
            <AlertDescription className="text-right">
              לא ניתן לטעון את נתוני העץ. אנא בדוק את מזהה העץ ונסה שוב.
            </AlertDescription>
          </Alert>
        )}

        {/* No Data Found */}
        {!isLoading && !error && !treeData && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">לא נמצאו תוצאות</AlertTitle>
            <AlertDescription className="text-right">
              לא נמצא עץ עם המזהה {treeId}. אנא בדוק את המזהה ונסה שוב.
            </AlertDescription>
          </Alert>
        )}

        {/* Tree Card */}
        {!isLoading && treeData && <TreeCard data={treeData} />}

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
