import { useState } from 'react';
import { Clock, Plus, Edit2, Trash2, Download, Share2, Calendar as CalendarIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TimePicker } from './ui/date-time-picker';
import { toast } from 'sonner@2.0.3';

interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  description: string;
  duration: number;
  category: 'Ceremony' | 'Reception' | 'Pre-Wedding' | 'Other';
  responsible: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const defaultEvents: TimelineEvent[] = [
  {
    id: 1,
    time: '09:00',
    title: 'Baraat Arrival',
    description: 'Groom arrives with family and friends',
    duration: 60,
    category: 'Ceremony',
    responsible: 'Event Coordinator',
    status: 'Pending',
  },
  {
    id: 2,
    time: '10:00',
    title: 'Milni Ceremony',
    description: 'Introduction of both families',
    duration: 30,
    category: 'Ceremony',
    responsible: 'Pandit Ji',
    status: 'Pending',
  },
  {
    id: 3,
    time: '10:30',
    title: 'Varmala/Jaimala',
    description: 'Exchange of garlands',
    duration: 30,
    category: 'Ceremony',
    responsible: 'Photographer',
    status: 'Pending',
  },
  {
    id: 4,
    time: '11:00',
    title: 'Wedding Ceremony',
    description: 'Main wedding rituals and pheras',
    duration: 90,
    category: 'Ceremony',
    responsible: 'Pandit Ji',
    status: 'Pending',
  },
  {
    id: 5,
    time: '12:30',
    title: 'Lunch Break',
    description: 'Refreshments for guests',
    duration: 60,
    category: 'Other',
    responsible: 'Caterer',
    status: 'Pending',
  },
  {
    id: 6,
    time: '13:30',
    title: 'Photo Session',
    description: 'Family and couple photography',
    duration: 60,
    category: 'Other',
    responsible: 'Photographer',
    status: 'Pending',
  },
  {
    id: 7,
    time: '14:30',
    title: 'Vidaai',
    description: 'Bride farewell ceremony',
    duration: 30,
    category: 'Ceremony',
    responsible: 'Event Coordinator',
    status: 'Pending',
  },
];

const templates = [
  { id: 1, name: 'Traditional Hindu Wedding', events: 12 },
  { id: 2, name: 'Muslim Nikah Ceremony', events: 8 },
  { id: 3, name: 'Sikh Anand Karaj', events: 10 },
  { id: 4, name: 'Christian Wedding', events: 9 },
  { id: 5, name: 'Destination Wedding', events: 15 },
  { id: 6, name: 'Court Marriage', events: 5 },
];

export function WeddingTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(defaultEvents);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    time: '',
    title: '',
    description: '',
    duration: 30,
    category: 'Other',
    responsible: '',
    status: 'Pending',
  });

  const addEvent = () => {
    if (!newEvent.time || !newEvent.title) {
      toast.error('Please fill in time and title');
      return;
    }
    
    const event: TimelineEvent = {
      id: events.length + 1,
      time: newEvent.time!,
      title: newEvent.title!,
      description: newEvent.description || '',
      duration: newEvent.duration || 30,
      category: newEvent.category as any || 'Other',
      responsible: newEvent.responsible || '',
      status: 'Pending',
    };
    
    setEvents([...events, event].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAddingEvent(false);
    setNewEvent({
      time: '',
      title: '',
      description: '',
      duration: 30,
      category: 'Other',
      responsible: '',
      status: 'Pending',
    });
    toast.success('Event added to timeline');
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event removed from timeline');
  };

  const updateEventStatus = (id: number, status: TimelineEvent['status']) => {
    setEvents(events.map(e => e.id === id ? { ...e, status } : e));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ceremony': return 'bg-primary';
      case 'Reception': return 'bg-accent';
      case 'Pre-Wedding': return 'bg-secondary';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'In Progress': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarIcon className="w-10 h-10 text-primary" />
            <h1>Wedding Day Timeline</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan every moment of your special day with a detailed timeline
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
            <DialogTrigger asChild>
              <Button className="gradient-maroon">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <TimePicker
                      time={newEvent.time}
                      onTimeChange={(time) => setNewEvent({ ...newEvent, time })}
                      placeholder="Select time"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Wedding Ceremony"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ceremony">Ceremony</SelectItem>
                        <SelectItem value="Reception">Reception</SelectItem>
                        <SelectItem value="Pre-Wedding">Pre-Wedding</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsible</Label>
                    <Input
                      id="responsible"
                      value={newEvent.responsible}
                      onChange={(e) => setNewEvent({ ...newEvent, responsible: e.target.value })}
                      placeholder="e.g., Photographer"
                    />
                  </div>
                </div>
                <Button className="w-full gradient-maroon" onClick={addEvent}>
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share with Team
          </Button>

          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Load Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <p className="text-2xl text-primary mb-1">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <p className="text-2xl text-primary mb-1">
                {events.reduce((sum, e) => sum + e.duration, 0)} mins
              </p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <p className="text-2xl text-green-600 mb-1">
                {events.filter(e => e.status === 'Completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4 text-center">
              <p className="text-2xl text-yellow-600 mb-1">
                {events.filter(e => e.status === 'Pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Your Wedding Day Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  {/* Time Column */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 text-center">
                      <p className="text-sm text-primary mb-1">{event.time}</p>
                      <p className="text-xs text-muted-foreground">{event.duration} min</p>
                    </div>
                    {index < events.length - 1 && (
                      <div className="flex-1 w-0.5 bg-accent/30 my-2" />
                    )}
                  </div>

                  {/* Event Card */}
                  <Card className="flex-1 mb-2 hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: getCategoryColor(event.category) }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{event.title}</h4>
                            {getStatusIcon(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                            {event.responsible && (
                              <Badge variant="outline" className="text-xs">
                                {event.responsible}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Select
                            value={event.status}
                            onValueChange={(value) => updateEventStatus(event.id, value as any)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="glassmorphism mt-8">
          <CardHeader>
            <CardTitle>Timeline Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Add 15-30 minutes buffer time between major events</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Share timeline with all vendors at least 2 weeks before</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Assign a day-of coordinator to manage the schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Keep golden hour (sunset) reserved for couple photography</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
