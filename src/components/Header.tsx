import React, { useState } from 'react';
import { 
  Heart, User, LogOut, Settings, Bell, Search, ChevronDown, 
  Crown, Shield, Building2, Calendar, Star, TrendingUp,
  Lock, Eye, EyeOff, AlertCircle, CheckCircle, Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { useCountry } from '../contexts/CountryContext';
import { useNotifications } from '../contexts/NotificationContext';
import { AuthModal } from './AuthModal';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, tab?: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, isAuthenticated, logout, switchToVendor, switchToUser } = useAuth();
  const { selectedCountry, setSelectedCountry, countries } = useCountry();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigate('landing');
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  const getRoleBadge = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <Badge className="bg-red-500 text-white">Admin</Badge>;
      case 'vendor':
        return <Badge className="bg-green-500 text-white">Vendor</Badge>;
      case 'user':
        return <Badge className="bg-blue-500 text-white">User</Badge>;
      default:
        return null;
    }
  };

  const getRoleIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    
    switch (user.role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'vendor':
        return <Building2 className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleSpecificActions = () => {
    if (!user) return [];

    switch (user.role) {
      case 'user':
        return [
          { label: 'My Profile', page: 'user-profile', icon: User },
          { label: 'User Dashboard', page: 'user-dashboard', icon: Calendar },
          { label: 'Become a Vendor', action: 'switchToVendor', icon: Building2 }
        ];
      case 'vendor':
        return [
          { label: 'Vendor Dashboard', page: 'vendor-dashboard', icon: Building2 },
          { label: 'Switch to User', action: 'switchToUser', icon: User },
          { label: 'Register New Business', page: 'vendor', icon: Crown }
        ];
      case 'admin':
        return [
          { label: 'Admin Panel', page: 'admin', icon: Shield }
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border glassmorphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('landing')}>
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-primary">ShaadiBiyah</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => handleNavigate('landing')}
                className={`transition-colors ${currentPage === 'landing' ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`}
              >
                Home
              </button>
              
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-foreground/70 hover:text-primary transition-colors">
                    Services
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Wedding Services</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate('matrimonial')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Matrimonial Matching
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('halls')}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Marriage Halls
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('cars')}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Wedding Cars
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('services')}>
                    <Star className="w-4 h-4 mr-2" />
                    All Vendors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('marketplace')}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Vendor Marketplace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => handleNavigate('features')}
                className={`transition-colors ${currentPage === 'features' ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`}
              >
                Features
              </button>

              <button
                onClick={() => handleNavigate('blog')}
                className={`transition-colors ${currentPage === 'blog' ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`}
              >
                Blog
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Country Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="hidden md:block text-sm">{selectedCountry.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 z-50" align="end">
                  <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country.code}
                      onClick={() => setSelectedCountry(country)}
                      className={`flex items-center gap-3 ${selectedCountry.code === country.code ? 'bg-primary/10' : ''}`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{country.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {country.currencySymbol} {country.currency}
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate('search')}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {isAuthenticated && (
                <NotificationDropdown onNavigate={handleNavigate}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center bg-primary">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </NotificationDropdown>
              )}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback className="text-xs">
                          {user.firstName?.[0] || user.businessName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block">
                        {user.firstName || user.businessName || 'User'}
                      </span>
                      {getRoleBadge()}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 z-50" align="end">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      {getRoleIcon()}
                      {user.firstName || user.businessName || 'User'}
                      {getRoleBadge()}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {getRoleSpecificActions().map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          if (action.action === 'switchToVendor') {
                            switchToVendor();
                          } else if (action.action === 'switchToUser') {
                            switchToUser();
                          } else if (action.page) {
                            handleNavigate(action.page);
                          }
                        }}
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigate('notifications')}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notification Center
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    className="gradient-maroon"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Heart className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-primary fill-primary" />
                    ShaadiBiyah
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-4 mt-8">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback>
                            {user.firstName?.[0] || user.businessName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.firstName || user.businessName || 'User'}</p>
                          <div className="flex items-center gap-2">
                            {getRoleBadge()}
                          </div>
                        </div>
                      </div>

                      {/* Country Selector */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <Globe className="w-4 h-4 mr-2" />
                              <span className="text-lg mr-2">{selectedCountry.flag}</span>
                              <span className="flex-1 text-left">{selectedCountry.name}</span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-64">
                            <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {countries.map((country) => (
                              <DropdownMenuItem
                                key={country.code}
                                onClick={() => setSelectedCountry(country)}
                                className={`flex items-center gap-3 ${selectedCountry.code === country.code ? 'bg-primary/10' : ''}`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <div className="flex-1">
                                  <div className="font-medium">{country.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {country.currencySymbol} {country.currency}
                                  </div>
                                </div>
                                {selectedCountry.code === country.code && (
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Notifications */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Notifications</label>
                        <NotificationDropdown onNavigate={handleNavigate}>
                          <Button variant="outline" className="w-full justify-start">
                            <Bell className="w-4 h-4 mr-2" />
                            <span className="flex-1 text-left">Notifications</span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </Badge>
                            )}
                          </Button>
                        </NotificationDropdown>
                      </div>

                      {/* Role-specific actions */}
                      {getRoleSpecificActions().map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            if (action.action === 'switchToVendor') {
                              switchToVendor();
                            } else if (action.action === 'switchToUser') {
                              switchToUser();
                            } else if (action.page) {
                              handleNavigate(action.page);
                            }
                          }}
                        >
                          <action.icon className="w-4 h-4 mr-2" />
                          {action.label}
                        </Button>
                      ))}

                      <Button variant="outline" className="justify-start" onClick={() => handleNavigate('features')}>
                        <Star className="w-4 h-4 mr-2" />
                        All Features
                      </Button>

                      <Button variant="outline" className="justify-start" onClick={() => handleNavigate('notifications')}>
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Center
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>

                      <Button variant="outline" className="justify-start text-red-500" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setShowAuthModal(true)} className="justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                      <Button className="gradient-maroon justify-start" onClick={() => setShowAuthModal(true)}>
                        Get Started
                      </Button>
                    </>
                  )}
                  
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm px-2 mb-2">Services</p>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('matrimonial')}>
                      Matrimonial
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('halls')}>
                      Marriage Halls
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('cars')}>
                      Wedding Cars
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('services')}>
                      All Vendors
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigate('marketplace')}>
                      Vendor Marketplace
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          defaultTab="login"
        />
      )}
    </>
  );
}