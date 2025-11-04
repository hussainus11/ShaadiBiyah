import React, { useState, useEffect } from 'react';
import { Building2, Upload, MapPin, Save, Image as ImageIcon, Plus, Trash2, Crown, Camera, Car, Utensils, Palette, Cake, Music, Shirt, Users, Clock, Star, Phone, Mail, Globe, Calendar, Shield, Award, CheckCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { CurrencyIcon } from './ui/currency-icon';
import { useCountry } from '../contexts/CountryContext';
import { VendorVerificationStatus } from './VendorVerificationStatus';
import { DynamicFieldsManager } from './DynamicFieldsManager';
import { DynamicFieldsRenderer, useDynamicFields } from './DynamicFieldsRenderer';
import { PackageCustomFieldsDialog } from './PackageCustomFieldsDialog';
import { toast } from 'react-hot-toast';

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[]; // Array of image URLs/base64 strings
  additionalFields?: Record<string, any>;
  dynamicFields?: any[]; // Dynamic fields for this package
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description?: string;
}

interface CategoryConfig {
  icon: any;
  color: string;
  specificFields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }[];
  packageFields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select';
    placeholder?: string;
    options?: string[];
  }[];
}

const categoryConfigs: Record<string, CategoryConfig> = {
  hall: {
    icon: Building2,
    color: 'gradient-gold',
    specificFields: [
      { name: 'capacity', label: 'Maximum Capacity', type: 'number', placeholder: 'e.g., 500', required: true },
      { name: 'parking', label: 'Parking Spaces', type: 'number', placeholder: 'e.g., 50' },
      { name: 'acFacility', label: 'AC Facility', type: 'checkbox' },
      { name: 'cateringIncluded', label: 'Catering Included', type: 'checkbox' },
      { name: 'decorationIncluded', label: 'Decoration Included', type: 'checkbox' },
      { name: 'soundSystem', label: 'Sound System Available', type: 'checkbox' },
      { name: 'stageSize', label: 'Stage Size (ft)', type: 'text', placeholder: 'e.g., 20x15' },
      { name: 'ambiance', label: 'Ambiance Type', type: 'select', options: ['Traditional', 'Modern', 'Royal', 'Garden', 'Beach'] },
      { name: 'hasMenu', label: 'Provide Menu Services', type: 'checkbox' }
    ],
    packageFields: [
      { name: 'name', label: 'Package Name', type: 'text', placeholder: 'e.g., Basic Package' },
      { name: 'description', label: 'What\'s Included', type: 'textarea', placeholder: 'List all inclusions...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 50000' },
      { name: 'duration', label: 'Duration', type: 'select', options: ['Half Day', 'Full Day', '2 Days', '3 Days'] }
    ]
  },
  car: {
    icon: Car,
    color: 'gradient-maroon',
    specificFields: [
      { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Sedan', 'SUV', 'Luxury Car', 'Convertible', 'Vintage Car'], required: true },
      { name: 'vehicleBrand', label: 'Vehicle Brand', type: 'text', placeholder: 'e.g., BMW, Mercedes, Audi' },
      { name: 'seatingCapacity', label: 'Seating Capacity', type: 'number', placeholder: 'e.g., 4' },
      { name: 'driverIncluded', label: 'Driver Included', type: 'checkbox' },
      { name: 'fuelIncluded', label: 'Fuel Included', type: 'checkbox' },
      { name: 'decorationIncluded', label: 'Vehicle Decoration Included', type: 'checkbox' },
      { name: 'insurance', label: 'Insurance Coverage', type: 'checkbox' },
      { name: 'serviceAreas', label: 'Service Areas', type: 'text', placeholder: 'e.g., Delhi, NCR, Gurgaon' }
    ],
    packageFields: [
      { name: 'name', label: 'Service Package', type: 'text', placeholder: 'e.g., Wedding Day Service' },
      { name: 'description', label: 'Service Details', type: 'textarea', placeholder: 'Include pickup, ceremony, reception details...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 15000' },
      { name: 'duration', label: 'Service Duration', type: 'select', options: ['4 Hours', '6 Hours', '8 Hours', 'Full Day', '2 Days'] }
    ]
  },
  photographer: {
    icon: Camera,
    color: 'gradient-pink',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 5', required: true },
      { name: 'specialization', label: 'Specialization', type: 'select', options: ['Traditional', 'Candid', 'Fashion', 'Cinematic', 'All Types'] },
      { name: 'teamSize', label: 'Team Size', type: 'number', placeholder: 'e.g., 3' },
      { name: 'equipment', label: 'Equipment Included', type: 'textarea', placeholder: 'List cameras, lenses, lighting...' },
      { name: 'editing', label: 'Photo/Video Editing Included', type: 'checkbox' },
      { name: 'albumIncluded', label: 'Wedding Album Included', type: 'checkbox' },
      { name: 'rawFiles', label: 'Raw Files Being Provided', type: 'checkbox' },
      { name: 'deliveryTime', label: 'Delivery Time', type: 'text', placeholder: 'e.g., 30 days' }
    ],
    packageFields: [
      { name: 'name', label: 'Photography Package', type: 'text', placeholder: 'e.g., Premium Photography' },
      { name: 'description', label: 'Package Details', type: 'textarea', placeholder: 'Include coverage hours, locations, deliverables...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 25000' },
      { name: 'coverage', label: 'Coverage', type: 'select', options: ['Pre-wedding Only', 'Wedding Day Only', 'Both Pre-wedding & Wedding', 'Full Package'] }
    ]
  },
  caterer: {
    icon: Utensils,
    color: 'gradient-gold',
    specificFields: [
      { name: 'cuisine', label: 'Cuisine Type', type: 'select', options: ['North Indian', 'South Indian', 'Gujarati', 'Punjabi', 'Rajasthani', 'Multi-cuisine'], required: true },
      { name: 'maxCapacity', label: 'Maximum Capacity', type: 'number', placeholder: 'e.g., 500' },
      { name: 'vegNonVeg', label: 'Vegetarian/Non-Vegetarian', type: 'select', options: ['Pure Veg', 'Non-Veg', 'Both'] },
      { name: 'tandoorAvailable', label: 'Tandoor Available', type: 'checkbox' },
      { name: 'liveCooking', label: 'Live Cooking Stations', type: 'checkbox' },
      { name: 'servingStaff', label: 'Serving Staff Included', type: 'checkbox' },
      { name: 'cutleryIncluded', label: 'Cutlery & Crockery Included', type: 'checkbox' },
      { name: 'setupTime', label: 'Setup Time Required', type: 'text', placeholder: 'e.g., 2 hours' }
    ],
    packageFields: [
      { name: 'name', label: 'Catering Package', type: 'text', placeholder: 'e.g., Royal Feast Package' },
      { name: 'description', label: 'Menu Details', type: 'textarea', placeholder: 'List all dishes, appetizers, desserts...' },
      { name: 'price', label: 'Price per Plate (Rs.)', type: 'number', placeholder: 'e.g., 800' },
      { name: 'mealType', label: 'Meal Type', type: 'select', options: ['Lunch Only', 'Dinner Only', 'Both Lunch & Dinner', 'Snacks Only', 'Full Day'] }
    ]
  },
  makeup: {
    icon: Palette,
    color: 'gradient-pink',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 7', required: true },
      { name: 'specialization', label: 'Specialization', type: 'select', options: ['Bridal Makeup', 'Groom Makeup', 'Both', 'Traditional', 'Contemporary'] },
      { name: 'teamSize', label: 'Team Size', type: 'number', placeholder: 'e.g., 2' },
      { name: 'products', label: 'Product Brands Used', type: 'text', placeholder: 'e.g., MAC, Maybelline, Lakme' },
      { name: 'trialIncluded', label: 'Trial Makeup Included', type: 'checkbox' },
      { name: 'hairStyling', label: 'Hair Styling Included', type: 'checkbox' },
      { name: 'mehendi', label: 'Mehendi Services', type: 'checkbox' },
      { name: 'travelService', label: 'Home/Venue Service', type: 'checkbox' }
    ],
    packageFields: [
      { name: 'name', label: 'Makeup Package', type: 'text', placeholder: 'e.g., Bridal Makeup Package' },
      { name: 'description', label: 'Services Included', type: 'textarea', placeholder: 'List all services like makeup, hair, accessories...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 12000' },
      { name: 'duration', label: 'Service Duration', type: 'select', options: ['2 Hours', '4 Hours', '6 Hours', 'Full Day', 'Multiple Days'] }
    ]
  },
  decorator: {
    icon: Palette,
    color: 'gradient-gold',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 8', required: true },
      { name: 'theme', label: 'Decoration Themes', type: 'select', options: ['Traditional', 'Modern', 'Royal', 'Garden', 'Rustic', 'Vintage', 'All Themes'] },
      { name: 'teamSize', label: 'Team Size', type: 'number', placeholder: 'e.g., 5' },
      { name: 'materials', label: 'Materials Provided', type: 'textarea', placeholder: 'List flowers, lights, fabrics, props...' },
      { name: 'setupTime', label: 'Setup Time Required', type: 'text', placeholder: 'e.g., 4 hours' },
      { name: 'cleanupIncluded', label: 'Cleanup Service Included', type: 'checkbox' },
      { name: 'freshFlowers', label: 'Fresh Flowers Used', type: 'checkbox' },
      { name: 'ledLights', label: 'LED Lights Available', type: 'checkbox' }
    ],
    packageFields: [
      { name: 'name', label: 'Decoration Package', type: 'text', placeholder: 'e.g., Royal Decoration Package' },
      { name: 'description', label: 'Decoration Details', type: 'textarea', placeholder: 'Describe stage, entrance, seating, lighting...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 35000' },
      { name: 'areas', label: 'Decoration Areas', type: 'select', options: ['Stage Only', 'Entrance Only', 'Full Venue', 'Stage + Entrance', 'Complete Setup'] }
    ]
  },
  sweet: {
    icon: Cake,
    color: 'gradient-pink',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 10', required: true },
      { name: 'specialty', label: 'Sweet Specialty', type: 'select', options: ['Traditional Indian', 'Modern Fusion', 'International', 'Sugar-free', 'All Types'] },
      { name: 'productionCapacity', label: 'Daily Production Capacity (kg)', type: 'number', placeholder: 'e.g., 100' },
      { name: 'ingredients', label: 'Quality of Ingredients', type: 'text', placeholder: 'e.g., Pure ghee, fresh milk, premium dry fruits' },
      { name: 'customization', label: 'Custom Flavors Available', type: 'checkbox' },
      { name: 'packaging', label: 'Premium Packaging Included', type: 'checkbox' },
      { name: 'delivery', label: 'Home Delivery Available', type: 'checkbox' },
      { name: 'shelfLife', label: 'Shelf Life (days)', type: 'number', placeholder: 'e.g., 7' }
    ],
    packageFields: [
      { name: 'name', label: 'Sweet Package', type: 'text', placeholder: 'e.g., Premium Sweet Box' },
      { name: 'description', label: 'Sweet Details', type: 'textarea', placeholder: 'List all sweets, quantities, packaging details...' },
      { name: 'price', label: 'Price per Box (Rs.)', type: 'number', placeholder: 'e.g., 500' },
      { name: 'quantity', label: 'Minimum Order', type: 'select', options: ['50 Boxes', '100 Boxes', '200 Boxes', '500 Boxes', 'Custom'] }
    ]
  },
  dhol: {
    icon: Music,
    color: 'gradient-maroon',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 12', required: true },
      { name: 'bandSize', label: 'Band Size', type: 'number', placeholder: 'e.g., 8' },
      { name: 'instruments', label: 'Instruments', type: 'select', options: ['Dhol Only', 'Dhol + Shehnai', 'Full Band', 'DJ + Live Music'] },
      { name: 'performanceType', label: 'Performance Type', type: 'select', options: ['Traditional', 'Modern', 'Fusion', 'All Styles'] },
      { name: 'costumes', label: 'Traditional Costumes Included', type: 'checkbox' },
      { name: 'soundSystem', label: 'Sound System Provided', type: 'checkbox' },
      { name: 'travelService', label: 'Travel Service Available', type: 'checkbox' },
      { name: 'performanceDuration', label: 'Performance Duration', type: 'text', placeholder: 'e.g., 2 hours' }
    ],
    packageFields: [
      { name: 'name', label: 'Music Package', type: 'text', placeholder: 'e.g., Traditional Dhol Package' },
      { name: 'description', label: 'Performance Details', type: 'textarea', placeholder: 'Include performance locations, duration, special acts...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 20000' },
      { name: 'events', label: 'Events Covered', type: 'select', options: ['Baraat Only', 'Reception Only', 'Both Baraat & Reception', 'Full Wedding', 'Custom'] }
    ]
  },
  clothing: {
    icon: Shirt,
    color: 'gradient-gold',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 15', required: true },
      { name: 'specialization', label: 'Specialization', type: 'select', options: ['Bridal Wear', 'Groom Wear', 'Both', 'Traditional', 'Contemporary', 'Designer'] },
      { name: 'collections', label: 'Number of Collections', type: 'number', placeholder: 'e.g., 50' },
      { name: 'fabricTypes', label: 'Fabric Types Available', type: 'text', placeholder: 'e.g., Silk, Georgette, Chiffon, Velvet' },
      { name: 'customDesign', label: 'Custom Design Service', type: 'checkbox' },
      { name: 'alterationService', label: 'Alteration Service', type: 'checkbox' },
      { name: 'rentalService', label: 'Rental Service Available', type: 'checkbox' },
      { name: 'accessories', label: 'Accessories Included', type: 'checkbox' }
    ],
    packageFields: [
      { name: 'name', label: 'Clothing Package', type: 'text', placeholder: 'e.g., Designer Bridal Package' },
      { name: 'description', label: 'Package Details', type: 'textarea', placeholder: 'Include outfit details, accessories, services...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 45000' },
      { name: 'type', label: 'Package Type', type: 'select', options: ['Purchase', 'Rental', 'Custom Design', 'Complete Wedding Wardrobe'] }
    ]
  },
  horse: {
    icon: Users,
    color: 'gradient-maroon',
    specificFields: [
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 20', required: true },
      { name: 'horsesAvailable', label: 'Number of Horses Available', type: 'number', placeholder: 'e.g., 10' },
      { name: 'horseBreed', label: 'Horse Breed', type: 'text', placeholder: 'e.g., Marwari, Arabian, Local' },
      { name: 'decoration', label: 'Ghodi Decoration Included', type: 'checkbox' },
      { name: 'riderIncluded', label: 'Professional Rider Included', type: 'checkbox' },
      { name: 'insurance', label: 'Insurance Coverage', type: 'checkbox' },
      { name: 'transport', label: 'Transport Service Available', type: 'checkbox' },
      { name: 'serviceAreas', label: 'Service Areas', type: 'text', placeholder: 'e.g., Delhi, NCR, Haryana' }
    ],
    packageFields: [
      { name: 'name', label: 'Horse Rental Package', type: 'text', placeholder: 'e.g., Royal Ghodi Package' },
      { name: 'description', label: 'Service Details', type: 'textarea', placeholder: 'Include horse details, decoration, services...' },
      { name: 'price', label: 'Price (Rs.)', type: 'number', placeholder: 'e.g., 18000' },
      { name: 'duration', label: 'Service Duration', type: 'select', options: ['2 Hours', '4 Hours', '6 Hours', 'Full Day', 'Custom'] }
    ]
  }
};

export function VendorPortal() {
  const { selectedCountry } = useCountry();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    location: '',
    contact: '',
    email: '',
    sponsoredAd: false,
    specificFields: {} as Record<string, any>,
    // Bank Information
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranch: '',
    accountType: 'savings'
  });

  const [packages, setPackages] = useState<Package[]>([
    { id: '1', name: '', description: '', price: '', images: [], dynamicFields: [] }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: '', price: '', category: 'Appetizers', description: '' }
  ]);

  // Verification status
  const [showVerificationStatus, setShowVerificationStatus] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);
  const [showDynamicFieldsManager, setShowDynamicFieldsManager] = useState(false);
  const [packageDynamicFields, setPackageDynamicFields] = useState<Record<string, any[]>>({
    '1': [] // Initialize with the first package
  });
  
  // Dynamic fields hook
  const { values: dynamicFieldValues, updateValue: updateDynamicFieldValue, validateFields: validateDynamicFields, getFieldValues } = useDynamicFields(dynamicFields);

  // Load dynamic fields on component mount
  useEffect(() => {
    const loadDynamicFields = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vendor/fields', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        if (data.success) {
          setDynamicFields(data.data);
        }
      } catch (error) {
        console.error('Failed to load dynamic fields:', error);
      }
    };

    loadDynamicFields();
  }, []);

  // Load package dynamic fields for existing packages
  useEffect(() => {
    const loadPackageFields = async () => {
      for (const pkg of packages) {
        try {
          const response = await fetch(`http://localhost:5000/api/vendor/packages/${pkg.id}/fields`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();

          if (data.success) {
            setPackageDynamicFields(prev => ({ ...prev, [pkg.id]: data.data }));
          }
        } catch (error) {
          console.error(`Failed to load fields for package ${pkg.id}:`, error);
        }
      }
    };

    if (packages.length > 0) {
      loadPackageFields();
    }
  }, [packages.length]); // Only run when number of packages changes

  const addPackage = () => {
    const newPackageId = Date.now().toString();
    setPackages([...packages, {
      id: newPackageId,
      name: '',
      description: '',
      price: '',
      images: [],
      dynamicFields: []
    }]);
    setPackageDynamicFields(prev => ({ ...prev, [newPackageId]: [] }));
  };

  const removePackage = (id: string) => {
    if (packages.length > 1) {
      setPackages(packages.filter(pkg => pkg.id !== id));
      setPackageDynamicFields(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const updatePackage = (id: string, field: keyof Package, value: string) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  const updatePackageField = (id: string, field: string, value: any) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { 
        ...pkg, 
        additionalFields: { 
          ...pkg.additionalFields, 
          [field]: value 
        } 
      } : pkg
    ));
  };

  const handlePackageImageUpload = (packageId: string, files: FileList) => {
    const fileArray = Array.from(files);
    const imagePromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageDataUrls => {
      setPackages(packages.map(pkg =>
        pkg.id === packageId 
          ? { ...pkg, images: [...pkg.images, ...imageDataUrls] }
          : pkg
      ));
    });
  };

  const removePackageImage = (packageId: string, imageIndex: number) => {
    setPackages(packages.map(pkg =>
      pkg.id === packageId 
        ? { ...pkg, images: pkg.images.filter((_, index) => index !== imageIndex) }
        : pkg
    ));
  };

  const updateSpecificField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specificFields: {
        ...prev.specificFields,
        [field]: value
      }
    }));
  };

  const getCurrentCategoryConfig = () => {
    return categoryConfigs[formData.category] || null;
  };

  // Menu management functions
  const addMenuItem = () => {
    setMenuItems([...menuItems, {
      id: Date.now().toString(),
      name: '',
      price: '',
      category: 'Appetizers',
      description: ''
    }]);
  };

  const removeMenuItem = (id: string) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dynamic fields
    if (!validateDynamicFields()) {
      toast.error('Please fill in all required custom fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/vendors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          packages: packages.map(pkg => ({
            ...pkg,
            dynamicFields: packageDynamicFields[pkg.id] || []
          })),
          menuItems: formData.category === 'hall' && formData.specificFields.hasMenu ? menuItems : undefined,
          dynamicFields: getFieldValues()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('🎉 Vendor registration submitted successfully!');
        // Show verification status component
        setShowVerificationStatus(true);
        setVendorId(data.data.id);
      } else {
        toast.error(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  // Show verification status if registration is complete
  if (showVerificationStatus && vendorId) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="mb-4">Registration Complete!</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your vendor registration has been submitted. Please complete the verification process to activate your account.
            </p>
          </div>
          
          <VendorVerificationStatus vendorId={vendorId} />
          
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowVerificationStatus(false)}
            >
              Back to Registration Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Vendor Registration</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join ShaadiBiyah and connect with thousands of couples planning their dream wedding
          </p>
          {formData.category && getCurrentCategoryConfig() && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Badge className={`${getCurrentCategoryConfig()!.color} text-white px-4 py-2`}>
                <div className="flex items-center gap-2">
                  {React.createElement(getCurrentCategoryConfig()!.icon, {
                    className: "w-4 h-4"
                  })}
                  <span className="capitalize">{formData.category.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              </Badge>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-sm">Wide Reach</h3>
              <p className="text-sm text-muted-foreground">Connect with customers across India</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <CurrencyIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2 text-sm">Grow Your Business</h3>
              <p className="text-sm text-muted-foreground">Increase bookings and revenue</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-sm">Easy Management</h3>
              <p className="text-sm text-muted-foreground">Simple dashboard to manage bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Category-specific benefits */}
        {formData.category && getCurrentCategoryConfig() && (
          <Card className="glassmorphism border-accent/30 mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                {React.createElement(getCurrentCategoryConfig()!.icon, {
                  className: `w-6 h-6 text-primary ${getCurrentCategoryConfig()!.color}`
                })}
                <CardTitle>Why Choose ShaadiBiyah for {formData.category.replace(/([A-Z])/g, ' $1').trim()}?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Verified Customers</h4>
                      <p className="text-sm text-muted-foreground">Connect with genuine couples planning their wedding</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Secure Payments</h4>
                      <p className="text-sm text-muted-foreground">Safe and reliable payment processing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">24/7 Support</h4>
                      <p className="text-sm text-muted-foreground">Round-the-clock customer support</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Easy Booking Management</h4>
                      <p className="text-sm text-muted-foreground">Simple dashboard to manage all bookings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Marketing Tools</h4>
                      <p className="text-sm text-muted-foreground">Promote your services effectively</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Reviews & Ratings</h4>
                      <p className="text-sm text-muted-foreground">Build trust through customer reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        <Card className="glassmorphism border-accent/30">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Royal Palace Banquet"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hall">Marriage Hall</SelectItem>
                      <SelectItem value="car">Wedding Car Service</SelectItem>
                      <SelectItem value="photographer">Photographer</SelectItem>
                      <SelectItem value="caterer">Catering Service</SelectItem>
                      <SelectItem value="makeup">Makeup Artist</SelectItem>
                      <SelectItem value="decorator">Decorator</SelectItem>
                      <SelectItem value="sweet">Sweet Maker</SelectItem>
                      <SelectItem value="dhol">Dhol/Band Service</SelectItem>
                      <SelectItem value="clothing">Bridal/Groom Clothing</SelectItem>
                      <SelectItem value="horse">Horse Rental (Ghodi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your services, experience, and what makes you special..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location/City *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="e.g., +91 9876543210"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., contact@yourbusiness.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              {/* Bank Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <CurrencyIcon className="w-8 h-8 text-green-600" />
                  <h3 className="text-lg font-semibold">Bank Information for Payments</h3>
                  <Badge variant="outline" className="ml-auto">
                    {selectedCountry.flag} {selectedCountry.currencySymbol} {selectedCountry.currency}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g., State Bank of India"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      placeholder="e.g., John Doe"
                      value={formData.accountHolderName}
                      onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      placeholder="e.g., 1234567890"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      placeholder="e.g., SBIN0001234"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankBranch">Bank Branch *</Label>
                    <Input
                      id="bankBranch"
                      placeholder="e.g., Main Branch, Mumbai"
                      value={formData.bankBranch}
                      onChange={(e) => setFormData({...formData, bankBranch: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type *</Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => setFormData({...formData, accountType: value})}
                      required
                    >
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="current">Current Account</SelectItem>
                        <SelectItem value="business">Business Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Payment Processing</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your bank information is encrypted and securely stored. We use this information to process payments 
                        for your services after successful bookings. You will receive payments directly to this account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-specific fields */}
              {getCurrentCategoryConfig() && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    {React.createElement(getCurrentCategoryConfig()!.icon, {
                      className: `w-8 h-8 text-primary ${getCurrentCategoryConfig()!.color}`
                    })}
                    <h3 className="text-lg font-semibold">Category-Specific Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {getCurrentCategoryConfig()!.specificFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                          {field.label} {field.required && '*'}
                        </Label>
                        
                        {field.type === 'text' && (
                          <Input
                            id={field.name}
                            placeholder={field.placeholder}
                            value={formData.specificFields[field.name] || ''}
                            onChange={(e) => updateSpecificField(field.name, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'number' && (
                          <Input
                            id={field.name}
                            type="number"
                            placeholder={field.placeholder}
                            value={formData.specificFields[field.name] || ''}
                            onChange={(e) => updateSpecificField(field.name, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'textarea' && (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            rows={3}
                            value={formData.specificFields[field.name] || ''}
                            onChange={(e) => updateSpecificField(field.name, e.target.value)}
                            required={field.required}
                          />
                        )}
                        
                        {field.type === 'select' && (
                          <Select
                            value={formData.specificFields[field.name] || ''}
                            onValueChange={(value) => updateSpecificField(field.name, value)}
                            required={field.required}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {field.type === 'checkbox' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={field.name}
                              checked={formData.specificFields[field.name] || false}
                              onCheckedChange={(checked) => updateSpecificField(field.name, checked)}
                            />
                            <Label htmlFor={field.name} className="cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages/Offerings Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Your Packages/Services *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add different packages or services you offer with individual pricing
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addPackage}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </div>

                <div className="space-y-4">
                  {packages.map((pkg, index) => (
                    <Card key={pkg.id} className="border-accent/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">Package {index + 1}</h4>
                            {getCurrentCategoryConfig() && (
                              <Badge variant="secondary" className="text-xs">
                                {getCurrentCategoryConfig()!.specificFields[0]?.label || 'Custom'}
                              </Badge>
                            )}
                          </div>
                          {packages.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackage(pkg.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {/* Standard package fields */}
                          <div className="space-y-2">
                            <Label htmlFor={`pkg-name-${pkg.id}`}>Package Name *</Label>
                            <Input
                              id={`pkg-name-${pkg.id}`}
                              placeholder="e.g., Basic Package, Premium Package"
                              value={pkg.name}
                              onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`pkg-desc-${pkg.id}`}>Package Description *</Label>
                            <Textarea
                              id={`pkg-desc-${pkg.id}`}
                              placeholder="What's included in this package?"
                              rows={2}
                              value={pkg.description}
                              onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`pkg-price-${pkg.id}`}>Price (Rs.) *</Label>
                            <Input
                              id={`pkg-price-${pkg.id}`}
                              type="number"
                              placeholder="e.g., 50000"
                              value={pkg.price}
                              onChange={(e) => updatePackage(pkg.id, 'price', e.target.value)}
                              required
                            />
                          </div>

                          {/* Category-specific package fields */}
                          {getCurrentCategoryConfig() && getCurrentCategoryConfig()!.packageFields.length > 3 && (
                            <div className="border-t pt-4">
                              <h5 className="text-sm font-medium mb-3 text-muted-foreground">Additional Package Details</h5>
                              <div className="grid md:grid-cols-2 gap-4">
                                {getCurrentCategoryConfig()!.packageFields.slice(3).map((field) => (
                                  <div key={field.name} className="space-y-2">
                                    <Label htmlFor={`pkg-${field.name}-${pkg.id}`}>{field.label}</Label>
                                    
                                    {field.type === 'text' && (
                                      <Input
                                        id={`pkg-${field.name}-${pkg.id}`}
                                        placeholder={field.placeholder}
                                        value={pkg.additionalFields?.[field.name] || ''}
                                        onChange={(e) => updatePackageField(pkg.id, field.name, e.target.value)}
                                      />
                                    )}
                                    
                                    {field.type === 'number' && (
                                      <Input
                                        id={`pkg-${field.name}-${pkg.id}`}
                                        type="number"
                                        placeholder={field.placeholder}
                                        value={pkg.additionalFields?.[field.name] || ''}
                                        onChange={(e) => updatePackageField(pkg.id, field.name, e.target.value)}
                                      />
                                    )}
                                    
                                    {field.type === 'textarea' && (
                                      <Textarea
                                        id={`pkg-${field.name}-${pkg.id}`}
                                        placeholder={field.placeholder}
                                        rows={2}
                                        value={pkg.additionalFields?.[field.name] || ''}
                                        onChange={(e) => updatePackageField(pkg.id, field.name, e.target.value)}
                                      />
                                    )}
                                    
                                    {field.type === 'select' && (
                                      <Select
                                        value={pkg.additionalFields?.[field.name] || ''}
                                        onValueChange={(value) => updatePackageField(pkg.id, field.name, value)}
                                      >
                                        <SelectTrigger id={`pkg-${field.name}-${pkg.id}`}>
                                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options?.map((option) => (
                                            <SelectItem key={option} value={option}>
                                              {option}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Package Images */}
                          <div className="border-t pt-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Package Images</Label>
                                <span className="text-xs text-muted-foreground">
                                  {pkg.images.length} image(s) uploaded
                                </span>
                              </div>
                              
                              {/* Image Upload Button */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  id={`package-images-${pkg.id}`}
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handlePackageImageUpload(pkg.id, e.target.files);
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById(`package-images-${pkg.id}`)?.click()}
                                >
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  Upload Images
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  Upload up to 5 images per package
                                </span>
                              </div>

                              {/* Display Uploaded Images */}
                              {pkg.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {pkg.images.map((image, imageIndex) => (
                                    <div key={imageIndex} className="relative group">
                                      <img
                                        src={image}
                                        alt={`Package ${index + 1} - Image ${imageIndex + 1}`}
                                        className="w-full h-20 object-cover rounded-md border"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removePackageImage(pkg.id, imageIndex)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Custom Fields Section */}
                          {packageDynamicFields[pkg.id] && packageDynamicFields[pkg.id].length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <Label className="text-sm font-medium">Custom Fields</Label>
                                  <p className="text-xs text-muted-foreground">
                                    {packageDynamicFields[pkg.id].length} custom field(s) added
                                  </p>
                                </div>
                                <PackageCustomFieldsDialog
                                  packageId={pkg.id}
                                  packageName={pkg.name || `Package ${index + 1}`}
                                  onFieldsChange={(fields) => {
                                    setPackageDynamicFields(prev => ({ ...prev, [pkg.id]: fields }));
                                    setPackages(prev => prev.map(p => 
                                      p.id === pkg.id ? { ...p, dynamicFields: fields } : p
                                    ));
                                  }}
                                >
                                  <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Manage Fields
                                  </Button>
                                </PackageCustomFieldsDialog>
                              </div>
                              
                              <DynamicFieldsRenderer
                                fields={packageDynamicFields[pkg.id]}
                                values={{}}
                                onChange={(fieldId, value) => {
                                  console.log(`Package ${pkg.id} field ${fieldId} value:`, value);
                                }}
                              />
                            </div>
                          )}

                          {/* Add Custom Fields Button */}
                          {(!packageDynamicFields[pkg.id] || packageDynamicFields[pkg.id].length === 0) && (
                            <div className="border-t pt-4">
                              <PackageCustomFieldsDialog
                                packageId={pkg.id}
                                packageName={pkg.name || `Package ${index + 1}`}
                                onFieldsChange={(fields) => {
                                  setPackageDynamicFields(prev => ({ ...prev, [pkg.id]: fields }));
                                  setPackages(prev => prev.map(p => 
                                    p.id === pkg.id ? { ...p, dynamicFields: fields } : p
                                  ));
                                }}
                              >
                                <Button variant="outline" className="w-full">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Custom Fields
                                </Button>
                              </PackageCustomFieldsDialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Menu Management for Marriage Hall */}
              {formData.category === 'hall' && formData.specificFields.hasMenu && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Menu Items</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your menu items with prices for catering services
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addMenuItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {menuItems.map((item, index) => (
                      <Card key={item.id} className="border-accent/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="text-sm font-semibold">Menu Item {index + 1}</h4>
                            {menuItems.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMenuItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`menu-name-${item.id}`}>Item Name *</Label>
                              <Input
                                id={`menu-name-${item.id}`}
                                placeholder="e.g., Butter Chicken, Biryani, Gulab Jamun"
                                value={item.name}
                                onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`menu-price-${item.id}`}>Price (Rs.) *</Label>
                              <Input
                                id={`menu-price-${item.id}`}
                                type="number"
                                placeholder="e.g., 250"
                                value={item.price}
                                onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`menu-category-${item.id}`}>Category *</Label>
                              <Select
                                value={item.category}
                                onValueChange={(value) => updateMenuItem(item.id, 'category', value)}
                                required
                              >
                                <SelectTrigger id={`menu-category-${item.id}`}>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Appetizers">Appetizers</SelectItem>
                                  <SelectItem value="Main Course">Main Course</SelectItem>
                                  <SelectItem value="Rice & Bread">Rice & Bread</SelectItem>
                                  <SelectItem value="Desserts">Desserts</SelectItem>
                                  <SelectItem value="Beverages">Beverages</SelectItem>
                                  <SelectItem value="Snacks">Snacks</SelectItem>
                                  <SelectItem value="Salads">Salads</SelectItem>
                                  <SelectItem value="Soups">Soups</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`menu-description-${item.id}`}>Description</Label>
                              <Input
                                id={`menu-description-${item.id}`}
                                placeholder="e.g., Tender chicken in rich tomato gravy"
                                value={item.description || ''}
                                onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Menu Summary */}
                  {menuItems.length > 0 && (
                    <Card className="gradient-gold border-accent">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Menu Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Menu Items: <span className="font-semibold text-foreground">{menuItems.length}</span></p>
                            <p className="text-sm text-muted-foreground">Categories: <span className="font-semibold text-foreground">{new Set(menuItems.map(item => item.category)).size}</span></p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price Range: <span className="font-semibold text-foreground">Rs.{Math.min(...menuItems.map(item => parseInt(item.price) || 0))} - Rs.{Math.max(...menuItems.map(item => parseInt(item.price) || 0))}</span></p>
                            <p className="text-sm text-muted-foreground">Average Price: <span className="font-semibold text-foreground">Rs.{Math.round(menuItems.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0) / menuItems.length)}</span></p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Sponsored Ad Option */}
              <Card className="gradient-gold border-accent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="sponsoredAd"
                      checked={formData.sponsoredAd}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, sponsoredAd: checked as boolean})
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="sponsoredAd" className="cursor-pointer flex items-center gap-2">
                        <Crown className="w-5 h-5 text-foreground" />
                        <span>Get Featured/Sponsored Listing</span>
                      </Label>
                      <p className="text-sm text-foreground/80 mt-2">
                        Boost your visibility! Featured vendors appear at the top of search results with a special badge.
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-foreground/80">
                        <p>✓ Priority placement in search results</p>
                        <p>✓ Special "Sponsored" badge on your listing</p>
                        <p>✓ Increased booking rate by up to 300%</p>
                        <p className="text-foreground mt-2">
                          <strong>Additional cost: Rs.5,000/month or Rs.50,000/year</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Fields Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Custom Fields
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDynamicFieldsManager(!showDynamicFieldsManager);
                        if (showDynamicFieldsManager) {
                          // Refresh fields when closing manager
                          const loadDynamicFields = async () => {
                            try {
                              const response = await fetch('http://localhost:5000/api/vendor/fields', {
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                              });
                              const data = await response.json();
                              if (data.success) {
                                setDynamicFields(data.data);
                              }
                            } catch (error) {
                              console.error('Failed to load dynamic fields:', error);
                            }
                          };
                          loadDynamicFields();
                        }
                      }}
                    >
                      {showDynamicFieldsManager ? 'Hide Manager' : 'Manage Fields'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showDynamicFieldsManager ? (
                    <DynamicFieldsManager onFieldsChange={setDynamicFields} />
                  ) : (
                    <div className="space-y-4">
                      {dynamicFields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No custom fields added yet.</p>
                          <p className="text-sm">Click "Manage Fields" to add custom fields for your business.</p>
                        </div>
                      ) : (
                        <DynamicFieldsRenderer
                          fields={dynamicFields}
                          values={dynamicFieldValues}
                          onChange={updateDynamicFieldValue}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 gradient-maroon">
                  <Save className="w-4 h-4 mr-2" />
                  Submit Registration
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8 gradient-pink border-accent/30">
          <CardContent className="p-6">
            <h3 className="mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</div>
                <p className="text-muted-foreground">You'll receive a verification document via email to sign</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</div>
                <p className="text-muted-foreground">Sign the document online to complete verification</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</div>
                <p className="text-muted-foreground">Our team will review your signed agreement within 24-48 hours</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 text-xs">4</div>
                <p className="text-muted-foreground">Once approved, access your vendor dashboard to manage bookings</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 text-xs">5</div>
                <p className="text-muted-foreground">If you opted for sponsored listing, payment details will be shared via email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
