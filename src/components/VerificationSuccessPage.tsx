import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react';

export function VerificationSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4 text-green-700">
            Document Signed Successfully!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for completing the verification process. Your vendor agreement has been signed and submitted for review.
          </p>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Review Process</h3>
                <p className="text-sm text-muted-foreground">
                  Our team will review your signed agreement within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Email Notification</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email once your account is approved or if additional information is needed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Account Activation</h3>
                <p className="text-sm text-muted-foreground">
                  Once approved, you can access your vendor dashboard and start accepting bookings
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/vendor/dashboard')}
              className="gradient-maroon"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about the verification process or need assistance, 
              please don't hesitate to contact our support team. We're here to help!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
