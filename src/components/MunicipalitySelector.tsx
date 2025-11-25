import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface MunicipalityOption {
  treeId: string;
  municipality: string;
}

interface MunicipalitySelectorProps {
  options: MunicipalityOption[];
  onSelect: (treeId: string) => void;
}

export const MunicipalitySelector = ({ options, onSelect }: MunicipalitySelectorProps) => {
  return (
    <Card className="w-full shadow-lg border-primary/20" dir="rtl">
      <CardHeader className="bg-accent pb-4">
        <CardTitle className="text-xl text-accent-foreground text-right">
          נמצאו {options.length} עצים במספר רשויות
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-4 text-right">
          בחר את הרשות המקומית שבה נמצא העץ:
        </p>
        <div className="space-y-3">
          {options.map((option) => (
            <Button
              key={option.treeId}
              onClick={() => onSelect(option.treeId)}
              variant="outline"
              className="w-full justify-between text-right h-auto py-4"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{option.municipality}</span>
              </div>
              <span className="text-xs text-muted-foreground">{option.treeId}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

