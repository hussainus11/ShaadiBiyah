import React, { useState } from 'react';
import { 
  CreditCard, IndianRupee, CheckCircle, AlertTriangle, Clock,
  Shield, Lock, ArrowRight, X, Calendar, Building2, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { PaymentMethods } from './PaymentMethods';

interface BookingPaymentProps {
  bookingDetails: {
    vendorName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    totalAmount: number;
    advancePaymentPercentage: number;
    platformFeePercentage: number;
  };
  onPaymentComplete: (paymentResult: any) => void;
  onCancel: () => void;
}

export function BookingPayment({ bookingDetails, onPaymentComplete, onCancel }: BookingPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'payment' | 'processing' | 'success'>('summary');

  const advanceAmount = Math.round((bookingDetails.totalAmount * bookingDetails.advancePaymentPercentage) / 100);
  const platformFee = Math.round((advanceAmount * bookingDetails.platformFeePercentage) / 100);
  const totalAdvanceAmount = advanceAmount + platformFee;
  const remainingAmount = bookingDetails.totalAmount - advanceAmount;

  const handlePaymentMethodSelect = (method: any) => {
    setSelectedMethod(method);
    setPaymentStep('payment');
  };

  const handlePaymentComplete = (paymentResult: any) => {
    setPaymentStep('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onPaymentComplete(paymentResult);
      }, 2000);
    }, 3000);
  };

  const renderPaymentSummary = () => (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{bookingDetails.vendorName}</h3>
              <p className="text-muted-foreground">{bookingDetails.serviceName}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Booking Date</span>
              <span className="font-semibold">{bookingDetails.bookingDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Booking Time</span>
              <span className="font-semibold">{bookingDetails.bookingTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Service Amount</span>
              <span className="font-semibold">Rs.{bookingDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Breakdown */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Payment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Service Amount</span>
              <span className="font-semibold">Rs.{bookingDetails.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Advance Payment ({bookingDetails.advancePaymentPercentage}%)</span>
              <span className="font-semibold">Rs.{advanceAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Platform Fee ({bookingDetails.platformFeePercentage}%)</span>
              <span className="font-semibold">Rs.{platformFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total Advance Payment</span>
              <span className="font-bold text-primary">Rs.{totalAdvanceAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Remaining Amount</span>
              <span className="text-muted-foreground">Rs.{remainingAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Payment Terms</span>
            </div>
            <p className="text-sm text-blue-700">
              Pay Rs.{totalAdvanceAmount.toLocaleString()} now to confirm your booking. 
              The remaining Rs.{remainingAmount.toLocaleString()} will be paid after service completion.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="glassmorphism border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Secure Payment</h4>
              <p className="text-sm text-green-700">
                Your payment is protected by industry-standard encryption and fraud detection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel Booking
        </Button>
        <Button 
          onClick={() => setPaymentStep('payment')} 
          className="gradient-maroon"
        >
          Proceed to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPaymentProcessing = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <Clock className="w-8 h-8 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
      <p className="text-muted-foreground mb-6">Please wait while we process your payment...</p>
      <div className="w-full bg-secondary rounded-full h-2">
        <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  );

  const renderPaymentSuccess = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-green-800">Payment Successful!</h3>
      <p className="text-muted-foreground mb-6">Your booking has been confirmed</p>
      
      <Card className="glassmorphism max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold">Rs.{totalAdvanceAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold">{selectedMethod?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking Status</span>
              <Badge className="bg-green-500 text-white">Confirmed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">Secure payment to confirm your wedding service booking</p>
      </div>

      {paymentStep === 'summary' && renderPaymentSummary()}
      {paymentStep === 'payment' && (
        <PaymentMethods
          amount={totalAdvanceAmount}
          onPaymentMethodSelect={handlePaymentMethodSelect}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
      {paymentStep === 'processing' && renderPaymentProcessing()}
      {paymentStep === 'success' && renderPaymentSuccess()}
    </div>
  );
}
