import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Repeat,
  Bell
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";

const Schedule = () => {
  const { user } = useAuth();

  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New session form state
  const [form, setForm] = useState({
    skillId: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    meetingLink: "",
    description: ""
  });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    skillId: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    meetingLink: "",
    status: "Pending",
    description: ""
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const [schedRes, skillsRes] = await Promise.all([
      apiService.getSchedules(),
      apiService.getSkills(),
    ]);
    if (schedRes.data && Array.isArray(schedRes.data)) {
      const mapped = (schedRes.data as any[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((s) => ({
          id: s._id,
          title: typeof s.skill === 'object' ? (s.skill.name || s.skill.title || 'Session') : String(s.skill),
          partner: s.student?._id === user?._id ? (s.teacher?.name || 'Partner') : (s.student?.name || 'Partner'),
          partnerAvatar: s.student?._id === user?._id ? (s.teacher?.name?.slice(0,2).toUpperCase() || 'PR') : (s.student?.name?.slice(0,2).toUpperCase() || 'PR'),
          dateISO: s.date,
          date: new Date(s.date).toLocaleDateString(),
          time: `${s.startTime || ''}${s.endTime ? ` - ${s.endTime}` : ''}`,
          skill: typeof s.skill === 'object' ? (s.skill.name || 'Skill') : String(s.skill),
          type: s.student?._id === user?._id ? 'learning' : 'teaching',
          format: s.meetingLink ? 'Video Call' : 'N/A',
          status: (s.status || 'Pending').toLowerCase(),
          description: s.description || s.notes || '',
          raw: s,
        }));
      setSessions(mapped);
    } else if (schedRes.error) {
      setError(schedRes.error);
    }
    const skillsData = skillsRes.data as any;
    if (skillsData && skillsData.skills && Array.isArray(skillsData.skills)) {
      setSkills(skillsData.skills as any[]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const durations = ["1 hour", "1.5 hours", "2 hours", "2.5 hours", "3 hours"];

  const handleCreate = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!form.skillId) {
      setError('Please select a skill');
      return;
    }
    if (!form.date) {
      setError('Please select a date');
      return;
    }
    if (!form.startTime) {
      setError('Please select a start time');
      return;
    }
    if (!form.endTime) {
      setError('Please select an end time');
      return;
    }
    
    const skill = skills.find((sk: any) => sk._id === form.skillId);
    if (!skill) { 
      setError('Please select a valid skill'); 
      return; 
    }
    const teacherId = skill.offeredBy?._id;
    if (!teacherId) { 
      setError('Selected skill has no teacher'); 
      return; 
    }
    
    // Validate date format
    const selectedDate = new Date(form.date);
    if (isNaN(selectedDate.getTime())) {
      setError('Please enter a valid date');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    const payload = {
      student: user._id,
      teacher: teacherId,
      skill: skill._id,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      status: 'Pending',
      notes: form.notes,
      meetingLink: form.meetingLink,
      description: form.description,
    };
    
    const res = await apiService.createSchedule(payload);
    if (res.error) { 
      setError(res.error); 
      return; 
    }
    
    setShowNewSessionForm(false);
    setForm({ skillId: "", date: "", startTime: "", endTime: "", notes: "", meetingLink: "", description: "" });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      const res = await apiService.deleteSchedule(id);
      if (res.error) { 
        setError(res.error); 
        return; 
      }
      await loadData();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Failed to delete schedule. Please try again.');
    }
  };

  const startEdit = (session: any) => {
    setEditingId(session.id);
    setShowNewSessionForm(true);
    setEditForm({
      skillId: session.raw?.skill?._id || session.raw?.skill,
      date: session.dateISO?.slice(0,10) || "",
      startTime: session.raw?.startTime || "",
      endTime: session.raw?.endTime || "",
      notes: session.raw?.notes || "",
      meetingLink: session.raw?.meetingLink || "",
      status: session.raw?.status || 'Pending',
      description: session.raw?.description || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    // Validate required fields
    if (!editForm.date) {
      setError('Please select a date');
      return;
    }
    if (!editForm.startTime) {
      setError('Please select a start time');
      return;
    }
    if (!editForm.endTime) {
      setError('Please select an end time');
      return;
    }
    
    // Validate date format
    const selectedDate = new Date(editForm.date);
    if (isNaN(selectedDate.getTime())) {
      setError('Please enter a valid date');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    const payload: any = {
      date: editForm.date,
      startTime: editForm.startTime,
      endTime: editForm.endTime,
      notes: editForm.notes,
      meetingLink: editForm.meetingLink,
      status: editForm.status,
      description: editForm.description,
    };
    if (editForm.skillId) payload.skill = editForm.skillId;
    
    const res = await apiService.updateSchedule(editingId, payload);
    if (res.error) { 
      setError(res.error); 
      return; 
    }
    
    setEditingId(null);
    setShowNewSessionForm(false);
    await loadData();
  };



  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Sessions</h1>
          <p className="text-muted-foreground">Manage your learning and teaching sessions</p>
        </div>

        <div className="space-y-8">

          {/* Upcoming Sessions */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Upcoming Sessions</h2>
              <Button onClick={() => setShowNewSessionForm(!showNewSessionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Session
              </Button>
            </div>

            {/* New Session Form */}
            {showNewSessionForm && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Session' : 'Schedule a New Session'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Session Title</label>
                      {editingId ? (
                        <Input placeholder="e.g., React Hooks Deep Dive" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                      ) : (
                        <Input placeholder="e.g., React Hooks Deep Dive" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Choose Skill & Teacher *</label>
                      <Select value={editingId ? editForm.skillId : form.skillId} onValueChange={(v) => editingId ? setEditForm({ ...editForm, skillId: v }) : setForm({ ...form, skillId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill and teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills
                            .filter((sk: any) => sk.offeredBy && sk.offeredBy.name) // Only show skills with valid teachers
                            .length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              No available skills with teachers found.
                              <br />Please check back later or browse skills to find teachers.
                            </div>
                          ) : (
                            skills
                              .filter((sk: any) => sk.offeredBy && sk.offeredBy.name)
                              .map((sk: any) => (
                              <SelectItem key={sk._id} value={sk._id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{sk.name || sk.title || 'Skill'}</span>
                                  <span className="text-sm text-muted-foreground">
                                    by {sk.offeredBy?.name || 'Unknown Teacher'}
                                    {sk.offeredBy?.profile?.location && ` • ${sk.offeredBy.profile.location}`}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Selected Skill Info */}
                  {(editingId ? editForm.skillId : form.skillId) && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const selectedSkill = skills.find((sk: any) => sk._id === (editingId ? editForm.skillId : form.skillId));
                        if (!selectedSkill) return null;
                        return (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                              {selectedSkill.offeredBy?.name ? selectedSkill.offeredBy.name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <div>
                              <p className="font-medium text-blue-900">
                                You'll be learning {selectedSkill.name} with {selectedSkill.offeredBy?.name || 'Unknown Teacher'}
                              </p>
                              <p className="text-sm text-blue-600">
                                {selectedSkill.offeredBy?.profile?.location || 'Location not specified'} • {selectedSkill.category} • {selectedSkill.level} level
                              </p>
                            </div>
                          </div>
                        );
                      })()} 
                    </div>
                  )}

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date *</label>
                      <Input type="date" value={editingId ? editForm.date : form.date} onChange={(e) => editingId ? setEditForm({ ...editForm, date: e.target.value }) : setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Time *</label>
                      <Select value={editingId ? editForm.startTime : form.startTime} onValueChange={(v) => editingId ? setEditForm({ ...editForm, startTime: v }) : setForm({ ...form, startTime: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">End Time *</label>
                      <Select value={editingId ? editForm.endTime : form.endTime} onValueChange={(v) => editingId ? setEditForm({ ...editForm, endTime: v }) : setForm({ ...form, endTime: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Session Description</label>
                    <Textarea 
                      placeholder="What will you cover in this session? Include any preparation materials or goals..."
                      className="min-h-24"
                      value={editingId ? editForm.description : form.description}
                      onChange={(e) => editingId ? setEditForm({ ...editForm, description: e.target.value }) : setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Meeting Link</label>
                      <Input placeholder="https://..." value={editingId ? editForm.meetingLink : form.meetingLink} onChange={(e) => editingId ? setEditForm({ ...editForm, meetingLink: e.target.value }) : setForm({ ...form, meetingLink: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Notes</label>
                      <Textarea placeholder="Add details for your session" value={editingId ? editForm.notes : form.notes} onChange={(e) => editingId ? setEditForm({ ...editForm, notes: e.target.value }) : setForm({ ...form, notes: e.target.value })} />
                    </div>
                  </div>

                  {editingId && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {editingId ? (
                      <Button onClick={handleSaveEdit} disabled={loading}>Save Changes</Button>
                    ) : (
                      <Button onClick={handleCreate} disabled={loading}>Schedule Session</Button>
                    )}
                    <Button variant="outline" onClick={() => setShowNewSessionForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sessions List */}
            <div className="space-y-6">
              {error && (<div className="text-sm text-red-600">{error}</div>)}
              {loading && (<div className="text-sm">Loading sessions...</div>)}
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{session.title}</h3>
                          <Badge variant={session.type === 'learning' ? 'default' : 'secondary'}>
                            {session.type === 'learning' ? 'Learning' : 'Teaching'}
                          </Badge>
                          <Badge 
                            className={
                              session.status === 'confirmed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 mb-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                              {session.partnerAvatar}
                            </div>
                            <span>with {session.partner}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <span>{session.format}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">{session.description}</p>

                        <Badge variant="outline">{session.skill}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { const url = session.raw?.meetingLink || '#'; window.open(url, '_blank', 'noopener'); }}>
                          <Video className="mr-2 h-4 w-4" />
                          Join Session
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => startEdit(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(session.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;