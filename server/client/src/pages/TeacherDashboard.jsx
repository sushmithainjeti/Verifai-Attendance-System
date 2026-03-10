import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from '../services/api';
import { BookOpen, Users, Calendar, Video, BarChart3, X, ArrowLeft } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, colorClass, iconClass, iconColor }) => (
  <Card className={`rounded-2xl ${colorClass}`}>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-white/45 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${iconClass}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
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
    try { const r = await api.get('/teacher/courses'); setCourses(r.data.courses||[]); }
    catch { toast.error('Failed to fetch courses'); }
    finally { setLoading(false); }
  };

  const handleViewReports = async (course) => {
    setSelectedCourse(course); setShowReports(true);
    setSelectedSession(null); setSessionDetails(null);
    await fetchAttendanceSessions(course._id);
  };

  const fetchAttendanceSessions = async (courseId) => {
    setLoadingReports(true);
    try { const r = await api.get(`/attendance/course/${courseId}/sessions`); setAttendanceSessions(r.data.sessions||[]); }
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
  const handleStartAttendance = (courseId) => navigate(`/teacher/attendance?courseId=${courseId}`);
  const handleCloseReports = () => { setShowReports(false); setSelectedCourse(null); setAttendanceSessions([]); setSelectedSession(null); setSessionDetails(null); };

  return (
    <div className="min-h-screen relative" style={{background:'#06060f'}}>
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="relative z-10">
        <DashboardNav user={user} icon={BookOpen} title="Teacher Dashboard" subtitle="Manage your courses and attendance" onLogout={handleLogout} />

        <main className="container mx-auto px-6 py-7 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up">
            <StatCard label="Total Courses"   value={courses.length} icon={BookOpen}  colorClass="stat-violet" iconClass="icon-violet" iconColor="text-violet-400" />
            <StatCard label="Active Sessions" value={0}              icon={Video}     colorClass="stat-blue"   iconClass="icon-blue"   iconColor="text-blue-400" />
            <StatCard label="Avg Attendance"  value="--"             icon={BarChart3} colorClass="stat-green"  iconClass="icon-green"  iconColor="text-green-400" />
          </div>

          {/* Courses */}
          <Card className="rounded-2xl fade-in-up-2">
            <CardHeader className="px-6 pt-6 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-white">Your Courses</CardTitle>
                  <p className="text-xs text-white/35 mt-0.5">Manage and take attendance for your courses</p>
                </div>
                <Button className="h-9 rounded-xl text-xs font-semibold" onClick={() => navigate('/teacher/attendance')}>
                  <Video className="w-3.5 h-3.5 mr-1.5" />Take Attendance
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1,2].map(i=><Skeleton key={i} className="h-44 rounded-2xl"/>)}
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <Card key={course._id} className="rounded-2xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold text-white">{course.name}</CardTitle>
                            <span className="badge-teacher px-2 py-0.5 rounded text-[10px] font-bold mt-1.5 inline-block">{course.code}</span>
                          </div>
                          <div className="w-9 h-9 rounded-xl icon-violet border flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Users className="w-3.5 h-3.5" />
                          <span>View enrollment details</span>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                          <Button className="flex-1 h-8 rounded-xl text-xs font-semibold"
                            onClick={() => handleStartAttendance(course._id)}>
                            <Video className="w-3.5 h-3.5 mr-1.5" />Take Attendance
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs"
                            onClick={() => handleViewReports(course)}>
                            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />Reports
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14">
                  <div className="w-12 h-12 rounded-2xl icon-violet border flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">No Courses Assigned</p>
                  <p className="text-xs text-white/30">Contact your administrator to get courses assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Guide */}
          <Card className="rounded-2xl fade-in-up-3" style={{background:'rgba(124,92,252,0.05)',borderColor:'rgba(124,92,252,0.12)'}}>
            <CardHeader className="px-6 pt-5 pb-3">
              <CardTitle className="text-sm font-semibold text-white">Quick Guide</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {[
                  ['Select a Course','Choose the course you want to take attendance for'],
                  ['Start Session','Click "Take Attendance" to start a live session'],
                  ['Allow Camera Access','The AI will use your camera to recognize students'],
                  ['Close Session','When done, close the session to finalize records'],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg icon-violet border flex items-center justify-center flex-shrink-0 text-xs font-bold text-violet-400">
                      {i+1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
                      <p className="text-xs text-white/35">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(12px)'}}>
          <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
            style={{background:'rgba(8,7,20,0.98)',border:'1px solid rgba(255,255,255,0.1)',boxShadow:'0 30px 80px rgba(0,0,0,0.8)'}}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
              <div>
                <h2 className="text-base font-semibold text-white">{selectedSession?'Session Details':'Attendance Reports'}</h2>
                <p className="text-xs text-white/35 mt-0.5">{selectedCourse?.code} · {selectedCourse?.name}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={handleCloseReports}>
                <X className="w-4 h-4"/>
              </Button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingReports ? (
                <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-20 rounded-2xl"/>)}</div>
              ) : selectedSession && sessionDetails ? (
                <div className="space-y-5">
                  <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs" onClick={() => {setSelectedSession(null);setSessionDetails(null);}}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5"/>Back to Sessions
                  </Button>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {label:'Date', value:new Date(sessionDetails.session.startTime).toLocaleDateString()},
                      {label:'Time', value:new Date(sessionDetails.session.startTime).toLocaleTimeString()},
                      {label:'Present', value:<span className="text-green-400">{sessionDetails.stats.present}</span>},
                      {label:'Absent',  value:<span className="text-red-400">{sessionDetails.stats.absent}</span>},
                    ].map((s,i)=>(
                      <div key={i} className="rounded-xl p-4 text-center" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                        <p className="text-xs text-white/40 mb-1">{s.label}</p>
                        <p className="text-base font-bold text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                    <table className="w-full">
                      <thead style={{background:'rgba(255,255,255,0.03)'}}>
                        <tr>
                          {['Student ID','Name','Email','Status','Time'].map(h=>(
                            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-white/40 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessionDetails.students.map(s=>(
                          <tr key={s.id} className="border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
                            <td className="py-3 px-4 text-xs text-white/50">{s.studentId}</td>
                            <td className="py-3 px-4 text-sm font-medium text-white">{s.name}</td>
                            <td className="py-3 px-4 text-xs text-white/40">{s.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status==='PRESENT'?'badge-active':'px-2 py-0.5 rounded text-[10px]'}`}
                                style={s.status!=='PRESENT'?{background:'rgba(239,68,68,0.15)',color:'#fca5a5',border:'1px solid rgba(239,68,68,0.25)'}:{}}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-white/40">{s.timestamp?new Date(s.timestamp).toLocaleTimeString():'-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : attendanceSessions.length > 0 ? (
                <div className="space-y-3">
                  {attendanceSessions.map(session => (
                    <div key={session.id}
                      className="rounded-2xl p-5 cursor-pointer transition-all hover:border-violet-500/30"
                      style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}
                      onClick={() => fetchSessionDetails(session.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl icon-violet border flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {new Date(session.date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
                            </p>
                            <p className="text-xs text-white/35 mt-0.5">
                              {new Date(session.startTime).toLocaleTimeString()} — {session.endTime?new Date(session.endTime).toLocaleTimeString():'Ongoing'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 ml-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-400">{session.presentCount}</p>
                            <p className="text-xs text-white/35">Present</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-red-400">{session.absentCount}</p>
                            <p className="text-xs text-white/35">Absent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-white">{session.attendancePercentage}%</p>
                            <p className="text-xs text-white/35">Rate</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${session.status==='ACTIVE'?'badge-active':'badge-closed'}`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-2xl icon-violet border flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">No Attendance Sessions</p>
                  <p className="text-xs text-white/30">No attendance has been taken for this course yet</p>
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
