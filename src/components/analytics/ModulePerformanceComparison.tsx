import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Filter, BarChart3 } from "lucide-react";
import { useTenant } from "../../hooks/useTenant";
import { getModulesForTenant } from "../../data/tenantData";

interface ModuleData {
  id: string;
  name: string;
  color: string;
}

interface PerformanceDataPoint {
  date: string;
  [key: string]: string | number; // Module IDs as keys with efficiency values;
}

const timePeriods = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "This Quarter" },
  { value: "custom", label: "Custom Range" }
];

// Mock performance data - now uses tenant-specific modules
const generatePerformanceData = (period: string, modules: ModuleData[]): PerformanceDataPoint[] => {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const data: PerformanceDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dataPoint: PerformanceDataPoint = {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };

    // Generate realistic efficiency data for each module
    modules.forEach(module => {
      const baseEfficiency = 75 + Math.random() * 20; // 75-95% base range
      const dailyVariation = (Math.random() - 0.5) * 10; // ±5% daily variation
      const trendFactor = i * 0.1; // Slight upward trend over time

      dataPoint[module.id] = Math.max(60, Math.min(100,
        Math.round((baseEfficiency + dailyVariation + trendFactor) * 100) / 100
      ));
    });

    data.push(dataPoint);
  }

  return data;
};

export function ModulePerformanceComparison() {
  const { currentTenant } = useTenant();

  // Get tenant-specific modules and map them to include colors
  const tenantModules = useMemo(() => {
    const modules = getModulesForTenant(currentTenant?.id || 'tenant-001');
    const colors = ["#0d9488", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

    return modules.map((module, index) => ({
      id: module.id,
      name: module.name,
      color: colors[index % colors.length]
    }));
  }, [currentTenant?.id]);

  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);

  // Update selected modules and performance data when tenant changes
  useEffect(() => {
    if (tenantModules.length > 0) {
      const initialModules = tenantModules.slice(0, Math.min(3, tenantModules.length)).map(m => m.id);
      setSelectedModules(initialModules);
      setPerformanceData(generatePerformanceData(selectedPeriod, tenantModules));
    }
  }, [tenantModules, selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setPerformanceData(generatePerformanceData(period, tenantModules));
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getModuleColor = (moduleId: string) => {
    return tenantModules.find(m => m.id === moduleId)?.color || "#64748b";
  };

  const getModuleName = (moduleId: string) => {
    return tenantModules.find(m => m.id === moduleId)?.name || moduleId;
  };

  const calculateAverageEfficiency = (moduleId: string) => {
    const values = performanceData.map(d => d[moduleId] as number).filter(v => v);
    return values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-soft-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{getModuleName(entry.dataKey)}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-blue-50/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              Module Performance Comparison
            </CardTitle>
            <CardDescription className="mt-1">
              Compare efficiency trends across production modules over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {selectedModules.length} modules selected
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Modules:</span>
          </div>
        </div>

        {/* Module Selector */}
        <div className="flex flex-wrap gap-2">
          {tenantModules.map((module) => (
            <Button
              key={module.id}
              variant={selectedModules.includes(module.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleModule(module.id)}
              className="gap-2"
              style={{
                backgroundColor: selectedModules.includes(module.id) ? module.color : undefined,
                borderColor: module.color,
                color: selectedModules.includes(module.id) ? "white" : module.color
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: module.color }}
              />
              {module.name}
            </Button>
          ))}
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedModules.map((moduleId) => {
            const avgEfficiency = calculateAverageEfficiency(moduleId);
            const module = tenantModules.find(m => m.id === moduleId);
            return (
              <div
                key={moduleId}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: module?.color }}
                  />
                  <span className="text-sm font-medium">{module?.name}</span>
                </div>
                <div className="text-xl font-semibold" style={{ color: module?.color }}>
                  {avgEfficiency}%
                </div>
                <div className="text-xs text-muted-foreground">Average efficiency</div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                domain={[60, 100]}
                tickFormatter={(value) => `${value}% `}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedModules.map((moduleId) => (
                <Line
                  key={moduleId}
                  type="monotone"
                  dataKey={moduleId}
                  stroke={getModuleColor(moduleId)}
                  strokeWidth={2}
                  dot={{ fill: getModuleColor(moduleId), strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: getModuleColor(moduleId), strokeWidth: 2 }}
                  name={getModuleName(moduleId)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}