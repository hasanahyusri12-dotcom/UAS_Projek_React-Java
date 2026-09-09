import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  CheckCircle2,
  Truck,
  MessageSquare,
  Package,
} from 'lucide-react';
import { transactionsApi } from '../api/transactionsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getMyTransactions();
      setTransactions(data || []);
    } catch (err) {
      toast.error('Gagal memuat transaksi serah terima.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleMarkReceived = async (txId) => {
    if (!window.confirm('Tandai bahwa kamu sudah menerima fisik barang ini?')) return;

    try {
      setActionLoading(true);
      await transactionsApi.markAsReceived(txId);
      toast.success('Status berhasil diperbarui! Barang telah diterima. 📦');
      loadTransactions();
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCompletion = async (txId) => {
    if (!window.confirm('Konfirmasi bahwa serah terima barang ini telah selesai sempurna?')) return;

    try {
      setActionLoading(true);
      await transactionsApi.confirmCompletion(txId);
      toast.success('Serah terima selesai! Terima kasih telah berbagi kebaikan. 🎉🌱');
      loadTransactions();
    } catch (err) {
      toast.error(err.message || 'Gagal menyelesaikan transaksi.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-50 via-white to-petrol-50 p-6 sm:p-8 rounded-[2.5rem] border-2 border-sage-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-petrol-100 text-petrol-900 text-xs font-extrabold mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Alur Serah Terima Barang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pelacak Serah Terima Barang 📦
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Pantau status koordinasi, pengiriman, dan penyelesaian serah terima barangmu di sini.
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner text="Memuat riwayat serah terima..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={<ArrowRightLeft className="w-10 h-10 text-petrol-700" />}
          title="Belum Ada Transaksi Serah Terima"
          description="Transaksi serah terima akan otomatis muncul ketika donatur menyetujui pengajuan klaim suatu barang."
          actionText="Jelajah Barang Sekarang"
          onAction={() => navigate('/items')}
        />
      ) : (
        <div className="space-y-6">
          {transactions.map((tx) => {
            const isGiver = user?.username === tx.giver?.username;
            const isReceiver = user?.username === tx.receiver?.username;

            // Status steps mapping
            const isCompleted = tx.status === 'COMPLETED';
            const isReceived = tx.status === 'RECEIVED' || isCompleted;
            const isArranging = true;

            return (
              <div
                key={tx.id}
                className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-xs space-y-6 hover:border-sage-300 transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sage-700 to-petrol-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">
                        {tx.item?.namaBarang || 'Barang Serah Terima'}
                      </h3>
                      <div className="text-xs text-slate-500 font-semibold">
                        {isGiver ? (
                          <span>
                            Kamu sebagai <strong className="text-sage-800 font-extrabold">Pemberi</strong> ke @{tx.receiver?.username}
                          </span>
                        ) : (
                          <span>
                            Kamu sebagai <strong className="text-petrol-800 font-extrabold">Penerima</strong> dari @{tx.giver?.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={isCompleted ? 'success' : isReceived ? 'petrol' : 'amber'}
                    size="md"
                  >
                    {tx.status === 'COMPLETED'
                      ? '✅ Selesai Sepenuhnya'
                      : tx.status === 'RECEIVED'
                      ? '📦 Barang Diterima'
                      : '⏳ Janjian & Koordinasi'}
                  </Badge>
                </div>

                {/* Progress Stepper Visual */}
                <div className="py-2">
                  <div className="grid grid-cols-3 gap-2 relative">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                          isArranging
                            ? 'bg-sage-700 text-white shadow-md shadow-sage-950/15'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        1
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">Penerima Terpilih</span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
                        Koordinasi janjian / pengiriman
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                          isReceived
                            ? 'bg-sage-700 text-white shadow-md shadow-sage-950/15'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        2
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">Barang Diterima</span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
                        Penerima menerima fisik barang
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/15'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        3
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">Selesai & Berkah</span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
                        Saling konfirmasi dan doa syukur
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs text-slate-600 space-y-1 font-medium">
                    <div>
                      📍 Lokasi Barang:{' '}
                      <strong className="text-slate-900 font-bold">{tx.item?.lokasi || 'Indonesia'}</strong>
                    </div>
                    <div>
                      📅 Terpilih pada:{' '}
                      <strong className="text-slate-900 font-bold">
                        {new Date(tx.selectedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/messages"
                      className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chat Partner</span>
                    </Link>

                    {/* Receiver Action Buttons */}
                    {isReceiver && tx.status === 'ARRANGING_PICKUP' && (
                      <Button
                        variant="sage"
                        size="sm"
                        isLoading={actionLoading}
                        onClick={() => handleMarkReceived(tx.id)}
                        leftIcon={<Truck className="w-3.5 h-3.5" />}
                        className="font-extrabold"
                      >
                        Barang Sudah Diterima
                      </Button>
                    )}

                    {isReceiver && tx.status === 'RECEIVED' && (
                      <Button
                        variant="gradient"
                        size="sm"
                        isLoading={actionLoading}
                        onClick={() => handleConfirmCompletion(tx.id)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="font-extrabold"
                      >
                        Konfirmasi Selesai
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
