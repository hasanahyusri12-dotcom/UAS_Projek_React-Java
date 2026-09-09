import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Loading';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userApi.getMe();
        setFormData({
          fullName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
        });
      } catch (err) {
        toast.error('Gagal memuat profil pengguna.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await userApi.updateProfile({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
      });
      await refreshUser();
      toast.success('Profil berhasil diperbarui! ✨');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui profil.');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Hero */}
      <div className="bg-gradient-to-r from-sage-50 via-white to-petrol-50 p-6 sm:p-8 rounded-[2.5rem] border-2 border-sage-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sage-700 via-sage-600 to-petrol-700 text-white flex items-center justify-center font-black text-3xl shadow-md shadow-sage-950/15 shrink-0">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              @{user?.username}
            </h1>
            <Badge variant={user?.role === 'ADMIN' ? 'amber' : 'sage'} size="sm">
              {user?.role === 'ADMIN' ? '⭐ Admin Komunitas' : '🌱 Warga BagiPakai'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            {user?.fullName || 'Nama lengkap belum diatur'}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-sage-700" />
          <span>Informasi Akun & Kontak</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Masukkan nama lengkap..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
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
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
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
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
              className="font-extrabold shadow-xs"
            >
              Simpan Profil
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
