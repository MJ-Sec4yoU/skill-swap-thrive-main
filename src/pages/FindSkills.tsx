import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  BookOpen, 
  User,
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Award
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Skill {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  tags: string[];
  offeredBy: {
    _id: string;
    name: string;
    profile?: {
      avatar?: string;
      location?: string;
      bio?: string;
    };
  };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
    location?: string;
    bio?: string;
    profileCompletion?: number;
  };
  skillsTeaching?: Array<{
    skill: string;
    level: string;
    experience?: number;
  }>;
  ratings?: {
    average: number;
    count: number;
  };
}

const FindSkills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    location: ''
  });

  const loadSkills = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.level && filters.level !== 'all') params.level = filters.level;
      
      const result = await apiService.getSkills(params);
      
      if (result.data && typeof result.data === 'object' && 'skills' in result.data) {
        const skillsData = (result.data as any).skills || [];
        setSkills(skillsData);
      } else {
        setSkills([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive"
      });
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const result = await apiService.getUsers(20);
      if (result.data && typeof result.data === 'object' && 'users' in result.data) {
        setTeachers((result.data as { users: User[] }).users || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (teacherId: string) => {
    navigate('/messages', { state: { recipientId: teacherId } });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSkillsByCategory = () => {
    const categories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    return categories;
  };

  useEffect(() => {
    if (activeTab === 'skills') {
      loadSkills();
    } else {
      loadTeachers();
    }
  }, [activeTab, filters]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'skills') {
        loadSkills();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Skills & Teachers</h1>
          <p className="text-muted-foreground">
            Find the perfect skill to learn or connect with experienced teachers
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills or teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Skills ({skills.length})
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teachers ({teachers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(getSkillsByCategory()).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {category} ({categorySkills.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <Card key={skill._id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{skill.name}</CardTitle>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">{skill.level}</Badge>
                                  <Badge variant="secondary">{skill.category}</Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              {skill.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(skill.offeredBy.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{skill.offeredBy.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {skill.offeredBy.profile?.location || 'Location not specified'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => sendMessage(skill.offeredBy._id)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                              <Button size="sm" variant="outline">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
                
                {skills.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No skills found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <Card key={teacher._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {teacher.profile?.location || 'Location not specified'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {teacher.profile?.bio && (
                        <p className="text-sm text-muted-foreground">
                          {teacher.profile.bio.length > 100 
                            ? `${teacher.profile.bio.substring(0, 100)}...` 
                            : teacher.profile.bio}
                        </p>
                      )}
                      
                      {teacher.skillsTeaching && teacher.skillsTeaching.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Teaching Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.skillsTeaching.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {typeof skill === 'string' ? skill : skill.skill}
                              </Badge>
                            ))}
                            {teacher.skillsTeaching.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{teacher.skillsTeaching.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {teacher.ratings && teacher.ratings.count > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">
                            {teacher.ratings.average.toFixed(1)} ({teacher.ratings.count} reviews)
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => sendMessage(teacher._id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {teachers.length === 0 && !loading && (
                  <div className="text-center py-12 col-span-full">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No teachers found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FindSkills;