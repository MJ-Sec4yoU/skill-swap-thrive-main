import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { apiService } from "@/lib/api";
import { ArrowLeft, Download, Award } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateCard = ({ userName, skillName, date, mentorName, isPreview = false }: {
  userName: string;
  skillName: string;
  date: string;
  mentorName?: string;
  isPreview?: boolean;
}) => {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "1.42 / 1",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 25px 80px rgba(139,92,182,0.35)",
    }}>
      {/* Certificate template image as background */}
      <img
        src="/certificate-template.jpg"
        alt="Certificate Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        crossOrigin="anonymous"
      />

      {/* Dynamic text overlays positioned to match the template */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}>
        {/* Full Name - fits between "THIS IS TO CERTIFY THAT" (~25%) and "has successfully mastered" (~42%) */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "80%",
          maxHeight: "12%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <h2 style={{
            fontSize: "clamp(16px, 3vw, 32px)",
            fontWeight: "700",
            margin: 0,
            lineHeight: "1.15",
            color: "#2d1248",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: "0.5px",
            wordBreak: "keep-all",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{userName}</h2>
        </div>

        {/* Course/Skill Name - fits between "has successfully mastered" (~42%) and "under the guidance" (~56%) */}
        <div style={{
          position: "absolute",
          top: "47%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "60%",
          maxHeight: "8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontSize: "clamp(14px, 2.2vw, 22px)",
            fontWeight: "700",
            color: "#3d1f5c",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.5px",
          }}>{skillName}</span>
        </div>

        {/* Date - positioned at the bottom-left where "26 April 2024" appears */}
        <div style={{
          position: "absolute",
          top: "73%",
          left: "15.5%",
          textAlign: "left",
        }}>
          <p style={{
            fontSize: "clamp(10px, 1.8vw, 18px)",
            fontWeight: "700",
            margin: 0,
            color: "#2d1248",
            fontFamily: "'Georgia', serif",
          }}>{date}</p>
        </div>
      </div>

      {/* Preview overlay */}
      {isPreview && (
        <div style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 20px",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "12px",
          border: "1px dashed rgba(100,50,120,0.4)",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <p style={{ color: "rgba(80,40,100,0.8)", fontSize: "clamp(10px, 1.4vw, 14px)", fontWeight: "600", margin: 0, whiteSpace: "nowrap" }}>
            🌟 Sample Preview — Complete a session to earn yours!
          </p>
        </div>
      )}
    </div>
  );
};

const Certificates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
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
    setDownloading(index);
    try {
      const canvas = await html2canvas(element, {
        scale: 3, useCORS: true,
        backgroundColor: "#b07cc6", logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const yPos = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 10, yPos, imgWidth, imgHeight);
      pdf.save(`SwapLearnThrive-Certificate-${skillName}.pdf`);
    } catch (error) {
      console.error('PDF error:', error);
    }
    setDownloading(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fdf4ff 100%)" }}>
      <Header isLoggedIn={true} />
      <main className="container py-8 max-w-4xl mx-auto px-4">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-xl transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 0 20px rgba(102,126,234,0.5)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Certificates 🏆</h1>
            <p className="text-muted-foreground">Your skill completion certificates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{sessions.length}</p>
            <p className="text-sm text-slate-500 mt-0.5">Certificates Earned</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{sessions.length}</p>
            <p className="text-sm text-slate-500 mt-0.5">Available Downloads</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mb-3">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">PDF</p>
            <p className="text-sm text-slate-500 mt-0.5">Download Format</p>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-8">
            {sessions.map((session, i) => {
              const skillName = typeof session.skill === 'object' ? session.skill.name : session.skill;
              const mentorName = session.teacher?._id === user?._id ? session.student?.name : session.teacher?.name;
              return (
                <div key={i}>
                  <div ref={el => certificateRefs.current[i] = el}>
                    <CertificateCard
                      userName={user?.name || 'User'}
                      skillName={skillName}
                      date={new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      mentorName={mentorName}
                    />
                  </div>
                  <button
                    onClick={() => handleDownloadPDF(i, skillName)}
                    disabled={downloading === i}
                    className="w-full mt-4 py-3 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                    {downloading === i ? <>⏳ Generating PDF...</> : <><Download className="w-4 h-4" /> Download PDF Certificate</>}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-center">
              <p className="text-slate-600 font-semibold mb-1">🎓 Certificate Preview</p>
              <p className="text-slate-400 text-sm">This is how your certificate will look when you complete a session!</p>
            </div>
            <CertificateCard
              userName={user?.name || 'Your Name'}
              skillName="JavaScript"
              date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              mentorName="SwapLearnThrive Mentor"
              isPreview={true}
            />
            <div className="text-center">
              <button onClick={() => navigate('/schedule')}
                className="px-8 py-3 text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                View Sessions → Earn Your Certificate! 🏆
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Certificates;