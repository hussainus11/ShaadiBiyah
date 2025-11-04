import { useState } from 'react';
import { Plus, Trash2, Users, Download, Save, Grid, Circle, Utensils, Heart, AlertTriangle, CheckCircle, RotateCcw, Maximize, Minimize, Search, Filter, Star, UserCheck, UserX, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';

interface Guest {
  id: number;
  name: string;
  category: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
  relationship?: string;
  plusOne?: boolean;
  plusOneName?: string;
  rsvpStatus?: 'Confirmed' | 'Pending' | 'Declined';
  specialRequests?: string;
  isVip?: boolean;
  tablePreference?: string;
  avoidSeating?: number[];
  mustSeatWith?: number[];
  phone?: string;
  email?: string;
  notes?: string;
}

interface Table {
  id: number;
  name: string;
  capacity: number;
  guests: Guest[];
  x: number;
  y: number;
  shape: 'round' | 'rectangle';
  isVip?: boolean;
  category?: string;
  notes?: string;
  isReserved?: boolean;
  reservedFor?: string;
}

interface DietaryRestriction {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const dietaryRestrictions: DietaryRestriction[] = [
  { id: 1, name: 'Vegetarian', description: 'No meat or fish', icon: '🥬', color: 'bg-green-500' },
  { id: 2, name: 'Vegan', description: 'No animal products', icon: '🌱', color: 'bg-green-600' },
  { id: 3, name: 'Gluten-Free', description: 'No gluten', icon: '🌾', color: 'bg-yellow-500' },
  { id: 4, name: 'Halal', description: 'Halal dietary requirements', icon: '🕌', color: 'bg-blue-500' },
  { id: 5, name: 'Kosher', description: 'Kosher dietary requirements', icon: '✡️', color: 'bg-purple-500' },
  { id: 6, name: 'Nut Allergy', description: 'Severe nut allergy', icon: '🥜', color: 'bg-red-500' },
  { id: 7, name: 'Dairy-Free', description: 'No dairy products', icon: '🥛', color: 'bg-orange-500' },
];

export function SeatingChart() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, name: 'Table 1', capacity: 8, guests: [], x: 100, y: 100, shape: 'round', category: 'Standard' },
    { id: 2, name: 'Table 2', capacity: 10, guests: [], x: 300, y: 100, shape: 'round', category: 'Standard' },
    { id: 3, name: 'Table 3', capacity: 8, guests: [], x: 500, y: 100, shape: 'round', category: 'Standard' },
    { id: 4, name: 'Head Table', capacity: 12, guests: [], x: 300, y: 300, shape: 'rectangle', isVip: true, category: 'VIP' },
    { id: 5, name: 'Family Table', capacity: 10, guests: [], x: 100, y: 300, shape: 'round', category: 'Family' },
    { id: 6, name: 'Friends Table', capacity: 8, guests: [], x: 500, y: 300, shape: 'round', category: 'Friends' },
  ]);

  const [guests, setGuests] = useState<Guest[]>([
    { 
      id: 1, 
      name: 'Amit Kumar', 
      category: 'Family', 
      dietaryRestrictions: ['Vegetarian'],
      allergies: ['Nuts'],
      relationship: 'Brother',
      rsvpStatus: 'Confirmed',
      isVip: true,
      phone: '+91 98765 43210',
      email: 'amit@example.com',
      notes: 'Prefers corner seat'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      category: 'Friends',
      dietaryRestrictions: ['Vegan'],
      relationship: 'Best Friend',
      rsvpStatus: 'Confirmed',
      plusOne: true,
      plusOneName: 'Rahul Sharma',
      phone: '+91 98765 43211',
      email: 'priya@example.com'
    },
    { 
      id: 3, 
      name: 'Rajesh Patel', 
      category: 'Colleagues',
      dietaryRestrictions: ['Gluten-Free'],
      relationship: 'Colleague',
      rsvpStatus: 'Pending',
      phone: '+91 98765 43212',
      email: 'rajesh@example.com'
    },
    { 
      id: 4, 
      name: 'Sneha Verma', 
      category: 'Family',
      dietaryRestrictions: ['Halal'],
      relationship: 'Cousin',
      rsvpStatus: 'Confirmed',
      isVip: false,
      phone: '+91 98765 43213',
      email: 'sneha@example.com'
    },
    { 
      id: 5, 
      name: 'Vikram Singh', 
      category: 'Friends',
      dietaryRestrictions: [],
      relationship: 'College Friend',
      rsvpStatus: 'Confirmed',
      plusOne: true,
      plusOneName: 'Anita Singh',
      phone: '+91 98765 43214',
      email: 'vikram@example.com'
    },
    { 
      id: 6, 
      name: 'Dr. Meera Joshi', 
      category: 'Family',
      dietaryRestrictions: ['Vegetarian'],
      relationship: 'Aunt',
      rsvpStatus: 'Confirmed',
      isVip: true,
      phone: '+91 98765 43215',
      email: 'meera@example.com',
      notes: 'Wheelchair accessible seat needed'
    },
  ]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState('Family');
  const [showAddTableDialog, setShowAddTableDialog] = useState(false);
  const [newTableData, setNewTableData] = useState({ name: '', capacity: 8, shape: 'round' as const });
  const [newTable, setNewTable] = useState({ number: '', capacity: 8, category: 'family', notes: '' });
  const [activeTab, setActiveTab] = useState('layout');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDietaryReport, setShowDietaryReport] = useState(false);

  const unassignedGuests = guests.filter(
    guest => !tables.some(table => table.guests.some(g => g.id === guest.id))
  );

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = searchQuery === '' || 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.relationship?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || guest.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const confirmedGuests = guests.filter(g => g.rsvpStatus === 'Confirmed');
  const pendingGuests = guests.filter(g => g.rsvpStatus === 'Pending');
  const declinedGuests = guests.filter(g => g.rsvpStatus === 'Declined');
  const vipGuests = guests.filter(g => g.isVip);
  const guestsWithDietaryRestrictions = guests.filter(g => g.dietaryRestrictions && g.dietaryRestrictions.length > 0);

  const addGuestToTable = (tableId: number, guest: Guest) => {
    setTables(tables.map(table => {
      if (table.id === tableId && table.guests.length < table.capacity) {
        return { ...table, guests: [...table.guests, guest] };
      }
      return table;
    }));
  };

  const removeGuestFromTable = (tableId: number, guestId: number) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return { ...table, guests: table.guests.filter(g => g.id !== guestId) };
      }
      return table;
    }));
  };

  const addNewGuest = () => {
    if (newGuestName.trim()) {
      const newGuest: Guest = {
        id: Date.now(),
        name: newGuestName,
        category: newGuestCategory,
        rsvpStatus: 'Pending',
        dietaryRestrictions: [],
        allergies: [],
        relationship: '',
        isVip: false,
        plusOne: false,
      };
      setGuests([...guests, newGuest]);
      setNewGuestName('');
    }
  };

  const handleGuestClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestDetails(true);
  };

  const updateGuestDetails = (updatedGuest: Guest) => {
    setGuests(guests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
    setShowGuestDetails(false);
    setSelectedGuest(null);
  };

  const optimizeSeating = () => {
    // Simple optimization: try to seat VIPs at VIP tables, group families together
    const vipTables = tables.filter(t => t.isVip);
    const familyTables = tables.filter(t => t.category === 'Family');
    
    // Clear all current seating
    setTables(tables.map(t => ({ ...t, guests: [] })));
    
    // Seat VIPs at VIP tables
    vipGuests.forEach(guest => {
      const vipTable = vipTables.find(t => t.guests.length < t.capacity);
      if (vipTable) {
        addGuestToTable(vipTable.id, guest);
      }
    });
    
    // Seat family members together
    const familyGuests = guests.filter(g => g.category === 'Family' && !g.isVip);
    familyGuests.forEach(guest => {
      const familyTable = familyTables.find(t => t.guests.length < t.capacity);
      if (familyTable) {
        addGuestToTable(familyTable.id, guest);
      }
    });
    
    setShowOptimizationDialog(false);
  };

  const generateDietaryReport = () => {
    const report = {
      totalGuests: guests.length,
      dietaryRestrictions: guestsWithDietaryRestrictions.length,
      restrictions: dietaryRestrictions.map(restriction => ({
        ...restriction,
        count: guests.filter(g => g.dietaryRestrictions?.includes(restriction.name)).length
      }))
    };
    console.log('Dietary Report:', report);
    setShowDietaryReport(true);
  };

  const handleAddTable = () => {
    if (newTable.number.trim()) {
      const tableId = Math.max(...tables.map(t => t.id)) + 1;
      const newTableObj = {
        id: tableId,
        name: `Table ${newTable.number}`,
        capacity: newTable.capacity,
        guests: [],
        x: 100 + (tables.length * 200),
        y: 100,
        shape: 'round' as const,
        category: newTable.category,
        notes: newTable.notes
      };
      setTables([...tables, newTableObj]);
      setNewTable({ number: '', capacity: 8, category: 'family', notes: '' });
      setShowAddTableDialog(false);
    }
  };

  const addNewTable = () => {
    if (newTableData.name.trim()) {
      const newTable = {
        id: Date.now(),
        name: newTableData.name,
        capacity: newTableData.capacity,
        guests: [],
        x: 100 + (tables.length * 50),
        y: 100,
        shape: newTableData.shape,
      };
      setTables([...tables, newTable]);
      setNewTableData({ name: '', capacity: 8, shape: 'round' });
      setShowAddTableDialog(false);
    }
  };

  const deleteTable = (tableId: number) => {
    setTables(tables.filter(t => t.id !== tableId));
    setSelectedTable(null);
  };

  const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
  const assignedSeats = tables.reduce((sum, table) => sum + table.guests.length, 0);

  return (
    <div className={`min-h-screen py-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Advanced Seating Chart Builder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Design your perfect seating arrangement with dietary preferences, VIP management, and AI optimization
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Guests</p>
              <p className="text-2xl text-primary">{guests.length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
              <p className="text-2xl text-primary">{confirmedGuests.length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">VIP Guests</p>
              <p className="text-2xl text-primary">{vipGuests.length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Dietary Needs</p>
              <p className="text-2xl text-primary">{guestsWithDietaryRestrictions.length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Grid className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Tables</p>
              <p className="text-2xl text-primary">{tables.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full justify-start">
            <TabsTrigger value="layout" className="flex-1">
              <Grid className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="dietary" className="flex-1">
              <Utensils className="w-4 h-4 mr-2" />
              Dietary
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Layout Tab */}
          <TabsContent value="layout">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <Button onClick={() => setShowOptimizationDialog(true)} className="gradient-maroon">
                  <Star className="w-4 h-4 mr-2" />
                  Optimize Seating
                </Button>
                <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddTableDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Panel - Enhanced Guest List */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Guest List</span>
                      <Badge variant="secondary">{guests.length} guests</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enhanced Add Guest Form */}
                    <div className="space-y-3 p-4 border rounded-lg bg-secondary/20">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Add New Guest</Label>
                        <Input
                          id="guestName"
                          value={newGuestName}
                          onChange={(e) => setNewGuestName(e.target.value)}
                          placeholder="Guest name"
                          onKeyPress={(e) => e.key === 'Enter' && addNewGuest()}
                        />
                      </div>
                      <Select value={newGuestCategory} onValueChange={setNewGuestCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friends">Friends</SelectItem>
                          <SelectItem value="Colleagues">Colleagues</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full" onClick={addNewGuest}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Guest
                      </Button>
                    </div>

                    {/* Enhanced Unassigned Guests */}
                    <div>
                      <h4 className="mb-3">Unassigned Guests ({unassignedGuests.length})</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {unassignedGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className="p-3 border rounded-lg hover:bg-secondary/50 cursor-move transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('guestId', guest.id.toString());
                            }}
                            onClick={() => handleGuestClick(guest)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{guest.name}</p>
                                  {guest.isVip && <Star className="w-4 h-4 text-yellow-500" />}
                                  {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                                    <Utensils className="w-4 h-4 text-orange-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{guest.category}</Badge>
                                  <Badge 
                                    className={`text-xs ${
                                      guest.rsvpStatus === 'Confirmed' ? 'bg-green-500' :
                                      guest.rsvpStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  >
                                    {guest.rsvpStatus}
                                  </Badge>
                                </div>
                                {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {guest.dietaryRestrictions.slice(0, 2).map((restriction, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {restriction}
                                      </Badge>
                                    ))}
                                    {guest.dietaryRestrictions.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{guest.dietaryRestrictions.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Users className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                        {unassignedGuests.length === 0 && (
                          <p className="text-sm text-center text-muted-foreground py-4">
                            All guests assigned!
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button className="flex-1 gradient-maroon">
                    <Save className="w-4 h-4 mr-2" />
                    Save Layout
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Right Panel - Enhanced Seating Chart */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Seating Layout</span>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowAddTableDialog(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Table
                        </Button>
                        <Button variant="outline" onClick={optimizeSeating}>
                          <Star className="w-4 h-4 mr-2" />
                          Auto-Optimize
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Enhanced Visual Seating Chart */}
                    <div className="border-2 border-dashed rounded-lg p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 min-h-[500px] relative overflow-auto">
                      <div className="absolute top-4 left-4 right-4 h-20 bg-accent/20 rounded-lg flex items-center justify-center border-2 border-accent/40">
                        <p className="text-sm">Stage / Main Entrance</p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mt-28">
                        {tables.map((table) => (
                          <div
                            key={table.id}
                            className={`relative cursor-pointer transition-all ${
                              selectedTable?.id === table.id ? 'scale-105' : ''
                            }`}
                            onClick={() => setSelectedTable(table)}
                            onDrop={(e) => {
                              e.preventDefault();
                              const guestId = parseInt(e.dataTransfer.getData('guestId'));
                              const guest = guests.find(g => g.id === guestId);
                              if (guest) addGuestToTable(table.id, guest);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <Card className={`${
                              selectedTable?.id === table.id ? 'border-2 border-accent shadow-lg' : ''
                            } ${table.shape === 'round' ? '' : 'aspect-[2/1]'} ${
                              table.isVip ? 'border-yellow-500' : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm">{table.name}</h4>
                                    {table.isVip && <Star className="w-4 h-4 text-yellow-500" />}
                                    {table.category && (
                                      <Badge variant="outline" className="text-xs">
                                        {table.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {table.guests.length}/{table.capacity}
                                  </Badge>
                                </div>
                                <div className={`${
                                  table.shape === 'round' 
                                    ? 'w-20 h-20 rounded-full mx-auto' 
                                    : 'w-full h-16 rounded-lg'
                                } bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3`}>
                                  {table.shape === 'round' ? (
                                    <Circle className="w-8 h-8 text-primary" />
                                  ) : (
                                    <Grid className="w-8 h-8 text-primary" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  {table.guests.map((guest) => (
                                    <div key={guest.id} className="flex items-center justify-between text-xs bg-secondary/50 rounded p-1">
                                      <div className="flex items-center gap-1 flex-1">
                                        <span className="truncate">{guest.name}</span>
                                        {guest.isVip && <Star className="w-3 h-3 text-yellow-500" />}
                                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                                          <Utensils className="w-3 h-3 text-orange-500" />
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeGuestFromTable(table.id, guest.id);
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Selected Table Details */}
                    {selectedTable && (
                      <Card className="mt-4 gradient-pink border-accent/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{selectedTable.name}</h4>
                                {selectedTable.isVip && <Star className="w-4 h-4 text-yellow-500" />}
                                {selectedTable.category && (
                                  <Badge variant="outline">{selectedTable.category}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {selectedTable.guests.length} of {selectedTable.capacity} seats filled
                              </p>
                              {selectedTable.guests.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground mb-1">Dietary Requirements:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {Array.from(new Set(selectedTable.guests.flatMap(g => g.dietaryRestrictions || [])))
                                      .map((restriction, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {restriction}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTable(selectedTable.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Table
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <div className="space-y-6">
              {/* Enhanced Guest Management */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guests..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="Colleagues">Colleagues</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Guest Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuests.map((guest) => (
                  <Card key={guest.id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => handleGuestClick(guest)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{guest.name}</h4>
                          {guest.isVip && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <Badge 
                          className={
                            guest.rsvpStatus === 'Confirmed' ? 'bg-green-500' :
                            guest.rsvpStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }
                        >
                          {guest.rsvpStatus}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{guest.category}</Badge>
                          {guest.relationship && (
                            <span className="text-xs text-muted-foreground">{guest.relationship}</span>
                          )}
                        </div>
                        
                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {guest.dietaryRestrictions.map((restriction, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {restriction}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {guest.plusOne && (
                          <div className="text-xs text-muted-foreground">
                            +1: {guest.plusOneName}
                          </div>
                        )}
                        
                        {guest.notes && (
                          <div className="text-xs text-muted-foreground italic">
                            {guest.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Dietary Tab */}
          <TabsContent value="dietary">
            <div className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Dietary Requirements</span>
                    <Button onClick={generateDietaryReport} className="gradient-maroon">
                      <Filter className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dietaryRestrictions.map((restriction) => {
                      const count = guests.filter(g => g.dietaryRestrictions?.includes(restriction.name)).length;
                      return (
                        <Card key={restriction.id} className="hover:shadow-lg transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{restriction.icon}</span>
                              <div>
                                <h4 className="font-medium">{restriction.name}</h4>
                                <p className="text-xs text-muted-foreground">{restriction.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Guests</span>
                              <Badge className={restriction.color}>{count}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>RSVP Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Confirmed</span>
                      <Badge className="bg-green-500">{confirmedGuests.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <Badge className="bg-yellow-500">{pendingGuests.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Declined</span>
                      <Badge className="bg-red-500">{declinedGuests.length}</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-2">RSVP Progress</div>
                      <Progress value={(confirmedGuests.length / guests.length) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Seating Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Seats</span>
                      <span className="font-medium">{totalSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned</span>
                      <span className="font-medium">{assignedSeats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available</span>
                      <span className="font-medium">{totalSeats - assignedSeats}</span>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-2">Seating Progress</div>
                      <Progress value={(assignedSeats / totalSeats) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Add Table Dialog */}
        <Dialog open={showAddTableDialog} onOpenChange={setShowAddTableDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tableName">Table Name</Label>
                <Input
                  id="tableName"
                  value={newTableData.name}
                  onChange={(e) => setNewTableData({ ...newTableData, name: e.target.value })}
                  placeholder="e.g., Table 5 or VIP Table"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableCapacity">Capacity</Label>
                <Input
                  id="tableCapacity"
                  type="number"
                  min="2"
                  max="20"
                  value={newTableData.capacity}
                  onChange={(e) => setNewTableData({ ...newTableData, capacity: parseInt(e.target.value) || 8 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Table Shape</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer ${newTableData.shape === 'round' ? 'border-2 border-accent' : ''}`}
                    onClick={() => setNewTableData({ ...newTableData, shape: 'round' })}
                  >
                    <CardContent className="p-6 text-center">
                      <Circle className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Round</p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer ${newTableData.shape === 'rectangle' ? 'border-2 border-accent' : ''}`}
                    onClick={() => setNewTableData({ ...newTableData, shape: 'rectangle' })}
                  >
                    <CardContent className="p-6 text-center">
                      <Grid className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Rectangle</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Button className="w-full gradient-maroon" onClick={addNewTable}>
                Add Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Guest Details Dialog */}
        <Dialog open={showGuestDetails} onOpenChange={setShowGuestDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Guest Details</DialogTitle>
            </DialogHeader>
            {selectedGuest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Name</Label>
                    <Input
                      id="guestName"
                      value={selectedGuest.name}
                      onChange={(e) => setSelectedGuest({...selectedGuest, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestCategory">Category</Label>
                    <Select value={selectedGuest.category} onValueChange={(value) => setSelectedGuest({...selectedGuest, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Friends">Friends</SelectItem>
                        <SelectItem value="Colleagues">Colleagues</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={selectedGuest.relationship || ''}
                      onChange={(e) => setSelectedGuest({...selectedGuest, relationship: e.target.value})}
                      placeholder="e.g., Brother, Best Friend"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rsvpStatus">RSVP Status</Label>
                    <Select value={selectedGuest.rsvpStatus || 'Pending'} onValueChange={(value) => setSelectedGuest({...selectedGuest, rsvpStatus: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions (comma separated)</Label>
                  <Input
                    id="dietaryRestrictions"
                    value={selectedGuest.dietaryRestrictions?.join(', ') || ''}
                    onChange={(e) => setSelectedGuest({...selectedGuest, dietaryRestrictions: e.target.value.split(',').map(r => r.trim()).filter(Boolean)})}
                    placeholder="Vegetarian, Gluten-Free"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={selectedGuest.notes || ''}
                    onChange={(e) => setSelectedGuest({...selectedGuest, notes: e.target.value})}
                    placeholder="Special requests or notes"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVip"
                    checked={selectedGuest.isVip || false}
                    onCheckedChange={(checked) => setSelectedGuest({...selectedGuest, isVip: checked as boolean})}
                  />
                  <Label htmlFor="isVip">VIP Guest</Label>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gradient-maroon" 
                    onClick={() => updateGuestDetails(selectedGuest)}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowGuestDetails(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Optimization Dialog */}
        <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seating Optimization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This will automatically optimize your seating arrangement based on:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>VIP guests at VIP tables</li>
                <li>Family members seated together</li>
                <li>Dietary requirements grouped</li>
                <li>RSVP status considerations</li>
              </ul>
              <div className="flex gap-3">
                <Button className="flex-1 gradient-maroon" onClick={optimizeSeating}>
                  <Star className="w-4 h-4 mr-2" />
                  Optimize Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowOptimizationDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Table Dialog */}
        <Dialog open={showAddTableDialog} onOpenChange={setShowAddTableDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  placeholder="Enter table number"
                />
              </div>
              <div>
                <Label htmlFor="tableCapacity">Capacity</Label>
                <Input
                  id="tableCapacity"
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="Enter table capacity"
                />
              </div>
              <div>
                <Label htmlFor="tableCategory">Category</Label>
                <Select value={newTable.category} onValueChange={(value) => setNewTable({ ...newTable, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="colleagues">Colleagues</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tableNotes">Notes</Label>
                <Textarea
                  id="tableNotes"
                  value={newTable.notes}
                  onChange={(e) => setNewTable({ ...newTable, notes: e.target.value })}
                  placeholder="Enter any special notes for this table"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddTableDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTable}>
                  Add Table
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Guest Details Dialog */}
        <Dialog open={showGuestDetails} onOpenChange={setShowGuestDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guest Details</DialogTitle>
            </DialogHeader>
            {selectedGuest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={selectedGuest.name} readOnly />
                  </div>
                  <div>
                    <Label>RSVP Status</Label>
                    <Select value={selectedGuest.rsvpStatus} onValueChange={(value) => updateGuestDetails(selectedGuest.id, { rsvpStatus: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input value={selectedGuest.phone} onChange={(e) => updateGuestDetails(selectedGuest.id, { phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedGuest.email} onChange={(e) => updateGuestDetails(selectedGuest.id, { email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Dietary Restrictions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dietaryRestrictions.map((restriction) => (
                      <Badge
                        key={restriction}
                        variant={selectedGuest.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const updated = selectedGuest.dietaryRestrictions.includes(restriction)
                            ? selectedGuest.dietaryRestrictions.filter(r => r !== restriction)
                            : [...selectedGuest.dietaryRestrictions, restriction];
                          updateGuestDetails(selectedGuest.id, { dietaryRestrictions: updated });
                        }}
                      >
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Allergies</Label>
                  <Textarea
                    value={selectedGuest.allergies}
                    onChange={(e) => updateGuestDetails(selectedGuest.id, { allergies: e.target.value })}
                    placeholder="Enter any allergies"
                  />
                </div>
                <div>
                  <Label>Special Requests</Label>
                  <Textarea
                    value={selectedGuest.specialRequests}
                    onChange={(e) => updateGuestDetails(selectedGuest.id, { specialRequests: e.target.value })}
                    placeholder="Enter any special requests"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVip"
                    checked={selectedGuest.isVip}
                    onCheckedChange={(checked) => updateGuestDetails(selectedGuest.id, { isVip: checked as boolean })}
                  />
                  <Label htmlFor="isVip">VIP Guest</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowGuestDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Optimize Seating Dialog */}
        <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Optimize Seating</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Optimization Rules</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• VIP guests will be seated at VIP tables</li>
                  <li>• Family members will be seated together</li>
                  <li>• Guests with dietary restrictions will be noted</li>
                  <li>• Avoid seating guests who should not be together</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowOptimizationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={optimizeSeating}>
                  Optimize Seating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dietary Report Dialog */}
        <Dialog open={showDietaryReport} onOpenChange={setShowDietaryReport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dietary Requirements Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Vegetarian</h4>
                  <p className="text-2xl font-bold text-green-600">{guestsWithDietaryRestrictions.filter(g => g.dietaryRestrictions.includes('Vegetarian')).length}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Vegan</h4>
                  <p className="text-2xl font-bold text-blue-600">{guestsWithDietaryRestrictions.filter(g => g.dietaryRestrictions.includes('Vegan')).length}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Gluten-Free</h4>
                  <p className="text-2xl font-bold text-yellow-600">{guestsWithDietaryRestrictions.filter(g => g.dietaryRestrictions.includes('Gluten-Free')).length}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Allergies</h4>
                  <p className="text-2xl font-bold text-red-600">{guestsWithDietaryRestrictions.filter(g => g.allergies).length}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDietaryReport(false)}>
                  Close
                </Button>
                <Button onClick={generateDietaryReport}>
                  Generate Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
