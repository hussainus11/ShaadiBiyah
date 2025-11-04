import { useState } from 'react';
import { Globe, Eye, Download, Share2, Palette, Type, Image as ImageIcon, Calendar, MapPin, Heart, Users, Camera, Bell, Settings, CheckCircle, XCircle, Clock, Mail, Phone, Plus, Trash2, Edit, Save, Upload, Wifi, WifiOff, RefreshCw, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

const templates = [
  { id: 1, name: 'Royal Elegance', theme: 'maroon', image: 'https://images.unsplash.com/photo-1561433881-71f27412406f?w=800&h=600&fit=crop' },
  { id: 2, name: 'Floral Romance', theme: 'pink', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop' },
  { id: 3, name: 'Golden Heritage', theme: 'gold', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop' },
  { id: 4, name: 'Minimalist Chic', theme: 'neutral', image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&h=600&fit=crop' },
];

interface RSVPResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  plusOne: boolean;
  plusOneName?: string;
  dietaryRestrictions: string[];
  message: string;
  respondedAt: string;
  isConfirmed: boolean;
}

interface Photo {
  id: number;
  url: string;
  caption: string;
  uploadedBy: string;
  uploadedAt: string;
  isFeatured: boolean;
  likes: number;
  tags: string[];
}

interface LiveUpdate {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  type: 'announcement' | 'photo' | 'video' | 'story';
  isPinned: boolean;
  likes: number;
  comments: number;
}

interface WebsiteSettings {
  isPublished: boolean;
  allowRSVP: boolean;
  allowPhotoUploads: boolean;
  allowComments: boolean;
  showGuestList: boolean;
  requirePassword: boolean;
  password?: string;
  customDomain: string;
  analytics: boolean;
  notifications: boolean;
}

// Mock data for enhanced features
const mockRSVPResponses: RSVPResponse[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 98765 43210',
    attending: true,
    plusOne: true,
    plusOneName: 'Raj Sharma',
    dietaryRestrictions: ['Vegetarian'],
    message: 'So excited for your wedding!',
    respondedAt: '2024-01-15T10:30:00Z',
    isConfirmed: true
  },
  {
    id: 2,
    name: 'Amit Kumar',
    email: 'amit@email.com',
    phone: '+91 98765 43211',
    attending: false,
    plusOne: false,
    dietaryRestrictions: [],
    message: 'Sorry, can\'t make it due to work commitments.',
    respondedAt: '2024-01-16T14:20:00Z',
    isConfirmed: true
  }
];

const mockPhotos: Photo[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    caption: 'Beautiful engagement photos',
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2024-01-10T12:00:00Z',
    isFeatured: true,
    likes: 24,
    tags: ['engagement', 'couple']
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
    caption: 'Venue preview',
    uploadedBy: 'Wedding Planner',
    uploadedAt: '2024-01-12T15:30:00Z',
    isFeatured: false,
    likes: 18,
    tags: ['venue', 'preview']
  }
];

const mockLiveUpdates: LiveUpdate[] = [
  {
    id: 1,
    title: 'Wedding Countdown Begins!',
    content: 'Only 30 days left until our special day! We can\'t wait to celebrate with all of you.',
    timestamp: '2024-01-20T09:00:00Z',
    type: 'announcement',
    isPinned: true,
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: 'New Photos Added',
    content: 'Check out our latest engagement photos in the gallery!',
    timestamp: '2024-01-19T16:30:00Z',
    type: 'photo',
    isPinned: false,
    likes: 32,
    comments: 8
  }
];

export function WeddingWebsite() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [websiteData, setWebsiteData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingTime: '',
    venue: '',
    venueAddress: '',
    ourStory: '',
    hashtag: '',
    customUrl: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  
  // Enhanced state for new features
  const [rsvpResponses, setRsvpResponses] = useState(mockRSVPResponses);
  const [photos, setPhotos] = useState(mockPhotos);
  const [liveUpdates, setLiveUpdates] = useState(mockLiveUpdates);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    isPublished: false,
    allowRSVP: true,
    allowPhotoUploads: true,
    allowComments: true,
    showGuestList: false,
    requirePassword: false,
    customDomain: '',
    analytics: true,
    notifications: true
  });
  const [activeTab, setActiveTab] = useState('design');
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [newUpdate, setNewUpdate] = useState({ title: '', content: '', type: 'announcement' as const });

  const themeColors = {
    maroon: 'from-[#8B1538] to-[#C41E3A]',
    pink: 'from-[#F4D7DD] to-[#FFE5EC]',
    gold: 'from-[#D4AF37] to-[#F4E4C1]',
    neutral: 'from-gray-100 to-gray-200',
  };

  // Enhanced functions for new features
  const addLiveUpdate = () => {
    if (newUpdate.title && newUpdate.content) {
      const update: LiveUpdate = {
        id: Date.now(),
        title: newUpdate.title,
        content: newUpdate.content,
        timestamp: new Date().toISOString(),
        type: newUpdate.type,
        isPinned: false,
        likes: 0,
        comments: 0
      };
      setLiveUpdates(prev => [update, ...prev]);
      setNewUpdate({ title: '', content: '', type: 'announcement' });
    }
  };

  const togglePhotoFeatured = (id: number) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, isFeatured: !photo.isFeatured } : photo
      )
    );
  };

  const likePhoto = (id: number) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
  };

  const likeUpdate = (id: number) => {
    setLiveUpdates(prev => 
      prev.map(update => 
        update.id === id ? { ...update, likes: update.likes + 1 } : update
      )
    );
  };

  const toggleUpdatePinned = (id: number) => {
    setLiveUpdates(prev => 
      prev.map(update => 
        update.id === id ? { ...update, isPinned: !update.isPinned } : update
      )
    );
  };

  const confirmRSVP = (id: number) => {
    setRsvpResponses(prev => 
      prev.map(response => 
        response.id === id ? { ...response, isConfirmed: true } : response
      )
    );
  };

  // Enhanced calculations
  const totalRSVPs = rsvpResponses.length;
  const confirmedRSVPs = rsvpResponses.filter(r => r.attending).length;
  const declinedRSVPs = rsvpResponses.filter(r => !r.attending).length;
  const pendingRSVPs = rsvpResponses.filter(r => !r.isConfirmed).length;
  const totalPhotos = photos.length;
  const featuredPhotos = photos.filter(p => p.isFeatured).length;
  const totalLikes = photos.reduce((sum, photo) => sum + photo.likes, 0);
  const totalUpdates = liveUpdates.length;
  const pinnedUpdates = liveUpdates.filter(u => u.isPinned).length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Website Builder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a beautiful personalized website for your wedding
          </p>
        </div>

        {/* Enhanced Benefits with Live Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Globe className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Custom URL</h3>
              <p className="text-xs text-muted-foreground">yourstory.shaadi.com</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                <span className="text-xs text-muted-foreground">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Share2 className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Easy Sharing</h3>
              <p className="text-xs text-muted-foreground">Share with all guests</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Heart className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">RSVP Built-in</h3>
              <p className="text-xs text-muted-foreground">{confirmedRSVPs}/{totalRSVPs} responses</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Photo Gallery</h3>
              <p className="text-xs text-muted-foreground">{totalPhotos} photos, {totalLikes} likes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="design" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="design">
              <Palette className="w-4 h-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="content">
              <Type className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="rsvp">
              <Users className="w-4 h-4 mr-2" />
              RSVP
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <Camera className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="updates">
              <Bell className="w-4 h-4 mr-2" />
              Updates
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design">
            <div className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Choose Your Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer hover:shadow-lg transition-all ${
                          selectedTemplate.id === template.id ? 'border-2 border-accent' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="relative h-40">
                          <ImageWithFallback
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          {selectedTemplate.id === template.id && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center rounded-t-lg">
                              <Badge className="gradient-gold">Selected</Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="text-sm text-center">{template.name}</h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Customize Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(themeColors).map(([key, gradient]) => (
                      <div
                        key={key}
                        className={`h-20 rounded-lg bg-gradient-to-r ${gradient} cursor-pointer hover:scale-105 transition-transform flex items-center justify-center`}
                        onClick={() => setSelectedTemplate({ ...selectedTemplate, theme: key as any })}
                      >
                        {selectedTemplate.theme === key && (
                          <Badge className="bg-white text-foreground">Active</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Couple Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brideName">Bride's Name</Label>
                    <Input
                      id="brideName"
                      value={websiteData.brideName}
                      onChange={(e) => setWebsiteData({ ...websiteData, brideName: e.target.value })}
                      placeholder="Enter bride's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Groom's Name</Label>
                    <Input
                      id="groomName"
                      value={websiteData.groomName}
                      onChange={(e) => setWebsiteData({ ...websiteData, groomName: e.target.value })}
                      placeholder="Enter groom's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hashtag">Wedding Hashtag</Label>
                    <Input
                      id="hashtag"
                      value={websiteData.hashtag}
                      onChange={(e) => setWebsiteData({ ...websiteData, hashtag: e.target.value })}
                      placeholder="#YourWeddingHashtag"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customUrl">Custom Website URL</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="customUrl"
                        value={websiteData.customUrl}
                        onChange={(e) => setWebsiteData({ ...websiteData, customUrl: e.target.value })}
                        placeholder="yournames"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">.shaadi.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weddingDate">Wedding Date</Label>
                      <Input
                        id="weddingDate"
                        type="date"
                        value={websiteData.weddingDate}
                        onChange={(e) => setWebsiteData({ ...websiteData, weddingDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weddingTime">Time</Label>
                      <Input
                        id="weddingTime"
                        type="time"
                        value={websiteData.weddingTime}
                        onChange={(e) => setWebsiteData({ ...websiteData, weddingTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue Name</Label>
                    <Input
                      id="venue"
                      value={websiteData.venue}
                      onChange={(e) => setWebsiteData({ ...websiteData, venue: e.target.value })}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">Venue Address</Label>
                    <Textarea
                      id="venueAddress"
                      rows={3}
                      value={websiteData.venueAddress}
                      onChange={(e) => setWebsiteData({ ...websiteData, venueAddress: e.target.value })}
                      placeholder="Full venue address"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism md:col-span-2">
                <CardHeader>
                  <CardTitle>Our Love Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={6}
                    value={websiteData.ourStory}
                    onChange={(e) => setWebsiteData({ ...websiteData, ourStory: e.target.value })}
                    placeholder="Share your beautiful love story with your guests..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* RSVP Tab */}
          <TabsContent value="rsvp">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">RSVP Management</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* RSVP Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold text-green-600">{confirmedRSVPs}</p>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold text-red-600">{declinedRSVPs}</p>
                    <p className="text-sm text-muted-foreground">Declined</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold text-yellow-600">{pendingRSVPs}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-blue-600">{totalRSVPs}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* RSVP Responses */}
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>RSVP Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rsvpResponses.map((response) => (
                      <div key={response.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{response.name}</h4>
                              <Badge variant={response.attending ? 'default' : 'destructive'}>
                                {response.attending ? 'Attending' : 'Not Attending'}
                              </Badge>
                              {!response.isConfirmed && (
                                <Badge variant="secondary">Pending Confirmation</Badge>
                              )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {response.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {response.phone}
                              </div>
                              {response.plusOne && response.plusOneName && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  +1: {response.plusOneName}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(response.respondedAt).toLocaleDateString()}
                              </div>
                            </div>
                            {response.dietaryRestrictions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Dietary Restrictions:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {response.dietaryRestrictions.map((restriction, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {restriction}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {response.message && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Message:</p>
                                <p className="text-sm text-muted-foreground">{response.message}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!response.isConfirmed && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmRSVP(response.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Photo Gallery</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* Gallery Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{totalPhotos}</p>
                    <p className="text-sm text-muted-foreground">Total Photos</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">{totalLikes}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{featuredPhotos}</p>
                    <p className="text-sm text-muted-foreground">Featured</p>
                  </CardContent>
                </Card>
              </div>

              {/* Photo Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="glassmorphism">
                    <div className="relative">
                      <ImageWithFallback
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {photo.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-500">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => likePhoto(photo.id)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => togglePhotoFeatured(photo.id)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{photo.caption}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>By {photo.uploadedBy}</span>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>{photo.likes}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Live Updates</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPhotoDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Update
                  </Button>
                </div>
              </div>

              {/* Update Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{totalUpdates}</p>
                    <p className="text-sm text-muted-foreground">Total Updates</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{pinnedUpdates}</p>
                    <p className="text-sm text-muted-foreground">Pinned</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">
                      {liveUpdates.reduce((sum, update) => sum + update.likes, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </CardContent>
                </Card>
              </div>

              {/* Live Updates Feed */}
              <div className="space-y-4">
                {liveUpdates.map((update) => (
                  <Card key={update.id} className="glassmorphism">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{update.title}</h4>
                            {update.isPinned && (
                              <Badge className="bg-yellow-500">
                                <Star className="w-3 h-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            <Badge variant="outline">{update.type}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{update.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(update.timestamp).toLocaleString()}</span>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{update.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{update.comments} comments</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => likeUpdate(update.id)}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUpdatePinned(update.id)}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            {update.isPinned ? 'Unpin' : 'Pin'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="overflow-hidden">
              <div className={`h-96 bg-gradient-to-br ${themeColors[selectedTemplate.theme as keyof typeof themeColors]} relative`}>
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <div>
                    <h1 className={`text-5xl mb-4 ${selectedTemplate.theme === 'pink' || selectedTemplate.theme === 'gold' ? 'text-foreground' : 'text-white'}`}>
                      {websiteData.brideName && websiteData.groomName 
                        ? `${websiteData.brideName} & ${websiteData.groomName}`
                        : 'Your Names Here'}
                    </h1>
                    {websiteData.weddingDate && (
                      <p className={`text-xl ${selectedTemplate.theme === 'pink' || selectedTemplate.theme === 'gold' ? 'text-foreground/80' : 'text-white/90'}`}>
                        <Calendar className="w-5 h-5 inline mr-2" />
                        {new Date(websiteData.weddingDate).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    )}
                    {websiteData.hashtag && (
                      <p className={`text-2xl mt-4 ${selectedTemplate.theme === 'pink' || selectedTemplate.theme === 'gold' ? 'text-primary' : 'text-white'}`}>
                        {websiteData.hashtag}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Our Story Section */}
                {websiteData.ourStory && (
                  <div className="text-center max-w-3xl mx-auto">
                    <h2 className="mb-4 flex items-center justify-center gap-2">
                      <Heart className="w-6 h-6 text-primary" />
                      Our Love Story
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">{websiteData.ourStory}</p>
                  </div>
                )}

                {/* Event Details */}
                {(websiteData.venue || websiteData.venueAddress) && (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="mb-6 text-center flex items-center justify-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      Event Details
                    </h2>
                    <Card className="glassmorphism">
                      <CardContent className="p-6 space-y-4">
                        {websiteData.venue && (
                          <div>
                            <Label className="text-muted-foreground">Venue</Label>
                            <p className="text-xl">{websiteData.venue}</p>
                          </div>
                        )}
                        {websiteData.venueAddress && (
                          <div>
                            <Label className="text-muted-foreground">Address</Label>
                            <p>{websiteData.venueAddress}</p>
                          </div>
                        )}
                        {websiteData.weddingTime && (
                          <div>
                            <Label className="text-muted-foreground">Time</Label>
                            <p>{websiteData.weddingTime}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* RSVP Section */}
                <div className="text-center">
                  <Button size="lg" className="gradient-maroon">
                    <Users className="w-5 h-5 mr-2" />
                    RSVP Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-6">
              <Button className="flex-1 gradient-maroon">
                <Download className="w-4 h-4 mr-2" />
                Publish Website
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share Preview
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Update Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Live Update</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="updateTitle">Title</Label>
                <Input
                  id="updateTitle"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  placeholder="Enter update title"
                />
              </div>
              <div>
                <Label htmlFor="updateContent">Content</Label>
                <Textarea
                  id="updateContent"
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  placeholder="Enter update content"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="updateType">Type</Label>
                <Select value={newUpdate.type} onValueChange={(value: any) => setNewUpdate({ ...newUpdate, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addLiveUpdate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Website Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublished">Publish Website</Label>
                    <p className="text-sm text-muted-foreground">Make your website live</p>
                  </div>
                  <Checkbox
                    id="isPublished"
                    checked={websiteSettings.isPublished}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, isPublished: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRSVP">Allow RSVP</Label>
                    <p className="text-sm text-muted-foreground">Enable RSVP functionality</p>
                  </div>
                  <Checkbox
                    id="allowRSVP"
                    checked={websiteSettings.allowRSVP}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, allowRSVP: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowPhotoUploads">Allow Photo Uploads</Label>
                    <p className="text-sm text-muted-foreground">Let guests upload photos</p>
                  </div>
                  <Checkbox
                    id="allowPhotoUploads"
                    checked={websiteSettings.allowPhotoUploads}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, allowPhotoUploads: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowComments">Allow Comments</Label>
                    <p className="text-sm text-muted-foreground">Enable comments on updates</p>
                  </div>
                  <Checkbox
                    id="allowComments"
                    checked={websiteSettings.allowComments}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, allowComments: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showGuestList">Show Guest List</Label>
                    <p className="text-sm text-muted-foreground">Display confirmed guests</p>
                  </div>
                  <Checkbox
                    id="showGuestList"
                    checked={websiteSettings.showGuestList}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, showGuestList: checked as boolean })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requirePassword">Require Password</Label>
                    <p className="text-sm text-muted-foreground">Protect website with password</p>
                  </div>
                  <Checkbox
                    id="requirePassword"
                    checked={websiteSettings.requirePassword}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, requirePassword: checked as boolean })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={websiteSettings.customDomain}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, customDomain: e.target.value })}
                    placeholder="yourdomain.com"
                  />
                </div>
                {websiteSettings.requirePassword && (
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={websiteSettings.password || ''}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSettingsDialog(false)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
