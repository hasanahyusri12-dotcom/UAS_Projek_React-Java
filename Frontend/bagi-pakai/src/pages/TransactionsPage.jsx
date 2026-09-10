import { useState, useEffect } from 'react';
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
import { useConfirm } from '../context/ConfirmContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { getImageUrl } from '../utils/imageUrl';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const data = await transactionsApi.getMyTransactions();
        if (!cancelled) {
          setTransactions(data || []);
        }
      } catch {
        if (!cancelled) {
          toast.error('Gagal memuat transaksi serah terima.');
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

  const handleMarkReceived = async (tx) => {
    const isOk = await confirm({
      title: 'Konfirmasi Penerimaan Barang?',
      message: `Tandai bahwa kamu sudah menerima fisik barang "${tx.item?.namaBarang || 'ini'}" dari donatur?`,
      confirmText: 'Ya, Sudah Diterima',
      cancelText: 'Batal',
      variant: 'primary',
      icon: <Truck className="w-6 h-6 text-[#2B4E86]" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      await transactionsApi.markAsReceived(tx.id);
      toast.success('Status berhasil diperbarui! Barang telah diterima. 📦');
      // Reload data
      const data = await transactionsApi.getMyTransactions();
      setTransactions(data || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCompletion = async (tx) => {
    const isOk = await confirm({
      title: 'Selesaikan Serah Terima?',
      message: `Konfirmasi bahwa serah terima barang "${tx.item?.namaBarang || 'ini'}" telah selesai dengan sempurna?`,
      confirmText: 'Ya, Selesaikan Transaksi',
      cancelText: 'Batal',
      variant: 'success',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      await transactionsApi.confirmCompletion(tx.id);
      toast.success('Serah terima selesai! Terima kasih telah berbagi kebaikan. 🎉🌱');
      // Reload data
      const data = await transactionsApi.getMyTransactions();
      setTransactions(data || []);
    } catch (err) {
      toast.error(err.message || 'Gagal menyelesaikan transaksi.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0F5FD] via-white to-[#E8F2FE] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#CFE4FD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2FE] text-[#2B4E86] text-xs font-extrabold mb-2 border border-[#CFE4FD]">
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
          icon={<ArrowRightLeft className="w-10 h-10 text-[#2B4E86]" />}
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
                className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#CFE4FD] shadow-xs space-y-6 hover:border-[#2B4E86] transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    {tx.item?.fotoUrl ? (
                      <img
                        src={getImageUrl(tx.item.fotoUrl)}
                        alt={tx.item.namaBarang}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#15253F] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">
                        {tx.item?.namaBarang || 'Barang Serah Terima'}
                      </h3>
                      <div className="text-xs text-slate-500 font-semibold">
                        {isGiver ? (
                          <span>
                            Kamu sebagai <strong className="text-[#2B4E86] font-extrabold">Pemberi</strong> ke @{tx.receiver?.username}
                          </span>
                        ) : (
                          <span>
                            Kamu sebagai <strong className="text-[#E08500] font-extrabold">Penerima</strong> dari @{tx.giver?.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={isCompleted ? 'success' : isReceived ? 'primary' : 'amber'}
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
                            ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
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
                            ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 bg-[#F0F5FD] p-4 sm:p-5 rounded-2xl">
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
                        variant="primary"
                        size="sm"
                        isLoading={actionLoading}
                        onClick={() => handleMarkReceived(tx)}
                        leftIcon={<Truck className="w-3.5 h-3.5" />}
                        className="font-extrabold"
                      >
                        Barang Sudah Diterima
                      </Button>
                    )}

                    {isReceiver && tx.status === 'RECEIVED' && (
                      <Button
                        variant="action"
                        size="sm"
                        isLoading={actionLoading}
                        onClick={() => handleConfirmCompletion(tx)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="font-extrabold shadow-md shadow-[#E08500]/20"
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