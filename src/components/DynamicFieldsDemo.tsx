import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, Settings } from 'lucide-react';

export function DynamicFieldsDemo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          How to Add Custom Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Step-by-Step Guide:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Scroll down to the "Custom Fields" section</li>
            <li>Click the "Manage Fields" button</li>
            <li>Click "Add Custom Field" to create a new field</li>
            <li>Choose field type: Text, Email, Number, Textarea, Dropdown, or Checkbox</li>
            <li>Set the field label (e.g., "Special Equipment")</li>
            <li>For dropdown fields, add your options</li>
            <li>Mark fields as required if needed</li>
            <li>Click "Add Field" to save</li>
            <li>Click "Hide Manager" to return to the form</li>
            <li>Fill in your custom fields and submit registration</li>
          </ol>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Field Types Available:</h3>
          <div className="grid grid-cols-2 gap-2 text-green-800">
            <div>• Text Input</div>
            <div>• Email Field</div>
            <div>• Number Field</div>
            <div>• Text Area</div>
            <div>• Dropdown/Select</div>
            <div>• Checkbox</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Examples:</h3>
          <div className="text-yellow-800 space-y-1">
            <p><strong>Photography:</strong> "Camera Equipment", "Photo Style", "Delivery Time"</p>
            <p><strong>Catering:</strong> "Menu Options", "Dietary Restrictions", "Serving Style"</p>
            <p><strong>Venue:</strong> "Capacity", "Amenities", "Parking Available"</p>
            <p><strong>Music:</strong> "Music Genre", "Equipment Provided", "Performance Duration"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
