import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Search, Plus, Edit, Trash2, User, MoreHorizontal, Activity, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { PersonDetailView } from "../people/PersonDetailView";
import { PersonForm } from "../people/PersonForm";
import type { User } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import { getPeopleForTenant } from "../../data/tenantData";

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

interface PeopleSectionProps {
  user?: User | null;
}

export function PeopleSection({ user }: PeopleSectionProps) {
  const { currentTenant } = useTenant();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get tenant-specific people data
  const people: Person[] = currentTenant
    ? getPeopleForTenant(currentTenant.id)
    : [];

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || person.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canCreateDelete = user?.role === 'administrator';
  const canEdit = user?.role === 'administrator' || user?.role === 'supervisor';

  if (selectedPerson) {
    return (
      <PersonDetailView
        person={selectedPerson}
        onBack={() => setSelectedPerson(null)}
      />
    );
  }

  return (
    <TooltipProvider>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">People Management</h1>
          {canCreateDelete ? (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Person
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Person</DialogTitle>
                  <DialogDescription>
                    Add a new person to the system.
                  </DialogDescription>
                </DialogHeader>
                <PersonForm
                  onSubmit={() => setShowCreateModal(false)}
                  onCancel={() => setShowCreateModal(false)}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Person
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Administrator permission required</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total People
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{people.length}</div>
              <p className="text-xs text-muted-foreground">
                {people.filter(p => p.status === 'Active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(people.filter(p => p.status === 'Active').reduce((acc, p) => acc + p.efficiency, 0) / people.filter(p => p.status === 'Active').length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across active workers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Production Dept.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {people.filter(p => p.department === 'Production').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Production workers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Present Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {people.filter(p => p.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                0 absences
              </p>
            </CardContent>
          </Card>
        </div>

        {/* People List */}
        {viewMode === 'table' ? (
          <Card>
            <CardHeader>
              <CardTitle>All People ({filteredPeople.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeople.map((person) => (
                    <TableRow key={person.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.code}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(person.status) as any}>
                          {person.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{person.assignedModule}</TableCell>
                      <TableCell>{person.department}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getEfficiencyColor(person.efficiency)}`}>
                          {person.efficiency}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPerson(person)}>
                              <User className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            {canEdit && (
                              <DropdownMenuItem onClick={() => setEditingPerson(person)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canCreateDelete ? (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem disabled>
                                <Shield className="w-4 h-4 mr-2" />
                                Delete (Admin Only)
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <Card key={person.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{person.code}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedPerson(person)}>
                          <Activity className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => setEditingPerson(person)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canCreateDelete ? (
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Shield className="w-4 h-4 mr-2" />
                            Delete (Admin Only)
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusColor(person.status) as any}>
                      {person.status}
                    </Badge>
                    <div className={`font-bold ${getEfficiencyColor(person.efficiency)}`}>
                      {person.efficiency}% Efficiency
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Module:</span>
                      <span className="font-medium">{person.assignedModule}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{person.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Daily Minutes:</span>
                      <span>{person.dailyMinutes}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedPerson(person)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Person Modal */}
        <Dialog open={!!editingPerson} onOpenChange={() => setEditingPerson(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Person</DialogTitle>
              <DialogDescription>
                Update the person's information and settings.
              </DialogDescription>
            </DialogHeader>
            {editingPerson && (
              <PersonForm
                person={editingPerson}
                onSubmit={() => setEditingPerson(null)}
                onCancel={() => setEditingPerson(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </TooltipProvider>
  );
}