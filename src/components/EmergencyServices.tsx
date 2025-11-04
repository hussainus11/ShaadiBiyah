import { useState } from 'react';
import { AlertTriangle, Phone, Clock, Shield, CheckCircle2, Users, Camera, Utensils, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface BackupVendor {
  id: number;
  category: string;
  name: string;
  phone: string;
  responseTime: string;
  availability: string;
  rating: number;
  verified: boolean;
}

interface EmergencyContact {
  id: number;
  role: string;
  name: string;
  phone: string;
  available: boolean;
}

export function EmergencyServices() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const backupVendors: BackupVendor[] = [
    {
      id: 1,
      category: 'Photographer',
      name: 'Quick Snap Photography',
      phone: '+91 98765 43210',
      responseTime: '< 2 hours',
      availability: '24/7',
      rating: 4.7,
      verified: true,
    },
    {
      id: 2,
      category: 'Caterer',
      name: 'Express Catering Services',
      phone: '+91 98765 43211',
      responseTime: '< 4 hours',
      availability: '24/7',
      rating: 4.8,
      verified: true,
    },
    {
      id: 3,
      category: 'Makeup Artist',
      name: 'Beauty on Call',
      phone: '+91 98765 43212',
      responseTime: '< 1 hour',
      availability: '24/7',
      rating: 4.9,
      verified: true,
    },
    {
      id: 4,
      category: 'Decorator',
      name: 'Last Minute Decor',
      phone: '+91 98765 43213',
      responseTime: '< 3 hours',
      availability: '24/7',
      rating: 4.6,
      verified: true,
    },
    {
      id: 5,
      category: 'DJ/Music',
      name: 'Emergency Beats',
      phone: '+91 98765 43214',
      responseTime: '< 2 hours',
      availability: '24/7',
      rating: 4.8,
      verified: true,
    },
  ];

  const emergencyContacts: EmergencyContact[] = [
    { id: 1, role: 'Wedding Coordinator', name: 'Priya Sharma', phone: '+91 98765 00001', available: true },
    { id: 2, role: 'Venue Manager', name: 'Rahul Verma', phone: '+91 98765 00002', available: true },
    { id: 3, role: 'Event Support', name: 'Anjali Patel', phone: '+91 98765 00003', available: true },
    { id: 4, role: 'Technical Support', name: 'Vikram Singh', phone: '+91 98765 00004', available: true },
  ];

  const emergencyChecklist = [
    { item: 'Backup vendor contacts', status: true },
    { item: 'Emergency contact list', status: true },
    { item: 'Vendor contracts backup', status: true },
    { item: 'Payment receipts', status: false },
    { item: 'Venue emergency plan', status: true },
    { item: 'First aid kit location', status: true },
    { item: 'Power backup plan', status: false },
    { item: 'Weather backup plan', status: true },
  ];

  const handleEmergencyRequest = (vendor: BackupVendor) => {
    toast.success(`Emergency request sent to ${vendor.name}. They will contact you within ${vendor.responseTime}.`);
  };

  const handleCall = (phone: string, name: string) => {
    toast.info(`Calling ${name}...`);
  };

  const categoryIcons: { [key: string]: any } = {
    'Photographer': Camera,
    'Caterer': Utensils,
    'Makeup Artist': Sparkles,
    'Decorator': Sparkles,
    'DJ/Music': Users,
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h1>Emergency Services & Backup</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            24/7 emergency support and backup vendor services for your peace of mind
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <Shield className="h-5 w-5 text-primary" />
          <AlertTitle>Emergency Support Active</AlertTitle>
          <AlertDescription>
            Our 24/7 emergency support team is ready to assist you. All backup vendors are verified and available on short notice.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Contacts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact Cards */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact) => (
                    <Card key={contact.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{contact.role}</p>
                            <h4 className="text-sm">{contact.name}</h4>
                          </div>
                          {contact.available && (
                            <Badge className="bg-green-600">Available</Badge>
                          )}
                        </div>
                        <Button
                          className="w-full gradient-maroon"
                          onClick={() => handleCall(contact.phone, contact.name)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backup Vendors */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Backup Vendors (24/7 Available)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupVendors.map((vendor) => {
                    const Icon = categoryIcons[vendor.category] || Users;
                    return (
                      <Card key={vendor.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm">{vendor.name}</h4>
                                    {vendor.verified && (
                                      <Badge className="bg-green-600 text-xs">Verified</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{vendor.category}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{vendor.responseTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Shield className="w-4 h-4" />
                                  <span>{vendor.availability}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCall(vendor.phone, vendor.name)}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call
                                </Button>
                                <Button
                                  className="gradient-maroon"
                                  size="sm"
                                  onClick={() => handleEmergencyRequest(vendor)}
                                >
                                  Request Emergency Service
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Checklist */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Emergency Prep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.status ? 'bg-green-600' : 'bg-muted'
                      }`}>
                        {item.status && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${!item.status && 'text-muted-foreground'}`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gradient-maroon">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Emergency
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Emergency</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-type">Emergency Type</Label>
                        <Input id="emergency-type" placeholder="e.g., Photographer no-show" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="details">Details</Label>
                        <Textarea
                          id="details"
                          placeholder="Describe the situation..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Your Contact Number</Label>
                        <Input id="contact" type="tel" placeholder="+91" />
                      </div>
                      <Button
                        className="w-full gradient-maroon"
                        onClick={() => toast.success('Emergency reported! Our team will contact you immediately.')}
                      >
                        Submit Emergency Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full">
                  View Insurance Details
                </Button>
                <Button variant="outline" className="w-full">
                  Download Emergency Plan
                </Button>
              </CardContent>
            </Card>

            {/* Support Info */}
            <Card className="glassmorphism border-primary/30">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h4 className="mb-2">24/7 Helpline</h4>
                <p className="text-2xl text-primary mb-2">1800-123-4567</p>
                <p className="text-sm text-muted-foreground">
                  Free support available round the clock
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">
                Round-the-clock emergency assistance
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Verified Vendors</h4>
              <p className="text-sm text-muted-foreground">
                All backup vendors are verified
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Quick Response</h4>
              <p className="text-sm text-muted-foreground">
                Fast response times guaranteed
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Peace of Mind</h4>
              <p className="text-sm text-muted-foreground">
                Wedding day protection assured
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
