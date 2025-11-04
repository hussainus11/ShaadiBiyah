import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { DateTimePicker, DatePicker, TimePicker } from '../ui/date-time-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Heart,
  MessageCircle,
  Bell,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  Package,
  Camera,
  Music,
  Gift,
  Shirt,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

interface DashboardFlowProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Booking {
  id: string;
  vendorName: string;
  service: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  location: string;
}

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  status: 'mutual' | 'interested' | 'viewed';
  lastActive: string;
}

interface Notification {
  id: string;
  type: 'booking' | 'match' | 'payment' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function DashboardFlow({ onNavigate, onBack }: DashboardFlowProps) {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'bookings' | 'matches' | 'planning' | 'settings'>('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      vendorName: 'Royal Palace Venue',
      service: 'Wedding Venue',
      date: new Date('2025-12-15'),
      time: '18:00',
      status: 'confirmed',
      amount: 150000,
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      vendorName: 'Delicious Catering',
      service: 'Catering',
      date: new Date('2025-12-15'),
      time: '17:00',
      status: 'pending',
      amount: 75000,
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '3',
      vendorName: 'Perfect Moments Photography',
      service: 'Photography',
      date: new Date('2025-12-15'),
      time: '16:00',
      status: 'confirmed',
      amount: 50000,
      location: 'Mumbai, Maharashtra'
    }
  ]);

  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 28,
      location: 'Delhi, India',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      status: 'mutual',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Neha Patel',
      age: 26,
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
      status: 'interested',
      lastActive: '1 day ago'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your venue booking at Royal Palace has been confirmed',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'match',
      title: 'New Match!',
      message: 'You have a new mutual match with Priya Sharma',
      time: '5 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Reminder',
      message: 'Payment due for photographer booking',
      time: '1 day ago',
    }
  ]);

  // Update data based on user role
  useEffect(() => {
    if (!user) return;
    
    switch (user.role) {
      case 'user':
        // User sees their bookings and matches
        setBookings([
          {
            id: '1',
            vendorName: 'Royal Palace Venue',
            service: 'Wedding Venue',
            date: new Date('2025-12-15'),
            time: '18:00',
            status: 'confirmed',
            amount: 150000,
            location: 'Mumbai, Maharashtra'
          },
          {
            id: '2',
            vendorName: 'Delicious Catering',
            service: 'Catering',
            date: new Date('2025-12-15'),
            time: '17:00',
            status: 'pending',
            amount: 75000,
            location: 'Mumbai, Maharashtra'
          }
        ]);
        setMatches([
          { id: '1', name: 'Priya Sharma', age: 28, location: 'Delhi, India', compatibility: 95, lastSeen: '2 hours ago', online: true },
          { id: '2', name: 'Rahul Kapoor', age: 30, location: 'Mumbai, India', compatibility: 88, lastSeen: '1 day ago', online: false }
        ]);
        setNotifications([
          { id: '1', type: 'booking', title: 'Booking Confirmed', message: 'Your venue booking at Royal Palace has been confirmed', time: '2 hours ago', read: false },
          { id: '2', type: 'match', title: 'New Match!', message: 'You have a new mutual match with Priya Sharma', time: '5 hours ago', read: false },
          { id: '3', type: 'payment', title: 'Payment Reminder', message: 'Payment due for photographer booking', time: '1 day ago', read: true }
        ]);
        break;
      case 'vendor':
        // Vendor sees their customer bookings
        setBookings([
          {
            id: '1',
            vendorName: user.businessName || 'My Business',
            service: 'Wedding Photography',
            date: new Date('2025-12-20'),
            time: '10:00',
            status: 'confirmed',
            amount: 50000,
            location: 'Delhi, India'
          },
          {
            id: '2',
            vendorName: user.businessName || 'My Business',
            service: 'Wedding Photography',
            date: new Date('2025-12-25'),
            time: '09:00',
            status: 'pending',
            amount: 45000,
            location: 'Ahmedabad, Gujarat'
          }
        ]);
        setMatches([]); // Vendors don't have matches
        setNotifications([
          { id: '1', type: 'booking', title: 'New Booking Request', message: 'You have a new booking request from Sneha Patel', time: '1 hour ago', read: false },
          { id: '2', type: 'payment', title: 'Payment Received', message: 'Payment received for booking #1234', time: '3 hours ago', read: true }
        ]);
        break;
      case 'admin':
        // Admin sees platform-wide data
        setBookings([
          {
            id: '1',
            vendorName: 'Royal Palace Venue',
            service: 'Wedding Venue',
            date: new Date('2025-12-15'),
            time: '18:00',
            status: 'confirmed',
            amount: 150000,
            location: 'Mumbai, Maharashtra'
          }
        ]);
        setMatches([]); // Admins don't have matches
        setNotifications([
          { id: '1', type: 'system', title: 'New Vendor Registration', message: 'A new vendor is waiting for approval', time: '30 minutes ago', read: false },
          { id: '2', type: 'system', title: 'System Alert', message: 'High server load detected', time: '2 hours ago', read: true }
        ]);
        break;
    }
  }, [user]);

  const planningTools = [
    { id: 'comparison', name: 'Vendor Comparison', icon: BarChart3, color: 'text-purple-600', desc: 'Compare vendor quotes' },
    { id: 'website', name: 'Wedding Website', icon: Globe, color: 'text-blue-600', desc: 'Create your website' },
    { id: 'seating', name: 'Seating Chart', icon: Users, color: 'text-green-600', desc: 'Plan table seating' },
    { id: 'registry', name: 'Gift Registry', icon: Gift, color: 'text-pink-600', desc: 'Manage gift list' },
    { id: 'music', name: 'Music Playlist', icon: Music, color: 'text-orange-600', desc: 'Curate your playlist' },
    { id: 'outfits', name: 'Outfit Planner', icon: Shirt, color: 'text-indigo-600', desc: 'Plan wedding outfits' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleBookingStatusChange = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  const handleNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const handlePlanningToolClick = (toolId: string) => {
    if (onNavigate) {
      onNavigate(toolId);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">{matches.length}</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">Rs.{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.vendorName}</h3>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(booking.date, 'PPP')} at {booking.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <span className="font-medium">Rs.{booking.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.slice(0, 2).map((match) => (
              <div key={match.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={match.image} />
                  <AvatarFallback>{match.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{match.name}</h3>
                  <p className="text-sm text-muted-foreground">{match.age} years • {match.location}</p>
                  <p className="text-sm text-muted-foreground">Last active: {match.lastActive}</p>
                </div>
                <Badge variant={match.status === 'mutual' ? 'default' : 'secondary'}>
                  {match.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      {/* Add Booking Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <Button onClick={() => onNavigate?.('marketplace')} className="gradient-pink text-primary">
          <Plus className="w-4 h-4 mr-2" />
          Book New Service
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{booking.vendorName}</h3>
                    <p className="text-muted-foreground">{booking.service}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{format(booking.date, 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{booking.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold">Rs.{booking.amount.toLocaleString()}</p>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Matches</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={match.image} />
                  <AvatarFallback>{match.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{match.name}</h3>
                  <p className="text-muted-foreground">{match.age} years • {match.location}</p>
                  <p className="text-sm text-muted-foreground">Last active: {match.lastActive}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={match.status === 'mutual' ? 'default' : 'secondary'}>
                    {match.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPlanning = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Planning Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => handlePlanningToolClick(tool.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-primary/10 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notifications</h2>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={cn(
            "cursor-pointer transition-colors",
            !notification.read && "border-primary/50 bg-primary/5"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your wedding planning journey</p>
      </div>

      {/* Tabs */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="space-y-6">
        <TabsList className={`grid w-full ${user?.role === 'vendor' ? 'grid-cols-4' : user?.role === 'admin' ? 'grid-cols-4' : 'grid-cols-5'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">
            {user?.role === 'vendor' ? 'My Bookings' : user?.role === 'admin' ? 'All Bookings' : 'Bookings'}
          </TabsTrigger>
          {user?.role !== 'vendor' && user?.role !== 'admin' && (
            <TabsTrigger value="matches">Matches</TabsTrigger>
          )}
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="bookings">
          {renderBookings()}
        </TabsContent>

        {user?.role !== 'vendor' && user?.role !== 'admin' && (
          <TabsContent value="matches">
            {renderMatches()}
          </TabsContent>
        )}

        <TabsContent value="planning">
          {renderPlanning()}
        </TabsContent>

        <TabsContent value="settings">
          {renderNotifications()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
