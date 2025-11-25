import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TreePine, Ruler, Calendar, MapPin, Info, Hash } from "lucide-react";

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
  // const googleMapsKey = "AIzaSyAW0_GwE7WPDox5RZnUMkESHGiSe5siWdQ"; // TODO: Configure API key restrictions
  
  return (
    <Card className="w-full shadow-lg border-primary/20" dir="rtl">
      <CardHeader className="bg-accent pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2 text-accent-foreground">
            <TreePine className="h-6 w-6 text-primary" />
            <span>מזעץ: {data.id}</span>
          </CardTitle>
          <Badge 
            variant={data.status === "identified" ? "default" : "secondary"}
            className="bg-primary text-primary-foreground"
          >
            {data.status === "identified" ? "עץ מזוהה" : "חשד לעץ"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Main Info Section */}
        <div className="space-y-3">
          {data.species && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">מין</span>
                <span className="text-base font-medium text-foreground">{data.species}</span>
              </div>
              {data.speciesEnglish && (
                <div className="flex justify-end">
                  <span className="text-sm text-muted-foreground italic ltr">{data.speciesEnglish}</span>
                </div>
              )}
              {data.genus && (
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground ltr">Genus: {data.genus}</span>
                </div>
              )}
            </div>
          )}
          
          {data.coordinates && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">נ.צ</span>
              <span className="text-base font-medium text-foreground ltr">{data.coordinates}</span>
            </div>
          )}
          
          {data.municipality && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">רשות מקומית</span>
              <span className="text-base font-medium text-foreground">{data.municipality}</span>
            </div>
          )}
          
          {data.fullAddress && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">כתובת</span>
              <span className="text-base font-medium text-foreground">{data.fullAddress}</span>
            </div>
          )}
          
          {data.street && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">רחוב</span>
              <span className="text-base font-medium text-foreground">{data.street}</span>
            </div>
          )}
          
          {data.parcel && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">גוש/חלקה</span>
              <span className="text-base font-medium text-foreground ltr">{data.parcel}</span>
            </div>
          )}
        </div>

        {/* Data Sources Section */}
        {data.dataSources && data.dataSources.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">רשימת מקורות המידע</h3>
              {data.dataSources.map((source, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{source.name}</span>
                  <span className="text-sm text-foreground">{source.date}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Map/Street View Section - TODO: Fix API key restrictions */}
        {/* {data.id && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">מיקום במפה (לחץ על הבובה לתצוגת רחוב)</h3>
              <iframe
                width="100%"
                height="340"
                loading="lazy"
                allowFullScreen
                style={{ border: 0, borderRadius: '0.5rem' }}
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(data.id)}&key=${googleMapsKey}&zoom=18&maptype=satellite`}
              />
            </div>
          </>
        )} */}

        {/* Tree Photo */}
        {data.photoUrl && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">תמונות כלליות</h3>
              <img 
                src={data.photoUrl} 
                alt="תמונת העץ"
                className="w-full rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          </>
        )}

        {/* Extra Info Section */}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">מידע נוסף</h3>
          
          {data.internalIds && data.internalIds.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">מזהה פנימי</span>
              <div className="flex flex-wrap gap-2">
                {data.internalIds.map((id, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {id}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {data.treeSpace && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">מרחב העץ</span>
              <span className="text-sm text-foreground">{data.treeSpace}</span>
            </div>
          )}
          
          {data.numTrunks && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">מספר גזעים</span>
              <span className="text-sm text-foreground">{data.numTrunks}</span>
            </div>
          )}
          
          {data.healthScore !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ציון בריאות</span>
              <span className="text-sm text-foreground">{data.healthScore}</span>
            </div>
          )}
          
          {data.goodStatus && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">מצב העץ</span>
              <span className="text-sm text-foreground">{data.goodStatus}</span>
            </div>
          )}
          
          {data.ageEstimated !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">גיל משוער?</span>
              <span className="text-sm text-foreground">{data.ageEstimated ? 'כן' : 'לא'}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {data.trunkDiameter !== undefined && (
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
                <span className="text-xs text-muted-foreground">קוטר הגזע</span>
                <span className="text-base font-semibold text-foreground">{data.trunkDiameter} ס״מ</span>
              </div>
            )}

            {data.height !== undefined && (
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
                <span className="text-xs text-muted-foreground">גובה העץ</span>
                <span className="text-base font-semibold text-foreground">{data.height} מ׳</span>
              </div>
            )}

            {data.crownDiameter !== undefined && (
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
                <span className="text-xs text-muted-foreground">קוטר הצמרת</span>
                <span className="text-base font-semibold text-foreground">{data.crownDiameter} מ׳</span>
              </div>
            )}

            {data.canopyArea !== undefined && (
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
                <span className="text-xs text-muted-foreground">שטח הצמרת</span>
                <span className="text-base font-semibold text-foreground">{data.canopyArea} מ״ר</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
