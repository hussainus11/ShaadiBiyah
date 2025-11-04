import { useState } from 'react';
import { Gift, Plus, Trash2, Check, Share2, Link2, IndianRupee, ShoppingBag, Heart, ExternalLink, Users, CreditCard, MessageSquare, Star, Download, Upload, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface GiftItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  purchased: number;
  category: string;
  imageUrl: string;
  storeUrl?: string;
  priority: 'High' | 'Medium' | 'Low';
  contributors?: GiftContributor[];
  isCashFund?: boolean;
  targetAmount?: number;
  currentAmount?: number;
}

interface GiftContributor {
  id: number;
  name: string;
  amount: number;
  message?: string;
  date: string;
  anonymous: boolean;
}

interface ThankYouNote {
  id: number;
  giftId: number;
  recipientName: string;
  message: string;
  sent: boolean;
  sentDate?: string;
}

const mockGiftItems: GiftItem[] = [
  {
    id: 1,
    name: 'Premium Dinner Set',
    description: '24-piece bone china dinner set',
    price: 15000,
    quantity: 1,
    purchased: 0,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-85e908ec2f38?w=400&h=300&fit=crop',
    storeUrl: 'https://example.com',
    priority: 'High',
    contributors: [],
  },
  {
    id: 2,
    name: 'Gold Plated Photo Frame',
    description: 'Decorative wedding photo frame',
    price: 3500,
    quantity: 2,
    purchased: 1,
    category: 'Decor',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
    priority: 'Medium',
    contributors: [
      { id: 1, name: 'Priya Sharma', amount: 3500, message: 'Congratulations!', date: '2025-01-15', anonymous: false }
    ],
  },
  {
    id: 3,
    name: 'Designer Bedsheet Set',
    description: 'Luxury king-size bedding set',
    price: 8000,
    quantity: 2,
    purchased: 2,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
    priority: 'High',
    contributors: [
      { id: 2, name: 'Amit Kumar', amount: 4000, message: 'Best wishes!', date: '2025-01-10', anonymous: false },
      { id: 3, name: 'Anonymous', amount: 4000, message: 'Happy married life!', date: '2025-01-12', anonymous: true }
    ],
  },
  {
    id: 4,
    name: 'Crystal Vase',
    description: 'Elegant crystal flower vase',
    price: 5000,
    quantity: 1,
    purchased: 0,
    category: 'Decor',
    imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    priority: 'Low',
    contributors: [],
  },
  {
    id: 5,
    name: 'Coffee Maker',
    description: 'Automatic espresso machine',
    price: 25000,
    quantity: 1,
    purchased: 0,
    category: 'Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
    priority: 'Medium',
    contributors: [],
  },
  {
    id: 6,
    name: 'Honeymoon Fund',
    description: 'Help us create beautiful memories on our honeymoon',
    price: 0,
    quantity: 1,
    purchased: 0,
    category: 'Cash Fund',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb4e6492d8?w=400&h=300&fit=crop',
    priority: 'High',
    isCashFund: true,
    targetAmount: 100000,
    currentAmount: 25000,
    contributors: [
      { id: 4, name: 'Rajesh Patel', amount: 10000, message: 'Have an amazing honeymoon!', date: '2025-01-08', anonymous: false },
      { id: 5, name: 'Sneha Verma', amount: 15000, message: 'Enjoy your trip!', date: '2025-01-14', anonymous: false }
    ],
  },
  {
    id: 7,
    name: 'Home Setup Fund',
    description: 'Help us set up our new home together',
    price: 0,
    quantity: 1,
    purchased: 0,
    category: 'Cash Fund',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    priority: 'High',
    isCashFund: true,
    targetAmount: 50000,
    currentAmount: 15000,
    contributors: [
      { id: 6, name: 'Vikram Singh', amount: 15000, message: 'Wishing you a happy home!', date: '2025-01-16', anonymous: false }
    ],
  },
];

export function GiftRegistry() {
  const [giftItems, setGiftItems] = useState<GiftItem[]>(mockGiftItems);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('registry');
  const [thankYouNotes, setThankYouNotes] = useState<ThankYouNote[]>([]);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [selectedGiftForThankYou, setSelectedGiftForThankYou] = useState<GiftItem | null>(null);
  const [newGift, setNewGift] = useState<Partial<GiftItem>>({
    name: '',
    description: '',
    price: 0,
    quantity: 1,
    purchased: 0,
    category: 'Home & Kitchen',
    priority: 'Medium',
    contributors: [],
  });

  const categories = ['All', 'Home & Kitchen', 'Decor', 'Appliances', 'Jewelry', 'Electronics', 'Cash Fund', 'Other'];

  const filteredItems = giftItems.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalValue = giftItems.reduce((sum, item) => {
    if (item.isCashFund) {
      return sum + (item.targetAmount || 0);
    }
    return sum + (item.price * item.quantity);
  }, 0);
  
  const purchasedValue = giftItems.reduce((sum, item) => {
    if (item.isCashFund) {
      return sum + (item.currentAmount || 0);
    }
    return sum + (item.price * item.purchased);
  }, 0);
  
  const progressPercent = Math.round((purchasedValue / totalValue) * 100);
  
  const totalContributors = giftItems.reduce((sum, item) => sum + (item.contributors?.length || 0), 0);
  const cashFunds = giftItems.filter(item => item.isCashFund);
  const physicalGifts = giftItems.filter(item => !item.isCashFund);

  const handleAddGift = () => {
    if (newGift.name && (newGift.price || newGift.isCashFund)) {
      const gift: GiftItem = {
        id: Date.now(),
        name: newGift.name,
        description: newGift.description || '',
        price: newGift.price || 0,
        quantity: newGift.quantity || 1,
        purchased: 0,
        category: newGift.category || 'Other',
        imageUrl: 'https://images.unsplash.com/photo-1647221598272-9aa015392c81?w=400&h=300&fit=crop',
        priority: newGift.priority || 'Medium',
        contributors: [],
        isCashFund: newGift.isCashFund || false,
        targetAmount: newGift.targetAmount,
        currentAmount: 0,
      };
      setGiftItems([...giftItems, gift]);
      setShowAddDialog(false);
      setNewGift({
        name: '',
        description: '',
        price: 0,
        quantity: 1,
        purchased: 0,
        category: 'Home & Kitchen',
        priority: 'Medium',
        contributors: [],
      });
      toast.success('Gift added to registry!');
    }
  };

  const handleSendThankYou = (gift: GiftItem, recipientName: string, message: string) => {
    const thankYouNote: ThankYouNote = {
      id: Date.now(),
      giftId: gift.id,
      recipientName,
      message,
      sent: true,
      sentDate: new Date().toISOString().split('T')[0],
    };
    setThankYouNotes([...thankYouNotes, thankYouNote]);
    setShowThankYouDialog(false);
    setSelectedGiftForThankYou(null);
    toast.success('Thank you note sent!');
  };

  const handleExportRegistry = () => {
    toast.success('Registry exported successfully!');
  };

  const handleShareRegistry = () => {
    toast.success('Registry link copied to clipboard!');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Enhanced Gift Registry</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your wishlist, manage cash funds, and track contributions with our advanced registry system
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl text-primary">{giftItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Registry Progress</p>
                  <p className="text-2xl text-primary">{progressPercent}%</p>
                  <Progress value={progressPercent} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contributors</p>
                  <p className="text-2xl text-primary">{totalContributors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cash Funds</p>
                  <p className="text-2xl text-primary">{cashFunds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registry">
              <Gift className="w-4 h-4 mr-2" />
              Registry
            </TabsTrigger>
            <TabsTrigger value="contributors">
              <Users className="w-4 h-4 mr-2" />
              Contributors
            </TabsTrigger>
            <TabsTrigger value="thank-you">
              <MessageSquare className="w-4 h-4 mr-2" />
              Thank You Notes
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Star className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Registry Tab */}
          <TabsContent value="registry">
            {/* Enhanced Actions */}
            <div className="space-y-4 mb-8">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? 'default' : 'outline'}
                    onClick={() => setFilterCategory(cat)}
                    className={`${filterCategory === cat ? 'gradient-maroon' : ''} whitespace-nowrap`}
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              
              {/* Search and Actions */}
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search gifts..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleExportRegistry}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" onClick={handleShareRegistry}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Registry
                  </Button>
                  <Button className="gradient-maroon" onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gift
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Gift Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const itemProgress = item.isCashFund 
                  ? ((item.currentAmount || 0) / (item.targetAmount || 1)) * 100
                  : (item.purchased / item.quantity) * 100;
                
                return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {(item.isCashFund ? (item.currentAmount || 0) >= (item.targetAmount || 0) : item.purchased >= item.quantity) && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            {item.isCashFund ? 'Funded' : 'Fulfilled'}
                          </div>
                        </div>
                      )}
                      <Badge className={`absolute top-4 left-4 ${
                        item.priority === 'High' ? 'bg-red-500' :
                        item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {item.priority} Priority
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-white text-foreground">
                        {item.category}
                      </Badge>
                      {item.isCashFund && (
                        <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          Cash Fund
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      
                      <div className="space-y-3">
                        {item.isCashFund ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Target</span>
                              <span className="text-primary">Rs.{(item.targetAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Raised</span>
                              <span className="text-green-600">Rs.{(item.currentAmount || 0).toLocaleString()}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <span className="text-primary">Rs.{item.price.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-muted-foreground">
                              {item.isCashFund ? 'Progress' : 'Purchased'}
                            </span>
                            <span>
                              {item.isCashFund 
                                ? `${Math.round(itemProgress)}%`
                                : `${item.purchased} / ${item.quantity}`
                              }
                            </span>
                          </div>
                          <Progress value={itemProgress} className="h-2" />
                        </div>

                        {item.contributors && item.contributors.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {item.contributors.length} contributor{item.contributors.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex gap-2">
                      {item.storeUrl && (
                        <Button variant="outline" className="flex-1" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      )}
                      <Button 
                        className="flex-1 gradient-pink text-primary" 
                        size="sm"
                        disabled={item.isCashFund ? (item.currentAmount || 0) >= (item.targetAmount || 0) : item.purchased >= item.quantity}
                        onClick={() => {
                          setSelectedGiftForThankYou(item);
                          setShowThankYouDialog(true);
                        }}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {item.isCashFund 
                          ? ((item.currentAmount || 0) >= (item.targetAmount || 0) ? 'Funded' : 'Contribute')
                          : (item.purchased >= item.quantity ? 'Fulfilled' : 'Gift This')
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>All Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {giftItems.map(item => 
                    item.contributors?.map(contributor => (
                      <div key={contributor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 gradient-pink rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {contributor.anonymous ? '?' : contributor.name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {contributor.anonymous ? 'Anonymous' : contributor.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{item.name}</p>
                            {contributor.message && (
                              <p className="text-sm text-muted-foreground italic">"{contributor.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rs.{contributor.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{contributor.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thank You Notes Tab */}
          <TabsContent value="thank-you">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Thank You Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {thankYouNotes.map(note => (
                    <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">To: {note.recipientName}</p>
                        <p className="text-sm text-muted-foreground">{note.message}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={note.sent ? 'bg-green-500' : 'bg-yellow-500'}>
                          {note.sent ? 'Sent' : 'Pending'}
                        </Badge>
                        {note.sentDate && (
                          <p className="text-sm text-muted-foreground mt-1">{note.sentDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {thankYouNotes.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="mb-2">No thank you notes yet</h3>
                      <p className="text-muted-foreground">Send thank you notes to your generous contributors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Gift Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.slice(1).map(category => {
                      const count = giftItems.filter(item => item.category === category).length;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span>{category}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {giftItems
                      .flatMap(item => item.contributors || [])
                      .reduce((acc, contributor) => {
                        const existing = acc.find(c => c.name === contributor.name);
                        if (existing) {
                          existing.total += contributor.amount;
                        } else {
                          acc.push({ name: contributor.name, total: contributor.amount });
                        }
                        return acc;
                      }, [] as { name: string; total: number }[])
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map((contributor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{contributor.name}</span>
                          <span className="font-medium">Rs.{contributor.total.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Add Gift Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Gift to Registry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="giftName">Gift Name</Label>
                <Input
                  id="giftName"
                  value={newGift.name}
                  onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                  placeholder="e.g., Premium Dinner Set or Honeymoon Fund"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGift.description}
                  onChange={(e) => setNewGift({...newGift, description: e.target.value})}
                  placeholder="Brief description of the gift or fund"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Gift Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer p-4 ${
                      !newGift.isCashFund ? 'border-2 border-accent' : ''
                    }`}
                    onClick={() => setNewGift({...newGift, isCashFund: false})}
                  >
                    <div className="text-center">
                      <Gift className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Physical Gift</p>
                    </div>
                  </Card>
                  <Card
                    className={`cursor-pointer p-4 ${
                      newGift.isCashFund ? 'border-2 border-accent' : ''
                    }`}
                    onClick={() => setNewGift({...newGift, isCashFund: true})}
                  >
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Cash Fund</p>
                    </div>
                  </Card>
                </div>
              </div>

              {newGift.isCashFund ? (
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (Rs.)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGift.targetAmount}
                    onChange={(e) => setNewGift({...newGift, targetAmount: Number(e.target.value)})}
                    placeholder="100000"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rs.)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newGift.price}
                      onChange={(e) => setNewGift({...newGift, price: Number(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newGift.quantity}
                      onChange={(e) => setNewGift({...newGift, quantity: Number(e.target.value)})}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                    value={newGift.category}
                    onChange={(e) => setNewGift({...newGift, category: e.target.value})}
                  >
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Decor">Decor</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cash Fund">Cash Fund</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                    value={newGift.priority}
                    onChange={(e) => setNewGift({...newGift, priority: e.target.value as 'High' | 'Medium' | 'Low'})}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <Button className="w-full gradient-maroon" onClick={handleAddGift}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Registry
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Thank You Note Dialog */}
        <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Thank You Note</DialogTitle>
            </DialogHeader>
            {selectedGiftForThankYou && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-secondary/20">
                  <h4 className="font-medium">{selectedGiftForThankYou.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedGiftForThankYou.description}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Enter recipient name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thankYouMessage">Thank You Message</Label>
                  <Textarea
                    id="thankYouMessage"
                    rows={4}
                    placeholder="Write your thank you message..."
                  />
                </div>
                
                <Button 
                  className="w-full gradient-maroon" 
                  onClick={() => {
                    const recipientName = (document.getElementById('recipientName') as HTMLInputElement)?.value;
                    const message = (document.getElementById('thankYouMessage') as HTMLTextAreaElement)?.value;
                    if (recipientName && message) {
                      handleSendThankYou(selectedGiftForThankYou, recipientName, message);
                    }
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Thank You Note
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
