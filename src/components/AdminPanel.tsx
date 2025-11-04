import React, { useState } from 'react';
import { 
  Users, Building2, Calendar, TrendingUp, IndianRupee, CheckCircle, Clock, XCircle,
  Shield, Settings, BarChart3, UserCheck, UserX, Eye, Edit, Trash2, Plus,
  Mail, Phone, MapPin, Globe, Crown, Award, AlertTriangle, DollarSign,
  Activity, Database, Server, Bell, FileText, Download, Upload, Search,
  Filter, RefreshCw, Save, X, ChevronDown, Star, Heart, Package, CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { PaymentConfig } from './payments/PaymentConfig';
import { AdminPaymentManagement } from './payments/AdminPaymentManagement';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Platform Statistics
  const platformStats = {
    totalUsers: 15420,
    totalVendors: 850,
    totalBookings: 3250,
    totalRevenue: 12500000,
    pendingApprovals: 42,
    activeBookings: 156,
    platformFee: 8.5, // percentage
    monthlyGrowth: 12.5,
    userSatisfaction: 4.7,
    vendorSatisfaction: 4.6
  };

  // Recent Activities
  const recentActivities = [
    { id: 1, type: 'booking', user: 'Sanjay Agarwal', vendor: 'Royal Palace Banquet', amount: 150000, status: 'Confirmed', date: '2025-12-15', time: '2:30 PM' },
    { id: 2, type: 'vendor_signup', user: 'Grand Heritage Hall', category: 'Marriage Hall', location: 'Delhi', status: 'Pending', date: '2025-12-14', time: '4:15 PM' },
    { id: 3, type: 'user_signup', user: 'Priya Sharma', email: 'priya@email.com', status: 'Active', date: '2025-12-14', time: '1:45 PM' },
    { id: 4, type: 'payment', user: 'Rahul Kapoor', vendor: 'Rahul Photography', amount: 50000, status: 'Completed', date: '2025-12-13', time: '11:20 AM' },
    { id: 5, type: 'review', user: 'Meera Singh', vendor: 'Mercedes Premium Cars', rating: 5, status: 'Published', date: '2025-12-13', time: '9:30 AM' }
  ];

  // Pending Approvals
  const pendingApprovals = [
    { id: 1, type: 'vendor', name: 'Grand Heritage Hall', category: 'Marriage Hall', location: 'Delhi', submitted: '2 days ago', documents: 5 },
    { id: 2, type: 'vendor', name: 'Luxury Cars Delhi', category: 'Car Service', location: 'Delhi', submitted: '1 day ago', documents: 3 },
    { id: 3, type: 'vendor', name: 'Floral Magic', category: 'Decorator', location: 'Mumbai', submitted: '3 hours ago', documents: 4 },
    { id: 4, type: 'service', vendor: 'Royal Palace Banquet', service: 'Premium Wedding Package', price: 120000, submitted: '5 hours ago' },
    { id: 5, type: 'review', user: 'Anonymous User', vendor: 'Rahul Photography', rating: 1, comment: 'Poor service quality', submitted: '1 hour ago' }
  ];

  // Top Performers
  const topVendors = [
    { id: 1, name: 'Royal Palace Banquet', bookings: 125, revenue: 18750000, rating: 4.9, category: 'Marriage Hall', location: 'Delhi', bankInfo: { bankName: 'State Bank of India', accountNumber: '1234567890', ifscCode: 'SBIN0001234', accountHolderName: 'Royal Palace Banquet Pvt Ltd' } },
    { id: 2, name: 'Rahul Photography', bookings: 98, revenue: 4900000, rating: 4.8, category: 'Photography', location: 'Mumbai', bankInfo: { bankName: 'HDFC Bank', accountNumber: '2345678901', ifscCode: 'HDFC0001234', accountHolderName: 'Rahul Kapoor' } },
    { id: 3, name: 'Mercedes Premium Cars', bookings: 87, revenue: 1305000, rating: 4.9, category: 'Car Service', location: 'Delhi', bankInfo: { bankName: 'ICICI Bank', accountNumber: '3456789012', ifscCode: 'ICIC0001234', accountHolderName: 'Mercedes Premium Cars' } },
    { id: 4, name: 'Floral Dreams', bookings: 76, revenue: 2280000, rating: 4.7, category: 'Decoration', location: 'Bangalore', bankInfo: { bankName: 'Axis Bank', accountNumber: '4567890123', ifscCode: 'UTIB0001234', accountHolderName: 'Floral Dreams Decorators' } },
    { id: 5, name: 'Catering King', bookings: 65, revenue: 1950000, rating: 4.8, category: 'Catering', location: 'Pune', bankInfo: { bankName: 'Kotak Mahindra Bank', accountNumber: '5678901234', ifscCode: 'KKBK0001234', accountHolderName: 'Catering King Services' } }
  ];

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'ShaadiBiyah',
    platformFee: 8.5,
    minBookingAmount: 10000,
    maxBookingAmount: 10000000,
    autoApproveVendors: false,
    requireVendorVerification: true,
    enableReviews: true,
    enableMessaging: true,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    supportEmail: 'support@shaadibiyah.com',
    supportPhone: '+91 9876543210'
  });

  // User Management
  const [users, setUsers] = useState([
    { id: 1, name: 'Sanjay Agarwal', email: 'sanjay@email.com', role: 'user', status: 'active', joinDate: '2024-01-15', bookings: 3 },
    { id: 2, name: 'Priya Sharma', email: 'priya@email.com', role: 'user', status: 'active', joinDate: '2024-02-20', bookings: 1 },
    { id: 3, name: 'Rahul Kapoor', email: 'rahul@email.com', role: 'vendor', status: 'active', joinDate: '2024-01-10', bookings: 98 },
    { id: 4, name: 'Meera Singh', email: 'meera@email.com', role: 'user', status: 'suspended', joinDate: '2024-03-05', bookings: 0 }
  ]);

  const handleApproveVendor = (vendorId: number) => {
    console.log('Approving vendor:', vendorId);
    // Implementation for vendor approval
  };

  const handleRejectVendor = (vendorId: number) => {
    console.log('Rejecting vendor:', vendorId);
    // Implementation for vendor rejection
  };

  const handleSuspendUser = (userId: number) => {
    console.log('Suspending user:', userId);
    // Implementation for user suspension
  };

  const handleActivateUser = (userId: number) => {
    console.log('Activating user:', userId);
    // Implementation for user activation
  };

  const handleSaveSettings = () => {
    console.log('Saving platform settings:', platformSettings);
    // Implementation for saving settings
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Platform Administration
              </h1>
              <p className="text-muted-foreground">Complete control over your wedding platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Platform Online</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <Badge className="bg-blue-100 text-blue-800">+{platformStats.monthlyGrowth}%</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-green-500" />
                <Badge className="bg-green-100 text-green-800">{platformStats.pendingApprovals} Pending</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold">{platformStats.totalVendors}</p>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-purple-500" />
                <Badge className="bg-purple-100 text-purple-800">{platformStats.activeBookings} Active</Badge>
              </div>
                <div>
                <p className="text-2xl font-bold">{platformStats.totalBookings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-gold border-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IndianRupee className="w-8 h-8 text-foreground" />
                <Badge className="bg-foreground/20 text-foreground">{platformStats.platformFee}% Fee</Badge>
              </div>
                <div>
                <p className="text-2xl font-bold text-foreground">Rs.{(platformStats.totalRevenue / 10000000).toFixed(1)}Cr</p>
                <p className="text-sm text-foreground/80">Platform Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
            <TabsTrigger value="overview" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview & Users</TabsTrigger>
            <TabsTrigger value="bookings" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Bookings</TabsTrigger>
            <TabsTrigger value="vendors" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Vendors</TabsTrigger>
            <TabsTrigger value="payments" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Payments</TabsTrigger>
            <TabsTrigger value="analytics" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Settings</TabsTrigger>
          </TabsList>

          {/* Overview & Users Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Recent Activities */}
              <Card className="glassmorphism">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activities
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === 'booking' && <Calendar className="w-5 h-5 text-primary" />}
                          {activity.type === 'vendor_signup' && <Building2 className="w-5 h-5 text-green-500" />}
                          {activity.type === 'user_signup' && <Users className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'payment' && <IndianRupee className="w-5 h-5 text-purple-500" />}
                          {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-500" />}
                        </div>
                      <div className="flex-1">
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'booking' && `${activity.vendor} • Rs.${activity.amount?.toLocaleString()}`}
                            {activity.type === 'vendor_signup' && `${activity.category} • ${activity.location}`}
                            {activity.type === 'user_signup' && activity.email}
                            {activity.type === 'payment' && `${activity.vendor} • Rs.${activity.amount?.toLocaleString()}`}
                            {activity.type === 'review' && `${activity.vendor} • ${activity.rating} stars`}
                          </p>
                      </div>
                        <div className="text-right">
                          <Badge variant={activity.status === 'Confirmed' || activity.status === 'Active' || activity.status === 'Completed' || activity.status === 'Published' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Management */}
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Management ({users.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="vendors">Vendors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={user.role === 'vendor' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                        </Badge>
                              <span className="text-xs text-muted-foreground">Joined {user.joinDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{user.bookings} bookings</span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button variant="outline" size="sm" onClick={() => handleSuspendUser(user.id)}>
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleActivateUser(user.id)}>
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-6">
              {/* Booking Statistics */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{platformStats.totalBookings}</p>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{platformStats.activeBookings}</p>
                        <p className="text-sm text-muted-foreground">Active Bookings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">23</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">Rs.{(platformStats.totalRevenue / 10000000).toFixed(1)}Cr</p>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Bookings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      All Bookings
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search bookings..."
                        className="w-64"
                      />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, user: 'Sanjay Agarwal', vendor: 'Royal Palace Banquet', service: 'Premium Wedding Package', amount: 150000, status: 'Confirmed', date: '2025-12-15', time: '10:00 AM - 10:00 PM', contact: '+91 9876543210' },
                      { id: 2, user: 'Priya Sharma', vendor: 'Mercedes Premium Cars', service: 'Luxury Car Service', amount: 15000, status: 'Pending', date: '2025-12-20', time: '8:00 AM - 6:00 PM', contact: '+91 9876543211' },
                      { id: 3, user: 'Rahul Kapoor', vendor: 'Rahul Photography', service: 'Wedding Photography', amount: 50000, status: 'Confirmed', date: '2025-12-18', time: '9:00 AM - 9:00 PM', contact: '+91 9876543212' },
                      { id: 4, user: 'Meera Singh', vendor: 'Floral Dreams', service: 'Wedding Decoration', amount: 25000, status: 'Completed', date: '2025-12-10', time: '6:00 AM - 2:00 PM', contact: '+91 9876543213' },
                      { id: 5, user: 'Amit Kumar', vendor: 'Catering King', service: 'Wedding Catering', amount: 75000, status: 'Cancelled', date: '2025-12-12', time: '11:00 AM - 11:00 PM', contact: '+91 9876543214' }
                    ].map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.user}</p>
                            <p className="text-sm text-muted-foreground">{booking.vendor} • {booking.service}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-muted-foreground">{booking.date}</span>
                              <span className="text-xs text-muted-foreground">{booking.time}</span>
                              <span className="text-xs text-muted-foreground">{booking.contact}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">Rs.{booking.amount.toLocaleString()}</p>
                            <Badge variant={
                              booking.status === 'Confirmed' ? 'default' :
                              booking.status === 'Pending' ? 'secondary' :
                              booking.status === 'Completed' ? 'default' :
                              'destructive'
                            }>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {booking.status === 'Pending' && (
                              <>
                                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'Confirmed' && (
                              <Button size="sm" variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
                                <Clock className="w-4 h-4 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <div className="space-y-6">
              {/* Vendor Statistics */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{platformStats.totalVendors}</p>
                        <p className="text-sm text-muted-foreground">Active Vendors</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{platformStats.pendingApprovals}</p>
                        <p className="text-sm text-muted-foreground">Pending Approvals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">4.7</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Vendor Approvals */}
              <Card className="glassmorphism">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pending Vendor Approvals ({pendingApprovals.filter(a => a.type === 'vendor').length})
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {pendingApprovals.filter(approval => approval.type === 'vendor').map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium">{approval.name}</p>
                            <p className="text-sm text-muted-foreground">{approval.category} • {approval.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">Vendor Registration</Badge>
                              <span className="text-xs text-muted-foreground">Submitted {approval.submitted}</span>
                              <span className="text-xs text-muted-foreground">{approval.documents} documents</span>
                            </div>
                          </div>
                      </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleApproveVendor(approval.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                          <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={() => handleRejectVendor(approval.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              {/* Active Vendors */}
              <Card className="glassmorphism">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Active Vendors
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {topVendors.map((vendor) => (
                      <div key={vendor.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{vendor.name}</p>
                              <p className="text-sm text-muted-foreground">{vendor.category} • {vendor.location}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-muted-foreground">{vendor.bookings} bookings</span>
                                <span className="text-xs text-muted-foreground">Rs.{(vendor.revenue / 100000).toFixed(1)}L revenue</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span className="text-xs">{vendor.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Bank Information */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Bank Information</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Bank:</span>
                              <span className="ml-2 font-medium">{vendor.bankInfo.bankName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Account:</span>
                              <span className="ml-2 font-medium">****{vendor.bankInfo.accountNumber.slice(-4)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">IFSC:</span>
                              <span className="ml-2 font-medium">{vendor.bankInfo.ifscCode}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Holder:</span>
                              <span className="ml-2 font-medium">{vendor.bankInfo.accountHolderName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Tabs defaultValue="management" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="management">Payment Management</TabsTrigger>
                <TabsTrigger value="config">Payment Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="management">
                <AdminPaymentManagement />
              </TabsContent>
              
              <TabsContent value="config">
                <PaymentConfig />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glassmorphism">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Platform Performance
                  </CardTitle>
              </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">User Satisfaction</span>
                      <span className="text-sm text-muted-foreground">{platformStats.userSatisfaction}/5</span>
                    </div>
                    <Progress value={platformStats.userSatisfaction * 20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Vendor Satisfaction</span>
                      <span className="text-sm text-muted-foreground">{platformStats.vendorSatisfaction}/5</span>
                    </div>
                    <Progress value={platformStats.vendorSatisfaction * 20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Growth</span>
                      <span className="text-sm text-muted-foreground">+{platformStats.monthlyGrowth}%</span>
                    </div>
                    <Progress value={platformStats.monthlyGrowth * 4} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Platform Fee</p>
                        <p className="text-sm text-muted-foreground">Commission from bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{platformStats.platformFee}%</p>
                        <p className="text-sm text-muted-foreground">Rs.{(platformStats.totalRevenue * platformStats.platformFee / 100 / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Total Revenue</p>
                        <p className="text-sm text-muted-foreground">All platform transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rs.{(platformStats.totalRevenue / 10000000).toFixed(1)}Cr</p>
                        <p className="text-sm text-muted-foreground">+{platformStats.monthlyGrowth}% this month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Platform Settings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Platform Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platformName">Platform Name</Label>
                      <Input
                        id="platformName"
                        value={platformSettings.platformName}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platformFee">Platform Fee (%)</Label>
                      <Input
                        id="platformFee"
                        type="number"
                        value={platformSettings.platformFee}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformFee: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minBookingAmount">Minimum Booking Amount (Rs.)</Label>
                      <Input
                        id="minBookingAmount"
                        type="number"
                        value={platformSettings.minBookingAmount}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, minBookingAmount: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxBookingAmount">Maximum Booking Amount (Rs.)</Label>
                      <Input
                        id="maxBookingAmount"
                        type="number"
                        value={platformSettings.maxBookingAmount}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxBookingAmount: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Auto-Approve Vendors</h4>
                        <p className="text-sm text-muted-foreground">Automatically approve vendor registrations</p>
                      </div>
                      <Switch
                        checked={platformSettings.autoApproveVendors}
                        onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, autoApproveVendors: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Require Vendor Verification</h4>
                        <p className="text-sm text-muted-foreground">Mandatory verification for all vendors</p>
                      </div>
                      <Switch
                        checked={platformSettings.requireVendorVerification}
                        onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, requireVendorVerification: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Enable Reviews</h4>
                        <p className="text-sm text-muted-foreground">Allow users to review vendors</p>
                      </div>
                      <Switch
                        checked={platformSettings.enableReviews}
                        onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, enableReviews: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Enable Messaging</h4>
                        <p className="text-sm text-muted-foreground">Allow direct messaging between users and vendors</p>
                      </div>
                      <Switch
                        checked={platformSettings.enableMessaging}
                        onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, enableMessaging: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Maintenance Mode</h4>
                        <p className="text-sm text-muted-foreground">Temporarily disable platform for maintenance</p>
                      </div>
                      <Switch
                        checked={platformSettings.maintenanceMode}
                        onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveSettings} className="gradient-maroon">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Support Settings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Support & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={platformSettings.supportEmail}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input
                        id="supportPhone"
                        value={platformSettings.supportPhone}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                  <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                    </div>
                    <Switch
                      checked={platformSettings.emailNotifications}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                  <div>
                      <h4 className="font-semibold">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                    </div>
                    <Switch
                      checked={platformSettings.smsNotifications}
                      onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Management */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    System Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Database Backup
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-red-600">Reset Platform</h4>
                      <p className="text-sm text-muted-foreground">Reset all platform data (irreversible)</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset Platform
                    </Button>
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