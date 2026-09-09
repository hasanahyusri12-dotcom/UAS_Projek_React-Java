import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Heart,
  Inbox,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
  MessageSquare,
  ArrowRight,
  ArrowRightLeft,
  Trash2,
  Edit,
  ShieldCheck,
  Award,
  Filter,
} from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { claimsApi } from '../api/claimsApi';
import { transactionsApi } from '../api/transactionsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const MyItemsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'outgoing' | 'handover'
  const [itemStatusFilter, setItemStatusFilter] = useState('ALL');

  const [myItems, setMyItems] = useState([]);
  const [outgoingClaims, setOutgoingClaims] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedItemClaims, setSelectedItemClaims] = useState([]);
  const [activeItemForClaims, setActiveItemForClaims] = useState(null);
  const [claimsModalOpen, setClaimsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, claims, txs] = await Promise.all([
        itemsApi.getMyItems(),
        claimsApi.getMyClaims(),
        transactionsApi.getMyTransactions().catch(() => []),
      ]);
      setMyItems(items || []);
      setOutgoingClaims(claims || []);
      setTransactions(txs || []);
    } catch (err) {
      toast.error('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenItemClaims = async (item) => {
    try {
      setActiveItemForClaims(item);
      setClaimsModalOpen(true);
      const claims = await claimsApi.getClaimsByItem(item.id);
      setSelectedItemClaims(claims || []);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat daftar pemohon.');
    }
  };

  const handleAcceptClaim = async (claimId) => {
    if (!window.confirm('Pilih pemohon ini sebagai penerima resmi barang?')) return;

    try {
      setActionLoading(true);
      await claimsApi.acceptClaim(claimId);
      toast.success('Penerima berhasil dipilih! Alamat dan koordinasi dapat dilanjutkan via Chat & Serah Terima. 🎉🌱');
      setClaimsModalOpen(false);
      loadData();
      setActiveTab('handover');
    } catch (err) {
      toast.error(err.message || 'Gagal menyetujui pemohon.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelClaim = async (claimId) => {
    if (!window.confirm('Batalkan pengajuan klaim ini?')) return;

    try {
      setActionLoading(true);
      await claimsApi.cancelClaim(claimId);
      toast.success('Pengajuan klaim berhasil dibatalkan.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Gagal membatalkan klaim.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Hapus barang ini secara permanen?')) return;
    try {
      setActionLoading(true);
      await itemsApi.deleteItem(itemId);
      toast.success('Barang berhasil dihapus.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus barang.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered items
  const filteredMyItems = myItems.filter((item) => {
    if (itemStatusFilter === 'ALL') return true;
    return item.status === itemStatusFilter;
  });

  // Calculate kindness stats
  const totalShared = myItems.filter((i) => i.status === 'SELESAI').length;
  const totalAvailable = myItems.filter((i) => i.status === 'TERSEDIA').length;
  const kindnessScore = totalShared * 50 + myItems.length * 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. DONOR PROFILE HERO & KINDNESS DASHBOARD BANNER */}
      <div className="bg-gradient-to-r from-[#15253F] via-[#223F6E] to-[#2B4E86] rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl shadow-[#2B4E86]/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner border border-white/20 shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Hai, @{user?.username} 👋
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs">
                  Level {Math.max(1, Math.floor(kindnessScore / 50) + 1)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#A5CBFD] mt-0.5 font-medium">
                Senang melihatmu kembali! Yuk, terus berbagi kebaikan bersama warga.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>{kindnessScore} Poin Kebaikan</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/post-item"
              className="px-5 py-3 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#E08500]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Bagi Barang Baru</span>
            </Link>
            <Link
              to="/messages"
              className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
              title="Buka Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Metric Cards Row (Matching Mockup Colors) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
            <div className="text-xl sm:text-3xl font-black text-white">{myItems.length}</div>
            <div className="text-xs text-[#A5CBFD] mt-0.5 font-bold">Total Barang Saya</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
            <div className="text-xl sm:text-3xl font-black text-amber-300">{totalAvailable}</div>
            <div className="text-xs text-amber-200 mt-0.5 font-bold">Barang Tersedia</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
            <div className="text-xl sm:text-3xl font-black text-[#A5CBFD]">{outgoingClaims.length}</div>
            <div className="text-xs text-[#A5CBFD] mt-0.5 font-bold">Pengajuan Masuk</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
            <div className="text-xl sm:text-3xl font-black text-emerald-300">{totalShared}</div>
            <div className="text-xs text-emerald-200 mt-0.5 font-bold">Total Donasi</div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC DASHBOARD TABS */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'items'
              ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
              : 'text-slate-600 hover:bg-slate-100 font-bold'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Etalase Barang Saya ({myItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'outgoing'
              ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
              : 'text-slate-600 hover:bg-slate-100 font-bold'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Pengajuan Klaim Saya ({outgoingClaims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'handover'
              ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
              : 'text-slate-600 hover:bg-slate-100 font-bold'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Riwayat Serah Terima ({transactions.length})</span>
        </button>
      </div>

      {loading ? (
        <Spinner text="Memuat dashboard..." />
      ) : (
        <>
          {/* TAB 1: ETALASE BARANG SAYA */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Status:
                </span>
                {[
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'TERSEDIA', label: 'Tersedia' },
                  { id: 'MENUNGGU_REVIEW', label: 'Menunggu Review' },
                  { id: 'DIPILIH', label: 'Penerima Terpilih' },
                  { id: 'SELESAI', label: 'Selesai' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setItemStatusFilter(chip.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      itemStatusFilter === chip.id
                        ? 'bg-[#2B4E86] text-white shadow-xs'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-[#F0F5FD]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {filteredMyItems.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-10 h-10 text-sage-600" />}
                  title="Belum Ada Barang"
                  description={
                    itemStatusFilter === 'ALL'
                      ? 'Kamu belum pernah membagikan barang. Bagikan barang bermanfaat sekarang!'
                      : `Tidak ada barang dengan status "${itemStatusFilter}".`
                  }
                  actionText="+ Bagi Barang Baru"
                  onAction={() => navigate('/post-item')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMyItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-[2rem] p-5 border-2 border-sage-100 shadow-xs hover:border-sage-300 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Image Preview */}
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                          {item.fotoUrl ? (
                            <img
                              src={item.fotoUrl}
                              alt={item.namaBarang}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                              Tanpa Foto
                            </div>
                          )}
                          <div className="absolute top-2.5 left-2.5">
                            <Badge
                              variant={
                                item.status === 'TERSEDIA'
                                  ? 'sage'
                                  : item.status === 'MENUNGGU_REVIEW'
                                  ? 'amber'
                                  : item.status === 'DIPILIH'
                                  ? 'petrol'
                                  : 'neutral'
                              }
                              size="sm"
                              className="shadow-xs"
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">
                            {item.namaBarang}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                            {item.deskripsi}
                          </p>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-2 font-semibold">
                          <span className="text-sage-800">{item.kategori}</span>
                          <span>•</span>
                          <span className="truncate">{item.lokasi}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {item.status === 'TERSEDIA' && (
                          <button
                            onClick={() => handleOpenItemClaims(item)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Inbox className="w-4 h-4" />
                            <span>Lihat & Pilih Calon Penerima</span>
                          </button>
                        )}

                        <div className="grid grid-cols-3 gap-2">
                          <Link
                            to={`/items/${item.id}`}
                            className="text-center py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            Detail
                          </Link>
                          <Link
                            to={`/edit-item/${item.id}`}
                            className="text-center py-2 rounded-xl text-xs font-bold border-2 border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={actionLoading}
                            className="text-center py-2 rounded-xl text-xs font-bold border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PENGAJUAN KLAIM SAYA */}
          {activeTab === 'outgoing' && (
            <div>
              {outgoingClaims.length === 0 ? (
                <EmptyState
                  icon={<Heart className="w-10 h-10 text-rose-500" />}
                  title="Belum Pernah Mengajukan Klaim"
                  description="Jelajahi katalog dan temukan barang bermanfaat yang dibagikan secara gratis."
                  actionText="Jelajah Barang Sekarang"
                  onAction={() => navigate('/items')}
                />
              ) : (
                <div className="space-y-4">
                  {outgoingClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-white rounded-[2rem] p-5 sm:p-6 border-2 border-sage-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sage-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-900 text-base">
                            {claim.item?.namaBarang || 'Barang'}
                          </span>
                          <Badge
                            variant={
                              claim.status === 'ACCEPTED'
                                ? 'success'
                                : claim.status === 'REJECTED'
                                ? 'coral'
                                : claim.status === 'CANCELLED'
                                ? 'neutral'
                                : 'amber'
                            }
                            size="sm"
                          >
                            {claim.status === 'ACCEPTED'
                              ? '🎉 Disetujui (Kamu Terpilih)'
                              : claim.status === 'REJECTED'
                              ? 'Ditolak'
                              : claim.status === 'CANCELLED'
                              ? 'Dibatalkan'
                              : '⏳ Menunggu Keputusan Donatur'}
                          </Badge>
                        </div>

                        {claim.message && (
                          <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-w-xl font-medium">
                            <span className="font-bold text-slate-400">Cerita Pengajuanmu:</span>{' '}
                            "{claim.message}"
                          </div>
                        )}

                        <div className="text-xs text-slate-500 font-semibold">
                          Donatur: @{claim.item?.ownerUsername} • Lokasi: {claim.item?.lokasi}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {claim.status === 'ACCEPTED' && (
                          <button
                            onClick={() => setActiveTab('handover')}
                            className="px-4 py-2.5 rounded-xl bg-sage-700 text-white text-xs font-bold hover:bg-sage-800 transition-colors shadow-xs cursor-pointer"
                          >
                            Buka Serah Terima →
                          </button>
                        )}

                        {claim.status === 'PENDING' && (
                          <Button
                            variant="dangerOutline"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleCancelClaim(claim.id)}
                          >
                            Batalkan
                          </Button>
                        )}

                        <Link
                          to={`/items/${claim.item?.id}`}
                          className="px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Lihat Barang
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RIWAYAT SERAH TERIMA */}
          {activeTab === 'handover' && (
            <div>
              {transactions.length === 0 ? (
                <EmptyState
                  icon={<ArrowRightLeft className="w-10 h-10 text-petrol-600" />}
                  title="Belum Ada Transaksi Serah Terima"
                  description="Serah terima otomatis terbuat saat donatur menyetujui klaim barang."
                />
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-white rounded-[2rem] p-5 sm:p-6 border-2 border-sage-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-extrabold text-slate-900 text-base">
                            {tx.item?.namaBarang}
                          </h3>
                          <Badge
                            variant={tx.status === 'COMPLETED' ? 'success' : 'petrol'}
                            size="sm"
                          >
                            {tx.status === 'COMPLETED' ? '✅ Selesai' : '⏳ Proses Serah Terima'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          Donatur: @{tx.giver?.username} ➔ Penerima: @{tx.receiver?.username}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to="/messages"
                          className="px-4 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </Link>
                        <Link
                          to="/transactions"
                          className="px-4 py-2 rounded-xl bg-sage-700 text-white text-xs font-bold hover:bg-sage-800 shadow-xs"
                        >
                          Buka Pelacak Lengkap →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal View & Accept Incoming Claims */}
      <Modal
        isOpen={claimsModalOpen}
        onClose={() => setClaimsModalOpen(false)}
        title="Calon Penerima Barang"
        subtitle={`Pilih pemohon yang paling berhak untuk: ${activeItemForClaims?.namaBarang || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {selectedItemClaims.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              Belum ada pemohon klaim untuk barang ini.
            </div>
          ) : (
            selectedItemClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-5 rounded-3xl border-2 border-sage-200 bg-gradient-to-r from-sage-50/50 to-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sage-700 to-petrol-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {claim.requester?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        @{claim.requester?.username}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Diajukan pada {new Date(claim.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={claim.status === 'ACCEPTED' ? 'success' : 'amber'}
                    size="sm"
                  >
                    {claim.status}
                  </Badge>
                </div>

                {claim.message ? (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    <strong className="text-slate-500 block mb-1">Cerita / Alasan Membutuhkan:</strong>
                    "{claim.message}"
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic font-medium">
                    (Pemohon tidak menyertakan pesan khusus)
                  </div>
                )}

                {claim.status === 'PENDING' && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="gradient"
                      size="sm"
                      isLoading={actionLoading}
                      onClick={() => handleAcceptClaim(claim.id)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="font-extrabold shadow-xs"
                    >
                      Pilih Sebagai Penerima
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
