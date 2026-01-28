import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { listReviewMedia, updateReviewMediaStatus } from "@/services/reviewService";
import { fetchTreeDataByTreeIds, groupByTreeId } from "@/services/treeApi";
import type { TreeMediaStatus } from "@/types/tree";
import { AlertCircle, Loader2 } from "lucide-react";

const STATUS_OPTIONS: Array<{ value: TreeMediaStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "flagged", label: "Flagged" },
  { value: "skipped", label: "Skipped" },
  { value: "deleted", label: "Deleted" },
  { value: "test", label: "Test" },
];

const PAGE_SIZE = 50;

const ReviewDashboard = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<TreeMediaStatus>("pending");
  const [municipalityFilter, setMunicipalityFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    data: reviewData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["review-media", statusFilter, offset],
    queryFn: () =>
      listReviewMedia({
        status: statusFilter,
        limit: PAGE_SIZE,
        offset,
      }),
    keepPreviousData: true,
  });

  const treeIds = useMemo(
    () => Array.from(new Set((reviewData?.items ?? []).map((item) => item.treeId))),
    [reviewData?.items],
  );

  const { data: municipalityMap = {} } = useQuery({
    queryKey: ["review-municipalities", treeIds.join("|")],
    queryFn: async () => {
      if (treeIds.length === 0) return {};
      const rows = await fetchTreeDataByTreeIds(treeIds);
      const grouped = groupByTreeId(rows);
      return grouped.reduce<Record<string, string>>((acc, entry) => {
        acc[entry.treeId] = entry.municipality;
        return acc;
      }, {});
    },
    enabled: treeIds.length > 0,
  });

  const filteredItems = useMemo(() => {
    const items = reviewData?.items ?? [];
    const municipalityQuery = municipalityFilter.trim().toLocaleLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

    return items.filter((item) => {
      const municipality = municipalityMap[item.treeId] ?? "לא ידוע";
      if (municipalityQuery && !municipality.toLocaleLowerCase().includes(municipalityQuery)) {
        return false;
      }

      if (!fromDate && !toDate) {
        return true;
      }

      const createdAt = new Date(item.createdAt);
      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;
      return true;
    });
  }, [reviewData?.items, municipalityFilter, dateFrom, dateTo, municipalityMap]);

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TreeMediaStatus }) =>
      updateReviewMediaStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-media"] });
      toast({ title: "Status updated" });
    },
    onError: (mutationError: unknown) => {
      toast({
        title: "Failed to update status",
        description: mutationError instanceof Error ? mutationError.message : "Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const totalCount = reviewData?.count ?? 0;
  const hasNext = offset + PAGE_SIZE < totalCount;
  const hasPrev = offset > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Review Uploaded Images</h1>
          <div className="grid gap-4 md:grid-cols-[240px_1fr_1fr_auto]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as TreeMediaStatus);
                  setOffset(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Municipality</label>
              <Input
                placeholder="Filter by municipality"
                value={municipalityFilter}
                onChange={(event) => setMunicipalityFilter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date range</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["review-media"] })}
                disabled={isFetching}
              >
                {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Refresh
              </Button>
            </div>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load media</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : "Please try again later."}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] sm:w-[220px]">Image</TableHead>
                  <TableHead className="hidden sm:table-cell">Municipality</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-[160px]">Status</TableHead>
                  <TableHead className="sm:hidden">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading uploads...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No uploads found for this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-24 w-36 overflow-hidden rounded-md border bg-muted sm:h-28 sm:w-44">
                          <img
                            src={item.publicUrl}
                            alt={`tree-media-${item.id}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {municipalityMap[item.treeId] ?? "לא ידוע"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("he-IL")}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) => {
                            setUpdatingId(item.id);
                            updateMutation.mutate({ id: item.id, status: value as TreeMediaStatus });
                          }}
                          disabled={updatingId === item.id}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="sm:hidden">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>{municipalityMap[item.treeId] ?? "לא ידוע"}</div>
                          <div>{new Date(item.createdAt).toLocaleDateString("he-IL")}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredItems.length} of {totalCount} uploads
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setOffset(0)} disabled={!hasPrev}>
                First
              </Button>
              <Button
                variant="outline"
                onClick={() => setOffset((prev) => Math.max(prev - PAGE_SIZE, 0))}
                disabled={!hasPrev}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
                disabled={!hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewDashboard;
