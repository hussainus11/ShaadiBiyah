import { useState } from 'react';
import { Music, Play, Pause, Plus, Trash2, Move, Clock, ListMusic, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  category: 'Sangeet' | 'Ceremony' | 'Reception' | 'Mehndi' | 'Cocktail';
  mood?: string;
}

const defaultPlaylists = {
  sangeet: [
    { id: 1, title: 'Mehndi Laga Ke Rakhna', artist: 'Udit Narayan', duration: '4:35', category: 'Sangeet' as const, mood: 'Romantic' },
    { id: 2, title: 'London Thumakda', artist: 'Neha Kakkar', duration: '3:45', category: 'Sangeet' as const, mood: 'Dance' },
    { id: 3, title: 'Gallan Goodiyaan', artist: 'Yashita Sharma', duration: '4:12', category: 'Sangeet' as const, mood: 'Celebration' },
  ],
  ceremony: [
    { id: 4, title: 'Dum Dum', artist: 'Shreya Ghoshal', duration: '5:20', category: 'Ceremony' as const, mood: 'Traditional' },
    { id: 5, title: 'Piya Tose Naina', artist: 'Shaan', duration: '6:10', category: 'Ceremony' as const, mood: 'Classical' },
  ],
  reception: [
    { id: 6, title: 'Kala Chashma', artist: 'Amar Arshi', duration: '3:28', category: 'Reception' as const, mood: 'Party' },
    { id: 7, title: 'Bom Diggy', artist: 'Zack Knight', duration: '3:15', category: 'Reception' as const, mood: 'Dance' },
    { id: 8, title: 'High Rated Gabru', artist: 'Guru Randhawa', duration: '3:42', category: 'Reception' as const, mood: 'Energetic' },
  ],
  mehndi: [
    { id: 9, title: 'Mehendi Hai Rachne Waali', artist: 'Lata Mangeshkar', duration: '4:50', category: 'Mehndi' as const, mood: 'Traditional' },
    { id: 10, title: 'Nachde Ne Saare', artist: 'Jasleen Royal', duration: '3:55', category: 'Mehndi' as const, mood: 'Folk' },
  ],
  cocktail: [
    { id: 11, title: 'Desi Girl', artist: 'Shankar Mahadevan', duration: '4:18', category: 'Cocktail' as const, mood: 'Upbeat' },
    { id: 12, title: 'Badtameez Dil', artist: 'Benny Dayal', duration: '3:52', category: 'Cocktail' as const, mood: 'Fun' },
  ],
};

export function MusicPlaylist() {
  const [playlists, setPlaylists] = useState(defaultPlaylists);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Song['category']>('Sangeet');
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    duration: '',
    mood: '',
  });

  const getAllSongs = () => {
    return [
      ...playlists.sangeet,
      ...playlists.ceremony,
      ...playlists.reception,
      ...playlists.mehndi,
      ...playlists.cocktail,
    ];
  };

  const totalDuration = getAllSongs().reduce((sum, song) => {
    const [min, sec] = song.duration.split(':').map(Number);
    return sum + min * 60 + sec;
  }, 0);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.duration) {
      const song: Song = {
        id: Date.now(),
        title: newSong.title,
        artist: newSong.artist,
        duration: newSong.duration,
        category: selectedCategory,
        mood: newSong.mood,
      };

      const categoryKey = selectedCategory.toLowerCase() as keyof typeof playlists;
      setPlaylists({
        ...playlists,
        [categoryKey]: [...playlists[categoryKey], song],
      });

      setNewSong({ title: '', artist: '', duration: '', mood: '' });
      setShowAddDialog(false);
      toast.success('Song added to playlist!');
    }
  };

  const removeSong = (id: number, category: string) => {
    const categoryKey = category.toLowerCase() as keyof typeof playlists;
    setPlaylists({
      ...playlists,
      [categoryKey]: playlists[categoryKey].filter(song => song.id !== id),
    });
    toast.success('Song removed from playlist');
  };

  const SongList = ({ songs, category }: { songs: Song[]; category: string }) => (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <Card key={song.id} className="hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-8 h-8 gradient-pink rounded-full flex items-center justify-center text-primary">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="mb-1">{song.title}</p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            {song.mood && (
              <Badge variant="outline" className="text-xs">
                {song.mood}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {song.duration}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSong(song.id, category)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Music Playlists</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create perfect playlists for each wedding event
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <ListMusic className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Songs</p>
              <p className="text-2xl text-primary">{getAllSongs().length}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Duration</p>
              <p className="text-2xl text-primary">{formatTotalDuration(totalDuration)}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center mx-auto mb-3">
                <Music className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Events</p>
              <p className="text-2xl text-primary">5</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Favorites</p>
              <p className="text-2xl text-primary">12</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Button className="gradient-maroon" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Song
          </Button>
        </div>

        {/* Playlists */}
        <Tabs defaultValue="sangeet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="sangeet">
              Sangeet ({playlists.sangeet.length})
            </TabsTrigger>
            <TabsTrigger value="ceremony">
              Ceremony ({playlists.ceremony.length})
            </TabsTrigger>
            <TabsTrigger value="reception">
              Reception ({playlists.reception.length})
            </TabsTrigger>
            <TabsTrigger value="mehndi">
              Mehndi ({playlists.mehndi.length})
            </TabsTrigger>
            <TabsTrigger value="cocktail">
              Cocktail ({playlists.cocktail.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sangeet">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Sangeet Night Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongList songs={playlists.sangeet} category="Sangeet" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ceremony">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Wedding Ceremony Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongList songs={playlists.ceremony} category="Ceremony" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reception">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Reception Party Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongList songs={playlists.reception} category="Reception" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mehndi">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Mehndi Celebration Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongList songs={playlists.mehndi} category="Mehndi" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cocktail">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Cocktail Party Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongList songs={playlists.cocktail} category="Cocktail" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Song Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Song to Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="songTitle">Song Title</Label>
                <Input
                  id="songTitle"
                  value={newSong.title}
                  onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                  placeholder="Enter song name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                  placeholder="Enter artist name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newSong.duration}
                    onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
                    placeholder="4:35"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Input
                    id="mood"
                    value={newSong.mood}
                    onChange={(e) => setNewSong({...newSong, mood: e.target.value})}
                    placeholder="e.g., Romantic"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Event Category</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-input-background"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Song['category'])}
                >
                  <option value="Sangeet">Sangeet</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Reception">Reception</option>
                  <option value="Mehndi">Mehndi</option>
                  <option value="Cocktail">Cocktail</option>
                </select>
              </div>

              <Button className="w-full gradient-maroon" onClick={handleAddSong}>
                <Plus className="w-4 h-4 mr-2" />
                Add Song
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
