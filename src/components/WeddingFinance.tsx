import { useState } from 'react';
import { CreditCard, TrendingUp, Shield, CheckCircle, Calculator, Percent, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { CurrencyIcon } from './ui/currency-icon';
import { useCountry } from '../contexts/CountryContext';

const loanProviders = [
  {
    id: 1,
    name: 'HDFC Bank',
    logo: '🏦',
    interestRate: 10.5,
    maxAmount: 2000000,
    tenure: [12, 24, 36, 48, 60],
    processingFee: 2,
    features: ['Quick approval', 'No prepayment charges', 'Flexible tenure'],
    rating: 4.5,
  },
  {
    id: 2,
    name: 'ICICI Bank',
    logo: '🏦',
    interestRate: 11.0,
    maxAmount: 1500000,
    tenure: [12, 24, 36, 48],
    processingFee: 2.5,
    features: ['Digital process', 'Same day approval', 'Easy documentation'],
    rating: 4.3,
  },
  {
    id: 3,
    name: 'Bajaj Finserv',
    logo: '💳',
    interestRate: 12.0,
    maxAmount: 1000000,
    tenure: [12, 24, 36],
    processingFee: 3,
    features: ['Instant approval', 'Flexi loan option', 'Pre-approved offers'],
    rating: 4.4,
  },
];

export function WeddingFinance() {
  const { selectedCountry } = useCountry();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [selectedProvider, setSelectedProvider] = useState('');

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const calculateTotalInterest = (principal: number, emi: number, months: number) => {
    return (emi * months) - principal;
  };

  const provider = loanProviders.find(p => p.id.toString() === selectedProvider);
  const emi = provider ? calculateEMI(loanAmount, provider.interestRate, tenure) : 0;
  const totalInterest = provider ? calculateTotalInterest(loanAmount, emi, tenure) : 0;
  const totalAmount = loanAmount + totalInterest;
  const processingFee = provider ? (loanAmount * provider.processingFee) / 100 : 0;

  const handleApply = () => {
    if (!selectedProvider) {
      toast.error('Please select a loan provider');
      return;
    }
    toast.success('Application submitted! Bank will contact you within 48 hours');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CreditCard className="w-10 h-10 text-primary" />
            <h1>Wedding Finance & EMI</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan your dream wedding with flexible payment options and easy EMI plans
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Low Interest</h4>
              <p className="text-xs text-muted-foreground">Starting from 10.5% p.a.</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Shield className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Secure Process</h4>
              <p className="text-xs text-muted-foreground">Bank-grade security</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Quick Approval</h4>
              <p className="text-xs text-muted-foreground">Within 24-48 hours</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Flexible Tenure</h4>
              <p className="text-xs text-muted-foreground">12 to 60 months</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* EMI Calculator */}
          <div className="lg:col-span-2">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  EMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loan Amount */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Loan Amount</Label>
                    <div className="flex items-center gap-1 text-primary">
                      <CurrencyIcon className="w-5 h-5" />
                      <span className="text-xl">{selectedCountry.currencySymbol}{loanAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    min={50000}
                    max={2000000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Rs.50K</span>
                    <span>Rs.20L</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Loan Tenure</Label>
                    <span className="text-primary text-xl">{tenure} months</span>
                  </div>
                  <Slider
                    value={[tenure]}
                    onValueChange={(value) => setTenure(value[0])}
                    min={12}
                    max={60}
                    step={12}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12 months</span>
                    <span>60 months</span>
                  </div>
                </div>

                {/* Provider Selection */}
                <div className="space-y-3">
                  <Label>Select Loan Provider</Label>
                  <div className="grid gap-3">
                    {loanProviders.map((prov) => (
                      <Card
                        key={prov.id}
                        className={`cursor-pointer transition-all ${
                          selectedProvider === prov.id.toString()
                            ? 'border-2 border-primary shadow-md'
                            : 'border-2 border-transparent hover:border-accent'
                        }`}
                        onClick={() => setSelectedProvider(prov.id.toString())}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{prov.logo}</span>
                              <div>
                                <h4 className="mb-1">{prov.name}</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    <Percent className="w-3 h-3 mr-1" />
                                    {prov.interestRate}% p.a.
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Max Rs.{(prov.maxAmount / 100000).toFixed(1)}L
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {selectedProvider === prov.id.toString() && (
                              <CheckCircle className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {prov.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* EMI Breakdown */}
          <div>
            <Card className="glassmorphism sticky top-4">
              <CardHeader>
                <CardTitle>EMI Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider ? (
                  <>
                    <div className="text-center p-6 gradient-pink rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Monthly EMI</p>
                      <div className="flex items-center justify-center gap-1">
                        <CurrencyIcon className="w-8 h-8 text-primary" />
                        <span className="text-4xl text-primary">{selectedCountry.currencySymbol}{emi.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-muted-foreground">Principal Amount</span>
                        <span>{selectedCountry.currencySymbol}{loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="text-yellow-600">{selectedCountry.currencySymbol}{totalInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-muted-foreground">Processing Fee ({provider.processingFee}%)</span>
                        <span>{selectedCountry.currencySymbol}{processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-muted-foreground">Loan Tenure</span>
                        <span>{tenure} months</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                        <span>Total Payable</span>
                        <span className="text-primary">{selectedCountry.currencySymbol}{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button className="w-full gradient-maroon" size="lg" onClick={handleApply}>
                      Apply for Loan
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Processing time: 24-48 hours
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select a loan provider to see EMI breakdown
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documents Required */}
        <Card className="glassmorphism mt-8">
          <CardHeader>
            <CardTitle>Documents Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3">Identity Proof</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Aadhaar Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>PAN Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Passport (optional)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3">Income Proof</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Last 3 months salary slips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Last 6 months bank statements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Form 16 / ITR (last 2 years)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="glassmorphism mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Is there a prepayment penalty?</h4>
                <p className="text-sm text-muted-foreground">
                  Most banks allow prepayment without any charges after 6 months of EMI payment.
                </p>
              </div>
              <div>
                <h4 className="mb-2">How long does approval take?</h4>
                <p className="text-sm text-muted-foreground">
                  Digital applications are typically approved within 24-48 hours if all documents are in order.
                </p>
              </div>
              <div>
                <h4 className="mb-2">Can I pay vendors directly?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, the loan amount can be disbursed directly to vendors or to your account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
