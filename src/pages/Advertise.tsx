import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play, Pause, ArrowRight, Star, Users, BookOpen, Award, Zap,
  Search, Video, Target, Calendar, Shield, CheckCircle, ChevronDown,
  Sparkles, Globe, TrendingUp, Heart, MessageSquare, Clock,
  ArrowUpRight, Volume2, VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

/* ────────────── data ────────────── */
const features = [
  {
    icon: Search,
    title: "AI-Powered Matching",
    description: "Our intelligent algorithm finds your perfect skill partner in seconds — not days.",
    image: "/promo/feature-matching.png",
    tag: "SMART",
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    icon: Video,
    title: "Live Interactive Sessions",
    description: "Real-time video calls with screen sharing, whiteboards, and collaborative tools.",
    image: "/promo/feature-sessions.png",
    tag: "LIVE",
    gradient: "from-indigo-600 to-blue-600",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn industry-recognized certificates and badges to showcase your new skills.",
    image: "/promo/feature-certificates.png",
    tag: "CERTIFIED",
    gradient: "from-amber-500 to-orange-500",
  },
];

const stats = [
  { value: "10K+", label: "Active Learners", icon: Users },
  { value: "500+", label: "Skills Available", icon: BookOpen },
  { value: "50K+", label: "Sessions Completed", icon: Video },
  { value: "4.9★", label: "Average Rating", icon: Star },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Full-Stack Developer",
    avatar: "PS",
    color: "from-violet-400 to-purple-600",
    text: "Skill Swap completely transformed my career. I taught Python and learned UI/UX design — both for free!",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Graphic Designer",
    avatar: "JW",
    color: "from-blue-400 to-indigo-600",
    text: "The AI matching is incredible. It found me a React developer who wanted to learn Figma within hours.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Data Scientist",
    avatar: "AP",
    color: "from-emerald-400 to-teal-600",
    text: "I've earned 3 verified certificates through Skill Swap. The platform is so easy and fun to use.",
    rating: 5,
  },
  {
    name: "Mohammed Ali",
    role: "Marketing Specialist",
    avatar: "MA",
    color: "from-amber-400 to-orange-500",
    text: "Best community I've found. Everyone is eager to help and the scheduling is so flexible.",
    rating: 5,
  },
];

const howItWorks = [
  { step: "01", title: "Sign Up Free", desc: "Create your profile in under 2 minutes", icon: Sparkles },
  { step: "02", title: "Get Matched", desc: "AI finds your perfect skill partner", icon: Search },
  { step: "03", title: "Start Learning", desc: "Join live sessions & track progress", icon: Video },
  { step: "04", title: "Earn Certificates", desc: "Get verified proof of your new skills", icon: Award },
];

const trustedBy = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];

/* ────────────── component ────────────── */
const Advertise = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ learners: 0, skills: 0, sessions: 0 });

  // Parallax scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Autoplay feature carousel
  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Autoplay testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    const targets = { learners: 10000, skills: 500, sessions: 50000 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounters({
        learners: Math.round(targets.learners * eased),
        skills: Math.round(targets.skills * eased),
        sessions: Math.round(targets.sessions * eased),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  // Video play/pause control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVideoPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVideoPlaying]);

  // Video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const toggleVideoPlay = () => {
    setIsVideoPlaying(prev => !prev);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  const getAnimClass = (id: string) =>
    visibleSections.has(id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12";

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .ad-page { font-family: 'Inter', sans-serif; }

        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-delay { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes video-progress { from { width: 0%; } to { width: 100%; } }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 5s ease-in-out infinite 1s; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 4s ease infinite; }
        .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: shimmer 2s infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
        .animate-marquee { animation: marquee 20s linear infinite; }

        .video-progress { animation: video-progress 4s linear infinite; }

        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-strong { background: rgba(255,255,255,0.08); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.12); }

        .glow-violet { box-shadow: 0 0 60px rgba(139, 92, 246, 0.3); }
        .glow-text { text-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }

        .feature-card { transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .feature-card.active { transform: scale(1.02); }

        .scroll-indicator { animation: float 2s ease-in-out infinite; }

        .testimonial-enter { animation: scale-in 0.5s ease-out; }

        .cta-button {
          background: linear-gradient(135deg, #8b5cf6, #6366f1, #8b5cf6);
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
        }

        .noise-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' seed='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }
      `}</style>

      <div className="ad-page relative">
        {/* Noise texture overlay */}
        <div className="noise-overlay" />

        {/* ─── STICKY NAV ─── */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
              <Logo size="sm" />
            </button>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm text-white/60 hover:text-white transition-colors">Reviews</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-white/70 hover:text-white hover:bg-white/10">
                Log In
              </Button>
              <button onClick={() => navigate("/register")} className="cta-button px-5 py-2 rounded-xl text-sm font-semibold text-white">
                Start Free →
              </button>
            </div>
          </div>
        </nav>

        {/* ─── HERO SECTION ─── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 30%, transparent 70%)"
            }} />
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-float-delay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-violet-300 font-medium mb-8 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              <span>The Future of Peer-to-Peer Learning</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">NEW</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-white">Learn Anything.</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
                Teach Everything.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Exchange skills with talented people worldwide. Our AI matches you with the perfect learning partner — and it's completely <span className="text-white font-semibold">free</span>.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <button
                onClick={() => navigate("/register")}
                className="cta-button px-8 py-4 rounded-2xl text-lg font-bold text-white flex items-center gap-2 group"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const videoSection = document.getElementById("demo-video-section");
                  if (videoSection) {
                    videoSection.scrollIntoView({ behavior: "smooth" });
                    setIsVideoPlaying(true);
                  }
                }}
                className="glass px-8 py-4 rounded-2xl text-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex -space-x-3">
                {[
                  { i: "PS", c: "from-violet-400 to-purple-600" },
                  { i: "JW", c: "from-blue-400 to-indigo-600" },
                  { i: "AP", c: "from-emerald-400 to-teal-600" },
                  { i: "MA", c: "from-amber-400 to-orange-500" },
                  { i: "SK", c: "from-fuchsia-400 to-pink-600" },
                ].map((a, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.c} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold`}>
                    {a.i}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <span className="text-white/50 text-sm">
                  Loved by <span className="text-white font-semibold">10,000+</span> learners
                </span>
              </div>
            </div>

            {/* Hero — Real Demo Video */}
            <div id="demo-video-section" className="relative max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="relative rounded-3xl overflow-hidden glass glow-violet group">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-white/40 flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      skillswapthrive.com
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400/70 font-medium">LIVE DEMO</span>
                  </div>
                </div>

                {/* Real Video */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    src="/promo/platform-demo.webp"
                    className="w-full h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/promo/hero-banner.png"
                  />

                  {/* Gradient overlay at bottom for controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Big play button when paused */}
                  {!isVideoPlaying && (
                    <button
                      onClick={toggleVideoPlay}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="w-20 h-20 rounded-full bg-violet-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </button>
                  )}

                  {/* Video controls bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleVideoPlay}
                          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <p className="text-sm font-semibold">Platform Demo</p>
                          <p className="text-xs text-white/50">Real walkthrough of the platform</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {/* Progress bar — real progress */}
                    <div
                      className="h-1.5 rounded-full bg-white/10 overflow-hidden cursor-pointer group/progress"
                      onClick={(e) => {
                        const video = videoRef.current;
                        if (!video) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        video.currentTime = pct * video.duration;
                      }}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-200"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around the video */}
              <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 animate-float hidden lg:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">+247%</p>
                  <p className="text-xs text-white/50">Skills learned</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 glass rounded-2xl p-4 animate-float-delay hidden lg:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">4.9 / 5.0</p>
                  <p className="text-xs text-white/50">User rating</p>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 scroll-indicator">
              <ChevronDown className="w-6 h-6 text-white/30 mx-auto" />
            </div>
          </div>
        </section>

        {/* ─── TRUSTED BY ─── */}
        <section className="py-12 border-y border-white/5 overflow-hidden">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest font-semibold mb-8">
            Our learners work at the world's best companies
          </p>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...trustedBy, ...trustedBy].map((company, i) => (
                <span key={i} className="mx-12 text-2xl font-bold text-white/10 select-none">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="py-20" id="stats-section" data-animate>
          <div className={`max-w-6xl mx-auto px-6 transition-all duration-1000 ${getAnimClass("stats-section")}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass rounded-3xl p-8 text-center group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/40 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES SHOWCASE ─── */}
        <section id="features" className="py-28 relative" data-animate>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)"
          }} />

          <div className={`max-w-7xl mx-auto px-6 relative z-10 transition-all duration-1000 ${getAnimClass("features")}`}>
            {/* Section header */}
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-violet-300 font-medium mb-4">
                ✦ Platform Features
              </span>
              <h2 className="text-4xl sm:text-6xl font-black mb-4">
                <span className="text-white">Built for </span>
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  modern learners
                </span>
              </h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto">
                Everything you need for successful peer-to-peer skill exchange, beautifully designed and effortless to use.
              </p>
            </div>

            {/* Feature tabs + showcase */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Feature list */}
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveFeature(i); setIsVideoPlaying(false); }}
                    className={`feature-card w-full text-left rounded-3xl p-6 transition-all duration-500 ${
                      activeFeature === i
                        ? "glass-strong border-violet-500/30 shadow-lg shadow-violet-500/10"
                        : "glass hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 ${activeFeature === i ? 'scale-110' : ''} transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-bold ${activeFeature === i ? 'text-white' : 'text-white/70'} transition-colors`}>
                            {feature.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            activeFeature === i ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-white/30'
                          }`}>
                            {feature.tag}
                          </span>
                        </div>
                        <p className={`text-sm ${activeFeature === i ? 'text-white/60' : 'text-white/40'} transition-colors`}>
                          {feature.description}
                        </p>
                        {activeFeature === i && (
                          <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 video-progress" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Feature image */}
              <div className="relative">
                <div className="glass rounded-3xl overflow-hidden glow-violet">
                  <img
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    className="w-full h-auto transition-all duration-700"
                    key={activeFeature}
                  />
                </div>
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="py-28 relative" data-animate>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />

          <div className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-1000 ${getAnimClass("how-it-works")}`}>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-violet-300 font-medium mb-4">
                ✦ Simple Process
              </span>
              <h2 className="text-4xl sm:text-6xl font-black mb-4">
                <span className="text-white">Start in </span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  4 simple steps
                </span>
              </h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto">
                Get started in minutes. No credit card required, ever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative group" style={{ animationDelay: `${i * 0.15}s` }}>
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[calc(100%)] w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
                  )}
                  <div className="glass rounded-3xl p-8 h-full hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 relative z-10">
                    {/* Step number */}
                    <span className="text-5xl font-black bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 bg-clip-text text-transparent">
                      {item.step}
                    </span>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center my-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section id="testimonials" className="py-28 relative" data-animate>
          <div className={`max-w-6xl mx-auto px-6 transition-all duration-1000 ${getAnimClass("testimonials")}`}>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-violet-300 font-medium mb-4">
                ✦ Real Stories
              </span>
              <h2 className="text-4xl sm:text-6xl font-black mb-4">
                <span className="text-white">Loved by </span>
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  learners worldwide
                </span>
              </h2>
            </div>

            {/* Testimonial cards grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`glass rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 ${
                    currentTestimonial === i ? 'ring-1 ring-violet-500/30 bg-white/[0.07]' : ''
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-white/70 text-lg leading-relaxed mb-6">"{t.text}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" className="py-28 relative" data-animate>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)"
          }} />

          <div className={`max-w-5xl mx-auto px-6 relative z-10 transition-all duration-1000 ${getAnimClass("pricing")}`}>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-violet-300 font-medium mb-4">
                ✦ Pricing
              </span>
              <h2 className="text-4xl sm:text-6xl font-black mb-4">
                <span className="text-white">Free forever. </span>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Seriously.
                </span>
              </h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto">
                Skill Swap is free for everyone. Upgrade to Pro for premium features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free */}
              <div className="glass rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">Free Plan</span>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">£0</span>
                  <span className="text-white/40 ml-2">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited skill swaps",
                    "AI-powered matching",
                    "Video sessions included",
                    "Basic certificates",
                    "Community access",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Get Started Free
                </button>
              </div>

              {/* Pro */}
              <div className="relative rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))" }}
              >
                <div className="absolute inset-0 border border-violet-500/30 rounded-3xl" />
                <div className="absolute -top-px right-8 px-3 py-1 rounded-b-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-xs font-bold">
                  POPULAR
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Pro Plan</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">£9</span>
                    <span className="text-white/40 ml-2">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Everything in Free",
                      "Priority AI matching",
                      "Unlimited recordings",
                      "Premium certificates",
                      "Analytics dashboard",
                      "Priority support",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                        <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-3 rounded-2xl cta-button text-white font-semibold"
                  >
                    Start Pro Free Trial →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-28 relative overflow-hidden" data-animate id="final-cta">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.2) 0%, transparent 70%)"
          }} />

          <div className={`max-w-4xl mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${getAnimClass("final-cta")}`}>
            <div className="glass-strong rounded-[2.5rem] p-12 sm:p-16 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-black mb-4">
                  Ready to start your
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    learning journey?
                  </span>
                </h2>
                <p className="text-lg text-white/50 mb-8 max-w-lg mx-auto">
                  Join 10,000+ learners already exchanging skills on Skill Swap Thrive. It takes less than 2 minutes to get started.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="cta-button px-10 py-4 rounded-2xl text-lg font-bold text-white flex items-center gap-2 group"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/how-it-works")}
                    className="glass px-8 py-4 rounded-2xl text-lg font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    Learn More
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-6 text-sm text-white/30">
                  No credit card required · Free forever · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-4">Platform</h4>
                <ul className="space-y-2">
                  {["Learn Skills", "How It Works", "Pricing", "Success Stories"].map((link, i) => (
                    <li key={i}><button className="text-sm text-white/30 hover:text-white/60 transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-4">Community</h4>
                <ul className="space-y-2">
                  {["Help Center", "Guidelines", "Blog", "Events"].map((link, i) => (
                    <li key={i}><button className="text-sm text-white/30 hover:text-white/60 transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-4">Company</h4>
                <ul className="space-y-2">
                  {["About Us", "Careers", "Press", "Contact"].map((link, i) => (
                    <li key={i}><button className="text-sm text-white/30 hover:text-white/60 transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-4">Legal</h4>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link, i) => (
                    <li key={i}><button className="text-sm text-white/30 hover:text-white/60 transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
              <p className="text-sm text-white/20">© 2026 Skill Swap Thrive. All rights reserved.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                {["Twitter", "LinkedIn", "GitHub", "Discord"].map((social, i) => (
                  <button key={i} className="text-sm text-white/20 hover:text-white/50 transition-colors">{social}</button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Advertise;
