import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, X } from "lucide-react";

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

interface Size {
  name: string;
  quantity: number;
}

interface ReferenceFormProps {
  reference?: Reference;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ReferenceForm({ reference, onSubmit, onCancel }: ReferenceFormProps) {
  const [formData, setFormData] = useState({
    code: reference?.code || "",
    description: reference?.description || "",
    lot: reference?.lot || "",
    status: reference?.status || "Pendiente",
    priority: reference?.priority || "Medium",
    minutesPerUnit: reference?.minutesPerUnit?.toString() || "",
    estimatedCompletion: reference?.estimatedCompletion || ""
  });

  const [sizes, setSizes] = useState<Size[]>([
    { name: "S", quantity: 0 },
    { name: "M", quantity: 0 },
    { name: "L", quantity: 0 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Form submitted:", { formData, sizes });
    onSubmit();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSize = () => {
    setSizes(prev => [...prev, { name: "", quantity: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: keyof Size, value: string | number) => {
    setSizes(prev => prev.map((size, i) => 
      i === index ? { ...size, [field]: value } : size
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Reference Code</Label>
          <Input
            id="code"
            placeholder="e.g., REF-001"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lot">Lot Number</Label>
          <Input
            id="lot"
            placeholder="e.g., LOT-2024-001"
            value={formData.lot}
            onChange={(e) => handleChange("lot", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter detailed description of the reference"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En proceso">En proceso</SelectItem>
              <SelectItem value="Terminado">Terminado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minutesPerUnit">Minutes per Unit</Label>
          <Input
            id="minutesPerUnit"
            type="number"
            step="0.1"
            placeholder="4.2"
            value={formData.minutesPerUnit}
            onChange={(e) => handleChange("minutesPerUnit", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedCompletion">Estimated Completion Date</Label>
        <Input
          id="estimatedCompletion"
          type="date"
          value={formData.estimatedCompletion}
          onChange={(e) => handleChange("estimatedCompletion", e.target.value)}
          required
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sizes & Quantities</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addSize}>
              <Plus className="w-4 h-4 mr-1" />
              Add Size
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Size name (e.g., S, M, L)"
                  value={size.name}
                  onChange={(e) => updateSize(index, "name", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={size.quantity}
                  onChange={(e) => updateSize(index, "quantity", parseInt(e.target.value) || 0)}
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeSize(index)}
                disabled={sizes.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {sizes.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No sizes added yet. Click "Add Size" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {reference ? "Update Reference" : "Create Reference"}
        </Button>
      </div>
    </form>
  );
}