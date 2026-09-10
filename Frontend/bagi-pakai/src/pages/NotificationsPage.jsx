import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Package,
  MessageSquare,
} from 'lucide-react';
import { notificationsApi } from '../api/notificationsApi';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUnread } = useNotifications();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const data = await notificationsApi.getAll();
        if (!cancelled) {
          setNotifications(data || []);
          refreshUnread();
        }
      } catch {
        if (!cancelled) {
          toast.error('Gagal memuat notifikasi.');
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
  }, [refreshUnread, toast]);

  const handleMarkAsRead = async (notif) => {
    if (!notif.read) {
      try {
        await notificationsApi.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
        refreshUnread();
      } catch (e) {
        console.error('Failed to mark read:', e);
      }
    }

    // Direct navigation depending on type
    if (notif.type === 'CLAIM' || notif.type === 'CLAIM_REQUEST') {
      navigate('/my-items');
    } else if (notif.type === 'TRANSACTION' || notif.type === 'TX_RECEIVED' || notif.type === 'TX_COMPLETED') {
      navigate('/transactions');
    } else if (notif.type === 'CHAT') {
      navigate(notif.referenceId ? `/messages?id=${notif.referenceId}` : '/messages');
    } else if (notif.referenceId) {
      navigate(`/items/${notif.referenceId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-[#F0F5FD] via-white to-[#E8F2FE] p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#CFE4FD] shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2FE] text-[#2B4E86] text-xs font-extrabold mb-2 border border-[#CFE4FD]">
            <Bell className="w-3.5 h-3.5 text-[#E08500]" />
            <span>Pusat Notifikasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notifikasi Komunitas 🔔
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Pemberitahuan seputar pengajuan klaim, pesan obrolan baru, dan status moderasi.
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner text="Memuat notifikasi..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10 text-[#2B4E86]" />}
          title="Belum Ada Notifikasi"
          description="Kamu akan menerima pemberitahuan di sini saat ada pemohon barang, pesan baru, atau update klaim."
        />
      ) : (
        <div className="space-y-3.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif)}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? 'bg-[#F0F5FD]/70 border-[#CFE4FD] shadow-xs hover:border-[#2B4E86]'
                  : 'bg-white border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  !notif.read
                    ? 'bg-[#2B4E86] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {notif.type === 'CHAT' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  {notif.type === 'CHAT'
                    ? 'Ada pesan baru dalam obrolan. Klik untuk membuka percakapan.'
                    : notif.message}
                </p>
              </div>

              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#E08500] mt-2 shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};