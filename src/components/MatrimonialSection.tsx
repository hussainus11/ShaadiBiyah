import React, { useEffect, useState } from 'react';
import { Heart, MapPin, Briefcase, GraduationCap, Users, MessageCircle, Filter, X, Search, Star, Phone, Mail, CheckCircle, XCircle, Eye, EyeOff, Calendar, Clock, Shield, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

// Profiles now come from DB via backend API
const API_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5001/api';

// Mock profiles for when API is not available
const getMockProfiles = () => [
  {
    id: 1,
    name: 'Priya Sharma',
    age: 28,
    profession: 'Software Engineer',
    city: 'Mumbai',
    religion: 'Hindu',
    education: 'B.Tech Computer Science',
    height: '5\'4"',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'],
    bio: 'Looking for a life partner who shares similar values and interests. Love traveling and cooking.',
    interests: ['Travel', 'Cooking', 'Reading', 'Music'],
    verified: true,
    premium: true,
    isOnline: true,
    compatibilityScore: 85,
    isInterested: false,
    isMatched: false,
    phone: '+91 9876543210',
    email: 'priya@email.com',
    familyBackground: 'Middle-class family, parents are teachers',
    partnerPreferences: 'Looking for someone educated and family-oriented'
  },
  {
    id: 2,
    name: 'Rahul Kapoor',
    age: 30,
    profession: 'Doctor',
    city: 'Delhi',
    religion: 'Hindu',
    education: 'MBBS',
    height: '5\'8"',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'],
    bio: 'Doctor by profession, looking for someone who understands the demands of medical profession.',
    interests: ['Medicine', 'Sports', 'Photography', 'Movies'],
    verified: true,
    premium: false,
    isOnline: false,
    compatibilityScore: 78,
    isInterested: false,
    isMatched: false,
    phone: '+91 9876543211',
    email: 'rahul@email.com',
    familyBackground: 'Medical family, father is a surgeon',
    partnerPreferences: 'Looking for someone understanding and supportive'
  },
  {
    id: 3,
    name: 'Anita Singh',
    age: 26,
    profession: 'Teacher',
    city: 'Bangalore',
    religion: 'Sikh',
    education: 'M.A. English',
    height: '5\'3"',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'],
    bio: 'Passionate about education and children. Looking for someone who values family and education.',
    interests: ['Teaching', 'Reading', 'Art', 'Gardening'],
    verified: true,
    premium: true,
    isOnline: true,
    compatibilityScore: 92,
    isInterested: false,
    isMatched: false,
    phone: '+91 9876543212',
    email: 'anita@email.com',
    familyBackground: 'Educated family, parents are professors',
    partnerPreferences: 'Looking for someone who values education and family'
  },
  {
    id: 4,
    name: 'Vikram Patel',
    age: 32,
    profession: 'Business Owner',
    city: 'Ahmedabad',
    religion: 'Hindu',
    education: 'MBA',
    height: '5\'10"',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'],
    bio: 'Entrepreneur with a successful business. Looking for a partner who can be both friend and life companion.',
    interests: ['Business', 'Technology', 'Fitness', 'Travel'],
    verified: true,
    premium: false,
    isOnline: false,
    compatibilityScore: 76,
    isInterested: false,
    isMatched: false,
    phone: '+91 9876543213',
    email: 'vikram@email.com',
    familyBackground: 'Business family, father owns textile business',
    partnerPreferences: 'Looking for someone independent and ambitious'
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    age: 27,
    profession: 'Architect',
    city: 'Hyderabad',
    religion: 'Hindu',
    education: 'B.Arch',
    height: '5\'5"',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'],
    bio: 'Creative architect who loves designing beautiful spaces. Looking for someone who appreciates art and creativity.',
    interests: ['Architecture', 'Art', 'Photography', 'Music'],
    verified: true,
    premium: true,
    isOnline: true,
    compatibilityScore: 88,
    isInterested: false,
    isMatched: false,
    phone: '+91 9876543214',
    email: 'sneha@email.com',
    familyBackground: 'Creative family, mother is an artist',
    partnerPreferences: 'Looking for someone creative and artistic'
  }
];

const profiles: any[] = [];

export function MatrimonialSection() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [ageFilter, setAgeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const [religionFilter, setReligionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [profilesData, setProfilesData] = useState<any[]>(profiles);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, from: string, to: string, message: string, timestamp: string}>>([]);

  useEffect(() => {
    // Initial load from API
    (async () => {
      try {
        const res = await fetch(`${API_URL}/matrimonial/profiles`);
        if (res.ok) {
          const data = await res.json();
          setProfilesData(Array.isArray(data) ? data : []);
        } else {
          console.warn('API not available, using mock data');
          setProfilesData(getMockProfiles());
        }
      } catch (e) {
        console.warn('Failed to load profiles from API, using mock data:', e);
        setProfilesData(getMockProfiles());
      }
    })();
  }, []);

  // Filter profiles based on search and filters
  const filteredProfiles = (profilesData || []).filter(profile => {
    const matchesSearch = searchQuery === '' || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAge = ageFilter === '' || 
      (ageFilter === '20-25' && profile.age >= 20 && profile.age <= 25) ||
      (ageFilter === '26-30' && profile.age >= 26 && profile.age <= 30) ||
      (ageFilter === '31-35' && profile.age >= 31 && profile.age <= 35) ||
      (ageFilter === '36+' && profile.age >= 36);
    
    const matchesCity = cityFilter === '' || profile.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesProfession = professionFilter === '' || profile.profession.toLowerCase().includes(professionFilter.toLowerCase());
    const matchesReligion = religionFilter === '' || profile.religion.toLowerCase() === religionFilter.toLowerCase();
    
    return matchesSearch && matchesAge && matchesCity && matchesProfession && matchesReligion;
  });

  // Get profiles based on active tab
  const getDisplayProfiles = () => {
    switch (activeTab) {
      case 'matches':
        return filteredProfiles.filter(profile => profile.isMatched);
      case 'interested':
        return filteredProfiles.filter(profile => profile.isInterested);
      default:
        return filteredProfiles;
    }
  };

  // Handle expressing interest
  const handleExpressInterest = async (profileId: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to express interest in profiles');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/matrimonial/profiles/${profileId}/interest`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setProfilesData(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success(updated.isInterested ? 'Interest expressed!' : 'Interest removed');
      } else {
        // Update local state for demo purposes
        setProfilesData(prev => prev.map(p => 
          p.id === profileId ? { ...p, isInterested: !p.isInterested } : p
        ));
        const profile = profilesData.find(p => p.id === profileId);
        toast.success(profile?.isInterested ? 'Interest removed!' : 'Interest expressed!');
      }
    } catch (e) {
      console.warn('API not available, using local state update:', e);
      // Update local state for demo purposes
      setProfilesData(prev => prev.map(p => 
        p.id === profileId ? { ...p, isInterested: !p.isInterested } : p
      ));
      const profile = profilesData.find(p => p.id === profileId);
      toast.success(profile?.isInterested ? 'Interest removed!' : 'Interest expressed!');
    }
  };

  // Handle matching (simulate mutual interest)
  const handleMatch = async (profileId: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to match with profiles');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/matrimonial/profiles/${profileId}/match`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setProfilesData(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success("It's a match! 🎉");
      } else {
        // Update local state for demo purposes
        setProfilesData(prev => prev.map(p => 
          p.id === profileId ? { ...p, isMatched: true, isInterested: true } : p
        ));
        toast.success("It's a match! 🎉");
      }
    } catch (e) {
      console.warn('API not available, using local state update:', e);
      // Update local state for demo purposes
      setProfilesData(prev => prev.map(p => 
        p.id === profileId ? { ...p, isMatched: true, isInterested: true } : p
      ));
      toast.success("It's a match! 🎉");
    }
  };

  // Handle blocking
  const handleBlock = async (profileId: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to block profiles');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/matrimonial/profiles/${profileId}/block`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setProfilesData(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success('Profile blocked');
      } else {
        // Update local state for demo purposes
        setProfilesData(prev => prev.filter(p => p.id !== profileId));
        toast.success('Profile blocked');
      }
    } catch (e) {
      console.warn('API not available, using local state update:', e);
      // Update local state for demo purposes
      setProfilesData(prev => prev.filter(p => p.id !== profileId));
      toast.success('Profile blocked');
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      return;
    }

    if (messageText.trim() && selectedProfile && user) {
      try {
        const res = await fetch(`${API_URL}/matrimonial/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromProfileId: user.id, toProfileId: selectedProfile.id, content: messageText })
        });
        const created = await res.json();
        const newMessage = {
          id: created.id,
          from: 'You',
          to: selectedProfile.name,
          message: messageText,
          timestamp: new Date(created.createdAt).toLocaleTimeString()
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
        toast.success('Message sent!');
      } catch (e) {
        console.error('send message failed', e);
        toast.error('Failed to send message');
      }
    }
  };

  // Handle photo navigation
  const handleNextPhoto = () => {
    if (selectedProfile) {
      setSelectedPhotoIndex(prev => 
        prev < selectedProfile.photos.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handlePrevPhoto = () => {
    if (selectedProfile) {
      setSelectedPhotoIndex(prev => 
        prev > 0 ? prev - 1 : selectedProfile.photos.length - 1
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setAgeFilter('');
    setCityFilter('');
    setProfessionFilter('');
    setReligionFilter('');
    setSearchQuery('');
    toast.success('Filters cleared');
  };

  // Handle contact dialog
  const handleContactClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to view contact details');
      return;
    }
    setShowContactDialog(true);
  };

  // Handle message dialog
  const handleMessageClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      return;
    }
    setShowMessageDialog(true);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Find Your Perfect Match</h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover profiles of verified individuals looking for meaningful relationships
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">100% Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Premium Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex gap-4 flex-wrap items-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, profession, or city..."
                className="h-12 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            className="h-12"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {showFilters && (
            <Button
              variant="outline"
              className="h-12"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-8 glassmorphism">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Age Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20-25">20-25 years</SelectItem>
                    <SelectItem value="26-30">26-30 years</SelectItem>
                    <SelectItem value="31-35">31-35 years</SelectItem>
                    <SelectItem value="36+">36+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="lahore">Lahore</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={professionFilter} onValueChange={setProfessionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={religionFilter} onValueChange={setReligionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="all">All Profiles</TabsTrigger>
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="interested">Interested</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayProfiles().map((profile) => (
                <Card
                  key={profile.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="relative h-64">
                    <ImageWithFallback
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpressInterest(profile.id);
                        }}
                      >
                        <Heart className={`w-5 h-5 ${profile.isInterested ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      {profile.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {profile.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-white/90">
                        {profile.compatibilityScore}% Match
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
<h3 className="text-lg font-semibold">{profile.name}, {profile.age ?? 'N/A'}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-muted-foreground">{profile.compatibilityScore}%</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.profession}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{profile.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
<span className="text-xs">{profile.isOnline ? 'Online' : `Last seen recently`}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button 
                      className={`flex-1 ${profile.isInterested ? 'bg-red-500 hover:bg-red-600' : 'gradient-pink text-primary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpressInterest(profile.id);
                      }}
                    >
                      {profile.isInterested ? 'Remove Interest' : 'Express Interest'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageClick();
                        setSelectedProfile(profile);
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayProfiles().length > 0 ? (
                getDisplayProfiles().map((profile) => (
                  <Card
                    key={profile.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Matched!
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
<h3 className="mb-2">{profile.name}, {profile.age ?? 'N/A'}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{profile.profession}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex gap-2">
                      <Button className="flex-1 gradient-maroon">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No matches yet</h3>
                  <p className="text-muted-foreground">
                    Express interest in profiles to see your matches here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="interested">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayProfiles().length > 0 ? (
                getDisplayProfiles().map((profile) => (
                  <Card
                    key={profile.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-pink-500 text-white">
                          <Heart className="w-3 h-3 mr-1" />
                          Interested
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
<h3 className="mb-2">{profile.name}, {profile.age ?? 'N/A'}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{profile.profession}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex gap-2">
                      <Button 
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpressInterest(profile.id);
                        }}
                      >
                        Remove Interest
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No interests yet</h3>
                  <p className="text-muted-foreground">
                    Profiles you show interest in will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Detail Modal */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProfile && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    {selectedProfile.name}
                    {selectedProfile.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    View detailed profile information and connect with {selectedProfile.name}
                  </DialogDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <Star className="w-4 h-4 mr-1" />
                      {selectedProfile.compatibilityScore}% Match
                    </Badge>
                    {selectedProfile.isOnline && (
                      <Badge className="bg-green-500 text-white">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        Online
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedProfile.photos[selectedPhotoIndex]}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProfile.photos.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        onClick={handlePrevPhoto}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={handleNextPhoto}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {(selectedProfile.photos || []).map((_, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={index === selectedPhotoIndex ? "default" : "outline"}
                            className="w-2 h-2 p-0 rounded-full"
                            onClick={() => setSelectedPhotoIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Age</p>
                    <p>{selectedProfile.age ? `${selectedProfile.age} years` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Height</p>
                    <p>{selectedProfile.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">City</p>
                    <p>{selectedProfile.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Religion</p>
                    <p>{selectedProfile.religion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Profession</p>
                    <p>{selectedProfile.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Education</p>
                    <p>{selectedProfile.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p>{selectedProfile.isOnline ? 'Online' : `Last seen recently`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Compatibility</p>
                    <p>{selectedProfile.compatibilityScore}% Match</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">About</p>
                  <p>{selectedProfile.bio}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Family Background</p>
                  <p>{selectedProfile.familyBackground}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Partner Preferences</p>
                  <p>{selectedProfile.partnerPreferences}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProfile.interests || []).map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className={`flex-1 ${selectedProfile.isInterested ? 'bg-red-500 hover:bg-red-600' : 'gradient-maroon'}`}
                    onClick={() => handleExpressInterest(selectedProfile.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {selectedProfile.isInterested ? 'Remove Interest' : 'Express Interest'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleMessageClick}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleContactClick}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Contact details will be unlocked after mutual interest
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Details Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Contact information for {selectedProfile?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span>{selectedProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>{selectedProfile.email}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Contact details are shared only after mutual interest is expressed.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedProfile?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedProfile?.name} to start a conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {messages.filter(msg => msg.to === selectedProfile?.name).map((message) => (
                <div key={message.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{message.message}</p>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
