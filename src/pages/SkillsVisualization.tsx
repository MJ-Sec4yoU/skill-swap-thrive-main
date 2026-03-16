import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie,
  Cell, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, ArrowLeft, Star, BookOpen, Users, Calendar } from "lucide-react";

const SkillsVisualization = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  const getSkillCount = (skills: any[]) => Array.isArray(skills) ? skills.length : 0;

  const calculateSkillProgress = (currentLevel: string, targetLevel: string, urgency?: string): number => {
    const levelMap: Record<string, number> = {
      'Absolute Beginner': 0, 'Beginner': 25, 'Intermediate': 50, 'Advanced': 75, 'Expert': 100
    };
    const current = levelMap[currentLevel] || 0;
    const target = levelMap[targetLevel] || 100;
    if (current >= target) return 100;
    const additional = urgency === 'High' ? 0.6 : urgency === 'Medium' ? 0.4 : 0.2;
    return Math.min(current + (target - current) * additional, 95);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiService.getProfile();
      if (result.data) setProfile(result.data);
      const schedulesResult = await apiService.getSchedules();
      if (schedulesResult.data && Array.isArray(schedulesResult.data)) {
        setUpcomingSessions(
          schedulesResult.data.filter((s: any) => new Date(s.date) >= new Date()).slice(0, 10)
        );
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const teachingSkills = profile?.skillsTeaching || [];
  const learningSkills = profile?.skillsLearning || [];

  const learningProgressData = learningSkills.slice(0, 5).map((s: any) => ({
    name: typeof s === 'string' ? s : s?.skill,
    progress: Math.round(calculateSkillProgress(
      s?.currentLevel || 'Beginner',
      s?.targetLevel || 'Intermediate',
      s?.urgency
    )),
    current: s?.currentLevel || 'Beginner',
    target: s?.targetLevel || 'Intermediate',
  }));

  const avgProgress = Math.round(
    learningProgressData.reduce((a: number, b: any) => a + b.progress, 0) /
    (learningProgressData.length || 1)
  );

  const stats = [
    { label: 'Skills Teaching', value: getSkillCount(teachingSkills), color: 'from-violet-500 to-purple-600', icon: Users },
    { label: 'Skills Learning', value: getSkillCount(learningSkills), color: 'from-indigo-500 to-blue-600', icon: BookOpen },
    { label: 'Avg Progress', value: `${avgProgress}%`, color: 'from-fuchsia-500 to-pink-600', icon: TrendingUp },
    { label: 'Total Skills', value: getSkillCount(teachingSkills) + getSkillCount(learningSkills), color: 'from-amber-500 to-orange-500', icon: Star },
    { label: 'Active Sessions', value: upcomingSessions.length, color: 'from-emerald-500 to-teal-500', icon: Calendar },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}>
      <Header isLoggedIn={true} />

      <main className="container py-8 max-w-6xl mx-auto px-4">

        {/* ── Hero Banner ── */}
        <div className="rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">Skills Analytics 📊</h1>
              <p className="text-white/70 text-sm">Detailed view of your skill journey</p>
              <div className="flex gap-4 mt-4">
                <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                  <p className="text-xl font-black">{getSkillCount(teachingSkills) + getSkillCount(learningSkills)}</p>
                  <p className="text-xs text-white/70">Total Skills</p>
                </div>
                <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                  <p className="text-xl font-black">{avgProgress}%</p>
                  <p className="text-xs text-white/70">Avg Progress</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 font-bold rounded-2xl hover:bg-amber-50 transition-colors shadow-lg text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-500">Loading analytics...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div className="h-1 rounded-full mb-5 -mx-1"
                  style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
                <h3 className="font-black text-slate-900 mb-4">Teaching vs Learning</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: 'Teaching', count: getSkillCount(teachingSkills) },
                    { name: 'Learning', count: getSkillCount(learningSkills) },
                  ]}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      <Cell fill="#667eea" />
                      <Cell fill="#f093fb" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div className="h-1 rounded-full mb-5 -mx-1"
                  style={{ background: "linear-gradient(90deg, #f093fb, #764ba2, #667eea)" }} />
                <h3 className="font-black text-slate-900 mb-4">Skills Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Teaching', value: getSkillCount(teachingSkills) || 1 },
                      { name: 'Learning', value: getSkillCount(learningSkills) || 1 },
                    ]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                      <Cell fill="#667eea" />
                      <Cell fill="#f093fb" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Learning Progress ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="h-1 rounded-full mb-5 -mx-1"
                style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
              <h3 className="font-black text-slate-900 mb-5">Learning Progress per Skill</h3>
              {learningProgressData.length > 0 ? learningProgressData.map((skill: any, i: number) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{skill.name}</span>
                    <span className="font-black text-violet-600 text-sm">{skill.progress}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Current: {skill.current}</span>
                    <span>Target: {skill.target}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${skill.progress}%`, background: "linear-gradient(90deg, #667eea, #f093fb)" }} />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-3">No learning skills added yet!</p>
                  <button onClick={() => navigate('/my-skills')}
                    className="px-4 py-2 text-white font-bold rounded-xl text-sm hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                    Add Learning Skills
                  </button>
                </div>
              )}
            </div>

            {/* ── Teaching Skills ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="h-1 rounded-full mb-5 -mx-1"
                style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
              <h3 className="font-black text-slate-900 mb-4">Your Teaching Skills</h3>
              {teachingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teachingSkills.map((s: any, i: number) => (
                    <span key={i}
                      className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-xl text-sm font-semibold">
                      {typeof s === 'string' ? s : s?.skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm mb-3">No teaching skills added yet!</p>
                  <button onClick={() => navigate('/my-skills')}
                    className="px-4 py-2 text-white font-bold rounded-xl text-sm hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                    Add Teaching Skills
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default SkillsVisualization;
