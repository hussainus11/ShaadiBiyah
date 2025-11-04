import { useState } from 'react';
import { Shirt, Plus, Trash2, Check, Calendar, Palette, Upload, ShoppingBag, Camera, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface Outfit {
  id: number;
  event: string;
  person: 'Bride' | 'Groom';
  outfit: string;
  designer?: string;
  color: string;
  accessories: string[];
  notes: string;
  purchased: boolean;
  imageUrl?: string;
  budget: number;
  spent: number;
}

const mockOutfits: Outfit[] = [
  {
    id: 1,
    event: 'Mehndi',
    person: 'Bride',
    outfit: 'Yellow Lehenga with Mirror Work',
    designer: 'Manish Malhotra',
    color: '#FFD700',
    accessories: ['Maang Tikka', 'Bangles', 'Jhumkas'],
    notes: 'Light and comfortable for dancing',
    purchased: true,
    imageUrl: 'https://images.unsplash.com/photo-1661332517932-2d441bfb2994?w=400&h=400&fit=crop',
    budget: 80000,
    spent: 75000,
  },
  {
    id: 2,
    event: 'Mehndi',
    person: 'Groom',
    outfit: 'Yellow Kurta with White Pajama',
    designer: 'Manyavar',
    color: '#FFD700',
    accessories: ['Brooch', 'Mojari'],
    notes: 'Matching with bride',
    purchased: true,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    budget: 25000,
    spent: 22000,
  },
  {
    id: 3,
    event: 'Sangeet',
    person: 'Bride',
    outfit: 'Pink Anarkali with Dupatta',
    designer: 'Sabyasachi',
    color: '#FF69B4',
    accessories: ['Necklace', 'Earrings', 'Ring'],
    notes: 'Perfect for dance performances',
    purchased: false,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
    budget: 120000,
    spent: 0,
  },
  {
    id: 4,
    event: 'Wedding Ceremony',
    person: 'Bride',
    outfit: 'Red Bridal Lehenga with Heavy Embroidery',
    designer: 'Sabyasachi',
    color: '#8B1538',
    accessories: ['Full Bridal Jewelry Set', 'Kalire', 'Dupatta with Veil'],
    notes: 'Main wedding outfit - most important!',
    purchased: true,
    imageUrl: 'https://images.unsplash.com/photo-1549872063-e752dd3c88f2?w=400&h=400&fit=crop',
    budget: 250000,
    spent: 245000,
  },
  {
    id: 5,
    event: 'Wedding Ceremony',
    person: 'Groom',
    outfit: 'Ivory Sherwani with Gold Embroidery',
    designer: 'Manish Malhotra',
    color: '#FFFFF0',
    accessories: ['Turban', 'Kalgi', 'Sword', 'Sehra'],
    notes: 'Traditional royal look',
    purchased: true,
    imageUrl: 'https://images.unsplash.com/flagged/photo-1567793968404-5174ceab96b2?w=400&h=400&fit=crop',
    budget: 150000,
    spent: 145000,
  },
  {
    id: 6,
    event: 'Reception',
    person: 'Bride',
    outfit: 'Pastel Pink Gown',
    designer: 'Manish Malhotra',
    color: '#FFB6C1',
    accessories: ['Diamond Necklace', 'Earrings', 'Clutch'],
    notes: 'Modern and elegant',
    purchased: false,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    budget: 180000,
    spent: 0,
  },
];

export function OutfitPlanner() {
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTryOnDialog, setShowTryOnDialog] = useState(false);
  const [selectedOutfitForTryOn, setSelectedOutfitForTryOn] = useState<Outfit | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [filterPerson, setFilterPerson] = useState<'All' | 'Bride' | 'Groom'>('All');
  const [newOutfit, setNewOutfit] = useState<Partial<Outfit>>({
    event: '',
    person: 'Bride',
    outfit: '',
    color: '#FFD700',
    accessories: [],
    notes: '',
    purchased: false,
    budget: 0,
    spent: 0,
  });

  const events = ['Mehndi', 'Sangeet', 'Wedding Ceremony', 'Reception', 'Haldi', 'Engagement'];

  const filteredOutfits = filterPerson === 'All' 
    ? outfits 
    : outfits.filter(outfit => outfit.person === filterPerson);

  const totalBudget = outfits.reduce((sum, o) => sum + o.budget, 0);
  const totalSpent = outfits.reduce((sum, o) => sum + o.spent, 0);

  const handleAddOutfit = () => {
    if (newOutfit.event && newOutfit.outfit) {
      const outfit: Outfit = {
        id: Date.now(),
        event: newOutfit.event,
        person: newOutfit.person || 'Bride',
        outfit: newOutfit.outfit,
        designer: newOutfit.designer,
        color: newOutfit.color || '#FFD700',
        accessories: newOutfit.accessories || [],
        notes: newOutfit.notes || '',
        purchased: false,
        budget: newOutfit.budget || 0,
        spent: 0,
      };
      setOutfits([...outfits, outfit]);
      setShowAddDialog(false);
      setNewOutfit({
        event: '',
        person: 'Bride',
        outfit: '',
        color: '#FFD700',
        accessories: [],
        notes: '',
        purchased: false,
        budget: 0,
        spent: 0,
      });
      toast.success('Outfit added to planner!');
    }
  };

  const togglePurchased = (id: number) => {
    setOutfits(outfits.map(o => 
      o.id === id ? { ...o, purchased: !o.purchased } : o
    ));
  };

  const handleTryOn = (outfit: Outfit) => {
    setSelectedOutfitForTryOn(outfit);
    setShowTryOnDialog(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTryOn = () => {
    toast.success('Virtual try-on saved to your gallery!');
    setShowTryOnDialog(false);
  };

  const groupedByEvent = filteredOutfits.reduce((acc, outfit) => {
    if (!acc[outfit.event]) acc[outfit.event] = [];
    acc[outfit.event].push(outfit);
    return acc;
  }, {} as Record<string, Outfit[]>);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Outfit Planner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan and organize all your wedding outfits for every event
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Outfits</p>
                  <p className="text-2xl text-primary">{outfits.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchased</p>
                  <p className="text-2xl text-primary">{outfits.filter(o => o.purchased).length}/{outfits.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl text-primary">Rs.{(totalSpent/100000).toFixed(1)}L / Rs.{(totalBudget/100000).toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <div className="flex gap-2">
            {(['All', 'Bride', 'Groom'] as const).map((filter) => (
              <Button
                key={filter}
                variant={filterPerson === filter ? 'default' : 'outline'}
                onClick={() => setFilterPerson(filter)}
                className={filterPerson === filter ? 'gradient-maroon' : ''}
                size="sm"
              >
                {filter}
              </Button>
            ))}
          </div>
          <Button className="gradient-maroon" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Outfit
          </Button>
        </div>

        {/* Outfits by Event */}
        <div className="space-y-8">
          {Object.entries(groupedByEvent).map(([event, eventOutfits]) => (
            <div key={event}>
              <h2 className="mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {event}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventOutfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-64">
                      {outfit.imageUrl ? (
                        <ImageWithFallback
                          src={outfit.imageUrl}
                          alt={outfit.outfit}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-pink">
                          <Shirt className="w-16 h-16 text-primary opacity-50" />
                        </div>
                      )}
                      {outfit.purchased && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Purchased
                        </div>
                      )}
                      <div
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: outfit.color }}
                      />
                    </div>

                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{outfit.person}</span>
                        <Badge variant={outfit.person === 'Bride' ? 'default' : 'secondary'}>
                          {outfit.person}
                        </Badge>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="mb-1">{outfit.outfit}</h4>
                        {outfit.designer && (
                          <p className="text-sm text-muted-foreground">by {outfit.designer}</p>
                        )}
                      </div>

                      {outfit.accessories.length > 0 && (
                        <div>
                          <p className="text-sm mb-2">Accessories:</p>
                          <div className="flex flex-wrap gap-1">
                            {outfit.accessories.map((acc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {acc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {outfit.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          {outfit.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="text-primary">
                          {outfit.purchased ? `Rs.${outfit.spent.toLocaleString()}` : `Rs.${outfit.budget.toLocaleString()}`}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleTryOn(outfit)}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Try On
                      </Button>
                      <Button
                        variant={outfit.purchased ? 'outline' : 'default'}
                        className={!outfit.purchased ? 'gradient-pink text-primary flex-1' : 'flex-1'}
                        onClick={() => togglePurchased(outfit.id)}
                      >
                        {outfit.purchased ? <Check className="w-4 h-4 mr-2" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
                        {outfit.purchased ? 'Purchased' : 'Buy'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Virtual Try-On Dialog */}
        <Dialog open={showTryOnDialog} onOpenChange={setShowTryOnDialog}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Virtual Try-On - {selectedOutfitForTryOn?.outfit}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="upload" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Your Photo</TabsTrigger>
                <TabsTrigger value="preview">Try-On Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="h-[calc(100%-60px)] flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  {!uploadedPhoto ? (
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2">Upload Your Photo</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Upload a clear photo of yourself to see how the outfit will look
                      </p>
                      <label htmlFor="photo-upload">
                        <Button className="gradient-maroon" asChild>
                          <span>
                            <Camera className="w-4 h-4 mr-2" />
                            Choose Photo
                          </span>
                        </Button>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center">
                      <img
                        src={uploadedPhoto}
                        alt="Uploaded"
                        className="max-h-96 rounded-lg mb-4"
                      />
                      <div className="flex gap-2">
                        <label htmlFor="photo-upload-change">
                          <Button variant="outline" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Change Photo
                            </span>
                          </Button>
                        </label>
                        <input
                          id="photo-upload-change"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <Button 
                          className="gradient-maroon"
                          onClick={() => {
                            const tabs = document.querySelector('[value="preview"]') as HTMLElement;
                            tabs?.click();
                          }}
                        >
                          Continue to Try-On
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-[calc(100%-60px)]">
                {!uploadedPhoto ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2">No Photo Uploaded</h3>
                      <p className="text-sm text-muted-foreground">
                        Please upload your photo first to see the try-on preview
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 grid md:grid-cols-2 gap-6 mb-4">
                      {/* Original Photo */}
                      <div className="space-y-3">
                        <h4>Your Photo</h4>
                        <div className="relative h-full bg-secondary rounded-lg overflow-hidden">
                          <img
                            src={uploadedPhoto}
                            alt="Original"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Try-On Preview */}
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          AI Try-On Preview
                        </h4>
                        <div className="relative h-full bg-gradient-to-br from-secondary to-accent/20 rounded-lg overflow-hidden">
                          <img
                            src={uploadedPhoto}
                            alt="Try-On"
                            className="w-full h-full object-cover"
                            style={{
                              filter: 'brightness(1.1) contrast(1.05)',
                            }}
                          />
                          {/* Outfit Overlay Effect */}
                          <div 
                            className="absolute inset-0 mix-blend-multiply opacity-30"
                            style={{
                              background: `linear-gradient(135deg, ${selectedOutfitForTryOn?.color}40 0%, ${selectedOutfitForTryOn?.color}80 100%)`
                            }}
                          />
                          {/* Outfit Image Overlay */}
                          {selectedOutfitForTryOn?.imageUrl && (
                            <div className="absolute bottom-4 right-4 w-24 h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                              <ImageWithFallback
                                src={selectedOutfitForTryOn.imageUrl}
                                alt="Outfit"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                            <p className="text-xs">AI-Enhanced Preview</p>
                            <p className="text-sm">{selectedOutfitForTryOn?.outfit}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Outfit Details */}
                    <Card className="glassmorphism">
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Designer</p>
                            <p>{selectedOutfitForTryOn?.designer || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Color</p>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: selectedOutfitForTryOn?.color }}
                              />
                              <span>{selectedOutfitForTryOn?.color}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Event</p>
                            <p>{selectedOutfitForTryOn?.event}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" className="flex-1">
                        <Upload className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button className="flex-1 gradient-maroon" onClick={handleSaveTryOn}>
                        <Check className="w-4 h-4 mr-2" />
                        Save to Gallery
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Add Outfit Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Outfit</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <select
                  id="event"
                  className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                  value={newOutfit.event}
                  onChange={(e) => setNewOutfit({...newOutfit, event: e.target.value})}
                >
                  <option value="">Select event</option>
                  {events.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="person">For</Label>
                <select
                  id="person"
                  className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                  value={newOutfit.person}
                  onChange={(e) => setNewOutfit({...newOutfit, person: e.target.value as 'Bride' | 'Groom'})}
                >
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="outfit">Outfit Description</Label>
                <Input
                  id="outfit"
                  value={newOutfit.outfit}
                  onChange={(e) => setNewOutfit({...newOutfit, outfit: e.target.value})}
                  placeholder="e.g., Red Bridal Lehenga with Heavy Embroidery"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designer">Designer (Optional)</Label>
                <Input
                  id="designer"
                  value={newOutfit.designer}
                  onChange={(e) => setNewOutfit({...newOutfit, designer: e.target.value})}
                  placeholder="e.g., Sabyasachi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newOutfit.color}
                    onChange={(e) => setNewOutfit({...newOutfit, color: e.target.value})}
                    className="w-20 h-10"
                  />
                  <Input
                    value={newOutfit.color}
                    onChange={(e) => setNewOutfit({...newOutfit, color: e.target.value})}
                    placeholder="#FFD700"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="accessories">Accessories (comma separated)</Label>
                <Input
                  id="accessories"
                  value={newOutfit.accessories?.join(', ')}
                  onChange={(e) => setNewOutfit({...newOutfit, accessories: e.target.value.split(',').map(a => a.trim())})}
                  placeholder="e.g., Maang Tikka, Bangles, Jhumkas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Rs.)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newOutfit.budget}
                  onChange={(e) => setNewOutfit({...newOutfit, budget: Number(e.target.value)})}
                  placeholder="80000"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOutfit.notes}
                  onChange={(e) => setNewOutfit({...newOutfit, notes: e.target.value})}
                  placeholder="Any special notes or requirements"
                  rows={3}
                />
              </div>

              <Button className="w-full gradient-maroon md:col-span-2" onClick={handleAddOutfit}>
                <Plus className="w-4 h-4 mr-2" />
                Add Outfit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
