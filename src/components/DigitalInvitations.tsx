import { useState } from 'react';
import { Mail, Download, Share2, Eye, Edit, Palette, Type, Image as ImageIcon, Sparkles, X, Save, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

const templates = [
  {
    id: 1,
    name: 'Royal Elegance',
    category: 'Traditional',
    price: 0,
    image: 'https://images.unsplash.com/photo-1738025275088-554086913a78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwaW52aXRhdGlvbiUyMGNhcmR8ZW58MXx8fHwxNzYwNjM4NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    colors: ['#8B1538', '#D4AF37'],
    premium: false,
  },
  {
    id: 2,
    name: 'Floral Romance',
    category: 'Modern',
    price: 499,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
    colors: ['#F4D7DD', '#FFE5EC'],
    premium: true,
  },
  {
    id: 3,
    name: 'Golden Heritage',
    category: 'Traditional',
    price: 799,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    colors: ['#D4AF37', '#8B1538'],
    premium: true,
  },
  {
    id: 4,
    name: 'Minimalist Chic',
    category: 'Modern',
    price: 0,
    image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&h=600&fit=crop',
    colors: ['#2D1810', '#F4D7DD'],
    premium: false,
  },
  {
    id: 5,
    name: 'Peacock Splendor',
    category: 'Traditional',
    price: 999,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    colors: ['#006B5D', '#D4AF37'],
    premium: true,
  },
  {
    id: 6,
    name: 'Pastel Dreams',
    category: 'Modern',
    price: 599,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    colors: ['#FFE5EC', '#E8C7B5'],
    premium: true,
  },
];

export function DigitalInvitations() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [customizeMode, setCustomizeMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [invitationData, setInvitationData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    time: '',
    venue: '',
    message: 'We joyfully invite you to celebrate our wedding',
  });
  const [customizationData, setCustomizationData] = useState({
    primaryColor: '#8B1538',
    secondaryColor: '#D4AF37',
    fontFamily: 'serif',
    fontSize: 'medium',
    layout: 'standard',
  });
  const [shareData, setShareData] = useState({
    shareLink: '',
    shareMethod: 'whatsapp',
    guestList: '',
  });
  const [downloadData, setDownloadData] = useState({
    format: 'png',
    quality: 'high',
    size: 'standard',
  });
  const [copied, setCopied] = useState(false);

  const filteredTemplates = filterCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === filterCategory);

  // Handle preview functionality
  const handlePreview = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
    toast.success('Preview mode activated');
  };

  // Handle customize functionality
  const handleCustomize = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setCustomizeMode(true);
    // Initialize customization data with template colors
    setCustomizationData({
      ...customizationData,
      primaryColor: template.colors[0],
      secondaryColor: template.colors[1],
    });
    toast.success('Customization mode activated');
  };

  // Handle download functionality
  const handleDownload = () => {
    setShowDownloadDialog(true);
    toast.success('Preparing download...');
  };

  // Handle share functionality
  const handleShare = () => {
    setShowShareDialog(true);
    // Generate share link
    const shareLink = `https://shaadibiyah.com/invitation/${selectedTemplate?.id}`;
    setShareData({ ...shareData, shareLink });
    toast.success('Share options ready');
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareData.shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle save customization
  const handleSaveCustomization = () => {
    toast.success('Customization saved!');
    setCustomizeMode(false);
  };

  // Handle reset customization
  const handleResetCustomization = () => {
    if (selectedTemplate) {
      setCustomizationData({
        primaryColor: selectedTemplate.colors[0],
        secondaryColor: selectedTemplate.colors[1],
        fontFamily: 'serif',
        fontSize: 'medium',
        layout: 'standard',
      });
      toast.success('Customization reset');
    }
  };

  // Handle share method change
  const handleShareMethod = (method: string) => {
    setShareData({ ...shareData, shareMethod: method });
    let shareUrl = '';
    
    switch (method) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareData.shareLink)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Wedding Invitation&body=${encodeURIComponent(shareData.shareLink)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(shareData.shareLink)}`;
        break;
      default:
        shareUrl = shareData.shareLink;
    }
    
    window.open(shareUrl, '_blank');
    toast.success(`Opening ${method}...`);
  };

  // Handle download format
  const handleDownloadFormat = (format: string) => {
    setDownloadData({ ...downloadData, format });
    toast.success(`Download format set to ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Digital Wedding Invitations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create beautiful digital invitations and send them instantly to your guests
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Mail className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Instant Delivery</h3>
              <p className="text-xs text-muted-foreground">Send via WhatsApp, Email, SMS</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Palette className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Fully Customizable</h3>
              <p className="text-xs text-muted-foreground">Edit colors, text, and images</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Share2 className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Easy Sharing</h3>
              <p className="text-xs text-muted-foreground">Share with unlimited guests</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism text-center">
            <CardContent className="p-6">
              <Download className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="mb-2 text-sm">Download HD</h3>
              <p className="text-xs text-muted-foreground">High-quality downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-8 justify-center">
          {['All', 'Traditional', 'Modern'].map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              onClick={() => setFilterCategory(category)}
              className={filterCategory === category ? 'gradient-maroon' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-accent"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative h-64">
                <ImageWithFallback
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {template.premium && (
                  <Badge className="absolute top-4 left-4 gradient-gold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {template.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2">{template.name}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.category}</Badge>
                  <span className="text-primary">
                    {template.price === 0 ? 'Free' : `Rs.${template.price}`}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  className="flex-1 gradient-maroon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomize(template);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Customization Dialog */}
        <Dialog open={!!selectedTemplate && customizeMode} onOpenChange={() => {
          setCustomizeMode(false);
          setSelectedTemplate(null);
        }}>
          <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <DialogTitle>Customize Your Invitation</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Preview */}
                  <div>
                    <Label className="mb-3">Preview</Label>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-accent">
                      <ImageWithFallback
                        src={selectedTemplate.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                        <h2 className="text-white mb-2">
                          {invitationData.brideName && invitationData.groomName 
                            ? `${invitationData.brideName} & ${invitationData.groomName}`
                            : 'Bride & Groom Names'}
                        </h2>
                        <p className="text-white/90 text-sm mb-4">{invitationData.message}</p>
                        <div className="space-y-1 text-sm text-white/80">
                          <p>{invitationData.date || 'Date'}</p>
                          <p>{invitationData.time || 'Time'}</p>
                          <p>{invitationData.venue || 'Venue'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brideName">Bride's Name</Label>
                      <Input
                        id="brideName"
                        value={invitationData.brideName}
                        onChange={(e) => setInvitationData({...invitationData, brideName: e.target.value})}
                        placeholder="Enter bride's name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groomName">Groom's Name</Label>
                      <Input
                        id="groomName"
                        value={invitationData.groomName}
                        onChange={(e) => setInvitationData({...invitationData, groomName: e.target.value})}
                        placeholder="Enter groom's name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={invitationData.date}
                          onChange={(e) => setInvitationData({...invitationData, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={invitationData.time}
                          onChange={(e) => setInvitationData({...invitationData, time: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={invitationData.venue}
                        onChange={(e) => setInvitationData({...invitationData, venue: e.target.value})}
                        placeholder="Enter venue name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={3}
                        value={invitationData.message}
                        onChange={(e) => setInvitationData({...invitationData, message: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 gradient-maroon"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        className="flex-1 gradient-pink text-primary"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewMode} onOpenChange={setPreviewMode}>
          <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Preview: {selectedTemplate.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleResetCustomization}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button size="sm" onClick={() => setPreviewMode(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Close
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Full Preview */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-accent mx-auto max-w-md">
                    <ImageWithFallback
                      src={selectedTemplate.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                      <h2 className="text-white mb-2 text-2xl font-bold">
                        {invitationData.brideName && invitationData.groomName 
                          ? `${invitationData.brideName} & ${invitationData.groomName}`
                          : 'Bride & Groom Names'}
                      </h2>
                      <p className="text-white/90 text-sm mb-4">{invitationData.message}</p>
                      <div className="space-y-1 text-sm text-white/80">
                        <p>{invitationData.date || 'Date'}</p>
                        <p>{invitationData.time || 'Time'}</p>
                        <p>{invitationData.venue || 'Venue'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center">
                    <Button 
                      className="gradient-maroon"
                      onClick={() => {
                        setPreviewMode(false);
                        setCustomizeMode(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Your Invitation</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Share Link */}
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareData.shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className={copied ? 'bg-green-100 text-green-800' : ''}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Methods */}
              <div className="space-y-4">
                <Label>Share via</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShareMethod('whatsapp')}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span className="text-sm">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShareMethod('email')}
                  >
                    <Mail className="w-8 h-8 mb-2 text-blue-500" />
                    <span className="text-sm">Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShareMethod('sms')}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <span className="text-sm">SMS</span>
                  </Button>
                </div>
              </div>

              {/* Guest List */}
              <div className="space-y-2">
                <Label htmlFor="guestList">Guest List (Optional)</Label>
                <Textarea
                  id="guestList"
                  placeholder="Enter guest names, one per line..."
                  value={shareData.guestList}
                  onChange={(e) => setShareData({ ...shareData, guestList: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Download Dialog */}
        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Download Your Invitation</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-4">
                <Label>Download Format</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['png', 'jpg', 'pdf'].map((format) => (
                    <Button
                      key={format}
                      variant={downloadData.format === format ? 'default' : 'outline'}
                      onClick={() => handleDownloadFormat(format)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <span className="text-sm font-bold">{format.toUpperCase()}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-4">
                <Label>Quality</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((quality) => (
                    <Button
                      key={quality}
                      variant={downloadData.quality === quality ? 'default' : 'outline'}
                      onClick={() => setDownloadData({ ...downloadData, quality })}
                      className="capitalize"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <Label>Size</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['small', 'standard', 'large'].map((size) => (
                    <Button
                      key={size}
                      variant={downloadData.size === size ? 'default' : 'outline'}
                      onClick={() => setDownloadData({ ...downloadData, size })}
                      className="capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 gradient-maroon"
                  onClick={() => {
                    toast.success(`Downloading ${downloadData.format.toUpperCase()} file...`);
                    setShowDownloadDialog(false);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDownloadDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
