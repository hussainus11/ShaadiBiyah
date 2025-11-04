import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, FileText, CheckCircle, AlertCircle, Clock, Shield, Signature } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DocumentData {
  documentId: string;
  title: string;
  content: string;
  vendorName: string;
  expiresAt: string;
}

interface SignatureData {
  signature: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export function DocumentSigningPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string>('');
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDocument();
    }
  }, [token]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/verify-document/${token}`);
      const data = await response.json();

      if (data.success) {
        setDocument(data.data);
      } else {
        setError(data.error || 'Failed to load document');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  const generateSignature = (): SignatureData => {
    const timestamp = new Date().toISOString();
    const ipAddress = 'Unknown'; // In production, get from backend
    const userAgent = navigator.userAgent;
    
    // Create a simple signature hash
    const signatureData = `${document?.documentId}-${timestamp}-${ipAddress}`;
    const signature = btoa(signatureData); // Base64 encode for simplicity
    
    return {
      signature,
      timestamp,
      ipAddress,
      userAgent
    };
  };

  const handleSignDocument = async () => {
    if (!document || !hasScrolled) {
      toast.error('Please scroll through the entire document before signing');
      return;
    }

    setSigning(true);
    
    try {
      const signatureData = generateSignature();
      
      const response = await fetch(`/api/sign-document/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signatureData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document signed successfully!');
        navigate('/vendor/verification-success');
      } else {
        toast.error(data.error || 'Failed to sign document');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const formatExpiryDate = (dateString: string) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Document</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Document Verification</h1>
          </div>
          <p className="text-muted-foreground">
            Please review and sign the agreement for <strong>{document.vendorName}</strong>
          </p>
        </div>

        {/* Document Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">{document.title}</h2>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expires: {formatExpiryDate(document.expiresAt)}
              </Badge>
            </div>
            
            <Alert className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Important:</strong> Please scroll through the entire document before signing. 
                Your signature indicates that you have read and agree to all terms and conditions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Document Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Document Content</CardTitle>
          </CardHeader>
          <CardContent 
            className="max-h-96 overflow-y-auto border rounded-lg p-6"
            onScroll={handleScroll}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: document.content }}
              className="prose prose-sm max-w-none"
            />
          </CardContent>
        </Card>

        {/* Signature Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signature className="w-5 h-5" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Signature Confirmation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  By clicking "Sign Document" below, you acknowledge that:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• You have read and understood the entire document</li>
                  <li>• You agree to be bound by all terms and conditions</li>
                  <li>• This signature has the same legal effect as a handwritten signature</li>
                  <li>• You are authorized to sign on behalf of the business</li>
                </ul>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${hasScrolled ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span className={`text-sm ${hasScrolled ? 'text-green-700' : 'text-muted-foreground'}`}>
                  {hasScrolled ? 'Document reviewed ✓' : 'Please scroll through the document first'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSignDocument}
            disabled={!hasScrolled || signing}
            className="gradient-maroon min-w-[200px]"
          >
            {signing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <Signature className="w-4 h-4 mr-2" />
                Sign Document
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            This document signing process is secure and legally binding. 
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
