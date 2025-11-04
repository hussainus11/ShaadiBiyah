import { useState, useEffect } from 'react';
import { 
  User, Heart, Calendar, Users, CreditCard, Bell, Package, MapPin, ChevronRight, 
  Image, Gift, Music, Shirt, BarChart3, Globe, ArrowLeft, Edit3, Save, Settings, Upload, Camera,
  Phone, Mail, Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { VendorComparison } from './VendorComparison';
import { WeddingWebsite } from './WeddingWebsite';
import { SeatingChart } from './SeatingChart';
import { GiftRegistry } from './GiftRegistry';
import { MusicPlaylist } from './MusicPlaylist';
import { OutfitPlanner } from './OutfitPlanner';
import { PhotoGallery } from './PhotoGallery';

interface UserDashboardProps {
  onNavigate?: (page: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('main');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

  // Update userData when user changes
  useEffect(() => {
    setUserData(user);
    setProfileImage(user?.profileImage || null);
  }, [user]);

  // Mock data based on user role - in real app, this would come from API
  const bookings = [
    { id: 1, type: 'Marriage Hall', name: 'Royal Palace Banquet', date: '2025-12-15', status: 'Confirmed', amount: 150000 },
    { id: 2, type: 'Car', name: 'Mercedes S-Class', date: '2025-12-15', status: 'Confirmed', amount: 15000 },
    { id: 3, type: 'Photographer', name: 'Rahul Photography', date: '2025-12-15', status: 'Pending', amount: 50000 },
  ];

  const matches = [
    { id: 1, name: 'Priya Sharma', status: 'Mutual Interest', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 2, name: 'Neha Patel', status: 'Interested', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop' },
  ];

  const notifications = [
    { id: 1, type: 'booking', message: 'Your hall booking is confirmed', time: '2 hours ago' },
    { id: 2, type: 'match', message: 'You have a new match!', time: '5 hours ago' },
    { id: 3, type: 'payment', message: 'Payment reminder for photographer', time: '1 day ago' },
  ];

  const handleSaveProfile = () => {
    // In real app, this would save to API
    setIsEditing(false);
    console.log('Profile saved:', userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setUserData(prev => prev ? { ...prev, profileImage: result } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewBookingDetails = (booking: any) => {
    console.log('View booking details:', booking);
    // In real app, this would navigate to booking details page
    // For now, we'll show a detailed modal or navigate to a booking details view
    setActiveView('booking-details');
  };

  const handleSendMessage = (match: any) => {
    console.log('Send message to:', match.name);
    // In real app, this would open a chat/messaging interface
    // For now, we'll show a messaging interface
    setActiveView('messaging');
  };

  const handleViewMatchProfile = (match: any) => {
    console.log('View match profile:', match);
    // In real app, this would navigate to match profile page
    setActiveView('match-profile');
  };

  const handleViewPaymentHistory = () => {
    console.log('View payment history');
    // Navigate to payments tab or show detailed payment history
    setActiveView('payment-history');
  };

  const handleAddPayment = () => {
    console.log('Add new payment');
    // Show add payment form
    setActiveView('add-payment');
  };

  const handleNavigateToTab = (tabName: string) => {
    console.log('Navigate to tab:', tabName);
    // In a real app, this would switch tabs programmatically
    // For now, we'll show a message about tab switching
    console.log(`Switching to ${tabName} tab`);
  };

  const planningTools = [
    { id: 'comparison', name: 'Vendor Comparison', icon: BarChart3, color: 'text-purple-600', desc: 'Compare vendor quotes' },
    { id: 'website', name: 'Wedding Website', icon: Globe, color: 'text-blue-600', desc: 'Create your website' },
    { id: 'seating', name: 'Seating Chart', icon: Users, color: 'text-green-600', desc: 'Plan table seating' },
    { id: 'registry', name: 'Gift Registry', icon: Gift, color: 'text-pink-600', desc: 'Manage gift list' },
    { id: 'music', name: 'Music Playlist', icon: Music, color: 'text-orange-600', desc: 'Curate your playlist' },
    { id: 'outfits', name: 'Outfit Planner', icon: Shirt, color: 'text-indigo-600', desc: 'Plan wedding outfits' },
    { id: 'photos', name: 'Photo Gallery', icon: Image, color: 'text-red-600', desc: 'Share your photos' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'comparison':
        return <VendorComparison />;
      case 'website':
        return <WeddingWebsite />;
      case 'seating':
        return <SeatingChart />;
      case 'registry':
        return <GiftRegistry />;
      case 'music':
        return <MusicPlaylist />;
      case 'outfits':
        return <OutfitPlanner />;
      case 'photos':
        return <PhotoGallery />;
      case 'booking-details':
        return (
          <div className="space-y-6">
            {/* Booking Header */}
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 gradient-pink rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Royal Palace Banquet</CardTitle>
                      <p className="text-muted-foreground">Marriage Hall Booking</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white px-4 py-2 text-lg">Confirmed</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Booking Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking Details */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-semibold">#BK001234</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Booking Date</span>
                    <span className="font-semibold">December 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Time Slot</span>
                    <span className="font-semibold">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">12 Hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-500 text-white">Confirmed</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-xl">Rs.1,50,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Advance Paid</span>
                    <span className="font-semibold text-green-600">Rs.75,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="font-semibold text-orange-600">Rs.75,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-semibold">UPI Transfer</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-semibold">Dec 10, 2025</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendor Information */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Royal Palace Banquet</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground mb-1">Contact Person</p>
                        <p className="font-semibold">Rajesh Kumar</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-semibold">+91 9876543210</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold">info@royalpalace.com</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Location</p>
                        <p className="font-semibold">Delhi, India</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Included Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Hall Decoration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Sound System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Lighting Setup</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Parking Space</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Security Staff</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Cleaning Service</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Power Backup</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'messaging':
        return (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Priya Sharma</h3>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hi! I saw your profile and I'm really interested in getting to know you better.</p>
                      <p className="text-xs text-muted-foreground mt-1">2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hello Priya! Thank you for reaching out. I'd love to chat with you too.</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">2:32 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Great! What are your interests and hobbies?</p>
                      <p className="text-xs text-muted-foreground mt-1">2:35 PM</p>
                    </div>
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2 pt-4 border-t">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="gradient-maroon">
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'match-profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">Priya Sharma</h1>
                    <p className="text-lg text-muted-foreground">Software Engineer</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-green-500 text-white">Mutual Interest</Badge>
                      <span className="text-sm text-muted-foreground">Age: 28</span>
                      <span className="text-sm text-muted-foreground">Mumbai, India</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="gradient-maroon">
                      <Heart className="w-4 h-4 mr-2" />
                      Send Interest
                    </Button>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-semibold">28 years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-semibold">5'4"</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Education</span>
                    <span className="font-semibold">B.Tech Computer Science</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Profession</span>
                    <span className="font-semibold">Software Engineer</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Income</span>
                    <span className="font-semibold">Rs.8-12 LPA</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-semibold">Mumbai, Maharashtra</span>
                  </div>
                </CardContent>
              </Card>

              {/* Family Information */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Father's Name</span>
                    <span className="font-semibold">Rajesh Sharma</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Father's Occupation</span>
                    <span className="font-semibold">Business</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Mother's Name</span>
                    <span className="font-semibold">Sunita Sharma</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Mother's Occupation</span>
                    <span className="font-semibold">Teacher</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Siblings</span>
                    <span className="font-semibold">1 Brother</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Family Type</span>
                    <span className="font-semibold">Nuclear Family</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interests & Hobbies */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Interests & Hobbies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Hobbies</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Reading</Badge>
                      <Badge variant="secondary">Cooking</Badge>
                      <Badge variant="secondary">Traveling</Badge>
                      <Badge variant="secondary">Photography</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Sports</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Yoga</Badge>
                      <Badge variant="secondary">Swimming</Badge>
                      <Badge variant="secondary">Badminton</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Music</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Classical</Badge>
                      <Badge variant="secondary">Bollywood</Badge>
                      <Badge variant="secondary">Instrumental</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  I am a passionate software engineer who loves to solve complex problems and create innovative solutions. 
                  I believe in maintaining a healthy work-life balance and enjoy spending time with family and friends. 
                  I am looking for a life partner who shares similar values and is ready to grow together in life. 
                  I appreciate good conversations, meaningful relationships, and making memories that last a lifetime.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'payment-history':
        return (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed payment history will be displayed here.</p>
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Marriage Hall Booking</span>
                    <span className="font-semibold">Rs.1,50,000</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Paid on Dec 1, 2025</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Car Service</span>
                    <span className="font-semibold">Rs.15,000</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Paid on Dec 5, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'add-payment':
        return (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Add Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Add a new payment entry.</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Description</label>
                  <input 
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="e.g., Photographer booking"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (Rs.)</label>
                  <input 
                    type="number" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="50000"
                  />
                </div>
                <Button className="gradient-maroon">Add Payment</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return renderMainDashboard();
    }
  };

  const renderMainDashboard = () => (
    <>
      {/* Profile Header */}
      <Card className="glassmorphism mb-8 border-accent/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"} />
              <AvatarFallback>
                {userData?.firstName?.[0] || userData?.businessName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-2">{userData?.firstName || userData?.businessName || 'User'}</h2>
              <p className="text-muted-foreground mb-4">
                {userData?.role === 'user' ? 'Wedding Date: December 15, 2025' : 
                 userData?.role === 'vendor' ? `Business: ${userData?.businessName}` :
                 'Admin Dashboard'}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{userData?.role === 'user' ? 'Wedding Planning Progress' : 'Profile Completion'}</span>
                  <span className="text-primary">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                className="gradient-maroon"
                onClick={() => {
                  // Navigate to profile completion or show completion modal
                  console.log('Complete profile clicked');
                  setIsEditing(true);
                }}
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Section */}
      {isEditing && (
        <Card className="glassmorphism mb-8 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"} />
                    <AvatarFallback>
                      {userData?.firstName?.[0] || userData?.businessName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('profileImage')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {profileImage ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={userData?.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={userData?.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={userData?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={userData?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={userData?.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveProfile} className="gradient-maroon">
                <Save className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card 
          className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
          onClick={() => handleNavigateToTab('bookings')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-primary" />
              <Badge className="gradient-gold">Active</Badge>
            </div>
            <p className="text-2xl mb-1">3</p>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>

        <Card 
          className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
          onClick={() => handleNavigateToTab('matches')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
              <Badge variant="secondary">New</Badge>
            </div>
            <p className="text-2xl mb-1">2</p>
            <p className="text-sm text-muted-foreground">Matches</p>
          </CardContent>
        </Card>

        <Card 
          className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
          onClick={() => handleNavigateToTab('vendors')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">5</p>
            <p className="text-sm text-muted-foreground">Vendors Booked</p>
          </CardContent>
        </Card>

        <Card 
          className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
          onClick={() => handleNavigateToTab('payments')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl mb-1">Rs.2.15L</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Planning Tools */}
      <Card className="glassmorphism mb-8">
        <CardHeader>
          <CardTitle>Your Planning Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {planningTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-accent"
                  onClick={() => setActiveView(tool.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <h4 className="mb-1 text-sm">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5">
          <TabsTrigger value="bookings">
            <Calendar className="w-4 h-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="matches">
            <Heart className="w-4 h-4 mr-2" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="vendors">
            <Users className="w-4 h-4 mr-2" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                onClick={() => handleViewBookingDetails(booking)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1">{booking.name}</h3>
                        <p className="text-sm text-muted-foreground">{booking.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1">Rs.{booking.amount.toLocaleString()}</p>
                      <Badge className={booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewBookingDetails(booking)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matches">
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <Card 
                key={match.id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                onClick={() => handleViewMatchProfile(match)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={match.image} />
                      <AvatarFallback>{match.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="mb-1">{match.name}</h3>
                      <Badge className="gradient-pink text-primary">{match.status}</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="gradient-maroon"
                      onClick={() => handleSendMessage(match)}
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <Card className="glassmorphism">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Vendor Management</h3>
              <p className="text-muted-foreground mb-6">View and manage all your booked vendors</p>
              <Button className="gradient-maroon" onClick={() => setActiveView('comparison')}>
                Compare Vendors
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="glassmorphism">
            <CardContent className="p-8 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Payment History</h3>
              <p className="text-muted-foreground mb-6">Track all your wedding expenses</p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                  <p className="text-xl text-primary">Rs.5,00,000</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Spent</p>
                  <p className="text-xl text-green-600">Rs.2,15,000</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-xl text-orange-600">Rs.2,85,000</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button 
                  className="gradient-maroon"
                  onClick={handleViewPaymentHistory}
                >
                  View Payment History
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleAddPayment}
                >
                  Add Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card 
                key={notif.id} 
                className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                onClick={() => {
                  console.log('Notification clicked:', notif);
                  // Handle notification click - navigate to relevant page
                  if (notif.type === 'booking') {
                    handleViewBookingDetails({ name: 'Sample Booking', type: 'Marriage Hall' });
                  } else if (notif.type === 'match') {
                    handleViewMatchProfile({ name: 'Priya Sharma' });
                  } else if (notif.type === 'payment') {
                    handleViewPaymentHistory();
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 gradient-pink rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeView !== 'main' && (
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setActiveView('main')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        {renderView()}
      </div>
    </div>
  );
}
