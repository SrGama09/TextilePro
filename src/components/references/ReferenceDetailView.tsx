import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Edit, Plus, X, Clock, Users, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Reference {
  id: string;
  code: string;
  description: string;
  lot: string;
  status: 'Pendiente' | 'En proceso' | 'Terminado';
  progress: number;
  totalMinutes: number;
  remainingMinutes: number;
  minutesPerUnit: number;
  assignedModules: string[];
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  estimatedCompletion: string;
}

interface ReferenceDetailViewProps {
  reference: Reference;
  onBack: () => void;
}

export function ReferenceDetailView({ reference, onBack }: ReferenceDetailViewProps) {
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [showAssignModuleModal, setShowAssignModuleModal] = useState(false);

  // Mock data for sizes
  const sizes = [
    { id: "1", name: "XS", quantity: 50, completed: 45 },
    { id: "2", name: "S", quantity: 120, completed: 95 },
    { id: "3", name: "M", quantity: 200, completed: 180 },
    { id: "4", name: "L", quantity: 150, completed: 125 },
    { id: "5", name: "XL", quantity: 80, completed: 70 },
    { id: "6", name: "XXL", quantity: 40, completed: 35 }
  ];

  // Mock data for production history
  const productionHistory = [
    {
      date: '2024-12-07',
      module: 'Module 1',
      minutesProduced: 120,
      efficiency: 95,
      operator: 'Maria Rodriguez'
    },
    {
      date: '2024-12-06',
      module: 'Module 1',
      minutesProduced: 115,
      efficiency: 87,
      operator: 'Carlos Martinez'
    },
    {
      date: '2024-12-05',
      module: 'Module 2',
      minutesProduced: 108,
      efficiency: 91,
      operator: 'Ana Lopez'
    },
    {
      date: '2024-12-04',
      module: 'Module 1',
      minutesProduced: 125,
      efficiency: 94,
      operator: 'Maria Rodriguez'
    }
  ];

  // Mock available modules
  const availableModules = [
    { id: "3", name: "Module 3", status: "Available" },
    { id: "4", name: "Module 4", status: "Available" },
    { id: "7", name: "Module 7", status: "Available" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente': return 'secondary';
      case 'En proceso': return 'default';
      case 'Terminado': return 'outline';
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

  const totalQuantity = sizes.reduce((acc, size) => acc + size.quantity, 0);
  const completedQuantity = sizes.reduce((acc, size) => acc + size.completed, 0);
  const quantityProgress = (completedQuantity / totalQuantity) * 100;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to References
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{reference.code}</h1>
            <p className="text-muted-foreground">{reference.lot} • {reference.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(reference.status) as any}>
            {reference.status}
          </Badge>
          <Badge variant={getPriorityColor(reference.priority) as any}>
            {reference.priority} Priority
          </Badge>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Reference
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Reference Details</TabsTrigger>
          <TabsTrigger value="sizes">Sizes & Quantities</TabsTrigger>
          <TabsTrigger value="modules">Assigned Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reference.progress}%</div>
                <Progress value={reference.progress} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {reference.totalMinutes - reference.remainingMinutes} / {reference.totalMinutes} minutes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Remaining Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reference.remainingMinutes}</div>
                <p className="text-xs text-muted-foreground">minutes left</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assigned Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reference.assignedModules.length}</div>
                <p className="text-xs text-muted-foreground">currently working</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Est. Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {new Date(reference.estimatedCompletion).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.ceil((new Date(reference.estimatedCompletion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reference Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference Code:</span>
                  <span className="font-medium">{reference.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Number:</span>
                  <span>{reference.lot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-right max-w-xs">{reference.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(reference.status) as any}>
                    {reference.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={getPriorityColor(reference.priority) as any}>
                    {reference.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minutes per Unit:</span>
                  <span>{reference.minutesPerUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created Date:</span>
                  <span>{new Date(reference.createdDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Units:</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completed Units:</span>
                    <span className="font-medium">{completedQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining Units:</span>
                    <span className="font-medium">{totalQuantity - completedQuantity}</span>
                  </div>
                  <Progress value={quantityProgress} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>120 minutes produced by Module 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>Maria Rodriguez assigned</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-yellow-500" />
                      <span>45 units of size M completed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Production History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Minutes Produced</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Operator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.module}</TableCell>
                      <TableCell>{record.minutesProduced}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${record.efficiency >= 90 ? 'text-green-600' : record.efficiency >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {record.efficiency}%
                        </span>
                      </TableCell>
                      <TableCell>{record.operator}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sizes & Quantities</h3>
            <Dialog open={showAddSizeModal} onOpenChange={setShowAddSizeModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Size
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Size to {reference.code}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Size Name</Label>
                    <Input placeholder="e.g., XXS, 3XL" />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="Enter quantity" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddSizeModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddSizeModal(false)}>
                      Add Size
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sizes.map((size) => {
              const sizeProgress = (size.completed / size.quantity) * 100;
              return (
                <Card key={size.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Size {size.name}</h4>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed:</span>
                        <span className="font-medium">{size.completed} / {size.quantity}</span>
                      </div>
                      <Progress value={sizeProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {sizeProgress.toFixed(1)}% complete
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Assigned Modules ({reference.assignedModules.length})</h3>
            <Dialog open={showAssignModuleModal} onOpenChange={setShowAssignModuleModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Module to {reference.code}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Module</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a module to assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.name} ({module.status})
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
                    <Button variant="outline" onClick={() => setShowAssignModuleModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAssignModuleModal(false)}>
                      Assign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reference.assignedModules.map((moduleName, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{moduleName}</h4>
                      <p className="text-sm text-muted-foreground">Active since Dec 1, 2024</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">92%</div>
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
      </Tabs>
    </main>
  );
}