import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  GripVertical,
  Type,
  Mail,
  Hash,
  List,
  CheckSquare,
  AlignLeft,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DynamicField {
  id: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldOptions: string[];
  fieldValue?: string;
  isRequired: boolean;
  displayOrder: number;
}

const fieldTypeIcons = {
  text: Type,
  email: Mail,
  number: Hash,
  select: List,
  checkbox: CheckSquare,
  textarea: AlignLeft
};

const fieldTypeLabels = {
  text: 'Text Input',
  email: 'Email',
  number: 'Number',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  textarea: 'Text Area'
};

interface PackageCustomFieldsDialogProps {
  packageId: string;
  packageName: string;
  onFieldsChange: (fields: DynamicField[]) => void;
  children?: React.ReactNode; // Make children optional
}

export function PackageCustomFieldsDialog({ 
  packageId, 
  packageName, 
  onFieldsChange, 
  children 
}: PackageCustomFieldsDialogProps) {
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<DynamicField>>({
    fieldLabel: '',
    fieldType: 'text',
    fieldOptions: [],
    isRequired: false
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('Dialog opened for packageId:', packageId);
      fetchFields();
    }
  }, [open]);

  const fetchFields = async () => {
    try {
      console.log('Fetching fields for packageId:', packageId);
      const response = await fetch(`http://localhost:5000/api/vendor/packages/${packageId}/fields`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('Fetch fields response:', data);

      if (data.success) {
        setFields(data.data);
        onFieldsChange(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch fields');
      }
    } catch (err) {
      console.error('Fetch fields error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addField = async () => {
    console.log('Add Field clicked, newField:', newField);
    console.log('PackageId:', packageId);
    console.log('Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    
    if (!newField.fieldLabel?.trim()) {
      toast.error('Field label is required');
      return;
    }

    try {
      console.log('Sending request to:', `/api/vendor/packages/${packageId}/fields`);
      console.log('Request payload:', newField);
      
      const response = await fetch(`http://localhost:5000/api/vendor/packages/${packageId}/fields`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newField)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast.success('Field added successfully');
        setNewField({
          fieldLabel: '',
          fieldType: 'text',
          fieldOptions: [],
          isRequired: false
        });
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to add field');
      }
    } catch (err) {
      console.error('Add field error:', err);
      toast.error('Network error. Please try again.');
    }
  };

  const updateField = async (fieldId: string, updates: Partial<DynamicField>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vendor/packages/fields/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field updated successfully');
        setEditingField(null);
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to update field');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const deleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/vendor/packages/fields/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Field deleted successfully');
        fetchFields();
      } else {
        toast.error(data.error || 'Failed to delete field');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  const addOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.fieldOptions, ''];
      updateField(fieldId, { fieldOptions: newOptions });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...field.fieldOptions];
      newOptions[optionIndex] = value;
      updateField(fieldId, { fieldOptions: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.fieldOptions.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { fieldOptions: newOptions });
    }
  };

  const renderFieldInput = (field: DynamicField) => {
    if (editingField !== field.id) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.fieldLabel}</Label>
          {field.fieldType === 'textarea' ? (
            <Textarea 
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
              rows={3}
              disabled
            />
          ) : field.fieldType === 'select' ? (
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.fieldLabel.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {field.fieldOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.fieldType === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox disabled />
              <Label className="text-sm">{field.fieldLabel}</Label>
            </div>
          ) : (
            <Input 
              type={field.fieldType === 'number' ? 'number' : field.fieldType}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
              disabled
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Field Label</Label>
            <Input
              value={field.fieldLabel}
              onChange={(e) => updateField(field.id, { fieldLabel: e.target.value })}
              placeholder="e.g., Special Equipment"
            />
          </div>
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select
              value={field.fieldType}
              onValueChange={(value) => updateField(field.id, { fieldType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(fieldTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {field.fieldType === 'select' && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {field.fieldOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(field.id, index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(field.id, index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(field.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={field.isRequired}
            onCheckedChange={(checked) => updateField(field.id, { isRequired: checked as boolean })}
          />
          <Label>Required field</Label>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Custom Fields for "{packageName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Add New Field */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Custom Field
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input
                    value={newField.fieldLabel}
                    onChange={(e) => setNewField({ ...newField, fieldLabel: e.target.value })}
                    placeholder="e.g., Special Equipment"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={newField.fieldType}
                    onValueChange={(value) => setNewField({ ...newField, fieldType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fieldTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newField.fieldType === 'select' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {newField.fieldOptions?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(newField.fieldOptions || [])];
                            newOptions[index] = e.target.value;
                            setNewField({ ...newField, fieldOptions: newOptions });
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = newField.fieldOptions?.filter((_, i) => i !== index) || [];
                            setNewField({ ...newField, fieldOptions: newOptions });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(newField.fieldOptions || []), ''];
                        setNewField({ ...newField, fieldOptions: newOptions });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newField.isRequired}
                  onCheckedChange={(checked) => setNewField({ ...newField, isRequired: checked as boolean })}
                />
                <Label>Required field</Label>
              </div>

              <Button onClick={addField} className="gradient-maroon">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          {/* Existing Fields */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Custom Fields ({fields.length})</h3>
            {loading ? (
              <div className="text-center py-8">Loading fields...</div>
            ) : fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No custom fields added yet.</p>
                <p className="text-sm">Add your first field above.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {fields.map((field) => {
                  const IconComponent = fieldTypeIcons[field.fieldType as keyof typeof fieldTypeIcons];
                  return (
                    <div key={field.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                          <div>
                            <h4 className="font-medium">{field.fieldLabel}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {fieldTypeLabels[field.fieldType as keyof typeof fieldTypeLabels]}
                              </Badge>
                              {field.isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteField(field.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {renderFieldInput(field)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
