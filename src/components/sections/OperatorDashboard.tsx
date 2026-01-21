import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { 
  Clock, 
  Save, 
  CheckCircle, 
  Edit3, 
  Target,
  User,
  Package
} from "lucide-react";
import type { User } from "../../hooks/useAuth";

interface OperatorDashboardProps {
  user?: User | null;
}

interface ProductionLog {
  id: string;
  time: string;
  reference: string;
  minutes: number;
  timestamp: Date;
}

// Mock data for demonstration
const mockModule = {
  id: "M-001",
  name: "Assembly Line A",
  description: "Main production assembly line"
};

const mockReferences = [
  { id: "REF-001", name: "Blue Cotton Shirt - Size M", code: "BCS-M" },
  { id: "REF-002", name: "White Cotton Shirt - Size L", code: "WCS-L" },
  { id: "REF-003", name: "Navy Cotton Pants - Size 32", code: "NCP-32" },
  { id: "REF-004", name: "Black Cotton Pants - Size 34", code: "BCP-34" }
];

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00", 
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00"
];

export function OperatorDashboard({ user }: OperatorDashboardProps) {
  const [selectedReference, setSelectedReference] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [minutesProduced, setMinutesProduced] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  
  // Mock production logs for today
  const [todayLogs, setTodayLogs] = useState<ProductionLog[]>([
    {
      id: "1",
      time: "08:00 - 09:00",
      reference: "BCS-M",
      minutes: 45,
      timestamp: new Date()
    },
    {
      id: "2", 
      time: "09:00 - 10:00",
      reference: "BCS-M",
      minutes: 52,
      timestamp: new Date()
    }
  ]);

  const totalMinutesToday = todayLogs.reduce((total, log) => total + log.minutes, 0);

  const handleSubmit = async () => {
    if (!selectedReference || !selectedTimeSlot || !minutesProduced) {
      toast.error("Please fill in all fields to save your production log");
      return;
    }

    const minutes = parseInt(minutesProduced);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error("Please enter a valid number of minutes");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingLogId) {
        // Update existing log
        setTodayLogs(logs => 
          logs.map(log => 
            log.id === editingLogId 
              ? { ...log, time: selectedTimeSlot, reference: selectedReference, minutes }
              : log
          )
        );
        toast.success("Your production log has been updated successfully!");
        setEditingLogId(null);
      } else {
        // Add new log
        const newLog: ProductionLog = {
          id: Date.now().toString(),
          time: selectedTimeSlot,
          reference: selectedReference,
          minutes,
          timestamp: new Date()
        };
        setTodayLogs(logs => [...logs, newLog]);
        toast.success("Your production has been logged successfully!");
      }

      // Reset form
      setSelectedReference("");
      setSelectedTimeSlot("");
      setMinutesProduced("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLog = (log: ProductionLog) => {
    setSelectedReference(log.reference);
    setSelectedTimeSlot(log.time);
    setMinutesProduced(log.minutes.toString());
    setEditingLogId(log.id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setSelectedReference("");
    setSelectedTimeSlot("");
    setMinutesProduced("");
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8 min-h-screen">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-medium text-foreground">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4 text-lg text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Working on: <span className="font-medium">{mockModule.name}</span></span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <span>Tuesday, September 16, 2025</span>
        </div>
      </div>

      {/* Production Logging Form */}
      <Card className="shadow-soft-lg border-0 bg-gradient-to-br from-white to-primary/5">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Clock className="h-6 w-6 text-primary" />
            {editingLogId ? "Update My Production" : "Log My Production"}
          </CardTitle>
          <CardDescription className="text-lg">
            {editingLogId 
              ? "Make changes to your production entry below" 
              : "Record the minutes you've produced for a specific time period"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {editingLogId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800">
                <Edit3 className="h-4 w-4" />
                <span>You're editing an existing entry</span>
              </div>
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel Edit
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reference Selector */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">What are you making?</Label>
              <Select value={selectedReference} onValueChange={setSelectedReference}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Choose product..." />
                </SelectTrigger>
                <SelectContent>
                  {mockReferences.map((ref) => (
                    <SelectItem key={ref.id} value={ref.code} className="p-4">
                      <div>
                        <div className="font-medium">{ref.code}</div>
                        <div className="text-sm text-muted-foreground">{ref.name}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Which hour?</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Select time..." />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot} className="p-4 text-lg">
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minutes Input */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Minutes produced</Label>
              <Input
                type="number"
                placeholder="Enter minutes..."
                value={minutesProduced}
                onChange={(e) => setMinutesProduced(e.target.value)}
                className="h-14 text-lg text-center"
                min="0"
                max="60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="h-16 px-12 text-lg gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editingLogId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {editingLogId ? "Update My Entry" : "Save My Minutes"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Performance */}
      <Card className="shadow-soft-md border-0 bg-gradient-to-br from-white to-emerald-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="h-5 w-5 text-emerald-600" />
            My Performance Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-semibold text-emerald-600 mb-2">
              {totalMinutesToday}
            </div>
            <p className="text-lg text-muted-foreground">Total minutes logged today</p>
            <Badge className="mt-3 px-4 py-2 text-sm" variant={totalMinutesToday >= 300 ? "default" : "secondary"}>
              {totalMinutesToday >= 300 ? "🎯 Great work!" : "💪 Keep going!"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* My Logs for Today */}
      <Card className="shadow-soft-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            My Logs for Today
          </CardTitle>
          <CardDescription>
            Here are all the entries you've logged today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No entries logged yet today</p>
              <p>Use the form above to record your first production entry</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {todayLogs
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-gentle"
                    >
                      <div className="grid grid-cols-3 gap-6 flex-1">
                        <div>
                          <div className="font-medium">{log.time}</div>
                          <div className="text-sm text-muted-foreground">Time Period</div>
                        </div>
                        <div>
                          <div className="font-medium">{log.reference}</div>
                          <div className="text-sm text-muted-foreground">Product Code</div>
                        </div>
                        <div>
                          <div className="font-medium text-emerald-600">{log.minutes} min</div>
                          <div className="text-sm text-muted-foreground">Production Time</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLog(log)}
                        className="gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </main>
  );
}