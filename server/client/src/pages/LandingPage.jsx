import { useNavigate } from 'react-router-dom';
import { Shield, Users, Lock, BarChart3, Zap, Cloud, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Multi-Face Detection',
      desc: 'Detect and recognize multiple students simultaneously in real time during a single attendance session.'
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: 'AES-256 Encryption',
      desc: 'All face embeddings are encrypted with AES-256-GCM. No raw face images are ever stored.'
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Role-Based Access',
      desc: 'Separate dashboards and permissions for Admins, Teachers, and Students.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: 'Attendance Reports',
      desc: 'View detailed attendance records and export them as CSV for any course or student.'
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Live Sessions',
      desc: 'Teachers can start and close live attendance sessions with instant face recognition.'
    },
    {
      icon: <Cloud className="w-6 h-6 text-primary" />,
      title: 'Cloud Powered',
      desc: 'Built on MongoDB Atlas, Railway, and Vercel for reliable 24/7 availability.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VerifAI
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 pt-24 pb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          VerifAI
        </h1>

        <p className="text-xl text-muted-foreground mb-4">
          AI-Powered Attendance System
        </p>

        <p className="text-base text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
          Automate attendance with real-time AI face recognition. Secure, encrypted, and built for modern classrooms.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate('/login')}>
            Login to Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 p-8 bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          {[
            { val: 'Real-Time', label: 'Face Recognition' },
            { val: 'AES-256', label: 'Encryption' },
            { val: '3 Roles', label: 'Admin · Teacher · Student' },
            { val: 'Multi-Face', label: 'Simultaneous Detection' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-3">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Everything you need for smart, secure attendance tracking
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center px-6 py-16 bg-white/50 dark:bg-gray-800/50">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to get started?</h2>
        <p className="text-muted-foreground mb-8">Secure biometric attendance tracking</p>
        <Button size="lg" onClick={() => navigate('/login')}>
          Login to Dashboard →
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-sm text-muted-foreground">VerifAI © 2025 · AI-Powered Attendance System</p>
      </footer>
    </div>
  );
};

export default LandingPage;
