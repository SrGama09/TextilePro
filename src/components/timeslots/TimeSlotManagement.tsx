import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { TimeSlotForm } from "./TimeSlotForm";
import { useTenant } from "../../hooks/useTenant";
import { getModulesForTenant } from "../../data/tenantData";

export interface TimeSlot {
  id: string;
  modulo_id: string;
  modulo_name: string;
  hora_inicio: string;
  hora_fin: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
}

export function TimeSlotManagement() {
  const { currentTenant } = useTenant();

  // Get tenant-specific modules
  const tenantModules = useMemo(() => {
    const modules = getModulesForTenant(currentTenant?.id || 'tenant-001');
    return modules.map(m => ({
      id: m.id,
      name: m.name,
      code: m.id
    }));
  }, [currentTenant?.id]);

  // Generate initial time slots based on tenant modules
  const initialTimeSlots = useMemo((): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const timeRanges = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' }
    ];

    // Generate time slots for first 3 modules
    tenantModules.slice(0, 3).forEach((module, moduleIndex) => {
      timeRanges.slice(0, 2).forEach((range, rangeIndex) => {
        slots.push({
          id: `${moduleIndex * 2 + rangeIndex + 1}`,
          modulo_id: module.id,
          modulo_name: module.name,
          hora_inicio: range.start,
          hora_fin: range.end,
          status: rangeIndex === 1 && moduleIndex === 1 ? 'inactive' : 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });
    });

    return slots;
  }, [tenantModules]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Update time slots when tenant changes
  useEffect(() => {
    setTimeSlots(initialTimeSlots);
    setFilteredTimeSlots(initialTimeSlots);
    setSelectedModule("all");
  }, [initialTimeSlots]);

  // Filter time slots based on module and search term
  const applyFilters = () => {
    let filtered = timeSlots;

    if (selectedModule !== "all") {
      filtered = filtered.filter(slot => slot.modulo_id === selectedModule);
    }

    if (searchTerm) {
      filtered = filtered.filter(slot =>
        slot.modulo_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.hora_inicio.includes(searchTerm) ||
        slot.hora_fin.includes(searchTerm)
      );
    }

    setFilteredTimeSlots(filtered);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [selectedModule, searchTerm]);

  const handleCreateTimeSlot = (newTimeSlot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => {
    const module = tenantModules.find(m => m.id === newTimeSlot.modulo_id);
    const timeSlot: TimeSlot = {
      ...newTimeSlot,
      id: Date.now().toString(),
      modulo_name: module?.name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newTimeSlots = [...timeSlots, timeSlot];
    setTimeSlots(newTimeSlots);
    setFilteredTimeSlots(newTimeSlots);
    setIsFormOpen(false);
  };

  const handleUpdateTimeSlot = (updatedTimeSlot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTimeSlot) return;

    const module = tenantModules.find(m => m.id === updatedTimeSlot.modulo_id);
    const timeSlot: TimeSlot = {
      ...updatedTimeSlot,
      id: editingTimeSlot.id,
      modulo_name: module?.name || '',
      created_at: editingTimeSlot.created_at,
      updated_at: new Date().toISOString()
    };

    const newTimeSlots = timeSlots.map(ts => ts.id === editingTimeSlot.id ? timeSlot : ts);
    setTimeSlots(newTimeSlots);
    setFilteredTimeSlots(newTimeSlots);
    setEditingTimeSlot(null);
    setIsFormOpen(false);
  };

  const handleDeleteTimeSlot = (id: string) => {
    const newTimeSlots = timeSlots.filter(ts => ts.id !== id);
    setTimeSlots(newTimeSlots);
    setFilteredTimeSlots(newTimeSlots);
  };

  const handleEditClick = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingTimeSlot(null);
    setIsFormOpen(true);
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active'
      ? <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Slot Management
              </CardTitle>
              <CardDescription>
                Configure work time blocks for production modules
              </CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Time Slot
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingTimeSlot ? 'Edit Time Slot' : 'Create New Time Slot'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTimeSlot
                      ? 'Modify the time slot configuration for the selected module.'
                      : 'Define a new work time block for production modules.'}
                  </DialogDescription>
                </DialogHeader>
                <TimeSlotForm
                  modules={tenantModules}
                  timeSlot={editingTimeSlot}
                  onSubmit={editingTimeSlot ? handleUpdateTimeSlot : handleCreateTimeSlot}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search time slots..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  applyFilters();
                }}
                className="w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedModule} onValueChange={(value) => {
                setSelectedModule(value);
                applyFilters();
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {tenantModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Slots Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimeSlots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No time slots found. Create your first time slot to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTimeSlots.map((timeSlot) => {
                  const startTime = new Date(`2000-01-01T${timeSlot.hora_inicio}:00`);
                  const endTime = new Date(`2000-01-01T${timeSlot.hora_fin}:00`);
                  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

                  return (
                    <TableRow key={timeSlot.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{timeSlot.modulo_name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {timeSlot.modulo_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{timeSlot.hora_inicio}</TableCell>
                      <TableCell className="font-mono">{timeSlot.hora_fin}</TableCell>
                      <TableCell>{duration} min</TableCell>
                      <TableCell>
                        {getStatusBadge(timeSlot.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(timeSlot.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(timeSlot)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}