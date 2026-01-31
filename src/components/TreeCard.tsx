import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { TreePine, MapPin, Info, Hash, Share2, ExternalLink, Camera, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeData, TreeMedia } from "@/types/tree";
import { recordUpload, requestUploadUrl, uploadFileToS3, uploadViaProxy } from "@/services/mediaService";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface TreeCardProps {
  data: TreeData;
  media?: TreeMedia[];
  mediaLoading?: boolean;
  onUploadComplete?: () => void;
}

export const TreeCard = ({ data, media = [], mediaLoading = false, onUploadComplete }: TreeCardProps) => {
  const municipalId = data.internalIds?.[0];
  const displayId = municipalId ?? data.id;
  const speciesCatalogUrl = data.speciesEnglish
    ? `https://www.treecatalog.org.il/tree/${encodeURIComponent(data.speciesEnglish.toLowerCase().replace(/ /g, "-"))}`
    : data.species
      ? `https://www.treecatalog.org.il/tree/${encodeURIComponent(data.species)}`
      : undefined;
  const shareUrl = typeof window !== "undefined" ? window.location.href : undefined;

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStage, setUploadStage] = useState<"idle" | "creating" | "uploading" | "saving">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isUploading = uploadStage !== "idle";
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const measurementCards = [
    { label: "קוטר הגזע", value: data.trunkDiameter, unit: "ס״מ" },
    { label: "גובה העץ", value: data.height, unit: "מ׳" },
    { label: "קוטר הצמרת", value: data.crownDiameter, unit: "מ׳" },
  ].filter((item) => item.value !== undefined && item.value !== null);

  const handleShare = async () => {
    const payload = {
      title: data.species ? `כרטיס עץ: ${data.species}` : "כרטיס עץ דיגיטלי",
      text: municipalId ? `מזהה רשות: ${municipalId}` : `מזעץ: ${data.id}`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard && payload.url) {
        await navigator.clipboard.writeText(payload.url);
        window?.alert?.("הקישור הועתק ללוח");
      }
    } catch (error) {
      console.error("Error sharing tree card:", error);
    }
  };

  const renderInfoRow = (label: string, value?: string, options?: { isLtr?: boolean }) => {
    if (!value) return null;
    return (
      <div className="flex items-center justify-between gap-3 text-base">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-medium text-foreground", options?.isLtr && "ltr text-left")}>
          {value}
        </span>
      </div>
    );
  };

  const ageDisplay = (() => {
    if (typeof data.age === "number") {
      return `${data.age}${data.ageEstimated ? " (משוער)" : ""}`;
    }
    if (data.ageEstimated) {
      return "משוער";
    }
    return "לא זמין";
  })();

  const formatMonthYear = (dateString?: string) => {
    if (!dateString) return "תאריך לא זמין";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return "תאריך לא זמין";
    return parsed.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  };

  const galleryItems = useMemo(() => {
    const getDate = (m: TreeMedia) =>
      m.createdAt ||
      (m as any).created_at ||
      m.updatedAt ||
      (m as any).updated_at ||
      undefined;

    const approvedMedia = (media ?? []).filter((m) => m.status === "approved");
    const official = data.photoUrl
      ? [
          {
            id: "official-photo",
            url: data.photoUrl,
            label: data.metaDate ? formatMonthYear(data.metaDate) : "תמונה רשמית",
            sortKey: Number.MAX_SAFE_INTEGER, // always first
          },
        ]
      : [];
    const community = approvedMedia
      .map((item) => ({
        id: item.id,
        url: item.publicUrl,
        label: formatMonthYear(getDate(item)),
        sortKey: new Date(getDate(item) ?? 0).getTime(),
      }))
      .sort((a, b) => b.sortKey - a.sortKey);
    return [...official, ...community];
  }, [data.photoUrl, data.metaDate, media]);

  const hasImages = galleryItems.length > 0;

  const resetDialogState = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadStage("idle");
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetDialogState();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("נא לבחור קובץ תמונה בלבד");
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadError(null);
    if (!selectedFile.type || !selectedFile.type.startsWith("image/")) {
      setUploadError("נדרשת תמונת JPEG/PNG/HEIC וכדומה");
      return;
    }

    try {
      setUploadStage("creating");
      try {
        const uploadSpec = await requestUploadUrl({
          treeId: data.id,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileSizeBytes: selectedFile.size,
        });

        setUploadStage("uploading");
        await uploadFileToS3(uploadSpec.uploadUrl, selectedFile, uploadSpec.headers);

        setUploadStage("saving");
        await recordUpload({
          treeId: data.id,
          s3Key: uploadSpec.s3Key,
          mimeType: selectedFile.type,
          fileSizeBytes: selectedFile.size,
          originalFileName: selectedFile.name,
        });
      } catch (directError) {
        console.warn("Direct upload failed, attempting proxy", directError);
        setUploadStage("saving");
        await uploadViaProxy({ treeId: data.id, file: selectedFile });
      }

      toast({
        title: "התמונה הועלתה בהצלחה",
        description: "תודה ששיתפת תמונה של העץ!",
      });
      handleDialogChange(false);
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload failed", error);
      setUploadError(error instanceof Error ? error.message : "העלאת התמונה נכשלה. נסו שוב מאוחר יותר.");
    } finally {
      setUploadStage("idle");
    }
  };

  const renderUploadButton = (variant: "ghost" | "outline" = "ghost", size: "sm" | "default" = "sm") => (
    <Button variant={variant} size={size} onClick={() => handleDialogChange(true)} disabled={isUploading} className="gap-2">
      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      {hasImages ? "הוספת תמונה נוספת" : "העלאת תמונה"}
    </Button>
  );

  return (
    <Card className="w-full border border-border/60 bg-card text-card-foreground shadow-sm" dir="rtl">
      <CardHeader className="border-b border-border/60 pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">מזעץ</p>
              <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
                <TreePine className="h-6 w-6 text-primary" />
                <span>מזעץ {municipalId || data.id}</span>
              </CardTitle>
              {data.id && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>מזהה יע״ד: {data.id}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-primary/50 bg-background px-3 py-1 text-xs font-semibold tracking-wide",
                  data.status === "identified" ? "text-primary" : "text-yellow-600",
                )}
              >
                {data.status === "identified" ? "עץ מזוהה" : "עץ חשוד"}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="שיתוף רשומה">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Primary Info Section */}
        <section className="space-y-4 rounded-2xl border border-border/60 bg-background/40 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">מין העץ</span>
              {speciesCatalogUrl && (
                <a
                  href={speciesCatalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline hover:text-primary/80"
                >
                  מידע על המין
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground">{data.species ?? "?"}</p>
            <div className="space-y-1 text-right">
              {data.speciesEnglish && (
                <p className="text-sm text-muted-foreground italic ltr">{data.speciesEnglish}</p>
              )}
              {data.genus && (
                <p className="text-xs text-muted-foreground ltr">Genus: {data.genus}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-card/70 p-3">
              <span className="text-xs text-muted-foreground">גיל</span>
              <p className="text-lg font-semibold text-foreground">{ageDisplay}</p>
            </div>
            {measurementCards.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/40 bg-card/70 p-3">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <p className="text-lg font-semibold text-foreground">
                  {item.value} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Spatial Info */}
        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MapPin className="h-4 w-4" />
            מידע מרחבי
          </div>
          <div className="space-y-3">
            {renderInfoRow("רשות מקומית", data.municipality)}
            {renderInfoRow("רחוב", data.street ?? data.fullAddress)}
            {renderInfoRow("גוש/חלקה", data.parcel, { isLtr: true })}
            {renderInfoRow("נ.צ", data.coordinates, { isLtr: true })}
          </div>
        </section>

        {/* Photo Section */}
        <section className="rounded-2xl border border-border/60 bg-card/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-sm font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              תמונות
            </div>
            {hasImages ? renderUploadButton("ghost", "sm") : <span className="text-xs text-muted-foreground">אין תמונות עדיין</span>}
          </div>
          <div className="p-4">
            {mediaLoading ? (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
                טוען תמונות...
              </div>
            ) : hasImages ? (
              <Carousel className="w-full" dir="ltr">
                <CarouselContent className="w-full">
                  {galleryItems.map((item) => (
                    <CarouselItem key={item.id} className="w-full">
                      <div className="space-y-2">
                        <img
                          src={item.url}
                          alt="תמונת עץ"
                          className="w-full max-h-80 rounded-xl border border-border/60 object-cover"
                          loading="lazy"
                        />
                        <p className="text-center text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-background/40 p-6 text-center text-sm text-muted-foreground">
                <Camera className="h-6 w-6" />
                <p>עדיין לא נוספה תמונה לעץ הזה.</p>
                {renderUploadButton("outline", "default")}
              </div>
            )}
          </div>
        </section>

        {/* Data Sources */}
        {data.dataSources && data.dataSources.length > 0 && (
          <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Info className="h-4 w-4" />
              מקורות המידע
            </div>
            <div className="space-y-2">
              {data.dataSources.map((source, idx) => (
                <div key={`${source.name}-${source.date}-${idx}`} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{source.name}</span>
                  <span className="text-foreground">{source.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Details */}
        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Info className="h-4 w-4" />
            מידע נוסף
          </div>
          <div className="space-y-3">
            {data.internalIds && data.internalIds.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">מזהים פנימיים</span>
                <div className="flex flex-wrap gap-2">
                  {data.internalIds.map((id, idx) => (
                    <Badge key={`${id}-${idx}`} variant="outline" className="text-xs">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {renderInfoRow("מרחב העץ", data.treeSpace)}
            {renderInfoRow("מספר גזעים", data.numTrunks?.toString())}
            {renderInfoRow("ציון בריאות", data.healthScore?.toString())}
            {renderInfoRow("מצב העץ", data.goodStatus)}
          </div>
        </section>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>העלאת תמונה חדשה</DialogTitle>
            <Link to="/usage-policy" className="text-xs text-primary hover:underline w-fit">
              תנאי שימוש
            </Link>
            <DialogDescription>בחרו תמונה בגודל עד 50MB ושתפו את הקהילה.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className="w-1/2"
              >
                צילום במצלמה
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploading}
                className="w-1/2"
              >
                העלאה מהגלריה
              </Button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <p className="mt-2 text-xs text-muted-foreground">קבצים נתמכים: JPG, PNG, HEIC, WEBP (עד 50MB)</p>
            {selectedFile && <p className="mt-1 text-sm font-medium text-foreground">{selectedFile.name}</p>}
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => handleDialogChange(false)} disabled={isUploading}>
              ביטול
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              העלאת תמונה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
