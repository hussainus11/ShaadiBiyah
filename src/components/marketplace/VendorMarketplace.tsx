import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  DollarSign,
  Users,
  Camera,
  Utensils,
  Car,
  Building2,
  Music,
  Palette,
  Heart,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { VendorProfile } from './VendorProfile';
import { BookingFlow } from './BookingFlow';
import { CategoryPage } from './CategoryPage';

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  totalReviews: number;
  basePrice?: number;
  profileImage?: string;
  gallery: string[];
  isVerified: boolean;
  user: {
    firstName: string;
    lastName: string;
  };
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

interface FilterOptions {
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
}

interface VendorMarketplaceProps {
  onNavigate?: (page: string) => void;
}

export function VendorMarketplace({ onNavigate }: VendorMarketplaceProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('marketplace_search') || '';
  });
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const savedFilters = localStorage.getItem('marketplace_filters');
    return savedFilters ? JSON.parse(savedFilters) : {
      category: 'all',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: 'all'
    };
  });
  const [currentView, setCurrentView] = useState<'marketplace' | 'profile' | 'booking' | 'category'>('marketplace');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { value: 'VENUE', label: 'Venues', icon: Building2 },
    { value: 'CATERER', label: 'Catering', icon: Utensils },
    { value: 'PHOTOGRAPHER', label: 'Photography', icon: Camera },
    { value: 'TRANSPORT', label: 'Transportation', icon: Car },
    { value: 'DJ', label: 'Entertainment', icon: Music },
    { value: 'DECORATOR', label: 'Decoration', icon: Palette }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj?.icon || Building2;
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj?.label || category;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleBookVendor = (vendorId: string, serviceId?: string) => {
    setSelectedVendor(vendorId);
    setSelectedService(serviceId || null);
    setCurrentView('booking');
  };

  const handleViewProfile = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setCurrentView('profile');
  };

  const handleContactVendor = (vendorId: string) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const handleBackToMarketplace = () => {
    setCurrentView('marketplace');
    setSelectedVendor(null);
    setSelectedService(null);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setCurrentView('category');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    localStorage.setItem('marketplace_search', value);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    localStorage.setItem('marketplace_filters', JSON.stringify(newFilters));
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: 'all'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    localStorage.removeItem('marketplace_search');
    localStorage.removeItem('marketplace_filters');
  };

  const handleBookingComplete = (bookingId: string) => {
    // Handle booking completion
    console.log('Booking completed:', bookingId);
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  useEffect(() => {
    // Fetch vendors from API
    const fetchVendors = async () => {
      try {
        // For now, use mock data since API might not be available
        const mockVendors: Vendor[] = [
          {
            id: '1',
            businessName: 'Royal Palace Venue',
            category: 'VENUE',
            description: 'Luxurious wedding venue with beautiful gardens and modern amenities.',
            location: 'Mumbai, Maharashtra',
            rating: 4.8,
            totalReviews: 156,
            basePrice: 50000,
            profileImage: 'https://images.unsplash.com/photo-1519167758481-83f29c3c4c4e?w=400&h=300&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1519167758481-83f29c3c4c4e?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1519167758481-83f29c3c4c4e?w=400&h=300&fit=crop'
            ],
            isVerified: true,
            user: {
              firstName: 'Raj',
              lastName: 'Sharma'
            },
            services: [
              { name: 'Basic Package', price: 50000, description: 'Basic wedding package' },
              { name: 'Premium Package', price: 75000, description: 'Premium wedding package' }
            ]
          },
          {
            id: '2',
            businessName: 'Delicious Catering',
            category: 'CATERER',
            description: 'Professional catering services with authentic Indian cuisine.',
            location: 'Delhi, NCR',
            rating: 4.6,
            totalReviews: 89,
            basePrice: 25000,
            profileImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'
            ],
            isVerified: true,
            user: {
              firstName: 'Priya',
              lastName: 'Singh'
            },
            services: [
              { name: 'Vegetarian Menu', price: 25000, description: 'Complete vegetarian menu' },
              { name: 'Non-Vegetarian Menu', price: 35000, description: 'Complete non-vegetarian menu' }
            ]
          },
          {
            id: '3',
            businessName: 'Perfect Moments Photography',
            category: 'PHOTOGRAPHER',
            description: 'Professional wedding photography and videography services.',
            location: 'Bangalore, Karnataka',
            rating: 4.9,
            totalReviews: 203,
            basePrice: 40000,
            profileImage: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
            gallery: [
              'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop'
            ],
            isVerified: true,
            user: {
              firstName: 'Arjun',
              lastName: 'Patel'
            },
            services: [
              { name: 'Photography Only', price: 40000, description: 'Wedding photography' },
              { name: 'Photo + Video', price: 60000, description: 'Photography and videography' }
            ]
          }
        ];
        
        setVendors(mockVendors);
        
        // Uncomment when API is ready
        /*
        const response = await fetch('/api/vendors', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setVendors(data.data);
        }
        */
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render different views based on current state
  if (currentView === 'profile' && selectedVendor) {
    return (
      <VendorProfile 
        vendorId={selectedVendor} 
        onNavigate={onNavigate}
        onBack={handleBackToMarketplace}
      />
    );
  }

  if (currentView === 'booking' && selectedVendor) {
    return (
      <BookingFlow 
        vendorId={selectedVendor}
        serviceId={selectedService || undefined}
        onBack={handleBackToMarketplace}
        onComplete={handleBookingComplete}
      />
    );
  }

  if (currentView === 'category' && selectedCategory) {
    return (
      <CategoryPage 
        category={selectedCategory}
        onNavigate={onNavigate}
        onBack={handleBackToMarketplace}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search vendors, services, or locations..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={filters.category} onValueChange={(value) => handleFilterChange({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange({ ...filters, location: e.target.value })}
              />

              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange({ ...filters, minPrice: e.target.value })}
              />

              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange({ ...filters, maxPrice: e.target.value })}
              />

              <Select value={filters.rating} onValueChange={(value) => handleFilterChange({ ...filters, rating: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters} className="text-sm">
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Slider */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.value}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent flex-shrink-0 w-32"
                    onClick={() => handleCategoryClick(category.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-medium">{category.label}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-background to-transparent rounded-full flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-background to-transparent rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const CategoryIcon = getCategoryIcon(vendor.category);
          
          return (
            <Card key={vendor.id} className="glassmorphism hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(vendor.category)}
                      </Badge>
                    </div>
                  </div>
                  {vendor.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Vendor Image */}
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={vendor.profileImage || vendor.gallery[0]}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="icon" variant="secondary" className="w-8 h-8">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {vendor.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(vendor.rating)}
                  </div>
                  <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({vendor.totalReviews} reviews)
                  </span>
                </div>

                {/* Price */}
                {vendor.basePrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium">From ${vendor.basePrice}</span>
                  </div>
                )}

                {/* Services */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {vendor.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service.name}
                      </Badge>
                    ))}
                    {vendor.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendor.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 gradient-pink text-primary"
                    onClick={() => handleBookVendor(vendor.id)}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleContactVendor(vendor.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleViewProfile(vendor.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Vendors
        </Button>
      </div>
    </div>
  );
}

