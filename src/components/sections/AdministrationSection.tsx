import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Users,
  Settings,
  Database,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Activity,
  Download,
  Upload,
  AlertTriangle,
  Clock
} from "lucide-react";
import type { User } from "../../hooks/useAuth";
import { TimeSlotManagement } from "../timeslots/TimeSlotManagement";
import { useTenant } from "../../hooks/useTenant";
import { getPeopleForTenant } from "../../data/tenantData";

interface AdministrationSectionProps {
  user?: User | null;
}

export function AdministrationSection({ user }: AdministrationSectionProps) {
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState("users");

  // Redirect non-administrators
  if (user?.role !== 'administrator') {
    return (
      <div className="flex-1 p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Administrator permissions required to view this section.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get tenant-specific people for user management
  const tenantPeople = useMemo(() => {
    return getPeopleForTenant(currentTenant?.id || 'tenant-001');
  }, [currentTenant?.id]);

  // Generate tenant-specific users from people data
  const users = useMemo(() => {
    const roles = ['administrator', 'supervisor', 'operator'];
    const statuses = ['active', 'active', 'active', 'inactive'];

    return tenantPeople.slice(0, Math.min(6, tenantPeople.length)).map((person, index) => {
      const role = roles[index % roles.length];
      const status = statuses[index % statuses.length];
      const lastLoginDate = new Date();
      lastLoginDate.setHours(lastLoginDate.getHours() - (index * 2));

      return {
        id: person.id,
        name: person.name,
        email: `${person.name.toLowerCase().replace(/ /g, '.')}@${currentTenant?.id || 'company'}.com`,
        role,
        status,
        lastLogin: lastLoginDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };
    });
  }, [tenantPeople, currentTenant?.id]);

  // Generate tenant-specific system logs
  const systemLogs = useMemo(() => {
    const actions = [
      'Created new production module',
      'Updated time slot configuration',
      'User login successful',
      'Database backup completed',
      'Failed login attempt',
      'Modified production reference',
      'Generated production report'
    ];
    const levels = ['info', 'info', 'success', 'warning'];

    const logs = [];
    for (let i = 0; i < Math.min(6, tenantPeople.length); i++) {
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - (i * 15));

      logs.push({
        id: `${i + 1}`,
        timestamp: timestamp.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        user: i === 3 ? 'System' : tenantPeople[i % tenantPeople.length].name,
        action: actions[i % actions.length],
        level: levels[i % levels.length]
      });
    }

    return logs;
  }, [tenantPeople]);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">System Administration</h1>
        <p className="text-muted-foreground">
          Manage users, system settings, and monitor system health
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="timeslots" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Slots
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup & Restore
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            System Logs
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View, create, edit, and delete system users
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'administrator' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Slot Management Tab */}
        <TabsContent value="timeslots" className="space-y-6">
          <TimeSlotManagement />
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure application-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Textile Manufacturing Co." />
                  </div>
                  <div>
                    <Label htmlFor="timezone">System Timezone</Label>
                    <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="60" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Create Backup
                </CardTitle>
                <CardDescription>
                  Generate a backup of the system database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Last backup: January 15, 2024 at 3:00 AM
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Restore Backup
                </CardTitle>
                <CardDescription>
                  Restore system from a backup file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will overwrite all current data. Use with caution.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Backup File
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                Recent system backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>January 15, 2024 3:00 AM</TableCell>
                    <TableCell>Automatic</TableCell>
                    <TableCell>2.4 GB</TableCell>
                    <TableCell>
                      <Badge variant="default">Success</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January 14, 2024 3:00 AM</TableCell>
                    <TableCell>Automatic</TableCell>
                    <TableCell>2.3 GB</TableCell>
                    <TableCell>
                      <Badge variant="default">Success</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Activity Logs
                  </CardTitle>
                  <CardDescription>
                    Monitor system activity and error logs
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}