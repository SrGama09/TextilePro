import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";
import { useTenant } from "../hooks/useTenant";
import { getDashboardDataForTenant } from "../data/tenantData";

export function AlertsPanel() {
  const { currentTenant } = useTenant();
  const dashboardData = getDashboardDataForTenant(currentTenant?.id || 'tenant-001');
  const alertsData = dashboardData.alerts;

  // Map alert type to icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Clock;
    }
  };

  const alerts = alertsData.map(alert => ({
    ...alert,
    icon: getAlertIcon(alert.type)
  }));

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          variant: 'destructive' as const,
          badgeVariant: 'destructive' as const,
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          variant: 'default' as const,
          badgeVariant: 'secondary' as const,
          iconColor: 'text-yellow-600'
        };
      case 'info':
        return {
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          variant: 'default' as const,
          badgeVariant: 'outline' as const,
          iconColor: 'text-gray-600'
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Alerts & Notifications
          <Badge variant="destructive" className="text-xs">
            {alerts.filter(alert => alert.type === 'critical').length} Critical
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          System alerts requiring your attention
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            const IconComponent = alert.icon;

            return (
              <Alert key={alert.id} variant={style.variant} className="p-3">
                <div className="flex items-start space-x-3">
                  <IconComponent className={`w-4 h-4 mt-0.5 ${style.iconColor}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </div>
                    </div>
                    <AlertDescription className="text-xs">
                      {alert.message}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}