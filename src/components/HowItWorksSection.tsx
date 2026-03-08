import { UserPlus, Search, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Profile",
    description: "Set up your profile with skills you can teach and want to learn. Upload your portfolio and set availability.",
    details: ["Add your expertise", "Set learning goals", "Upload credentials"],
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Search,
    number: "02",
    title: "Find Your Match",
    description: "Browse skilled professionals or get AI-powered recommendations based on your interests and goals.",
    details: ["Smart matching algorithm", "Filter by skills & availability", "View verified profiles"],
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Connect & Plan",
    description: "Start conversations, schedule sessions, and create structured learning plans with milestones.",
    details: ["Real-time messaging", "Calendar integration", "Goal setting tools"],
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Learn & Earn",
    description: "Participate in interactive sessions, track progress, and earn verified certificates upon completion.",
    details: ["Video collaboration", "Progress tracking", "Verified certificates"],
    color: "from-amber-500 to-orange-500",
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "linear-gradient(135deg, #667eea20, #f093fb20)", color: "#764ba2" }}>
            ✦ How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Start learning in
            <br />
            <span style={{ background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              4 simple steps
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Get started in minutes and begin your peer-to-peer learning journey today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">

              {/* Connector line — desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-6 h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 z-10" />
              )}

              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">

                {/* Number + Icon row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-5xl font-black" style={{background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>{step.number}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{step.description}</p>

                {/* Details */}
                <ul className="space-y-1.5">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white rounded-3xl px-10 py-8 shadow-xl border border-slate-100"
          >
            <div className="text-left">
              <p className="text-xl font-black text-slate-900">Ready to get started?</p>
              <p className="text-slate-500 text-sm">Join 10,000+ learners already swapping skills!</p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold shadow-lg hover:opacity-90 transition-opacity group whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
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

export default HowItWorksSection;
