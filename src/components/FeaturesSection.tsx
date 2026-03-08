import { Search, Video, Target, Award, Calendar, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered algorithm matches you with the perfect skill partners based on your interests and availability.",
    tag: "AI Powered",
    color: "from-violet-500 to-purple-600",
    light: "bg-violet-50 text-violet-600",
  },
  {
    icon: Video,
    title: "Interactive Sessions",
    description: "Engage in real-time video calls with screen sharing, file exchange, and collaborative tools.",
    tag: "Live",
    color: "from-indigo-500 to-blue-600",
    light: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set learning milestones, track progress, and celebrate achievements with structured task management.",
    tag: "Progress",
    color: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Award,
    title: "Skill Verification",
    description: "Earn verified badges and certificates through peer endorsements and skill assessments.",
    tag: "Certified",
    color: "from-amber-500 to-orange-500",
    light: "bg-amber-50 text-amber-600",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Seamless calendar integration to find the perfect time for your skill exchange sessions.",
    tag: "Smart",
    color: "from-sky-500 to-cyan-600",
    light: "bg-sky-50 text-sky-600",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Comprehensive rating system and verification process ensures a safe learning environment.",
    tag: "Secure",
    color: "from-rose-500 to-pink-600",
    light: "bg-rose-50 text-rose-600",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 bg-white">
      <div className="container max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "linear-gradient(135deg, #667eea20, #f093fb20)", color: "#764ba2" }}>
            ✦ Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Everything you need to
            <br />
            <span style={{ background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              learn and teach
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            All the tools for successful peer-to-peer skill exchange, beautifully designed and ready to use.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-6 border border-slate-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

              {/* Tag */}
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${feature.light} mb-4`}>
                {feature.tag}
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div
          className="rounded-3xl p-10 text-center text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2">Ready to start exchanging skills?</h3>
            <p className="text-white/70 mb-6 text-lg">Join thousands of learners — it's completely free!</p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-violet-700 font-bold rounded-2xl hover:bg-amber-50 transition-colors shadow-xl group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
