import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export function ModuleEfficiencyChart() {
  const moduleData = [
    { name: "Module 1", efficiency: 95 },
    { name: "Module 2", efficiency: 92 },
    { name: "Module 3", efficiency: 68 },
    { name: "Module 4", efficiency: 88 },
    { name: "Module 5", efficiency: 91 },
    { name: "Module 6", efficiency: 85 },
    { name: "Module 7", efficiency: 78 },
    { name: "Module 8", efficiency: 93 },
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return '#22c55e'; // green
    if (efficiency >= 75) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 90) return 'High';
    if (efficiency >= 75) return 'Average';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Efficiency</CardTitle>
        <div className="text-sm text-muted-foreground">
          Real-time efficiency comparison across all active modules
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={moduleData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={60} />
                <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                  {moduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getEfficiencyColor(entry.efficiency)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {moduleData.map((module) => (
              <div key={module.name} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getEfficiencyColor(module.efficiency) }}
                  />
                  <span className="text-sm font-medium">{module.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{module.efficiency}%</div>
                  <div className="text-xs text-muted-foreground">
                    {getEfficiencyStatus(module.efficiency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}