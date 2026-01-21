import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowLeft, Users, Plus, X, Edit, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTenant } from "../../hooks/useTenant";
import { getPeopleForTenant, getReferencesForTenant } from "../../data/tenantData";

interface Module {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  assignedPeople: number;
  currentReference: string;
  efficiency: number;
  lastActivity: string;
}

interface ModuleDetailViewProps {
  module: Module;
  onBack: () => void;
}

export function ModuleDetailView({ module, onBack }: ModuleDetailViewProps) {
  const { currentTenant } = useTenant();
  const [showAssignPersonModal, setShowAssignPersonModal] = useState(false);
  const [showAssignReferenceModal, setShowAssignReferenceModal] = useState(false);

  // Get tenant-specific data
  const tenantPeople = useMemo(() => {
    return getPeopleForTenant(currentTenant?.id || 'tenant-001');
  }, [currentTenant?.id]);

  const tenantReferences = useMemo(() => {
    return getReferencesForTenant(currentTenant?.id || 'tenant-001');
  }, [currentTenant?.id]);

  // Mock data for efficiency chart (could be made tenant-specific later)
  const efficiencyData = [
    { day: 'Mon', efficiency: 89 },
    { day: 'Tue', efficiency: 92 },
    { day: 'Wed', efficiency: 88 },
    { day: 'Thu', efficiency: 95 },
    { day: 'Fri', efficiency: 91 },
    { day: 'Sat', efficiency: 87 },
    { day: 'Sun', efficiency: 93 }
  ];

  // Filter people actually assigned to THIS specific module
  const assignedPeople = useMemo(() => {
    return tenantPeople
      .filter(person => person.assignedModule === module.name)
      .map((person, index) => ({
        id: person.id,
        name: person.name,
        code: person.code || person.id,
        efficiency: person.efficiency || 85,
        role: index === 0 ? "Supervisor" : person.department === "Producción" ? "Operator" : "Technician"
      }));
  }, [tenantPeople, module.name]);

  // Simulated assigned references - first few references from tenant
  const assignedReferences = useMemo(() => {
    const priorities = ['High', 'Medium', 'Low'];
    return tenantReferences.slice(0, 2).map((ref, index) => ({
      id: ref.code,
      code: ref.code,
      description: ref.description,
      priority: priorities[index % priorities.length],
      progress: 45 + Math.floor(Math.random() * 45),
      estimatedCompletion: `${2 + index * 4} hours`
    }));
  }, [tenantReferences]);

  // Available people for assignment (those NOT assigned to this module)
  const availablePeople = useMemo(() => {
    return tenantPeople
      .filter(person => person.assignedModule !== module.name)
      .slice(0, 3)
      .map(person => ({
        id: person.id,
        name: person.name,
        code: person.code || person.id,
        department: person.department || "Production"
      }));
  }, [tenantPeople, module.name]);

  // Available references for assignment (not yet assigned)
  const availableReferences = useMemo(() => {
    const priorities = ['Low', 'High', 'Medium'];
    return tenantReferences.slice(2, 5).map((ref, index) => ({
      id: ref.code,
      code: ref.code,
      description: ref.description,
      priority: priorities[index % priorities.length]
    }));
  }, [tenantReferences]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{module.name}</h1>
            <p className="text-muted-foreground">{module.code}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(module.status) as any}>
            {module.status}
          </Badge>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Module
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview & Stats</TabsTrigger>
          <TabsTrigger value="people">Assigned People</TabsTrigger>
          <TabsTrigger value="references">Assigned References</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{module.efficiency}%</div>
                <p className="text-xs text-muted-foreground">+2.3% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assigned Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignedPeople.length}</div>
                <p className="text-xs text-muted-foreground">{assignedPeople.length} active, 0 absent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active References
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignedReferences.length}</div>
                <p className="text-xs text-muted-foreground">
                  {assignedReferences.filter(ref => ref.priority === 'High').length} high priority
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{module.lastActivity}</div>
                <p className="text-xs text-muted-foreground">Production logging</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Efficiency Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <XAxis dataKey="day" />
                    <YAxis domain={[80, 100]} />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Assigned People ({assignedPeople.length})</h3>
            <Dialog open={showAssignPersonModal} onOpenChange={setShowAssignPersonModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Person
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Person to {module.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Person</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a person to assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePeople.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name} ({person.code}) - {person.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAssignPersonModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAssignPersonModal(false)}>
                      Assign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedPeople.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-muted-foreground">{person.code} • {person.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">{person.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="references" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Assigned References ({assignedReferences.length})</h3>
            <Dialog open={showAssignReferenceModal} onOpenChange={setShowAssignReferenceModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Reference
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Reference to {module.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Reference</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a reference to assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableReferences.map((reference) => (
                          <SelectItem key={reference.id} value={reference.id}>
                            {reference.code} - {reference.description} ({reference.priority} Priority)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select defaultValue="Medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAssignReferenceModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAssignReferenceModal(false)}>
                      Assign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {assignedReferences.map((reference) => (
              <Card key={reference.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{reference.code}</h4>
                        <Badge variant={getPriorityColor(reference.priority) as any}>
                          {reference.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reference.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress: {reference.progress}%</span>
                        <span>Est. completion: {reference.estimatedCompletion}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}