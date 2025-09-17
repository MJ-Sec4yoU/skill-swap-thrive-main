import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, BookOpen, Award } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Active Learners" },
    { icon: BookOpen, value: "500+", label: "Skills Available" },
    { icon: Award, value: "5K+", label: "Certificates Issued" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[80vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20" />
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container relative z-10 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Learn Any Skill,{" "}
            <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Teach What You Know
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Connect with skilled professionals worldwide. Exchange knowledge, build expertise, and grow your career through peer-to-peer learning.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="What skill do you want to learn?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-white/95 border-white/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-white text-primary hover:bg-gray-100 font-medium px-8"
            >
              Search Skills
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-medium px-8"
              onClick={() => navigate("/register")}
            >
              Start Learning Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8"
              onClick={() => navigate("/how-it-works")}
            >
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;