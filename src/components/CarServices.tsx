import { useState } from 'react';
import { Car, MapPin, Calendar, Star, Music, Sparkles, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar as CalendarComponent } from './ui/calendar';
import { CurrencyIcon } from './ui/currency-icon';
import { useCountry } from '../contexts/CountryContext';

const cars = [
  {
    id: 1,
    model: 'Mercedes S-Class',
    type: 'Luxury Sedan',
    city: 'Mumbai',
    pricePerDay: 15000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1684244125501-e14a26e78ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FyJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjA3MDQzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: ['Chauffeur', 'Decoration', 'AC', 'Music System'],
  },
  {
    id: 2,
    model: 'BMW 7 Series',
    type: 'Luxury Sedan',
    city: 'Delhi',
    pricePerDay: 18000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop',
    features: ['Chauffeur', 'Decoration', 'AC', 'Premium Sound'],
  },
  {
    id: 3,
    model: 'Vintage Rolls Royce',
    type: 'Classic Car',
    city: 'Bangalore',
    pricePerDay: 25000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    features: ['Chauffeur', 'Premium Decoration', 'Vintage Style', 'Photography'],
  },
  {
    id: 4,
    model: 'Audi A8',
    type: 'Luxury Sedan',
    city: 'Hyderabad',
    pricePerDay: 16000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&h=600&fit=crop',
    features: ['Chauffeur', 'Decoration', 'AC', 'Music System'],
  },
  {
    id: 5,
    model: 'Range Rover Vogue',
    type: 'Luxury SUV',
    city: 'Jaipur',
    pricePerDay: 20000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
    features: ['Chauffeur', 'Decoration', 'AC', 'Spacious', 'Premium'],
  },
  {
    id: 6,
    model: 'Jaguar XJ',
    type: 'Luxury Sedan',
    city: 'Pune',
    pricePerDay: 17000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    features: ['Chauffeur', 'Decoration', 'AC', 'Luxury Interior'],
  },
];

const baratPackages = [
  {
    id: 1,
    name: 'Royal Barat Package',
    price: 75000,
    includes: ['Luxury Car', 'Dhol Team (8 members)', 'Brass Band', 'Fireworks', 'Flower Decoration'],
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Premium Barat Package',
    price: 120000,
    includes: ['2 Luxury Cars', 'Dhol Team (12 members)', 'Brass Band', 'DJ', 'Fireworks', 'Horse', 'LED Lights'],
    duration: '6 hours',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Grand Barat Package',
    price: 200000,
    includes: ['3 Luxury Cars', 'Dhol Team (15 members)', 'Full Orchestra', 'DJ', 'Professional Fireworks', 'Decorated Horse', 'LED Stage', 'Dancers'],
    duration: '8 hours',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
  },
];

export function CarServices() {
  const { selectedCountry } = useCountry();
  const [selectedCar, setSelectedCar] = useState<typeof cars[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Cars & Barat Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Arrive in style with our luxury cars and complete barat packages
          </p>
        </div>

        <Tabs defaultValue="cars" className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="cars">
              <Car className="w-4 h-4 mr-2" />
              Luxury Cars
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Package className="w-4 h-4 mr-2" />
              Barat Packages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Card
                  key={car.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
                  onClick={() => setSelectedCar(car)}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={car.image}
                      alt={car.model}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {car.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{car.model}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{car.type}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{car.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CurrencyIcon className="w-4 h-4 text-primary" />
                        <span className="text-primary">{selectedCountry.currencySymbol}{car.pricePerDay.toLocaleString()}/day</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {car.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {car.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{car.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full gradient-maroon">
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baratPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent"
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 gradient-gold">
                      {pkg.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-2">{pkg.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <CurrencyIcon className="w-5 h-5 text-primary" />
                      <span className="text-primary text-xl">Rs.{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Package Includes:</p>
                      <ul className="space-y-1">
                        {pkg.includes.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Sparkles className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full gradient-pink text-primary">
                      Select Package
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Dhol Walay Section */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="mb-2">Dhol Walay & Traditional Bands</h2>
                <p className="text-muted-foreground">
                  Add energy to your barat with our professional dhol players
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glassmorphism">
                  <CardContent className="p-6 text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="mb-2">Basic Dhol Team</h3>
                    <p className="text-2xl mb-2 text-primary">Rs.8,000</p>
                    <p className="text-sm text-muted-foreground mb-4">4 dhol players, 2 hours</p>
                    <Button variant="outline" className="w-full">Book Now</Button>
                  </CardContent>
                </Card>

                <Card className="glassmorphism border-2 border-accent">
                  <CardContent className="p-6 text-center">
                    <Badge className="mb-4 gradient-gold">Popular</Badge>
                    <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="mb-2">Premium Dhol Team</h3>
                    <p className="text-2xl mb-2 text-primary">Rs.15,000</p>
                    <p className="text-sm text-muted-foreground mb-4">8 dhol players, 4 hours</p>
                    <Button className="w-full gradient-maroon">Book Now</Button>
                  </CardContent>
                </Card>

                <Card className="glassmorphism">
                  <CardContent className="p-6 text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="mb-2">Grand Brass Band</h3>
                    <p className="text-2xl mb-2 text-primary">Rs.25,000</p>
                    <p className="text-sm text-muted-foreground mb-4">Full band, 6 hours</p>
                    <Button variant="outline" className="w-full">Book Now</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Car Detail Modal */}
      <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCar && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCar.model}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedCar.image}
                    alt={selectedCar.model}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span>{selectedCar.rating}</span>
                  </div>
                  <Badge>{selectedCar.type}</Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCar.city}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3">Features Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCar.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glassmorphism p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price per day</span>
                    <span className="text-primary text-2xl">Rs.{selectedCar.pricePerDay.toLocaleString()}</span>
                  </div>
                </div>

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

                <Button className="w-full gradient-maroon" disabled={!selectedDate}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>

                {!selectedDate && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please select a date to proceed
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
