import React, { useState } from 'react';
import { Search, Heart, Building2, Car, Camera, UtensilsCrossed, Sparkles, Users, Palette, Cake, Music, ChevronRight, Star, Quote, Shirt, Crown, Clock, CreditCard, Video, MessageSquare, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string, tab?: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: Heart, label: 'Matrimonial', color: 'text-pink-600', bg: 'bg-pink-50', page: 'matrimonial' },
    { icon: Building2, label: 'Marriage Halls', color: 'text-purple-600', bg: 'bg-purple-50', page: 'halls' },
    { icon: Car, label: 'Wedding Cars', color: 'text-blue-600', bg: 'bg-blue-50', page: 'cars' },
    { icon: Camera, label: 'Photographers', color: 'text-green-600', bg: 'bg-green-50', page: 'services' },
    { icon: UtensilsCrossed, label: 'Caterers', color: 'text-orange-600', bg: 'bg-orange-50', page: 'services' },
    { icon: Sparkles, label: 'Makeup Artists', color: 'text-pink-600', bg: 'bg-pink-50', page: 'services' },
    { icon: Shirt, label: 'Wedding Attire', color: 'text-indigo-600', bg: 'bg-indigo-50', page: 'services' },
    { icon: Crown, label: 'Horse/Ghodi', color: 'text-amber-600', bg: 'bg-amber-50', page: 'services' },
    { icon: Cake, label: 'Sweet Makers', color: 'text-yellow-600', bg: 'bg-yellow-50', page: 'services' },
    { icon: Palette, label: 'Decorators', color: 'text-red-600', bg: 'bg-red-50', page: 'services' },
  ];

  const testimonials = [
    {
      name: 'Ayesha & Rahul',
      text: 'ShaadiBiyah made our wedding planning so easy! We found our venue, photographer, and caterer all in one place.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1606663453520-c0d4e6d0ce3e?w=100&h=100&fit=crop'
    },
    {
      name: 'Priya Sharma',
      text: 'I found my perfect match through the matrimonial section. The platform is trustworthy and easy to use!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      name: 'Ali & Fatima',
      text: 'The vendor quality is excellent. Everything from decoration to catering was top-notch. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1680490964889-67a5ab8d8b54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwY2VyZW1vbnl8ZW58MXx8fHwxNzYwNTk4MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6 text-5xl md:text-6xl">
            Plan Your Dream Wedding from Home
          </h1>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Find the perfect match, book stunning venues, and connect with top wedding vendors - all in one elegant platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Find Halls, Cars, or Wedding Services near you"
                className="pl-10 h-12 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8 gradient-gold text-foreground hover:opacity-90">
              Search
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-maroon hover:opacity-90"
              onClick={() => onNavigate('matrimonial')}
            >
              Start Planning
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-white/90"
              onClick={() => onNavigate('marketplace')}
            >
              Browse Vendors
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-white/90"
              onClick={() => onNavigate('vendor')}
            >
              Join as Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">Explore Our Services</h2>
          <p className="text-muted-foreground">
            Everything you need for your perfect wedding day
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.label}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent"
                onClick={() => onNavigate(category.page)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <h3 className="text-sm">{category.label}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="mb-2">Verified Vendors</h3>
              <p className="text-muted-foreground">
                All vendors are verified and rated by real customers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="mb-2">One-Stop Platform</h3>
              <p className="text-muted-foreground">
                Plan your entire wedding from matrimonial to vendors
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-foreground fill-current" />
              </div>
              <h3 className="mb-2">Trusted by Thousands</h3>
              <p className="text-muted-foreground">
                Join thousands of happy couples who planned with us
              </p>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('planning')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-maroon rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Planning Tools</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Checklist & Budget</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('invitations')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Digital Invitations</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">E-Cards & Sharing</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('muhurat')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Muhurat Service</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Astrology & Timing</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('timeline')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-maroon rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Day Timeline</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Schedule Builder</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('finance')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Wedding Finance</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">EMI Options</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('streaming')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Live Streaming</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Virtual Guests</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('search')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-maroon rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Advanced Search</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Find Vendors</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('reviews')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Vendor Reviews</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Read & Write</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('chat')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Messages</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">Chat with vendors</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glassmorphism cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-accent"
              onClick={() => onNavigate('virtual-tours')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 gradient-maroon rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-0.5 text-sm">Virtual Tours</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">360° Venue Views</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Our Couples Say</h2>
          <p className="text-muted-foreground">
            Real stories from real weddings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glassmorphism border-accent/30">
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-accent mb-4" />
                <p className="mb-4 text-sm italic">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">{testimonial.name}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 fill-white" />
                <h3 className="text-white">ShaadiBiyah</h3>
              </div>
              <p className="text-white/80 text-sm">
                Your complete wedding planning platform
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="cursor-pointer hover:text-white">Matrimonial</li>
                <li className="cursor-pointer hover:text-white">Venues</li>
                <li className="cursor-pointer hover:text-white">Vendors</li>
                <li className="cursor-pointer hover:text-white">Planning Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="cursor-pointer hover:text-white">About Us</li>
                <li className="cursor-pointer hover:text-white">Contact</li>
                <li className="cursor-pointer hover:text-white">Careers</li>
                <li className="cursor-pointer hover:text-white">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="cursor-pointer hover:text-white">Privacy Policy</li>
                <li className="cursor-pointer hover:text-white">Terms of Service</li>
                <li className="cursor-pointer hover:text-white">Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2025 ShaadiBiyah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
