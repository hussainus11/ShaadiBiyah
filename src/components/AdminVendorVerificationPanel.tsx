import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VendorVerification {
  id: string;
  businessName: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  verificationStatus: string;
  documentSignedAt: string | null;
  verificationNotes: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  verificationDocuments: Array<{
    id: string;
    status: string;
    signedAt: string | null;
    documentTitle: string;
  }>;
}

export function AdminVendorVerificationPanel() {
  const [vendors, setVendors] = useState<VendorVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<VendorVerification | null>(null);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const response = await fetch('/api/admin/vendors/pending-verification', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setVendors(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch pending verifications');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (vendorId: string, action: 'APPROVE' | 'REJECT') => {
    setReviewing(vendorId);
    
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          notes: reviewNotes
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Vendor verification ${action.toLowerCase()}d successfully`);
        setReviewNotes('');
        setSelectedVendor(null);
        fetchPendingVerifications(); // Refresh the list
      } else {
        toast.error(data.error || `Failed to ${action.toLowerCase()} verification`);
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setReviewing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DOCUMENT_SIGNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Verification Review</h2>
          <p className="text-muted-foreground">
            Review and approve vendor verification documents
          </p>
        </div>
        <Button onClick={fetchPendingVerifications} variant="outline">
          Refresh
        </Button>
      </div>

      {vendors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Verifications</h3>
            <p className="text-muted-foreground">
              All vendor verifications have been reviewed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {vendor.user.firstName} {vendor.user.lastName}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(vendor.verificationStatus)}>
                    {vendor.verificationStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Vendor Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Category:</span> {vendor.category}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Registered:</span> {formatDate(vendor.createdAt)}
                    </div>
                    {vendor.documentSignedAt && (
                      <div className="text-sm">
                        <span className="font-medium">Document Signed:</span> {formatDate(vendor.documentSignedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Information */}
                {vendor.verificationDocuments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Verification Documents
                    </h4>
                    <div className="space-y-2">
                      {vendor.verificationDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{doc.documentTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              Status: {doc.status} • Signed: {formatDate(doc.signedAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                {vendor.verificationStatus === 'DOCUMENT_SIGNED' && (
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <Label htmlFor={`notes-${vendor.id}`}>Review Notes (Optional)</Label>
                      <Textarea
                        id={`notes-${vendor.id}`}
                        placeholder="Add any notes about the verification review..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={3}
                      />
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReview(vendor.id, 'APPROVE')}
                          disabled={reviewing === vendor.id}
                          className="gradient-maroon"
                        >
                          {reviewing === vendor.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => handleReview(vendor.id, 'REJECT')}
                          disabled={reviewing === vendor.id}
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Notes */}
                {vendor.verificationNotes && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Previous Review Notes</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{vendor.verificationNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
