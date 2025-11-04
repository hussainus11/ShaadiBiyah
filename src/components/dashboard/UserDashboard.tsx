import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Bell, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Heart,
  MessageCircle,
  Camera,
  Utensils,
  Car,
  Building2,
  Music,
  Palette
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WeddingChecklist } from './WeddingChecklist';
import { BookingHistory } from './BookingHistory';
import { VendorSuggestions } from './VendorSuggestions';
import { AIChatbot } from './AIChatbot';

interface DashboardStats {
  daysUntilWedding: number | null;
  budgetRemaining: number | null;
  totalBookings: number;
  unreadNotifications: number;
  completedChecklistItems: number;
  totalChecklistItems: number;
}

interface RecentBooking {
  id: string;
  vendor: {
    businessName: string;
    category: string;
    rating: number;
  };
  service: {
    name: string;
    price: number;
  };
  status: string;
  eventDate: string;
  totalAmount: number;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  dueDate: string | null;
  priority: string;
}

export function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    daysUntilWedding: null,
    budgetRemaining: null,
    totalBookings: 0,
    unreadNotifications: 0,
    completedChecklistItems: 0,
    totalChecklistItems: 0
  });

  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      'VENUE': Building2,
      'CATERER': Utensils,
      'PHOTOGRAPHER': Camera,
      'TRANSPORT': Car,
      'DJ': Music,
      'DECORATOR': Palette
    };
    return icons[category as keyof typeof icons] || Building2;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wedding Dashboard</h1>
            <p className="text-muted-foreground">Manage your wedding planning journey</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {stats.unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                  {stats.unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button className="gradient-pink text-primary">
              <Heart className="w-4 h-4 mr-2" />
              Plan Wedding
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Days Until Wedding</p>
                  <p className="text-2xl font-bold">
                    {stats.daysUntilWedding !== null ? stats.daysUntilWedding : 'Not set'}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Remaining</p>
                  <p className="text-2xl font-bold">
                    ${stats.budgetRemaining?.toLocaleString() || 'Not set'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Checklist Progress</p>
                  <p className="text-2xl font-bold">
                    {stats.totalChecklistItems > 0 
                      ? Math.round((stats.completedChecklistItems / stats.totalChecklistItems) * 100)
                      : 0}%
                  </p>
                  <Progress 
                    value={stats.totalChecklistItems > 0 
                      ? (stats.completedChecklistItems / stats.totalChecklistItems) * 100 
                      : 0} 
                    className="mt-2"
                  />
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="vendors">Find Vendors</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => {
                        const IconComponent = getCategoryIcon(booking.vendor.category);
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <IconComponent className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{booking.vendor.businessName}</p>
                                <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                                <p className="text-xs text-muted-foreground">{booking.eventDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <p className="text-sm font-medium mt-1">${booking.totalAmount}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No bookings yet</p>
                        <Button className="mt-4 gradient-pink text-primary">
                          Start Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Building2 className="w-6 h-6" />
                      Find Venues
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Camera className="w-6 h-6" />
                      Book Photographer
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Utensils className="w-6 h-6" />
                      Catering Services
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Music className="w-6 h-6" />
                      Entertainment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>

          <TabsContent value="checklist">
            <WeddingChecklist />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorSuggestions />
          </TabsContent>

          <TabsContent value="assistant">
            <AIChatbot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}







