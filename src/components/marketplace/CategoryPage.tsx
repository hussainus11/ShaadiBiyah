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
  ArrowLeft,
  Grid,
  List
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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

interface CategoryPageProps {
  category: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function CategoryPage({ category, onNavigate, onBack }: CategoryPageProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: 'all'
  });

  const categoryInfo = {
    VENUE: {
      title: 'Wedding Venues',
      description: 'Find the perfect venue for your special day',
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    CATERER: {
      title: 'Catering Services',
      description: 'Delicious cuisine for your wedding celebration',
      icon: Utensils,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    PHOTOGRAPHER: {
      title: 'Photography & Videography',
      description: 'Capture your precious moments beautifully',
      icon: Camera,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    TRANSPORT: {
      title: 'Transportation',
      description: 'Luxury vehicles for your wedding day',
      icon: Car,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    DJ: {
      title: 'Entertainment',
      description: 'Music and entertainment for your celebration',
      icon: Music,
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    },
    DECORATOR: {
      title: 'Decoration',
      description: 'Beautiful decorations to make your day special',
      icon: Palette,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo];

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
    if (onNavigate) {
      onNavigate('booking');
    }
  };

  const handleViewProfile = (vendorId: string) => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const handleContactVendor = (vendorId: string) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Mock data for now
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
            gallery: ['https://images.unsplash.com/photo-1519167758481-83f29c3c4c4e?w=400&h=300&fit=crop'],
            isVerified: true,
            user: { firstName: 'Raj', lastName: 'Sharma' },
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
            gallery: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'],
            isVerified: true,
            user: { firstName: 'Priya', lastName: 'Singh' },
            services: [
              { name: 'Vegetarian Menu', price: 25000, description: 'Complete vegetarian menu' },
              { name: 'Non-Vegetarian Menu', price: 35000, description: 'Complete non-vegetarian menu' }
            ]
          }
        ];
        
        setVendors(mockVendors);
        
        // Uncomment when API is ready
        /*
        const response = await fetch(`/api/vendors?category=${category}`, {
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
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className={`p-3 ${currentCategory.bg} rounded-lg`}>
              <currentCategory.icon className={`w-6 h-6 ${currentCategory.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentCategory.title}</h1>
              <p className="text-muted-foreground">{currentCategory.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${currentCategory.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />

              <Input
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />

              <Input
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />

              <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
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

            {/* Sort */}
            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="reviews">Sort by Reviews</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                {vendors.length} vendors found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="glassmorphism hover:shadow-lg transition-shadow">
            {viewMode === 'grid' ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <currentCategory.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {currentCategory.title}
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
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={vendor.profileImage || vendor.gallery[0]}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{vendor.businessName}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {vendor.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            {renderStars(vendor.rating)}
                            <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{vendor.location}</span>
                          </div>
                          {vendor.basePrice && (
                            <div className="flex items-center gap-1 text-sm">
                              <DollarSign className="w-3 h-3 text-green-500" />
                              <span className="font-medium">From ${vendor.basePrice}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {vendor.isVerified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Verified
                          </Badge>
                        )}
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
                        <Button 
                          className="gradient-pink text-primary"
                          onClick={() => handleBookVendor(vendor.id)}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
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
