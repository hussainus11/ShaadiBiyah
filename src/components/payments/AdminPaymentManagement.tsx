import React, { useState } from 'react';
import { 
  CreditCard, IndianRupee, Building2, CheckCircle, Clock, XCircle,
  AlertTriangle, Eye, Send, Download, Filter, Search, RefreshCw,
  TrendingUp, Users, Calendar, Shield, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface VendorPayout {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankBranch: string;
    accountType: string;
  };
  totalEarnings: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  serviceDate: string;
  bookingId: string;
  customerName: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

interface PaymentSummary {
  totalPendingPayouts: number;
  totalProcessingPayouts: number;
  totalCompletedPayouts: number;
  totalPlatformRevenue: number;
  totalVendorEarnings: number;
}

export function AdminPaymentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);

  // Mock vendor payout data
  const vendorPayouts: VendorPayout[] = [
    {
      id: '1',
      vendorId: 'V001',
      vendorName: 'Royal Palace Banquet',
      vendorEmail: 'info@royalpalace.com',
      vendorPhone: '+91 9876543210',
      bankInfo: {
        bankName: 'State Bank of India',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Royal Palace Banquet Pvt Ltd',
        bankBranch: 'Main Branch, Delhi',
        accountType: 'current'
      },
      totalEarnings: 150000,
      platformFee: 12500,
      netAmount: 137500,
      status: 'pending',
      serviceDate: '2025-12-15',
      bookingId: 'BK001234',
      customerName: 'Sanjay Agarwal',
      createdAt: '2025-12-15T10:30:00Z'
    },
    {
      id: '2',
      vendorId: 'V002',
      vendorName: 'Rahul Photography',
      vendorEmail: 'rahul@photography.com',
      vendorPhone: '+91 9876543211',
      bankInfo: {
        bankName: 'HDFC Bank',
        accountNumber: '2345678901',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'Rahul Kapoor',
        bankBranch: 'Andheri Branch, Mumbai',
        accountType: 'savings'
      },
      totalEarnings: 50000,
      platformFee: 4250,
      netAmount: 45750,
      status: 'processing',
      serviceDate: '2025-12-18',
      bookingId: 'BK001235',
      customerName: 'Priya Sharma',
      createdAt: '2025-12-16T15:45:00Z'
    },
    {
      id: '3',
      vendorId: 'V003',
      vendorName: 'Mercedes Premium Cars',
      vendorEmail: 'info@mercedespremium.com',
      vendorPhone: '+91 9876543212',
      bankInfo: {
        bankName: 'ICICI Bank',
        accountNumber: '3456789012',
        ifscCode: 'ICIC0001234',
        accountHolderName: 'Mercedes Premium Cars',
        bankBranch: 'Connaught Place Branch, Delhi',
        accountType: 'current'
      },
      totalEarnings: 15000,
      platformFee: 1275,
      netAmount: 13725,
      status: 'completed',
      serviceDate: '2025-12-10',
      bookingId: 'BK001236',
      customerName: 'Meera Singh',
      createdAt: '2025-12-10T08:00:00Z',
      processedAt: '2025-12-13T14:30:00Z'
    },
    {
      id: '4',
      vendorId: 'V004',
      vendorName: 'Floral Dreams',
      vendorEmail: 'info@floraldreams.com',
      vendorPhone: '+91 9876543213',
      bankInfo: {
        bankName: 'Axis Bank',
        accountNumber: '4567890123',
        ifscCode: 'UTIB0001234',
        accountHolderName: 'Floral Dreams Decorators',
        bankBranch: 'Koramangala Branch, Bangalore',
        accountType: 'business'
      },
      totalEarnings: 25000,
      platformFee: 2125,
      netAmount: 22875,
      status: 'failed',
      serviceDate: '2025-12-12',
      bookingId: 'BK001237',
      customerName: 'Amit Kumar',
      createdAt: '2025-12-12T11:00:00Z',
      failureReason: 'Invalid bank account details'
    }
  ];

  const paymentSummary: PaymentSummary = {
    totalPendingPayouts: vendorPayouts.filter(p => p.status === 'pending').length,
    totalProcessingPayouts: vendorPayouts.filter(p => p.status === 'processing').length,
    totalCompletedPayouts: vendorPayouts.filter(p => p.status === 'completed').length,
    totalPlatformRevenue: vendorPayouts.reduce((sum, p) => sum + p.platformFee, 0),
    totalVendorEarnings: vendorPayouts.reduce((sum, p) => sum + p.netAmount, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      pending: 'secondary',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleProcessPayout = (payoutId: string) => {
    console.log('Processing payout:', payoutId);
    // Implementation for processing payout
  };

  const handleBulkProcessPayouts = () => {
    console.log('Bulk processing payouts:', selectedPayouts);
    // Implementation for bulk processing
  };

  const handleRetryFailedPayout = (payoutId: string) => {
    console.log('Retrying failed payout:', payoutId);
    // Implementation for retrying failed payout
  };

  const filteredPayouts = vendorPayouts.filter(payout => {
    const matchesSearch = payout.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{paymentSummary.totalPendingPayouts}</p>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{paymentSummary.totalProcessingPayouts}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{paymentSummary.totalCompletedPayouts}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">Rs.{paymentSummary.totalPlatformRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Platform Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">Rs.{paymentSummary.totalVendorEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Vendor Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Management */}
      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Vendor Payout Management
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedPayouts.length > 0 && (
                <Button onClick={handleBulkProcessPayouts} className="bg-green-500 hover:bg-green-600">
                  <Send className="w-4 h-4 mr-2" />
                  Process Selected ({selectedPayouts.length})
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search vendors, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payout List */}
          <div className="space-y-4">
            {filteredPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayouts(prev => [...prev, payout.id]);
                        } else {
                          setSelectedPayouts(prev => prev.filter(id => id !== payout.id));
                        }
                      }}
                      className="mr-3"
                    />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{payout.vendorName}</p>
                    <p className="text-sm text-muted-foreground">{payout.bookingId} • {payout.customerName}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{payout.vendorEmail}</span>
                      <span className="text-xs text-muted-foreground">{payout.vendorPhone}</span>
                      <span className="text-xs text-muted-foreground">
                        Service: {new Date(payout.serviceDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Bank Information */}
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-3 h-3 text-green-600" />
                        <span className="font-medium text-gray-700">Bank Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <span className="text-gray-500">Bank:</span>
                          <span className="ml-1 font-medium">{payout.bankInfo.bankName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Account:</span>
                          <span className="ml-1 font-medium">****{payout.bankInfo.accountNumber.slice(-4)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">IFSC:</span>
                          <span className="ml-1 font-medium">{payout.bankInfo.ifscCode}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Holder:</span>
                          <span className="ml-1 font-medium">{payout.bankInfo.accountHolderName}</span>
                        </div>
                      </div>
                    </div>
                    
                    {payout.failureReason && (
                      <p className="text-xs text-red-600 mt-1">Error: {payout.failureReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">Rs.{payout.netAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Fee: Rs.{payout.platformFee.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(payout.status)}
                      {getStatusBadge(payout.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {payout.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleProcessPayout(payout.id)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Process
                      </Button>
                    )}
                    {payout.status === 'failed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-orange-500 border-orange-500 hover:bg-orange-50"
                        onClick={() => handleRetryFailedPayout(payout.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPayouts.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Payouts Found</h3>
              <p className="text-muted-foreground">No vendor payouts match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Payment Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pending Payouts</span>
                <span className="text-sm text-muted-foreground">{paymentSummary.totalPendingPayouts}</span>
              </div>
              <Progress value={(paymentSummary.totalPendingPayouts / filteredPayouts.length) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Processing</span>
                <span className="text-sm text-muted-foreground">{paymentSummary.totalProcessingPayouts}</span>
              </div>
              <Progress value={(paymentSummary.totalProcessingPayouts / filteredPayouts.length) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">{paymentSummary.totalCompletedPayouts}</span>
              </div>
              <Progress value={(paymentSummary.totalCompletedPayouts / filteredPayouts.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Fraud Detection</p>
                <p className="text-sm text-muted-foreground">Active monitoring</p>
              </div>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">KYC Verification</p>
                <p className="text-sm text-muted-foreground">Required for large amounts</p>
              </div>
              <Badge className="bg-blue-500 text-white">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">SSL Encryption</p>
                <p className="text-sm text-muted-foreground">256-bit encryption</p>
              </div>
              <Badge className="bg-green-500 text-white">Secure</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
