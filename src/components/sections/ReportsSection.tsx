import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FileText, Download, Calendar, TrendingUp, Users, Package, AlertCircle } from "lucide-react";
import type { User } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import { getModulesForTenant, getPeopleForTenant, getDashboardDataForTenant } from "../../data/tenantData";

type ReportType = 'daily' | 'module' | 'person' | 'efficiency' | 'absences';

interface ReportsSectionProps {
  user?: User | null;
}

export function ReportsSection({ user }: ReportsSectionProps) {
  const { currentTenant } = useTenant();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '2024-12-01',
    endDate: '2024-12-07'
  });
  const [moduleFilter, setModuleFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');

  // Get tenant-specific modules and people
  const tenantModules = useMemo(() => {
    return getModulesForTenant(currentTenant?.id || 'tenant-001');
  }, [currentTenant?.id]);

  const tenantPeople = useMemo(() => {
    return getPeopleForTenant(currentTenant?.id || 'tenant-001');
  }, [currentTenant?.id]);

  // Generate daily production data based on tenant metrics
  const dailyProductionData = useMemo(() => {
    const dashboardData = getDashboardDataForTenant(currentTenant?.id || 'tenant-001');
    const baseTarget = dashboardData.production.targetMinutes;
    const baseEfficiency = dashboardData.production.overallEfficiency;

    // Generate 7 days of production data with realistic variation
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Add ±5% variation to daily targets and actual values
      const dailyTarget = Math.round(baseTarget * (0.95 + Math.random() * 0.1));
      const efficiencyVariation = baseEfficiency * (0.9 + Math.random() * 0.2); // ±10% from base
      const actual = Math.round(dailyTarget * (efficiencyVariation / 100));
      const efficiency = Math.round((actual / dailyTarget) * 1000) / 10; // One decimal

      days.push({
        date: date.toISOString().split('T')[0],
        planned: dailyTarget,
        actual,
        efficiency
      });
    }

    return days;
  }, [currentTenant?.id]);

  // Generate module efficiency data from tenant modules
  const moduleEfficiencyData = useMemo(() => {
    return tenantModules.map((module) => ({
      module: module.name,
      efficiency: Math.floor(70 + Math.random() * 25), // 70-95%
      target: 90
    }));
  }, [tenantModules]);

  // Generate person productivity data from tenant people
  const personProductivityData = useMemo(() => {
    return tenantPeople.map((person) => ({
      name: person.name,
      efficiency: Math.floor(75 + Math.random() * 20), // 75-95%
      hours: 8,
      modules: tenantModules[Math.floor(Math.random() * tenantModules.length)]?.name || 'N/A'
    }));
  }, [tenantPeople, tenantModules]);

  // Efficiency trend data (mock)
  const efficiencyTrendData = useMemo(() => [
    { month: 'Aug', efficiency: 87.2, target: 90 },
    { month: 'Sep', efficiency: 89.1, target: 90 },
    { month: 'Oct', efficiency: 91.3, target: 90 },
    { month: 'Nov', efficiency: 88.7, target: 90 },
    { month: 'Dec', efficiency: 92.1, target: 90 }
  ], []);

  const absenceData = [
    { type: 'Justified', count: 12, color: '#22c55e' },
    { type: 'Unjustified', count: 3, color: '#ef4444' },
    { type: 'Medical', count: 8, color: '#3b82f6' },
    { type: 'Vacation', count: 15, color: '#f59e0b' }
  ];

  // Generate absence records from tenant people
  const absenceRecords = useMemo(() => {
    const records = [];
    const absenceTypes = ['Justified', 'Unjustified', 'Medical'];
    const reasons = {
      'Justified': ['Medical appointment', 'Family emergency', 'Personal matter'],
      'Unjustified': ['No show', 'Late arrival'],
      'Medical': ['Doctor visit', 'Sick leave', 'Medical procedure']
    };
    const durations = ['2 hours', '4 hours', 'Full day', '1 hour', '3 hours'];

    for (let i = 0; i < Math.min(5, tenantPeople.length); i++) {
      const type = absenceTypes[Math.floor(Math.random() * absenceTypes.length)] as 'Justified' | 'Unjustified' | 'Medical';
      const date = new Date(2024, 11, 7 - i); // Dec 7, 6, 5, etc.
      records.push({
        date: date.toISOString().split('T')[0],
        person: tenantPeople[i].name,
        type,
        reason: reasons[type][Math.floor(Math.random() * reasons[type].length)],
        duration: durations[Math.floor(Math.random() * durations.length)]
      });
    }
    return records;
  }, [tenantPeople]);

  const reportCards = [
    {
      type: 'daily' as ReportType,
      title: 'Daily Production Report',
      description: 'Daily production targets vs actual output',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      type: 'module' as ReportType,
      title: 'Production by Module',
      description: 'Module-wise efficiency and performance',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      type: 'person' as ReportType,
      title: 'Production by Person',
      description: 'Individual worker productivity analysis',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      type: 'efficiency' as ReportType,
      title: 'Global Efficiency Report',
      description: 'Overall efficiency trends and patterns',
      icon: Package,
      color: 'bg-orange-500'
    },
    {
      type: 'absences' as ReportType,
      title: 'Absences Report',
      description: 'Employee attendance and absence tracking',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  const handleExport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`);
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}...`);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'daily':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Production Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyProductionData}>
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="planned" fill="#e5e7eb" name="Planned Minutes" />
                      <Bar dataKey="actual" fill="#3b82f6" name="Actual Minutes" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Production Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Planned Minutes</TableHead>
                      <TableHead>Actual Minutes</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyProductionData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                        <TableCell>{day.planned.toLocaleString()}</TableCell>
                        <TableCell>{day.actual.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${day.efficiency >= 100 ? 'text-green-600' : day.efficiency >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {day.efficiency}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={day.efficiency >= 100 ? 'default' : day.efficiency >= 95 ? 'secondary' : 'destructive'}>
                            {day.efficiency >= 100 ? 'Exceeded' : day.efficiency >= 95 ? 'Good' : 'Below Target'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'module':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Efficiency Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moduleEfficiencyData}>
                      <XAxis dataKey="module" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="efficiency" fill="#3b82f6" name="Current Efficiency" />
                      <Bar dataKey="target" fill="#e5e7eb" name="Target Efficiency" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Current Efficiency</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moduleEfficiencyData.map((module, index) => {
                      const variance = module.efficiency - module.target;
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{module.module}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${module.efficiency >= 90 ? 'text-green-600' : module.efficiency >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {module.efficiency}%
                            </span>
                          </TableCell>
                          <TableCell>{module.target}%</TableCell>
                          <TableCell>
                            <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={module.efficiency >= module.target ? 'default' : 'destructive'}>
                              {module.efficiency >= module.target ? 'Meeting Target' : 'Below Target'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'person':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Individual Productivity Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personProductivityData.map((person, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell>{person.modules}</TableCell>
                        <TableCell>{person.hours}h</TableCell>
                        <TableCell>
                          <span className={`font-medium ${person.efficiency >= 90 ? 'text-green-600' : person.efficiency >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {person.efficiency}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={person.efficiency >= 90 ? 'default' : person.efficiency >= 75 ? 'secondary' : 'destructive'}>
                            {person.efficiency >= 90 ? 'Excellent' : person.efficiency >= 75 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'efficiency':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Efficiency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={efficiencyTrendData}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} name="Actual Efficiency" />
                      <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'absences':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Absence Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={absenceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="count"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {absenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Absence Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {absenceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Absences</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absenceRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{record.person}</TableCell>
                        <TableCell>
                          <Badge variant={record.type === 'Unjustified' ? 'destructive' : 'default'}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.reason}</TableCell>
                        <TableCell>{record.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedReport) {
    return (
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              ← Back to Reports
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                {reportCards.find(r => r.type === selectedReport)?.title}
              </h1>
              <p className="text-muted-foreground">
                {reportCards.find(r => r.type === selectedReport)?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              {selectedReport === 'module' && (
                <div>
                  <Label>Module</Label>
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {tenantModules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedReport === 'person' && (
                <div>
                  <Label>Employee</Label>
                  <Select value={personFilter} onValueChange={setPersonFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {tenantPeople.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {renderReportContent()}
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports & Statistics</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.type}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReport(card.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${card.color} text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <p className="text-sm text-muted-foreground">
            Overview of key metrics for today
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">98.3%</div>
              <div className="text-sm text-muted-foreground">Today's Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">14,750</div>
              <div className="text-sm text-muted-foreground">Minutes Produced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-muted-foreground">Active Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-muted-foreground">Absences Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}