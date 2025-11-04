import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateTimePicker, DatePicker, TimePicker } from '../ui/date-time-picker';
import { Badge } from '../ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { BookingPayment } from '../payments/BookingPayment';
import { format } from 'date-fns';

interface BookingData {
  vendorId: string;
  serviceId: string;
  date: Date;
  time: string;
  duration: number;
  guestCount: number;
  specialRequests: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface BookingFlowProps {
  vendorId: string;
  serviceId?: string;
  onBack?: () => void;
  onComplete?: (bookingId: string) => void;
}

export function BookingFlow({ vendorId, serviceId, onBack, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    vendorId,
    serviceId: serviceId || '',
    date: new Date(),
    time: '',
    duration: 1,
    guestCount: 1,
    specialRequests: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Service Selection', description: 'Choose your service' },
    { id: 2, title: 'Date & Time', description: 'Select your preferred date' },
    { id: 3, title: 'Details', description: 'Provide event details' },
    { id: 4, title: 'Contact Info', description: 'Your contact information' },
    { id: 5, title: 'Review & Book', description: 'Confirm your booking' }
  ];

  useEffect(() => {
    // Fetch vendor details
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/vendors/${vendorId}`);
        const data = await response.json();
        if (data.success) {
          setVendor(data.data);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = (paymentResult: any) => {
    console.log('Payment completed:', paymentResult);
    // Here you would typically save the booking with payment information
    const bookingId = `BK${Date.now()}`;
    setShowPayment(false);
    onComplete?.(bookingId);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Service</h3>
            <div className="space-y-4">
              {vendor?.services.map((service: any, index: number) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all ${
                    bookingData.serviceId === service.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, serviceId: service.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${service.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Choose Date & Time</Label>
                <DateTimePicker
                  date={bookingData.date}
                  time={bookingData.time}
                  onDateChange={(date) => date && setBookingData(prev => ({ ...prev, date }))}
                  onTimeChange={(time) => setBookingData(prev => ({ ...prev, time }))}
                  placeholder="Select date and time"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">Duration (hours)</Label>
                  <Select value={bookingData.duration.toString()} onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Event Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Number of Guests</Label>
                <Input
                  type="number"
                  value={bookingData.guestCount}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block">Event Address</Label>
                <Input
                  value={bookingData.location.address}
                  onChange={(e) => setBookingData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  placeholder="Enter event address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">City</Label>
                  <Input
                    value={bookingData.location.city}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-2 block">State</Label>
                  <Input
                    value={bookingData.location.state}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, state: e.target.value }
                    }))}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-2 block">ZIP Code</Label>
                  <Input
                    value={bookingData.location.zipCode}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, zipCode: e.target.value }
                    }))}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block">Special Requests</Label>
                <Textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any special requirements or requests..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Full Name</Label>
                <Input
                  value={bookingData.contactInfo.name}
                  onChange={(e) => setBookingData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, name: e.target.value }
                  }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={bookingData.contactInfo.email}
                  onChange={(e) => setBookingData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                  }))}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block">Phone Number</Label>
                <Input
                  type="tel"
                  value={bookingData.contactInfo.phone}
                  onChange={(e) => setBookingData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        const selectedService = vendor?.services.find((s: any) => s.id === bookingData.serviceId);
        const totalPrice = selectedService ? selectedService.price * bookingData.duration : 0;

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Booking</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{format(bookingData.date, 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{bookingData.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{bookingData.guestCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{bookingData.location.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>${selectedService?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{bookingData.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>${(totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{bookingData.contactInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{bookingData.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{bookingData.contactInfo.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showPayment ? (
        <BookingPayment
          bookingDetails={{
            vendorName: vendor?.name || 'Vendor',
            serviceName: vendor?.services?.[0]?.name || 'Service',
            bookingDate: format(bookingData.date, 'PPP'),
            bookingTime: bookingData.time,
            totalAmount: vendor?.services?.[0]?.price || 50000,
            advancePaymentPercentage: 30,
            platformFeePercentage: 8.5
          }}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            {onBack && (
              <Button variant="ghost" onClick={handleBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-3xl font-bold mb-2">Book Your Service</h1>
            <p className="text-muted-foreground">Complete your booking in a few simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="glassmorphism">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button 
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              disabled={loading}
              className="gradient-pink text-primary"
            >
              {loading ? 'Processing...' : currentStep === steps.length ? 'Proceed to Payment' : 'Next'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
