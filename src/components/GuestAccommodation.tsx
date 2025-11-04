import React, { useState } from 'react';
import { Hotel, MapPin, Star, Wifi, Coffee, Car, Utensils, Calendar, Users, IndianRupee, Search, Filter, Heart, Share2, Download, Eye, Phone, Mail, Clock, Shield, CheckCircle, XCircle, Plus, Minus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Award, TrendingUp, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Hotel {
  id: number;
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  images: string[];
  amenities: string[];
  roomTypes: { type: string; price: number; available: number; description: string; size: string; maxOccupancy: number }[];
  description: string;
  policies: string[];
  facilities: string[];
  isFavorited: boolean;
  isBooked: boolean;
  discount: number;
  originalPrice: number;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  groupBookingDiscount: number;
  isVerified: boolean;
  lastUpdated: string;
  totalRooms: number;
  availableRooms: number;
}

interface Booking {
  id: number;
  hotelId: number;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  guests: number;
  totalCost: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: Date;
  specialRequests: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  roomPreference: string;
  specialRequests: string;
  isVip: boolean;
  dietaryRestrictions: string[];
  arrivalTime: string;
  departureTime: string;
}

export function GuestAccommodation() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestsList, setGuestsList] = useState<Guest[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const hotels: Hotel[] = [
    {
      id: 1,
      name: 'Grand Taj Palace',
      location: 'Delhi',
      distance: '2 km from venue',
      rating: 4.8,
      reviews: 456,
      price: 5000,
      originalPrice: 6000,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Breakfast', 'Parking', 'Restaurant', 'Pool', 'Spa', 'Gym', 'Business Center'],
      roomTypes: [
        { type: 'Deluxe Room', price: 5000, available: 12, description: 'Spacious room with city view', size: '35 sq m', maxOccupancy: 2 },
        { type: 'Suite', price: 8000, available: 6, description: 'Luxury suite with separate living area', size: '65 sq m', maxOccupancy: 4 },
        { type: 'Family Room', price: 10000, available: 4, description: 'Perfect for families with children', size: '50 sq m', maxOccupancy: 6 },
      ],
      description: 'Luxury 5-star hotel in the heart of Delhi with world-class amenities and exceptional service.',
      policies: ['Free cancellation up to 24 hours', 'No smoking policy', 'Pet-friendly'],
      facilities: ['24/7 Room Service', 'Concierge', 'Laundry Service', 'Airport Shuttle'],
      isFavorited: false,
      isBooked: false,
      phone: '+91 11 2345 6789',
      email: 'reservations@grandtajpalace.com',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      groupBookingDiscount: 15,
      isVerified: true,
      lastUpdated: '2 hours ago',
      totalRooms: 150,
      availableRooms: 22,
    },
    {
      id: 2,
      name: 'Royal Heritage Hotel',
      location: 'Delhi',
      distance: '1.5 km from venue',
      rating: 4.9,
      reviews: 389,
      price: 6000,
      originalPrice: 7000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Breakfast', 'Spa', 'Restaurant', 'Gym', 'Pool', 'Business Center'],
      roomTypes: [
        { type: 'Standard Room', price: 6000, available: 15, description: 'Comfortable room with modern amenities', size: '30 sq m', maxOccupancy: 2 },
        { type: 'Executive Suite', price: 12000, available: 8, description: 'Premium suite with executive lounge access', size: '55 sq m', maxOccupancy: 3 },
      ],
      description: 'Heritage hotel combining traditional architecture with modern luxury and personalized service.',
      policies: ['Free cancellation up to 48 hours', 'No smoking policy'],
      facilities: ['24/7 Room Service', 'Concierge', 'Laundry Service'],
      isFavorited: false,
      isBooked: false,
      phone: '+91 11 2345 6790',
      email: 'bookings@royalheritage.com',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      groupBookingDiscount: 20,
      isVerified: true,
      lastUpdated: '1 hour ago',
      totalRooms: 100,
      availableRooms: 23,
    },
    {
      id: 3,
      name: 'Comfort Inn',
      location: 'Delhi',
      distance: '3 km from venue',
      rating: 4.5,
      reviews: 234,
      price: 3500,
      originalPrice: 4000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'
      ],
      amenities: ['WiFi', 'Breakfast', 'Parking', 'AC', 'Restaurant'],
      roomTypes: [
        { type: 'Standard Room', price: 3500, available: 20, description: 'Clean and comfortable room', size: '25 sq m', maxOccupancy: 2 },
        { type: 'Double Room', price: 5000, available: 10, description: 'Spacious room with two beds', size: '35 sq m', maxOccupancy: 4 },
      ],
      description: 'Budget-friendly hotel with essential amenities and comfortable accommodations.',
      policies: ['Free cancellation up to 24 hours', 'No smoking policy'],
      facilities: ['24/7 Front Desk', 'Laundry Service'],
      isFavorited: false,
      isBooked: false,
      phone: '+91 11 2345 6791',
      email: 'info@comfortinn.com',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      groupBookingDiscount: 10,
      isVerified: false,
      lastUpdated: '30 minutes ago',
      totalRooms: 80,
      availableRooms: 30,
    },
  ];

  // Filter and sort hotels
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = searchQuery === '' || 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === '' || hotel.location === selectedCity;
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
    
    return matchesSearch && matchesCity && matchesPrice && matchesAmenities;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  // Handle booking functionality
  const handleBooking = (hotelId: number) => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (!rooms || parseInt(rooms) <= 0) {
      toast.error('Please select number of rooms');
      return;
    }

    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return;

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = hotel.price * nights * parseInt(rooms);
    
    const newBooking: Booking = {
      id: Date.now(),
      hotelId,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      rooms: parseInt(rooms),
      guests: parseInt(guests) || 2,
      totalCost,
      status: 'confirmed',
      bookingDate: new Date(),
      specialRequests: '',
      contactInfo: {
        name: '',
        email: '',
        phone: ''
      }
    };

    setBookings([...bookings, newBooking]);
    toast.success('Hotel rooms booked successfully!');
  };

  // Handle favorite toggle
  const toggleFavorite = (hotelId: number) => {
    setFavorites(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
    toast.success(favorites.includes(hotelId) ? 'Removed from favorites' : 'Added to favorites');
  };

  // Handle hotel details view
  const viewHotelDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowHotelDetails(true);
  };

  // Handle booking dialog
  const openBookingDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBookingDialog(true);
  };

  // Handle guest management
  const addGuest = (guest: Guest) => {
    setGuestsList([...guestsList, guest]);
    toast.success('Guest added successfully!');
  };

  // Handle export functionality
  const exportBookings = () => {
    setShowExportDialog(true);
    toast.success('Preparing export...');
  };

  // Handle share functionality
  const shareBookings = () => {
    setShowShareDialog(true);
    toast.success('Share options ready');
  };

  // Calculate total cost with discounts
  const getTotalCost = (hotel: Hotel) => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const roomCount = parseInt(rooms) || 1;
    const baseCost = hotel.price * nights * roomCount;
    const groupDiscount = hotel.groupBookingDiscount || 0;
    return Math.round(baseCost * (1 - groupDiscount / 100));
  };

  // Get available amenities
  const allAmenities = Array.from(new Set(hotels.flatMap(hotel => hotel.amenities)));

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalGuests = guestsList.length;
  const totalCost = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);
  const averageRating = hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length;

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Breakfast': Coffee,
    'Parking': Car,
    'Restaurant': Utensils,
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Enhanced Guest Accommodation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive hotel booking and guest management for your wedding
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-4">
              <Hotel className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{totalBookings}</h3>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{totalGuests}</h3>
              <p className="text-sm text-muted-foreground">Guests</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-4">
              <IndianRupee className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">Rs.{totalCost.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-4">
              <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{averageRating.toFixed(1)}</h3>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="search">Search Hotels</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            {/* Enhanced Search Form */}
            <Card className="glassmorphism mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Find Hotels</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                    >
                      {viewMode === 'list' ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-6 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Hotel name or location..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          {checkIn ? checkIn.toLocaleDateString() : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          {checkOut ? checkOut.toLocaleDateString() : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Guests</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rooms</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                    />
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={20000}
                          step={500}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Sort by</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="distance">Distance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Amenities</Label>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {allAmenities.map(amenity => (
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

                <Button className="w-full md:w-auto gradient-maroon mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Search Hotels
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Hotels List */}
            <div className="space-y-6 mb-8">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="glassmorphism hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="relative h-64 md:h-auto">
                        <ImageWithFallback
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <Badge className="gradient-gold">
                            {hotel.distance}
                          </Badge>
                          {hotel.discount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {hotel.discount}% OFF
                            </Badge>
                          )}
                          {hotel.isVerified && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg"
                            onClick={() => toggleFavorite(hotel.id)}
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(hotel.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg"
                            onClick={() => viewHotelDetails(hotel)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="md:col-span-3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="mb-2 text-xl font-semibold">{hotel.name}</h3>
                            <div className="flex items-center gap-4 text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{hotel.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span>{hotel.rating}</span>
                                <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>Updated {hotel.lastUpdated}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>
                          </div>
                        </div>

                        {/* Enhanced Amenities */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {hotel.amenities.map((amenity) => {
                            const Icon = amenityIcons[amenity];
                            return (
                              <div key={amenity} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                                {Icon && <Icon className="w-4 h-4" />}
                                <span className="text-sm">{amenity}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Enhanced Room Types */}
                        <div className="mb-4">
                          <h4 className="mb-3 text-sm font-semibold">Available Rooms</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            {hotel.roomTypes.map((room) => (
                              <div key={room.type} className="p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                                <p className="text-sm font-medium mb-1">{room.type}</p>
                                <p className="text-xs text-muted-foreground mb-2">{room.description}</p>
                                <p className="text-primary font-semibold mb-1">Rs.{room.price.toLocaleString()}/night</p>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                  <span>{room.size}</span>
                                  <span>{room.available} available</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Max {room.maxOccupancy} guests
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Enhanced Booking Section */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                            <div className="flex items-center gap-2">
                              {hotel.discount > 0 && (
                                <span className="text-sm text-muted-foreground line-through">
                                  Rs.{hotel.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <p className="text-2xl text-primary">Rs.{hotel.price.toLocaleString()}</p>
                              <span className="text-sm text-muted-foreground">per night</span>
                            </div>
                            {hotel.groupBookingDiscount > 0 && (
                              <p className="text-sm text-green-600 mt-1">
                                Group booking: {hotel.groupBookingDiscount}% discount available
                              </p>
                            )}
                            {checkIn && checkOut && rooms && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Total: Rs.{getTotalCost(hotel).toLocaleString()} for{' '}
                                {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => viewHotelDetails(hotel)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              className="gradient-maroon"
                              onClick={() => openBookingDialog(hotel)}
                            >
                              Book Now
                            </Button>
                          </div>
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
                <TabsTrigger value="guests">Guest Management</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings-list" className="mt-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>My Bookings</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={exportBookings}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" onClick={shareBookings}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Hotel className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="mb-2">No bookings yet</h3>
                        <p className="text-muted-foreground">
                          Book hotels for your guests to see them here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <Card key={booking.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{booking.hotelName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.rooms} rooms • {booking.guests} guests
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">Rs.{booking.totalCost.toLocaleString()}</p>
                                <Badge className={booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}>
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

              <TabsContent value="guests" className="mt-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Guest Management</CardTitle>
                      <Button onClick={() => setShowGuestDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Guest
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {guestsList.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="mb-2">No guests added yet</h3>
                        <p className="text-muted-foreground">
                          Add your guests to manage their accommodation preferences
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {guestsList.map((guest) => (
                          <Card key={guest.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{guest.name}</h3>
                                <p className="text-sm text-muted-foreground">{guest.email}</p>
                                <p className="text-sm text-muted-foreground">{guest.phone}</p>
                                {guest.isVip && (
                                  <Badge className="bg-yellow-500 mt-1">VIP</Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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
                      <CardTitle>Booking Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Bookings</span>
                          <span className="font-semibold">{totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Cost</span>
                          <span className="font-semibold">Rs.{totalCost.toLocaleString()}</span>
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
                      <CardTitle>Guest Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Guests</span>
                          <span className="font-semibold">{totalGuests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VIP Guests</span>
                          <span className="font-semibold">{guestsList.filter(g => g.isVip).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dietary Restrictions</span>
                          <span className="font-semibold">{guestsList.filter(g => g.dietaryRestrictions.length > 0).length}</span>
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
              <Hotel className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Group Booking</h4>
              <p className="text-sm text-muted-foreground">
                Special rates for bulk bookings
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Near Venue</h4>
              <p className="text-sm text-muted-foreground">
                Hotels close to wedding venue
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <IndianRupee className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Best Prices</h4>
              <p className="text-sm text-muted-foreground">
                Exclusive wedding discounts
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Guest Management</h4>
              <p className="text-sm text-muted-foreground">
                Track all guest bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Details Dialog */}
        <Dialog open={showHotelDetails} onOpenChange={setShowHotelDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedHotel && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedHotel.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={selectedHotel.image}
                          alt={selectedHotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-sm text-muted-foreground">{selectedHotel.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Contact Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{selectedHotel.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{selectedHotel.email}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Policies</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selectedHotel.policies.map((policy, index) => (
                            <li key={index}>• {policy}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-2xl">
            {selectedHotel && (
              <>
                <DialogHeader>
                  <DialogTitle>Book {selectedHotel.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in Date</Label>
                      <Input type="date" value={checkIn?.toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <Label>Check-out Date</Label>
                      <Input type="date" value={checkOut?.toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Number of Rooms</Label>
                      <Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} />
                    </div>
                    <div>
                      <Label>Number of Guests</Label>
                      <Input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Special Requests</Label>
                    <Textarea placeholder="Any special requirements..." />
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 gradient-maroon" onClick={() => handleBooking(selectedHotel.id)}>
                      Confirm Booking
                    </Button>
                    <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Guest Dialog */}
        <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Guest Name</Label>
                  <Input placeholder="Enter guest name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <Label>Room Preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deluxe">Deluxe Room</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="family">Family Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Special Requests</Label>
                <Textarea placeholder="Any special requirements..." />
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 gradient-maroon">
                  Add Guest
                </Button>
                <Button variant="outline" onClick={() => setShowGuestDialog(false)}>
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
