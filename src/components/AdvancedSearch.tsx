import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, IndianRupee, Star, Users, Calendar, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';

const allVendors = [
  {
    id: 1,
    name: 'Royal Palace Banquet',
    category: 'Marriage Hall',
    location: 'Delhi',
    rating: 4.8,
    reviews: 234,
    price: 150000,
    capacity: 500,
    verified: true,
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Rahul Photography',
    category: 'Photographer',
    location: 'Mumbai',
    rating: 4.9,
    reviews: 189,
    price: 50000,
    capacity: 0,
    verified: true,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Spice Garden Catering',
    category: 'Caterer',
    location: 'Delhi',
    rating: 4.7,
    reviews: 156,
    price: 800,
    capacity: 1000,
    verified: true,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Glam Studio',
    category: 'Makeup Artist',
    location: 'Bangalore',
    rating: 5.0,
    reviews: 98,
    price: 25000,
    capacity: 0,
    verified: true,
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Mercedes Wedding Cars',
    category: 'Car Service',
    location: 'Mumbai',
    rating: 4.6,
    reviews: 145,
    price: 15000,
    capacity: 0,
    verified: true,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    name: 'Decor Dreams',
    category: 'Decorator',
    location: 'Delhi',
    rating: 4.8,
    reviews: 178,
    price: 75000,
    capacity: 0,
    verified: true,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
  },
];

const categories = [
  'All Categories',
  'Marriage Hall',
  'Photographer',
  'Caterer',
  'Makeup Artist',
  'Car Service',
  'Decorator',
  'Sweet Maker',
];

const cities = [
  'All Cities',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
];

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sponsoredFirst, setSponsoredFirst] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  const filteredVendors = allVendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || vendor.category === selectedCategory;
    const matchesCity = selectedCity === 'All Cities' || vendor.location === selectedCity;
    const matchesPrice = vendor.price >= priceRange[0] && vendor.price <= priceRange[1];
    const matchesRating = vendor.rating >= minRating;
    const matchesVerified = !verifiedOnly || vendor.verified;

    return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesRating && matchesVerified;
  }).sort((a, b) => {
    if (sponsoredFirst && a.sponsored !== b.sponsored) {
      return a.sponsored ? -1 : 1;
    }
    
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Find Your Perfect Vendors</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search and filter from thousands of verified wedding vendors
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glassmorphism sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      className="pl-10"
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Price Range</Label>
                    <span className="text-sm text-primary">
                      Rs.{priceRange[0].toLocaleString()} - Rs.{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200000}
                    step={10000}
                    className="w-full"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <button
                        key={rating}
                        className={`w-full p-2 text-sm rounded-lg border transition-all ${
                          minRating === rating
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-accent'
                        }`}
                        onClick={() => setMinRating(rating)}
                      >
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span>{rating}+</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={verifiedOnly}
                      onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                    />
                    <Label htmlFor="verified" className="cursor-pointer">
                      Verified vendors only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sponsored"
                      checked={sponsoredFirst}
                      onCheckedChange={(checked) => setSponsoredFirst(checked as boolean)}
                    />
                    <Label htmlFor="sponsored" className="cursor-pointer">
                      Show sponsored first
                    </Label>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedCity('All Cities');
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                    setVerifiedOnly(false);
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort and Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredVendors.length} vendors found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendor Cards */}
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className={`hover:shadow-lg transition-all ${
                    vendor.sponsored ? 'border-2 border-accent' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative h-48 md:h-auto">
                        <ImageWithFallback
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                        {vendor.sponsored && (
                          <Badge className="absolute top-4 left-4 gradient-gold">
                            Sponsored
                          </Badge>
                        )}
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="mb-1">{vendor.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{vendor.category}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{vendor.location}</span>
                              </div>
                              {vendor.capacity > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span>{vendor.capacity} guests</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {vendor.verified && (
                            <Badge className="bg-green-600">Verified</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-accent text-accent" />
                            <span>{vendor.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({vendor.reviews} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Starting from</p>
                            <p className="text-xl text-primary">
                              Rs.{vendor.price.toLocaleString()}
                              {vendor.category === 'Caterer' && <span className="text-sm">/plate</span>}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">View Details</Button>
                            <Button className="gradient-maroon">Book Now</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <Card className="glassmorphism">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No vendors found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                      setSelectedCity('All Cities');
                      setPriceRange([0, 200000]);
                      setMinRating(0);
                    }}
                  >
                    Reset All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
