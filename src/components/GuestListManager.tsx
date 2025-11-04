import { useState } from 'react';
import { Users, Plus, Trash2, Mail, Phone, CheckCircle, XCircle, Clock, Search, Filter, Download, Upload, UserCheck, UserX, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

interface Guest {
  id: number;
  name: string;
  side: 'Bride' | 'Groom';
  category: 'Family' | 'Friends' | 'Colleagues' | 'Relatives';
  rsvp: 'Pending' | 'Confirmed' | 'Declined';
  plusOne: boolean;
  plusOneName?: string;
  email?: string;
  phone?: string;
  dietaryRestrictions?: string[];
  specialRequests?: string;
  tablePreference?: string;
  isVip?: boolean;
  invitationSent?: boolean;
  invitationDate?: string;
  notes?: string;
}

const defaultGuests: Guest[] = [
  { 
    id: 1, 
    name: 'Amit Kumar', 
    side: 'Groom', 
    category: 'Family', 
    rsvp: 'Confirmed', 
    plusOne: true, 
    plusOneName: 'Priya Kumar',
    email: 'amit@email.com', 
    phone: '+91 98765 43210',
    dietaryRestrictions: ['Vegetarian'],
    isVip: true,
    invitationSent: true,
    invitationDate: '2024-01-15',
    notes: 'Prefers corner table'
  },
  { 
    id: 2, 
    name: 'Priya Sharma', 
    side: 'Bride', 
    category: 'Friends', 
    rsvp: 'Confirmed', 
    plusOne: false, 
    email: 'priya@email.com', 
    phone: '+91 98765 43211',
    dietaryRestrictions: ['Vegan'],
    invitationSent: true,
    invitationDate: '2024-01-15'
  },
  { 
    id: 3, 
    name: 'Rajesh Patel', 
    side: 'Groom', 
    category: 'Colleagues', 
    rsvp: 'Pending', 
    plusOne: true, 
    plusOneName: 'Sunita Patel',
    email: 'rajesh@email.com', 
    phone: '+91 98765 43212',
    invitationSent: false
  },
  { 
    id: 4, 
    name: 'Sunita Singh', 
    side: 'Bride', 
    category: 'Relatives', 
    rsvp: 'Declined', 
    plusOne: false, 
    email: 'sunita@email.com', 
    phone: '+91 98765 43213',
    invitationSent: true,
    invitationDate: '2024-01-15',
    notes: 'Cannot attend due to health issues'
  },
];

export function GuestListManager() {
  const [guests, setGuests] = useState<Guest[]>(defaultGuests);
  const [showAddGuestDialog, setShowAddGuestDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSide, setFilterSide] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRsvp, setFilterRsvp] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  
  const [newGuest, setNewGuest] = useState({
    name: '',
    side: 'Bride' as const,
    category: 'Family' as const,
    plusOne: false,
    plusOneName: '',
    email: '',
    phone: '',
    dietaryRestrictions: [] as string[],
    specialRequests: '',
    isVip: false,
    notes: ''
  });

  const addGuest = () => {
    if (newGuest.name.trim()) {
      const guest: Guest = {
        id: Date.now(),
        ...newGuest,
        rsvp: 'Pending',
        invitationSent: false
      };
      setGuests([...guests, guest]);
      setNewGuest({
        name: '',
        side: 'Bride',
        category: 'Family',
        plusOne: false,
        plusOneName: '',
        email: '',
        phone: '',
        dietaryRestrictions: [],
        specialRequests: '',
        isVip: false,
        notes: ''
      });
      setShowAddGuestDialog(false);
    }
  };

  const updateGuestRsvp = (id: number, rsvp: Guest['rsvp']) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, rsvp } : guest
    ));
  };

  const deleteGuest = (id: number) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const toggleGuestSelection = (id: number) => {
    setSelectedGuests(prev => 
      prev.includes(id) 
        ? prev.filter(guestId => guestId !== id)
        : [...prev, id]
    );
  };

  const selectAllGuests = () => {
    setSelectedGuests(filteredGuests.map(guest => guest.id));
  };

  const deselectAllGuests = () => {
    setSelectedGuests([]);
  };

  const sendInvitations = () => {
    setGuests(guests.map(guest => 
      selectedGuests.includes(guest.id) 
        ? { ...guest, invitationSent: true, invitationDate: new Date().toISOString().split('T')[0] }
        : guest
    ));
    setSelectedGuests([]);
    setShowInviteDialog(false);
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.phone?.includes(searchQuery);
    const matchesSide = filterSide === 'all' || guest.side === filterSide;
    const matchesCategory = filterCategory === 'all' || guest.category === filterCategory;
    const matchesRsvp = filterRsvp === 'all' || guest.rsvp === filterRsvp;
    
    return matchesSearch && matchesSide && matchesCategory && matchesRsvp;
  });

  const confirmedGuests = guests.filter(g => g.rsvp === 'Confirmed').length;
  const pendingGuests = guests.filter(g => g.rsvp === 'Pending').length;
  const declinedGuests = guests.filter(g => g.rsvp === 'Declined').length;
  const totalGuests = guests.length;
  const totalWithPlusOnes = guests.reduce((sum, guest) => sum + (guest.plusOne ? 2 : 1), 0);
  const invitationSentCount = guests.filter(g => g.invitationSent).length;

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Nut Allergy', 'Dairy-Free', 'Diabetic'
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Guest List Manager</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your wedding guest list, track RSVPs, and organize invitations with our comprehensive guest management tool
          </p>
        </div>

        {/* Guest Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Guests</p>
                  <p className="text-2xl text-primary">{totalGuests}</p>
                  <p className="text-xs text-muted-foreground">+{totalWithPlusOnes - totalGuests} plus ones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
                  <p className="text-2xl text-primary">{confirmedGuests}</p>
                  <Progress value={(confirmedGuests/totalGuests)*100} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl text-primary">{pendingGuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Declined</p>
                  <p className="text-2xl text-primary">{declinedGuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-green rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Invitations Sent</p>
                  <p className="text-2xl text-primary">{invitationSentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full justify-start">
            <TabsTrigger value="list" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Guest List
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              RSVP Tracking
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="dietary" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Dietary Needs
            </TabsTrigger>
          </TabsList>

          {/* Guest List Tab */}
          <TabsContent value="list">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guest List ({filteredGuests.length} guests)</span>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowAddGuestDialog(true)} className="gradient-maroon">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Guest
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowInviteDialog(true)}
                      disabled={selectedGuests.length === 0}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitations ({selectedGuests.length})
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 grid md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterSide} onValueChange={setFilterSide}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sides</SelectItem>
                      <SelectItem value="Bride">Bride</SelectItem>
                      <SelectItem value="Groom">Groom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Friends">Friends</SelectItem>
                      <SelectItem value="Colleagues">Colleagues</SelectItem>
                      <SelectItem value="Relatives">Relatives</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRsvp} onValueChange={setFilterRsvp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by RSVP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All RSVP</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedGuests.length > 0 && (
                  <div className="mb-4 p-3 bg-accent/10 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedGuests.length} guests selected</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={deselectAllGuests}>
                        Deselect All
                      </Button>
                      <Button variant="outline" size="sm" onClick={selectAllGuests}>
                        Select All
                      </Button>
                    </div>
                  </div>
                )}

                {/* Guest List */}
                <div className="space-y-3">
                  {filteredGuests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedGuests.includes(guest.id)}
                          onCheckedChange={() => toggleGuestSelection(guest.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{guest.name}</p>
                            {guest.isVip && <Badge className="bg-yellow-500">VIP</Badge>}
                            {guest.plusOne && (
                              <Badge variant="outline">+1: {guest.plusOneName}</Badge>
                            )}
                          </div>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{guest.side}</Badge>
                            <Badge variant="outline">{guest.category}</Badge>
                            {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                              <Badge variant="outline">{guest.dietaryRestrictions.join(', ')}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          guest.rsvp === 'Confirmed' ? 'bg-green-500' :
                          guest.rsvp === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {guest.rsvp}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateGuestRsvp(guest.id, 'Confirmed')}
                            disabled={guest.rsvp === 'Confirmed'}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateGuestRsvp(guest.id, 'Declined')}
                            disabled={guest.rsvp === 'Declined'}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGuest(guest.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RSVP Tracking Tab */}
          <TabsContent value="rsvp">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Confirmed Guests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guests.filter(g => g.rsvp === 'Confirmed').map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-muted-foreground">{guest.category}</p>
                        </div>
                        <Badge className="bg-green-500">Confirmed</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Pending RSVP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guests.filter(g => g.rsvp === 'Pending').map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-muted-foreground">{guest.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuestRsvp(guest.id, 'Confirmed')}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateGuestRsvp(guest.id, 'Declined')}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Declined
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guests.filter(g => g.rsvp === 'Declined').map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-muted-foreground">{guest.category}</p>
                          {guest.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{guest.notes}</p>
                          )}
                        </div>
                        <Badge className="bg-red-500">Declined</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Invitation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{guest.name}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                          <span>{guest.email}</span>
                          <span>{guest.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={guest.invitationSent ? 'default' : 'outline'}>
                          {guest.invitationSent ? 'Sent' : 'Not Sent'}
                        </Badge>
                        {guest.invitationDate && (
                          <span className="text-sm text-muted-foreground">{guest.invitationDate}</span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={guest.invitationSent}
                          onClick={() => {
                            setGuests(guests.map(g => 
                              g.id === guest.id 
                                ? { ...g, invitationSent: true, invitationDate: new Date().toISOString().split('T')[0] }
                                : g
                            ));
                          }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {guest.invitationSent ? 'Sent' : 'Send'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dietary Needs Tab */}
          <TabsContent value="dietary">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Dietary Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dietaryRestrictions.map((restriction) => {
                    const guestsWithRestriction = guests.filter(g => 
                      g.dietaryRestrictions?.includes(restriction)
                    );
                    return (
                      <Card key={restriction} className="hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{restriction}</h4>
                            <Badge variant="outline">{guestsWithRestriction.length}</Badge>
                          </div>
                          <div className="space-y-1">
                            {guestsWithRestriction.map((guest) => (
                              <p key={guest.id} className="text-sm text-muted-foreground">
                                {guest.name}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Guest Dialog */}
        <Dialog open={showAddGuestDialog} onOpenChange={setShowAddGuestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Guest Name</Label>
                <Input
                  id="name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  placeholder="Enter guest name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="side">Side</Label>
                  <Select value={newGuest.side} onValueChange={(value: 'Bride' | 'Groom') => setNewGuest({ ...newGuest, side: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bride">Bride</SelectItem>
                      <SelectItem value="Groom">Groom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGuest.category} onValueChange={(value: 'Family' | 'Friends' | 'Colleagues' | 'Relatives') => setNewGuest({ ...newGuest, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Friends">Friends</SelectItem>
                      <SelectItem value="Colleagues">Colleagues</SelectItem>
                      <SelectItem value="Relatives">Relatives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    placeholder="guest@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plusOne"
                  checked={newGuest.plusOne}
                  onCheckedChange={(checked) => setNewGuest({ ...newGuest, plusOne: checked as boolean })}
                />
                <Label htmlFor="plusOne">Plus One</Label>
              </div>
              {newGuest.plusOne && (
                <div>
                  <Label htmlFor="plusOneName">Plus One Name</Label>
                  <Input
                    id="plusOneName"
                    value={newGuest.plusOneName}
                    onChange={(e) => setNewGuest({ ...newGuest, plusOneName: e.target.value })}
                    placeholder="Enter plus one name"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVip"
                  checked={newGuest.isVip}
                  onCheckedChange={(checked) => setNewGuest({ ...newGuest, isVip: checked as boolean })}
                />
                <Label htmlFor="isVip">VIP Guest</Label>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newGuest.notes}
                  onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                  placeholder="Any special notes about this guest"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddGuestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addGuest}>
                  Add Guest
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send Invitations Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Invitations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are about to send invitations to {selectedGuests.length} guests. This action will mark their invitations as sent.
              </p>
              <div className="space-y-2">
                {selectedGuests.map(guestId => {
                  const guest = guests.find(g => g.id === guestId);
                  return guest ? (
                    <div key={guestId} className="flex items-center justify-between p-2 border rounded">
                      <span>{guest.name}</span>
                      <span className="text-sm text-muted-foreground">{guest.email}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={sendInvitations}>
                  Send Invitations
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}





