import { useNavigate } from 'react-router-dom';
import { Shield, Users, Lock, BarChart3, Zap, Cloud, ArrowRight, Scan, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const features = [
  { icon: Users,     color: 'text-violet-400', bg: 'icon-violet', title: 'Multi-Face Detection',  desc: 'Detect and recognize multiple students simultaneously in real time.' },
  { icon: Lock,      color: 'text-blue-400',   bg: 'icon-blue',   title: 'AES-256 Encryption',    desc: 'All face embeddings encrypted with AES-256-GCM. No raw images stored.' },
  { icon: Shield,    color: 'text-cyan-400',   bg: 'icon-cyan',   title: 'Role-Based Access',     desc: 'Separate dashboards and permissions for Admins, Teachers, and Students.' },
  { icon: BarChart3, color: 'text-green-400',  bg: 'icon-green',  title: 'Attendance Reports',    desc: 'Detailed records and CSV exports for any course or student.' },
  { icon: Zap,       color: 'text-amber-400',  bg: 'icon-amber',  title: 'Live Sessions',         desc: 'Start and close live attendance sessions with instant AI recognition.' },
  { icon: Cloud,     color: 'text-violet-400', bg: 'icon-violet', title: 'Cloud Powered',         desc: 'Built on MongoDB Atlas, Railway, and Vercel for 24/7 availability.' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{background:'#06060f'}}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-pattern fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg icon-violet border">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-lg font-bold shimmer-text">VerifAI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30 hidden sm:block">AI-Powered Attendance</span>
              <Button size="sm" onClick={() => navigate('/login')} className="rounded-xl h-8 px-4 text-xs font-semibold"
                style={{background:'linear-gradient(135deg,#7c5cfc,#4f8ef7)',boxShadow:'0 4px 15px rgba(124,92,252,0.35)'}}>
                Login <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="text-center px-6 pt-20 pb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 fade-in-up"
            style={{background:'rgba(124,92,252,0.12)',border:'1px solid rgba(124,92,252,0.25)'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 glow-pulse" />
            <span className="text-xs font-medium text-violet-300">Powered by Face Recognition AI</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold mb-4 fade-in-up-1 leading-none tracking-tight shimmer-text">
            VerifAI
          </h1>
          <p className="text-xl sm:text-2xl font-light text-white/55 mb-3 fade-in-up-2">AI-Powered Attendance System</p>
          <p className="text-sm text-white/35 mb-10 max-w-lg mx-auto leading-relaxed fade-in-up-3">
            Automate attendance with real-time biometric face recognition. AES-256 encrypted, role-based, and built for modern classrooms.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-14 fade-in-up-4">
            <Button size="lg" onClick={() => navigate('/login')} className="rounded-xl px-8 font-semibold h-12"
              style={{background:'linear-gradient(135deg,#7c5cfc,#4f8ef7)',boxShadow:'0 6px 25px rgba(124,92,252,0.4)'}}>
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}
              className="rounded-xl px-8 font-semibold h-12">
              Learn More
            </Button>
          </div>

          <div className="glow-line mb-10 opacity-50" />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {val:'Real-Time', label:'Face Recognition'},
              {val:'AES-256',   label:'Encryption'},
              {val:'3 Roles',   label:'Admin · Teacher · Student'},
              {val:'Multi-Face',label:'Simultaneous Detection'},
            ].map((s,i) => (
              <div key={i} className="rounded-2xl p-4 text-center"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="text-sm font-bold text-white mb-0.5">{s.val}</div>
                <div className="text-xs text-white/30">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE DEMO CARD */}
        <section className="px-6 py-6 max-w-2xl mx-auto">
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{background:'rgba(124,92,252,0.07)',border:'1px solid rgba(124,92,252,0.15)'}}>
            <div className="absolute inset-0 opacity-20"
              style={{background:'radial-gradient(ellipse at 50% 0%,rgba(124,92,252,0.4),transparent 70%)'}} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl icon-violet border flex items-center justify-center">
                  <Scan className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Live Attendance Session</p>
                  <p className="text-xs text-white/35">CS101 · Introduction to Programming</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full badge-active text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 glow-pulse" />
                  LIVE
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Ananya S.','Rohit K.','Priya M.','Arjun T.','Meera R.','Karthik V.'].map((name,i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl p-2.5"
                    style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{background:'linear-gradient(135deg,rgba(124,92,252,0.4),rgba(79,142,247,0.3))'}}>
                      {name.charAt(0)}
                    </div>
                    <span className="text-xs text-white/75 truncate flex-1">{name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-white/35">6 / 6 recognized</span>
                <span className="text-green-400 font-semibold">100% Attendance</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <div className="glow-line max-w-xs mx-auto opacity-40" />
            <p className="text-white/35 mt-4 text-sm">Everything you need for smart, secure attendance tracking</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f,i) => (
              <div key={i} className="card rounded-2xl p-5" style={{animationDelay:`${i*0.07}s`}}>
                <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center mb-3`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center px-6 py-14 max-w-xl mx-auto">
          <div className="rounded-2xl p-10 relative overflow-hidden"
            style={{background:'rgba(124,92,252,0.08)',border:'1px solid rgba(124,92,252,0.18)'}}>
            <div className="absolute inset-0 opacity-25" style={{background:'radial-gradient(ellipse at 50% 0%,rgba(124,92,252,0.35),transparent 70%)'}} />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to get started?</h2>
              <p className="text-white/35 text-sm mb-6">Secure biometric attendance for modern classrooms</p>
              <Button size="lg" onClick={() => navigate('/login')} className="rounded-xl px-10 font-semibold"
                style={{background:'linear-gradient(135deg,#7c5cfc,#4f8ef7)',boxShadow:'0 6px 25px rgba(124,92,252,0.4)'}}>
                Login to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <footer className="text-center py-6 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <p className="text-xs text-white/20">VerifAI © 2025 · AI-Powered Attendance System</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
