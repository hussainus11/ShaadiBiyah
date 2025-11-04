import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Mail, 
  RefreshCw,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VerificationStatus {
  verificationStatus: string;
  documentSignedAt: string | null;
  verificationNotes: string | null;
  latestDocument: {
    id: string;
    status: string;
    tokenExpiresAt: string;
  } | null;
}

interface VendorProfile {
  id: string;
  businessName: string;
  verificationStatus: string;
  documentSignedAt: string | null;
  verificationNotes: string | null;
}

export function VendorVerificationStatus({ vendorId }: { vendorId: string }) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, [vendorId]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/verification-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setVerificationStatus(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch verification status');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationDocument = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/vendors/${vendorId}/generate-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Verification document sent to your email!');
        fetchVerificationStatus(); // Refresh status
      } else {
        toast.error(data.error || 'Failed to generate verification document');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'DOCUMENT_SIGNED':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'DOCUMENT_SENT':
        return <Mail className="w-5 h-5 text-orange-500" />;
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'EXPIRED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DOCUMENT_SIGNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DOCUMENT_SENT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Your vendor account is pending verification. Please generate and sign the verification document.';
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading verification status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!verificationStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Failed to load verification status. Please try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Account Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(verificationStatus.verificationStatus)}
            <div>
              <h3 className="font-semibold">Verification Status</h3>
              <Badge className={getStatusColor(verificationStatus.verificationStatus)}>
                {verificationStatus.verificationStatus.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVerificationStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Status Message */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            {getStatusMessage(verificationStatus.verificationStatus)}
          </AlertDescription>
        </Alert>

        {/* Document Information */}
        {verificationStatus.latestDocument && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Latest Document
            </h4>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant="outline" className="text-xs">
                  {verificationStatus.latestDocument.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expires:</span>
                <span className="text-muted-foreground">
                  {formatDate(verificationStatus.latestDocument.tokenExpiresAt)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Signed Date */}
        {verificationStatus.documentSignedAt && (
          <div className="space-y-2">
            <h4 className="font-medium">Document Signed</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(verificationStatus.documentSignedAt)}
            </p>
          </div>
        )}

        {/* Verification Notes */}
        {verificationStatus.verificationNotes && (
          <div className="space-y-2">
            <h4 className="font-medium">Review Notes</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{verificationStatus.verificationNotes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {(verificationStatus.verificationStatus === 'PENDING' || 
            verificationStatus.verificationStatus === 'EXPIRED') && (
            <Button
              onClick={generateVerificationDocument}
              disabled={generating}
              className="gradient-maroon"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Verification Document
                </>
              )}
            </Button>
          )}

          {verificationStatus.verificationStatus === 'DOCUMENT_SENT' && (
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

          {verificationStatus.verificationStatus === 'REJECTED' && (
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
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Verification documents are sent to your registered email address</p>
          <p>• Links expire after 7 days for security reasons</p>
          <p>• Our team reviews signed documents within 24-48 hours</p>
          <p>• Contact support if you need assistance with verification</p>
        </div>
      </CardContent>
    </Card>
  );
}
