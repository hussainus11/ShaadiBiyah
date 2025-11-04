import React, { useState } from 'react';
import { 
  User, Edit3, Save, Upload, Camera, Mail, Phone, MapPin, 
  Calendar, Heart, Users, Gift, Settings, Shield, Bell,
  Eye, EyeOff, Lock, Unlock, CheckCircle, AlertCircle,
  Star, Award, Calendar as CalendarIcon, IndianRupee, Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  bio: string;
  profileImage: string;
  weddingDate: string;
  partnerName: string;
  budget: number;
  guestCount: number;
  preferences: {
    venueType: string;
    cuisine: string;
    theme: string;
    music: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showContact: boolean;
    showWeddingDate: boolean;
  };
}

interface Booking {
  id: string;
  vendorName: string;
  service: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface Favorite {
  id: string;
  vendorName: string;
  category: string;
  location: string;
  rating: number;
  price: number;
}

export function UserProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1995-06-15',
    gender: 'Female',
    location: 'Mumbai, Maharashtra',
    bio: 'Excited to plan our dream wedding! Looking for the perfect venue and vendors.',
    profileImage: '',
    weddingDate: '2024-12-15',
    partnerName: 'Rahul Kapoor',
    budget: 5000000,
    guestCount: 200,
    preferences: {
      venueType: 'Banquet Hall',
      cuisine: 'North Indian',
      theme: 'Traditional',
      music: 'Live Band'
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    privacy: {
      profilePublic: true,
      showContact: true,
      showWeddingDate: false
    }
  });

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      vendorName: 'Royal Palace Banquet',
      service: 'Venue Booking',
      date: '2024-12-15',
      amount: 150000,
      status: 'confirmed'
    },
    {
      id: '2',
      vendorName: 'Rahul Photography',
      service: 'Wedding Photography',
      date: '2024-12-15',
      amount: 50000,
      status: 'pending'
    }
  ]);

  const [favorites] = useState<Favorite[]>([
    {
      id: '1',
      vendorName: 'Grand Heritage Hall',
      category: 'Marriage Hall',
      location: 'Delhi',
      rating: 4.8,
      price: 80000
    },
    {
      id: '2',
      vendorName: 'Luxury Cars Delhi',
      category: 'Car Service',
      location: 'Delhi',
      rating: 4.9,
      price: 15000
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
    // Show success message
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Change password logic here
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Show success message
    } else {
      // Show error message
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge className="bg-blue-500 text-white">
                Premium Member
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="glassmorphism mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback className="text-2xl">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-muted-foreground mb-2">{profile.bio}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    Wedding: {profile.weddingDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {profile.guestCount} guests
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="wedding">Wedding</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage src={profile.profileImage} />
                      <AvatarFallback className="text-4xl">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" disabled={!isEditing}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button variant="outline" className="w-full" disabled={!isEditing}>
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <Button onClick={handleSaveProfile} className="gradient-maroon">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Wedding Information Tab */}
          <TabsContent value="wedding">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Wedding Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={profile.weddingDate}
                      onChange={(e) => setProfile(prev => ({ ...prev, weddingDate: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerName">Partner Name</Label>
                    <Input
                      id="partnerName"
                      value={profile.partnerName}
                      onChange={(e) => setProfile(prev => ({ ...prev, partnerName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Wedding Budget (Rs.)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={profile.budget}
                      onChange={(e) => setProfile(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Expected Guest Count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={profile.guestCount}
                      onChange={(e) => setProfile(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Wedding Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueType">Preferred Venue Type</Label>
                    <Select
                      value={profile.preferences.venueType}
                      onValueChange={(value) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, venueType: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Banquet Hall">Banquet Hall</SelectItem>
                        <SelectItem value="Garden">Garden</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Preferred Cuisine</Label>
                    <Select
                      value={profile.preferences.cuisine}
                      onValueChange={(value) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, cuisine: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North Indian">North Indian</SelectItem>
                        <SelectItem value="South Indian">South Indian</SelectItem>
                        <SelectItem value="Gujarati">Gujarati</SelectItem>
                        <SelectItem value="Punjabi">Punjabi</SelectItem>
                        <SelectItem value="Multi-cuisine">Multi-cuisine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Wedding Theme</Label>
                    <Select
                      value={profile.preferences.theme}
                      onValueChange={(value) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, theme: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Traditional">Traditional</SelectItem>
                        <SelectItem value="Modern">Modern</SelectItem>
                        <SelectItem value="Royal">Royal</SelectItem>
                        <SelectItem value="Rustic">Rustic</SelectItem>
                        <SelectItem value="Vintage">Vintage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="music">Music Preference</Label>
                    <Select
                      value={profile.preferences.music}
                      onValueChange={(value) => setProfile(prev => ({ 
                        ...prev, 
                        preferences: { ...prev.preferences, music: value }
                      }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Live Band">Live Band</SelectItem>
                        <SelectItem value="DJ">DJ</SelectItem>
                        <SelectItem value="Classical">Classical</SelectItem>
                        <SelectItem value="Mix">Mix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{booking.vendorName}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Rs.{booking.amount.toLocaleString()}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{favorite.vendorName}</h4>
                          <Badge variant="secondary">{favorite.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{favorite.location}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(favorite.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{favorite.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Rs.{favorite.price.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch
                      checked={profile.notifications.email}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch
                      checked={profile.notifications.sms}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={profile.notifications.push}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Marketing Emails</span>
                    </div>
                    <Switch
                      checked={profile.notifications.marketing}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, marketing: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Public Profile</span>
                    </div>
                    <Switch
                      checked={profile.privacy.profilePublic}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profilePublic: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Show Contact Info</span>
                    </div>
                    <Switch
                      checked={profile.privacy.showContact}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showContact: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Show Wedding Date</span>
                    </div>
                    <Switch
                      checked={profile.privacy.showWeddingDate}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showWeddingDate: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism md:col-span-2">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="gradient-maroon">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
