import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

interface PersonFormProps {
  person?: Person;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PersonForm({ person, onSubmit, onCancel }: PersonFormProps) {
  const [formData, setFormData] = useState({
    name: person?.name || "",
    code: person?.code || "",
    status: person?.status || "Active",
    department: person?.department || "Production",
    dailyMinutes: person?.dailyMinutes?.toString() || "480",
    joinDate: person?.joinDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Form submitted:", formData);
    onSubmit();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Employee Code</Label>
        <Input
          id="code"
          placeholder="e.g., EMP-001"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => handleChange("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Quality Control">Quality Control</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyMinutes">Daily Minutes</Label>
          <Input
            id="dailyMinutes"
            type="number"
            placeholder="480"
            value={formData.dailyMinutes}
            onChange={(e) => handleChange("dailyMinutes", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="joinDate">Join Date</Label>
          <Input
            id="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange("joinDate", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {person ? "Update Person" : "Add Person"}
        </Button>
      </div>
    </form>
  );
}