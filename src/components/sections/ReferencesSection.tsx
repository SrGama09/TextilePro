import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Search, Plus, Edit, Trash2, MoreHorizontal, Activity, Package, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { User } from "../../hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ReferenceDetailView } from "../references/ReferenceDetailView";
import { ReferenceForm } from "../references/ReferenceForm";
import { useTenant } from "../../hooks/useTenant";
import { getReferencesForTenant } from "../../data/tenantData";

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

interface ReferencesSectionProps {
  user?: User | null;
}

export function ReferencesSection({ user }: ReferencesSectionProps) {
  const { currentTenant } = useTenant();
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Get tenant-specific references data
  const references: Reference[] = currentTenant
    ? getReferencesForTenant(currentTenant.id)
    : [];

  const filteredReferences = references.filter(reference => {
    const matchesSearch = reference.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.lot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reference.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || reference.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canCreateDelete = user?.role === 'administrator';
  const canEdit = user?.role === 'administrator' || user?.role === 'supervisor';

  if (selectedReference) {
    return (
      <ReferenceDetailView
        reference={selectedReference}
        onBack={() => setSelectedReference(null)}
      />
    );
  }

  return (
    <TooltipProvider>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">References Management</h1>
          {canCreateDelete ? (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Reference
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Reference</DialogTitle>
                  <DialogDescription>
                    Create a new production reference with details and specifications.
                  </DialogDescription>
                </DialogHeader>
                <ReferenceForm
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
                  Create New Reference
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
                placeholder="Search references..."
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
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En proceso">En proceso</SelectItem>
                <SelectItem value="Terminado">Terminado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{references.length}</div>
              <p className="text-xs text-muted-foreground">
                {references.filter(r => r.status === 'En proceso').length} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {references.filter(r => r.status === 'Terminado').length}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {references.filter(r => r.priority === 'High' && r.status !== 'Terminado').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(references.filter(r => r.status === 'En proceso').reduce((acc, r) => acc + r.progress, 0) / references.filter(r => r.status === 'En proceso').length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Active references
              </p>
            </CardContent>
          </Card>
        </div>

        {/* References List */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReferences.map((reference) => (
              <Card key={reference.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{reference.code}</CardTitle>
                      <p className="text-sm text-muted-foreground">{reference.lot}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedReference(reference)}>
                          <Activity className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => setEditingReference(reference)}>
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
                  <div className="space-y-2">
                    <p className="text-sm">{reference.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusColor(reference.status) as any}>
                        {reference.status}
                      </Badge>
                      <Badge variant={getPriorityColor(reference.priority) as any}>
                        {reference.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progress:</span>
                      <span className={`font-bold ${getProgressColor(reference.progress)}`}>
                        {reference.progress}%
                      </span>
                    </div>
                    <Progress value={reference.progress} className="h-2" />
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span>{reference.remainingMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules:</span>
                      <span>{reference.assignedModules.length}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedReference(reference)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All References ({filteredReferences.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferences.map((reference) => (
                    <TableRow key={reference.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{reference.code}</TableCell>
                      <TableCell className="max-w-xs truncate">{reference.description}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(reference.status) as any}>
                          {reference.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(reference.priority) as any}>
                          {reference.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={reference.progress} className="h-2 w-16" />
                          <span className={`text-sm font-medium ${getProgressColor(reference.progress)}`}>
                            {reference.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{reference.assignedModules.length}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedReference(reference)}>
                              <Package className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit && (
                              <DropdownMenuItem onClick={() => setEditingReference(reference)}>
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
        )}

        {/* Edit Reference Modal */}
        <Dialog open={!!editingReference} onOpenChange={() => setEditingReference(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Reference</DialogTitle>
              <DialogDescription>
                Update the reference information and specifications.
              </DialogDescription>
            </DialogHeader>
            {editingReference && (
              <ReferenceForm
                reference={editingReference}
                onSubmit={() => setEditingReference(null)}
                onCancel={() => setEditingReference(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </TooltipProvider>
  );
}