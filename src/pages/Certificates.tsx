import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { apiService } from "@/lib/api";
import { Download, ArrowLeft, Trophy, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ── Certificate Card ───────────────────────────────────────────────────────────
const CertificateCard = ({ userName, skillName, date, isPreview = false }: {
  userName: string;
  skillName: string;
  date: string;
  isPreview?: boolean;
}) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-lg"
    style={{ border: "6px double #764ba2" }}>
    <div className="h-2" style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
    <div className="p-8 text-center">
      <div className="text-5xl mb-3">🎓</div>
      <p className="text-lg font-black text-violet-600 mb-1 tracking-wide">SwapLearnThrive</p>
      <h2 className="text-2xl font-black text-slate-800 mb-6"
        style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        Certificate of Completion
      </h2>
      <p className="text-slate-400 text-sm mb-2">This is to certify that</p>
      <h3 className="text-3xl font-black text-slate-900 mb-1 pb-2 inline-block"
        style={{ borderBottom: "3px solid #764ba2" }}>
        {userName}
      </h3>
      <p className="text-slate-400 text-sm mt-4 mb-2">has successfully completed</p>
      <h4 className="text-2xl font-black mb-4"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {skillName}
      </h4>
      <div className="text-4xl mb-4">🏆</div>
      <p className="text-slate-400 text-xs">Completed on: {date}</p>
      {isPreview && (
        <div className="mt-4 px-4 py-2 bg-violet-50 rounded-2xl border border-violet-100">
          <p className="text-violet-600 text-sm font-semibold">
            🌟 Complete a session to earn this certificate!
          </p>
        </div>
      )}
    </div>
    <div className="h-2" style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const Certificates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const certificateRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiService.getSchedules();
      if (result.data && Array.isArray(result.data)) {
        const completed = (result.data as any[]).filter((s: any) => s.status === 'Completed');
        setSessions(completed);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async (index: number, skillName: string) => {
    const element = certificateRefs.current[index];
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, (pdf.internal.pageSize.getHeight() - pdfHeight) / 2, pdfWidth, pdfHeight);
      pdf.save(`certificate-${skillName}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}>
      <Header isLoggedIn={true} />

      <main className="container py-8 max-w-5xl mx-auto px-4">

        {/* ── Hero Banner ── */}
        <div className="rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">My Certificates 🏆</h1>
              <p className="text-white/70 text-sm">Your skill completion certificates</p>
              <div className="flex gap-4 mt-4">
                <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                  <p className="text-xl font-black">{sessions.length}</p>
                  <p className="text-xs text-white/70">Earned</p>
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
            <p className="text-slate-500">Loading certificates...</p>
          </div>
        )}

        {/* ── Certificates ── */}
        {!loading && sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sessions.map((session, i) => {
              const skillName = typeof session.skill === 'object' ? session.skill.name : session.skill;
              return (
                <div key={i}>
                  <div ref={el => certificateRefs.current[i] = el}>
                    <CertificateCard
                      userName={user?.name || 'User'}
                      skillName={skillName}
                      date={new Date(session.date).toLocaleDateString()}
                    />
                  </div>
                  <button onClick={() => handleDownloadPDF(i, skillName)}
                    className="w-full mt-4 py-3 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                    <Download className="w-4 h-4" /> Download PDF Certificate
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Empty / Preview State ── */}
        {!loading && sessions.length === 0 && (
          <div className="space-y-6">
            {/* Info card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <p className="text-slate-700 font-bold mb-1">🌟 Here's a preview of your certificate!</p>
              <p className="text-slate-400 text-sm">Complete a session to earn your real certificate</p>
            </div>

            {/* Preview certificate */}
            <CertificateCard
              userName={user?.name || 'Your Name'}
              skillName="Your Skill Name"
              date={new Date().toLocaleDateString()}
              isPreview={true}
            />

            {/* CTA */}
            <div className="text-center">
              <button onClick={() => navigate('/schedule')}
                className="px-8 py-3 text-white font-bold rounded-2xl hover:opacity-90 shadow-md"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                <Trophy className="w-4 h-4 inline mr-2" />
                View Sessions → Earn Certificate!
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Certificates;
