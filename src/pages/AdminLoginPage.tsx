import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Cookie, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Reveal } from '@/components/Reveal';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-pad py-20">
      <Reveal>
        <div className="glass-gold p-8 sm:p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 mb-4">
              <Cookie size={28} />
            </span>
            <h1 className="font-serif text-2xl font-bold text-cream-50">Admin Login</h1>
            <p className="text-cream-200/50 text-sm mt-1.5">Sign in to manage orders and products</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass text-cream-100 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/40 transition text-sm"
                  placeholder="admin@designarenacookies.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-cream-200/60 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass text-cream-100 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/40 transition text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-gold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-cream-200/40 text-sm hover:text-gold-200 transition">
            <ArrowLeft size={15} /> Back to website
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
