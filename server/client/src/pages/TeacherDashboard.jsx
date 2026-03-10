import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from '../services/api';
import { BookOpen, LogOut, Users, Calendar, Video, BarChart3, X, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const GlassNav = ({ user, onLogout }) => (
  <header className="sticky top-0 z-40" style={{ background: 'rgba(6,6,16,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontFamily: "'DM Sans', sans-serif" }}>
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(6,182,212,0.4))', border: '1px solid rgba(59,130,246,0.4)', boxShadow: '0 0 16px rgba(59,130,246,0.25)' }}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'white', letterSpacing: '-0.02em' }}>Teacher Dashboard</h1>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Manage your courses and attendance</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Avatar className="h-7 w-7">
            <AvatarFallback style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(6,182,212,0.4))', color: 'white', fontSize: '0.75rem', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              {user?.name?.charAt(0) || 'T'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{user?.name}</p>
            <p style={{ fontSize: '0.65rem', color: '#93c5fd' }}>Teacher</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
          <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
        </Button>
      </div>
    </div>
  </header>
);

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try { const r = await api.get('/teacher/courses'); setCourses(r.data.courses || []); }
    catch { toast.error('Failed to fetch courses'); }
    finally { setLoading(false); }
  };

  const handleViewReports = async (course) => {
    setSelectedCourse(course); setShowReports(true);
    setSelectedSession(null); setSessionDetails(null);
    setLoadingReports(true);
    try { const r = await api.get(`/attendance/course/${course._id}/sessions`); setAttendanceSessions(r.data.sessions || []); }
    catch { toast.error('Failed to fetch sessions'); }
    finally { setLoadingReports(false); }
  };

  const fetchSessionDetails = async (sessionId) => {
    setLoadingReports(true);
    try { const r = await api.get(`/attendance/session/${sessionId}/details`); setSessionDetails(r.data); setSelectedSession(sessionId); }
    catch { toast.error('Failed to fetch session details'); }
    finally { setLoadingReports(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const statsData = [
    { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen, iconColor: '#93c5fd', iconBg: 'rgba(59,130,246,0.15)', iconBorder: 'rgba(59,130,246,0.3)' },
    { label: 'Active Sessions', value: '0', icon: Video, iconColor: '#6ee7b7', iconBg: 'rgba(16,185,129,0.15)', iconBorder: 'rgba(16,185,129,0.3)' },
    { label: 'Avg Attendance', value: '--', icon: BarChart3, iconColor: '#fcd34d', iconBg: 'rgba(245,158,11,0.15)', iconBorder: 'rgba(245,158,11,0.3)' },
  ];

  return (
    <div className="min-h-screen relative" style={{ background: '#060610', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="orb orb-1" style={{ background: 'rgba(59,130,246,0.12)' }} />
      <div className="orb orb-2" style={{ background: 'rgba(6,182,212,0.1)' }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <GlassNav user={user} onLogout={handleLogout} />

      <main className="relative z-10 container mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up">
          {statsData.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginBottom: '0.4rem' }}>{s.label}</p>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.iconBg, border: `1px solid ${s.iconBorder}`, color: s.iconColor }}>
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses */}
        <Card className="fade-up-1">
          <CardHeader style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ fontFamily: "'Syne', sans-serif", color: 'white', fontWeight: 700 }}>Your Courses</CardTitle>
                <CardDescription style={{ color: 'rgba(255,255,255,0.38)' }}>Manage and take attendance for your courses</CardDescription>
              </div>
              <Button onClick={() => navigate('/teacher/attendance')}>
                <Video className="w-4 h-4 mr-2" /> Take Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courses.map(course => (
                  <div key={course._id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; e.currentTarget.style.background = 'rgba(59,130,246,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>{course.name}</h3>
                        <span style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.35)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600 }}>{course.code}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <BookOpen className="w-4 h-4" style={{ color: '#93c5fd' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.8rem' }}>
                      <Users className="w-3.5 h-3.5" /> <span>View enrollment details</span>
                    </div>
                    <Separator style={{ marginBottom: '1rem' }} />
                    <div className="flex gap-2">
                      <Button onClick={() => navigate(`/teacher/attendance?courseId=${course._id}`)} className="flex-1" size="sm">
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Take Attendance
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewReports(course)}>
                        <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Reports
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <BookOpen className="w-8 h-8" style={{ color: '#93c5fd' }} />
                </div>
                <h4 style={{ fontFamily: "'Syne', sans-serif", color: 'white', fontWeight: 700, marginBottom: '0.5rem' }}>No Courses Assigned</h4>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Contact your administrator to get courses assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Guide */}
        <Card className="fade-up-2">
          <CardHeader style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <CardTitle style={{ fontFamily: "'Syne', sans-serif", color: 'white', fontWeight: 700, fontSize: '1rem' }}>Quick Guide</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n: '1', title: 'Select a Course', desc: 'Choose the course you want to take attendance for', color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
                { n: '2', title: 'Start Session', desc: 'Click "Take Attendance" to start a live session', color: '#93c5fd', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
                { n: '3', title: 'Allow Camera', desc: 'The system will use your camera to recognize students', color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
                { n: '4', title: 'Close Session', desc: 'When done, close the session to finalize records', color: '#fcd34d', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: step.bg, border: `1px solid ${step.border}`, color: step.color, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.9rem' }}>{step.n}</div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', fontSize: '0.875rem', marginBottom: '0.35rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh', background: 'rgba(8,6,20,0.97)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center justify-between p-6 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}>
                  <BarChart3 className="w-4 h-4" style={{ color: '#93c5fd' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{selectedSession ? 'Session Details' : 'Attendance Reports'}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{selectedCourse?.code} · {selectedCourse?.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setShowReports(false); setSelectedCourse(null); setAttendanceSessions([]); setSelectedSession(null); setSessionDetails(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingReports ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : selectedSession && sessionDetails ? (
                <div className="space-y-5">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedSession(null); setSessionDetails(null); }}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Sessions
                  </Button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Date', value: new Date(sessionDetails.session.startTime).toLocaleDateString(), color: 'white' },
                      { label: 'Time', value: new Date(sessionDetails.session.startTime).toLocaleTimeString(), color: 'white' },
                      { label: 'Present', value: sessionDetails.stats.present, color: '#6ee7b7' },
                      { label: 'Absent', value: sessionDetails.stats.absent, color: '#fca5a5' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>{item.label}</p>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: item.color, fontSize: '1.1rem' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          {['Student ID','Name','Email','Status','Time'].map(h => (
                            <th key={h} className="text-left py-3 px-4" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessionDetails.students.map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="py-3 px-4" style={{ fontSize: '0.8rem', color: '#a78bfa', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{s.studentId}</td>
                            <td className="py-3 px-4" style={{ fontSize: '0.875rem', color: 'white' }}>{s.name}</td>
                            <td className="py-3 px-4" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{s.email}</td>
                            <td className="py-3 px-4">
                              <span style={s.status === 'PRESENT'
                                ? { background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }
                                : { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                {s.status === 'PRESENT' ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />} {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{s.timestamp ? new Date(s.timestamp).toLocaleTimeString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendanceSessions.length > 0 ? attendanceSessions.map(session => (
                    <div key={session.id} className="p-5 rounded-2xl cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                      onClick={() => fetchSessionDetails(session.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                            <Calendar className="w-5 h-5" style={{ color: '#93c5fd' }} />
                          </div>
                          <div>
                            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                              {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h4>
                            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)' }}>
                              {new Date(session.startTime).toLocaleTimeString()} — {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 ml-4">
                          <div className="text-center"><p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#6ee7b7', fontSize: '1.25rem' }}>{session.presentCount}</p><p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Present</p></div>
                          <div className="text-center"><p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#fca5a5', fontSize: '1.25rem' }}>{session.absentCount}</p><p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Absent</p></div>
                          <div className="text-center"><p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: 'white', fontSize: '1.25rem' }}>{session.attendancePercentage}%</p><p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Rate</p></div>
                          <span style={session.status === 'ACTIVE'
                            ? { background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }
                            : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <BarChart3 className="w-8 h-8" style={{ color: '#93c5fd' }} />
                      </div>
                      <h4 style={{ fontFamily: "'Syne', sans-serif", color: 'white', fontWeight: 700, marginBottom: '0.5rem' }}>No Sessions Yet</h4>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>No attendance has been taken for this course yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
