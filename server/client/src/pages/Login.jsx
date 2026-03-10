import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else if (user.role === 'STUDENT') navigate('/student/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
      toast.error('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:'#06060f'}}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-pattern fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-sm px-4 fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl icon-violet border mb-4"
            style={{boxShadow:'0 0 30px rgba(124,92,252,0.25)'}}>
            <Shield className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold shimmer-text mb-1">VerifAI</h1>
          <p className="text-xs text-white/30">AI-Powered Attendance System</p>
        </div>

        {/* Card */}
        <div className="card rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Welcome back</h2>
            <p className="text-xs text-white/35 mt-0.5">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                <Input id="email" type="email" placeholder="admin@verifai.com" value={email}
                  onChange={e=>setEmail(e.target.value)} required disabled={loading}
                  className="pl-9 h-10 text-sm rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                <Input id="password" type="password" placeholder="••••••••" value={password}
                  onChange={e=>setPassword(e.target.value)} required disabled={loading}
                  className="pl-9 h-10 text-sm rounded-xl" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2.5 px-3 rounded-xl">
                <p className="text-xs">{error}</p>
              </Alert>
            )}

            <Button type="submit" className="w-full h-10 rounded-xl font-semibold text-sm" disabled={loading}
              style={{background:'linear-gradient(135deg,#7c5cfc,#4f8ef7)',boxShadow:'0 4px 15px rgba(124,92,252,0.35)'}}>
              {loading
                ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Signing in...</>
                : <>Sign In <ArrowRight className="ml-2 h-3.5 w-3.5" /></>
              }
            </Button>
          </form>
        </div>

        {/* Role badges */}
        <div className="mt-5 flex justify-center gap-2">
          {['admin','teacher','student'].map(r => (
            <span key={r} className={`px-2 py-0.5 rounded text-[10px] font-bold badge-${r}`}>
              {r.charAt(0).toUpperCase()+r.slice(1)}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-white/18 mt-3">Secure biometric attendance tracking</p>
      </div>
    </div>
  );
};

export default Login;
