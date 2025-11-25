import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TreeCard } from "@/components/TreeCard";
import { TreeIdInput } from "@/components/TreeIdInput";
import { MunicipalitySelector } from "@/components/MunicipalitySelector";
import { TreePine, Loader2, AlertCircle } from "lucide-react";
import { fetchTreeData, transformTreeData, groupByTreeId } from "@/services/treeApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [searchValue, setSearchValue] = useState("8G4P4VXP+GR5V");
  const [searchType, setSearchType] = useState<"tree-id" | "internal-id">("tree-id");
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [finalTreeId, setFinalTreeId] = useState<string | null>(null);

  // First query: Fetch initial search results (by tree-id or internal-id)
  const { data: initialData, isLoading: isLoadingInitial, error: errorInitial } = useQuery({
    queryKey: ["tree-search", searchValue, searchType],
    queryFn: () => fetchTreeData(searchValue, searchType),
    enabled: !!searchValue,
    retry: 1,
  });

  // Group results by tree ID (for internal ID searches that return multiple municipalities)
  const groupedResults = initialData ? groupByTreeId(initialData) : [];
  
  // Determine if we need to show municipality selector
  const showMultipleOptions = searchType === "internal-id" && groupedResults.length > 1 && !selectedTreeId;

  // When search type is tree-id, or when we have a single result from internal-id search,
  // or when user has selected a municipality, set the final tree ID
  useEffect(() => {
    if (searchType === "tree-id" && initialData && initialData.length > 0) {
      // Direct tree-id search
      setFinalTreeId(searchValue);
    } else if (searchType === "internal-id" && selectedTreeId) {
      // User selected from multiple municipalities
      setFinalTreeId(selectedTreeId);
    } else if (searchType === "internal-id" && groupedResults.length === 1) {
      // Single municipality result from internal-id search
      setFinalTreeId(groupedResults[0].treeId);
    } else if (showMultipleOptions) {
      // Waiting for user to select municipality
      setFinalTreeId(null);
    }
  }, [searchType, searchValue, selectedTreeId, initialData, groupedResults.length, showMultipleOptions]);

  // Second query: Fetch all data sources for the final tree ID (by plus code)
  const { data: finalData, isLoading: isLoadingFinal } = useQuery({
    queryKey: ["tree-final", finalTreeId],
    queryFn: () => fetchTreeData(finalTreeId!, "tree-id"),
    enabled: !!finalTreeId,
    retry: 1,
  });

  // Transform API data to component format
  const treeData = finalData ? transformTreeData(finalData) : null;
  
  // Loading state: show loading if either query is loading
  const isLoading = isLoadingInitial || (!!finalTreeId && isLoadingFinal);
  const error = errorInitial;

  const handleSearch = (newSearchValue: string, newSearchType: "tree-id" | "internal-id") => {
    setSearchValue(newSearchValue);
    setSearchType(newSearchType);
    setSelectedTreeId(null); // Reset selection when doing a new search
    setFinalTreeId(null); // Reset final tree ID
  };

  const handleMunicipalitySelect = (treeId: string) => {
    setSelectedTreeId(treeId);
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
        {!isLoading && !error && !showMultipleOptions && !treeData && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">לא נמצאו תוצאות</AlertTitle>
            <AlertDescription className="text-right">
              לא נמצא עץ עם המזהה {searchValue}. אנא בדוק את המזהה ונסה שוב.
            </AlertDescription>
          </Alert>
        )}

        {/* Municipality Selector (when multiple results from different municipalities) */}
        {!isLoading && showMultipleOptions && (
          <MunicipalitySelector
            options={groupedResults.map((g) => ({
              treeId: g.treeId,
              municipality: g.municipality,
            }))}
            onSelect={handleMunicipalitySelect}
          />
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
