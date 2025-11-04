import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

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

interface DynamicFieldsRendererProps {
  fields: DynamicField[];
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  errors?: Record<string, string>;
}

export function DynamicFieldsRenderer({ 
  fields, 
  values, 
  onChange, 
  errors = {} 
}: DynamicFieldsRendererProps) {
  const renderField = (field: DynamicField) => {
    const fieldId = field.id;
    const value = values[fieldId] || '';
    const error = errors[fieldId];

    const baseProps = {
      id: fieldId,
      value,
      onChange: (e: any) => onChange(fieldId, e.target.value),
      className: error ? 'border-red-500' : ''
    };

    switch (field.fieldType) {
      case 'text':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.fieldLabel} {field.isRequired && '*'}
            </Label>
            <Input
              {...baseProps}
              type="text"
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.fieldLabel} {field.isRequired && '*'}
            </Label>
            <Input
              {...baseProps}
              type="email"
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.fieldLabel} {field.isRequired && '*'}
            </Label>
            <Input
              {...baseProps}
              type="number"
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.fieldLabel} {field.isRequired && '*'}
            </Label>
            <Textarea
              {...baseProps}
              rows={3}
              placeholder={`Enter ${field.fieldLabel.toLowerCase()}...`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.fieldLabel} {field.isRequired && '*'}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => onChange(fieldId, newValue)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${field.fieldLabel.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {field.fieldOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldId} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldId}
                checked={value === 'true'}
                onCheckedChange={(checked) => onChange(fieldId, checked ? 'true' : 'false')}
              />
              <Label htmlFor={fieldId} className="cursor-pointer">
                {field.fieldLabel} {field.isRequired && '*'}
              </Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  // Sort fields by display order
  const sortedFields = [...fields].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-4">
      {sortedFields.map(renderField)}
    </div>
  );
}

// Hook for managing dynamic field values
export function useDynamicFields(fields: DynamicField[]) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize values from field data
  React.useEffect(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach(field => {
      if (field.fieldValue) {
        initialValues[field.id] = field.fieldValue;
      }
    });
    setValues(initialValues);
  }, [fields]);

  const updateValue = (fieldId: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.isRequired && (!values[field.id] || values[field.id].trim() === '')) {
        newErrors[field.id] = `${field.fieldLabel} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getFieldValues = () => {
    return fields.map(field => ({
      fieldId: field.id,
      fieldValue: values[field.id] || ''
    }));
  };

  return {
    values,
    errors,
    updateValue,
    validateFields,
    getFieldValues
  };
}
