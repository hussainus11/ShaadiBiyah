import { useState } from 'react';
import { Star, Calendar as CalendarIcon, Clock, Moon, Sun, Sparkles, Check, Award, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { DateTimePicker } from './ui/date-time-picker';
import { toast } from 'sonner@2.0.3';

const astrologers = [
  {
    id: 1,
    name: 'Pandit Rajesh Sharma',
    specialization: 'Vedic Astrology & Muhurat',
    experience: '25 years',
    languages: ['Hindi', 'English', 'Sanskrit'],
    rating: 4.9,
    consultations: 5000,
    price: 2100,
    image: 'https://images.unsplash.com/photo-1603647839914-4bc3a23ea66e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhc3Ryb2xvZ2VyJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzYwNzIzNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: 2,
    name: 'Pt. Anil Kumar Joshi',
    specialization: 'Kundli Matching & Marriage Astrology',
    experience: '30 years',
    languages: ['Hindi', 'Gujarati', 'English'],
    rating: 5.0,
    consultations: 8000,
    price: 3100,
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=600&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'Dr. Meena Devi',
    specialization: 'Nadi Astrology & Palmistry',
    experience: '20 years',
    languages: ['Hindi', 'Tamil', 'English'],
    rating: 4.8,
    consultations: 4200,
    price: 2500,
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=600&fit=crop',
    verified: true,
  },
];

const muhuratPackages = [
  {
    id: 1,
    name: 'Basic Muhurat',
    price: 1500,
    features: [
      'Wedding date selection',
      'Auspicious time (1 option)',
      'Basic nakshatra analysis',
      'Email report',
    ],
  },
  {
    id: 2,
    name: 'Premium Muhurat',
    price: 3500,
    popular: true,
    features: [
      'Wedding date selection',
      'Multiple time options (3)',
      'Detailed nakshatra & tithi analysis',
      'Kundli matching report',
      'Video consultation (30 mins)',
      'PDF report with remedies',
    ],
  },
  {
    id: 3,
    name: 'Complete Package',
    price: 6500,
    features: [
      'Everything in Premium',
      'Engagement muhurat',
      'Haldi & Mehndi ceremony times',
      'Vidaai muhurat',
      'Griha pravesh muhurat',
      'Personal consultation (1 hour)',
      'Gemstone recommendations',
      'Lifetime email support',
    ],
  },
];

export function MuhuratService() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAstrologer, setSelectedAstrologer] = useState('');

  const handleBooking = () => {
    if (!selectedPackage || !selectedAstrologer) {
      toast.error('Please select a package and astrologer');
      return;
    }
    toast.success('Booking confirmed! Astrologer will contact you within 24 hours');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-8 h-8 text-primary" />
            <h1>Muhurat & Astrology Services</h1>
            <Sun className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the most auspicious date and time for your wedding with expert Vedic astrologers
          </p>
        </div>

        {/* Why Muhurat Matters */}
        <Card className="glassmorphism mb-8">
          <CardContent className="p-8">
            <h2 className="text-center mb-6">Why Muhurat is Important</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-2">Auspicious Beginning</h4>
                <p className="text-sm text-muted-foreground">
                  Start your married life at the most favorable cosmic moment
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-foreground" />
                </div>
                <h4 className="mb-2">Harmony & Prosperity</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure marital harmony and prosperity through proper timing
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h4 className="mb-2">Traditional Wisdom</h4>
                <p className="text-sm text-muted-foreground">
                  Follow ancient Vedic traditions for a blessed marriage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="packages" className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="packages">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="astrologers">
              <Star className="w-4 h-4 mr-2" />
              Astrologers
            </TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="grid md:grid-cols-3 gap-6">
              {muhuratPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    selectedPackage === pkg.id.toString()
                      ? 'border-2 border-primary shadow-lg'
                      : 'border-2 border-transparent'
                  } ${pkg.popular ? 'gradient-pink' : 'glassmorphism'}`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="gradient-gold rounded-none rounded-bl-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">
                      <h3>{pkg.name}</h3>
                      <div className="flex items-center justify-center gap-1 mt-3">
                        <IndianRupee className="w-6 h-6 text-primary" />
                        <span className="text-3xl text-primary">{pkg.price.toLocaleString()}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedPackage === pkg.id.toString()
                          ? 'gradient-maroon'
                          : 'gradient-pink text-primary'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id.toString())}
                    >
                      {selectedPackage === pkg.id.toString() ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Package'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Astrologers Tab */}
          <TabsContent value="astrologers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologers.map((astro) => (
                <Card
                  key={astro.id}
                  className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    selectedAstrologer === astro.id.toString()
                      ? 'border-2 border-primary shadow-lg'
                      : 'border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedAstrologer(astro.id.toString())}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={astro.image}
                      alt={astro.name}
                      className="w-full h-full object-cover"
                    />
                    {astro.verified && (
                      <Badge className="absolute top-4 left-4 bg-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {astro.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{astro.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{astro.specialization}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{astro.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Consultations</span>
                        <span>{astro.consultations.toLocaleString()}+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Fee (per session)</span>
                        <span className="text-primary">Rs.{astro.price}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {astro.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedAstrologer === astro.id.toString()
                          ? 'gradient-maroon'
                          : 'gradient-pink text-primary'
                      }`}
                    >
                      {selectedAstrologer === astro.id.toString() ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Astrologer'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Form */}
        {(selectedPackage || selectedAstrologer) && (
          <Card className="glassmorphism mt-8">
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Bride's Name</Label>
                  <Input id="brideName" placeholder="Enter bride's full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Groom's Name</Label>
                  <Input id="groomName" placeholder="Enter groom's full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideBirth">Bride's Birth Details</Label>
                  <Input id="brideBirth" placeholder="Date, Time, Place of birth" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomBirth">Groom's Birth Details</Label>
                  <Input id="groomBirth" placeholder="Date, Time, Place of birth" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>

              {selectedPackage && selectedAstrologer && (
                <div className="mt-6 p-4 gradient-pink rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Selected Package:</span>
                    <span className="text-primary">
                      {muhuratPackages.find(p => p.id.toString() === selectedPackage)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Astrologer:</span>
                    <span className="text-primary">
                      {astrologers.find(a => a.id.toString() === selectedAstrologer)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-accent/30">
                    <span>Total Amount:</span>
                    <span className="text-xl text-primary">
                      Rs.{(
                        (muhuratPackages.find(p => p.id.toString() === selectedPackage)?.price || 0) +
                        (astrologers.find(a => a.id.toString() === selectedAstrologer)?.price || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full gradient-maroon" size="lg" onClick={handleBooking}>
                Confirm Booking & Pay
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
