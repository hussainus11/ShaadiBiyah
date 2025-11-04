import React, { useState } from 'react';
import { 
  CreditCard, Shield, CheckCircle, AlertTriangle,
  Banknote, Smartphone, Globe, Building2, Clock, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CurrencyIcon } from '../ui/currency-icon';
import { useCountry } from '../../contexts/CountryContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  fee: string;
  processingTime: string;
  isAvailable: boolean;
  minAmount?: number;
  maxAmount?: number;
}

interface PaymentMethodsProps {
  amount: number;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  onPaymentComplete: (paymentData: any) => void;
}

export function PaymentMethods({ amount, onPaymentMethodSelect, onPaymentComplete }: PaymentMethodsProps) {
  const { selectedCountry } = useCountry();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    phoneNumber: '',
    bankAccount: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Get country-specific payment methods
  const getCountryPaymentMethods = (): PaymentMethod[] => {
    const baseMethods: PaymentMethod[] = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: CreditCard,
        description: 'Visa, Mastercard, RuPay',
        fee: `2.5% + ${selectedCountry.currencySymbol}3`,
        processingTime: 'Instant',
        isAvailable: true,
        minAmount: 100,
        maxAmount: 1000000
      },
      {
        id: 'stripe',
        name: 'Stripe',
        icon: Globe,
        description: 'International payments',
        fee: `2.9% + ${selectedCountry.currencySymbol}2`,
        processingTime: 'Instant',
        isAvailable: true,
        minAmount: 100,
        maxAmount: 5000000
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: Globe,
        description: 'Global payment platform',
        fee: `3.4% + ${selectedCountry.currencySymbol}5`,
        processingTime: '1-2 minutes',
        isAvailable: true,
        minAmount: 100,
        maxAmount: 1000000
      },
      {
        id: 'bankTransfer',
        name: 'Bank Transfer',
        icon: Building2,
        description: 'NEFT, RTGS, IMPS',
        fee: `${selectedCountry.currencySymbol}25 per transaction`,
        processingTime: '5-30 minutes',
        isAvailable: true,
        minAmount: 1000,
        maxAmount: 10000000
      }
    ];

    // Add country-specific payment methods
    const countryMethods: PaymentMethod[] = [];
    
    if (selectedCountry.code === 'IN') {
      countryMethods.push(
        {
          id: 'upi',
          name: 'UPI',
          icon: Smartphone,
          description: 'Google Pay, PhonePe, Paytm',
          fee: `${selectedCountry.currencySymbol}5 per transaction`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 1,
          maxAmount: 100000
        },
        {
          id: 'wallet',
          name: 'Digital Wallet',
          icon: Banknote,
          description: 'Paytm, Mobikwik, Freecharge',
          fee: `2% + ${selectedCountry.currencySymbol}1`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 10,
          maxAmount: 100000
        }
      );
    } else if (selectedCountry.code === 'PK') {
      countryMethods.push(
        {
          id: 'jazzCash',
          name: 'JazzCash',
          icon: Smartphone,
          description: 'Mobile wallet Pakistan',
          fee: `1.5% + ${selectedCountry.currencySymbol}2`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 100,
          maxAmount: 50000
        },
        {
          id: 'easyPaisa',
          name: 'EasyPaisa',
          icon: Smartphone,
          description: 'Mobile wallet Pakistan',
          fee: `1.5% + ${selectedCountry.currencySymbol}2`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 100,
          maxAmount: 50000
        }
      );
    } else if (selectedCountry.code === 'BD') {
      countryMethods.push(
        {
          id: 'bkash',
          name: 'bKash',
          icon: Smartphone,
          description: 'Mobile wallet Bangladesh',
          fee: `1.5% + ${selectedCountry.currencySymbol}2`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 10,
          maxAmount: 100000
        },
        {
          id: 'rocket',
          name: 'Rocket',
          icon: Smartphone,
          description: 'Mobile wallet Bangladesh',
          fee: `1.5% + ${selectedCountry.currencySymbol}2`,
          processingTime: 'Instant',
          isAvailable: true,
          minAmount: 10,
          maxAmount: 100000
        }
      );
    }

    return [...baseMethods, ...countryMethods];
  };

  const paymentMethods = getCountryPaymentMethods();

  const calculateFee = (method: PaymentMethod, amount: number): number => {
    if (method.fee.includes('%')) {
      const percentage = parseFloat(method.fee.split('%')[0]);
      const fixedFee = parseFloat(method.fee.split(`+ ${selectedCountry.currencySymbol}`)[1] || '0');
      return (amount * percentage / 100) + fixedFee;
    } else {
      return parseFloat(method.fee.split(selectedCountry.currencySymbol)[1] || '0');
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    if (!method.isAvailable) return;
    setSelectedMethod(method);
    onPaymentMethodSelect(method);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentResult = {
        method: selectedMethod,
        amount: amount,
        fee: calculateFee(selectedMethod, amount),
        totalAmount: amount + calculateFee(selectedMethod, amount),
        transactionId: `TXN${Date.now()}`,
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      setIsProcessing(false);
      onPaymentComplete(paymentResult);
    }, 2000);
  };

  const availableMethods = paymentMethods.filter(method => method.isAvailable);

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyIcon className="w-5 h-5" />
            Payment Summary
            <Badge variant="outline" className="ml-auto">
              {selectedCountry.flag} {selectedCountry.currency}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Booking Amount</span>
              <span className="font-semibold">{selectedCountry.currencySymbol}{amount.toLocaleString()}</span>
            </div>
            {selectedMethod && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold">{selectedCountry.currencySymbol}{calculateFee(selectedMethod, amount).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-primary">{selectedCountry.currencySymbol}{(amount + calculateFee(selectedMethod, amount)).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {availableMethods.map((method) => {
              const IconComponent = method.icon;
              const fee = calculateFee(method, amount);
              const isSelected = selectedMethod?.id === method.id;
              
              return (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  } ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleMethodSelect(method)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee:</span>
                      <span className="font-semibold">Rs.{fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="font-semibold">{method.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span>Secure & Encrypted</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {selectedMethod && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Payment Details - {selectedMethod.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMethod.id === 'card' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod.id === 'upi' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={paymentData.upiId}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    You will be redirected to your UPI app to complete the payment
                  </p>
                </div>
              </div>
            )}

            {selectedMethod.id === 'bankTransfer' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      placeholder="1234567890"
                      value={paymentData.bankAccount}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="SBIN0001234"
                      value={paymentData.ifscCode}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, ifscCode: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      placeholder="John Doe"
                      value={paymentData.accountHolderName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Bank transfer may take 5-30 minutes to process
                  </p>
                </div>
              </div>
            )}

            {selectedMethod.id === 'wallet' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+91 9876543210"
                    value={paymentData.phoneNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    You will be redirected to your wallet app to complete the payment
                  </p>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">Secure Payment</span>
              </div>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                to protect your financial data.
              </p>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePaymentSubmit} 
              className="w-full gradient-maroon"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Rs.{(amount + calculateFee(selectedMethod, amount)).toLocaleString()}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
