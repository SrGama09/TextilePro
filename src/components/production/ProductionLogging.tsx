import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  ClipboardList,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Calculator,
  History
} from "lucide-react";
import type { Module, TimeSlot } from "../timeslots/TimeSlotManagement";
import { useTenant } from "../../hooks/useTenant";
import { getModulesForTenant, getPeopleForTenant, getReferencesForTenant } from "../../data/tenantData";

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

interface PersonMinuteEntry {
  person_id: string;
  minutes_worked: number;
  observations: string;
}

interface ProductionRecord {
  id: string;
  module_id: string;
  module_name: string;
  time_slot_id: string;
  time_slot_display: string;
  reference_id: string;
  reference_name: string;
  person_entries: PersonMinuteEntry[];
  total_minutes: number;
  notes?: string;
  logged_by: string;
  logged_at: string;
}

export function ProductionLogging() {
  const { currentTenant } = useTenant();

  // Get tenant-specific data
  const tenantModules = useMemo(() => {
    const modules = getModulesForTenant(currentTenant?.id || 'tenant-001');
    return modules.map(m => ({
      id: m.id,
      name: m.name,
      code: m.id
    }));
  }, [currentTenant?.id]);

  const tenantReferences = useMemo(() => {
    return getReferencesForTenant(currentTenant?.id || 'tenant-001').map(ref => ({
      id: ref.code,
      name: `${ref.description}`,
      code: ref.code
    }));
  }, [currentTenant?.id]);

  const tenantPeople = useMemo(() => {
    return getPeopleForTenant(currentTenant?.id || 'tenant-001').map((person, index) => ({
      id: person.id,
      name: person.name,
      code: person.id,
      status: 'Active' as const,
      assignedModule: tenantModules[index % tenantModules.length]?.id || '',
      efficiency: 85 + Math.floor(Math.random() * 15),
      dailyMinutes: 480,
      department: "Production",
      joinDate: "2023-01-15"
    }));
  }, [currentTenant?.id, tenantModules]);

  // Generate time slots based on tenant modules
  const tenantTimeSlots = useMemo((): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const timeRanges = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' }
    ];

    tenantModules.forEach((module, moduleIndex) => {
      timeRanges.forEach((range, rangeIndex) => {
        slots.push({
          id: `${moduleIndex * timeRanges.length + rangeIndex + 1}`,
          modulo_id: module.id,
          modulo_name: module.name,
          hora_inicio: range.start,
          hora_fin: range.end,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });
    });

    return slots;
  }, [tenantModules]);

  const [activeTab, setActiveTab] = useState('logging');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedReference, setSelectedReference] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [modulePeople, setModulePeople] = useState<Person[]>([]);
  const [personEntries, setPersonEntries] = useState<Record<string, PersonMinuteEntry>>({});
  const [generalNotes, setGeneralNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [todayRecords, setTodayRecords] = useState<ProductionRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null);

  // Update available time slots and people when module changes
  useEffect(() => {
    if (selectedModule) {
      const activeSlots = tenantTimeSlots.filter(
        slot => slot.modulo_id === selectedModule && slot.status === 'active'
      );
      setAvailableTimeSlots(activeSlots);

      const assignedPeople = tenantPeople.filter(
        person => person.assignedModule === selectedModule && person.status === 'Active'
      );
      setModulePeople(assignedPeople);

      // Initialize person entries
      const initialEntries: Record<string, PersonMinuteEntry> = {};
      assignedPeople.forEach(person => {
        initialEntries[person.id] = {
          person_id: person.id,
          minutes_worked: 0,
          observations: ''
        };
      });
      setPersonEntries(initialEntries);
    } else {
      setAvailableTimeSlots([]);
      setModulePeople([]);
      setPersonEntries({});
    }
    setSelectedTimeSlot('');
  }, [selectedModule]);

  const updatePersonEntry = (personId: string, field: keyof PersonMinuteEntry, value: string | number) => {
    setPersonEntries(prev => ({
      ...prev,
      [personId]: {
        ...prev[personId],
        [field]: value
      }
    }));
  };

  const calculateTotalMinutes = (): number => {
    return Object.values(personEntries).reduce((total, entry) => total + (entry.minutes_worked || 0), 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedModule) {
      newErrors.module = 'Please select a module';
    }

    if (!selectedReference) {
      newErrors.reference = 'Please select a product reference';
    }

    if (!selectedTimeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }

    // Validate at least one person has minutes logged
    const hasMinutes = Object.values(personEntries).some(entry => (entry.minutes_worked || 0) > 0);
    if (!hasMinutes) {
      newErrors.minutes = 'Please log minutes for at least one person';
    }

    // Validate minute entries are not negative
    Object.entries(personEntries).forEach(([personId, entry]) => {
      if (entry.minutes_worked < 0) {
        newErrors[`minutes_${personId}`] = 'Minutes cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedModuleData = tenantModules.find(m => m.id === selectedModule);
      const selectedTimeSlotData = availableTimeSlots.find(ts => ts.id === selectedTimeSlot);
      const selectedReferenceData = tenantReferences.find(r => r.id === selectedReference);

      const validEntries = Object.values(personEntries).filter(entry => entry.minutes_worked > 0);

      const newRecord: ProductionRecord = {
        id: (todayRecords.length + 1).toString(),
        module_id: selectedModule,
        module_name: selectedModuleData?.name || '',
        time_slot_id: selectedTimeSlot,
        time_slot_display: `${selectedTimeSlotData?.hora_inicio} - ${selectedTimeSlotData?.hora_fin}`,
        reference_id: selectedReference,
        reference_name: selectedReferenceData?.name || '',
        person_entries: validEntries,
        total_minutes: calculateTotalMinutes(),
        notes: generalNotes,
        logged_by: 'supervisor@textile.com',
        logged_at: new Date().toISOString()
      };

      console.log('Production record submitted:', newRecord);

      setTodayRecords(prev => [...prev, newRecord]);
      setSuccessMessage('Production minutes logged successfully!');

      // Reset form
      setSelectedModule('');
      setSelectedReference('');
      setSelectedTimeSlot('');
      setGeneralNotes('');
      setPersonEntries({});

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClearForm = () => {
    setSelectedModule('');
    setSelectedReference('');
    setSelectedTimeSlot('');
    setGeneralNotes('');
    setPersonEntries({});
    setErrors({});
  };

  const handleDeleteRecord = (recordId: string) => {
    setTodayRecords(prev => prev.filter(record => record.id !== recordId));
  };

  const formatTimeSlotDisplay = (timeSlot: TimeSlot) => {
    return `${timeSlot.hora_inicio} - ${timeSlot.hora_fin}`;
  };

  const getPersonName = (personId: string): string => {
    const person = tenantPeople.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  const getPersonCode = (personId: string): string => {
    const person = tenantPeople.find(p => p.id === personId);
    return person ? person.code : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-xl">
          <TabsTrigger value="logging" className="flex items-center gap-2 rounded-lg transition-gentle data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <ClipboardList className="w-4 h-4" />
            Log Production Minutes
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2 rounded-lg transition-gentle data-[state=active]:bg-white data-[state=active]:shadow-soft">
            <History className="w-4 h-4" />
            Today's Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logging" className="space-y-8">
          <Card className="shadow-soft-lg border-0 bg-gradient-to-br from-white to-slate-50/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                Production Minute Logging
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed">
                Let's capture the exact minutes each worker produced during this time slot. This helps us understand performance patterns and support our team better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {successMessage && (
                <Alert className="mb-8 border-0 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-soft rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <AlertDescription className="text-emerald-800 font-medium">
                      {successMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Selectors */}
                <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/50">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Select Your Context
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="module" className="text-sm font-medium text-foreground">Which module are you working with? *</Label>
                      <Select value={selectedModule} onValueChange={setSelectedModule}>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-border/40 hover:border-primary/30 transition-gentle focus:border-primary shadow-soft">
                          <SelectValue placeholder="Choose your module" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-soft-lg">
                          {tenantModules.map((module) => (
                            <SelectItem key={module.id} value={module.id} className="rounded-lg m-1 transition-gentle">
                              <div className="py-1">
                                <div className="font-medium text-foreground">{module.name}</div>
                                <div className="text-sm text-muted-foreground">{module.code}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.module && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-destructive"></div>
                          {errors.module}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="reference" className="text-sm font-medium text-foreground">What product are you working on? *</Label>
                      <Select value={selectedReference} onValueChange={setSelectedReference}>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-border/40 hover:border-primary/30 transition-gentle focus:border-primary shadow-soft">
                          <SelectValue placeholder="Choose your product" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-soft-lg">
                          {tenantReferences.map((reference) => (
                            <SelectItem key={reference.id} value={reference.id} className="rounded-lg m-1 transition-gentle">
                              <div className="py-1">
                                <div className="font-medium text-foreground">{reference.name}</div>
                                <div className="text-sm text-muted-foreground">{reference.code}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.reference && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-destructive"></div>
                          {errors.reference}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="time-slot" className="text-sm font-medium text-foreground">Which time slot? *</Label>
                      <Select
                        value={selectedTimeSlot}
                        onValueChange={setSelectedTimeSlot}
                        disabled={!selectedModule}
                      >
                        <SelectTrigger className={`h-12 rounded-xl border-2 transition-gentle shadow-soft ${!selectedModule
                          ? "border-border/20 bg-muted/30 cursor-not-allowed"
                          : "border-border/40 hover:border-primary/30 focus:border-primary"
                          }`}>
                          <SelectValue placeholder={selectedModule ? "Choose time slot" : "Select module first"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-soft-lg">
                          {availableTimeSlots.length === 0 && selectedModule ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                              No active time slots available for this module
                            </div>
                          ) : (
                            availableTimeSlots.map((timeSlot) => (
                              <SelectItem key={timeSlot.id} value={timeSlot.id} className="rounded-lg m-1 transition-gentle">
                                <div className="flex items-center gap-3 py-1">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{formatTimeSlotDisplay(timeSlot)}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.timeSlot && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-destructive"></div>
                          {errors.timeSlot}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* People Table */}
                {modulePeople.length > 0 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50/30 rounded-xl border border-emerald-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-lg font-medium text-foreground flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <Users className="w-4 h-4 text-emerald-600" />
                            </div>
                            Team Members
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">Enter the minutes each person worked during this time slot</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/60 px-3 py-2 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          {modulePeople.length} team members
                        </div>
                      </div>
                    </div>

                    <div className="border-0 rounded-xl shadow-soft-md overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-0">
                            <TableHead className="py-4 text-foreground font-medium">Team Member</TableHead>
                            <TableHead className="py-4 text-foreground font-medium">ID</TableHead>
                            <TableHead className="w-48 py-4 text-foreground font-medium">Minutes Worked *</TableHead>
                            <TableHead className="py-4 text-foreground font-medium">Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {modulePeople.map((person, index) => (
                            <TableRow key={person.id} className={`transition-gentle hover:bg-accent/30 border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-700">
                                      {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium text-foreground">{person.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <span className="text-muted-foreground bg-muted/40 px-2 py-1 rounded-md text-xs">
                                  {person.code}
                                </span>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="60"
                                    placeholder="Enter minutes..."
                                    value={personEntries[person.id]?.minutes_worked || ''}
                                    onChange={(e) => updatePersonEntry(person.id, 'minutes_worked', parseInt(e.target.value) || 0)}
                                    className="h-10 rounded-lg border-2 border-border/40 hover:border-primary/30 focus:border-primary transition-gentle shadow-soft"
                                  />
                                  {errors[`minutes_${person.id}`] && (
                                    <p className="text-xs text-destructive flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-destructive"></div>
                                      {errors[`minutes_${person.id}`]}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Input
                                  placeholder="Any notes or observations..."
                                  value={personEntries[person.id]?.observations || ''}
                                  onChange={(e) => updatePersonEntry(person.id, 'observations', e.target.value)}
                                  className="h-10 rounded-lg border-2 border-border/40 hover:border-primary/30 focus:border-primary transition-gentle shadow-soft"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {errors.minutes && (
                      <p className="text-sm text-destructive">{errors.minutes}</p>
                    )}
                  </div>
                )}

                {selectedModule && modulePeople.length === 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No active workers assigned to this module. Please assign workers to the module first.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Summary and Notes */}
                {modulePeople.length > 0 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-teal-50/50 rounded-xl border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-lg">Total Production</span>
                            <p className="text-sm text-muted-foreground">Combined team effort</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-primary">
                            {calculateTotalMinutes()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            minutes
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                        Any additional observations? (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Share any insights about this production period that might help the team..."
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        rows={4}
                        className="rounded-xl border-2 border-border/40 hover:border-primary/30 focus:border-primary transition-gentle shadow-soft resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-border/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearForm}
                    className="h-12 px-6 rounded-xl border-2 transition-gentle hover:bg-accent/50"
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={modulePeople.length === 0}
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 shadow-soft-md transition-gentle disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💾 Save Production Log
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Today's Production Records
              </CardTitle>
              <CardDescription>
                Review, edit, or delete production records logged today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No production records logged today</p>
                  <p className="text-sm">Switch to the "Log Production Minutes" tab to start logging</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayRecords.map((record) => (
                    <Card key={record.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{record.module_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {record.time_slot_display} • {record.reference_name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {record.total_minutes} minutes total
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Worker Minutes:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {record.person_entries.map((entry) => (
                                <div key={entry.person_id} className="flex justify-between text-sm p-2 bg-muted rounded">
                                  <span>{getPersonName(entry.person_id)} ({getPersonCode(entry.person_id)})</span>
                                  <span className="font-medium">{entry.minutes_worked} min</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {record.notes && (
                            <div>
                              <h4 className="font-medium mb-1">Notes:</h4>
                              <p className="text-sm text-muted-foreground">{record.notes}</p>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Logged by {record.logged_by} at {new Date(record.logged_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}