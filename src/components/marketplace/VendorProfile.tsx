import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  DollarSign,
  Users,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  Clock,
  Award,
  Shield,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  totalReviews: number;
  basePrice?: number;
  profileImage?: string;
  gallery: string[];
  isVerified: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    images?: string[];
  }>;
  availability: {
    isAvailable: boolean;
    nextAvailableDate?: string;
  };
  experience: number;
  awards: string[];
  insurance: boolean;
  portfolio: Array<{
    title: string;
    images: string[];
    description: string;
  }>;
}

interface VendorProfileProps {
  vendorId: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function VendorProfile({ vendorId, onNavigate, onBack }: VendorProfileProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleBookVendor = () => {
    // Navigate to booking page
    if (onNavigate) {
      onNavigate('booking');
    }
  };

  const handleContactVendor = () => {
    // Open chat with vendor
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // API call to toggle favorite
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor?.businessName,
        text: `Check out ${vendor?.businessName} on ShaadiBiyah`,
        url: window.location.href,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    // Fetch vendor details from API
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/vendors/${vendorId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setVendor(data.data);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Vendor Not Found</h2>
        <p className="text-muted-foreground mb-6">The vendor you're looking for doesn't exist.</p>
        {onBack && (
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>
      )}

      {/* Header */}
      <Card className="glassmorphism mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Vendor Image */}
            <div className="relative w-full lg:w-80 h-64 lg:h-80 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={vendor.profileImage || vendor.gallery[0]}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" onClick={handleToggleFavorite}>
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="icon" variant="secondary" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{vendor.businessName}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{vendor.category}</Badge>
                    {vendor.isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-lg">{vendor.description}</p>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{vendor.location}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(vendor.rating)}
                </div>
                <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({vendor.totalReviews} reviews)
                </span>
              </div>

              {vendor.basePrice && (
                <div className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">From ${vendor.basePrice}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{vendor.experience} years experience</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{vendor.totalReviews} clients served</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="gradient-pink text-primary flex-1"
                  onClick={handleBookVendor}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleContactVendor}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vendor.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${service.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {vendor.portfolio.map((project, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="aspect-square rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={image}
                            alt={`${project.title} ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vendor.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <div className="grid gap-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>{vendor.user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>{vendor.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{vendor.experience} years in business</span>
                </div>
                {vendor.insurance && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Insured & Bonded</span>
                  </div>
                )}
                {vendor.awards.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Awards & Recognition</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      {vendor.awards.map((award, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
