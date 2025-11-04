import React, { useState } from 'react';
import { 
  CreditCard, IndianRupee, Calendar, Clock, CheckCircle, XCircle, 
  AlertTriangle, Eye, Download, Filter, Search, RefreshCw,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Payment {
  id: string;
  transactionId: string;
  type: 'booking_payment' | 'vendor_payout' | 'refund' | 'commission';
  amount: number;
  fee: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  description: string;
  user: string;
  vendor?: string;
  bookingId?: string;
  timestamp: string;
  processedAt?: string;
  failureReason?: string;
}

interface PaymentHistoryProps {
  userRole: 'user' | 'vendor' | 'admin';
  userId?: string;
}

export function PaymentHistory({ userRole, userId }: PaymentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock payment data
  const payments: Payment[] = [
    {
      id: '1',
      transactionId: 'TXN123456789',
      type: 'booking_payment',
      amount: 150000,
      fee: 3753,
      totalAmount: 153753,
      status: 'completed',
      method: 'UPI',
      description: 'Royal Palace Banquet - Premium Wedding Package',
      user: 'Sanjay Agarwal',
      vendor: 'Royal Palace Banquet',
      bookingId: 'BK001234',
      timestamp: '2025-12-15T10:30:00Z',
      processedAt: '2025-12-15T10:31:00Z'
    },
    {
      id: '2',
      transactionId: 'TXN123456790',
      type: 'vendor_payout',
      amount: 137500,
      fee: 0,
      totalAmount: 137500,
      status: 'completed',
      method: 'Bank Transfer',
      description: 'Payout to Royal Palace Banquet',
      user: 'System',
      vendor: 'Royal Palace Banquet',
      bookingId: 'BK001234',
      timestamp: '2025-12-18T14:00:00Z',
      processedAt: '2025-12-18T14:05:00Z'
    },
    {
      id: '3',
      transactionId: 'TXN123456791',
      type: 'commission',
      amount: 12500,
      fee: 0,
      totalAmount: 12500,
      status: 'completed',
      method: 'Platform',
      description: 'Platform Commission - Royal Palace Banquet',
      user: 'System',
      vendor: 'Royal Palace Banquet',
      bookingId: 'BK001234',
      timestamp: '2025-12-18T14:00:00Z',
      processedAt: '2025-12-18T14:05:00Z'
    },
    {
      id: '4',
      transactionId: 'TXN123456792',
      type: 'booking_payment',
      amount: 50000,
      fee: 1255,
      totalAmount: 51255,
      status: 'pending',
      method: 'Credit Card',
      description: 'Rahul Photography - Wedding Photography',
      user: 'Priya Sharma',
      vendor: 'Rahul Photography',
      bookingId: 'BK001235',
      timestamp: '2025-12-16T15:45:00Z'
    },
    {
      id: '5',
      transactionId: 'TXN123456793',
      type: 'refund',
      amount: 25000,
      fee: 0,
      totalAmount: 25000,
      status: 'completed',
      method: 'Original Payment Method',
      description: 'Refund for Floral Dreams - Wedding Decoration',
      user: 'Meera Singh',
      vendor: 'Floral Dreams',
      bookingId: 'BK001236',
      timestamp: '2025-12-14T09:20:00Z',
      processedAt: '2025-12-14T09:25:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking_payment':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      case 'vendor_payout':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-orange-500" />;
      case 'commission':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      booking_payment: 'Booking Payment',
      vendor_payout: 'Vendor Payout',
      refund: 'Refund',
      commission: 'Platform Commission'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTotalStats = () => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const totalFees = filteredPayments.reduce((sum, payment) => sum + payment.fee, 0);
    const completedPayments = filteredPayments.filter(p => p.status === 'completed').length;
    const pendingPayments = filteredPayments.filter(p => p.status === 'pending').length;
    
    return { totalAmount, totalFees, completedPayments, pendingPayments };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IndianRupee className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">Rs.{stats.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">Rs.{stats.totalFees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completedPayments}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment History
            </CardTitle>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="booking_payment">Booking Payment</SelectItem>
                <SelectItem value="vendor_payout">Vendor Payout</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {getTypeIcon(payment.type)}
                  </div>
                  <div>
                    <p className="font-medium">{payment.transactionId}</p>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{payment.user}</span>
                      {payment.vendor && <span className="text-xs text-muted-foreground">→ {payment.vendor}</span>}
                      <span className="text-xs text-muted-foreground">{payment.method}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {payment.type === 'refund' ? '-' : '+'}Rs.{payment.totalAmount.toLocaleString()}
                    </p>
                    {payment.fee > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Fee: Rs.{payment.fee.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {payment.status === 'pending' && userRole === 'admin' && (
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Process
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
              <p className="text-muted-foreground">No payments match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
