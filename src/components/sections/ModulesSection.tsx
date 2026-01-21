import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Search, Plus, Edit, Trash2, Users, Activity, MoreHorizontal, Shield, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ModuleDetailView } from "../modules/ModuleDetailView";
import { ModuleForm } from "../modules/ModuleForm";
import { ProductionLogging } from "../production/ProductionLogging";
import type { User } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import { getModulesForTenant } from "../../data/tenantData";

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

interface ModulesSectionProps {
  user?: User | null;
}

export function ModulesSection({ user }: ModulesSectionProps) {
  const { currentTenant } = useTenant();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState("modules");

  // Get tenant-specific modules data and maintain local state
  const [modules, setModules] = useState<Module[]>(() =>
    currentTenant ? getModulesForTenant(currentTenant.id) : []
  );

  // Update modules when tenant changes
  useEffect(() => {
    if (currentTenant) {
      setModules(getModulesForTenant(currentTenant.id));
    }
  }, [currentTenant]);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateModule = (moduleData: Omit<Module, 'id' | 'assignedPeople' | 'currentReference' | 'efficiency' | 'lastActivity'>) => {
    const newModule: Module = {
      ...moduleData,
      id: `module-${Date.now()}`,
      assignedPeople: 0,
      currentReference: 'None',
      efficiency: 0,
      lastActivity: new Date().toLocaleTimeString()
    };

    setModules(prev => [...prev, newModule]);
    setShowCreateModal(false);
  };

  const handleUpdateModule = (moduleData: Omit<Module, 'id' | 'assignedPeople' | 'currentReference' | 'efficiency' | 'lastActivity'>) => {
    if (!editingModule) return;

    setModules(prev => prev.map(module =>
      module.id === editingModule.id
        ? { ...module, ...moduleData, lastActivity: new Date().toLocaleTimeString() }
        : module
    ));
    setEditingModule(null);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      setModules(prev => prev.filter(module => module.id !== moduleId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canCreateDelete = user?.role === 'administrator';
  const canEdit = user?.role === 'administrator' || user?.role === 'supervisor';

  if (selectedModule) {
    return (
      <ModuleDetailView
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  return (
    <TooltipProvider>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Production Management</h1>
          {canCreateDelete ? (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                  <DialogDescription>
                    Add a new production module to the system.
                  </DialogDescription>
                </DialogHeader>
                <ModuleForm
                  onSubmit={handleCreateModule}
                  onCancel={() => setShowCreateModal(false)}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Module
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Administrator permission required</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Modules Management
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Production Logging
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search modules..."
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
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-l-4"
                  style={{ borderLeftColor: module.status === 'Active' ? '#22c55e' : module.status === 'Maintenance' ? '#ef4444' : '#94a3b8' }}
                  onClick={() => setSelectedModule(module)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-mono mt-1">{module.code}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedModule(module); }}>
                            <Activity className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingModule(module); }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canCreateDelete ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteModule(module.id);
                              }}
                            >
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
                    {/* Status and Efficiency Row */}
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusColor(module.status) as any} className="font-medium">
                        {module.status}
                      </Badge>
                      <div className={`text-sm font-bold ${getEfficiencyColor(module.efficiency)}`}>
                        {module.efficiency}% Efficiency
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/50"></div>

                    {/* Details Grid */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Assigned People:
                        </span>
                        <span className="font-semibold">{module.assignedPeople}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Reference:</span>
                        <span className="font-medium text-foreground truncate max-w-[140px]" title={module.currentReference}>
                          {module.currentReference}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          Last Activity:
                        </span>
                        <span className="font-medium text-xs">{module.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Module Modal */}
            <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Module</DialogTitle>
                  <DialogDescription>
                    Update the module information and settings.
                  </DialogDescription>
                </DialogHeader>
                {editingModule && (
                  <ModuleForm
                    module={editingModule}
                    onSubmit={handleUpdateModule}
                    onCancel={() => setEditingModule(null)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <ProductionLogging />
          </TabsContent>
        </Tabs>
      </main>
    </TooltipProvider>
  );
}