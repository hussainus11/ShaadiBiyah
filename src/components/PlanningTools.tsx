import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Users, IndianRupee, Calendar as CalendarIcon, TrendingUp, PieChart, ListChecks, Brain, Clock, Star, MapPin, Phone, Mail, ExternalLink, Filter, Search, Download, Upload, AlertTriangle, CheckCircle, XCircle, Lightbulb, Target, Zap, BarChart3, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { DateTimePicker } from './ui/date-time-picker';

const defaultChecklist = [
  { category: '6-12 Months Before', tasks: [
    { id: 1, text: 'Set wedding date', completed: false },
    { id: 2, text: 'Create guest list', completed: false },
    { id: 3, text: 'Set budget', completed: false },
    { id: 4, text: 'Book venue', completed: false },
    { id: 5, text: 'Hire wedding planner', completed: false },
  ]},
  { category: '3-6 Months Before', tasks: [
    { id: 6, text: 'Book photographer/videographer', completed: false },
    { id: 7, text: 'Book caterer', completed: false },
    { id: 8, text: 'Book makeup artist', completed: false },
    { id: 9, text: 'Order wedding attire', completed: false },
    { id: 10, text: 'Book decorator', completed: false },
  ]},
  { category: '1-3 Months Before', tasks: [
    { id: 11, text: 'Send invitations', completed: false },
    { id: 12, text: 'Book mehndi artist', completed: false },
    { id: 13, text: 'Finalize menu', completed: false },
    { id: 14, text: 'Book transportation', completed: false },
    { id: 15, text: 'Plan honeymoon', completed: false },
  ]},
  { category: 'Final Month', tasks: [
    { id: 16, text: 'Confirm all vendor bookings', completed: false },
    { id: 17, text: 'Final dress fitting', completed: false },
    { id: 18, text: 'Create seating chart', completed: false },
    { id: 19, text: 'Pack for honeymoon', completed: false },
    { id: 20, text: 'Rehearsal with vendors', completed: false },
  ]},
];

const defaultBudgetItems = [
  { id: 1, category: 'Venue', budgeted: 200000, spent: 200000 },
  { id: 2, category: 'Catering', budgeted: 300000, spent: 0 },
  { id: 3, category: 'Photography', budgeted: 50000, spent: 50000 },
  { id: 4, category: 'Decoration', budgeted: 100000, spent: 0 },
  { id: 5, category: 'Clothing', budgeted: 150000, spent: 0 },
  { id: 6, category: 'Makeup & Beauty', budgeted: 30000, spent: 0 },
  { id: 7, category: 'Invitations', budgeted: 20000, spent: 0 },
  { id: 8, category: 'Transportation', budgeted: 50000, spent: 0 },
  { id: 9, category: 'Jewelry', budgeted: 200000, spent: 0 },
  { id: 10, category: 'Miscellaneous', budgeted: 50000, spent: 0 },
];

interface Guest {
  id: number;
  name: string;
  side: 'Bride' | 'Groom';
  category: 'Family' | 'Friends' | 'Colleagues';
  rsvp: 'Pending' | 'Confirmed' | 'Declined';
  plusOne: boolean;
  email?: string;
  phone?: string;
  dietaryRestrictions?: string[];
  specialRequests?: string;
}

interface AIRecommendation {
  id: number;
  type: 'timeline' | 'budget' | 'vendor' | 'logistics';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  category: string;
  isRead: boolean;
}

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  vendors: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: number[];
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  location: string;
  availability: string;
  reviews: number;
  isBooked: boolean;
  notes?: string;
}

interface BudgetOptimization {
  category: string;
  currentSpent: number;
  recommendedSpent: number;
  savings: number;
  suggestions: string[];
}

// Mock data for new features
const mockAIRecommendations: AIRecommendation[] = [
  {
    id: 1,
    type: 'timeline',
    priority: 'high',
    title: 'Book photographer 6 months in advance',
    description: 'Popular photographers get booked quickly. Consider booking now to secure your preferred choice.',
    action: 'Contact 3 photographers and compare packages',
    impact: 'High - Ensures quality photography for your special day',
    category: 'Photography',
    isRead: false
  },
  {
    id: 2,
    type: 'budget',
    priority: 'medium',
    title: 'Consider off-season wedding dates',
    description: 'Wedding costs can be 20-30% lower during off-peak months.',
    action: 'Review venue pricing for different months',
    impact: 'Medium - Potential savings of Rs.50,000-100,000',
    category: 'Venue',
    isRead: false
  },
  {
    id: 3,
    type: 'vendor',
    priority: 'high',
    title: 'Book makeup artist for trials',
    description: 'Schedule makeup trials 2-3 months before the wedding to finalize the look.',
    action: 'Book trial sessions with 2-3 artists',
    impact: 'High - Ensures perfect bridal look',
    category: 'Beauty',
    isRead: true
  }
];

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: 'Venue Booking',
    date: '2024-03-15',
    time: '10:00 AM',
    duration: 120,
    location: 'Grand Palace Hotel',
    vendors: ['Venue Manager'],
    status: 'completed',
    priority: 'critical',
    dependencies: []
  },
  {
    id: 2,
    title: 'Photography Session',
    date: '2024-04-20',
    time: '2:00 PM',
    duration: 180,
    location: 'Studio XYZ',
    vendors: ['Photographer', 'Videographer'],
    status: 'scheduled',
    priority: 'high',
    dependencies: [1]
  },
  {
    id: 3,
    title: 'Menu Tasting',
    date: '2024-05-10',
    time: '7:00 PM',
    duration: 90,
    location: 'Catering Company',
    vendors: ['Caterer'],
    status: 'scheduled',
    priority: 'medium',
    dependencies: [1]
  }
];

const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'Royal Photography',
    category: 'Photography',
    rating: 4.8,
    price: 75000,
    contact: {
      phone: '+91 98765 43210',
      email: 'info@royalphoto.com',
      website: 'www.royalphoto.com'
    },
    location: 'Mumbai',
    availability: 'Available',
    reviews: 156,
    isBooked: false
  },
  {
    id: 2,
    name: 'Elegant Caterers',
    category: 'Catering',
    rating: 4.6,
    price: 120000,
    contact: {
      phone: '+91 98765 43211',
      email: 'contact@elegantcaterers.com',
      website: 'www.elegantcaterers.com'
    },
    location: 'Delhi',
    availability: 'Limited',
    reviews: 89,
    isBooked: true
  },
  {
    id: 3,
    name: 'Dream Decorators',
    category: 'Decoration',
    rating: 4.7,
    price: 85000,
    contact: {
      phone: '+91 98765 43212',
      email: 'hello@dreamdecor.com',
      website: 'www.dreamdecor.com'
    },
    location: 'Bangalore',
    availability: 'Available',
    reviews: 203,
    isBooked: false
  }
];

const mockBudgetOptimizations: BudgetOptimization[] = [
  {
    category: 'Venue',
    currentSpent: 200000,
    recommendedSpent: 180000,
    savings: 20000,
    suggestions: ['Consider weekday booking', 'Negotiate package deals', 'Book during off-season']
  },
  {
    category: 'Catering',
    currentSpent: 0,
    recommendedSpent: 250000,
    savings: 50000,
    suggestions: ['Compare 3-4 caterers', 'Consider buffet over plated', 'Negotiate per-plate rates']
  }
];

export function PlanningTools() {
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [budgetItems, setBudgetItems] = useState(defaultBudgetItems);
  const [guests, setGuests] = useState<Guest[]>([
    { id: 1, name: 'Amit Kumar', side: 'Groom', category: 'Family', rsvp: 'Confirmed', plusOne: true, email: 'amit@email.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Priya Sharma', side: 'Bride', category: 'Friends', rsvp: 'Confirmed', plusOne: false, email: 'priya@email.com', phone: '+91 98765 43211' },
    { id: 3, name: 'Rajesh Patel', side: 'Groom', category: 'Colleagues', rsvp: 'Pending', plusOne: true, email: 'rajesh@email.com', phone: '+91 98765 43212' },
  ]);
  
  // New state for enhanced features
  const [aiRecommendations, setAIRecommendations] = useState(mockAIRecommendations);
  const [timelineEvents, setTimelineEvents] = useState(mockTimelineEvents);
  const [vendors, setVendors] = useState(mockVendors);
  const [budgetOptimizations, setBudgetOptimizations] = useState(mockBudgetOptimizations);
  const [activeTab, setActiveTab] = useState('checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const toggleTask = (categoryIndex: number, taskId: number) => {
    const newChecklist = [...checklist];
    const task = newChecklist[categoryIndex].tasks.find(t => t.id === taskId);
    if (task) task.completed = !task.completed;
    setChecklist(newChecklist);
  };

  // Enhanced functions for new features
  const markRecommendationAsRead = (id: number) => {
    setAIRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, isRead: true } : rec)
    );
  };

  const updateTimelineEventStatus = (id: number, status: TimelineEvent['status']) => {
    setTimelineEvents(prev => 
      prev.map(event => event.id === id ? { ...event, status } : event)
    );
  };

  const bookVendor = (id: number) => {
    setVendors(prev => 
      prev.map(vendor => vendor.id === id ? { ...vendor, isBooked: true } : vendor)
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const unreadRecommendations = aiRecommendations.filter(rec => !rec.isRead).length;
  const overdueEvents = timelineEvents.filter(event => 
    event.status === 'scheduled' && new Date(event.date) < new Date()
  ).length;
  const totalSavings = budgetOptimizations.reduce((sum, opt) => sum + opt.savings, 0);

  const totalTasks = checklist.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = checklist.reduce((sum, cat) => 
    sum + cat.tasks.filter(t => t.completed).length, 0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const budgetPercent = Math.round((totalSpent / totalBudget) * 100);

  const confirmedGuests = guests.filter(g => g.rsvp === 'Confirmed').length;
  const pendingGuests = guests.filter(g => g.rsvp === 'Pending').length;
  const declinedGuests = guests.filter(g => g.rsvp === 'Declined').length;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Planning Tools</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organize your wedding with our comprehensive planning tools
          </p>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <ListChecks className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Tasks Complete</p>
                  <p className="text-2xl text-primary">{completedTasks}/{totalTasks}</p>
                  <Progress value={progressPercent} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Budget Used</p>
                  <p className="text-2xl text-primary">Rs.{(totalSpent/100000).toFixed(1)}L</p>
                  <Progress value={budgetPercent} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">RSVP Status</p>
                  <p className="text-2xl text-primary">{confirmedGuests}/{guests.length}</p>
                  <Progress value={(confirmedGuests/guests.length)*100} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">AI Insights</p>
                  <p className="text-2xl text-primary">{unreadRecommendations}</p>
                  <p className="text-xs text-muted-foreground">New recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-6">
            <TabsTrigger value="checklist">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="budget">
              <IndianRupee className="w-4 h-4 mr-2" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="guests">
              <Users className="w-4 h-4 mr-2" />
              Guest List
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="vendors">
              <Star className="w-4 h-4 mr-2" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Checklist Tab */}
          <TabsContent value="checklist">
            <div className="space-y-6">
              {checklist.map((category, catIndex) => (
                <Card key={category.category} className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.category}</span>
                      <Badge variant="secondary">
                        {category.tasks.filter(t => t.completed).length}/{category.tasks.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(catIndex, task.id)}
                            id={`task-${task.id}`}
                          />
                          <Label
                            htmlFor={`task-${task.id}`}
                            className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {task.text}
                          </Label>
                          {task.completed && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Budget Breakdown</span>
                  <div className="text-sm space-x-4">
                    <span className="text-muted-foreground">Total Budget: <span className="text-primary">Rs.{(totalBudget/100000).toFixed(1)}L</span></span>
                    <span className="text-muted-foreground">Spent: <span className="text-primary">Rs.{(totalSpent/100000).toFixed(1)}L</span></span>
                    <span className="text-muted-foreground">Remaining: <span className="text-green-600">Rs.{((totalBudget-totalSpent)/100000).toFixed(1)}L</span></span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetItems.map((item) => {
                    const spent = (item.spent / item.budgeted) * 100;
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>{item.category}</span>
                          <span className="text-sm text-muted-foreground">
                            Rs.{item.spent.toLocaleString()} / Rs.{item.budgeted.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={spent} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <Card className="gradient-pink border-accent/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Budget Utilization</p>
                          <p className="text-3xl text-primary">{budgetPercent}%</p>
                        </div>
                        <PieChart className="w-12 h-12 text-primary opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="gradient-gold border-accent">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-foreground/80 mb-1">Savings</p>
                          <p className="text-3xl text-foreground">Rs.{((totalBudget-totalSpent)/1000).toFixed(0)}K</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-foreground opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guest List Tab */}
          <TabsContent value="guests">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guest List ({guests.length} guests)</span>
                  <div className="flex gap-2">
                    <Badge className="bg-green-500">{confirmedGuests} Confirmed</Badge>
                    <Badge className="bg-yellow-500">{pendingGuests} Pending</Badge>
                    <Badge className="bg-red-500">{declinedGuests} Declined</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid md:grid-cols-4 gap-4">
                  <Input placeholder="Guest name" />
                  <Input placeholder="Side (Bride/Groom)" />
                  <Input placeholder="Category" />
                  <Button className="gradient-maroon">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </div>

                <div className="space-y-3">
                  {guests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex-1">
                        <p className="mb-1">{guest.name}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{guest.side}</Badge>
                          <Badge variant="outline">{guest.category}</Badge>
                          {guest.plusOne && <Badge variant="outline">+1</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          guest.rsvp === 'Confirmed' ? 'bg-green-500' :
                          guest.rsvp === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {guest.rsvp}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wedding Timeline</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {timelineEvents.map((event) => (
                  <Card key={event.id} className="glassmorphism">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge variant={
                              event.status === 'completed' ? 'default' :
                              event.status === 'in-progress' ? 'secondary' :
                              event.status === 'overdue' ? 'destructive' : 'outline'
                            }>
                              {event.status}
                            </Badge>
                            <Badge variant={
                              event.priority === 'critical' ? 'destructive' :
                              event.priority === 'high' ? 'default' :
                              event.priority === 'medium' ? 'secondary' : 'outline'
                            }>
                              {event.priority}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              {event.date} at {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.duration} minutes
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.vendors.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTimelineEventStatus(event.id, 'in-progress')}
                          >
                            Start
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTimelineEventStatus(event.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vendor Marketplace</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Catering">Catering</SelectItem>
                      <SelectItem value="Decoration">Decoration</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="glassmorphism">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground">{vendor.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {vendor.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          Rs.{vendor.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {vendor.reviews} reviews
                        </div>
                        <Badge variant={vendor.availability === 'Available' ? 'default' : 'secondary'}>
                          {vendor.availability}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowVendorDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={vendor.isBooked}
                          onClick={() => bookVendor(vendor.id)}
                        >
                          {vendor.isBooked ? 'Booked' : 'Book Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowAIInsights(!showAIInsights)}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {showAIInsights ? 'Hide' : 'Show'} Insights
                </Button>
              </div>

              {showAIInsights && (
                <div className="grid gap-6">
                  {/* AI Recommendations */}
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Smart Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiRecommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className={`p-4 rounded-lg border ${
                              rec.isRead ? 'bg-muted/50' : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{rec.title}</h4>
                                  <Badge variant={
                                    rec.priority === 'high' ? 'destructive' :
                                    rec.priority === 'medium' ? 'default' : 'secondary'
                                  }>
                                    {rec.priority}
                                  </Badge>
                                  <Badge variant="outline">{rec.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                                <div className="text-sm">
                                  <p><strong>Action:</strong> {rec.action}</p>
                                  <p><strong>Impact:</strong> {rec.impact}</p>
                                </div>
                              </div>
                              {!rec.isRead && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markRecommendationAsRead(rec.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Budget Optimizations */}
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5" />
                        Budget Optimizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {budgetOptimizations.map((opt, index) => (
                          <div key={index} className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{opt.category}</h4>
                              <div className="text-right">
                                <p className="text-sm text-green-600 font-medium">
                                  Potential Savings: Rs.{opt.savings.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Current: Rs.{opt.currentSpent.toLocaleString()}</span>
                                <span>Recommended: Rs.{opt.recommendedSpent.toLocaleString()}</span>
                              </div>
                              <Progress 
                                value={(opt.currentSpent / opt.recommendedSpent) * 100} 
                                className="h-2" 
                              />
                              <div className="text-sm">
                                <p className="font-medium mb-1">Suggestions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {opt.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="text-muted-foreground">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Vendor Details Dialog */}
        <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedVendor.name}</h3>
                    <p className="text-muted-foreground">{selectedVendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedVendor.rating}</span>
                    <span className="text-sm text-muted-foreground">({selectedVendor.reviews} reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <p className="text-lg font-semibold">Rs.{selectedVendor.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p>{selectedVendor.location}</p>
                  </div>
                  <div>
                    <Label>Availability</Label>
                    <Badge variant={selectedVendor.availability === 'Available' ? 'default' : 'secondary'}>
                      {selectedVendor.availability}
                    </Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedVendor.isBooked ? 'default' : 'outline'}>
                      {selectedVendor.isBooked ? 'Booked' : 'Available'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Contact Information</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedVendor.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedVendor.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <a href={selectedVendor.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedVendor.contact.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowVendorDialog(false)}>
                    Close
                  </Button>
                  <Button 
                    disabled={selectedVendor.isBooked}
                    onClick={() => {
                      bookVendor(selectedVendor.id);
                      setShowVendorDialog(false);
                    }}
                  >
                    {selectedVendor.isBooked ? 'Already Booked' : 'Book Vendor'}
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
