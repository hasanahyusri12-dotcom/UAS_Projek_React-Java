import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { claimsApi } from '../../api/claimsApi';
import { useToast } from '../../context/ToastContext';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export const ClaimModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item?.id) return;

    setLoading(true);
    setError('');

    try {
      await claimsApi.createClaim(item.id, message.trim());
      toast.success('Pengajuan klaim berhasil dikirim ke pemilik barang! 🌱');
      setMessage('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal mengajukan klaim barang.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajukan Klaim Barang Gratis"
      subtitle={`Barang: ${item?.namaBarang || ''}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-[#F0F5FD] border-2 border-[#CFE4FD] rounded-2xl p-4 text-xs text-slate-700 space-y-1.5 font-medium">
          <div className="flex items-center gap-1.5 font-black text-[#2B4E86]">
            <Sparkles className="w-4 h-4 text-[#2B4E86]" />
            <span>Tips Pengajuan yang Baik</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            Ceritakan dengan jujur dan santun mengapa barang ini bermanfaat untukmu atau keluargamu.
            Pemilik barang akan memilih 1 penerima berdasarkan kesesuaian kebutuhan.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Cerita / Alasan Membutuhkan Barang (Opsional)
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contoh: Halo kak, barang ini sangat saya butuhkan untuk keperluan sehari-hari. Terima kasih banyak atas kebaikan kakak..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#CFE4FD] outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none font-medium transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="action"
            size="md"
            isLoading={loading}
            leftIcon={<Heart className="w-4 h-4" />}
            className="font-extrabold shadow-xs"
          >
            Kirim Pengajuan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
