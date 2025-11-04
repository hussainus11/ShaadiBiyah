import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lock, Shield, User, Building2, AlertCircle } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'vendor' | 'admin';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glassmorphism">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-500" />
                </div>
                <CardTitle className="text-2xl">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You need to be logged in to access this page.
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="gradient-maroon"
                >
                  Login or Register
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </>
    );
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const getRoleInfo = () => {
      switch (requiredRole) {
        case 'admin':
          return {
            icon: Shield,
            title: 'Admin Access Required',
            description: 'This page is only accessible to administrators.',
            color: 'text-red-500',
            bgColor: 'bg-red-50'
          };
        case 'vendor':
          return {
            icon: Building2,
            title: 'Vendor Access Required',
            description: 'This page is only accessible to verified vendors.',
            color: 'text-green-500',
            bgColor: 'bg-green-50'
          };
        case 'user':
          return {
            icon: User,
            title: 'User Access Required',
            description: 'This page is only accessible to registered users.',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
          };
        default:
          return {
            icon: AlertCircle,
            title: 'Access Denied',
            description: 'You do not have permission to access this page.',
            color: 'text-gray-500',
            bgColor: 'bg-gray-50'
          };
      }
    };

    const roleInfo = getRoleInfo();
    const RoleIcon = roleInfo.icon;

    return (
      <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glassmorphism">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 ${roleInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <RoleIcon className={`w-8 h-8 ${roleInfo.color}`} />
              </div>
              <CardTitle className="text-2xl">{roleInfo.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {roleInfo.description}
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your current role:</p>
                <div className="flex items-center justify-center gap-2">
                  {user?.role === 'admin' && <Shield className="w-4 h-4 text-red-500" />}
                  {user?.role === 'vendor' && <Building2 className="w-4 h-4 text-green-500" />}
                  {user?.role === 'user' && <User className="w-4 h-4 text-blue-500" />}
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
              </div>
              {requiredRole === 'vendor' && user?.role === 'user' && (
                <Button 
                  onClick={() => {
                    // This would typically redirect to vendor registration
                    window.location.href = '#vendor';
                  }}
                  className="gradient-maroon"
                >
                  Become a Vendor
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
}

// Convenience components for different role requirements
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function VendorOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="vendor">
      {children}
    </ProtectedRoute>
  );
}

export function UserOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}




