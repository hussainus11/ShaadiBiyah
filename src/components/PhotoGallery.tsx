import { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Download, Heart, Share2, Filter, Grid3x3, LayoutGrid, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Tag, Users, Calendar, MapPin, Camera, Sparkles, Bookmark, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface Photo {
  id: number;
  url: string;
  event: string;
  date: string;
  photographer?: string;
  liked: boolean;
  caption?: string;
  tags?: string[];
  location?: string;
  people?: string[];
  isPrivate?: boolean;
  aiTags?: string[];
  downloadCount?: number;
  shareCount?: number;
  isBookmarked?: boolean;
  quality?: 'HD' | '4K' | 'Standard';
  camera?: string;
  settings?: string;
}

const mockPhotos: Photo[] = [
  { 
    id: 1, 
    url: 'https://images.unsplash.com/photo-1735052713313-40c183b5e4cf?w=600&h=400&fit=crop', 
    event: 'Engagement', 
    date: '2025-01-15', 
    photographer: 'Rahul Photography', 
    liked: true, 
    caption: 'The perfect moment',
    tags: ['romantic', 'couple', 'ring'],
    location: 'Taj Palace Hotel, Mumbai',
    people: ['Priya', 'Amit'],
    isPrivate: false,
    aiTags: ['wedding ring', 'proposal', 'romantic'],
    downloadCount: 45,
    shareCount: 12,
    isBookmarked: true,
    quality: '4K',
    camera: 'Canon EOS R5',
    settings: 'f/2.8, 1/125s, ISO 400'
  },
  { 
    id: 2, 
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop', 
    event: 'Mehndi', 
    date: '2025-03-10', 
    photographer: 'Studio Moments', 
    liked: false, 
    caption: 'Mehndi celebration',
    tags: ['mehndi', 'celebration', 'traditional'],
    location: 'Grand Ballroom, Delhi',
    people: ['Priya', 'Family'],
    isPrivate: false,
    aiTags: ['henna', 'hands', 'celebration'],
    downloadCount: 32,
    shareCount: 8,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Sony A7 III',
    settings: 'f/4, 1/60s, ISO 800'
  },
  { 
    id: 3, 
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', 
    event: 'Sangeet', 
    date: '2025-03-11', 
    photographer: 'Pixel Perfect', 
    liked: true, 
    caption: 'Dance night',
    tags: ['dance', 'music', 'celebration'],
    location: 'Convention Center, Bangalore',
    people: ['Priya', 'Amit', 'Friends'],
    isPrivate: false,
    aiTags: ['dancing', 'party', 'music'],
    downloadCount: 67,
    shareCount: 23,
    isBookmarked: true,
    quality: '4K',
    camera: 'Nikon D850',
    settings: 'f/2.8, 1/100s, ISO 1600'
  },
  { 
    id: 4, 
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop', 
    event: 'Wedding', 
    date: '2025-03-12', 
    photographer: 'Rahul Photography', 
    liked: true, 
    caption: 'The big day',
    tags: ['wedding', 'ceremony', 'sacred'],
    location: 'Temple Complex, Varanasi',
    people: ['Priya', 'Amit', 'Family'],
    isPrivate: true,
    aiTags: ['wedding ceremony', 'temple', 'sacred'],
    downloadCount: 89,
    shareCount: 45,
    isBookmarked: true,
    quality: '4K',
    camera: 'Canon EOS R5',
    settings: 'f/1.4, 1/250s, ISO 200'
  },
  { 
    id: 5, 
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop', 
    event: 'Wedding', 
    date: '2025-03-12', 
    photographer: 'Rahul Photography', 
    liked: false, 
    caption: 'Together forever',
    tags: ['couple', 'wedding', 'love'],
    location: 'Temple Complex, Varanasi',
    people: ['Priya', 'Amit'],
    isPrivate: false,
    aiTags: ['wedding couple', 'love', 'ceremony'],
    downloadCount: 56,
    shareCount: 18,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Canon EOS R5',
    settings: 'f/2.8, 1/125s, ISO 400'
  },
  { 
    id: 6, 
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop', 
    event: 'Reception', 
    date: '2025-03-13', 
    photographer: 'Studio Moments', 
    liked: true, 
    caption: 'Reception party',
    tags: ['reception', 'party', 'celebration'],
    location: 'Grand Hotel, Mumbai',
    people: ['Priya', 'Amit', 'Guests'],
    isPrivate: false,
    aiTags: ['party', 'celebration', 'reception'],
    downloadCount: 78,
    shareCount: 34,
    isBookmarked: true,
    quality: '4K',
    camera: 'Sony A7 III',
    settings: 'f/2.8, 1/80s, ISO 1200'
  },
  { 
    id: 7, 
    url: 'https://images.unsplash.com/photo-1529634597792-31203e4d7633?w=600&h=400&fit=crop', 
    event: 'Pre-Wedding', 
    date: '2025-02-01', 
    photographer: 'Pixel Perfect', 
    liked: false, 
    caption: 'Love story shoot',
    tags: ['pre-wedding', 'couple', 'romantic'],
    location: 'Goa Beach',
    people: ['Priya', 'Amit'],
    isPrivate: false,
    aiTags: ['beach', 'couple', 'romantic'],
    downloadCount: 43,
    shareCount: 15,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Nikon D850',
    settings: 'f/1.8, 1/200s, ISO 100'
  },
  { 
    id: 8, 
    url: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600&h=400&fit=crop', 
    event: 'Haldi', 
    date: '2025-03-10', 
    photographer: 'Studio Moments', 
    liked: true, 
    caption: 'Yellow festivities',
    tags: ['haldi', 'yellow', 'celebration'],
    location: 'Home, Delhi',
    people: ['Priya', 'Family', 'Friends'],
    isPrivate: false,
    aiTags: ['yellow', 'celebration', 'traditional'],
    downloadCount: 29,
    shareCount: 7,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Sony A7 III',
    settings: 'f/4, 1/60s, ISO 1000'
  },
  { 
    id: 9, 
    url: 'https://images.unsplash.com/photo-1606914469633-ed648dacf672?w=600&h=400&fit=crop', 
    event: 'Sangeet', 
    date: '2025-03-11', 
    photographer: 'Pixel Perfect', 
    liked: false, 
    caption: 'Music and dance',
    tags: ['sangeet', 'music', 'dance'],
    location: 'Convention Center, Bangalore',
    people: ['Priya', 'Amit', 'Family'],
    isPrivate: false,
    aiTags: ['music', 'dance', 'celebration'],
    downloadCount: 41,
    shareCount: 12,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Nikon D850',
    settings: 'f/2.8, 1/100s, ISO 1600'
  },
  { 
    id: 10, 
    url: 'https://images.unsplash.com/photo-1623783356340-95e1a82e5f6e?w=600&h=400&fit=crop', 
    event: 'Wedding', 
    date: '2025-03-12', 
    photographer: 'Rahul Photography', 
    liked: true, 
    caption: 'Vows exchange',
    tags: ['wedding', 'vows', 'ceremony'],
    location: 'Temple Complex, Varanasi',
    people: ['Priya', 'Amit'],
    isPrivate: true,
    aiTags: ['wedding vows', 'ceremony', 'sacred'],
    downloadCount: 92,
    shareCount: 38,
    isBookmarked: true,
    quality: '4K',
    camera: 'Canon EOS R5',
    settings: 'f/1.4, 1/250s, ISO 200'
  },
  { 
    id: 11, 
    url: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&h=400&fit=crop', 
    event: 'Reception', 
    date: '2025-03-13', 
    photographer: 'Studio Moments', 
    liked: false, 
    caption: 'Celebration time',
    tags: ['reception', 'celebration', 'party'],
    location: 'Grand Hotel, Mumbai',
    people: ['Priya', 'Amit', 'Guests'],
    isPrivate: false,
    aiTags: ['party', 'celebration', 'reception'],
    downloadCount: 35,
    shareCount: 9,
    isBookmarked: false,
    quality: 'HD',
    camera: 'Sony A7 III',
    settings: 'f/2.8, 1/80s, ISO 1200'
  },
  { 
    id: 12, 
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', 
    event: 'Engagement', 
    date: '2025-01-15', 
    photographer: 'Pixel Perfect', 
    liked: true, 
    caption: 'Yes to forever',
    tags: ['engagement', 'ring', 'romantic'],
    location: 'Taj Palace Hotel, Mumbai',
    people: ['Priya', 'Amit'],
    isPrivate: false,
    aiTags: ['engagement ring', 'proposal', 'romantic'],
    downloadCount: 58,
    shareCount: 21,
    isBookmarked: true,
    quality: '4K',
    camera: 'Nikon D850',
    settings: 'f/2.8, 1/125s, ISO 400'
  },
];

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [filterEvent, setFilterEvent] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showOnlyLiked, setShowOnlyLiked] = useState(false);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [showPrivatePhotos, setShowPrivatePhotos] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');
  const [isSlideshowMode, setIsSlideshowMode] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const events = ['All', 'Engagement', 'Pre-Wedding', 'Haldi', 'Mehndi', 'Sangeet', 'Wedding', 'Reception'];
  const allTags = ['All', ...Array.from(new Set(photos.flatMap(photo => photo.tags || [])))];

  const filteredPhotos = photos.filter(photo => {
    if (filterEvent !== 'All' && photo.event !== filterEvent) return false;
    if (showOnlyLiked && !photo.liked) return false;
    if (showOnlyBookmarked && !photo.isBookmarked) return false;
    if (!showPrivatePhotos && photo.isPrivate) return false;
    if (selectedTag !== 'All' && !photo.tags?.includes(selectedTag)) return false;
    if (searchQuery && !photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !photo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !photo.people?.some(person => person.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const toggleLike = (id: number) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, liked: !p.liked } : p
    ));
  };

  const toggleBookmark = (id: number) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
  };

  const togglePrivacy = (id: number) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, isPrivate: !p.isPrivate } : p
    ));
  };

  const handleShare = (photo: Photo) => {
    setPhotos(photos.map(p => 
      p.id === photo.id ? { ...p, shareCount: (p.shareCount || 0) + 1 } : p
    ));
    toast.success('Photo link copied to clipboard!');
  };

  const handleDownload = (photo: Photo) => {
    setPhotos(photos.map(p => 
      p.id === photo.id ? { ...p, downloadCount: (p.downloadCount || 0) + 1 } : p
    ));
    toast.success('Photo downloaded!');
  };

  const startSlideshow = () => {
    setIsSlideshowMode(true);
    setSlideshowIndex(0);
  };

  const nextSlide = () => {
    setSlideshowIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const prevSlide = () => {
    setSlideshowIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const stopSlideshow = () => {
    setIsSlideshowMode(false);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowEditDialog(true);
  };

  const savePhotoEdit = (updatedPhoto: Photo) => {
    setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
    setShowEditDialog(false);
    setEditingPhoto(null);
    toast.success('Photo updated successfully!');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Enhanced Wedding Photo Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your beautiful wedding moments captured forever with AI-powered organization and advanced features
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Photos</p>
              <p className="text-2xl text-primary">{photos.length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Favorites</p>
              <p className="text-2xl text-primary">{photos.filter(p => p.liked).length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Bookmarked</p>
              <p className="text-2xl text-primary">{photos.filter(p => p.isBookmarked).length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
              <p className="text-2xl text-primary">{photos.reduce((sum, p) => sum + (p.downloadCount || 0), 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gallery">
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="slideshow">
              <Play className="w-4 h-4 mr-2" />
              Slideshow
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Filter className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-tags">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Tags
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            {/* Enhanced Filters and Actions */}
            <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {events.map((event) => (
                  <Button
                    key={event}
                    variant={filterEvent === event ? 'default' : 'outline'}
                    onClick={() => setFilterEvent(event)}
                    className={filterEvent === event ? 'gradient-maroon' : ''}
                    size="sm"
                  >
                    {event}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {allTags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? 'gradient-pink text-primary' : ''}
                    size="sm"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search photos..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button
                  variant={showOnlyLiked ? 'default' : 'outline'}
                  onClick={() => setShowOnlyLiked(!showOnlyLiked)}
                  className={showOnlyLiked ? 'gradient-pink text-primary' : ''}
                  size="sm"
                >
                  <Heart className={`w-4 h-4 mr-2 ${showOnlyLiked ? 'fill-primary' : ''}`} />
                  Favorites
                </Button>

                <Button
                  variant={showOnlyBookmarked ? 'default' : 'outline'}
                  onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                  className={showOnlyBookmarked ? 'gradient-gold text-foreground' : ''}
                  size="sm"
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${showOnlyBookmarked ? 'fill-foreground' : ''}`} />
                  Bookmarked
                </Button>

                <Button
                  variant={showPrivatePhotos ? 'default' : 'outline'}
                  onClick={() => setShowPrivatePhotos(!showPrivatePhotos)}
                  className={showPrivatePhotos ? 'gradient-maroon' : ''}
                  size="sm"
                >
                  {showPrivatePhotos ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showPrivatePhotos ? 'Show Private' : 'Hide Private'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
                  size="sm"
                >
                  {viewMode === 'grid' ? (
                    <LayoutGrid className="w-4 h-4 mr-2" />
                  ) : (
                    <Grid3x3 className="w-4 h-4 mr-2" />
                  )}
                  {viewMode === 'grid' ? 'Masonry' : 'Grid'}
                </Button>

                <Button className="gradient-maroon" size="sm" onClick={startSlideshow}>
                  <Play className="w-4 h-4 mr-2" />
                  Slideshow
                </Button>

                <Button className="gradient-pink text-primary" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Enhanced Photo Grid */}
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-3 lg:grid-cols-4' 
                : 'md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredPhotos.map((photo) => (
                <Card
                  key={photo.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative aspect-[4/3]">
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.caption || photo.event}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Enhanced Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(photo.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${photo.liked ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(photo.id);
                        }}
                      >
                        <Bookmark className={`w-4 h-4 ${photo.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo);
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPhoto(photo);
                        }}
                      >
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Enhanced Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge className="bg-white/90 text-foreground">
                        {photo.event}
                      </Badge>
                      {photo.quality && (
                        <Badge className="bg-green-500 text-white text-xs">
                          {photo.quality}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {photo.liked && (
                        <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                      )}
                      {photo.isBookmarked && (
                        <Bookmark className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                      )}
                      {photo.isPrivate && (
                        <EyeOff className="w-6 h-6 text-white bg-black/50 rounded" />
                      )}
                    </div>

                    {/* AI Tags indicator */}
                    {photo.aiTags && photo.aiTags.length > 0 && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Tagged
                        </Badge>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      {photo.downloadCount && photo.downloadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          {photo.downloadCount}
                        </Badge>
                      )}
                      {photo.shareCount && photo.shareCount > 0 && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <Share2 className="w-3 h-3 mr-1" />
                          {photo.shareCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <p className="text-sm font-medium mb-1">{photo.caption}</p>
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {photo.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {photo.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{photo.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{photo.photographer}</span>
                      <span>{new Date(photo.date).toLocaleDateString()}</span>
                    </div>
                    {photo.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <Card className="glassmorphism p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">No photos found</h3>
                <p className="text-muted-foreground mb-6">
                  {showOnlyLiked 
                    ? 'No favorite photos yet. Start liking your favorite moments!'
                    : showOnlyBookmarked
                    ? 'No bookmarked photos yet. Start bookmarking your favorite moments!'
                    : 'Upload your first wedding photo to get started'}
                </p>
                <Button className="gradient-maroon">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Slideshow Tab */}
          <TabsContent value="slideshow">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Photo Slideshow</span>
                  <div className="flex gap-2">
                    <Button onClick={startSlideshow} disabled={isSlideshowMode}>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button onClick={stopSlideshow} disabled={!isSlideshowMode}>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSlideshowMode && filteredPhotos.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={filteredPhotos[slideshowIndex].url}
                        alt={filteredPhotos[slideshowIndex].caption || filteredPhotos[slideshowIndex].event}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
                      <h3 className="text-lg font-medium">{filteredPhotos[slideshowIndex].caption}</h3>
                      <p className="text-sm opacity-80">{filteredPhotos[slideshowIndex].event} • {filteredPhotos[slideshowIndex].photographer}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button onClick={prevSlide}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground self-center">
                        {slideshowIndex + 1} of {filteredPhotos.length}
                      </span>
                      <Button onClick={nextSlide}>
                        Next
                        <RotateCcw className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="mb-2">Start Slideshow</h3>
                    <p className="text-muted-foreground mb-6">
                      Click start to begin viewing your photos in slideshow mode
                    </p>
                    <Button onClick={startSlideshow} disabled={filteredPhotos.length === 0}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Slideshow
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Photo Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Photos</span>
                      <span className="font-medium">{photos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Favorites</span>
                      <span className="font-medium">{photos.filter(p => p.liked).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bookmarked</span>
                      <span className="font-medium">{photos.filter(p => p.isBookmarked).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Private Photos</span>
                      <span className="font-medium">{photos.filter(p => p.isPrivate).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Downloads</span>
                      <span className="font-medium">{photos.reduce((sum, p) => sum + (p.downloadCount || 0), 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Shares</span>
                      <span className="font-medium">{photos.reduce((sum, p) => sum + (p.shareCount || 0), 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Event Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.slice(1).map(event => {
                      const count = photos.filter(p => p.event === event).length;
                      return (
                        <div key={event} className="flex justify-between">
                          <span>{event}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Quality Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>4K Photos</span>
                      <Badge className="bg-green-500">{photos.filter(p => p.quality === '4K').length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>HD Photos</span>
                      <Badge className="bg-blue-500">{photos.filter(p => p.quality === 'HD').length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard</span>
                      <Badge className="bg-gray-500">{photos.filter(p => p.quality === 'Standard').length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Top Photographers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(photos.map(p => p.photographer).filter(Boolean)))
                      .map(photographer => {
                        const count = photos.filter(p => p.photographer === photographer).length;
                        return (
                          <div key={photographer} className="flex justify-between">
                            <span>{photographer}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Tags Tab */}
          <TabsContent value="ai-tags">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered Photo Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">AI Generated Tags</h4>
                    <div className="space-y-2">
                      {Array.from(new Set(photos.flatMap(p => p.aiTags || [])))
                        .map(tag => (
                          <Badge key={tag} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Manual Tags</h4>
                    <div className="space-y-2">
                      {Array.from(new Set(photos.flatMap(p => p.tags || [])))
                        .map(tag => (
                          <Badge key={tag} variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Photo Detail Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-6xl p-0">
            {selectedPhoto && (
              <div>
                <div className="relative">
                  <ImageWithFallback
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption || selectedPhoto.event}
                    className="w-full max-h-[70vh] object-contain bg-black"
                  />
                  {/* Enhanced overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 text-foreground">
                      {selectedPhoto.event}
                    </Badge>
                    {selectedPhoto.quality && (
                      <Badge className="bg-green-500 text-white">
                        {selectedPhoto.quality}
                      </Badge>
                    )}
                    {selectedPhoto.isPrivate && (
                      <Badge className="bg-red-500 text-white">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl">{selectedPhoto.caption || selectedPhoto.event}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <span>{selectedPhoto.event}</span>
                        <span>•</span>
                        <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                        {selectedPhoto.photographer && (
                          <>
                            <span>•</span>
                            <span>{selectedPhoto.photographer}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Enhanced metadata */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          {selectedPhoto.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4" />
                              {selectedPhoto.location}
                            </div>
                          )}
                          {selectedPhoto.people && selectedPhoto.people.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Users className="w-4 h-4" />
                              {selectedPhoto.people.join(', ')}
                            </div>
                          )}
                        </div>
                        <div>
                          {selectedPhoto.camera && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Camera className="w-4 h-4" />
                              {selectedPhoto.camera}
                            </div>
                          )}
                          {selectedPhoto.settings && (
                            <div className="text-sm text-muted-foreground">
                              {selectedPhoto.settings}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {(selectedPhoto.tags || selectedPhoto.aiTags) && (
                        <div className="mb-4">
                          {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                            <div className="mb-2">
                              <h4 className="text-sm font-medium mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedPhoto.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedPhoto.aiTags && selectedPhoto.aiTags.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">AI Tags</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedPhoto.aiTags.map((tag, index) => (
                                  <Badge key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={selectedPhoto.liked ? 'bg-red-500' : ''}>
                        <Heart className={`w-4 h-4 mr-1 ${selectedPhoto.liked ? 'fill-white' : ''}`} />
                        {selectedPhoto.liked ? 'Liked' : 'Like'}
                      </Badge>
                      {selectedPhoto.isBookmarked && (
                        <Badge className="bg-yellow-500">
                          <Bookmark className="w-4 h-4 mr-1 fill-white" />
                          Bookmarked
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gradient-pink text-primary"
                      onClick={() => toggleLike(selectedPhoto.id)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${selectedPhoto.liked ? 'fill-primary' : ''}`} />
                      {selectedPhoto.liked ? 'Unlike' : 'Like'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => toggleBookmark(selectedPhoto.id)}
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${selectedPhoto.isBookmarked ? 'fill-yellow-500' : ''}`} />
                      {selectedPhoto.isBookmarked ? 'Unbookmark' : 'Bookmark'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShare(selectedPhoto)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownload(selectedPhoto)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEditPhoto(selectedPhoto)}
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Photo Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Photo Details</DialogTitle>
            </DialogHeader>
            {editingPhoto && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={editingPhoto.caption || ''}
                    onChange={(e) => setEditingPhoto({...editingPhoto, caption: e.target.value})}
                    placeholder="Enter photo caption"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={editingPhoto.tags?.join(', ') || ''}
                    onChange={(e) => setEditingPhoto({...editingPhoto, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="romantic, couple, wedding"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="people">People (comma separated)</Label>
                  <Input
                    id="people"
                    value={editingPhoto.people?.join(', ') || ''}
                    onChange={(e) => setEditingPhoto({...editingPhoto, people: e.target.value.split(',').map(p => p.trim()).filter(Boolean)})}
                    placeholder="Priya, Amit, Family"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingPhoto.location || ''}
                    onChange={(e) => setEditingPhoto({...editingPhoto, location: e.target.value})}
                    placeholder="Taj Palace Hotel, Mumbai"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={editingPhoto.isPrivate || false}
                    onChange={(e) => setEditingPhoto({...editingPhoto, isPrivate: e.target.checked})}
                  />
                  <Label htmlFor="isPrivate">Private Photo</Label>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gradient-maroon" 
                    onClick={() => savePhotoEdit(editingPhoto)}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
