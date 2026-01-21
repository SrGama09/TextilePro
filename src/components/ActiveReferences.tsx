import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useTenant } from "../hooks/useTenant";
import { getDashboardDataForTenant } from "../data/tenantData";

export function ActiveReferences() {
  const { currentTenant } = useTenant();
  const dashboardData = getDashboardDataForTenant(currentTenant?.id || 'tenant-001');
  const references = dashboardData.activeReferences;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active References Progress</CardTitle>
        <div className="text-sm text-muted-foreground">
          Production progress for key active references
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {references.map((ref) => (
            <div key={ref.code} className="p-3 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{ref.code}</span>
                    <Badge variant={getPriorityColor(ref.priority)} className="text-xs">
                      {ref.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{ref.name}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getProgressColor(ref.progress)}`}>
                    {ref.progress}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ref.remainingMinutes} min left
                  </div>
                </div>
              </div>

              <Progress value={ref.progress} className="h-2" />

              <div className="text-xs text-muted-foreground">
                {ref.totalMinutes - ref.remainingMinutes} / {ref.totalMinutes} minutes completed
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}