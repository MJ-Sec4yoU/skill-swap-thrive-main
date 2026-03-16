import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Heart, Globe, Users, Lightbulb, Mail, ArrowRight, Github, Linkedin, Twitter, Sparkles, Zap, Shield, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Team data ──────────────────────────────────────────────────────────────────
const team = [
  {
    name: "Dhanashree Chavhan",
    role: "Full Stack Developer & Project Lead",
    bio: "Architected the core platform with a focus on scalable backend systems, AI matching algorithms, and seamless user experience.",
    initials: "DC",
    gradient: "from-violet-500 to-purple-600",
    skills: ["Node.js", "React", "MongoDB"],
    linkedin: "#",
    github: "#",
  },
  {
    name: "Harshita Chaubey",
    role: "Frontend Developer & UI Designer",
    bio: "Crafted the visual identity and interactive UI components, ensuring every screen is intuitive, accessible, and delightful.",
    initials: "HC",
    gradient: "from-fuchsia-500 to-pink-600",
    skills: ["React", "Tailwind", "Figma"],
    linkedin: "#",
    github: "#",
  },
  {
    name: "Vidhan Bhoir",
    role: "Backend Developer & DevOps",
    bio: "Built the real-time communication systems, payment integrations, and managed cloud deployment infrastructure.",
    initials: "VB",
    gradient: "from-indigo-500 to-blue-600",
    skills: ["Express.js", "WebSockets", "AWS"],
    linkedin: "#",
    github: "#",
  },
  {
    name: "Mufiz Topinkatti",
    role: "ML Engineer & Data Analyst",
    bio: "Developed the intelligent skill-matching engine and analytics pipelines that power personalized user recommendations.",
    initials: "MT",
    gradient: "from-amber-500 to-orange-500",
    skills: ["Python", "ML", "Analytics"],
    linkedin: "#",
    github: "#",
  },
];

// ── Values ────────────────────────────────────────────────────────────────────
const values = [
  { icon: Users, title: "Community First", desc: "Every feature we build starts with one question — does this help our community grow together?", gradient: "from-violet-500 to-purple-600" },
  { icon: Heart, title: "Zero Barriers", desc: "Quality learning shouldn't cost a fortune. Our skill-barter model eliminates financial gatekeeping.", gradient: "from-fuchsia-500 to-pink-600" },
  { icon: Globe, title: "Global Reach", desc: "From Mumbai to Madrid — we connect learners and teachers across time zones and cultures.", gradient: "from-indigo-500 to-blue-600" },
  { icon: Lightbulb, title: "Always Improving", desc: "We ship, learn, and iterate. Your feedback directly shapes the next version of our platform.", gradient: "from-amber-500 to-orange-500" },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "10+", label: "Beta Users", icon: "👥" },
  { value: "50+", label: "Skills Listed", icon: "🎯" },
  { value: "15+", label: "Sessions Done", icon: "📅" },
  { value: "4", label: "Team Members", icon: "⚡" },
];

// ── Timeline ──────────────────────────────────────────────────────────────────
const timeline = [
  { month: "Jan 2025", title: "Idea Born", desc: "The concept of skill bartering emerged from a college project discussion between our team of 4.", dot: "from-violet-500 to-purple-600" },
  { month: "Feb 2025", title: "Research & Design", desc: "Conducted user research, designed wireframes, and finalized the tech stack — React, Node.js, MongoDB.", dot: "from-indigo-500 to-blue-600" },
  { month: "Mar 2025", title: "MVP Built", desc: "Shipped core features: skill matching, real-time messaging, scheduling, reviews, and subscription plans.", dot: "from-fuchsia-500 to-pink-600" },
  { month: "Mar 2025", title: "Going Live", desc: "Launching with 10 beta users, Razorpay payments, certificate generation, and production deployment.", dot: "from-amber-500 to-orange-500" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}>
      <Header />

      <main>

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }} />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 container max-w-5xl mx-auto px-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" /> Built with Love by students, for learners
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Democratizing Learning<br />
              <span className="text-yellow-300">One Skill Swap at a Time</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              SwapLearnThrive is a peer-to-peer skill exchange platform where you teach what you know and learn what you love — completely free.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => navigate('/register')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-black rounded-2xl hover:bg-yellow-50 transition-colors shadow-lg">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/learn')}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/30 transition-colors border border-white/30">
                Explore Skills
              </button>
            </div>
          </div>
        </section>

        {/* ══ STATS ════════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-black text-slate-900"
                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ MISSION & VISION ═════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                To create a world where anyone can learn any skill by leveraging the collective intelligence of a global community. We believe knowledge is best shared, not sold — and every person has something valuable to teach.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background: "linear-gradient(90deg, #f093fb, #764ba2)" }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, #f093fb, #764ba2)" }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                A future where financial barriers to education no longer exist. Where learning is collaborative, flexible, and tailored to individual goals — powered by a community that grows stronger with every skill exchanged.
              </p>
            </div>
          </div>
        </section>

        {/* ══ VALUES ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">What We Stand For</h2>
            <p className="text-slate-500 max-w-xl mx-auto">The principles that guide every decision we make</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TEAM ═════════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold mb-4">
              <Users className="w-3.5 h-3.5" /> Department of Data Engineering, Mumbai University
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Meet the Team 👋</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Four passionate students who built SwapLearnThrive from scratch as their Third year project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${member.gradient}`} />

                <div className="p-6 text-center">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                    {member.initials}
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-black text-slate-900 text-base mb-1">{member.name}</h3>
                  <p className={`text-xs font-bold mb-3 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                    {member.role}
                  </p>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.skills.map((skill, j) => (
                      <span key={j} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social links */}
                  <div className="flex justify-center gap-2">
                    <a href={member.linkedin}
                      className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 flex items-center justify-center transition-colors">
                      <Linkedin className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />
                    </a>
                    <a href={member.github}
                      className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors">
                      <Github className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guide credit */}
          <div className="mt-8 bg-white rounded-3xl border border-violet-100 p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Project Guide</p>
            <h3 className="font-black text-slate-900 text-lg">Mr. Darshit Gharat</h3>
            <p className="text-sm text-violet-600 font-semibold">Assistant Professor · Universal College of Engineering, Mumbai University</p>
          </div>
        </section>

        {/* ══ TIMELINE ════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Our Journey 🚀</h2>
            <p className="text-slate-500">From idea to a live product — in just a few months!</p>
          </div>
          <div className="space-y-4">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-5 items-start bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.dot} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}>
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-900">{event.title}</h3>
                    <span className="text-xs text-slate-400 font-semibold">{event.month}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Get In Touch 📬</h2>
            <p className="text-slate-500">Questions, feedback, or collaboration ideas? We'd love to hear from you!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Mail, title: "Email Us", desc: "Drop us a message anytime", action: "swaplearnthrive@gmail.com", gradient: "from-violet-500 to-purple-600" },
              { icon: BookOpen, title: "Documentation", desc: "Learn how the platform works", action: "How It Works →", gradient: "from-indigo-500 to-blue-600", onClick: true },
              { icon: Users, title: "Join Beta", desc: "Be one of our first 10 users", action: "Sign Up Free →", gradient: "from-fuchsia-500 to-pink-600", onClick: true },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-4`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-slate-900 mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{card.desc}</p>
                <button
                  onClick={() => card.onClick && (i === 1 ? navigate('/how-it-works') : navigate('/register'))}
                  className={`px-4 py-2 text-sm font-bold rounded-xl text-white hover:opacity-90 transition-opacity bg-gradient-to-r ${card.gradient}`}>
                  {card.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 container max-w-5xl mx-auto px-4 mb-8">
          <div className="rounded-3xl p-12 text-white text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-3">Ready to Start Swapping Skills? 🎯</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join SwapLearnThrive today — teach what you know, learn what you love!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => navigate('/register')}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-black rounded-2xl hover:bg-yellow-50 transition-colors shadow-lg">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/learn')}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/30 transition-colors border border-white/30">
                  Explore Skills
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
