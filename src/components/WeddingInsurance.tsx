import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Calendar, IndianRupee, FileText, Download, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';

interface InsurancePlan {
  id: number;
  name: string;
  coverage: number;
  premium: number;
  features: string[];
  popular: boolean;
}

export function WeddingInsurance() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingBudget, setWeddingBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');

  const insurancePlans: InsurancePlan[] = [
    {
      id: 1,
      name: 'Basic Protection',
      coverage: 500000,
      premium: 5000,
      features: [
        'Vendor no-show coverage',
        'Venue cancellation protection',
        'Lost deposits recovery',
        'Weather-related delays',
      ],
      popular: false,
    },
    {
      id: 2,
      name: 'Premium Shield',
      coverage: 1500000,
      premium: 12000,
      features: [
        'All Basic Protection features',
        'Photographer/videographer failure',
        'Attire damage or loss',
        'Gift theft or loss',
        'Medical emergency coverage',
        'Postponement coverage',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'Ultimate Coverage',
      coverage: 3000000,
      premium: 20000,
      features: [
        'All Premium Shield features',
        'Natural disaster protection',
        'Vendor bankruptcy coverage',
        'Complete cancellation coverage',
        'International coverage',
        'Legal liability protection',
        'Honeymoon travel insurance',
        '24/7 emergency assistance',
      ],
      popular: false,
    },
  ];

  const coveredEvents = [
    { event: 'Vendor No-Show', severity: 'high', icon: AlertTriangle },
    { event: 'Venue Cancellation', severity: 'high', icon: AlertTriangle },
    { event: 'Weather Issues', severity: 'medium', icon: Shield },
    { event: 'Medical Emergency', severity: 'high', icon: AlertTriangle },
    { event: 'Attire Damage', severity: 'medium', icon: Shield },
    { event: 'Gift Loss/Theft', severity: 'medium', icon: Shield },
    { event: 'Photographer Failure', severity: 'high', icon: AlertTriangle },
    { event: 'Natural Disaster', severity: 'high', icon: AlertTriangle },
  ];

  const handleGetQuote = () => {
    if (!weddingDate || !weddingBudget || !guestCount) {
      toast.error('Please fill all fields to get a quote');
      return;
    }
    toast.success('Insurance quote generated! Check your email.');
  };

  const handlePurchase = (planId: number) => {
    setSelectedPlan(planId);
    toast.success('Insurance plan selected! Proceeding to payment...');
  };

  const handleClaim = () => {
    toast.info('Claim form opened. Our team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1>Wedding Insurance</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protect your special day from unexpected events and ensure peace of mind
          </p>
        </div>

        {/* Hero Banner */}
        <Card className="glassmorphism mb-8 border-primary/30">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="mb-4">Why Wedding Insurance?</h2>
                <p className="text-muted-foreground mb-6">
                  With an average Indian wedding costing Rs.20-50 lakhs, protecting your investment is crucial. 
                  Our comprehensive insurance plans cover everything from vendor cancellations to natural disasters.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>99% claim approval rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>24-hour claim processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>No hidden charges</span>
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-white">Get Instant Quote</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-white">Wedding Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="bg-white text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-white">Wedding Budget (Rs.)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="2000000"
                        value={weddingBudget}
                        onChange={(e) => setWeddingBudget(e.target.value)}
                        className="bg-white text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-white">Guest Count</Label>
                      <Input
                        id="guests"
                        type="number"
                        placeholder="300"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="bg-white text-foreground"
                      />
                    </div>
                    <Button 
                      className="w-full bg-white text-primary hover:bg-white/90"
                      onClick={handleGetQuote}
                    >
                      Get Free Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Plans */}
        <div className="mb-8">
          <h2 className="text-center mb-6">Choose Your Protection Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {insurancePlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`glassmorphism hover:shadow-xl transition-all ${
                  plan.popular ? 'border-2 border-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-white text-center py-2 rounded-t-lg">
                    <Badge className="bg-white text-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-primary" />
                    <h3>{plan.name}</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Coverage up to</p>
                    <p className="text-3xl text-primary mb-2">
                      Rs.{(plan.coverage / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Premium: </span>
                      <span className="text-xl">Rs.{plan.premium.toLocaleString()}</span>
                      <span className="text-muted-foreground">/year</span>
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={plan.popular ? 'w-full gradient-maroon' : 'w-full'}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Covered */}
        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle>What's Covered?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {coveredEvents.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      item.severity === 'high' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${
                      item.severity === 'high' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <p className="text-sm">{item.event}</p>
                    <Badge 
                      className={`mt-2 text-xs ${
                        item.severity === 'high' 
                          ? 'bg-red-600' 
                          : 'bg-blue-600'
                      }`}
                    >
                      {item.severity === 'high' ? 'High Risk' : 'Medium Risk'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Claim Process */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                How to File a Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-maroon rounded-full flex items-center justify-center text-white flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm">Report the Incident</h4>
                    <p className="text-sm text-muted-foreground">
                      Call our 24/7 helpline or submit online within 48 hours
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-foreground flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm">Submit Documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload contracts, receipts, and evidence
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 gradient-pink rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm">Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team reviews your claim (24-48 hours)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm">Get Paid</h4>
                    <p className="text-sm text-muted-foreground">
                      Approved claims paid within 5-7 business days
                    </p>
                  </div>
                </div>

                <Button className="w-full gradient-maroon mt-4" onClick={handleClaim}>
                  <FileText className="w-4 h-4 mr-2" />
                  File a Claim
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">24/7 Emergency Helpline</p>
                  <p className="text-2xl text-primary">1800-WEDDING</p>
                  <p className="text-sm text-muted-foreground">(1800-933-3464)</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Email Support</p>
                  <p className="text-lg">insurance@shaadibiyah.com</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Office Hours</p>
                  <p>Monday - Saturday: 9 AM - 6 PM</p>
                  <p className="text-sm text-muted-foreground">Sunday: Closed (Emergency only)</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Policy Document
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View FAQs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
