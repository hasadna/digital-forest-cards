import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TreePine, MapPin, Info, Hash, Share2, ExternalLink, Camera, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataSource {
  name: string;
  date: string;
}

interface TreeData {
  id: string;
  species?: string;
  speciesEnglish?: string;
  genus?: string;
  trunkDiameter?: number;
  height?: number;
  canopyArea?: number;
  crownDiameter?: number;
  numTrunks?: number;
  healthScore?: number;
  goodStatus?: string;
  age?: number;
  ageEstimated?: boolean;
  location?: string;
  municipality?: string;
  street?: string;
  fullAddress?: string;
  parcel?: string;
  coordinates?: string;
  treeSpace?: string;
  collectionType?: string;
  sourceType?: string;
  environment?: string;
  internalIds?: string[];
  photoUrl?: string;
  dataSources?: DataSource[];
  status: "identified" | "suspected";
}

interface TreeCardProps {
  data: TreeData;
}

export const TreeCard = ({ data }: TreeCardProps) => {
  const municipalId = data.internalIds?.[0];
  const displayId = municipalId ?? data.id;
  const speciesCatalogUrl = data.species
    ? `https://catalog.hasadna.org.il/trees?query=${encodeURIComponent(data.species)}`
    : undefined;
  const shareUrl = typeof window !== "undefined" ? window.location.href : undefined;

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

  return (
    <Card className="w-full border border-border/60 bg-card text-card-foreground shadow-2xl" dir="rtl">
      <CardHeader className="border-b border-border/60 bg-primary/10 pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">מזעץ</p>
              <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
                <TreePine className="h-6 w-6 text-primary" />
                <span>{displayId}</span>
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
                  "border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide",
                  data.status === "identified" ? "text-primary-foreground" : "text-secondary-foreground",
                )}
              >
                {data.status === "identified" ? "עץ מזוהה" : "חשד לעץ"}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="שיתוף רשומה">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {municipalId && (
            <p className="text-sm text-muted-foreground">
              מזהה רשות: <span className="font-medium text-foreground">{municipalId}</span>
            </p>
          )}
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
                  className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80"
                >
                  מידע על המין
                  <ExternalLink className="h-4 w-4" />
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

          <div className="grid gap-3 md:grid-cols-3">
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
            {measurementCards.length === 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/70 p-3 text-sm text-muted-foreground">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                ללא נתוני מדידה רשמיים
              </div>
            )}
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
            {!data.photoUrl && <span className="text-xs text-muted-foreground">אין תמונה רשמית עדיין</span>}
          </div>
          <div className="p-4">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="תמונת העץ"
                className="w-full rounded-xl border border-border/60 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-background/40 p-6 text-center text-sm text-muted-foreground">
                <Camera className="h-6 w-6" />
                <p>עדיין לא נוספה תמונה לעץ הזה.</p>
                <Button variant="outline" disabled className="opacity-60">
                  הוספת תמונה (בקרוב)
                </Button>
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

        <Separator />

        {/* Disclaimer */}
        <section className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            האתר מציג מידע ציבורי פתוח כפי שנאסף על-ידי הסדנא לידע ציבורי בפרויקטים יער עירוני דיגיטלי וקטלוג עצי רחוב וצל.
            ייתכנו הבדלים בין הנתונים לבין מצב העץ בשטח בשל שגיאות איסוף, עיבוד או שינויים פיזיים.
          </p>
          <p>
            גרסת פיילוט. נשמח להערות ורעיונות לשיפור בכתובת{" "}
            <a href="mailto:info@hasadna.org.il" className="text-accent hover:underline">
              info@hasadna.org.il
            </a>
            .
          </p>
        </section>
      </CardContent>
    </Card>
  );
};
