import { useState } from 'react';
import { Bus, MapPin, Users, Clock, Plus, Edit, Trash2, Navigation, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TransportRoute {
  id: number;
  name: string;
  vehicleType: string;
  capacity: number;
  pickupPoint: string;
  dropPoint: string;
  pickupTime: string;
  estimatedArrival: string;
  assignedGuests: number;
  driver: string;
  driverPhone: string;
  vehicleNumber: string;
}

export function TransportationManagement() {
  const [routes, setRoutes] = useState<TransportRoute[]>([
    {
      id: 1,
      name: 'Route A - Airport to Venue',
      vehicleType: 'Luxury Bus',
      capacity: 45,
      pickupPoint: 'IGI Airport Terminal 3',
      dropPoint: 'Royal Palace Banquet',
      pickupTime: '10:00 AM',
      estimatedArrival: '11:30 AM',
      assignedGuests: 35,
      driver: 'Rajesh Kumar',
      driverPhone: '+91 98765 43210',
      vehicleNumber: 'DL 01 AB 1234',
    },
    {
      id: 2,
      name: 'Route B - Hotel to Venue',
      vehicleType: 'Mini Bus',
      capacity: 25,
      pickupPoint: 'Taj Palace Hotel',
      dropPoint: 'Royal Palace Banquet',
      pickupTime: '02:00 PM',
      estimatedArrival: '02:45 PM',
      assignedGuests: 20,
      driver: 'Suresh Sharma',
      driverPhone: '+91 98765 43211',
      vehicleNumber: 'DL 02 CD 5678',
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoute, setNewRoute] = useState<Partial<TransportRoute>>({
    name: '',
    vehicleType: 'Luxury Bus',
    capacity: 0,
    pickupPoint: '',
    dropPoint: '',
    pickupTime: '',
    estimatedArrival: '',
    assignedGuests: 0,
    driver: '',
    driverPhone: '',
    vehicleNumber: '',
  });

  const vehicleTypes = [
    { type: 'Luxury Bus', capacity: 45, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop' },
    { type: 'Mini Bus', capacity: 25, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop' },
    { type: 'Tempo Traveller', capacity: 16, image: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=400&h=300&fit=crop' },
    { type: 'SUV', capacity: 7, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop' },
    { type: 'Sedan', capacity: 4, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop' },
  ];

  const totalCapacity = routes.reduce((sum, r) => sum + r.capacity, 0);
  const totalAssigned = routes.reduce((sum, r) => sum + r.assignedGuests, 0);
  const availableSeats = totalCapacity - totalAssigned;

  const handleAddRoute = () => {
    if (!newRoute.name || !newRoute.pickupPoint || !newRoute.dropPoint) {
      toast.error('Please fill all required fields');
      return;
    }

    const route: TransportRoute = {
      id: Date.now(),
      name: newRoute.name,
      vehicleType: newRoute.vehicleType || 'Luxury Bus',
      capacity: newRoute.capacity || 0,
      pickupPoint: newRoute.pickupPoint,
      dropPoint: newRoute.dropPoint,
      pickupTime: newRoute.pickupTime || '',
      estimatedArrival: newRoute.estimatedArrival || '',
      assignedGuests: 0,
      driver: newRoute.driver || '',
      driverPhone: newRoute.driverPhone || '',
      vehicleNumber: newRoute.vehicleNumber || '',
    };

    setRoutes([...routes, route]);
    setShowAddDialog(false);
    setNewRoute({
      name: '',
      vehicleType: 'Luxury Bus',
      capacity: 0,
      pickupPoint: '',
      dropPoint: '',
      pickupTime: '',
      estimatedArrival: '',
      assignedGuests: 0,
      driver: '',
      driverPhone: '',
      vehicleNumber: '',
    });
    toast.success('Transportation route added!');
  };

  const handleDeleteRoute = (id: number) => {
    setRoutes(routes.filter(r => r.id !== id));
    toast.success('Route deleted');
  };

  const handleCallDriver = (name: string, phone: string) => {
    toast.info(`Calling ${name}...`);
  };

  const handleTrackVehicle = (vehicleNumber: string) => {
    toast.info(`Tracking ${vehicleNumber} in real-time...`);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bus className="w-8 h-8 text-primary" />
            <h1>Guest Transportation Management</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organize and track transportation for all your wedding guests
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <Bus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-2xl text-primary">{routes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl text-primary">{totalCapacity}</p>
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
                  <p className="text-sm text-muted-foreground">Assigned Guests</p>
                  <p className="text-2xl text-primary">{totalAssigned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Seats</p>
                  <p className="text-2xl text-primary">{availableSeats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Types */}
        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle>Available Vehicle Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {vehicleTypes.map((vehicle) => (
                <div key={vehicle.type} className="text-center">
                  <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm mb-1">{vehicle.type}</p>
                  <Badge variant="secondary">{vehicle.capacity} seats</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end mb-6">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-maroon">
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Transportation Route</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Route Name *</Label>
                  <Input
                    id="name"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                    placeholder="e.g., Route A - Airport to Venue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select
                    value={newRoute.vehicleType}
                    onValueChange={(value) => {
                      const selected = vehicleTypes.find(v => v.type === value);
                      setNewRoute({ ...newRoute, vehicleType: value, capacity: selected?.capacity || 0 });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((vehicle) => (
                        <SelectItem key={vehicle.type} value={vehicle.type}>
                          {vehicle.type} ({vehicle.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newRoute.capacity}
                    onChange={(e) => setNewRoute({ ...newRoute, capacity: Number(e.target.value) })}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupPoint">Pickup Point *</Label>
                  <Input
                    id="pickupPoint"
                    value={newRoute.pickupPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, pickupPoint: e.target.value })}
                    placeholder="e.g., IGI Airport Terminal 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropPoint">Drop Point *</Label>
                  <Input
                    id="dropPoint"
                    value={newRoute.dropPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, dropPoint: e.target.value })}
                    placeholder="e.g., Royal Palace Banquet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={newRoute.pickupTime}
                    onChange={(e) => setNewRoute({ ...newRoute, pickupTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedArrival">Estimated Arrival</Label>
                  <Input
                    id="estimatedArrival"
                    type="time"
                    value={newRoute.estimatedArrival}
                    onChange={(e) => setNewRoute({ ...newRoute, estimatedArrival: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Driver Name</Label>
                  <Input
                    id="driver"
                    value={newRoute.driver}
                    onChange={(e) => setNewRoute({ ...newRoute, driver: e.target.value })}
                    placeholder="Driver name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Driver Phone</Label>
                  <Input
                    id="driverPhone"
                    value={newRoute.driverPhone}
                    onChange={(e) => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={newRoute.vehicleNumber}
                    onChange={(e) => setNewRoute({ ...newRoute, vehicleNumber: e.target.value })}
                    placeholder="DL 01 AB 1234"
                  />
                </div>

                <Button className="w-full gradient-maroon md:col-span-2" onClick={handleAddRoute}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Route
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {routes.map((route) => {
            const occupancy = (route.assignedGuests / route.capacity) * 100;
            return (
              <Card key={route.id} className="glassmorphism hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bus className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1">{route.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge>{route.vehicleType}</Badge>
                          <span>{route.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Pickup
                      </p>
                      <p className="text-sm">{route.pickupPoint}</p>
                      <p className="text-xs text-muted-foreground">{route.pickupTime}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Drop
                      </p>
                      <p className="text-sm">{route.dropPoint}</p>
                      <p className="text-xs text-muted-foreground">{route.estimatedArrival}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Occupancy</p>
                      <p className="text-sm mb-1">
                        {route.assignedGuests} / {route.capacity} guests
                      </p>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            occupancy >= 90 ? 'bg-red-600' : occupancy >= 70 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Driver</p>
                      <p className="text-sm mb-1">{route.driver}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCallDriver(route.driver, route.driverPhone)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => handleTrackVehicle(route.vehicleNumber)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Track Vehicle
                    </Button>
                    <Button className="flex-1 gradient-maroon">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Guests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
