import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  User,
  Calendar,
  Upload,
  Plus,
  X,
  Check
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    avatar: null as File | null,
    avatarPreview: null as string | null,
    bio: "",
    skillsToTeach: [] as string[],
    skillsToLearn: [] as string[],
    availability: [],
    languages: [] as string[],
    timezone: "UTC"
  });
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const totalSteps = 4;
  const progressPercentage = (step / totalSteps) * 100;

  const popularSkills = [
    "JavaScript", "Python", "React", "Node.js", "UI/UX Design", 
    "Data Science", "Machine Learning", "Digital Marketing", 
    "Graphic Design", "Photography", "Writing", "Public Speaking"
  ];

  const handleAddSkill = (skillType: 'teach' | 'learn', skill: string) => {
    if (skill && skill.trim()) {
      const skillKey = skillType === 'teach' ? 'skillsToTeach' : 'skillsToLearn';
      setProfile(prev => ({
        ...prev,
        [skillKey]: [...prev[skillKey], skill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, or GIF image.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setProfile(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemoveSkill = (skillType: 'teach' | 'learn', index: number) => {
    const skillKey = skillType === 'teach' ? 'skillsToTeach' : 'skillsToLearn';
    setProfile(prev => ({
      ...prev,
      [skillKey]: prev[skillKey].filter((_, i) => i !== index)
    }));
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding - save profile data
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", user?.name || "");
        formData.append("email", user?.email || "");
        formData.append("bio", profile.bio);
        formData.append("skillsTeaching", JSON.stringify(profile.skillsToTeach));
        formData.append("skillsLearning", JSON.stringify(profile.skillsToLearn));

        if (profile.avatar) {
          formData.append("avatar", profile.avatar);
        }

        // Calculate profile completion
        let completion = 0;
        if (profile.bio) completion += 25;
        if (profile.skillsToTeach.length > 0) completion += 25;
        if (profile.skillsToLearn.length > 0) completion += 25;
        if (profile.avatar) completion += 25;

        formData.append("profile", JSON.stringify({ profileCompletion: completion }));

        const result = await apiService.updateProfile(formData);
        if (result.data) {
          toast({
            title: "Profile Complete! 🎉",
            description: "Welcome to SkillSwap. Let's start your learning journey!"
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to save profile",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while saving your profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Let's Build Your Profile</CardTitle>
              <CardDescription>Help others get to know you and your expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {profile.avatarPreview ? (
                    <img
                      src={profile.avatarPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        {profile.avatar ? 'Change Photo' : 'Upload Profile Photo'}
                      </span>
                    </Button>
                  </label>
                  {profile.avatar && (
                    <p className="text-xs text-muted-foreground">
                      {profile.avatar.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your background, interests, and what drives your passion for learning..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Skills You Can Teach</CardTitle>
              <CardDescription>Share your expertise with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Add a skill you can teach</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. React, Photography, Spanish..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('teach', newSkill)}
                  />
                  <Button onClick={() => handleAddSkill('teach', newSkill)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {profile.skillsToTeach.length > 0 && (
                <div className="space-y-2">
                  <Label>Your teaching skills:</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsToTeach.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {skill}
                        <X 
                          className="w-3 h-3 ml-1" 
                          onClick={() => handleRemoveSkill('teach', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Popular skills:</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.filter(skill => !profile.skillsToTeach.includes(skill)).map((skill) => (
                    <Badge 
                      key={skill}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAddSkill('teach', skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Skills You Want to Learn</CardTitle>
              <CardDescription>What would you like to master next?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Add a skill you want to learn</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Machine Learning, Guitar, Cooking..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('learn', newSkill)}
                  />
                  <Button onClick={() => handleAddSkill('learn', newSkill)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {profile.skillsToLearn.length > 0 && (
                <div className="space-y-2">
                  <Label>Skills you want to learn:</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsToLearn.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {skill}
                        <X 
                          className="w-3 h-3 ml-1" 
                          onClick={() => handleRemoveSkill('learn', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Popular skills:</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.filter(skill => !profile.skillsToLearn.includes(skill)).map((skill) => (
                    <Badge 
                      key={skill}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAddSkill('learn', skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Availability & Preferences</CardTitle>
              <CardDescription>When are you available for skill exchange sessions?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input value="UTC-5 (Eastern Time)" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Languages</Label>
                  <Input placeholder="English, Spanish..." />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Weekly Availability</Label>
                <div className="grid grid-cols-1 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="font-medium">{day}</span>
                      <div className="flex gap-2">
                        <input type="time" className="text-sm p-1 border rounded" defaultValue="09:00" />
                        <span className="text-muted-foreground">to</span>
                        <input type="time" className="text-sm p-1 border rounded" defaultValue="17:00" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Don't worry, you can always update your availability later in your profile settings.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-white ml-2">SkillSwap</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-white text-primary hover:bg-gray-100 px-8"
          >
            {step === totalSteps ? (
              <>
                Complete Setup
                <Check className="ml-2 w-4 h-4" />
              </>
            ) : (
              'Next Step'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;