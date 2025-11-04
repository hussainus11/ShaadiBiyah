import { useState } from 'react';
import { Star, ThumbsUp, Filter, Search, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

const reviews = [
  {
    id: 1,
    vendorName: 'Royal Palace Banquet',
    reviewerName: 'Amit & Priya',
    rating: 5,
    date: '2024-10-01',
    review: 'Absolutely stunning venue! The staff was incredibly helpful and the food was amazing. Our guests are still talking about how beautiful everything was.',
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop'],
    helpful: 45,
    verified: true,
  },
  {
    id: 2,
    vendorName: 'Rahul Photography',
    reviewerName: 'Neha Sharma',
    rating: 5,
    date: '2024-09-15',
    review: 'Rahul captured every moment perfectly! His candid shots are breathtaking. Professional, creative, and very friendly. Highly recommend!',
    images: [],
    helpful: 32,
    verified: true,
  },
  {
    id: 3,
    vendorName: 'Spice Garden Catering',
    reviewerName: 'Ravi Kumar',
    rating: 4,
    date: '2024-09-01',
    review: 'Great food quality and variety. The presentation was excellent. Only minor issue was timing on some dishes, but overall fantastic service.',
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop'],
    helpful: 28,
    verified: true,
  },
  {
    id: 4,
    vendorName: 'Glam Studio',
    reviewerName: 'Anjali Patel',
    rating: 5,
    date: '2024-08-20',
    review: 'The makeup artist made me look and feel like a princess! She understood exactly what I wanted and the makeup lasted all day and night.',
    images: [],
    helpful: 51,
    verified: true,
  },
];

const ratingDistribution = [
  { stars: 5, count: 156, percentage: 78 },
  { stars: 4, count: 32, percentage: 16 },
  { stars: 3, count: 8, percentage: 4 },
  { stars: 2, count: 3, percentage: 1.5 },
  { stars: 1, count: 1, percentage: 0.5 },
];

export function VendorReviews() {
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    vendor: '',
    rating: 5,
    title: '',
    review: '',
  });

  const averageRating = 4.7;
  const totalReviews = 200;

  const handleSubmitReview = () => {
    if (!newReview.vendor || !newReview.review) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Review submitted successfully!');
    setIsWritingReview(false);
    setNewReview({ vendor: '', rating: 5, title: '', review: '' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesVendor = selectedVendor === 'all' || review.vendorName === selectedVendor;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesSearch = review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVendor && matchesRating && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Vendor Reviews & Ratings</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read authentic reviews from real couples and share your experience
          </p>
        </div>

        {/* Overall Rating */}
        <Card className="glassmorphism mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-6xl mb-2">{averageRating}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>
                <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
                  <DialogTrigger asChild>
                    <Button className="gradient-maroon">Write a Review</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Write Your Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Select Vendor *</Label>
                        <Select
                          value={newReview.vendor}
                          onValueChange={(value) => setNewReview({ ...newReview, vendor: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Royal Palace Banquet">Royal Palace Banquet</SelectItem>
                            <SelectItem value="Rahul Photography">Rahul Photography</SelectItem>
                            <SelectItem value="Spice Garden Catering">Spice Garden Catering</SelectItem>
                            <SelectItem value="Glam Studio">Glam Studio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                            >
                              <Star
                                className={`w-8 h-8 cursor-pointer transition-all ${
                                  i < newReview.rating
                                    ? 'fill-accent text-accent'
                                    : 'text-muted-foreground hover:text-accent'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Review Title</Label>
                        <Input
                          id="title"
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                          placeholder="Sum up your experience"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="review">Your Review *</Label>
                        <Textarea
                          id="review"
                          value={newReview.review}
                          onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                          placeholder="Share details of your experience..."
                          rows={5}
                        />
                      </div>

                      <Button className="w-full gradient-maroon" onClick={handleSubmitReview}>
                        Submit Review
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm">{dist.stars}</span>
                      <Star className="w-4 h-4 fill-accent text-accent" />
                    </div>
                    <Progress value={dist.percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {dist.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="glassmorphism mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Reviews</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    className="pl-10"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorFilter">Filter by Vendor</Label>
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="Royal Palace Banquet">Royal Palace Banquet</SelectItem>
                    <SelectItem value="Rahul Photography">Rahul Photography</SelectItem>
                    <SelectItem value="Spice Garden Catering">Spice Garden Catering</SelectItem>
                    <SelectItem value="Glam Studio">Glam Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingFilter">Filter by Rating</Label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="glassmorphism hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.reviewerName}`} />
                      <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{review.reviewerName}</h4>
                        {review.verified && (
                          <Badge className="bg-green-600 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {review.date} • {review.vendorName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="text-sm mb-4">{review.review}</p>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Review"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm">
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
