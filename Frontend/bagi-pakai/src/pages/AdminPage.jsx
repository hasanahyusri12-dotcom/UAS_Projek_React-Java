import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserCheck,
  UserX,
  Gift,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';
import { getImageUrl } from '../utils/imageUrl';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'users'
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();
  const { confirm } = useConfirm();

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [dash, pending, users] = await Promise.all([
        adminApi.getDashboard().catch(() => null),
        adminApi.getPendingItems().catch(() => []),
        adminApi.getUsers().catch(() => []),
      ]);
      setDashboardData(dash);
      setPendingItems(pending || []);
      setUsersList(users || []);
} catch {
  toast.error('Gagal memuat daftar pemohon.');
}  finally {
      setLoading(false);
    }
  };

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch awal saat mount, ini pola yang direkomendasikan
  loadAdminData();
}, []);

  const handleApprove = async (item) => {
    const isOk = await confirm({
      title: 'Setujui Barang Masuk?',
      message: `Apakah Anda yakin ingin menyetujui "${item.namaBarang}"? Barang akan langsung tampil di katalog publik dan siap diajukan klaim oleh warga.`,
      confirmText: 'Ya, Setujui Barang',
      cancelText: 'Batal',
      variant: 'success',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      await adminApi.approveItem(item.id);
      toast.success('Barang berhasil disetujui dan kini berstatus TERSEDIA! ✨');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Gagal menyetujui barang.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (item) => {
    const isOk = await confirm({
      title: 'Tolak Barang Masuk?',
      message: `Apakah Anda yakin ingin menolak "${item.namaBarang}"? Barang ini tidak akan dipublikasikan ke katalog warga.`,
      confirmText: 'Ya, Tolak Barang',
      cancelText: 'Batal',
      variant: 'danger',
      icon: <XCircle className="w-6 h-6 text-rose-600" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      await adminApi.rejectItem(item.id);
      toast.info('Barang berhasil ditolak.');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Gagal menolak barang.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isSuspending = user.active;
    const isOk = await confirm({
      title: isSuspending ? 'Nonaktifkan Akun Pengguna?' : 'Aktifkan Akun Pengguna?',
      message: isSuspending
        ? `Apakah Anda yakin ingin menonaktifkan akun @${user.username}? Pengguna tidak akan dapat masuk atau membuat pengajuan.`
        : `Apakah Anda yakin ingin mengaktifkan kembali akun @${user.username}?`,
      confirmText: isSuspending ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
      cancelText: 'Batal',
      variant: isSuspending ? 'danger' : 'success',
      icon: isSuspending ? <UserX className="w-6 h-6 text-rose-600" /> : <UserCheck className="w-6 h-6 text-emerald-600" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      if (user.active) {
        await adminApi.suspendUser(user.id);
        toast.info(`Akun @${user.username} dinonaktifkan.`);
      } else {
        await adminApi.activateUser(user.id);
        toast.success(`Akun @${user.username} diaktifkan kembali.`);
      }
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah status user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (u) => {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const isOk = await confirm({
      title: 'Ubah Role Pengguna?',
      message: `Apakah Anda yakin ingin mengubah hak akses @${u.username} menjadi ${newRole}?`,
      confirmText: `Ya, Ubah ke ${newRole}`,
      cancelText: 'Batal',
      variant: 'warning',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
    });

    if (!isOk) return;

    try {
      setActionLoading(true);
      await adminApi.changeRole(u.id, newRole);
      toast.success(`Role akun @${u.username} berhasil diubah menjadi ${newRole}.`);
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah role user.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2B4E86] via-[#15253F] to-[#E08500] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl shadow-[#2B4E86]/15 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white mb-1 border border-white/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Panel Admin & Moderasi Komunitas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Pusat Kontrol BagiPakai ⭐
        </h1>
        <p className="text-white/90 text-xs sm:text-sm max-w-2xl font-medium">
          Tinjau barang yang baru diunggah warga, kelola akun pengguna, dan pantau statistik aktivitas platform secara transparan.
        </p>
      </div>

      {/* Metrics Row */}
      {dashboardData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border-2 border-[#CFE4FD] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2FE] text-[#2B4E86] flex items-center justify-center shrink-0 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {dashboardData.totalUsers ?? 0}
              </div>
              <div className="text-xs text-slate-500 font-bold">Total Pengguna</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#CFE4FD] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F5FD] text-[#2B4E86] flex items-center justify-center shrink-0 font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {dashboardData.totalItems ?? 0}
              </div>
              <div className="text-xs text-slate-500 font-bold">Total Barang</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#FAC780] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF0DA] text-[#E08500] flex items-center justify-center shrink-0 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {dashboardData.pendingItems ?? 0}
              </div>
              <div className="text-xs text-slate-500 font-bold">Menunggu Review</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {dashboardData.completedTransactions ?? 0}
              </div>
              <div className="text-xs text-slate-500 font-bold">Serah Selesai</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
              : 'text-slate-600 hover:bg-slate-100 font-bold'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Moderasi Barang Baru ({pendingItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20'
              : 'text-slate-600 hover:bg-slate-100 font-bold'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna ({usersList.length})</span>
        </button>
      </div>

      {loading ? (
        <Spinner text="Memuat data admin..." />
      ) : (
        <>
          {/* TAB 1: MODERATION */}
          {activeTab === 'moderation' && (
            <div>
              {pendingItems.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="w-10 h-10 text-emerald-600" />}
                  title="Semua Barang Telah Dimoderasi! 🎉"
                  description="Tidak ada barang baru yang menunggu persetujuan saat ini."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingItems.map((item) => {
                    const resolvedPendingImg = getImageUrl(item.fotoUrl);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-[2rem] p-5 border-2 border-[#FAC780] shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                            {resolvedPendingImg ? (
                              <img
                                src={resolvedPendingImg}
                                alt={item.namaBarang}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-1">
                                <Gift className="w-5 h-5 text-slate-300" />
                                <span>Tanpa Foto</span>
                              </div>
                            )}
                            <div className="absolute top-2.5 left-2.5">
                              <Badge variant="amber" size="sm">
                                Menunggu Review
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-black text-slate-900 text-base">
                              {item.namaBarang}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-3 font-medium">
                              {item.deskripsi}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#F0F5FD] text-xs text-slate-700 space-y-1 font-semibold border border-[#CFE4FD]">
                            <div>
                              Pengunggah: <strong className="text-slate-900">@{item.ownerUsername}</strong>
                            </div>
                            <div>
                              Kategori: <strong className="text-[#2B4E86]">{item.kategori}</strong>
                            </div>
                            <div>
                              Lokasi: <strong className="text-slate-900">{item.lokasi}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Moderation Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <Button
                            variant="action"
                            size="sm"
                            isLoading={actionLoading}
                            onClick={() => handleApprove(item)}
                            leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            className="font-extrabold"
                          >
                            Setujui
                          </Button>
                          <Button
                            variant="dangerOutline"
                            size="sm"
                            isLoading={actionLoading}
                            onClick={() => handleReject(item)}
                            leftIcon={<XCircle className="w-4 h-4" />}
                            className="font-extrabold"
                          >
                            Tolak
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-[2rem] border-2 border-[#CFE4FD] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
                  <thead className="bg-[#F0F5FD] border-b-2 border-[#CFE4FD] text-xs font-black text-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Pengguna</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F0F5FD]/50 transition-colors">
                        <td className="px-6 py-4 font-black text-slate-900 flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2B4E86] to-[#15253F] text-white flex items-center justify-center font-black text-xs shadow-xs">
                            {u.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>@{u.username}</div>
                            <div className="text-xs text-slate-400 font-normal">{u.fullName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={u.role === 'ADMIN' ? 'amber' : 'neutral'} size="sm">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={u.active ? 'success' : 'coral'} size="sm">
                            {u.active ? 'Aktif' : 'Dinonaktifkan'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleChangeRole(u)}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 rounded-xl border-2 border-slate-200 text-xs font-extrabold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            {u.role === 'ADMIN' ? 'Jadikan User' : 'Jadikan Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={actionLoading}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                              u.active
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {u.active ? 'Suspend' : 'Aktifkan'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
