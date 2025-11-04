import { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Calendar, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface DailyForecast {
  date: string;
  day: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export function WeatherForecast() {
  const [weddingDate, setWeddingDate] = useState('2025-12-15');
  const [location, setLocation] = useState('Delhi');

  const currentWeather = {
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 60,
    windSpeed: 15,
    visibility: 10,
    uvIndex: 5,
  };

  const dailyForecast: DailyForecast[] = [
    {
      date: '2025-12-10',
      day: 'Monday',
      temp: 26,
      condition: 'Sunny',
      icon: '☀️',
      humidity: 55,
      windSpeed: 12,
      rainChance: 10,
    },
    {
      date: '2025-12-11',
      day: 'Tuesday',
      temp: 27,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 58,
      windSpeed: 14,
      rainChance: 15,
    },
    {
      date: '2025-12-12',
      day: 'Wednesday',
      temp: 25,
      condition: 'Cloudy',
      icon: '☁️',
      humidity: 65,
      windSpeed: 18,
      rainChance: 30,
    },
    {
      date: '2025-12-13',
      day: 'Thursday',
      temp: 24,
      condition: 'Light Rain',
      icon: '🌧️',
      humidity: 75,
      windSpeed: 20,
      rainChance: 60,
    },
    {
      date: '2025-12-14',
      day: 'Friday',
      temp: 26,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 60,
      windSpeed: 15,
      rainChance: 20,
    },
    {
      date: '2025-12-15',
      day: 'Saturday',
      temp: 28,
      condition: 'Sunny',
      icon: '☀️',
      humidity: 55,
      windSpeed: 12,
      rainChance: 5,
    },
    {
      date: '2025-12-16',
      day: 'Sunday',
      temp: 29,
      condition: 'Clear Sky',
      icon: '🌤️',
      humidity: 50,
      windSpeed: 10,
      rainChance: 0,
    },
  ];

  const hourlyForecast: HourlyForecast[] = [
    { time: '06:00 AM', temp: 22, condition: 'Clear', icon: '🌤️' },
    { time: '09:00 AM', temp: 25, condition: 'Sunny', icon: '☀️' },
    { time: '12:00 PM', temp: 28, condition: 'Sunny', icon: '☀️' },
    { time: '03:00 PM', temp: 29, condition: 'Partly Cloudy', icon: '⛅' },
    { time: '06:00 PM', temp: 26, condition: 'Cloudy', icon: '☁️' },
    { time: '09:00 PM', temp: 24, condition: 'Clear', icon: '🌙' },
  ];

  const handleRefreshForecast = () => {
    toast.success('Weather forecast updated!');
  };

  const handleSetReminder = () => {
    toast.success('Weather alert reminder set for your wedding date!');
  };

  const getWeatherAdvice = (forecast: DailyForecast) => {
    if (forecast.rainChance > 50) {
      return { text: 'Have backup plan ready', color: 'text-red-600', icon: AlertTriangle };
    } else if (forecast.rainChance > 30) {
      return { text: 'Monitor weather closely', color: 'text-yellow-600', icon: Cloud };
    } else {
      return { text: 'Perfect weather expected', color: 'text-green-600', icon: Sun };
    }
  };

  const weddingDayForecast = dailyForecast.find(f => f.date === weddingDate);
  const advice = weddingDayForecast ? getWeatherAdvice(weddingDayForecast) : null;
  const AdviceIcon = advice?.icon || Sun;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-8 h-8 text-primary" />
            <h1>Wedding Day Weather Forecast</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan better with accurate weather forecasts for your wedding date
          </p>
        </div>

        {/* Location & Date Selector */}
        <Card className="glassmorphism mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="location">Wedding Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Wedding Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>
              <Button className="gradient-maroon" onClick={handleRefreshForecast}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Update Forecast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wedding Day Forecast Highlight */}
        {weddingDayForecast && (
          <Card className="glassmorphism mb-8 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Your Wedding Day - {weddingDayForecast.day}, {new Date(weddingDayForecast.date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-4">{weddingDayForecast.icon}</div>
                    <h2 className="mb-2">{weddingDayForecast.temp}°C</h2>
                    <p className="text-muted-foreground">{weddingDayForecast.condition}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-primary" />
                      <span>Humidity</span>
                    </div>
                    <span>{weddingDayForecast.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-primary" />
                      <span>Wind Speed</span>
                    </div>
                    <span>{weddingDayForecast.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-5 h-5 text-primary" />
                      <span>Rain Chance</span>
                    </div>
                    <span>{weddingDayForecast.rainChance}%</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <Card className={`${
                    weddingDayForecast.rainChance > 50 
                      ? 'bg-red-50 border-red-200' 
                      : weddingDayForecast.rainChance > 30 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <CardContent className="p-6 text-center">
                      {advice && (
                        <>
                          <AdviceIcon className={`w-12 h-12 mx-auto mb-3 ${advice.color}`} />
                          <h4 className={`mb-2 ${advice.color}`}>Weather Advisory</h4>
                          <p className="text-sm text-muted-foreground">{advice.text}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Button className="mt-4" variant="outline" onClick={handleSetReminder}>
                    Set Weather Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Different Views */}
        <Tabs defaultValue="daily" className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="daily">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <div className="grid md:grid-cols-7 gap-4">
              {dailyForecast.map((day) => {
                const isWeddingDay = day.date === weddingDate;
                return (
                  <Card 
                    key={day.date} 
                    className={`glassmorphism text-center ${
                      isWeddingDay ? 'border-2 border-primary shadow-lg' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      {isWeddingDay && (
                        <Badge className="mb-2 bg-primary">Wedding Day</Badge>
                      )}
                      <p className="text-sm mb-2">{day.day}</p>
                      <div className="text-4xl mb-2">{day.icon}</div>
                      <p className="text-2xl mb-1">{day.temp}°C</p>
                      <p className="text-xs text-muted-foreground mb-3">{day.condition}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rain</span>
                          <span>{day.rainChance}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Wind</span>
                          <span>{day.windSpeed} km/h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="mt-6">
            <Card className="glassmorphism">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-6 gap-4">
                  {hourlyForecast.map((hour, idx) => (
                    <div key={idx} className="text-center p-4 bg-secondary rounded-lg">
                      <p className="text-sm mb-2">{hour.time}</p>
                      <div className="text-3xl mb-2">{hour.icon}</div>
                      <p className="text-xl">{hour.temp}°C</p>
                      <p className="text-xs text-muted-foreground">{hour.condition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Weather Tips */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Weather Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Sun className="w-8 h-8 text-yellow-600 mb-3" />
                <h4 className="mb-2">Sunny Day Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide shade areas for guests</li>
                  <li>• Offer cold refreshments</li>
                  <li>• Consider sunscreen stations</li>
                  <li>• Schedule outdoor events in morning/evening</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <CloudRain className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="mb-2">Rainy Day Backup</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Have indoor backup venue ready</li>
                  <li>• Provide umbrellas for guests</li>
                  <li>• Waterproof decoration materials</li>
                  <li>• Have covered walkways</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <Wind className="w-8 h-8 text-teal-600 mb-3" />
                <h4 className="mb-2">Windy Conditions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Secure all decorations firmly</li>
                  <li>• Avoid lightweight materials</li>
                  <li>• Have hair styling backup plans</li>
                  <li>• Weight down table settings</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <Cloud className="w-8 h-8 text-gray-600 mb-3" />
                <h4 className="mb-2">Cloudy Weather</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Perfect for outdoor photography</li>
                  <li>• Natural light for photos</li>
                  <li>• Comfortable temperature for guests</li>
                  <li>• Monitor for sudden rain</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
