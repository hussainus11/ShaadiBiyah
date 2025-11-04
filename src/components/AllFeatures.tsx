import { 
  Heart, Building2, Car, Camera, UtensilsCrossed, Sparkles, Palette, Cake, 
  Shirt, Crown, Hand, Church, Plane, Music, Video, Star, Calendar, CreditCard,
  CheckSquare, Mail, Users, Gift, Image, Settings, BarChart3, User, Shield, Search, MessageSquare,
  Send, Eye, Hotel, BookOpen, AlertTriangle, FileText, Bus, Cloud
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface AllFeaturesProps {
  onNavigate: (page: string, tab?: string) => void;
}

const allFeatures = [
  {
    category: 'Core Services',
    features: [
      { name: 'Matrimonial Matching', icon: Heart, page: 'matrimonial', color: 'text-pink-600', desc: 'Find your perfect match' },
      { name: 'Marriage Halls', icon: Building2, page: 'halls', color: 'text-purple-600', desc: 'Book venues with menus' },
      { name: 'Wedding Cars', icon: Car, page: 'cars', color: 'text-blue-600', desc: 'Luxury transportation' },
    ],
  },
  {
    category: 'Vendor Services',
    features: [
      { name: 'Photographers', icon: Camera, page: 'services', tab: 'photographers', color: 'text-green-600', desc: 'Professional photography' },
      { name: 'Caterers', icon: UtensilsCrossed, page: 'services', tab: 'caterers', color: 'text-orange-600', desc: 'Delicious cuisine' },
      { name: 'Makeup Artists', icon: Sparkles, page: 'services', tab: 'makeup', color: 'text-pink-600', desc: 'Bridal beauty' },
      { name: 'Decorators', icon: Palette, page: 'services', tab: 'decorators', color: 'text-purple-600', desc: 'Event decoration' },
      { name: 'Sweet Makers', icon: Cake, page: 'services', tab: 'sweets', color: 'text-red-600', desc: 'Traditional sweets' },
      { name: 'Bridal Wear', icon: Shirt, page: 'services', tab: 'clothing', color: 'text-indigo-600', desc: 'Wedding attire' },
      { name: 'Horse Rental', icon: Crown, page: 'services', tab: 'horse', color: 'text-yellow-600', desc: 'Barat horses' },
      { name: 'Mehndi Artists', icon: Hand, page: 'services', tab: 'mehndi', color: 'text-orange-600', desc: 'Henna designs' },
      { name: 'Priests/Pandits', icon: Church, page: 'services', tab: 'priests', color: 'text-purple-600', desc: 'Religious services' },
      { name: 'Honeymoon Packages', icon: Plane, page: 'services', tab: 'honeymoon', color: 'text-blue-600', desc: 'Dream destinations' },
    ],
  },
  {
    category: 'Planning Tools',
    features: [
      { name: 'Wedding Checklist', icon: CheckSquare, page: 'planning', color: 'text-green-600', desc: 'Task management' },
      { name: 'Budget Tracker', icon: CreditCard, page: 'budget', color: 'text-blue-600', desc: 'Expense tracking' },
      { name: 'Guest List Manager', icon: Users, page: 'guests', color: 'text-purple-600', desc: 'RSVP tracking' },
      { name: 'Day Timeline', icon: Calendar, page: 'timeline', color: 'text-orange-600', desc: 'Schedule builder' },
      { name: 'Seating Chart', icon: Settings, page: 'seating', color: 'text-pink-600', desc: 'Table planning' },
    ],
  },
  {
    category: 'Digital Services',
    features: [
      { name: 'Digital Invitations', icon: Mail, page: 'invitations', color: 'text-red-600', desc: 'E-card creation' },
      { name: 'Wedding Website', icon: Settings, page: 'website', color: 'text-blue-600', desc: 'Personal website' },
      { name: 'Photo Gallery', icon: Image, page: 'gallery', color: 'text-purple-600', desc: 'Share memories' },
      { name: 'Gift Registry', icon: Gift, page: 'gifts', color: 'text-green-600', desc: 'Gift management' },
      { name: 'Vendor Marketplace', icon: Building2, page: 'marketplace', color: 'text-purple-600', desc: 'Browse all vendors' },
      { name: 'Advanced Search', icon: Search, page: 'search', color: 'text-indigo-600', desc: 'Find perfect vendors' },
      { name: 'Vendor Reviews', icon: MessageSquare, page: 'reviews', color: 'text-orange-600', desc: 'Read & write reviews' },
      { name: 'Real-time Chat', icon: Send, page: 'chat', color: 'text-blue-500', desc: 'Message vendors instantly' },
      { name: 'Virtual Tours', icon: Eye, page: 'virtual-tours', color: 'text-teal-600', desc: '360° venue exploration' },
      { name: 'Wedding Blog', icon: BookOpen, page: 'blog', color: 'text-pink-600', desc: 'Tips & trends' },
    ],
  },
  {
    category: 'Special Services',
    features: [
      { name: 'Muhurat/Astrology', icon: Star, page: 'muhurat', color: 'text-yellow-600', desc: 'Auspicious dates' },
      { name: 'Live Streaming', icon: Video, page: 'streaming', color: 'text-red-600', desc: 'Virtual guests' },
      { name: 'Sangeet Choreography', icon: Music, page: 'sangeet', color: 'text-pink-600', desc: 'Dance training' },
      { name: 'Wedding Finance', icon: CreditCard, page: 'finance', color: 'text-blue-600', desc: 'EMI options' },
      { name: 'Vendor Comparison', icon: BarChart3, page: 'comparison', color: 'text-purple-600', desc: 'Compare quotes' },
      { name: 'Outfit Planner', icon: Shirt, page: 'outfit', color: 'text-indigo-600', desc: 'Wardrobe planning' },
      { name: 'Music Playlist', icon: Music, page: 'playlist', color: 'text-orange-600', desc: 'Curated songs' },
    ],
  },
  {
    category: 'Management',
    features: [
      { name: 'User Dashboard', icon: User, page: 'dashboard', color: 'text-blue-600', desc: 'Your control panel' },
      { name: 'User Profile', icon: User, page: 'user-profile', color: 'text-blue-600', desc: 'Manage your profile' },
      { name: 'Vendor Portal', icon: Shield, page: 'vendor', color: 'text-green-600', desc: 'Business registration' },
      { name: 'Vendor Dashboard', icon: Settings, page: 'vendor-dashboard', color: 'text-green-600', desc: 'Manage your business' },
      { name: 'Admin Panel', icon: Settings, page: 'admin', color: 'text-red-600', desc: 'Platform control' },
      { name: 'Guest Accommodation', icon: Hotel, page: 'accommodation', color: 'text-cyan-600', desc: 'Hotel booking for guests' },
      { name: 'Emergency Services', icon: AlertTriangle, page: 'emergency', color: 'text-red-600', desc: '24/7 backup support' },
      { name: 'Wedding Insurance', icon: Shield, page: 'insurance', color: 'text-purple-600', desc: 'Protect your investment' },
      { name: 'Contracts Manager', icon: FileText, page: 'contracts', color: 'text-indigo-600', desc: 'Document management' },
      { name: 'Transportation', icon: Bus, page: 'transportation', color: 'text-teal-600', desc: 'Guest transport planning' },
      { name: 'Weather Forecast', icon: Cloud, page: 'weather', color: 'text-sky-600', desc: 'Plan for perfect weather' },
    ],
  },
];

export function AllFeatures({ onNavigate }: AllFeaturesProps) {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">All ShaadiBiyah Features</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your complete wedding planning ecosystem - Everything you need in one platform
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge className="gradient-maroon text-lg px-4 py-2">
              70+ Features
            </Badge>
            <Badge className="gradient-gold text-lg px-4 py-2">
              1000+ Vendors
            </Badge>
            <Badge className="gradient-pink text-primary text-lg px-4 py-2">
              100% Verified
            </Badge>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-12">
          {allFeatures.map((category) => (
            <div key={category.category}>
              <h2 className="mb-6 text-center">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.name}
                      className="glassmorphism cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent"
                      onClick={() => onNavigate(feature.page, (feature as any).tab)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className={`w-7 h-7 ${feature.color}`} />
                        </div>
                        <h4 className="mb-1 text-sm font-medium">{feature.name}</h4>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <p className="text-4xl text-primary mb-2">70+</p>
              <p className="text-sm text-muted-foreground">Total Features</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <p className="text-4xl text-primary mb-2">15+</p>
              <p className="text-sm text-muted-foreground">Vendor Categories</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <p className="text-4xl text-primary mb-2">10+</p>
              <p className="text-sm text-muted-foreground">Planning Tools</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <p className="text-4xl text-primary mb-2">100%</p>
              <p className="text-sm text-muted-foreground">Comprehensive</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
