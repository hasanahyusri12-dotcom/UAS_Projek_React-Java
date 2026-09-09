import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  X,
  ShieldAlert,
  ArrowLeft,
  MapPin,
  Lock,
  Info,
  Gift,
} from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../components/items/CategoryPills';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const PostItemPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    namaBarang: '',
    kategori: 'Fashion',
    kondisi: '90% Seperti Baru',
    areaPublik: '',
    metodeSerahTerima: 'Keduanya (COD / Ekspedisi)',
    alamatPrivat: '',
    deskripsi: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const KONDISI_OPTIONS = [
    { id: '100% Baru', label: '💎 100% Baru / Belum Dipakai', desc: 'Masih dalam kemasan/tag' },
    { id: '90% Seperti Baru', label: '✨ 90% Seperti Baru', desc: 'Mulus tanpa cacat terlihat' },
    { id: 'Layak Pakai', label: '🌿 Layak Pakai & Berfungsi', desc: 'Ada sedikit jejak pakai wajar' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran foto maksimal 5MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.namaBarang.trim()) {
      setError('Nama barang wajib diisi.');
      return;
    }
    if (!formData.areaPublik.trim()) {
      setError('Area / Kota lokasi barang wajib diisi.');
      return;
    }
    if (!formData.deskripsi.trim()) {
      setError('Deskripsi kondisi barang wajib diisi.');
      return;
    }

    try {
      setLoading(true);

      const lokasiGabungan = `${formData.areaPublik.trim()} • [${formData.metodeSerahTerima}]`;
      const deskripsiLengkap = `[Kondisi: ${formData.kondisi}]\n\n${formData.deskripsi.trim()}${
        formData.alamatPrivat.trim()
          ? `\n\n[Catatan Penjemputan Privat untuk Penerima: ${formData.alamatPrivat.trim()}]`
          : ''
      }`;

      // 1. Create item record
      const created = await itemsApi.createItem({
        namaBarang: formData.namaBarang.trim(),
        kategori: formData.kategori,
        lokasi: lokasiGabungan,
        deskripsi: deskripsiLengkap,
      });

      // 2. Upload photo if selected
      if (photoFile && created?.id) {
        try {
          await itemsApi.uploadPhoto(created.id, photoFile);
        } catch (uploadErr) {
          console.warn('Photo upload error:', uploadErr);
          toast.info('Barang berhasil dibuat, namun foto gagal terunggah.');
        }
      }

      toast.success('Barang berhasil diunggah! Menunggu peninjauan admin 🌱');
      navigate('/my-items');
    } catch (err) {
      setError(err.message || 'Gagal mengunggah barang. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/my-items"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sage-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Unggah Barang untuk Dibagikan 🎁
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Lengkapi formulir di bawah ini. Alamat rumahmu terlindungi dan tidak akan dipublikasikan sembarangan.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* LANGKAH 1: FOTO & KONDISI */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-sage-700 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Foto & Kondisi Barang</span>
            </h2>
            <Badge variant="sage" size="sm">
              Wajib Foto Jelas
            </Badge>
          </div>

          {/* Photo Upload Area */}
          <div>
            {photoPreview ? (
              <div className="relative max-w-sm mx-auto aspect-[4/3] rounded-3xl overflow-hidden border-2 border-sage-300 shadow-sm group">
                <img
                  src={photoPreview}
                  alt="Preview Barang"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 p-2 rounded-2xl bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-sage-300 hover:border-sage-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-sage-50/40 hover:bg-sage-50/80 group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center text-sage-700 group-hover:scale-110 transition-transform mb-3 border border-sage-200">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-sm font-black text-slate-900">
                  Pilih atau seret foto barang ke sini
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Format JPG, PNG, WebP (Maksimal 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Selector Kondisi Visual */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Tingkat Kondisi Barang <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {KONDISI_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, kondisi: opt.id })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    formData.kondisi === opt.id
                      ? 'bg-sage-50 border-sage-700 shadow-xs'
                      : 'border-slate-200 hover:border-sage-300 bg-white'
                  }`}
                >
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LANGKAH 2: INFORMASI & DESKRIPSI */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-petrol-700 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Informasi Detail Barang</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaBarang}
                onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                placeholder="Contoh: Kemeja Flanel Uniqlo Size L / Novel Harry Potter Lengkap"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 bg-white font-bold cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Deskripsi Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Ceritakan spesifikasi barang, ukuran, minus atau kelebihan, dan alasan membagikannya..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-medium resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* LANGKAH 3: PENGATURAN LOKASI & PRIVASI ALAMAT */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Lokasi & Pengaturan Serah Terima</span>
            </h2>
            <Badge variant="petrol" size="sm">
              <Lock className="w-3 h-3" /> Privasi Aman
            </Badge>
          </div>

          <div className="bg-petrol-50 rounded-2xl p-4 border-2 border-petrol-200 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-5 h-5 text-petrol-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              <strong>Privasi Alamat Donatur:</strong> Area publik (Kota/Kecamatan) ditampilkan pada katalog publik.
              Alamat detail penjemputan/patokan tidak akan dipublikasikan dan hanya diberikan kepada penerima yang kamu setujui.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Area Publik */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Area Publik / Kota (Tampil di Katalog) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.areaPublik}
                  onChange={(e) => setFormData({ ...formData, areaPublik: e.target.value })}
                  placeholder="Contoh: Kebayoran Baru, Jakarta Selatan"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Metode Serah Terima */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Metode Serah Terima <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.metodeSerahTerima}
                onChange={(e) =>
                  setFormData({ ...formData, metodeSerahTerima: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 bg-white font-bold cursor-pointer"
              >
                <option value="Keduanya (COD / Ekspedisi)">
                  🔄 Keduanya (Ambil Sendiri / Kirim Ekspedisi)
                </option>
                <option value="Ambil di Tempat (COD)">
                  📍 Ambil di Tempat / Janjian Tempat Umum
                </option>
                <option value="Kirim Ekspedisi Saja">
                  📦 Kirim via Ekspedisi (Ongkir ditanggung penerima)
                </option>
              </select>
            </div>

            {/* Alamat Detail Privat */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Alamat / Patokan Penjemputan Privat (Opsional)</span>
                <span className="text-[10px] text-petrol-700 font-bold">
                  🔒 Hanya untuk Penerima Terpilih
                </span>
              </label>
              <input
                type="text"
                value={formData.alamatPrivat}
                onChange={(e) => setFormData({ ...formData, alamatPrivat: e.target.value })}
                placeholder="Contoh: Jl. Ahmad Dahlan No. 12 (Dekat Indomaret simpang empat)..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/my-items')}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={loading}
            className="shadow-md shadow-sage-950/15 font-extrabold"
          >
            + Terbitkan Barang Sekarang
          </Button>
        </div>
      </form>
    </div>
  );
};
