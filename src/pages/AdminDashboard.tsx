import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Search, Filter, Calendar, MessageSquare, User, Trash2, Activity, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [auditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const [u, s, sch, m, statsRes, auditRes] = await Promise.all([
      apiService.adminListUsers(),
      apiService.adminListSkills(),
      apiService.adminListSchedules(),
      apiService.adminListMessages(),
      apiService.adminGetStats(),
      apiService.adminGetAuditLogs(auditPage, 50, auditActionFilter),
    ]);
    if (u.error) setError(u.error); else setUsers((u.data as any[]) || []);
    if (s.error) setError(s.error); else setSkills((s.data as any[]) || []);
    if (sch.error) setError(sch.error); else setSchedules((sch.data as any[]) || []);
    if (m.error) setError(m.error); else setMessages((m.data as any[]) || []);
    if (statsRes.error) setError(statsRes.error); else setStats(statsRes.data);
    if (auditRes.error) setError(auditRes.error); else setAuditLogs((auditRes.data?.logs as any[]) || []);

    // Load pending document verifications
    const docsRes = await apiService.getPendingVerifications();
    if (!docsRes.error) setPendingDocs((docsRes.data as any)?.users || []);

    setLoading(false);
  };

  useEffect(() => { loadData(); }, [auditPage, auditActionFilter]);

  useEffect(() => {
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} hideDashboard={true} />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, skills, and monitor activity</p>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="mt-3 px-5 py-2.5 text-white font-semibold rounded-2xl flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            <TrendingUp className="w-4 h-4" /> View Analytics
          </button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.userCount}</p>
                  </div>
                  <User className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Skills Offered</p>
                    <p className="text-2xl font-bold">{stats.skillCount}</p>
                  </div>
                  <Filter className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                    <p className="text-2xl font-bold">{stats.scheduleCount}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Messages</p>
                    <p className="text-2xl font-bold">{stats.messageCount}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="verifications">
              Verifications {pendingDocs.length > 0 && `(${pendingDocs.length})`}
            </TabsTrigger>
          </TabsList>

          {/* ══ USERS TAB ══ */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && (
                  <div className="space-y-3">
                    {users
                      .filter(u =>
                        searchTerm === '' ||
                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <div key={u._id} className="flex items-center justify-between border rounded p-3">
                          <div>
                            <div className="font-medium">
                              {u.name}
                              {u.isAdmin && <Badge variant="secondary" className="ml-2">Admin</Badge>}
                              {u.profile?.isBanned && <Badge variant="destructive" className="ml-2">Banned</Badge>}
                              {u.isVerified && <Badge className="ml-2 bg-emerald-100 text-emerald-700">Verified ✅</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">{u.email}</div>
                            <div className="text-xs text-muted-foreground">Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={async () => {
                              const res = await apiService.adminSetUserAdmin(u._id, !u.isAdmin);
                              if (!(res as any).error) loadData();
                              else setError((res as any).error);
                            }}>{u.isAdmin ? 'Revoke Admin' : 'Make Admin'}</Button>
                            <Button
                              variant={u.profile?.isBanned ? "outline" : "destructive"}
                              size="sm"
                              onClick={async () => {
                                try {
                                  const res = u.profile?.isBanned
                                    ? await apiService.adminUnbanUser(u._id)
                                    : await apiService.adminBanUser(u._id);
                                  if (!(res as any).error) loadData();
                                  else setError((res as any).error);
                                } catch (err) {
                                  setError(u.profile?.isBanned ? 'Failed to unban user' : 'Failed to ban user');
                                }
                              }}>
                              {u.profile?.isBanned ? 'Unban' : 'Ban'}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ SKILLS TAB ══ */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Skills ({skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && (
                  <div className="space-y-3">
                    {skills
                      .filter(s =>
                        searchTerm === '' ||
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.offeredBy?.name && s.offeredBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((s) => (
                        <div key={s._id} className="flex items-center justify-between border rounded p-3">
                          <div>
                            <div className="font-medium">{s.name}</div>
                            <div className="text-sm text-muted-foreground">{s.category} • {s.offeredBy?.name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">Created: {new Date(s.createdAt).toLocaleDateString()}</div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={async () => {
                            const res = await apiService.adminDeleteSkill(s._id);
                            if (!(res as any).error) loadData();
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ SCHEDULES TAB ══ */}
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedules ({schedules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && (
                  <div className="space-y-3">
                    {schedules.map((s) => (
                      <div key={s._id} className="flex items-center justify-between border rounded p-3">
                        <div>
                          <div className="font-medium">{s.skill?.name || 'Unknown Skill'}</div>
                          <div className="text-sm text-muted-foreground">{s.student?.name} → {s.teacher?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(s.date).toLocaleDateString()} • {s.startTime} - {s.endTime}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={s.status === 'Confirmed' ? 'default' : 'secondary'}>{s.status}</Badge>
                          <Button variant="destructive" size="sm" onClick={async () => {
                            const res = await apiService.adminDeleteSchedule(s._id);
                            if (!(res as any).error) loadData();
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ MESSAGES TAB ══ */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m._id} className="flex items-center justify-between border rounded p-3">
                        <div className="flex-1">
                          <div className="font-medium">{m.sender?.name} → {m.receiver?.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{m.content}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={async () => {
                          const res = await apiService.adminDeleteMessage(m._id);
                          if (!(res as any).error) loadData();
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ AUDIT LOGS TAB ══ */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Logs ({auditLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={auditActionFilter} onValueChange={setAuditActionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="USER_BANNED">User Banned</SelectItem>
                      <SelectItem value="USER_UNBANNED">User Unbanned</SelectItem>
                      <SelectItem value="USER_ADMIN_GRANTED">Admin Granted</SelectItem>
                      <SelectItem value="SKILL_DELETED">Skill Deleted</SelectItem>
                      <SelectItem value="SCHEDULE_DELETED">Schedule Deleted</SelectItem>
                      <SelectItem value="MESSAGE_DELETED">Message Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && !error && (
                  <div className="space-y-3">
                    {auditLogs
                      .filter(log =>
                        (searchTerm === '' ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                        (auditActionFilter === 'all' || auditActionFilter === '' || log.action === auditActionFilter)
                      )
                      .map((log) => (
                        <div key={log._id} className="flex items-center justify-between border rounded p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {log.action.includes('DELETE') ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : log.action.includes('ADMIN') ? (
                                <Shield className="h-4 w-4 text-blue-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{log.action.replace(/_/g, ' ')}</div>
                              <div className="text-sm text-muted-foreground">
                                {log.targetType} • by {log.admin?.name || 'System'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(log.createdAt).toLocaleString()}
                              </div>
                              {log.details && (
                                <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">{log.targetType}</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ VERIFICATIONS TAB ══ */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Document Verifications ({pendingDocs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingDocs.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                    <p className="font-semibold">All caught up!</p>
                    <p className="text-sm">No pending verifications right now.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDocs.map((u) => (
                      <div key={u._id} className="border rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Document: <span className="font-semibold capitalize">
                                {u.documentType === 'college_id' ? 'College ID Card' : 'Aadhaar Card'}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(u.documentSubmittedAt).toLocaleString()}
                            </p>
                          </div>

                          {/* Document image preview */}
                          {u.documentPath && (
                            <a
                              href={`http://localhost:5000/uploads/${u.documentPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <img
                                src={`http://localhost:5000/uploads/${u.documentPath}`}
                                alt="Uploaded document"
                                className="w-28 h-20 object-cover rounded-lg border hover:opacity-80 transition-opacity cursor-pointer"
                                onError={(e) => { (e.target as any).style.display = 'none'; }}
                              />
                              <p className="text-xs text-violet-600 text-center mt-1 font-semibold">
                                Click to view full
                              </p>
                            </a>
                          )}
                        </div>

                        {/* Reject reason + action buttons */}
                        <div className="mt-4">
                          <Input
                            placeholder="Rejection reason (leave blank if approving)"
                            value={rejectReason[u._id] || ''}
                            onChange={(e) => setRejectReason(prev => ({ ...prev, [u._id]: e.target.value }))}
                            className="text-sm mb-3"
                          />
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={async () => {
                                const res = await apiService.approveDocument(u._id);
                                if (!(res as any).error) {
                                  loadData();
                                } else {
                                  setError((res as any).error);
                                }
                              }}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Approve ✅
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={async () => {
                                const res = await apiService.rejectDocument(
                                  u._id,
                                  rejectReason[u._id] || 'Document unclear or invalid. Please re-upload.'
                                );
                                if (!(res as any).error) {
                                  loadData();
                                } else {
                                  setError((res as any).error);
                                }
                              }}>
                              <Trash2 className="w-4 h-4 mr-2" /> Reject ❌
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
