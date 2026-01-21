import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, UserX, FileText, Settings, Play, Pause } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      id: 1,
      title: "Log Hourly Production",
      description: "Record production data for current hour",
      icon: Clock,
      variant: "default" as const,
      action: () => console.log("Log hourly production")
    },
    {
      id: 2,
      title: "Register Absence",
      description: "Record employee absence or tardiness",
      icon: UserX,
      variant: "outline" as const,
      action: () => console.log("Register absence")
    },
    {
      id: 3,
      title: "Generate Daily Report",
      description: "Create comprehensive daily production report",
      icon: FileText,
      variant: "outline" as const,
      action: () => console.log("Generate daily report")
    },
    {
      id: 4,
      title: "Module Settings",
      description: "Adjust module configurations and parameters",
      icon: Settings,
      variant: "outline" as const,
      action: () => console.log("Module settings")
    },
    {
      id: 5,
      title: "Start Production",
      description: "Initialize production for selected modules",
      icon: Play,
      variant: "default" as const,
      action: () => console.log("Start production")
    },
    {
      id: 6,
      title: "Pause Production",
      description: "Temporarily halt production operations",
      icon: Pause,
      variant: "destructive" as const,
      action: () => console.log("Pause production")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <div className="text-sm text-muted-foreground">
          Frequently used supervisor functions
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={action.id}
                variant={action.variant}
                className="h-auto p-4 justify-start text-left"
                onClick={action.action}
              >
                <div className="flex items-start space-x-3 w-full">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-70 font-normal">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Last action: Production logged at 2:00 PM by Maria Rodriguez
          </div>
        </div>
      </CardContent>
    </Card>
  );
}