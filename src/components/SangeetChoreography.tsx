import { useState } from 'react';
import { Music, Users, Trophy, Star, Play, Calendar, Clock, IndianRupee, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

const choreographers = [
  {
    id: 1,
    name: 'Dance Studio Mumbai',
    instructor: 'Priya Sharma',
    specialization: 'Bollywood & Contemporary',
    experience: '12 years',
    rating: 4.9,
    weddings: 300,
    price: 25000,
    image: 'https://images.unsplash.com/photo-1653203187698-530a34a80ba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGNob3Jlb2dyYXBoeSUyMGNsYXNzfGVufDF8fHx8MTc2MDcyMzU0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: 2,
    name: 'Bollywood Beats',
    instructor: 'Rahul Malhotra',
    specialization: 'Traditional & Fusion',
    experience: '15 years',
    rating: 5.0,
    weddings: 450,
    price: 35000,
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'Wedding Moves',
    instructor: 'Neha Kapoor',
    specialization: 'Punjabi & Garba',
    experience: '10 years',
    rating: 4.8,
    weddings: 250,
    price: 20000,
    image: 'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=800&h=600&fit=crop',
    verified: true,
  },
];

const packages = [
  {
    id: 1,
    name: 'Basic Performance',
    price: 15000,
    sessions: '4 sessions',
    duration: '1.5 hours each',
    features: [
      'One group dance (8-10 people)',
      '4 practice sessions',
      'Simple choreography',
      'Music editing',
      'Costume suggestions',
      'Online support',
    ],
  },
  {
    id: 2,
    name: 'Complete Sangeet',
    price: 40000,
    sessions: '12 sessions',
    duration: '2 hours each',
    popular: true,
    features: [
      '3-4 group performances',
      '2 couple dances',
      '12 practice sessions',
      'Mix of styles (Bollywood/Punjabi)',
      'Professional music mixing',
      'Costume coordination',
      'Video rehearsal recordings',
      'Backup choreography support',
      'Performance day assistance',
    ],
  },
  {
    id: 3,
    name: 'Premium Showcase',
    price: 75000,
    sessions: '20+ sessions',
    duration: '2.5 hours each',
    features: [
      'Unlimited performances',
      'Professional dance troupe',
      'Advanced choreography',
      'Theme-based performances',
      'Props & special effects coordination',
      'Lighting consultation',
      'Video production support',
      'Dress rehearsal at venue',
      'Full day performance support',
      'Post-event dance video',
    ],
  },
];

const danceStyles = [
  { id: 1, name: 'Bollywood', icon: '💃' },
  { id: 2, name: 'Punjabi Bhangra', icon: '🎉' },
  { id: 3, name: 'Garba/Dandiya', icon: '🪘' },
  { id: 4, name: 'Contemporary', icon: '✨' },
  { id: 5, name: 'Hip Hop', icon: '🎧' },
  { id: 6, name: 'Classical Fusion', icon: '🎭' },
];

export function SangeetChoreography() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedChoreographer, setSelectedChoreographer] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');

  const handleBooking = () => {
    if (!selectedPackage || !selectedChoreographer) {
      toast.error('Please select a package and choreographer');
      return;
    }
    toast.success('Booking confirmed! Choreographer will contact you within 24 hours');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-primary" />
            <h1>Sangeet Choreography</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional dance choreography to make your sangeet night unforgettable
          </p>
        </div>

        {/* Why Professional Choreography */}
        <Card className="glassmorphism mb-8">
          <CardContent className="p-8">
            <h2 className="text-center mb-6">Why Choose Professional Choreography?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-2">Perfect Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Polished routines that wow your guests
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-foreground" />
                </div>
                <h4 className="mb-2">Group Coordination</h4>
                <p className="text-sm text-muted-foreground">
                  Sync everyone perfectly together
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h4 className="mb-2">Save Time</h4>
                <p className="text-sm text-muted-foreground">
                  Efficient practice sessions
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-2">Custom Routines</h4>
                <p className="text-sm text-muted-foreground">
                  Tailored to your skill level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dance Styles */}
        <div className="mb-8">
          <h2 className="text-center mb-6">Popular Dance Styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {danceStyles.map((style) => (
              <Card
                key={style.id}
                className={`glassmorphism text-center cursor-pointer transition-all hover:shadow-lg ${
                  preferredStyle === style.name
                    ? 'border-2 border-primary'
                    : 'border-2 border-transparent'
                }`}
                onClick={() => setPreferredStyle(style.name)}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <p className="text-sm">{style.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="packages" className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
            <TabsTrigger value="packages">
              <Star className="w-4 h-4 mr-2" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="choreographers">
              <Users className="w-4 h-4 mr-2" />
              Choreographers
            </TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
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
                    <CardTitle>
                      <h3 className="text-center">{pkg.name}</h3>
                      <div className="text-center mt-3">
                        <div className="flex items-center justify-center gap-1">
                          <IndianRupee className="w-6 h-6 text-primary" />
                          <span className="text-3xl text-primary">{pkg.price.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pkg.sessions} • {pkg.duration}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
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

          {/* Choreographers Tab */}
          <TabsContent value="choreographers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {choreographers.map((choreo) => (
                <Card
                  key={choreo.id}
                  className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    selectedChoreographer === choreo.id.toString()
                      ? 'border-2 border-primary shadow-lg'
                      : 'border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedChoreographer(choreo.id.toString())}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={choreo.image}
                      alt={choreo.name}
                      className="w-full h-full object-cover"
                    />
                    {choreo.verified && (
                      <Badge className="absolute top-4 left-4 bg-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white text-foreground">
                      <Star className="w-3 h-3 fill-accent text-accent mr-1" />
                      {choreo.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1">{choreo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">by {choreo.instructor}</p>
                    <p className="text-sm text-primary mb-4">{choreo.specialization}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span>{choreo.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Weddings</span>
                        <span>{choreo.weddings}+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Starting from</span>
                        <span className="text-primary">Rs.{choreo.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedChoreographer === choreo.id.toString()
                          ? 'gradient-maroon'
                          : 'gradient-pink text-primary'
                      }`}
                    >
                      {selectedChoreographer === choreo.id.toString() ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Choreographer'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Form */}
        {(selectedPackage || selectedChoreographer) && (
          <Card className="glassmorphism mt-8">
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Sangeet Date</Label>
                  <Input id="eventDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    placeholder="Number of dancers"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Practice Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Choreographer's Studio</SelectItem>
                      <SelectItem value="home">My Home/Venue</SelectItem>
                      <SelectItem value="both">Both (Flexible)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedPackage && selectedChoreographer && (
                <div className="p-4 gradient-pink rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Selected Package:</span>
                    <span className="text-primary">
                      {packages.find(p => p.id.toString() === selectedPackage)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Choreographer:</span>
                    <span className="text-primary">
                      {choreographers.find(c => c.id.toString() === selectedChoreographer)?.name}
                    </span>
                  </div>
                  {preferredStyle && (
                    <div className="flex items-center justify-between mb-2">
                      <span>Preferred Style:</span>
                      <span className="text-primary">{preferredStyle}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-accent/30">
                    <span>Total Amount:</span>
                    <span className="text-xl text-primary">
                      Rs.{packages.find(p => p.id.toString() === selectedPackage)?.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full gradient-maroon" size="lg" onClick={handleBooking}>
                <Music className="w-5 h-5 mr-2" />
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
