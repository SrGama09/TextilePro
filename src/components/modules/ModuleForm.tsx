import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

interface ModuleFormProps {
  module?: Module;
  onSubmit: (moduleData: Omit<Module, 'id' | 'assignedPeople' | 'currentReference' | 'efficiency' | 'lastActivity'>) => void;
  onCancel: () => void;
}

export function ModuleForm({ module, onSubmit, onCancel }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    name: module?.name || "",
    code: module?.code || "",
    status: (module?.status || "Inactive") as 'Active' | 'Inactive' | 'Maintenance'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the form data to the parent
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Module Name</Label>
        <Input
          id="name"
          placeholder="Enter module name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Module Code</Label>
        <Input
          id="code"
          placeholder="e.g., MOD-001"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {module ? "Update Module" : "Create Module"}
        </Button>
      </div>
    </form>
  );
}