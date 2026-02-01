import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { TreeCard } from "@/components/TreeCard";
import { TreeIdInput } from "@/components/TreeIdInput";
import { MunicipalitySelector } from "@/components/MunicipalitySelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2, AlertCircle, HelpCircle } from "lucide-react";
import { fetchTreeData, transformTreeData, groupByTreeId } from "@/services/treeApi";
import { fetchTreeMedia } from "@/services/mediaService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Index = () => {
  const location = useLocation();
  const state = location.state as { initialSearchValue?: string; initialSearchType?: "tree-id" | "internal-id" } | null;
  const getUrlTreeId = (search: string) => {
    const params = new URLSearchParams(search);
    return params.get("treeId") ?? params.get("id") ?? "";
  };
  const initialUrlTreeId = getUrlTreeId(location.search);

  const [searchValue, setSearchValue] = useState(initialUrlTreeId || state?.initialSearchValue || "8G4P4VXP+GR5V");
  const [searchType, setSearchType] = useState<"tree-id" | "internal-id">(
    initialUrlTreeId ? "tree-id" : state?.initialSearchType || "tree-id",
  );
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [finalTreeId, setFinalTreeId] = useState<string | null>(null);

  useEffect(() => {
    const urlTreeId = getUrlTreeId(location.search);
    if (!urlTreeId) return;
    if (urlTreeId === searchValue && searchType === "tree-id") return;
    setSearchValue(urlTreeId);
    setSearchType("tree-id");
    setSelectedTreeId(null);
    setFinalTreeId(null);
  }, [location.search]);

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

  // Fetch community media from Supabase for the selected tree
  const {
    data: treeMedia,
    isLoading: isLoadingMedia,
    refetch: refetchMedia,
  } = useQuery({
    queryKey: ["tree-media", treeData?.id],
    queryFn: () => fetchTreeMedia(treeData!.id),
    enabled: !!treeData?.id,
    retry: 1,
  });

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
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-md">
        {/* Search Section */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/60">
          <h2 className="text-lg font-semibold mb-4 text-foreground text-right">חיפוש עץ</h2>
          <TreeIdInput onSearch={handleSearch} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/60 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span>טוען נתוני עץ...</span>
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
        {!isLoading && !error && !showMultipleOptions && !treeData && searchValue && (
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/60 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">העץ לא נמצא?</h3>
              <p className="text-sm text-muted-foreground">
                לא מצאנו עץ עם המזהה "{searchValue}"
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              className="w-full gap-2"
              data-analytics-label="tree_add_placeholder"
              data-analytics-event="tree_add_placeholder_click"
            >
              להוספת העץ?
              <span className="text-xs">(בקרוב)</span>
            </Button>
          </div>
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
        {!isLoading && treeData && (
          <TreeCard
            data={treeData}
            media={treeMedia ?? []}
            mediaLoading={isLoadingMedia}
            onUploadComplete={() => void refetchMedia()}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
