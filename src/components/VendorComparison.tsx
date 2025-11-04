import { useState } from 'react';
import { Check, X, Plus, Trash2, Star, MapPin, Award, Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CurrencyIcon } from './ui/currency-icon';
import { useCountry } from '../contexts/CountryContext';

const mockVendors = {
  photographers: [
    { id: 1, name: 'Rahul Photography', price: 50000, rating: 4.9, experience: '10 years', city: 'Mumbai', 
      features: ['Cinematic Films', 'Drone Coverage', 'Same Day Edit', 'Photo Album'], 
      capacity: '2 Photographers', availability: 'Available',
      image: 'https://images.unsplash.com/photo-1623783356340-95375aac85ce?w=300&h=300&fit=crop' },
    { id: 2, name: 'Studio Moments', price: 45000, rating: 4.8, experience: '8 years', city: 'Delhi',
      features: ['Candid Photography', 'Pre-Wedding Shoot', 'Photo Album', 'Digital Copies'],
      capacity: '3 Photographers', availability: 'Limited',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&h=300&fit=crop' },
    { id: 3, name: 'Pixel Perfect', price: 60000, rating: 5.0, experience: '12 years', city: 'Bangalore',
      features: ['Traditional & Modern', 'Drone Coverage', 'Same Day Edit', 'Pre-Wedding Shoot', '4K Video'],
      capacity: '4 Photographers', availability: 'Available',
      image: 'https://images.unsplash.com/photo-1606914469633-ed648dacf672?w=300&h=300&fit=crop' },
  ],
  halls: [
    { id: 1, name: 'Royal Palace Banquet', price: 150000, rating: 4.8, experience: '15 years', city: 'Mumbai',
      features: ['AC', 'Parking', 'Catering Available', 'WiFi', 'Stage Setup'],
      capacity: '500 guests', availability: 'Available',
      image: 'https://images.unsplash.com/photo-1521543387600-c745f8e83d77?w=300&h=300&fit=crop' },
    { id: 2, name: 'Grand Heritage Hall', price: 200000, rating: 4.9, experience: '20 years', city: 'Delhi',
      features: ['AC', 'Parking', 'In-house Catering', 'WiFi', 'Premium Decor', 'Rooms'],
      capacity: '800 guests', availability: 'Limited',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6c4?w=300&h=300&fit=crop' },
  ],
  caterers: [
    { id: 1, name: 'Royal Catering', price: 800, rating: 4.7, experience: '12 years', city: 'Mumbai',
      features: ['Multi-Cuisine', 'Live Counters', 'Veg & Non-Veg', 'Desserts'],
      capacity: 'Per Plate', availability: 'Available',
      image: 'https://images.unsplash.com/photo-1733479189782-0d7d1283d019?w=300&h=300&fit=crop' },
    { id: 2, name: 'Taste of Tradition', price: 650, rating: 4.8, experience: '15 years', city: 'Delhi',
      features: ['Traditional Indian', 'Live Stations', 'Customizable Menu', 'Premium Service'],
      capacity: 'Per Plate', availability: 'Available',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop' },
  ],
};

export function VendorComparison() {
  const { selectedCountry } = useCountry();
  const [selectedCategory, setSelectedCategory] = useState('photographers');
  const [comparisonList, setComparisonList] = useState<any[]>([]);

  const currentVendors = mockVendors[selectedCategory as keyof typeof mockVendors] || [];
  const canAddMore = comparisonList.length < 3;

  const addToComparison = (vendor: any) => {
    if (canAddMore && !comparisonList.find(v => v.id === vendor.id)) {
      setComparisonList([...comparisonList, vendor]);
    }
  };

  const removeFromComparison = (vendorId: number) => {
    setComparisonList(comparisonList.filter(v => v.id !== vendorId));
  };

  const allFeatures = Array.from(new Set(comparisonList.flatMap(v => v.features)));

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Vendor Comparison Tool</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare up to 3 vendors side-by-side to make the best choice
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8 flex justify-center">
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            setComparisonList([]);
          }}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photographers">Photographers</SelectItem>
              <SelectItem value="halls">Marriage Halls</SelectItem>
              <SelectItem value="caterers">Caterers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Available Vendors */}
        {comparisonList.length < 3 && (
          <div className="mb-8">
            <h2 className="mb-6">Select Vendors to Compare</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {currentVendors.map((vendor) => {
                const isAdded = comparisonList.find(v => v.id === vendor.id);
                return (
                  <Card key={vendor.id} className={`cursor-pointer hover:shadow-lg transition-all ${isAdded ? 'opacity-50' : ''}`}>
                    <div className="relative h-32">
                      <ImageWithFallback
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-white text-foreground">
                        <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                        {vendor.rating}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="mb-2">{vendor.name}</h4>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{vendor.city}</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                      <Button
                        className="w-full"
                        variant={isAdded ? 'secondary' : 'default'}
                        disabled={isAdded || !canAddMore}
                        onClick={() => addToComparison(vendor)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isAdded ? 'Added' : 'Add to Compare'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {comparisonList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2>Comparison ({comparisonList.length}/3)</h2>
              <Button variant="outline" onClick={() => setComparisonList([])}>
                Clear All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4 min-w-max">
                {/* Header Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full glassmorphism">
                    <CardContent className="p-6 flex items-center justify-center">
                      <h3>Features</h3>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={vendor.id} className="glassmorphism border-2 border-accent/30">
                    <div className="relative h-32">
                      <ImageWithFallback
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeFromComparison(vendor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="mb-2">{vendor.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm">{vendor.rating}</span>
                      </div>
                      <Badge variant="outline" className="mb-2">{vendor.availability}</Badge>
                    </CardContent>
                  </Card>
                ))}

                {/* Price Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full">
                    <CardContent className="p-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <CurrencyIcon className="w-4 h-4 text-primary" />
                        <span>Price</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={`price-${vendor.id}`}>
                    <CardContent className="p-4">
                      <p className="text-xl text-primary">{selectedCountry.currencySymbol}{vendor.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{vendor.capacity}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Location Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full">
                    <CardContent className="p-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Location</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={`location-${vendor.id}`}>
                    <CardContent className="p-4">
                      <p>{vendor.city}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Experience Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full">
                    <CardContent className="p-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Experience</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={`exp-${vendor.id}`}>
                    <CardContent className="p-4">
                      <p>{vendor.experience}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Capacity Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full">
                    <CardContent className="p-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Capacity</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={`cap-${vendor.id}`}>
                    <CardContent className="p-4">
                      <p>{vendor.capacity}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Availability Row */}
                <div className="sticky left-0 bg-background z-10">
                  <Card className="h-full">
                    <CardContent className="p-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Availability</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {comparisonList.map((vendor) => (
                  <Card key={`avail-${vendor.id}`}>
                    <CardContent className="p-4">
                      <Badge className={vendor.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {vendor.availability}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}

                {/* Features Section */}
                <div className="col-span-full mt-4">
                  <h3 className="mb-4">Features & Services</h3>
                </div>

                {allFeatures.map((feature) => (
                  <>
                    <div key={`label-${feature}`} className="sticky left-0 bg-background z-10">
                      <Card className="h-full">
                        <CardContent className="p-4 flex items-center">
                          <p className="text-sm">{feature}</p>
                        </CardContent>
                      </Card>
                    </div>
                    {comparisonList.map((vendor) => (
                      <Card key={`feature-${vendor.id}-${feature}`}>
                        <CardContent className="p-4 flex items-center justify-center">
                          {vendor.features.includes(feature) ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ))}

                {/* Action Buttons */}
                <div className="sticky left-0 bg-background z-10"></div>
                {comparisonList.map((vendor) => (
                  <Card key={`action-${vendor.id}`} className="gradient-maroon">
                    <CardContent className="p-4">
                      <Button className="w-full bg-white text-primary hover:bg-white/90">
                        Select {vendor.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {comparisonList.length === 0 && (
          <Card className="glassmorphism text-center p-12 mt-8">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="mb-2">Start Comparing Vendors</h3>
              <p className="text-muted-foreground mb-6">
                Select vendors from the list above to compare their features, pricing, and services side-by-side
              </p>
              <div className="flex gap-2 justify-center text-sm text-muted-foreground">
                <Badge variant="secondary">Up to 3 vendors</Badge>
                <Badge variant="secondary">Side-by-side comparison</Badge>
                <Badge variant="secondary">Detailed features</Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
