import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { apiService } from "@/lib/api";
import { Award, ArrowLeft, Download, Calendar, Star } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateCard = ({ userName, skillName, date, isPreview = false }: {
  userName: string;
  skillName: string;
  date: string;
  isPreview?: boolean;
}) => (
  <div className="certificate-card bg-white rounded-3xl overflow-hidden shadow-lg"
    style={{ border: "8px double #764ba2" }}>
    <div className="h-3" style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
    <div className="p-8 text-center">
      <div className="text-4xl mb-2">🎓</div>
      <p className="text-lg font-bold text-violet-600 mb-1">SwapLearnThrive</p>
      <h2 className="text-2xl font-black text-slate-800 mb-4"
        style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        Certificate of Completion
      </h2>
      <p className="text-slate-500 mb-2">This is to certify that</p>
      <h3 className="text-3xl font-black text-slate-900 mb-2"
        style={{ borderBottom: "2px solid #764ba2", paddingBottom: "8px", display: "inline-block" }}>
        {userName}
      </h3>
      <p className="text-slate-500 mt-3 mb-2">has successfully completed</p>
      <h4 className="text-2xl font-black text-violet-600 mb-4">{skillName}</h4>
      <div className="text-4xl mb-4">🏆</div>
      <p className="text-slate-400 text-sm">Completed on: {date}</p>
      {isPreview && (
        <div className="mt-4 px-4 py-2 bg-violet-100 rounded-xl">
          <p className="text-violet-600 text-sm font-semibold">
            🌟 Complete a session to earn this certificate!
          </p>
        </div>
      )}
    </div>
    <div className="h-3" style={{ background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)" }} />
  </div>
);

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
        const completed = result.data.filter((s: any) => s.status === 'Completed');
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}>
      <Header isLoggedIn={true} />
      <main className="container py-8 max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Certificates 🏆</h1>
            <p className="text-slate-500">Your skill completion certificates</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              🏆
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{sessions.length}</p>
              <p className="text-slate-500">Certificates Earned</p>
            </div>
          </div>
        </div>

        {sessions.length > 0 ? (
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
                  <button
                    onClick={() => handleDownloadPDF(i, skillName)}
                    className="w-full mt-4 py-3 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                    <Download className="w-4 h-4" /> Download PDF Certificate
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              <p className="text-slate-500 text-sm mb-2">🌟 Here's a preview of your certificate!</p>
              <p className="text-slate-400 text-xs mb-6">Complete a session to earn your real certificate</p>
            </div>
            <CertificateCard
              userName={user?.name || 'Your Name'}
              skillName="Your Skill Name"
              date={new Date().toLocaleDateString()}
              isPreview={true}
            />
            <div className="text-center">
              <button onClick={() => navigate('/schedule')}
                className="px-8 py-3 text-white font-semibold rounded-2xl"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
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