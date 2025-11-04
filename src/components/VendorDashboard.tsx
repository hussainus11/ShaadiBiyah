import React, { useState, useEffect } from 'react';
import { 
  Building2, Edit3, Save, Upload, Plus, Trash2, Eye, Calendar, 
  IndianRupee, Star, Users, MessageSquare, Settings, BarChart3,
  Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Package,
  Image as ImageIcon, Phone, Mail, MapPin, Globe, Crown, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface VendorProfile {
  id: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  contact: string;
  email: string;
  website?: string;
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  isVerified: boolean;
  joinedDate: string;
  images: string[];
  services: Service[];
  reviews: Review[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category?: string;
  isActive: boolean;
  bookings: number;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

interface Booking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  contact: string;
}

export function VendorDashboard() {
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>({
    id: '1',
    businessName: 'Royal Palace Banquet',
    category: 'Marriage Hall',
    description: 'Premium wedding venue with excellent facilities and catering services.',
    location: 'Delhi, India',
    contact: '+91 9876543210',
    email: 'info@royalpalace.com',
    website: 'www.royalpalace.com',
    rating: 4.8,
    totalBookings: 125,
    totalRevenue: 18750000,
    isActive: true,
    isVerified: true,
    joinedDate: '2023-01-15',
    images: [],
    services: [
      {
        id: '1',
        name: 'Basic Package',
        description: 'Hall booking with basic decoration',
        price: 50000,
        duration: 'Full Day',
        isActive: true,
        bookings: 45
      },
      {
        id: '2',
        name: 'Premium Package',
        description: 'Hall booking with premium decoration and catering',
        price: 80000,
        duration: 'Full Day',
        isActive: true,
        bookings: 60
      }
    ],
    reviews: [
      {
        id: '1',
        customerName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent service and beautiful venue. Highly recommended!',
        date: '2024-01-15',
        service: 'Premium Package'
      },
      {
        id: '2',
        customerName: 'Rahul Kapoor',
        rating: 4,
        comment: 'Good venue with professional staff.',
        date: '2024-01-10',
        service: 'Basic Package'
      }
    ]
  });

  const [recentBookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'Sanjay Agarwal',
      service: 'Premium Package',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'confirmed',
      amount: 80000,
      contact: '+91 9876543210'
    },
    {
      id: '2',
      customerName: 'Meera Singh',
      service: 'Basic Package',
      date: '2024-02-20',
      time: '11:00 AM',
      status: 'pending',
      amount: 50000,
      contact: '+91 9876543211'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: '',
    isActive: true
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
    // Show success message
  };

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        price: newService.price,
        duration: newService.duration || 'Full Day',
        category: newService.category || 'General',
        isActive: true,
        bookings: 0
      };
      setVendorProfile(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      setNewService({
        name: '',
        description: '',
        price: 0,
        duration: '',
        category: '',
        isActive: true
      });
    }
  };

  const handleUpdateService = (serviceId: string, updates: Partial<Service>) => {
    setVendorProfile(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      )
    }));
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setVendorProfile(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Manage your business and bookings</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${vendorProfile.isVerified ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                {vendorProfile.isVerified ? 'Verified' : 'Pending Verification'}
              </Badge>
              <Badge className={`${vendorProfile.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                {vendorProfile.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-blue-500" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{vendorProfile.totalBookings}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IndianRupee className="w-8 h-8 text-green-500" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mb-1">Rs.{(vendorProfile.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{vendorProfile.rating}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-purple-500" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{vendorProfile.services.length}</p>
              <p className="text-sm text-muted-foreground">Active Services</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business Profile</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={vendorProfile.businessName}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, businessName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={vendorProfile.category}
                      onValueChange={(value) => setVendorProfile(prev => ({ ...prev, category: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marriage Hall">Marriage Hall</SelectItem>
                        <SelectItem value="Photographer">Photographer</SelectItem>
                        <SelectItem value="Caterer">Caterer</SelectItem>
                        <SelectItem value="Decorator">Decorator</SelectItem>
                        <SelectItem value="Car Service">Car Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={vendorProfile.description}
                    onChange={(e) => setVendorProfile(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={vendorProfile.location}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      value={vendorProfile.contact}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, contact: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={vendorProfile.email}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={vendorProfile.website || ''}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button onClick={handleSaveProfile} className="gradient-maroon">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="space-y-6">
              {/* Add New Service */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Service Name *</Label>
                      <Input
                        id="serviceName"
                        placeholder="e.g., Premium Wedding Package"
                        value={newService.name || ''}
                        onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicePrice">Price (Rs.) *</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        placeholder="50000"
                        value={newService.price || ''}
                        onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDuration">Duration</Label>
                      <Select value={newService.duration || ''} onValueChange={(value) => setNewService(prev => ({ ...prev, duration: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Half Day">Half Day (4-6 hours)</SelectItem>
                          <SelectItem value="Full Day">Full Day (8-12 hours)</SelectItem>
                          <SelectItem value="Multi Day">Multi Day (2+ days)</SelectItem>
                          <SelectItem value="Custom">Custom Duration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceCategory">Category</Label>
                      <Select value={newService.category || ''} onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venue">Venue</SelectItem>
                          <SelectItem value="Catering">Catering</SelectItem>
                          <SelectItem value="Photography">Photography</SelectItem>
                          <SelectItem value="Decoration">Decoration</SelectItem>
                          <SelectItem value="Music">Music & Entertainment</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDescription">Service Description *</Label>
                    <Textarea
                      id="serviceDescription"
                      placeholder="Describe your service in detail..."
                      rows={3}
                      value={newService.description || ''}
                      onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button onClick={handleAddService} className="gradient-maroon">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="serviceActive"
                        checked={newService.isActive}
                        onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="serviceActive">Active Service</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services List */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Your Services ({vendorProfile.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendorProfile.services.map((service) => (
                      <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{service.name}</h4>
                              <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{service.category || 'General'}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{service.description}</p>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                <span className="font-semibold">Rs.{service.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{service.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{service.bookings} bookings</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateService(service.id, { isActive: !service.isActive })}
                            >
                              {service.isActive ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVendorProfile(prev => ({
                                  ...prev,
                                  services: prev.services.filter(s => s.id !== service.id)
                                }));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {vendorProfile.services.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Services Added</h3>
                        <p className="text-muted-foreground">Add your first service to start receiving bookings</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Analytics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glassmorphism">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Services</p>
                        <p className="text-2xl font-bold">{vendorProfile.services.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glassmorphism">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Services</p>
                        <p className="text-2xl font-bold">{vendorProfile.services.filter(s => s.isActive).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glassmorphism">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <p className="text-2xl font-bold">{vendorProfile.services.reduce((sum, s) => sum + s.bookings, 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{booking.customerName}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} at {booking.time} • {booking.contact}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Rs.{booking.amount.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {booking.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500">
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning">
            <div className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Service Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendorProfile.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <Badge className={service.isActive ? 'bg-green-500' : 'bg-red-500'}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>Rs.{service.price.toLocaleString()}</span>
                            <span>{service.duration}</span>
                            <span>{service.bookings} bookings</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New Service */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        placeholder="e.g., Premium Package"
                        value={newService.name || ''}
                        onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicePrice">Price (Rs.)</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        placeholder="e.g., 50000"
                        value={newService.price || ''}
                        onChange={(e) => setNewService(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDuration">Duration</Label>
                      <Select
                        value={newService.duration || ''}
                        onValueChange={(value) => setNewService(prev => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2 Hours">2 Hours</SelectItem>
                          <SelectItem value="4 Hours">4 Hours</SelectItem>
                          <SelectItem value="6 Hours">6 Hours</SelectItem>
                          <SelectItem value="Full Day">Full Day</SelectItem>
                          <SelectItem value="2 Days">2 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDescription">Description</Label>
                      <Textarea
                        id="serviceDescription"
                        placeholder="Describe your service..."
                        value={newService.description || ''}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddService} className="mt-4 gradient-maroon">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Business Information Settings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={vendorProfile.businessName}
                        onChange={(e) => setVendorProfile(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessCategory">Category</Label>
                      <Select value={vendorProfile.category} onValueChange={(value) => setVendorProfile(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venue">Venue</SelectItem>
                          <SelectItem value="Catering">Catering</SelectItem>
                          <SelectItem value="Photography">Photography</SelectItem>
                          <SelectItem value="Decoration">Decoration</SelectItem>
                          <SelectItem value="Music">Music & Entertainment</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessLocation">Location</Label>
                      <Input
                        id="businessLocation"
                        value={vendorProfile.location}
                        onChange={(e) => setVendorProfile(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessContact">Contact Number</Label>
                      <Input
                        id="businessContact"
                        value={vendorProfile.contact}
                        onChange={(e) => setVendorProfile(prev => ({ ...prev, contact: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={vendorProfile.email}
                        onChange={(e) => setVendorProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessWebsite">Website</Label>
                      <Input
                        id="businessWebsite"
                        placeholder="https://yourwebsite.com"
                        value={vendorProfile.website || ''}
                        onChange={(e) => setVendorProfile(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      rows={4}
                      value={vendorProfile.description}
                      onChange={(e) => setVendorProfile(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="gradient-maroon">
                    <Save className="w-4 h-4 mr-2" />
                    Save Business Information
                  </Button>
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Business Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Business Status</h4>
                      <p className="text-sm text-muted-foreground">Enable or disable your business profile</p>
                    </div>
                    <Switch
                      checked={vendorProfile.isActive}
                      onCheckedChange={(checked) => setVendorProfile(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications for new bookings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive SMS alerts for bookings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Auto-Confirm Bookings</h4>
                      <p className="text-sm text-muted-foreground">Automatically confirm bookings within your availability</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Show Contact Details</h4>
                      <p className="text-sm text-muted-foreground">Display your contact information to customers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Availability */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" />
                    Pricing & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minBookingAmount">Minimum Booking Amount (Rs.)</Label>
                      <Input
                        id="minBookingAmount"
                        type="number"
                        placeholder="10000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="advancePercentage">Advance Payment (%)</Label>
                      <Input
                        id="advancePercentage"
                        type="number"
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availabilityDays">Available Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <Button
                          key={day}
                          variant="outline"
                          size="sm"
                          className="h-8"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        defaultValue="09:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        defaultValue="22:00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Customer Reviews ({vendorProfile.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendorProfile.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{review.service}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Management */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Download Data</h4>
                      <p className="text-sm text-muted-foreground">Download your business data</p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-red-600">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your vendor account</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
