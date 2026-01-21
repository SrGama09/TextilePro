import { KPIPanel } from "../KPIPanel";
import { ModuleEfficiencyChart } from "../ModuleEfficiencyChart";
import { ActiveReferences } from "../ActiveReferences";
import { AlertsPanel } from "../AlertsPanel";
import { QuickActions } from "../QuickActions";
import { DateFilter } from "../DateFilter";
import { ModulePerformanceComparison } from "../analytics/ModulePerformanceComparison";
import { ReferenceProgressVisualization } from "../analytics/ReferenceProgressVisualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  Activity,
  Users,
  Shield,
  Database,
  Settings,
  UserCheck,
  Clock,
  Package,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  FileText,
  BarChart3,
  UserPlus,
  TrendingUp,
  Target
} from "lucide-react";
import type { User } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import { getDashboardDataForTenant } from "../../data/tenantData";

interface DashboardProps {
  user?: User | null;
}

export function Dashboard({ user }: DashboardProps) {
  const { currentTenant } = useTenant();

  // Get tenant-specific dashboard data
  const systemData = currentTenant
    ? getDashboardDataForTenant(currentTenant.id)
    : getDashboardDataForTenant('tenant-001'); // fallback

  const renderSupervisorDashboard = () => (
    <>
      {/* Daily Production KPIs */}
      <KPIPanel />

      {/* Module Performance & Active References */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModuleEfficiencyChart />
        <ActiveReferences />
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AlertsPanel />
        <QuickActions />
      </div>
    </>
  );

  const renderAdministratorDashboard = () => (
    <>
      {/* System Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-600">{systemData.systemHealth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2">
              <CheckCircle className="h-3 w-3" />
              No issues detected
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">{systemData.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 from yesterday
            </p>
            <div className="text-xs text-blue-600 mt-2">
              Peak activity: 10:00 AM
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-purple-600">Secure</div>
            <p className="text-xs text-muted-foreground mt-1">
              No threats detected
            </p>
            <div className="flex items-center gap-1 text-xs text-purple-600 mt-2">
              <Shield className="h-3 w-3" />
              All protocols active
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md hover:shadow-soft-lg transition-gentle border-0 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Backup</CardTitle>
            <Database className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-600">{systemData.lastBackupTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {systemData.lastBackupDate} - Successful
            </p>
            <div className="flex items-center gap-1 text-xs text-orange-600 mt-2">
              <CheckCircle className="h-3 w-3" />
              Auto-backup enabled
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Section */}
      <div className="space-y-8 mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-medium text-foreground">Performance Analysis Center</h2>
            <p className="text-muted-foreground">Advanced analytics and strategic insights for data-driven decisions</p>
          </div>
        </div>

        {/* Module Performance Comparison */}
        <ModulePerformanceComparison />

        {/* Reference Progress Visualization */}
        <ReferenceProgressVisualization />
      </div>

      {/* Entity Management & User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-slate-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Entity Management
            </CardTitle>
            <CardDescription>
              Overview of all system entities and their current status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Modules */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Production Modules</span>
                <Badge variant="outline" className="bg-primary/10">{systemData.modules.total}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-muted-foreground">Active:</span>
                  <span className="font-medium">{systemData.modules.active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-muted-foreground">Inactive:</span>
                  <span className="font-medium">{systemData.modules.inactive}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* People */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Personnel</span>
                <Badge variant="outline" className="bg-blue-50">{systemData.people.total}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-muted-foreground">Active:</span>
                  <span className="font-medium">{systemData.people.active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-muted-foreground">Inactive:</span>
                  <span className="font-medium">{systemData.people.inactive}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* References */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Production References</span>
                <Badge variant="outline" className="bg-purple-50">{systemData.references.total}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Pause className="h-3 w-3 text-yellow-500" />
                  <span className="text-muted-foreground">Pending:</span>
                  <span className="font-medium">{systemData.references.pending}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">In Progress:</span>
                  <span className="font-medium">{systemData.references.inProgress}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  <span className="text-muted-foreground">Finished:</span>
                  <span className="font-medium">{systemData.references.finished}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-teal-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              System users, roles, and recent account activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User counts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total System Users</span>
                <Badge variant="outline" className="bg-teal-50">{systemData.users.total}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Administrators:</span>
                  <span className="font-medium">{systemData.users.administrators}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Supervisors:</span>
                  <span className="font-medium">{systemData.users.supervisors}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Recent user activity */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Recent Account Activity</span>
              <ScrollArea className="h-24">
                <div className="space-y-2">
                  {systemData.recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{user.name}</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {user.role}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground">{user.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              System Logs Feed
            </CardTitle>
            <CardDescription>
              Latest system events and important notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {systemData.systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                    <div className="mt-0.5">
                      {log.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      {log.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {log.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      {log.type === 'info' && <Activity className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Administrative Quick Actions
            </CardTitle>
            <CardDescription>
              Access the most important administrative tools and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <Users className="h-4 w-4" />
              User Management
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <Settings className="h-4 w-4" />
              General Settings
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <Clock className="h-4 w-4" />
              Time Slot Management
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <BarChart3 className="h-4 w-4" />
              System Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <main className="p-8 space-y-8 min-h-screen">
      {/* Welcome Header with Role-specific messaging */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground">
            Good morning, {user?.name} 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            {user?.role === 'administrator'
              ? "Let's check on your system's health and performance today"
              : user?.role === 'operator'
                ? "Ready to log your production for today?"
                : "Let's make today productive together"
            }
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent">
              {user?.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Tuesday, September 16, 2025
            </span>
          </div>
        </div>
        <DateFilter />
      </div>

      {/* Role-specific dashboard content */}
      {user?.role === 'administrator'
        ? renderAdministratorDashboard()
        : renderSupervisorDashboard()
      }
    </main>
  );
}