import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTenant } from "../hooks/useTenant";
import { getDashboardDataForTenant } from "../data/tenantData";

export function KPIPanel() {
  const { currentTenant } = useTenant();
  const dashboardData = getDashboardDataForTenant(currentTenant?.id || 'tenant-001');
  const productionData = dashboardData.production;

  const productionProgress = (productionData.totalMinutes / productionData.targetMinutes) * 100;

  const efficiencyData = [
    { name: 'Efficiency', value: productionData.overallEfficiency },
    { name: 'Remaining', value: 100 - productionData.overallEfficiency }
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return '#22c55e'; // Bright but gentle success green
    if (efficiency >= 75) return '#f59e0b'; // Warm warning amber
    return '#ef4444'; // Alert but not panic red
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-slate-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            Today's Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-semibold text-foreground">
            {productionData.totalMinutes.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            of {productionData.targetMinutes.toLocaleString()} minutes target
          </div>
          <Progress value={productionProgress} className="h-3 bg-muted/30" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {productionProgress.toFixed(1)}% complete
            </span>
            <Badge variant={productionProgress >= 80 ? "default" : "secondary"} className="text-xs">
              {productionProgress >= 80 ? "On track" : "Behind"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-emerald-50/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/60"></div>
            Overall Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-2xl font-semibold" style={{ color: getEfficiencyColor(productionData.overallEfficiency) }}>
                {productionData.overallEfficiency}%
              </div>
              <Badge
                variant={productionData.overallEfficiency >= 90 ? "default" : productionData.overallEfficiency >= 75 ? "secondary" : "destructive"}
                className="rounded-full text-xs px-3 py-1"
              >
                {productionData.overallEfficiency >= 90 ? "✨ Excellent" : productionData.overallEfficiency >= 75 ? "👍 Good" : "⚠️ Needs Attention"}
              </Badge>
            </div>
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={32}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    <Cell fill={getEfficiencyColor(productionData.overallEfficiency)} />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-blue-50/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500/60 animate-pulse"></div>
            Active Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-semibold text-blue-600">
            {productionData.activeModules}
          </div>
          <div className="text-sm text-muted-foreground">
            modules running smoothly
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            All systems operational
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-purple-50/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500/60"></div>
            Active References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-semibold text-purple-600">
            {productionData.referencesInProgress}
          </div>
          <div className="text-sm text-muted-foreground">
            jobs in progress
          </div>
          <div className="text-xs text-muted-foreground">
            3 completing today
          </div>
        </CardContent>
      </Card>
    </div>
  );
}