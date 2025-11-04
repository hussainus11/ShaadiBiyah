import React, { useState } from 'react';
import { Eye, Maximize2, Navigation, MapPin, Star, Users, Calendar, Heart, Share2, Download, Search, Filter, Clock, Phone, Mail, CheckCircle, XCircle, Plus, Minus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Award, TrendingUp, Zap, Camera, Video, Play, Pause, Volume2, VolumeX, RotateCcw, ZoomIn, ZoomOut, Move, Layers, Settings, Wifi, Car, Utensils, Coffee, Shield, IndianRupee, Bookmark, BookmarkCheck, MessageCircle, ThumbsUp, ThumbsDown, Flag, AlertCircle, Info, ExternalLink, RefreshCw, Copy, Check, Send, User, UserPlus, Map, Compass, Globe, Home, Building, TreePine, Mountain, Waves, Sun, Moon, Cloud, CloudRain, Snowflake, Wind, Thermometer, Droplets, Battery, Signal } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Venue {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  capacity: number;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  virtualTour: boolean;
  isVerified: boolean;
  isOnline: boolean;
  lastUpdated: string;
  distance: number;
  discount: number;
  category: string;
  features: string[];
  policies: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  availability: {
    isAvailable: boolean;
    nextAvailable: string;
    bookedDates: string[];
  };
  virtualTourData: {
    hotspots: Array<{
      id: string;
      position: { x: number; y: number };
      title: string;
      description: string;
      type: 'info' | 'gallery' | 'video' | 'audio';
    }>;
    audioGuide: boolean;
    duration: number;
    quality: 'HD' | '4K' | '8K';
  };
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
  }>;
  similarVenues: number[];
}

interface TourBooking {
  id: number;
  venueId: number;
  venueName: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  type: 'virtual' | 'in-person' | 'hybrid';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface SavedVenue {
  id: number;
  venueId: number;
  savedAt: string;
  notes: string;
  tags: string[];
}

interface TourSession {
  id: string;
  venueId: number;
  startTime: string;
  duration: number;
  participants: number;
  isActive: boolean;
  currentView: {
    angle: number;
    zoom: number;
    hotspot: string | null;
  };
}

export function VirtualVenueTours() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [viewAngle, setViewAngle] = useState(0);
  const [savedVenues, setSavedVenues] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [savedVenuesList, setSavedVenuesList] = useState<SavedVenue[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [currentTourSession, setCurrentTourSession] = useState<TourSession | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonVenues, setComparisonVenues] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [favoriteVenues, setFavoriteVenues] = useState<number[]>([]);
  const [recentTours, setRecentTours] = useState<number[]>([]);
  const [recommendedVenues, setRecommendedVenues] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    autoPlay: true,
    showTooltips: true,
    enableNotifications: true,
    quality: '4K' as 'HD' | '4K' | '8K',
    language: 'en',
    theme: 'light' as 'light' | 'dark' | 'auto'
  });

  const venues: Venue[] = [
    {
      id: 1,
      name: 'Royal Palace Banquet',
      location: 'Delhi',
      rating: 4.8,
      reviewCount: 234,
      capacity: 500,
      price: 150000,
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
      ],
      description: 'Elegant banquet hall with stunning crystal chandeliers and marble flooring',
      amenities: ['AC Halls', 'Parking', 'Catering', 'DJ Setup', 'Decoration'],
      virtualTour: true,
      isVerified: true,
      isOnline: true,
      lastUpdated: '2 hours ago',
      distance: 5.2,
      discount: 15,
      category: 'Banquet Hall',
      features: ['Crystal Chandeliers', 'Marble Flooring', 'Royal Décor', 'Premium Sound System'],
      policies: ['No outside food', 'Advance booking required', 'Security deposit needed'],
      contact: {
        phone: '+91 98765 43210',
        email: 'info@royalpalace.com',
        website: 'www.royalpalace.com'
      },
      availability: {
        isAvailable: true,
        nextAvailable: '2024-02-15',
        bookedDates: ['2024-02-10', '2024-02-12']
      },
      virtualTourData: {
        hotspots: [
          { id: '1', position: { x: 30, y: 40 }, title: 'Main Hall', description: 'Spacious main hall with crystal chandeliers', type: 'info' },
          { id: '2', position: { x: 70, y: 60 }, title: 'Stage Area', description: 'Elevated stage for ceremonies', type: 'gallery' },
          { id: '3', position: { x: 50, y: 80 }, title: 'Dining Area', description: 'Elegant dining setup', type: 'video' }
        ],
        audioGuide: true,
        duration: 15,
        quality: '4K'
      },
      reviews: [
        { id: 1, user: 'Priya Sharma', rating: 5, comment: 'Absolutely stunning venue!', date: '2024-01-15', helpful: 12 },
        { id: 2, user: 'Raj Kumar', rating: 4, comment: 'Great service and beautiful ambiance', date: '2024-01-10', helpful: 8 }
      ],
      similarVenues: [2, 3]
    },
    {
      id: 2,
      name: 'Grand Heritage Lawn',
      location: 'Mumbai',
      rating: 4.9,
      reviewCount: 189,
      capacity: 800,
      price: 200000,
      images: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
      ],
      description: 'Beautiful outdoor lawn with garden setting and modern amenities',
      amenities: ['Open Lawn', 'Garden', 'Parking', 'Catering', 'Stage'],
      virtualTour: true,
      isVerified: true,
      isOnline: true,
      lastUpdated: '1 hour ago',
      distance: 8.5,
      discount: 20,
      category: 'Outdoor Lawn',
      features: ['Garden Setting', 'Natural Lighting', 'Outdoor Sound System', 'Weather Protection'],
      policies: ['Weather dependent', 'Outdoor setup only', 'Early booking recommended'],
      contact: {
        phone: '+91 98765 43211',
        email: 'info@grandheritage.com',
        website: 'www.grandheritage.com'
      },
      availability: {
        isAvailable: true,
        nextAvailable: '2024-02-20',
        bookedDates: ['2024-02-14', '2024-02-16']
      },
      virtualTourData: {
        hotspots: [
          { id: '1', position: { x: 25, y: 35 }, title: 'Main Lawn', description: 'Spacious outdoor lawn', type: 'info' },
          { id: '2', position: { x: 60, y: 45 }, title: 'Garden Area', description: 'Beautiful garden setting', type: 'gallery' },
          { id: '3', position: { x: 40, y: 70 }, title: 'Stage Setup', description: 'Outdoor stage for ceremonies', type: 'video' }
        ],
        audioGuide: true,
        duration: 12,
        quality: '4K'
      },
      reviews: [
        { id: 1, user: 'Anita Patel', rating: 5, comment: 'Perfect for outdoor weddings!', date: '2024-01-12', helpful: 15 },
        { id: 2, user: 'Vikram Singh', rating: 4, comment: 'Beautiful natural setting', date: '2024-01-08', helpful: 6 }
      ],
      similarVenues: [1, 3]
    },
    {
      id: 3,
      name: 'Pearl Convention Center',
      location: 'Bangalore',
      rating: 4.7,
      reviewCount: 156,
      capacity: 600,
      price: 175000,
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
      ],
      description: 'Modern convention center with state-of-the-art facilities',
      amenities: ['AC Halls', 'Valet Parking', 'Catering', 'LED Screens', 'WiFi'],
      virtualTour: true,
      isVerified: true,
      isOnline: false,
      lastUpdated: '3 hours ago',
      distance: 12.3,
      discount: 10,
      category: 'Convention Center',
      features: ['Modern Design', 'LED Screens', 'WiFi Connectivity', 'Valet Parking'],
      policies: ['Modern facilities', 'Tech support available', 'Flexible timings'],
      contact: {
        phone: '+91 98765 43212',
        email: 'info@pearlconvention.com',
        website: 'www.pearlconvention.com'
      },
      availability: {
        isAvailable: true,
        nextAvailable: '2024-02-18',
        bookedDates: ['2024-02-11', '2024-02-13']
      },
      virtualTourData: {
        hotspots: [
          { id: '1', position: { x: 35, y: 50 }, title: 'Main Hall', description: 'Modern convention hall', type: 'info' },
          { id: '2', position: { x: 65, y: 30 }, title: 'LED Screen', description: 'Large LED display', type: 'gallery' },
          { id: '3', position: { x: 45, y: 75 }, title: 'Reception Area', description: 'Elegant reception setup', type: 'video' }
        ],
        audioGuide: false,
        duration: 10,
        quality: 'HD'
      },
      reviews: [
        { id: 1, user: 'Suresh Reddy', rating: 4, comment: 'Great modern facilities', date: '2024-01-05', helpful: 9 },
        { id: 2, user: 'Meera Iyer', rating: 5, comment: 'Excellent tech support', date: '2024-01-02', helpful: 11 }
      ],
      similarVenues: [1, 2]
    }
  ];

  // Filtering and sorting logic
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
    const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => venue.amenities.includes(amenity));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesAmenities;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'distance':
        return a.distance - b.distance;
      case 'capacity':
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  // Calculations
  const totalVenues = venues.length;
  const availableVenues = venues.filter(v => v.availability.isAvailable).length;
  const verifiedVenues = venues.filter(v => v.isVerified).length;
  const averageRating = venues.reduce((sum, v) => sum + v.rating, 0) / venues.length;
  const totalBookings = tourBookings.length;
  const savedCount = savedVenues.length;
  const favoriteCount = favoriteVenues.length;

  // All amenities for filtering
  const allAmenities = Array.from(new Set(venues.flatMap(v => v.amenities)));

  // Event handlers
  const handleSaveVenue = (venueId: number) => {
    if (savedVenues.includes(venueId)) {
      setSavedVenues(savedVenues.filter(id => id !== venueId));
      toast.success('Removed from saved venues');
    } else {
      setSavedVenues([...savedVenues, venueId]);
      toast.success('Added to saved venues');
    }
  };

  const handleBookTour = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowBookingDialog(true);
    toast.success(`Booking dialog opened for ${venue.name}!`);
  };

  const handleShare = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowShareDialog(true);
    toast.success('Share options opened!');
  };

  const handleStartTour = (venue: Venue) => {
    const session: TourSession = {
      id: `tour_${Date.now()}`,
      venueId: venue.id,
      startTime: new Date().toISOString(),
      duration: venue.virtualTourData.duration,
      participants: 1,
      isActive: true,
      currentView: {
        angle: 0,
        zoom: 1,
        hotspot: null
      }
    };
    setCurrentTourSession(session);
    setSelectedVenue(venue);
    toast.success(`Virtual tour started for ${venue.name}!`);
  };

  const handleToggleFavorite = (venueId: number) => {
    if (favoriteVenues.includes(venueId)) {
      setFavoriteVenues(favoriteVenues.filter(id => id !== venueId));
      toast.success('Removed from favorites');
    } else {
      setFavoriteVenues([...favoriteVenues, venueId]);
      toast.success('Added to favorites');
    }
  };

  const handleCompareVenues = (venueId: number) => {
    if (comparisonVenues.includes(venueId)) {
      setComparisonVenues(comparisonVenues.filter(id => id !== venueId));
    } else if (comparisonVenues.length < 3) {
      setComparisonVenues([...comparisonVenues, venueId]);
    } else {
      toast.error('You can compare up to 3 venues');
    }
  };

  const handleSubmitBooking = (bookingData: any) => {
    const newBooking: TourBooking = {
      id: Date.now(),
      venueId: selectedVenue!.id,
      venueName: selectedVenue!.name,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      guests: bookingData.guests,
      type: bookingData.type,
      status: 'pending',
      notes: bookingData.notes,
      contactInfo: bookingData.contactInfo
    };
    setTourBookings([...tourBookings, newBooking]);
    setShowBookingDialog(false);
    toast.success('Tour booking submitted successfully!');
  };

  const handleSubmitReview = (reviewData: any) => {
    if (selectedVenue) {
      const newReview = {
        id: Date.now(),
        user: reviewData.user,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      };
      // In a real app, this would update the venue's reviews
      toast.success('Review submitted successfully!');
      setShowReviewDialog(false);
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.success(isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
  };

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.success(audioEnabled ? 'Audio disabled' : 'Audio enabled');
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    toast.success(autoRotate ? 'Auto-rotate disabled' : 'Auto-rotate enabled');
  };

  const handleToggleHotspots = () => {
    setShowHotspots(!showHotspots);
    toast.success(showHotspots ? 'Hotspots hidden' : 'Hotspots shown');
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.1, 0.5));
  };

  const handleResetView = () => {
    setViewAngle(0);
    setZoomLevel(1);
    setSelectedHotspot(null);
    toast.success('View reset');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Tour paused' : 'Tour playing');
  };

  const handleShareVenue = (method: string) => {
    const shareUrl = `${window.location.origin}/venue/${selectedVenue?.id}`;
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=Check out this venue: ${shareUrl}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Venue Recommendation&body=Check out this venue: ${shareUrl}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        break;
    }
    setShowShareDialog(false);
  };

  const handleExportVenue = (format: string) => {
    toast.success(`Venue data exported as ${format.toUpperCase()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 500000]);
    setSelectedAmenities([]);
    setSortBy('rating');
    toast.success('Filters cleared');
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Enhanced Virtual Venue Tours</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Experience wedding venues like never before with immersive 360° virtual tours, 
            AI-powered recommendations, and comprehensive venue analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalVenues}</div>
              <p className="text-sm text-muted-foreground">Total Venues</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{availableVenues}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{verifiedVenues}</div>
              <p className="text-sm text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="explore">Explore Venues</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-6">
            {/* Enhanced Search and Filters */}
            <Card className="glassmorphism mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Find Your Perfect Venue</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                      {viewMode === 'grid' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search venues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Banquet Hall">Banquet Hall</SelectItem>
                      <SelectItem value="Outdoor Lawn">Outdoor Lawn</SelectItem>
                      <SelectItem value="Convention Center">Convention Center</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleClearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="border-t pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2">Price Range</Label>
                        <div className="space-y-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={500000}
                            step={10000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Rs.{priceRange[0].toLocaleString()}</span>
                            <span>Rs.{priceRange[1].toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2">Amenities</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {allAmenities.slice(0, 8).map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={amenity}
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedAmenities([...selectedAmenities, amenity]);
                                  } else {
                                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                  }
                                }}
                              />
                              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Venues Grid */}
            <div className={`grid gap-6 mb-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredVenues.map((venue) => (
                <Card key={venue.id} className="glassmorphism hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            savedVenues.includes(venue.id)
                              ? 'bg-primary'
                              : 'bg-white/80 backdrop-blur-sm'
                          }`}
                          onClick={() => handleSaveVenue(venue.id)}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedVenues.includes(venue.id)
                                ? 'fill-white text-white'
                                : 'text-primary'
                            }`}
                          />
                        </button>
                        <button
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            favoriteVenues.includes(venue.id)
                              ? 'bg-yellow-500'
                              : 'bg-white/80 backdrop-blur-sm'
                          }`}
                          onClick={() => handleToggleFavorite(venue.id)}
                        >
                          <Bookmark
                            className={`w-5 h-5 ${
                              favoriteVenues.includes(venue.id)
                                ? 'fill-white text-white'
                                : 'text-primary'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {venue.isVerified && (
                          <Badge className="gradient-gold">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {venue.virtualTour && (
                          <Badge className="gradient-gold">
                            <Eye className="w-3 h-3 mr-1" />
                            360° Tour
                          </Badge>
                        )}
                        {venue.discount > 0 && (
                          <Badge className="bg-green-500">
                            {venue.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/70 backdrop-blur-sm text-white">
                          <MapPin className="w-3 h-3 mr-1" />
                          {venue.distance} km
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold">{venue.rating}</span>
                          <span className="text-muted-foreground text-sm">({venue.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{venue.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Up to {venue.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{venue.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {venue.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{venue.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting from</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-primary">Rs.{venue.price.toLocaleString()}</p>
                            {venue.discount > 0 && (
                              <p className="text-sm text-muted-foreground line-through">
                                Rs.{Math.round(venue.price / (1 - venue.discount / 100)).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompareVenues(venue.id)}
                          >
                            {comparisonVenues.includes(venue.id) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="gradient-maroon"
                                onClick={() => setSelectedVenue(venue)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Tour
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl w-[90vw] h-[80vh] flex flex-col">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {venue.name}
                                  {venue.isVerified && (
                                    <Badge className="gradient-gold">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </DialogTitle>
                              </DialogHeader>
                              <Tabs defaultValue="tour" className="flex-1 flex flex-col overflow-hidden">
                                <TabsList>
                                  <TabsTrigger value="tour">Virtual Tour</TabsTrigger>
                                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>

                                <TabsContent value="tour" className="flex-1 overflow-hidden">
                                  <div className="relative h-full bg-secondary rounded-lg overflow-hidden">
                                    <ImageWithFallback
                                      src={venue.images[0]}
                                      alt={venue.name}
                                      className="w-full h-full object-cover"
                                      style={{
                                        transform: `perspective(1000px) rotateY(${viewAngle}deg) scale(${zoomLevel})`,
                                        transition: 'transform 0.3s ease',
                                      }}
                                    />
                                    
                                    {/* Hotspots */}
                                    {showHotspots && venue.virtualTourData.hotspots.map((hotspot) => (
                                      <button
                                        key={hotspot.id}
                                        className="absolute w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all"
                                        style={{
                                          left: `${hotspot.position.x}%`,
                                          top: `${hotspot.position.y}%`,
                                        }}
                                        onClick={() => setSelectedHotspot(hotspot.id)}
                                      >
                                        <Info className="w-4 h-4" />
                                      </button>
                                    ))}

                                    {/* Tour Controls */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
                                      <Navigation className="w-5 h-5 text-white" />
                                      <Slider
                                        value={[viewAngle]}
                                        onValueChange={([value]) => setViewAngle(value)}
                                        min={-180}
                                        max={180}
                                        step={10}
                                        className="w-64"
                                      />
                                      <span className="text-white text-sm">{viewAngle}°</span>
                                    </div>

                                    {/* Control Panel */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleToggleFullscreen}
                                      >
                                        <Maximize2 className="w-5 h-5 text-white" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleToggleAudio}
                                      >
                                        {audioEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
                                      </Button>
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleToggleAutoRotate}
                                      >
                                        <RotateCcw className="w-5 h-5 text-white" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleResetView}
                                      >
                                        <RefreshCw className="w-5 h-5 text-white" />
                                      </Button>
                                    </div>

                                    {/* Zoom Controls */}
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleZoomIn}
                                      >
                                        <ZoomIn className="w-5 h-5 text-white" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handleZoomOut}
                                      >
                                        <ZoomOut className="w-5 h-5 text-white" />
                                      </Button>
                                    </div>

                                    {/* Play/Pause Controls */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                      <Button
                                        size="lg"
                                        className="bg-black/70 backdrop-blur-sm hover:bg-black/80"
                                        onClick={handlePlayPause}
                                      >
                                        {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                                      </Button>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="gallery" className="flex-1 overflow-hidden">
                                  <div className="grid grid-cols-2 gap-4 h-full overflow-auto">
                                    {venue.images.map((img, idx) => (
                                      <ImageWithFallback
                                        key={idx}
                                        src={img}
                                        alt={`${venue.name} ${idx + 1}`}
                                        className="w-full h-64 object-cover rounded-lg"
                                      />
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="details" className="flex-1 overflow-hidden">
                                  <div className="space-y-6 h-full overflow-auto">
                                    <div>
                                      <h3 className="mb-2">About</h3>
                                      <p className="text-muted-foreground">{venue.description}</p>
                                    </div>

                                    <div>
                                      <h3 className="mb-3">Features</h3>
                                      <div className="grid md:grid-cols-2 gap-2">
                                        {venue.features.map((feature) => (
                                          <div key={feature} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span>{feature}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="mb-3">Amenities</h3>
                                      <div className="grid md:grid-cols-2 gap-2">
                                        {venue.amenities.map((amenity) => (
                                          <div key={amenity} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span>{amenity}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="mb-3">Policies</h3>
                                      <div className="space-y-2">
                                        {venue.policies.map((policy) => (
                                          <div key={policy} className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                            <span>{policy}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="mb-3">Contact Information</h3>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-lg">
                                          <Phone className="w-8 h-8 mb-2 text-primary" />
                                          <p className="text-sm text-muted-foreground mb-1">Phone</p>
                                          <p>{venue.contact.phone}</p>
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                          <Mail className="w-8 h-8 mb-2 text-primary" />
                                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                                          <p>{venue.contact.email}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-4">
                                      <Button
                                        className="flex-1 gradient-maroon"
                                        onClick={() => handleBookTour(venue)}
                                      >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book Tour
                                      </Button>
                                      <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => handleShare(venue)}
                                      >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </Button>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="reviews" className="flex-1 overflow-hidden">
                                  <div className="space-y-4 h-full overflow-auto">
                                    {venue.reviews.map((review) => (
                                      <Card key={review.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                          <div>
                                            <h4 className="font-semibold">{review.user}</h4>
                                            <div className="flex items-center gap-1">
                                              {[...Array(5)].map((_, i) => (
                                                <Star
                                                  key={i}
                                                  className={`w-4 h-4 ${
                                                    i < review.rating
                                                      ? 'fill-accent text-accent'
                                                      : 'text-muted-foreground'
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <span className="text-sm text-muted-foreground">{review.date}</span>
                                        </div>
                                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                                        <div className="flex items-center gap-4">
                                          <Button variant="ghost" size="sm">
                                            <ThumbsUp className="w-4 h-4 mr-1" />
                                            {review.helpful}
                                          </Button>
                                          <Button variant="ghost" size="sm">
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            Reply
                                          </Button>
                                        </div>
                                      </Card>
                                    ))}
                                    <Button
                                      className="w-full"
                                      onClick={() => setShowReviewDialog(true)}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Write Review
                                    </Button>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            {/* Sub-tabs for Bookings Management */}
            <Tabs defaultValue="bookings-list" className="mb-6">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
                <TabsTrigger value="bookings-list">My Bookings</TabsTrigger>
                <TabsTrigger value="saved">Saved Venues</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings-list" className="mt-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>My Tour Bookings</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tourBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground">
                          Book virtual or in-person tours to see them here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tourBookings.map((booking) => (
                          <Card key={booking.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{booking.venueName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {booking.date} at {booking.time}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.type} • {booking.guests} guests • {booking.duration} min
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  booking.status === 'confirmed' ? 'bg-green-500' :
                                  booking.status === 'pending' ? 'bg-yellow-500' :
                                  booking.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                                }>
                                  {booking.status}
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Saved Venues</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {savedVenues.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="mb-2">No saved venues yet</h3>
                        <p className="text-muted-foreground">
                          Save venues you like to see them here
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {venues.filter(v => savedVenues.includes(v.id)).map((venue) => (
                          <Card key={venue.id} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{venue.name}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveVenue(venue.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{venue.location}</p>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="text-sm">{venue.rating}</span>
                              <span className="text-sm text-muted-foreground">({venue.reviewCount})</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle>Tour Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Tours</span>
                          <span className="font-semibold">{totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saved Venues</span>
                          <span className="font-semibold">{savedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Favorites</span>
                          <span className="font-semibold">{favoriteCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Rating</span>
                          <span className="font-semibold">{averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle>Venue Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Venues</span>
                          <span className="font-semibold">{totalVenues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available</span>
                          <span className="font-semibold">{availableVenues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified</span>
                          <span className="font-semibold">{verifiedVenues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>With Virtual Tours</span>
                          <span className="font-semibold">{venues.filter(v => v.virtualTour).length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

        </Tabs>

        {/* Enhanced Benefits */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Eye className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">360° Views</h4>
              <p className="text-sm text-muted-foreground">
                Complete venue exploration with hotspots
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Maximize2 className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Full Screen</h4>
              <p className="text-sm text-muted-foreground">
                Immersive viewing experience
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Download className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Save & Share</h4>
              <p className="text-sm text-muted-foreground">
                Share with family & friends
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Book Tours</h4>
              <p className="text-sm text-muted-foreground">
                Schedule in-person visits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dialog Components */}
        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book Tour - {selectedVenue?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input id="guests" type="number" min="1" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="type">Tour Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tour type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Tour</SelectItem>
                    <SelectItem value="in-person">In-Person Tour</SelectItem>
                    <SelectItem value="hybrid">Hybrid Tour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Special Notes</Label>
                <Textarea id="notes" placeholder="Any special requirements..." />
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 gradient-maroon" onClick={() => handleSubmitBooking({})}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Tour
                </Button>
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Venue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={`${window.location.origin}/venue/${selectedVenue?.id}`} readOnly />
                  <Button variant="outline" onClick={() => handleShareVenue('copy')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleShareVenue('whatsapp')}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={() => handleShareVenue('email')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Write Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user">Your Name</Label>
                <Input id="user" placeholder="Enter your name" />
              </div>
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-muted-foreground hover:text-accent cursor-pointer" />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea id="comment" placeholder="Share your experience..." />
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 gradient-maroon" onClick={() => handleSubmitReview({})}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
