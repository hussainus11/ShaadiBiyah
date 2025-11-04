import React, { useState } from 'react';
import { 
  CreditCard, IndianRupee, Settings, Save, RefreshCw, 
  Shield, DollarSign, Percent, AlertTriangle, CheckCircle,
  Banknote, Smartphone, Globe, Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export function PaymentConfig() {
  const [paymentSettings, setPaymentSettings] = useState({
    // Platform Commission Settings
    platformFeePercentage: 8.5,
    minPlatformFee: 500,
    maxPlatformFee: 50000,
    
    // Advance Payment Settings
    advancePaymentPercentage: 30,
    minAdvancePayment: 5000,
    maxAdvancePayment: 500000,
    
    // Payment Methods Configuration
    enabledPaymentMethods: {
      stripe: true,
      paypal: true,
      bankTransfer: true,
      card: true,
      easyPaisa: true,
      jazzCash: true,
      upi: true,
      wallet: true
    },
    
    // Payment Processing Settings
    autoApprovePayments: false,
    requirePaymentVerification: true,
    enableRefunds: true,
    refundProcessingDays: 7,
    
    // Vendor Payout Settings
    vendorPayoutDelay: 3, // days after service completion
    minPayoutAmount: 1000,
    enableInstantPayout: false,
    instantPayoutFee: 2.5, // percentage
    
    // Security Settings
    enableFraudDetection: true,
    maxTransactionAmount: 1000000,
    requireKYC: true,
    
    // Currency Settings
    primaryCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD', 'PKR'],
    
    // Notification Settings
    emailPaymentNotifications: true,
    smsPaymentNotifications: true,
    vendorPayoutNotifications: true
  });

  const paymentMethods = [
    { id: 'stripe', name: 'Stripe', icon: CreditCard, description: 'International card payments', fee: '2.9% + Rs.2' },
    { id: 'paypal', name: 'PayPal', icon: Globe, description: 'Global payment platform', fee: '3.4% + Rs.5' },
    { id: 'bankTransfer', name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer', fee: 'Rs.25 per transaction' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Direct card payments', fee: '2.5% + Rs.3' },
    { id: 'easyPaisa', name: 'EasyPaisa', icon: Smartphone, description: 'Mobile wallet Pakistan', fee: '1.5% + Rs.2' },
    { id: 'jazzCash', name: 'JazzCash', icon: Smartphone, description: 'Mobile wallet Pakistan', fee: '1.5% + Rs.2' },
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Unified Payment Interface', fee: 'Rs.5 per transaction' },
    { id: 'wallet', name: 'Digital Wallet', icon: Banknote, description: 'Digital wallet payments', fee: '2% + Rs.1' }
  ];

  const handleSaveSettings = () => {
    console.log('Saving payment settings:', paymentSettings);
    // Implementation for saving payment settings
  };

  const handleTogglePaymentMethod = (methodId: string) => {
    setPaymentSettings(prev => ({
      ...prev,
      enabledPaymentMethods: {
        ...prev.enabledPaymentMethods,
        [methodId]: !prev.enabledPaymentMethods[methodId]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Platform Commission Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Platform Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformFeePercentage">Platform Fee (%)</Label>
              <Input
                id="platformFeePercentage"
                type="number"
                step="0.1"
                value={paymentSettings.platformFeePercentage}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, platformFeePercentage: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPlatformFee">Minimum Fee (Rs.)</Label>
              <Input
                id="minPlatformFee"
                type="number"
                value={paymentSettings.minPlatformFee}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, minPlatformFee: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPlatformFee">Maximum Fee (Rs.)</Label>
              <Input
                id="maxPlatformFee"
                type="number"
                value={paymentSettings.maxPlatformFee}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxPlatformFee: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Commission Calculation</span>
            </div>
            <p className="text-sm text-blue-700">
              Platform fee will be calculated as: <strong>{paymentSettings.platformFeePercentage}%</strong> of booking amount, 
              with minimum Rs.{paymentSettings.minPlatformFee} and maximum Rs.{paymentSettings.maxPlatformFee}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advance Payment Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Advance Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advancePaymentPercentage">Advance Payment (%)</Label>
              <Input
                id="advancePaymentPercentage"
                type="number"
                value={paymentSettings.advancePaymentPercentage}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, advancePaymentPercentage: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAdvancePayment">Minimum Advance (Rs.)</Label>
              <Input
                id="minAdvancePayment"
                type="number"
                value={paymentSettings.minAdvancePayment}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, minAdvancePayment: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAdvancePayment">Maximum Advance (Rs.)</Label>
              <Input
                id="maxAdvancePayment"
                type="number"
                value={paymentSettings.maxAdvancePayment}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxAdvancePayment: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800">Booking Confirmation</span>
            </div>
            <p className="text-sm text-green-700">
              Users must pay <strong>{paymentSettings.advancePaymentPercentage}%</strong> advance payment to confirm booking, 
              with minimum Rs.{paymentSettings.minAdvancePayment} and maximum Rs.{paymentSettings.maxAdvancePayment}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Configuration */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={paymentSettings.enabledPaymentMethods[method.id as keyof typeof paymentSettings.enabledPaymentMethods] ? 'default' : 'secondary'}>
                      {paymentSettings.enabledPaymentMethods[method.id as keyof typeof paymentSettings.enabledPaymentMethods] ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={paymentSettings.enabledPaymentMethods[method.id as keyof typeof paymentSettings.enabledPaymentMethods]}
                      onCheckedChange={() => handleTogglePaymentMethod(method.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Payout Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Vendor Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorPayoutDelay">Payout Delay (Days)</Label>
              <Input
                id="vendorPayoutDelay"
                type="number"
                value={paymentSettings.vendorPayoutDelay}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, vendorPayoutDelay: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPayoutAmount">Minimum Payout (Rs.)</Label>
              <Input
                id="minPayoutAmount"
                type="number"
                value={paymentSettings.minPayoutAmount}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, minPayoutAmount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instantPayoutFee">Instant Payout Fee (%)</Label>
              <Input
                id="instantPayoutFee"
                type="number"
                step="0.1"
                value={paymentSettings.instantPayoutFee}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, instantPayoutFee: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundProcessingDays">Refund Processing (Days)</Label>
              <Input
                id="refundProcessingDays"
                type="number"
                value={paymentSettings.refundProcessingDays}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, refundProcessingDays: Number(e.target.value) }))}
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Enable Instant Payout</h4>
                <p className="text-sm text-muted-foreground">Allow vendors to receive instant payouts (with fee)</p>
              </div>
              <Switch
                checked={paymentSettings.enableInstantPayout}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableInstantPayout: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Enable Refunds</h4>
                <p className="text-sm text-muted-foreground">Allow users to request refunds</p>
              </div>
              <Switch
                checked={paymentSettings.enableRefunds}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableRefunds: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Auto-Approve Payments</h4>
                <p className="text-sm text-muted-foreground">Automatically approve payments without manual review</p>
              </div>
              <Switch
                checked={paymentSettings.autoApprovePayments}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, autoApprovePayments: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Limits */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Transaction Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTransactionAmount">Maximum Transaction (Rs.)</Label>
              <Input
                id="maxTransactionAmount"
                type="number"
                value={paymentSettings.maxTransactionAmount}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxTransactionAmount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCurrency">Primary Currency</Label>
              <Select value={paymentSettings.primaryCurrency} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, primaryCurrency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (Rs.)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="PKR">Pakistani Rupee (₨)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Fraud Detection</h4>
                <p className="text-sm text-muted-foreground">Enable automatic fraud detection for transactions</p>
              </div>
              <Switch
                checked={paymentSettings.enableFraudDetection}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableFraudDetection: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Require KYC</h4>
                <p className="text-sm text-muted-foreground">Require Know Your Customer verification for large transactions</p>
              </div>
              <Switch
                checked={paymentSettings.requireKYC}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, requireKYC: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Payment Verification</h4>
                <p className="text-sm text-muted-foreground">Require manual verification for all payments</p>
              </div>
              <Switch
                checked={paymentSettings.requirePaymentVerification}
                onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, requirePaymentVerification: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Email Payment Notifications</h4>
              <p className="text-sm text-muted-foreground">Send email notifications for payment events</p>
            </div>
            <Switch
              checked={paymentSettings.emailPaymentNotifications}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, emailPaymentNotifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">SMS Payment Notifications</h4>
              <p className="text-sm text-muted-foreground">Send SMS notifications for payment events</p>
            </div>
            <Switch
              checked={paymentSettings.smsPaymentNotifications}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, smsPaymentNotifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Vendor Payout Notifications</h4>
              <p className="text-sm text-muted-foreground">Notify vendors about payout status</p>
            </div>
            <Switch
              checked={paymentSettings.vendorPayoutNotifications}
              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, vendorPayoutNotifications: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSaveSettings} className="gradient-maroon">
          <Save className="w-4 h-4 mr-2" />
          Save Payment Settings
        </Button>
      </div>
    </div>
  );
}
