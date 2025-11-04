import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VerificationStatus {
  verificationStatus: string;
  documentSignedAt: string | null;
  verificationNotes: string | null;
}

interface VendorProfile {
  id: string;
  businessName: string;
  verificationStatus: string;
  isVerified: boolean;
}

export function VendorVerificationGate({ children, vendorId }: { 
  children: React.ReactNode; 
  vendorId: string;
}) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);

  useEffect(() => {
    fetchVendorProfile();
  }, [vendorId]);

  const fetchVendorProfile = async () => {
    try {
      const response = await fetch(`/api/vendors/profile/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setVendor(data.data);
        setVerificationStatus({
          verificationStatus: data.data.verificationStatus,
          documentSignedAt: data.data.documentSignedAt,
          verificationNotes: data.data.verificationNotes
        });
      } else {
        toast.error(data.error || 'Failed to fetch vendor profile');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'DOCUMENT_SIGNED':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'DOCUMENT_SENT':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'REJECTED':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'EXPIRED':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Lock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Your vendor account is pending verification. Please complete the verification process to access all features.';
      case 'DOCUMENT_SENT':
        return 'Verification document has been sent to your email. Please check your inbox and sign the document.';
      case 'DOCUMENT_SIGNED':
        return 'Document signed successfully! Your account is under review by our team.';
      case 'VERIFIED':
        return 'Congratulations! Your vendor account is verified and active.';
      case 'REJECTED':
        return 'Your verification was rejected. Please review the feedback and contact support if needed.';
      case 'EXPIRED':
        return 'Your verification link has expired. Please generate a new verification document.';
      default:
        return 'Unknown verification status.';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading verification status...</p>
        </div>
      </div>
    );
  }

  // If vendor is verified, show the children
  if (vendor?.verificationStatus === 'VERIFIED') {
    return <>{children}</>;
  }

  // Show verification gate for unverified vendors
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              {getStatusIcon(verificationStatus?.verificationStatus || 'PENDING')}
            </div>
            <CardTitle className="text-2xl">Account Verification Required</CardTitle>
            <p className="text-muted-foreground">
              Complete verification to access your vendor dashboard
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Alert */}
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {getStatusMessage(verificationStatus?.verificationStatus || 'PENDING')}
              </AlertDescription>
            </Alert>

            {/* Verification Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold">Verification Process:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    verificationStatus?.verificationStatus === 'PENDING' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    1
                  </div>
                  <span className={verificationStatus?.verificationStatus === 'PENDING' ? 'font-medium' : 'text-muted-foreground'}>
                    Generate verification document
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    ['DOCUMENT_SENT', 'DOCUMENT_SIGNED', 'VERIFIED'].includes(verificationStatus?.verificationStatus || '') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    2
                  </div>
                  <span className={['DOCUMENT_SENT', 'DOCUMENT_SIGNED', 'VERIFIED'].includes(verificationStatus?.verificationStatus || '') ? 'font-medium' : 'text-muted-foreground'}>
                    Sign the document online
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    ['DOCUMENT_SIGNED', 'VERIFIED'].includes(verificationStatus?.verificationStatus || '') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    3
                  </div>
                  <span className={['DOCUMENT_SIGNED', 'VERIFIED'].includes(verificationStatus?.verificationStatus || '') ? 'font-medium' : 'text-muted-foreground'}>
                    Wait for admin review
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    verificationStatus?.verificationStatus === 'VERIFIED' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    4
                  </div>
                  <span className={verificationStatus?.verificationStatus === 'VERIFIED' ? 'font-medium' : 'text-muted-foreground'}>
                    Access full dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              {(verificationStatus?.verificationStatus === 'PENDING' || 
                verificationStatus?.verificationStatus === 'EXPIRED') && (
                <Button
                  onClick={() => {
                    // Navigate to verification page or trigger verification
                    window.location.href = '/vendor/verification';
                  }}
                  className="gradient-maroon"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Start Verification
                </Button>
              )}

              {verificationStatus?.verificationStatus === 'DOCUMENT_SENT' && (
                <Button
                  onClick={() => {
                    toast.info('Please check your email for the verification link');
                  }}
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Check Email
                </Button>
              )}

              {verificationStatus?.verificationStatus === 'REJECTED' && (
                <Button
                  onClick={() => {
                    // Navigate to support or contact form
                    toast.info('Please contact support for assistance');
                  }}
                  variant="outline"
                >
                  Contact Support
                </Button>
              )}
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help with verification? Contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
