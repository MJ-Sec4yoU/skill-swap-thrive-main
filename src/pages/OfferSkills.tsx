import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Upload, 
  Award, 
  Clock, 
  Users, 
  Star,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  MessageSquare,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const OfferSkills = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<string | undefined>(undefined);
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<string | undefined>(undefined);
  const [newSkillExperience, setNewSkillExperience] = useState("");
  const [newSkillAvailability, setNewSkillAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [viewingSkill, setViewingSkill] = useState<any | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Load user's skills
  const loadMySkills = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getMySkills();
      if (result.data && (result.data as any).skills) {
        setMySkills((result.data as any).skills);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error loading skills:', err);
      setError('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMySkills();
  }, [isAuthenticated]);
  
  const handleCreateSkill = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please login", description: "You must be logged in to add a skill.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!newSkillName.trim() || !newSkillCategory || !newSkillDescription.trim()) {
      toast({ title: "Missing fields", description: "Name, category, and description are required.", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const skillData: any = {
        name: newSkillName.trim(),
        category: newSkillCategory,
        description: newSkillDescription.trim(),
      };
      
      // Add optional fields if provided
      if (newSkillLevel) {
        skillData.level = newSkillLevel;
      }
      if (newSkillExperience && !isNaN(Number(newSkillExperience))) {
        skillData.yearsExperience = Number(newSkillExperience);
      }
      if (newSkillAvailability.trim()) {
        skillData.availabilityDescription = newSkillAvailability.trim();
      }
      
      const res = await apiService.createSkill(skillData);
      setSubmitting(false);
      if ((res as any).error) {
        toast({ title: "Failed to add skill", description: (res as any).error, variant: "destructive" });
        return;
      }
      toast({ title: "Skill added", description: "Your skill is now available for scheduling." });
      // Reset form and reload skills
      setNewSkillName("");
      setNewSkillCategory(undefined);
      setNewSkillDescription("");
      setNewSkillLevel(undefined);
      setNewSkillExperience("");
      setNewSkillAvailability("");
      setShowAddForm(false);
      await loadMySkills(); // Reload the skills list
    } catch (e) {
      setSubmitting(false);
      toast({ title: "Error", description: "Unexpected error adding skill.", variant: "destructive" });
    }
  };
  
  const handleDeleteSkill = async (skillId: string) => {
    console.log('Delete skill called with ID:', skillId);
    
    if (!skillId) {
      toast({ title: "Error", description: "Invalid skill ID", variant: "destructive" });
      return;
    }
    
    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      return;
    }
    
    try {
      console.log('Attempting to delete skill:', skillId);
      const res = await apiService.deleteSkill(skillId);
      console.log('Delete response:', res);
      
      if ((res as any).error) {
        console.error('Delete skill error:', (res as any).error);
        toast({ title: "Failed to delete skill", description: (res as any).error, variant: "destructive" });
        return;
      }
      
      toast({ title: "Skill deleted", description: "Your skill has been removed." });
      await loadMySkills(); // Reload the skills list
    } catch (e) {
      console.error('Delete skill exception:', e);
      toast({ title: "Error", description: "Unexpected error deleting skill.", variant: "destructive" });
    }
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setNewSkillName(skill.name);
    setNewSkillCategory(skill.category);
    setNewSkillDescription(skill.description || '');
    setNewSkillLevel(skill.level || undefined);
    setNewSkillExperience(skill.yearsExperience ? String(skill.yearsExperience) : "");
    setNewSkillAvailability(skill.availabilityDescription || "");
    setShowAddForm(true);
  };

  const handleViewSkill = (skill: any) => {
    setViewingSkill(skill);
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill || !newSkillName.trim() || !newSkillCategory || !newSkillDescription.trim()) {
      toast({ title: "Missing fields", description: "Name, category, and description are required.", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const skillData: any = {
        name: newSkillName.trim(),
        category: newSkillCategory,
        description: newSkillDescription.trim(),
      };
      
      // Add optional fields if provided
      if (newSkillLevel) {
        skillData.level = newSkillLevel;
      }
      if (newSkillExperience && !isNaN(Number(newSkillExperience))) {
        skillData.yearsExperience = Number(newSkillExperience);
      }
      if (newSkillAvailability.trim()) {
        skillData.availabilityDescription = newSkillAvailability.trim();
      }
      
      const res = await apiService.updateSkill(editingSkill._id || editingSkill.id, skillData);
      setSubmitting(false);
      if ((res as any).error) {
        toast({ title: "Failed to update skill", description: (res as any).error, variant: "destructive" });
        return;
      }
      toast({ title: "Skill updated", description: "Your skill has been updated successfully." });
      // Reset form and reload skills
      setNewSkillName("");
      setNewSkillCategory(undefined);
      setNewSkillDescription("");
      setNewSkillLevel(undefined);
      setNewSkillExperience("");
      setNewSkillAvailability("");
      setEditingSkill(null);
      setShowAddForm(false);
      await loadMySkills();
    } catch (e) {
      setSubmitting(false);
      toast({ title: "Error", description: "Unexpected error updating skill.", variant: "destructive" });
    }
  };
  // Must align with backend enum in backend/models/Skill.js
  const skillCategories = [
    "Technology", "Language", "Art", "Music", "Sports", "Cooking", "Other"
  ];

  const proficiencyLevels = [
    "Beginner", "Intermediate", "Advanced", "Expert"
  ];

  const analytics = {
    totalStudents: mySkills.length > 0 ? mySkills.reduce((sum, skill) => sum + (skill.studentsHelped || 0), 0) : 0,
    totalSessions: mySkills.length > 0 ? mySkills.reduce((sum, skill) => sum + (skill.totalSessions || 0), 0) : 0,
    averageRating: mySkills.length > 0 ? (mySkills.reduce((sum, skill) => sum + (skill.rating || 0), 0) / mySkills.length).toFixed(1) : "0.0",
    totalEarnings: mySkills.length > 0 ? mySkills.reduce((sum, skill) => sum + (skill.earnings || 0), 0) : 0
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Offer Your Skills</h1>
          <p className="text-muted-foreground">Share your expertise and help others learn while earning teaching credits</p>
        </div>

        <Tabs defaultValue="my-skills" className="space-y-8">
          <TabsList>
            <TabsTrigger value="my-skills">My Skills</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          {/* My Skills Tab */}
          <TabsContent value="my-skills" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{analytics.totalStudents}</h3>
                  <p className="text-sm text-muted-foreground">Students Helped</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{analytics.totalSessions}</h3>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{analytics.averageRating}</h3>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-2xl font-bold">{analytics.totalEarnings}</h3>
                  <p className="text-sm text-muted-foreground">Credits Earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Add New Skill Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Teaching Skills</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Skill
              </Button>
            </div>

            {/* Add Skill Form */}
            {showAddForm && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>{editingSkill ? 'Edit Skill' : 'Add a New Skill to Teach'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Skill Name</label>
                      <Input 
                        placeholder="e.g., React, Python, Guitar"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={newSkillCategory} onValueChange={(v) => setNewSkillCategory(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Proficiency Level</label>
                      <Select value={newSkillLevel} onValueChange={(v) => setNewSkillLevel(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 3" 
                        value={newSkillExperience}
                        onChange={(e) => setNewSkillExperience(e.target.value)}
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe what you can teach, your teaching style, and what students will learn..."
                      className="min-h-24"
                      value={newSkillDescription}
                      onChange={(e) => setNewSkillDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Portfolio/Certifications</label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload certificates, portfolio pieces, or work samples
                      </p>
                      <Button variant="outline" size="sm">Choose Files</Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Availability</label>
                    <Textarea 
                      placeholder="When are you available to teach? (e.g., Weekday evenings, Saturday mornings)"
                      className="min-h-16"
                      value={newSkillAvailability}
                      onChange={(e) => setNewSkillAvailability(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      disabled={submitting}
                      onClick={editingSkill ? handleUpdateSkill : handleCreateSkill}
                    >
                      {submitting ? (editingSkill ? "Updating..." : "Adding...") : (editingSkill ? "Update Skill" : "Add Skill")}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingSkill(null);
                        setNewSkillName("");
                        setNewSkillCategory(undefined);
                        setNewSkillDescription("");
                        setNewSkillLevel(undefined);
                        setNewSkillExperience("");
                        setNewSkillAvailability("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Skills List */}
            <div className="space-y-6">
              {loading && (
                <div className="text-center py-8">
                  <p>Loading your skills...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                </div>
              )}
              {!loading && !error && mySkills && mySkills.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No skills added yet. Click "Add New Skill" to get started!</p>
                </div>
              )}
              {!loading && !error && mySkills && mySkills.length > 0 && mySkills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{skill.name}</h3>
                          <Badge variant="secondary">{skill.category}</Badge>
                          <Badge 
                            className={skill.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {skill.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{skill.description}</p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Students:</span>
                            <span className="font-medium ml-1">{skill.studentsHelped || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center gap-1 ml-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="font-medium">{skill.rating || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium ml-1">{skill.yearsExperience || 0} years</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Requests:</span>
                            <span className="font-medium ml-1">{skill.requests || 0} pending</span>
                          </div>
                        </div>

                        {/* Portfolio */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Portfolio:</p>
                          <div className="flex flex-wrap gap-2">
                            {skill.portfolio && Array.isArray(skill.portfolio) && skill.portfolio.length > 0 ? (
                              skill.portfolio.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {typeof item === 'string' ? item : item.name || 'Portfolio Item'}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                No portfolio items
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{skill.availabilityDescription || skill.availability || 'Not specified'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSkill(skill)}
                          title="Edit skill"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSkill(skill)}
                          title="View skill details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const skillId = skill._id || skill.id;
                            console.log('Skill object:', skill);
                            console.log('Extracted skillId:', skillId);
                            handleDeleteSkill(skillId);
                          }}
                          title="Delete skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* View Skill Modal */}
            {viewingSkill && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{viewingSkill.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setViewingSkill(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Category: </span>
                      <Badge variant="secondary">{viewingSkill.category}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge className={viewingSkill.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {viewingSkill.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground mt-1">{viewingSkill.description}</p>
                    </div>
                    <div>
                      <span className="font-medium">Experience: </span>
                      <span>{viewingSkill.yearsExperience || 0} years</span>
                    </div>
                    <div>
                      <span className="font-medium">Availability: </span>
                      <span>{viewingSkill.availabilityDescription || viewingSkill.availability || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Proficiency Level: </span>
                      <Badge variant="outline">{viewingSkill.level || 'Not specified'}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Students Helped:</span>
                        <div className="font-medium">{viewingSkill.studentsHelped || 0}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{viewingSkill.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setViewingSkill(null);
                        handleEditSkill(viewingSkill);
                      }}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => setViewingSkill(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Teaching Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Teaching Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Student Satisfaction</span>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Session Completion Rate</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Teaching Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Session completed: React Hooks</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New learning request received</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">5-star rating received</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Learning Requests</h2>
              <div className="space-y-4">
                {[1,2,3].map((request) => (
                  <Card key={request} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">John Doe</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Wants to learn <strong>React Development</strong>
                            </p>
                            <p className="text-sm mb-3">
                              "Hi! I'm looking to learn React for building web applications. I have basic JavaScript knowledge and would love to work on a project together."
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Beginner level</span>
                              <span>Available weekends</span>
                              <span>2 hours ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Accept</Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OfferSkills;