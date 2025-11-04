import { useState } from 'react';
import { MapPin, Users, Star, Calendar, Filter, ChevronRight, Plus, Minus, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { CurrencyIcon } from './ui/currency-icon';
import { useCountry } from '../contexts/CountryContext';

const menuOptions = {
  starters: [
    { id: 1, name: 'Paneer Tikka', price: 150 },
    { id: 2, name: 'Chicken Tikka', price: 200 },
    { id: 3, name: 'Veg Spring Rolls', price: 120 },
    { id: 4, name: 'Fish Fingers', price: 250 },
  ],
  mainCourse: [
    { id: 5, name: 'Butter Chicken', price: 300 },
    { id: 6, name: 'Dal Makhani', price: 150 },
    { id: 7, name: 'Biryani (Veg)', price: 200 },
    { id: 8, name: 'Biryani (Chicken)', price: 280 },
    { id: 9, name: 'Naan/Roti', price: 50 },
  ],
  desserts: [
    { id: 10, name: 'Gulab Jamun', price: 80 },
    { id: 11, name: 'Rasmalai', price: 100 },
    { id: 12, name: 'Ice Cream', price: 90 },
  ],
  beverages: [
    { id: 13, name: 'Soft Drinks', price: 40 },
    { id: 14, name: 'Fresh Juice', price: 60 },
    { id: 15, name: 'Welcome Drink', price: 80 },
  ],
};

const halls = [
  {
    id: 1,
    name: 'Royal Palace Banquet',
    city: 'Mumbai',
    capacity: 500,
    price: 150000,
    rating: 4.8,
    reviews: 124,
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1521543387600-c745f8e83d77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwaGFsbHxlbnwxfHx8fDE3NjA2NDk5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['AC', 'Parking', 'Catering', 'WiFi', 'Stage'],
    description: 'Luxurious banquet hall with modern amenities and elegant decor, perfect for grand celebrations.',
  },
  {
    id: 2,
    name: 'Grand Heritage Hall',
    city: 'Delhi',
    capacity: 800,
    price: 200000,
    rating: 4.9,
    reviews: 156,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6c4?w=800&h=600&fit=crop',
    amenities: ['AC', 'Parking', 'Catering', 'WiFi', 'Rooms'],
    description: 'Grand hall with traditional architecture and modern facilities for memorable weddings.',
  },
  {
    id: 3,
    name: 'Garden Paradise Venue',
    city: 'Bangalore',
    capacity: 300,
    price: 100000,
    rating: 4.7,
    reviews: 98,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    amenities: ['Outdoor', 'Parking', 'Catering', 'Garden'],
    description: 'Beautiful outdoor garden venue with lush greenery and romantic ambiance.',
  },
  {
    id: 4,
    name: 'Crystal Ballroom',
    city: 'Hyderabad',
    capacity: 600,
    price: 175000,
    rating: 4.8,
    reviews: 132,
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop',
    amenities: ['AC', 'Parking', 'Catering', 'WiFi', 'Stage', 'LED'],
    description: 'Elegant ballroom with crystal chandeliers and state-of-the-art lighting systems.',
  },
  {
    id: 5,
    name: 'Majestic Palace',
    city: 'Jaipur',
    capacity: 1000,
    price: 250000,
    rating: 5.0,
    reviews: 187,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1601911212049-dbc6a9439c50?w=800&h=600&fit=crop',
    amenities: ['AC', 'Parking', 'Catering', 'WiFi', 'Heritage', 'Rooms'],
    description: 'Royal heritage property with authentic Rajasthani architecture and royal hospitality.',
  },
  {
    id: 6,
    name: 'Lakeside Resort',
    city: 'Udaipur',
    capacity: 400,
    price: 180000,
    rating: 4.9,
    reviews: 145,
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1513623935135-c896b59073c1?w=800&h=600&fit=crop',
    amenities: ['Lakeside', 'Parking', 'Catering', 'Rooms', 'Boat'],
    description: 'Stunning lakeside venue with breathtaking views and luxury accommodations.',
  },
];

export function HallBooking() {
  const { selectedCountry } = useCountry();
  const [selectedHall, setSelectedHall] = useState<typeof halls[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(100);
  const [selectedMenu, setSelectedMenu] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleMenuItem = (itemId: number) => {
    setSelectedMenu(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const calculateMenuCost = () => {
    const allMenuItems = [
      ...menuOptions.starters,
      ...menuOptions.mainCourse,
      ...menuOptions.desserts,
      ...menuOptions.beverages,
    ];
    return selectedMenu.reduce((total, itemId) => {
      const item = allMenuItems.find(i => i.id === itemId);
      return total + (item ? item.price : 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!selectedHall) return 0;
    const hallCost = selectedHall.price;
    const menuCostPerPerson = calculateMenuCost();
    const totalMenuCost = menuCostPerPerson * guestCount;
    return hallCost + totalMenuCost;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Marriage Halls & Venues</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and book the perfect venue for your dream wedding
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by venue name or location..."
              className="h-12"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px] h-12">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="jaipur">Jaipur</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] h-12">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-300">0-300 guests</SelectItem>
              <SelectItem value="300-500">300-500 guests</SelectItem>
              <SelectItem value="500-800">500-800 guests</SelectItem>
              <SelectItem value="800+">800+ guests</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] h-12">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100000">Under {selectedCountry.currencySymbol}1L</SelectItem>
              <SelectItem value="100000-200000">{selectedCountry.currencySymbol}1L - {selectedCountry.currencySymbol}2L</SelectItem>
              <SelectItem value="200000+">{selectedCountry.currencySymbol}2L+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {halls.length} venues
          </p>
          <Select defaultValue="rating">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Halls Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <Card
              key={hall.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
              onClick={() => setSelectedHall(hall)}
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                {hall.sponsored && (
                  <Badge className="absolute top-4 left-4 gradient-gold">
                    <Crown className="w-3 h-3 mr-1" />
                    Sponsored
                  </Badge>
                )}
                <Badge className="absolute top-4 right-4 bg-white text-foreground">
                  <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                  {hall.rating}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2">{hall.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{hall.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {hall.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyIcon className="w-4 h-4" />
                    <span className="text-primary">{selectedCountry.currencySymbol}{hall.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hall.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {hall.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{hall.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full gradient-maroon">
                  View Details & Book
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Hall Detail Modal with Menu & Calculator */}
      <Dialog open={!!selectedHall} onOpenChange={() => {
        setSelectedHall(null);
        setSelectedMenu([]);
        setGuestCount(100);
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedHall && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {selectedHall.name}
                  {selectedHall.sponsored && (
                    <Badge className="gradient-gold">
                      <Crown className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedHall.image}
                    alt={selectedHall.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span>{selectedHall.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({selectedHall.reviews} reviews)</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedHall.city}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedHall.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-3">Venue Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Max Capacity</span>
                        <span>{selectedHall.capacity} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Venue Rental</span>
                        <span className="text-primary">Rs.{selectedHall.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{selectedHall.city}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHall.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Guest Count */}
                <div>
                  <h3 className="mb-4">Number of Guests</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(Math.max(50, guestCount - 10))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuestCount(Math.min(selectedHall.capacity, guestCount + 10))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-muted-foreground">
                      (Max: {selectedHall.capacity})
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Menu Selection */}
                <div>
                  <h3 className="mb-4">Select Menu (Price per person)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Starters */}
                    <Card className="glassmorphism">
                      <CardHeader>
                        <CardTitle className="text-base">Starters</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {menuOptions.starters.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedMenu.includes(item.id)}
                                onCheckedChange={() => toggleMenuItem(item.id)}
                              />
                              <Label htmlFor={`item-${item.id}`} className="cursor-pointer">
                                {item.name}
                              </Label>
                            </div>
                            <span className="text-sm text-muted-foreground">Rs.{item.price}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Main Course */}
                    <Card className="glassmorphism">
                      <CardHeader>
                        <CardTitle className="text-base">Main Course</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {menuOptions.mainCourse.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedMenu.includes(item.id)}
                                onCheckedChange={() => toggleMenuItem(item.id)}
                              />
                              <Label htmlFor={`item-${item.id}`} className="cursor-pointer">
                                {item.name}
                              </Label>
                            </div>
                            <span className="text-sm text-muted-foreground">Rs.{item.price}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Desserts */}
                    <Card className="glassmorphism">
                      <CardHeader>
                        <CardTitle className="text-base">Desserts</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {menuOptions.desserts.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedMenu.includes(item.id)}
                                onCheckedChange={() => toggleMenuItem(item.id)}
                              />
                              <Label htmlFor={`item-${item.id}`} className="cursor-pointer">
                                {item.name}
                              </Label>
                            </div>
                            <span className="text-sm text-muted-foreground">Rs.{item.price}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Beverages */}
                    <Card className="glassmorphism">
                      <CardHeader>
                        <CardTitle className="text-base">Beverages</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {menuOptions.beverages.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedMenu.includes(item.id)}
                                onCheckedChange={() => toggleMenuItem(item.id)}
                              />
                              <Label htmlFor={`item-${item.id}`} className="cursor-pointer">
                                {item.name}
                              </Label>
                            </div>
                            <span className="text-sm text-muted-foreground">Rs.{item.price}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Cost Calculator */}
                <Card className="gradient-pink border-accent/30">
                  <CardHeader>
                    <CardTitle>Total Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Venue Rental</span>
                      <span>Rs.{selectedHall.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Menu Cost per Person</span>
                      <span>Rs.{calculateMenuCost().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Number of Guests</span>
                      <span>{guestCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Total Menu Cost ({guestCount} × Rs.{calculateMenuCost()})</span>
                      <span>Rs.{(calculateMenuCost() * guestCount).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-xl text-primary">
                      <span>Grand Total</span>
                      <span>Rs.{calculateTotalCost().toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Date Selection */}
                <div>
                  <h3 className="mb-3">Select Date</h3>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border glassmorphism"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gradient-maroon" 
                    disabled={!selectedDate || selectedMenu.length === 0}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - Rs.{calculateTotalCost().toLocaleString()}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Contact Venue
                  </Button>
                </div>

                {(!selectedDate || selectedMenu.length === 0) && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please select a date and at least one menu item to proceed
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
