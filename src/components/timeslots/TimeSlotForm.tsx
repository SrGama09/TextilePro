import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import type { TimeSlot, Module } from "./TimeSlotManagement";

interface TimeSlotFormProps {
  modules: Module[];
  timeSlot?: TimeSlot | null;
  onSubmit: (timeSlot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export function TimeSlotForm({ modules, timeSlot, onSubmit, onCancel }: TimeSlotFormProps) {
  const [formData, setFormData] = useState({
    modulo_id: '',
    hora_inicio: '',
    hora_fin: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing data when editing
  useEffect(() => {
    if (timeSlot) {
      setFormData({
        modulo_id: timeSlot.modulo_id,
        hora_inicio: timeSlot.hora_inicio,
        hora_fin: timeSlot.hora_fin,
        status: timeSlot.status
      });
    } else {
      setFormData({
        modulo_id: '',
        hora_inicio: '',
        hora_fin: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [timeSlot]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate module selection
    if (!formData.modulo_id) {
      newErrors.modulo_id = 'Please select a module';
    }

    // Validate start time
    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'Start time is required';
    }

    // Validate end time
    if (!formData.hora_fin) {
      newErrors.hora_fin = 'End time is required';
    }

    // Validate that end time is after start time
    if (formData.hora_inicio && formData.hora_fin) {
      const startTime = new Date(`2000-01-01T${formData.hora_inicio}:00`);
      const endTime = new Date(`2000-01-01T${formData.hora_fin}:00`);
      
      if (endTime <= startTime) {
        newErrors.hora_fin = 'End time must be after start time';
      }

      // Check for reasonable duration (at least 15 minutes, max 8 hours)
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      if (duration < 15) {
        newErrors.hora_fin = 'Time slot must be at least 15 minutes long';
      } else if (duration > 480) {
        newErrors.hora_fin = 'Time slot cannot exceed 8 hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        modulo_id: formData.modulo_id,
        modulo_name: '', // This will be set in the parent component
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        status: formData.status
      });
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const getDurationText = () => {
    if (formData.hora_inicio && formData.hora_fin) {
      const startTime = new Date(`2000-01-01T${formData.hora_inicio}:00`);
      const endTime = new Date(`2000-01-01T${formData.hora_fin}:00`);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      if (duration > 0) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        if (hours > 0 && minutes > 0) {
          return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${minutes}m`;
        }
      }
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Module Selection */}
      <div className="space-y-2">
        <Label htmlFor="module">Module *</Label>
        <Select 
          value={formData.modulo_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, modulo_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id}>
                <div>
                  <div className="font-medium">{module.name}</div>
                  <div className="text-sm text-muted-foreground">{module.code}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.modulo_id && (
          <p className="text-sm text-destructive">{errors.modulo_id}</p>
        )}
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time *</Label>
          <Select 
            value={formData.hora_inicio} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, hora_inicio: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.hora_inicio && (
            <p className="text-sm text-destructive">{errors.hora_inicio}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-time">End Time *</Label>
          <Select 
            value={formData.hora_fin} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, hora_fin: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.hora_fin && (
            <p className="text-sm text-destructive">{errors.hora_fin}</p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {getDurationText() && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm">
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium">{getDurationText()}</span>
          </div>
        </div>
      )}

      {/* Status Toggle */}
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
            }
          />
          <Label className="text-sm">
            {formData.status === 'active' ? 'Active' : 'Inactive'}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          {formData.status === 'active' 
            ? 'This time slot will be available for production logging'
            : 'This time slot will not be available for production logging'
          }
        </p>
      </div>

      {/* Validation Alert */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors above before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {timeSlot ? 'Update Time Slot' : 'Create Time Slot'}
        </Button>
      </div>
    </form>
  );
}