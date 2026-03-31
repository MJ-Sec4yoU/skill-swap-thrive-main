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
  // Sparkle particles
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 3,
  }));

  return (
    <div style={{
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 25px 80px rgba(139,92,182,0.35)",
      position: "relative",
      background: "linear-gradient(145deg, #c9a0dc 0%, #b07cc6 15%, #9b6fb5 30%, #a87dc0 50%, #c4a0d8 70%, #d4b8e4 85%, #c09cd0 100%)",
      border: "8px solid transparent",
      backgroundClip: "padding-box",
      aspectRatio: "1.42 / 1",
    }}>
      {/* Golden ornamental border */}
      <div style={{
        position: "absolute", inset: 0,
        border: "3px solid rgba(180,140,60,0.5)",
        borderRadius: "4px",
        margin: "8px",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        border: "1px solid rgba(180,140,60,0.3)",
        borderRadius: "4px",
        margin: "14px",
        pointerEvents: "none",
      }} />

      {/* Corner ornaments - Top Left */}
      <svg style={{ position: "absolute", top: "4px", left: "4px", width: "80px", height: "80px", opacity: 0.6 }} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 C10 20 20 10 40 10" stroke="rgba(180,140,60,0.7)" strokeWidth="1.5" fill="none"/>
        <path d="M15 45 C15 25 25 15 45 15" stroke="rgba(180,140,60,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="rgba(180,140,60,0.5)"/>
        <path d="M8 8 C8 8 20 12 20 20 C12 20 8 8 8 8Z" fill="rgba(180,140,60,0.3)"/>
      </svg>

      {/* Corner ornaments - Top Right */}
      <svg style={{ position: "absolute", top: "4px", right: "4px", width: "80px", height: "80px", opacity: 0.6, transform: "scaleX(-1)" }} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 C10 20 20 10 40 10" stroke="rgba(180,140,60,0.7)" strokeWidth="1.5" fill="none"/>
        <path d="M15 45 C15 25 25 15 45 15" stroke="rgba(180,140,60,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="rgba(180,140,60,0.5)"/>
        <path d="M8 8 C8 8 20 12 20 20 C12 20 8 8 8 8Z" fill="rgba(180,140,60,0.3)"/>
      </svg>

      {/* Corner ornaments - Bottom Left */}
      <svg style={{ position: "absolute", bottom: "4px", left: "4px", width: "80px", height: "80px", opacity: 0.6, transform: "scaleY(-1)" }} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 C10 20 20 10 40 10" stroke="rgba(180,140,60,0.7)" strokeWidth="1.5" fill="none"/>
        <path d="M15 45 C15 25 25 15 45 15" stroke="rgba(180,140,60,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="rgba(180,140,60,0.5)"/>
        <path d="M8 8 C8 8 20 12 20 20 C12 20 8 8 8 8Z" fill="rgba(180,140,60,0.3)"/>
      </svg>

      {/* Corner ornaments - Bottom Right */}
      <svg style={{ position: "absolute", bottom: "4px", right: "4px", width: "80px", height: "80px", opacity: 0.6, transform: "scale(-1)" }} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 C10 20 20 10 40 10" stroke="rgba(180,140,60,0.7)" strokeWidth="1.5" fill="none"/>
        <path d="M15 45 C15 25 25 15 45 15" stroke="rgba(180,140,60,0.5)" strokeWidth="1" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="rgba(180,140,60,0.5)"/>
        <path d="M8 8 C8 8 20 12 20 20 C12 20 8 8 8 8Z" fill="rgba(180,140,60,0.3)"/>
      </svg>

      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: s.left,
          top: s.top,
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: "50%",
          background: "white",
          opacity: s.opacity,
          pointerEvents: "none",
          boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.5)`,
        }} />
      ))}

      {/* Light overlay blobs */}
      <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ padding: "36px 50px 28px", textAlign: "center", position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "2px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "#6b3fa0",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(107,63,160,0.4)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#3d1f5c", letterSpacing: "-0.3px", fontFamily: "'Georgia', serif" }}>SwapLearnThrive</span>
        </div>

        {/* Divider with title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", margin: "10px 0 16px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(100,50,120,0.4), transparent)" }} />
          <span style={{ fontSize: "11px", color: "rgba(80,40,100,0.7)", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "600", fontFamily: "'Georgia', serif" }}>Certificate of Completion</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(100,50,120,0.4), transparent)" }} />
        </div>

        {/* "This is to certify that" */}
        <p style={{ color: "rgba(80,40,100,0.65)", fontSize: "12px", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "3px", fontFamily: "'Georgia', serif" }}>This is to certify that</p>

        {/* Full Name */}
        <h2 style={{
          fontSize: "36px", fontWeight: "700", margin: "4px 0 10px",
          color: "#2d1248",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          textShadow: "0 1px 4px rgba(139,92,182,0.2)",
          letterSpacing: "0.5px"
        }}>{userName}</h2>

        <p style={{ color: "rgba(80,40,100,0.6)", fontSize: "14px", margin: "0 0 14px", fontFamily: "'Georgia', serif" }}>has successfully mastered</p>

        {/* Course Name Pill */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <div style={{
            display: "inline-block", padding: "10px 40px",
            background: "linear-gradient(135deg, rgba(180,160,220,0.6), rgba(200,180,230,0.5), rgba(160,140,200,0.6))",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 4px 20px rgba(139,92,182,0.2), inset 0 1px 2px rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              fontSize: "20px", fontWeight: "700",
              color: "#3d1f5c",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.5px"
            }}>{skillName}</span>
          </div>
        </div>

        {mentorName && (
          <p style={{ color: "rgba(80,40,100,0.6)", fontSize: "13px", margin: "0 0 14px", fontFamily: "'Georgia', serif" }}>
            under the guidance of a <strong style={{ color: "#4a2070", fontWeight: "700" }}>SwapLearnThrive Mentor</strong>
          </p>
        )}

        {/* Footer: Date / Verified / Issued by */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 20px",
          marginTop: "auto",
        }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "rgba(80,40,100,0.5)", fontSize: "9px", margin: 0, textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" }}>Date Issued</p>
            <p style={{ color: "#3d1f5c", fontSize: "14px", fontWeight: "700", margin: "4px 0 0", fontFamily: "'Georgia', serif" }}>{date}</p>
          </div>

          {/* Verified Badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(180,160,220,0.5), rgba(200,180,240,0.4))",
              border: "2px solid rgba(139,92,182,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(139,92,182,0.2)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#6b3fa0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="#6b3fa0" strokeWidth="1.5"/>
              </svg>
            </div>
            <span style={{ fontSize: "8px", color: "rgba(80,40,100,0.5)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600" }}>Verified</span>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(80,40,100,0.5)", fontSize: "9px", margin: 0, textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" }}>Issued By</p>
            <p style={{ color: "#3d1f5c", fontSize: "14px", fontWeight: "700", margin: "4px 0 0", fontFamily: "'Georgia', serif" }}>SwapLearnThrive</p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p style={{
          color: "rgba(80,40,100,0.45)", fontSize: "10px", margin: "16px 0 0",
          fontFamily: "'Georgia', serif", fontStyle: "italic",
          letterSpacing: "0.5px"
        }}>
          This certificate is awarded for successfully mastering the specified course.
        </p>

        {isPreview && (
          <div style={{
            marginTop: "12px", padding: "10px 20px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px", border: "1px dashed rgba(100,50,120,0.3)"
          }}>
            <p style={{ color: "rgba(80,40,100,0.7)", fontSize: "13px", fontWeight: "600", margin: 0 }}>
              🌟 Sample Preview — Complete a session to earn your real certificate!
            </p>
          </div>
        )}
      </div>
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