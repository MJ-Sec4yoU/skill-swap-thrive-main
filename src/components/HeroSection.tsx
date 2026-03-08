import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, BookOpen, Award, ArrowRight, Zap, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/learn?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Active Learners" },
    { icon: BookOpen, value: "500+", label: "Skills Available" },
    { icon: Award, value: "5K+", label: "Certificates Issued" },
  ];

  const floatingSkills = [
    "Python", "UI/UX", "Guitar", "Spanish", "React",
    "Photography", "Data Science", "Figma", "Marketing"
  ];

  const avatars = [
    { initials: "PR", color: "from-violet-400 to-purple-600" },
    { initials: "AJ", color: "from-indigo-400 to-blue-600" },
    { initials: "SK", color: "from-fuchsia-400 to-pink-600" },
    { initials: "MR", color: "from-amber-400 to-orange-500" },
  ];

  return (
    <section
      className="relative min-h-[95vh] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)" }}
    >
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      {/* Main content — fully centered */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8">
            <Zap className="w-4 h-4 text-amber-300" />
            Peer-To-Peer Skill Exchange Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight mb-6">
            Swap Skills,
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
            Connect with skilled professionals worldwide. Exchange knowledge, build expertise, and grow your career — completely free.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-lg mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="What skill do you want to learn?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-11 h-14 bg-white/95 backdrop-blur-sm border-0 text-slate-800 placeholder:text-slate-400 rounded-2xl shadow-xl focus-visible:ring-2 focus-visible:ring-amber-300"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-14 px-6 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-xl border-0"
            >
              Search
            </Button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="h-13 px-8 bg-white text-violet-700 hover:bg-white/90 font-bold rounded-2xl shadow-xl border-0 group"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/how-it-works")}
              className="h-13 px-8 bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm font-bold rounded-2xl"
            >
              See How It Works
            </Button>
          </div>

          {/* Skill tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {floatingSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Social proof row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14">
            {/* Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 text-amber-300 fill-amber-300" />
                  ))}
                </div>
                <p className="text-white/70 text-xs">Loved by 10,000+ learners</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/20" />

            {/* Stats inline */}
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-sm leading-none">{stat.value}</p>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom glass card — preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl max-w-2xl mx-auto">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">🔥 Popular right now</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { skill: "React Development", tag: "Tech", color: "bg-blue-800/20" },
                { skill: "UI/UX Design", tag: "Design", color: "bg-pink-800/20" },
                { skill: "Data Science", tag: "Analytics", color: "bg-emerald-800/20" },
              ].map((item, i) => (
                <div key={i} className={`${item.color} rounded-2xl p-3 border border-white/10 cursor-pointer hover:bg-white/20 transition-colors`}
                  onClick={() => navigate('/learn')}
                >
                  <span className="text-white/50 text-xs">{item.tag}</span>
                  <p className="text-white text-sm font-semibold mt-1">{item.skill}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;