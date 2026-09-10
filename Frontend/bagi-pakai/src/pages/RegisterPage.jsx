import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      setLoading(true);
      await register(formData.username.trim(), formData.email.trim(), formData.password);
      toast.success('Pendaftaran berhasil! Selamat bergabung di BagiPakai. 🌱');
      navigate('/items', { replace: true });
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Pastikan username dan email belum terdaftar.');
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#E08500] flex items-center justify-center text-white shadow-md shadow-[#2B4E86]/20">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Bagi<span className="text-[#E08500]">Pakai</span>
              </span>
            </Link>

            <div className="pt-6 sm:pt-10 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Buat Akun Baru
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Bergabunglah dan mulailah berbagi kebaikan hari ini.
              </p>
            </div>
          </div>

          {/* Decorative Sharing Box Illustration */}
          <div className="my-8 flex items-center justify-center relative z-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-white shadow-lg flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E08500] text-white flex items-center justify-center shadow-md mb-2">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-black text-slate-800">Daftar Gratis</span>
              <span className="text-[10px] text-[#E08500] font-bold">100% Kebaikan</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium text-center relative z-10">
            Komunitas Berbagi Sirkular Indonesia 🌱
          </div>
        </div>

        {/* Right Form Card (md:col-span-7) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daftar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Isi data diri Anda untuk membuat akun
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Pilih username..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@domain.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 font-semibold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi (Minimal 6 Karakter)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Buat kata sandi..."
                  className="w-full pl-11 pr-11 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 font-semibold transition-all"
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

            <Button
              type="submit"
              variant="action"
              size="lg"
              className="w-full shadow-md shadow-[#E08500]/25 font-extrabold mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Daftar
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 font-medium">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#2B4E86] font-extrabold hover:underline">
              Login di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
