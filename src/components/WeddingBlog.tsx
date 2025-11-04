import { useState } from 'react';
import { Calendar, User, Tag, TrendingUp, BookOpen, Heart, Share2, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  trending: boolean;
}

export function WeddingBlog() {
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: '2025 Wedding Color Trends: Pastels to Jewel Tones',
      excerpt: 'Discover the hottest color palettes for weddings in 2025. From soft pastels to bold jewel tones, find the perfect scheme for your big day.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
      category: 'Trends',
      author: 'Priya Sharma',
      date: '2024-10-15',
      readTime: '5 min read',
      likes: 234,
      trending: true,
    },
    {
      id: 2,
      title: 'Ultimate Wedding Planning Checklist: 12 Months Timeline',
      excerpt: 'A comprehensive month-by-month guide to planning your perfect wedding. Never miss a detail with our complete checklist.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
      category: 'Planning',
      author: 'Rahul Verma',
      date: '2024-10-10',
      readTime: '8 min read',
      likes: 456,
      trending: true,
    },
    {
      id: 3,
      title: 'Budget-Friendly Decoration Ideas Under Rs.50,000',
      excerpt: 'Create stunning wedding decor without breaking the bank. Expert tips for beautiful decorations on a budget.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      category: 'Decor',
      author: 'Anjali Patel',
      date: '2024-10-05',
      readTime: '6 min read',
      likes: 189,
      trending: false,
    },
    {
      id: 4,
      title: 'Traditional Meets Modern: Fusion Wedding Inspiration',
      excerpt: 'Blend traditional Indian customs with contemporary style. Get inspired by these beautiful fusion wedding ideas.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c740?w=800&h=600&fit=crop',
      category: 'Inspiration',
      author: 'Neha Kapoor',
      date: '2024-09-28',
      readTime: '7 min read',
      likes: 312,
      trending: true,
    },
    {
      id: 5,
      title: 'Bridal Makeup Trends 2025: Natural Glam to Bold Statement',
      excerpt: 'From dewy natural looks to bold dramatic makeup, explore the latest bridal beauty trends for the modern bride.',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
      category: 'Beauty',
      author: 'Sana Khan',
      date: '2024-09-20',
      readTime: '5 min read',
      likes: 278,
      trending: false,
    },
    {
      id: 6,
      title: 'Destination Weddings in India: Top 10 Venues',
      excerpt: 'Planning a destination wedding? Explore the most stunning wedding venues across India, from palaces to beaches.',
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop',
      category: 'Venues',
      author: 'Vikram Singh',
      date: '2024-09-15',
      readTime: '10 min read',
      likes: 567,
      trending: true,
    },
  ];

  const categories = ['All', 'Trends', 'Planning', 'Decor', 'Inspiration', 'Beauty', 'Venues'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSavePost = (postId: number) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
      toast.success('Removed from saved posts');
    } else {
      setSavedPosts([...savedPosts, postId]);
      toast.success('Post saved!');
    }
  };

  const handleShare = (post: BlogPost) => {
    toast.success('Link copied to clipboard!');
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingPosts = blogPosts.filter(post => post.trending).slice(0, 3);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Blog & Trends</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert advice, latest trends, and inspiration for your perfect wedding
          </p>
        </div>

        {/* Featured Article */}
        <Card className="glassmorphism mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-auto">
              <ImageWithFallback
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 gradient-gold">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary">{blogPosts[0].category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(blogPosts[0].date).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <h2 className="mb-4">{blogPosts[0].title}</h2>
              <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-4">
                <Button className="gradient-maroon">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{blogPosts[0].likes}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full justify-start overflow-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Blog Posts Grid */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="glassmorphism hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative h-48 md:h-auto">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                        {post.trending && (
                          <Badge className="absolute top-4 left-4 bg-primary">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>

                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSavePost(post.id)}
                            >
                              <Bookmark
                                className={`w-5 h-5 ${
                                  savedPosts.includes(post.id)
                                    ? 'fill-primary text-primary'
                                    : ''
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(post)}
                            >
                              <Share2 className="w-5 h-5" />
                            </Button>
                            <Button className="gradient-maroon" size="sm">
                              Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Posts */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingPosts.map((post, idx) => (
                  <div key={post.id} className="flex gap-3">
                    <div className="text-2xl text-primary/50 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm mb-1 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      className="w-full text-left p-2 rounded-lg hover:bg-secondary transition-colors"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <Badge variant="secondary">
                          {blogPosts.filter(p => p.category === category).length}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get weekly wedding tips and trends delivered to your inbox
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email" type="email" />
                  <Button className="w-full gradient-maroon">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
