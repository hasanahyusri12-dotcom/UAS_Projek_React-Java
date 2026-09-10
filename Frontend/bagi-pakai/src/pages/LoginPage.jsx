import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || location.state?.from || '/items';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Mohon isi username dan kata sandi.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username.trim(), password);
      toast.success(`Selamat datang kembali, @${res.username}! 🌱`);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Username atau kata sandi tidak sesuai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] border-2 border-[#CFE4FD] shadow-xl shadow-[#2B4E86]/10 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Welcome Banner (md:col-span-5) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#E8F2FE] via-[#CFE4FD] to-[#A5CBFD]/40 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-[#CFE4FD]">
          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2B4E86] flex items-center justify-center text-white shadow-md shadow-[#2B4E86]/20">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Bagi<span className="text-[#E08500]">Pakai</span>
              </span>
            </Link>

            <div className="pt-6 sm:pt-10 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Selamat Datang Kembali!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Yuk, lanjutkan berbagi kebaikan bersama ribuan warga lainnya.
              </p>
            </div>
          </div>

          {/* Decorative Sharing Box Illustration */}
          <div className="my-8 flex items-center justify-center relative z-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-white shadow-lg flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E08500] text-white flex items-center justify-center shadow-md mb-2 animate-bounce">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-black text-slate-800">100% Berbagi</span>
              <span className="text-[10px] text-slate-500 font-bold">Nyata & Gratis</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium text-center relative z-10">
            Komunitas Berbagi Sirkular Indonesia 🌱
          </div>
        </div>

        {/* Right Form Card (md:col-span-7) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Username atau Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 font-semibold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-[#2B4E86] focus:ring-[#2B4E86]"
                />
                <span>Ingat saya</span>
              </label>
              <span className="text-slate-400 font-medium hover:text-[#2B4E86] cursor-pointer">
                Lupa password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-[#2B4E86]/20 font-extrabold"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Login
            </Button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-wider absolute">
              atau
            </span>
          </div>

          {/* Google Auth Mock Button */}
          <button
            type="button"
            onClick={() => toast.info('Fitur Login dengan Google siap dihubungkan.')}
            className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-[#2B4E86] hover:bg-[#F0F5FD] text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Login dengan Google</span>
          </button>

          <div className="pt-2 text-center text-xs text-slate-500 font-medium">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#2B4E86] font-extrabold hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
