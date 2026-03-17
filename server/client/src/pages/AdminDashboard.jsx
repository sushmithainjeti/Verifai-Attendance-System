import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { Users, BookOpen, UserPlus, GraduationCap, LogOut, Settings, Activity, Loader2, X, Trash2, Camera, Shield } from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [userForm, setUserForm] = useState({ name:'', email:'', password:'', role:'STUDENT' });
  const [studentForm, setStudentForm] = useState({ studentId:'', department:'', year:1, section:'' });
  const [courseForm, setCourseForm] = useState({ code:'', name:'', department:'', year:1, section:'', teacherId:'' });
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturingFace, setCapturingFace] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => { loadFaceModels(); }, []);
  useEffect(() => {
    if (activeTab==='users') fetchUsers();
    else if (activeTab==='courses') fetchCourses();
    else if (activeTab==='overview') fetchStats();
  }, [activeTab]);

  const loadFaceModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
    } catch { toast.error('Face recognition models not loaded'); }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [u,s,c] = await Promise.all([api.get('/admin/users'),api.get('/admin/students'),api.get('/admin/courses')]);
      setUsers(u.data.users||[]); setStudents(s.data.students||[]); setCourses(c.data.courses||[]);
    } catch { toast.error('Failed to fetch statistics'); } finally { setLoading(false); }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try { const r=await api.get('/admin/users'); setUsers(r.data.users||[]); }
    catch { toast.error('Failed to fetch users'); } finally { setLoading(false); }
  };
  const fetchCourses = async () => {
    setLoading(true);
    try { const r=await api.get('/admin/courses'); setCourses(r.data.courses||[]); }
    catch { toast.error('Failed to fetch courses'); } finally { setLoading(false); }
  };

  const captureFace = async () => {
    if (!modelsLoaded) { toast.error('Face models not loaded yet'); return; }
    setShowFaceCapture(true); setCapturingFace(true);
    await new Promise(r=>setTimeout(r,100));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:{width:640,height:480}});
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setCapturingFace(false); toast.success('Camera ready'); };
      }
    } catch { toast.error('Failed to access camera'); setShowFaceCapture(false); setCapturingFace(false); }
  };

  const processFaceCapture = async () => {
    if (!videoRef.current) { toast.error('Video not ready'); return; }
    setCapturingFace(true);
    try {
      const det = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (!det) { toast.error('No face detected. Try again.'); setCapturingFace(false); return; }
      const embedding = Array.from(det.descriptor);
      if (editingUser) {
        await api.post('/admin/face/register',{userId:editingUser.id||editingUser._id,embedding});
        toast.success('Face updated!'); setEditingUser(null);
      } else { setFaceEmbedding(embedding); toast.success('Face captured!'); }
      if (videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop());
      setShowFaceCapture(false); setCapturingFace(false);
    } catch(e) { toast.error('Failed: '+e.message); setCapturingFace(false); }
  };

  const cancelFaceCapture = () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop());
    setShowFaceCapture(false); setCapturingFace(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (userForm.role==='STUDENT' && !faceEmbedding) { toast.error('Please capture student face first'); return; }
    setLoading(true);
    try {
      const payload={...userForm};
      if (userForm.role==='STUDENT' && studentForm.studentId) payload.studentData=studentForm;
      const res = await api.post('/admin/users',payload);
      if (userForm.role==='STUDENT' && faceEmbedding) {
        await api.post('/admin/face/register',{userId:res.data.user.id,embedding:faceEmbedding});
        toast.success('Student created & face registered');
      } else { toast.success('User created'); }
      setShowUserForm(false);
      setUserForm({name:'',email:'',password:'',role:'STUDENT'});
      setStudentForm({studentId:'',department:'',year:1,section:''});
      setFaceEmbedding(null); fetchUsers();
    } catch(e) { toast.error(e.response?.data?.error||'Failed to create user'); } finally { setLoading(false); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/admin/courses',courseForm); toast.success('Course created'); setShowCourseForm(false); setCourseForm({code:'',name:'',department:'',year:1,section:'',teacherId:''}); fetchCourses(); }
    catch(e) { toast.error(e.response?.data?.error||'Failed'); } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch(e) { toast.error('Failed to delete'); }
  };
  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return;
    try { await api.delete(`/admin/courses/${id}`); toast.success('Course deleted'); fetchCourses(); }
    catch { toast.error('Failed to delete'); }
  };

  const stats = [
    { label:'Total Students', value:students.length, icon:GraduationCap, cls:'stat-purple', icls:'icon-purple' },
    { label:'Total Teachers', value:users.filter(u=>u.role==='TEACHER').length, icon:Users, cls:'stat-blue', icls:'icon-blue' },
    { label:'Total Courses',  value:courses.length, icon:BookOpen, cls:'stat-teal', icls:'icon-teal' },
    { label:'Active Sessions',value:0, icon:Activity, cls:'stat-orange', icls:'icon-orange' },
  ];

  const roleBadge = (role) => {
    if (role==='ADMIN') return <span className="badge-admin">{role}</span>;
    if (role==='TEACHER') return <span className="badge-teacher">{role}</span>;
    return <span className="badge-student">{role}</span>;
  };

  return (
    <div className="min-h-screen relative">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[110px]" style={{background:'#7c5cfc',opacity:0.11,top:'-120px',left:'-100px'}} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px]" style={{background:'#3b82f6',opacity:0.08,bottom:'-80px',right:'-80px'}} />
      </div>

      {/* ── Header ── */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#7c5cfc,#3b82f6)'}}>
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-tight">Admin Dashboard</h1>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.38)'}}>VerifAI System Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{user?.name?.charAt(0)||'A'}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
              <span className="badge-admin">ADMIN</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }} className="ml-2 gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 container mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s,i) => (
            <div key={i} className={`glass-card p-5 ${s.cls}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium mb-1" style={{color:'rgba(255,255,255,0.5)'}}>{s.label}</p>
                  <h3 className="text-3xl font-black text-white">{s.value}</h3>
                </div>
                <div className={`w-11 h-11 flex items-center justify-center ${s.icls}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Management */}
        <div className="glass-card p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">System Management</h2>
            <p className="text-sm" style={{color:'rgba(255,255,255,0.38)'}}>Manage users and courses</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Students & Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-white">Quick Actions</h3>
                  <Separator />
                  <div className="space-y-3">
                    <Button className="btn-glow w-full justify-start font-semibold" onClick={() => { setActiveTab("users"); setShowUserForm(true); }}>
                      <UserPlus className="w-4 h-4 mr-2" /> Create Student User
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { setActiveTab("courses"); setShowCourseForm(true); }}>
                      <BookOpen className="w-4 h-4 mr-2" /> Create New Course
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-white">System Summary</h3>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {[['Total Users',users.length],['Total Students',students.length],['Total Courses',courses.length],['Total Teachers',users.filter(u=>u.role==='TEACHER').length]].map(([label,val],i)=>(
                      <div key={i} className="flex justify-between py-2" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                        <span style={{color:'rgba(255,255,255,0.45)'}}>{label}</span>
                        <span className="font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users" className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">Students & Users</h3>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.38)'}}>Create accounts and manage roles</p>
                </div>
                {!showUserForm && (
                  <Button className="btn-glow gap-1.5 font-semibold" onClick={() => setShowUserForm(true)}>
                    <UserPlus className="w-4 h-4" /> Add User
                  </Button>
                )}
              </div>
              <Separator />

              {showUserForm && (
                <div className="glass-card p-6" style={{border:'1px solid rgba(124,92,252,0.25)'}}>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-white">Create New User</h4>
                    <button onClick={() => setShowUserForm(false)} style={{color:'rgba(255,255,255,0.4)'}} className="hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Full Name</Label><Input value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})} placeholder="Full name" required /></div>
                      <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={userForm.email} onChange={e=>setUserForm({...userForm,email:e.target.value})} placeholder="email@example.com" required /></div>
                      <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={userForm.password} onChange={e=>setUserForm({...userForm,password:e.target.value})} placeholder="Password" required /></div>
                      <div className="space-y-1.5"><Label>Role</Label>
                        <Select value={userForm.role} onValueChange={v=>setUserForm({...userForm,role:v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="STUDENT">Student</SelectItem><SelectItem value="TEACHER">Teacher</SelectItem><SelectItem value="ADMIN">Admin</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    {userForm.role==='STUDENT' && (
                      <>
                        <Separator />
                        <p className="text-xs font-bold tracking-widest" style={{color:'#a78bfa'}}>STUDENT DETAILS</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5"><Label>Student ID</Label><Input value={studentForm.studentId} onChange={e=>setStudentForm({...studentForm,studentId:e.target.value})} placeholder="e.g. 2024001" required /></div>
                          <div className="space-y-1.5"><Label>Department</Label><Input value={studentForm.department} onChange={e=>setStudentForm({...studentForm,department:e.target.value})} placeholder="e.g. Computer Science" required /></div>
                          <div className="space-y-1.5"><Label>Year</Label>
                            <Select value={studentForm.year.toString()} onValueChange={v=>setStudentForm({...studentForm,year:parseInt(v)})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{[1,2,3,4].map(y=><SelectItem key={y} value={y.toString()}>{y}{['st','nd','rd','th'][y-1]} Year</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5"><Label>Section</Label><Input value={studentForm.section} onChange={e=>setStudentForm({...studentForm,section:e.target.value})} placeholder="e.g. A" required /></div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">Face Registration</p>
                            <p className="text-xs" style={{color:'rgba(255,255,255,0.38)'}}>Required for biometric attendance</p>
                          </div>
                          {faceEmbedding
                            ? <span className="badge-active flex items-center gap-1"><Camera className="w-3 h-3" />Captured</span>
                            : <span style={{background:'rgba(239,68,68,0.15)',color:'#fca5a5',border:'1px solid rgba(239,68,68,0.3)',borderRadius:6,padding:'2px 9px',fontSize:'0.7rem',fontWeight:600}}>Not Captured</span>
                          }
                        </div>
                        <Button type="button" variant="outline" className="w-full gap-2" onClick={captureFace} disabled={!modelsLoaded||capturingFace}>
                          <Camera className="w-4 h-4" />{faceEmbedding?'Re-capture Face':'Capture Face'}
                        </Button>
                      </>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={loading} className="btn-glow font-semibold">
                        {loading?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Creating...</>:'Create User'}
                      </Button>
                      <Button type="button" variant="outline" onClick={()=>setShowUserForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : users.length > 0 ? (
                <div className="glass-card overflow-hidden" style={{padding:0}}>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(u=>(
                        <TableRow key={u._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8"><AvatarFallback>{u.name?.charAt(0)||'U'}</AvatarFallback></Avatar>
                              <span className="font-medium">{u.name}</span>
                            </div>
                          </TableCell>
                          <TableCell style={{color:'rgba(255,255,255,0.5)'}}>{u.email}</TableCell>
                          <TableCell>{roleBadge(u.role)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {u.role==='STUDENT'&&<Button variant="ghost" size="sm" onClick={()=>{setEditingUser(u);captureFace();}} title="Update Face"><Camera className="w-4 h-4"/></Button>}
                              <Button variant="ghost" size="sm" onClick={()=>handleDeleteUser(u._id)}><Trash2 className="w-4 h-4 text-red-400"/></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : !showUserForm && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 icon-purple"><Users className="w-6 h-6"/></div>
                  <h4 className="font-bold text-white mb-2">No Users Yet</h4>
                  <p className="text-sm mb-4" style={{color:'rgba(255,255,255,0.38)'}}>Create your first user to get started</p>
                  <Button className="btn-glow gap-2 font-semibold" onClick={()=>setShowUserForm(true)}><UserPlus className="w-4 h-4"/>Create First User</Button>
                </div>
              )}
            </TabsContent>

            {/* Courses */}
            <TabsContent value="courses" className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">Course Management</h3>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.38)'}}>Create courses, assign teachers, enroll students</p>
                </div>
                {!showCourseForm && (
                  <Button className="btn-glow gap-1.5 font-semibold" onClick={()=>setShowCourseForm(true)}>
                    <BookOpen className="w-4 h-4"/>Add Course
                  </Button>
                )}
              </div>
              <Separator />

              {showCourseForm && (
                <div className="glass-card p-6" style={{border:'1px solid rgba(59,130,246,0.25)'}}>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-bold text-white">Create New Course</h4>
                    <button onClick={()=>setShowCourseForm(false)} style={{color:'rgba(255,255,255,0.4)'}} className="hover:text-white"><X className="w-4 h-4"/></button>
                  </div>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Course Code</Label><Input value={courseForm.code} onChange={e=>setCourseForm({...courseForm,code:e.target.value})} placeholder="e.g. CS101" required /></div>
                      <div className="space-y-1.5"><Label>Course Name</Label><Input value={courseForm.name} onChange={e=>setCourseForm({...courseForm,name:e.target.value})} placeholder="e.g. Introduction to Programming" required /></div>
                      <div className="space-y-1.5"><Label>Department</Label><Input value={courseForm.department} onChange={e=>setCourseForm({...courseForm,department:e.target.value})} placeholder="e.g. Computer Science" required /></div>
                      <div className="space-y-1.5"><Label>Year</Label>
                        <Select value={courseForm.year.toString()} onValueChange={v=>setCourseForm({...courseForm,year:parseInt(v)})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{[1,2,3,4].map(y=><SelectItem key={y} value={y.toString()}>{y}{['st','nd','rd','th'][y-1]} Year</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5"><Label>Section</Label><Input value={courseForm.section} onChange={e=>setCourseForm({...courseForm,section:e.target.value})} placeholder="e.g. A" required /></div>
                      <div className="space-y-1.5"><Label>Assign Teacher</Label>
                        <Select value={courseForm.teacherId} onValueChange={v=>setCourseForm({...courseForm,teacherId:v})}>
                          <SelectTrigger><SelectValue placeholder="Select teacher"/></SelectTrigger>
                          <SelectContent>{users.filter(u=>u.role==='TEACHER').map(t=><SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={loading} className="btn-glow font-semibold">
                        {loading?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Creating...</>:'Create Course'}
                      </Button>
                      <Button type="button" variant="outline" onClick={()=>setShowCourseForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-14 w-full"/>)}</div>
              ) : courses.length > 0 ? (
                <div className="glass-card overflow-hidden" style={{padding:0}}>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Year/Section</TableHead><TableHead>Teacher</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map(c=>{
                        const teacher = users.find(u => u._id?.toString() === c.teacherId?.toString());
                        return (
                          <TableRow key={c._id}>
                            <TableCell><span className="font-bold" style={{color:'#a78bfa'}}>{c.code}</span></TableCell>
                            <TableCell>{c.name}</TableCell>
                            <TableCell style={{color:'rgba(255,255,255,0.5)'}}>{c.department}</TableCell>
                            <TableCell style={{color:'rgba(255,255,255,0.5)'}}>Y{c.year} · {c.section}</TableCell>
                            <TableCell style={{color:'rgba(255,255,255,0.5)'}}>{c.teacherId?.name||'Unassigned'}</TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={()=>handleDeleteCourse(c._id)}><Trash2 className="w-4 h-4 text-red-400"/></Button></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : !showCourseForm && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 icon-blue"><BookOpen className="w-6 h-6"/></div>
                  <h4 className="font-bold text-white mb-2">No Courses Yet</h4>
                  <p className="text-sm mb-4" style={{color:'rgba(255,255,255,0.38)'}}>Create your first course to begin managing attendance</p>
                  <Button className="btn-glow gap-2 font-semibold" onClick={()=>setShowCourseForm(true)}><BookOpen className="w-4 h-4"/>Create First Course</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Face Capture Modal */}
      {showFaceCapture && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}}>
          <div className="glass-card w-full max-w-2xl p-0 overflow-hidden" style={{border:'1px solid rgba(124,92,252,0.3)'}}>
            <div className="flex items-center justify-between p-5" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <h3 className="font-bold text-white">Capture Student Face</h3>
              <button onClick={cancelFaceCapture} style={{color:'rgba(255,255,255,0.4)'}} className="hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative bg-black rounded-xl overflow-hidden" style={{border:'1px solid rgba(124,92,252,0.2)'}}>
                <video ref={videoRef} autoPlay muted playsInline width="640" height="480" className="w-full" />
                <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 w-full" />
                {capturingFace && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto"/>
                      <p className="text-white text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-center text-sm" style={{color:'rgba(255,255,255,0.45)'}}>
                {capturingFace?'Initializing...':'Position the student\'s face in the center of the frame'}
              </p>
              <div className="flex gap-3">
                <Button onClick={processFaceCapture} disabled={capturingFace} className="btn-glow flex-1 font-semibold gap-2">
                  <Camera className="w-4 h-4"/>Capture Face
                </Button>
                <Button variant="outline" onClick={cancelFaceCapture} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
