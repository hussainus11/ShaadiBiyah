import React from 'react';
import { Camera, UtensilsCrossed, Sparkles, Palette, Cake, Star, IndianRupee, Shirt, Crown, Hand, Church, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const photographers = [
  {
    id: 1,
    name: 'Rahul Photography',
    city: 'Mumbai',
    experience: '10 years',
    price: 50000,
    rating: 4.9,
    speciality: 'Cinematic Wedding Films',
    image: 'https://images.unsplash.com/photo-1623783356340-95375aac85ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaGVyfGVufDF8fHx8MTc2MDYyMzIyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Studio Moments',
    city: 'Delhi',
    experience: '8 years',
    price: 45000,
    rating: 4.8,
    speciality: 'Candid Photography',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Pixel Perfect',
    city: 'Bangalore',
    experience: '12 years',
    price: 60000,
    rating: 5.0,
    speciality: 'Traditional + Modern',
    image: 'https://images.unsplash.com/photo-1606914469633-ed648dacf672?w=800&h=600&fit=crop',
  },
];

const caterers = [
  {
    id: 1,
    name: 'Royal Catering',
    city: 'Mumbai',
    cuisine: 'Multi-Cuisine',
    pricePerPlate: 800,
    rating: 4.7,
    speciality: 'North Indian Delicacies',
    image: 'https://images.unsplash.com/photo-1733479189782-0d7d1283d019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2F0ZXJpbmclMjBmb29kfGVufDF8fHx8MTc2MDYyMDA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Taste of Tradition',
    city: 'Delhi',
    cuisine: 'Traditional Indian',
    pricePerPlate: 650,
    rating: 4.8,
    speciality: 'Authentic Flavors',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Grand Feast',
    city: 'Jaipur',
    cuisine: 'Rajasthani Special',
    pricePerPlate: 900,
    rating: 4.9,
    speciality: 'Royal Rajasthani Thali',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  },
];

const makeupArtists = [
  {
    id: 1,
    name: 'Glam Studio',
    city: 'Mumbai',
    experience: '7 years',
    price: 25000,
    rating: 4.9,
    speciality: 'Bridal Makeup',
    image: 'https://images.unsplash.com/photo-1625139108082-48bb424c2333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBtYWtldXAlMjBhcnRpc3R8ZW58MXx8fHwxNzYwNzA0MzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Beauty Bliss',
    city: 'Delhi',
    experience: '5 years',
    price: 20000,
    rating: 4.7,
    speciality: 'HD Makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Elegant Touch',
    city: 'Bangalore',
    experience: '10 years',
    price: 30000,
    rating: 5.0,
    speciality: 'Premium Bridal Package',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
  },
];

const decorators = [
  {
    id: 1,
    name: 'Floral Dreams',
    city: 'Mumbai',
    experience: '8 years',
    price: 100000,
    rating: 4.8,
    speciality: 'Floral Decorations',
    image: 'https://images.unsplash.com/photo-1664530140722-7e3bdbf2b870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZGVjb3JhdGlvbiUyMGZsb3dlcnN8ZW58MXx8fHwxNzYwNjI2MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Royal Events',
    city: 'Jaipur',
    experience: '12 years',
    price: 150000,
    rating: 4.9,
    speciality: 'Theme Decorations',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Grand Occasions',
    city: 'Delhi',
    experience: '10 years',
    price: 120000,
    rating: 4.7,
    speciality: 'Luxury Setup',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop',
  },
];

const sweetMakers = [
  {
    id: 1,
    name: 'Sweet Delights',
    city: 'Mumbai',
    experience: '15 years',
    pricePerKg: 800,
    rating: 4.8,
    speciality: 'Traditional Mithai',
    image: 'https://images.unsplash.com/photo-1728910869936-f0ca79a4342d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldCUyMGRlc3NlcnRzfGVufDF8fHx8MTc2MDcwNDM0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Mithai Magic',
    city: 'Delhi',
    experience: '20 years',
    pricePerKg: 900,
    rating: 4.9,
    speciality: 'Premium Sweets',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4a0a4e63?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Golden Sweets',
    city: 'Jaipur',
    experience: '18 years',
    pricePerKg: 750,
    rating: 4.7,
    speciality: 'Rajasthani Sweets',
    image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&h=600&fit=crop',
  },
];

const clothingVendors = [
  {
    id: 1,
    name: 'Bridal Couture',
    city: 'Mumbai',
    experience: '12 years',
    price: 50000,
    rating: 4.9,
    speciality: 'Designer Bridal Lehengas',
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1549872063-e752dd3c88f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjB3ZWRkaW5nJTIwZHJlc3N8ZW58MXx8fHwxNzYwNzA1OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Groom Studio',
    city: 'Delhi',
    experience: '10 years',
    price: 35000,
    rating: 4.8,
    speciality: 'Premium Sherwanis',
    sponsored: false,
    image: 'https://images.unsplash.com/flagged/photo-1567793968404-5174ceab96b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9vbSUyMHdlZGRpbmclMjBzdWl0fGVufDF8fHx8MTc2MDcwNTkwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Royal Wedding Attire',
    city: 'Jaipur',
    experience: '15 years',
    price: 60000,
    rating: 5.0,
    speciality: 'Traditional Rajasthani Wear',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&fit=crop',
  },
];

const horseRental = [
  {
    id: 1,
    name: 'Royal Ghodi Service',
    city: 'Mumbai',
    experience: '8 years',
    price: 25000,
    rating: 4.8,
    speciality: 'Decorated White Horses',
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1654673224218-4c3e4444ec0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWNvcmF0ZWQlMjB3ZWRkaW5nJTIwaG9yc2V8ZW58MXx8fHwxNzYwNzA1OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Heritage Horse Rental',
    city: 'Jaipur',
    experience: '12 years',
    price: 30000,
    rating: 4.9,
    speciality: 'Traditional Marwari Horses',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Premium Ghodi Wala',
    city: 'Delhi',
    experience: '10 years',
    price: 28000,
    rating: 4.7,
    speciality: 'Premium Decorated Horses',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&h=600&fit=crop',
  },
];

const mehndiArtists = [
  {
    id: 1,
    name: 'Bridal Mehndi Studio',
    city: 'Mumbai',
    experience: '15 years',
    price: 5000,
    rating: 4.9,
    speciality: 'Intricate Bridal Designs',
    sponsored: true,
    image: 'https://images.unsplash.com/photo-1564671815722-8a62f853d3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWhuZGklMjBoZW5uYSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA3MDY1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Traditional Henna Art',
    city: 'Jaipur',
    experience: '20 years',
    price: 6000,
    rating: 5.0,
    speciality: 'Rajasthani Traditional Mehndi',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1610735666774-5cbbb2599c90?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Modern Mehndi Designs',
    city: 'Delhi',
    experience: '10 years',
    price: 4500,
    rating: 4.8,
    speciality: 'Arabic & Modern Fusion',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
  },
];

const priests = [
  {
    id: 1,
    name: 'Pandit Sharma Ji',
    city: 'Mumbai',
    experience: '25 years',
    price: 11000,
    rating: 4.9,
    speciality: 'Hindu Vedic Ceremonies',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1732382381262-d422bf31e144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHByaWVzdCUyMHdlZGRpbmclMjBjZXJlbW9ueXxlbnwxfHx8fDE3NjA3MDY1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Maulana Abdul Rahman',
    city: 'Delhi',
    experience: '30 years',
    price: 10000,
    rating: 5.0,
    speciality: 'Muslim Nikah Ceremonies',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Giani Singh',
    city: 'Amritsar',
    experience: '20 years',
    price: 12000,
    rating: 4.8,
    speciality: 'Sikh Anand Karaj',
    sponsored: false,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&h=600&fit=crop',
  },
];

const honeymoonPackages = [
  {
    id: 1,
    name: 'Maldives Paradise',
    duration: '5 Days / 4 Nights',
    price: 150000,
    rating: 4.9,
    includes: ['Flights', '5-Star Resort', 'Meals', 'Water Sports'],
    image: 'https://images.unsplash.com/photo-1760152732578-3f285695eea9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leW1vb24lMjBiZWFjaCUyMHJlc29ydHxlbnwxfHx8fDE3NjA3MDY1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Switzerland Romance',
    duration: '7 Days / 6 Nights',
    price: 250000,
    rating: 5.0,
    includes: ['Flights', 'Hotels', 'Meals', 'City Tours', 'Skiing'],
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Bali Getaway',
    duration: '6 Days / 5 Nights',
    price: 120000,
    rating: 4.8,
    includes: ['Flights', 'Villa Stay', 'Spa', 'Island Tours'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
  },
];

interface OtherServicesProps {
  defaultTab?: string;
  onNavigate?: (page: string, tab?: string) => void;
}

export function OtherServices({ defaultTab, onNavigate }: OtherServicesProps) {
  const { isAuthenticated } = useAuth();

  const handleServiceAction = (action: string, vendor: any, serviceType: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to book services');
      return;
    }

    switch (action) {
      case 'view':
        toast.success(`Viewing ${vendor.name} details`);
        // Navigate to vendor profile or details page
        if (onNavigate) {
          onNavigate('marketplace', 'vendor-profile');
        }
        break;
      case 'book':
        toast.success(`Booking ${vendor.name} for ${serviceType}`);
        // Navigate to booking flow
        if (onNavigate) {
          onNavigate('marketplace', 'booking');
        }
        break;
      case 'menu':
        toast.success(`Viewing menu for ${vendor.name}`);
        break;
      case 'portfolio':
        toast.success(`Viewing portfolio for ${vendor.name}`);
        break;
      case 'order':
        toast.success(`Ordering sweets from ${vendor.name}`);
        break;
      case 'collection':
        toast.success(`Viewing collection from ${vendor.name}`);
        break;
      case 'ghodi':
        toast.success(`Booking Ghodi from ${vendor.name}`);
        break;
      case 'artist':
        toast.success(`Booking Mehndi artist ${vendor.name}`);
        break;
      case 'service':
        toast.success(`Booking service from ${vendor.name}`);
        break;
      case 'details':
        toast.success(`Viewing details for ${vendor.name}`);
        break;
      default:
        toast.info(`Action: ${action} for ${vendor.name}`);
    }
  };
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete your wedding with our professional vendors and services
          </p>
        </div>

        <Tabs defaultValue={defaultTab || "photographers"} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-1">
            <TabsTrigger value="photographers" className="text-xs md:text-sm">
              <Camera className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Photo</span>
            </TabsTrigger>
            <TabsTrigger value="caterers" className="text-xs md:text-sm">
              <UtensilsCrossed className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger value="makeup" className="text-xs md:text-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Makeup</span>
            </TabsTrigger>
            <TabsTrigger value="decorators" className="text-xs md:text-sm">
              <Palette className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Decor</span>
            </TabsTrigger>
            <TabsTrigger value="sweets" className="text-xs md:text-sm">
              <Cake className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Sweets</span>
            </TabsTrigger>
            <TabsTrigger value="clothing" className="text-xs md:text-sm">
              <Shirt className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Attire</span>
            </TabsTrigger>
            <TabsTrigger value="horse" className="text-xs md:text-sm">
              <Crown className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Horse</span>
            </TabsTrigger>
            <TabsTrigger value="mehndi" className="text-xs md:text-sm">
              <Hand className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Mehndi</span>
            </TabsTrigger>
            <TabsTrigger value="priests" className="text-xs md:text-sm">
              <Church className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Priest</span>
            </TabsTrigger>
            <TabsTrigger value="honeymoon" className="text-xs md:text-sm">
              <Plane className="w-3 h-3 md:w-4 md:h-4 md:mr-1" />
              <span className="hidden md:inline">Travel</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photographers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photographers.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('view', vendor, 'Photography')}
                    >
                      View Packages
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="caterers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caterers.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cuisine</span>
                        <span>{vendor.cuisine}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Per Plate</span>
                        <span className="text-primary">Rs.{vendor.pricePerPlate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-pink text-primary"
                      onClick={() => handleServiceAction('menu', vendor, 'Catering')}
                    >
                      View Menu
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="makeup">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {makeupArtists.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('book', vendor, 'Makeup')}
                    >
                      Book Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decorators">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decorators.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-pink text-primary"
                      onClick={() => handleServiceAction('portfolio', vendor, 'Decoration')}
                    >
                      View Portfolio
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sweets">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sweetMakers.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Per Kg</span>
                        <span className="text-primary">Rs.{vendor.pricePerKg}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('order', vendor, 'Sweets')}
                    >
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clothing">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clothingVendors.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    {vendor.sponsored && (
                      <Badge className="absolute top-4 left-4 gradient-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('collection', vendor, 'Clothing')}
                    >
                      View Collection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="horse">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horseRental.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    {vendor.sponsored && (
                      <Badge className="absolute top-4 left-4 gradient-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Package Price</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-pink text-primary"
                      onClick={() => handleServiceAction('ghodi', vendor, 'Horse Rental')}
                    >
                      Book Ghodi
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mehndi">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mehndiArtists.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    {vendor.sponsored && (
                      <Badge className="absolute top-4 left-4 gradient-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('artist', vendor, 'Mehndi')}
                    >
                      Book Artist
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="priests">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {priests.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {vendor.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.speciality}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{vendor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{vendor.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span className="text-primary">Rs.{vendor.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-pink text-primary"
                      onClick={() => handleServiceAction('service', vendor, 'Religious Service')}
                    >
                      Book Service
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="honeymoon">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {honeymoonPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-transparent hover:border-accent">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {pkg.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{pkg.duration}</p>
                    <div className="mb-4">
                      <p className="text-sm mb-2">Package Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.includes.map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-primary" />
                      <span className="text-primary text-xl">Rs.{pkg.price.toLocaleString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full gradient-maroon"
                      onClick={() => handleServiceAction('details', pkg, 'Honeymoon Package')}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="space-y-12">
              <div>
                <h2 className="mb-6">Photographers</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {photographers.slice(0, 3).map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all">
                      <div className="relative h-40">
                        <ImageWithFallback src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h4>{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.speciality}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-6">Caterers</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {caterers.slice(0, 3).map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all">
                      <div className="relative h-40">
                        <ImageWithFallback src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h4>{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.speciality}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-6">Makeup Artists</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {makeupArtists.slice(0, 3).map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all">
                      <div className="relative h-40">
                        <ImageWithFallback src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h4>{vendor.name}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.speciality}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
