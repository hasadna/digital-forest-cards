import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TreePine, Ruler, Calendar, MapPin, Info } from "lucide-react";

interface TreeData {
  id: string;
  species?: string;
  trunkDiameter?: number;
  height?: number;
  canopyArea?: number;
  age?: number;
  location?: string;
  environment?: string;
  status: "identified" | "suspected";
}

interface TreeCardProps {
  data: TreeData;
}

export const TreeCard = ({ data }: TreeCardProps) => {
  return (
    <Card className="w-full shadow-lg border-primary/20" dir="rtl">
      <CardHeader className="bg-accent pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2 text-accent-foreground">
            <TreePine className="h-6 w-6 text-primary" />
            <span>פרטי העץ</span>
          </CardTitle>
          <Badge 
            variant={data.status === "identified" ? "default" : "secondary"}
            className="bg-primary text-primary-foreground"
          >
            {data.status === "identified" ? "עץ מזוהה" : "חשד לעץ"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          מזהה: {data.id}
        </p>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {data.species && (
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">מין העץ</p>
              <p className="text-lg font-semibold text-foreground">{data.species}</p>
            </div>
          </div>
        )}

        {data.location && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">מיקום</p>
                <p className="text-base text-foreground">{data.location}</p>
              </div>
            </div>
          </>
        )}

        {data.environment && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">סביבה</p>
                <p className="text-base text-foreground">{data.environment}</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {data.trunkDiameter !== undefined && (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-accent">
              <div className="flex items-center gap-2 text-accent-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">קוטר גזע</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.trunkDiameter} ס״מ</p>
            </div>
          )}

          {data.height !== undefined && (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-accent">
              <div className="flex items-center gap-2 text-accent-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">גובה</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.height} מ׳</p>
            </div>
          )}

          {data.canopyArea !== undefined && (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-accent">
              <div className="flex items-center gap-2 text-accent-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">שטח חופה</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.canopyArea} מ״ר</p>
            </div>
          )}

          {data.age !== undefined && (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-accent">
              <div className="flex items-center gap-2 text-accent-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">גיל משוער</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.age} שנים</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
