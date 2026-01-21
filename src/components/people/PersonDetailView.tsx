import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowLeft, Edit, Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Person {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  assignedModule: string;
  efficiency: number;
  dailyMinutes: number;
  department: string;
  joinDate: string;
}

interface PersonDetailViewProps {
  person: Person;
  onBack: () => void;
}

export function PersonDetailView({ person, onBack }: PersonDetailViewProps) {
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  // Mock data for efficiency chart
  const efficiencyData = [
    { date: '2024-12-01', efficiency: 89 },
    { date: '2024-12-02', efficiency: 92 },
    { date: '2024-12-03', efficiency: 88 },
    { date: '2024-12-04', efficiency: 95 },
    { date: '2024-12-05', efficiency: 91 },
    { date: '2024-12-06', efficiency: 87 },
    { date: '2024-12-07', efficiency: 93 }
  ];

  // Mock production history
  const productionHistory = [
    {
      date: '2024-12-07',
      module: 'Module 1',
      reference: 'REF-001',
      minutesWorked: 480,
      minutesProduced: 456,
      efficiency: 95
    },
    {
      date: '2024-12-06',
      module: 'Module 1',
      reference: 'REF-001',
      minutesWorked: 480,
      minutesProduced: 418,
      efficiency: 87
    },
    {
      date: '2024-12-05',
      module: 'Module 1',
      reference: 'REF-002',
      minutesWorked: 480,
      minutesProduced: 437,
      efficiency: 91
    },
    {
      date: '2024-12-04',
      module: 'Module 1',
      reference: 'REF-002',
      minutesWorked: 480,
      minutesProduced: 456,
      efficiency: 95
    },
    {
      date: '2024-12-03',
      module: 'Module 2',
      reference: 'REF-003',
      minutesWorked: 480,
      minutesProduced: 422,
      efficiency: 88
    }
  ];

  // Mock absence history
  const absenceHistory = [
    {
      date: '2024-11-28',
      type: 'Justified',
      reason: 'Medical appointment',
      duration: '2 hours'
    },
    {
      date: '2024-11-15',
      type: 'Unjustified',
      reason: 'No show',
      duration: 'Full day'
    },
    {
      date: '2024-10-22',
      type: 'Justified',
      reason: 'Family emergency',
      duration: '4 hours'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAbsenceTypeColor = (type: string) => {
    return type === 'Justified' ? 'default' : 'destructive';
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to People
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{person.name}</h1>
            <p className="text-muted-foreground">{person.code} • {person.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(person.status) as any}>
            {person.status}
          </Badge>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Personal Information</TabsTrigger>
          <TabsTrigger value="production">Production History</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
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
                <div className={`text-2xl font-bold ${getEfficiencyColor(person.efficiency)}`}>
                  {person.efficiency}%
                </div>
                <p className="text-xs text-muted-foreground">+3.2% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assigned Module
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">{person.assignedModule}</div>
                <p className="text-xs text-muted-foreground">Since December 1st</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Daily Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{person.dailyMinutes}</div>
                <p className="text-xs text-muted-foreground">minutes per day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Join Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {new Date(person.joinDate).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor((new Date().getTime() - new Date(person.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
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
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee Code:</span>
                  <span className="font-medium">{person.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{person.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(person.status) as any}>
                    {person.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Module:</span>
                  <span>{person.assignedModule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Minutes:</span>
                  <span>{person.dailyMinutes}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Production logged</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Assigned to REF-001</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="text-sm font-medium">Shift started</div>
                    <div className="text-xs text-muted-foreground">8:00 AM today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed production records for the last 30 days
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Minutes Worked</TableHead>
                    <TableHead>Minutes Produced</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.module}</TableCell>
                      <TableCell>{record.reference}</TableCell>
                      <TableCell>{record.minutesWorked}</TableCell>
                      <TableCell>{record.minutesProduced}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getEfficiencyColor(record.efficiency)}`}>
                          {record.efficiency}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absences" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Absence History</h3>
            <Dialog open={showAbsenceModal} onOpenChange={setShowAbsenceModal}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Register Absence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register Absence for {person.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select absence type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="justified">Justified</SelectItem>
                        <SelectItem value="unjustified">Unjustified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullday">Full day</SelectItem>
                        <SelectItem value="halfday">Half day</SelectItem>
                        <SelectItem value="2hours">2 hours</SelectItem>
                        <SelectItem value="4hours">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Enter reason for absence..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAbsenceModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAbsenceModal(false)}>
                      Register Absence
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absenceHistory.map((absence, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(absence.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getAbsenceTypeColor(absence.type) as any}>
                          {absence.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{absence.duration}</TableCell>
                      <TableCell>{absence.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}