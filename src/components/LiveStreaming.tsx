import { useState } from 'react';
import { Video, Users, Globe, Wifi, Play, Settings, Share2, Download, Eye, Check, IndianRupee, Clock, Star, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MapPin, Calendar, Shield, Award, Heart, ThumbsUp, Zap, Headphones, Camera, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

const streamingPackages = [
  {
    id: 1,
    name: 'Basic Streaming',
    price: 15000,
    duration: 'Up to 3 hours',
    features: [
      '1 HD camera setup',
      'Live streaming to YouTube/Facebook',
      'Up to 100 viewers',
      'Basic audio setup',
      'Internet backup (4G)',
      'Recording included',
    ],
  },
  {
    id: 2,
    name: 'Professional Streaming',
    price: 35000,
    duration: 'Full day (8 hours)',
    popular: true,
    features: [
      '3 HD cameras (multi-angle)',
      'Professional streaming platform',
      'Unlimited viewers',
      'Premium audio with wireless mics',
      'Dual internet backup (4G + 5G)',
      'Live chat moderation',
      'Custom branding & overlays',
      'HD recording & instant replay',
      'Technical support team',
    ],
  },
  {
    id: 3,
    name: 'Premium Experience',
    price: 60000,
    duration: 'Multi-day coverage',
    features: [
      'Everything in Professional',
      '5+ 4K cameras with drone',
      'Multi-platform streaming',
      'Interactive guest features',
      'Virtual photo booth',
      'Real-time highlights',
      'Professional director',
      'Dedicated streaming website',
      'Post-event edited video',
      '30-day video hosting',
    ],
  },
];

const providers = [
  {
    id: 1,
    name: 'WedStream Pro',
    rating: 4.9,
    events: 500,
    responseTime: '< 2 hours',
    image: 'https://images.unsplash.com/photo-1613758403772-268da019247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwc3RyZWFtaW5nJTIwY2FtZXJhfGVufDF8fHx8MTc2MDcyMzU0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
  },
  {
    id: 2,
    name: 'VirtualShaadi',
    rating: 4.8,
    events: 350,
    responseTime: '< 3 hours',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'LiveEvents India',
    rating: 4.7,
    events: 280,
    responseTime: '< 4 hours',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
    verified: true,
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Priya & Rajesh',
    location: 'Mumbai',
    rating: 5,
    text: 'Amazing service! Our relatives from USA could watch our wedding live. The quality was crystal clear and the team was very professional.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Anita & Vikram',
    location: 'Delhi',
    rating: 5,
    text: 'Perfect streaming service for our destination wedding. 200+ guests watched online and loved the interactive features.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Sneha & Arjun',
    location: 'Bangalore',
    rating: 5,
    text: 'Professional team handled everything. The live chat feature made our virtual guests feel included in the celebration.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

const faqs = [
  {
    question: 'How far in advance should I book the streaming service?',
    answer: 'We recommend booking at least 2-4 weeks in advance to ensure availability and proper venue assessment.'
  },
  {
    question: 'What internet speed is required for live streaming?',
    answer: 'Minimum 10 Mbps upload speed is required. We perform a technical assessment of your venue before the event.'
  },
  {
    question: 'Can guests watch the stream on mobile devices?',
    answer: 'Yes! Our streams are optimized for all devices including smartphones, tablets, laptops, and smart TVs.'
  },
  {
    question: 'Is the recorded video included in the package?',
    answer: 'Yes, all packages include HD recording of the entire stream, which you can download and share later.'
  },
  {
    question: 'What happens if there are technical issues during streaming?',
    answer: 'Our technical team is on standby throughout the event. We have backup internet connections and equipment to ensure uninterrupted streaming.'
  }
];

const streamingQualityOptions = [
  { value: '720p', label: 'HD (720p)', description: 'Good quality, lower bandwidth' },
  { value: '1080p', label: 'Full HD (1080p)', description: 'Excellent quality, standard bandwidth' },
  { value: '4K', label: 'Ultra HD (4K)', description: 'Premium quality, high bandwidth' }
];

export function LiveStreaming() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [privateStream, setPrivateStream] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [guestCount, setGuestCount] = useState('');
  const [streamingQuality, setStreamingQuality] = useState('1080p');
  const [showComparison, setShowComparison] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const handleBooking = () => {
    if (!selectedPackage) {
      toast.error('Please select a streaming package');
      return;
    }
    setBookingStep(2);
    toast.success('Booking request sent! We will contact you within 24 hours');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getTotalPrice = () => {
    const basePrice = streamingPackages.find(p => p.id.toString() === selectedPackage)?.price || 0;
    const qualityMultiplier = streamingQuality === '4K' ? 1.5 : streamingQuality === '1080p' ? 1.2 : 1;
    return Math.round(basePrice * qualityMultiplier);
  };

  const handleViewProfile = (providerId: number) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      toast.success(`Opening ${provider.name} profile...`);
      // Here you would typically navigate to the provider's detailed profile page
      // For now, we'll show a success message
      console.log('Viewing profile for:', provider.name);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Video className="w-10 h-10 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold">Live Wedding Streaming</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
            Share your special day with loved ones anywhere in the world through professional live streaming
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowComparison(!showComparison)}
              className="gradient-pink text-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showComparison ? 'Hide' : 'Compare'} Packages
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLiveChat(true)}
              className="gradient-gold"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Support
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Globe className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Global Reach</h4>
              <p className="text-xs text-muted-foreground">Connect with family worldwide</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Wifi className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Reliable Streaming</h4>
              <p className="text-xs text-muted-foreground">Uninterrupted HD quality</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Download className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Recording Included</h4>
              <p className="text-xs text-muted-foreground">Download & share later</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Interactive Features</h4>
              <p className="text-xs text-muted-foreground">Live chat & reactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Package Comparison Table */}
        {showComparison && (
          <Card className="glassmorphism mb-8">
            <CardHeader>
              <CardTitle className="text-center">Package Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Features</th>
                      {streamingPackages.map((pkg) => (
                        <th key={pkg.id} className="text-center p-4">
                          <div className="font-semibold">{pkg.name}</div>
                          <div className="text-sm text-muted-foreground">Rs.{pkg.price.toLocaleString()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Cameras</td>
                      <td className="p-4 text-center">1 HD</td>
                      <td className="p-4 text-center">3 HD</td>
                      <td className="p-4 text-center">5+ 4K</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Max Viewers</td>
                      <td className="p-4 text-center">100</td>
                      <td className="p-4 text-center">Unlimited</td>
                      <td className="p-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Duration</td>
                      <td className="p-4 text-center">3 hours</td>
                      <td className="p-4 text-center">8 hours</td>
                      <td className="p-4 text-center">Multi-day</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Recording</td>
                      <td className="p-4 text-center">✓</td>
                      <td className="p-4 text-center">✓ HD</td>
                      <td className="p-4 text-center">✓ 4K</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Live Chat</td>
                      <td className="p-4 text-center">✗</td>
                      <td className="p-4 text-center">✓</td>
                      <td className="p-4 text-center">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Technical Support</td>
                      <td className="p-4 text-center">Basic</td>
                      <td className="p-4 text-center">Full</td>
                      <td className="p-4 text-center">24/7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Streaming Packages */}
        <div className="mb-8">
          <h2 className="text-center mb-6">Choose Your Streaming Package</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {streamingPackages.map((pkg) => (
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
                      <p className="text-sm text-muted-foreground mt-1">{pkg.duration}</p>
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
        </div>

        {/* Service Providers */}
        <div className="mb-8">
          <h2 className="text-center mb-6">Verified Streaming Partners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="glassmorphism hover:shadow-lg transition-all">
                <div className="relative h-40">
                  <ImageWithFallback
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  {provider.verified && (
                    <Badge className="absolute top-4 left-4 bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h4 className="mb-3">{provider.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">{provider.rating}</span>
                        <Eye className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Events Streamed</span>
                      <span>{provider.events}+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="text-green-600">{provider.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gradient-pink text-primary" 
                    variant="outline"
                    onClick={() => handleViewProfile(provider.id)}
                  >
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Streaming Options */}
        {selectedPackage && (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Customize Your Stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="quality">Stream Quality</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input id="eventDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Start Time</Label>
                      <Input id="eventTime" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue Name</Label>
                      <Input id="venue" placeholder="Enter venue name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Expected Virtual Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        placeholder="Approximate number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-6">
                  <div className="space-y-4">
                    <Label>Streaming Quality</Label>
                    <div className="grid gap-4">
                      {streamingQualityOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer" onClick={() => setStreamingQuality(option.value)}>
                          <input
                            type="radio"
                            name="quality"
                            value={option.value}
                            checked={streamingQuality === option.value}
                            onChange={() => setStreamingQuality(option.value)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="private" className="cursor-pointer">
                          Private Stream (Password Protected)
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only invited guests with password can view
                        </p>
                      </div>
                      <Switch
                        id="private"
                        checked={privateStream}
                        onCheckedChange={setPrivateStream}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="chat" className="cursor-pointer">
                          Enable Live Chat
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Guests can send messages during stream
                        </p>
                      </div>
                      <Switch
                        id="chat"
                        checked={chatEnabled}
                        onCheckedChange={setChatEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="reactions" className="cursor-pointer">
                          Enable Live Reactions
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Guests can send emoji reactions during the stream
                        </p>
                      </div>
                      <Switch id="reactions" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor="recording" className="cursor-pointer">
                          Auto Recording
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Automatically record the entire stream for later download
                        </p>
                      </div>
                      <Switch id="recording" defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="p-4 gradient-pink rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Selected Package:</span>
                  <span className="text-primary">
                    {streamingPackages.find(p => p.id.toString() === selectedPackage)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-accent/30 mt-2">
                  <span>Base Price:</span>
                  <span className="text-primary">
                    Rs.{streamingPackages.find(p => p.id.toString() === selectedPackage)?.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span>Quality Upgrade:</span>
                  <span className="text-primary">
                    {streamingQuality === '4K' ? '+50%' : streamingQuality === '1080p' ? '+20%' : 'Included'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-accent/30 mt-2">
                  <span className="font-semibold">Total Cost:</span>
                  <span className="text-xl text-primary font-bold">
                    Rs.{getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gradient-maroon" size="lg" onClick={handleBooking}>
                <Play className="w-5 h-5 mr-2" />
                Book Live Streaming
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* How It Works */}
        <Card className="glassmorphism mt-8">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  1
                </div>
                <h4 className="mb-2 text-sm">Book Package</h4>
                <p className="text-xs text-muted-foreground">Select your preferred streaming package</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  2
                </div>
                <h4 className="mb-2 text-sm">Setup Visit</h4>
                <p className="text-xs text-muted-foreground">Team visits venue for internet check</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  3
                </div>
                <h4 className="mb-2 text-sm">Get Stream Link</h4>
                <p className="text-xs text-muted-foreground">Share link with virtual guests</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  4
                </div>
                <h4 className="mb-2 text-sm">Go Live!</h4>
                <p className="text-xs text-muted-foreground">Professional team handles everything</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="text-center mb-6">What Our Couples Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="glassmorphism">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-accent/50"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Chat Widget */}
        {showLiveChat && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="w-80 h-96 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <CardTitle className="text-sm">Live Support</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLiveChat(false)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">S</span>
                    </div>
                    <div className="bg-accent p-2 rounded-lg text-sm">
                      Hi! I'm Sarah from ShaadiBiyah support. How can I help you with your streaming needs?
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <div className="flex gap-2 w-full">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
