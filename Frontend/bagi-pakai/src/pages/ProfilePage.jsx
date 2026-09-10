import { useState, useEffect } from 'react';
import {
  User,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Loading';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const data = await userApi.getMe();
        if (!cancelled) {
          setFormData({
            fullName: data.fullName || '',
            phoneNumber: data.phoneNumber || '',
            email: data.email || '',
          });
        }
      } catch {
        if (!cancelled) {
          toast.error('Gagal memuat profil pengguna.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const executeSaveProfile = async () => {
    try {
      setSaving(true);
      await userApi.updateProfile({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
      });
      await refreshUser();
      setShowConfirmModal(false);
      toast.success('Profil berhasil diperbarui! ✨');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui profil.');
      setShowConfirmModal(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner text="Memuat data profil..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Profile Hero */}
      <div className="bg-gradient-to-r from-[#F0F5FD] via-white to-[#E8F2FE] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#CFE4FD] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#2B4E86] via-[#223F6E] to-[#15253F] text-white flex items-center justify-center font-black text-3xl shadow-md shadow-[#2B4E86]/20 shrink-0">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              @{user?.username}
            </h1>
            <Badge variant={user?.role === 'ADMIN' ? 'amber' : 'primary'} size="sm">
              {user?.role === 'ADMIN' ? '⭐ Admin Komunitas' : '🌱 Warga BagiPakai'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            {user?.fullName || 'Nama lengkap belum diatur'}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#CFE4FD] shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#2B4E86]" />
          <span>Informasi Akun & Kontak</span>
        </h2>

        <form onSubmit={handlePreSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Masukkan nama lengkap..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 outline-none text-sm text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nomor WhatsApp / HP
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Contoh: 08123456789"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 outline-none text-sm text-slate-900 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 outline-none text-sm text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
              className="font-extrabold shadow-md shadow-[#2B4E86]/20"
            >
              Simpan Profil
            </Button>
          </div>
        </form>
      </div>

      {/* Save Profile Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeSaveProfile}
        title="Simpan Perubahan Profil?"
        message="Apakah Anda yakin ingin menyimpan perubahan data profil Anda?"
        confirmText="Ya, Simpan Profil"
        cancelText="Batal"
        variant="primary"
        isLoading={saving}
        icon={<CheckCircle2 className="w-6 h-6 text-[#2B4E86]" />}
      />
    </div>
  );
};