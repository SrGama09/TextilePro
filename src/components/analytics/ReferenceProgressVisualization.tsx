import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Target,
  Search,
  Clock,
  Package,
  CheckCircle,
  Calendar,
  Users,
  Activity,
  AlertCircle,
  Play,
  Factory
} from "lucide-react";
import { useTenant } from "../../hooks/useTenant";
import { getReferencesForTenant } from "../../data/tenantData";

interface ReferenceData {
  id: string;
  name: string;
  code: string;
  color: string;
  totalMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  startDate: string;
  status: "pending" | "in_progress" | "completed";
  description: string;
}

interface ProductionLogEntry {
  id: string;
  date: string;
  time: string;
  minutesLogged: number;
  module: string;
  operator: string;
  shift: string;
}

interface SizeBreakdown {
  size: string;
  quantity: number;
  completed: number;
  remaining: number;
}

// Mock production history data
const generateProductionHistory = (referenceCode: string): ProductionLogEntry[] => {
  const entries: ProductionLogEntry[] = [
    {
      id: "1",
      date: "2025-09-16",
      time: "14:30",
      minutesLogged: 45,
      module: "Assembly Line A",
      operator: "Maria Garcia",
      shift: "Afternoon"
    },
    {
      id: "2",
      date: "2025-09-16",
      time: "10:15",
      minutesLogged: 52,
      module: "Assembly Line A",
      operator: "John Smith",
      shift: "Morning"
    },
    {
      id: "3",
      date: "2025-09-15",
      time: "16:45",
      minutesLogged: 38,
      module: "Cutting Department",
      operator: "David Martinez",
      shift: "Afternoon"
    },
    {
      id: "4",
      date: "2025-09-15",
      time: "11:20",
      minutesLogged: 55,
      module: "Assembly Line B",
      operator: "Ana Rodriguez",
      shift: "Morning"
    },
    {
      id: "5",
      date: "2025-09-14",
      time: "15:10",
      minutesLogged: 48,
      module: "Quality Control",
      operator: "Lisa Chen",
      shift: "Afternoon"
    }
  ];
  return entries;
};

// Mock size breakdown data
const generateSizeBreakdown = (referenceCode: string): SizeBreakdown[] => {
  const breakdowns: SizeBreakdown[] = [
    { size: "XS", quantity: 50, completed: 50, remaining: 0 },
    { size: "S", quantity: 120, completed: 95, remaining: 25 },
    { size: "M", quantity: 200, completed: 140, remaining: 60 },
    { size: "L", quantity: 150, completed: 110, remaining: 40 },
    { size: "XL", quantity: 80, completed: 60, remaining: 20 },
    { size: "XXL", quantity: 30, completed: 20, remaining: 10 }
  ];
  return breakdowns;
};

export function ReferenceProgressVisualization() {
  const { currentTenant } = useTenant();

  // Get tenant-specific references and map them to include needed data
  const tenantReferences = useMemo(() => {
    const references = getReferencesForTenant(currentTenant?.id || 'tenant-001');
    const colors = ["#0d9488", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

    return references.map((ref, index) => ({
      id: ref.id,
      name: ref.description || ref.code,
      code: ref.code,
      color: colors[index % colors.length],
      totalMinutes: ref.totalMinutes,
      completedMinutes: Math.floor(ref.totalMinutes * ref.progress / 100),
      remainingMinutes: ref.remainingMinutes,
      startDate: ref.createdDate,
      status: ref.status === 'En proceso' ? 'in_progress' as const :
        ref.status === 'Finalizado' ? 'completed' as const : 'pending' as const,
      description: ref.description || `Production reference ${ref.code}`
    }));
  }, [currentTenant?.id]);

  const [selectedReference, setSelectedReference] = useState<string>("");

  // Update selected reference when tenant references change
  // Always ensure a valid reference is selected
  useEffect(() => {
    if (tenantReferences.length > 0) {
      // Check if current selected reference exists in the new tenant's references
      const currentExists = tenantReferences.some(ref => ref.code === selectedReference);

      // If no reference selected or current doesn't exist, select the first one
      if (!selectedReference || !currentExists) {
        setSelectedReference(tenantReferences[0].code);
      }
    }
  }, [tenantReferences]);

  const currentReference = tenantReferences.find(r => r.code === selectedReference);
  const productionHistory = generateProductionHistory(selectedReference);
  const sizeBreakdown = generateSizeBreakdown(selectedReference);

  const getCompletionPercentage = () => {
    if (!currentReference) return 0;
    return Math.round((currentReference.completedMinutes / currentReference.totalMinutes) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "in_progress":
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600 bg-emerald-50";
      case "in_progress":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const completionData = [
    { name: 'Completed', value: currentReference?.completedMinutes || 0, color: '#0d9488' },
    { name: 'Remaining', value: currentReference?.remainingMinutes || 0, color: '#e5e7eb' }
  ];

  if (!currentReference) {
    return (
      <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-purple-50/20">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a reference to view detailed information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-purple-50/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              Reference Deep Dive
            </CardTitle>
            <CardDescription className="mt-1">
              Comprehensive status and progress details for production reference
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Reference Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Select Reference:</span>
          </div>
          <Select value={selectedReference} onValueChange={setSelectedReference}>
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tenantReferences.map((reference) => (
                <SelectItem key={reference.id} value={reference.code}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: reference.color }}
                    />
                    <div>
                      <div className="font-medium">{reference.code}</div>
                      <div className="text-xs text-muted-foreground">{reference.name}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reference Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Progress Visualization */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentReference.color }}
                />
                {currentReference.code}
              </CardTitle>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(currentReference.status)}`}>
                {getStatusIcon(currentReference.status)}
                {currentReference.status.replace('_', ' ').toUpperCase()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donut Chart */}
              <div className="relative h-48 w-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-semibold" style={{ color: currentReference.color }}>
                      {getCompletionPercentage()}%
                    </div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                </div>
              </div>

              {/* Key Data Points */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Minutes:</span>
                  <span className="font-medium">{currentReference.totalMinutes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="font-medium text-emerald-600">{currentReference.completedMinutes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-orange-600">{currentReference.remainingMinutes.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{new Date(currentReference.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production History & Size Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reference Details */}
            <Card className="bg-gradient-to-br from-white to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Reference Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Product Name:</span>
                    <p className="text-muted-foreground">{currentReference.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-muted-foreground">{currentReference.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production History Log */}
            <Card className="bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Production History
                </CardTitle>
                <CardDescription>
                  Recent production activity logged for this reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {productionHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{entry.date} at {entry.time}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {entry.operator} • {entry.module} • {entry.shift} Shift
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-emerald-600">
                            +{entry.minutesLogged} min
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Size & Quantity Breakdown */}
            <Card className="bg-gradient-to-br from-white to-emerald-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" />
                  Size & Quantity Breakdown
                </CardTitle>
                <CardDescription>
                  Production progress by size categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sizeBreakdown.map((size) => (
                    <div key={size.size} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{size.size}</span>
                          <span className="text-sm text-muted-foreground">
                            {size.completed}/{size.quantity} units
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round((size.completed / size.quantity) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(size.completed / size.quantity) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}