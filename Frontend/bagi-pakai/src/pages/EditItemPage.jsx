import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  Image as ImageIcon,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../components/items/CategoryPills';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    namaBarang: '',
    kategori: 'Fashion',
    lokasi: '',
    deskripsi: '',
  });

  const [existingPhotoUrl, setExistingPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await itemsApi.getItemById(id);
        setFormData({
          namaBarang: data.namaBarang || '',
          kategori: data.kategori || 'Fashion',
          lokasi: data.lokasi || '',
          deskripsi: data.deskripsi || '',
        });
        setExistingPhotoUrl(data.fotoUrl || '');
      } catch (err) {
        setError(err.message || 'Gagal memuat data barang.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.namaBarang.trim()) {
      setError('Nama barang wajib diisi.');
      return;
    }

    try {
      setSaving(true);
      // 1. Update text info
      await itemsApi.updateItem(id, {
        namaBarang: formData.namaBarang.trim(),
        kategori: formData.kategori,
        lokasi: formData.lokasi.trim(),
        deskripsi: formData.deskripsi.trim(),
      });

      // 2. Upload new photo if replaced
      if (photoFile) {
        try {
          await itemsApi.uploadPhoto(id, photoFile);
        } catch (upErr) {
          console.warn('Photo update failed:', upErr);
          toast.info('Info barang diperbarui, tapi foto baru gagal diunggah.');
        }
      }

      toast.success('Informasi barang berhasil diperbarui! ✨');
      navigate(`/items/${id}`);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui barang.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner text="Memuat data barang..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/items/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sage-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Detail Barang</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Edit Barang 📝
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Section */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sage-700" />
            <span>Foto Barang</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shrink-0">
              <img
                src={photoPreview || existingPhotoUrl || '/placeholder.png'}
                alt="Foto Barang"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="border-2 border-dashed border-sage-300 hover:border-sage-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-sage-50/40 hover:bg-sage-50/80 w-full text-center">
              <UploadCloud className="w-8 h-8 text-sage-700 mb-2" />
              <span className="text-sm font-bold text-slate-900">
                Ganti Foto (Klik untuk memilih file baru)
              </span>
              <span className="text-xs text-slate-500 mt-0.5">JPG, PNG (Maksimal 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaBarang}
                onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Lokasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-semibold"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Deskripsi & Kondisi <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-medium resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(`/items/${id}`)}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={saving}
            className="font-extrabold shadow-md shadow-sage-950/15"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};
