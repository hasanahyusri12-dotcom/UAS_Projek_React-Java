import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Package,
  ArrowLeft,
  Edit,
  Trash2,
  Gift,
  AlertCircle,
  Lock,
  User,
  CheckCircle2,
} from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClaimModal } from '../components/claims/ClaimModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Loading';
import { ItemCard } from '../components/items/ItemCard';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');
    setImageError(false);

    (async () => {
      try {
        const data = await itemsApi.getItemById(id);
        if (cancelled) return;
        setItem(data);

        // Fetch related items with same category
        if (data?.kategori) {
          try {
            const related = await itemsApi.getItems({
              kategori: data.kategori,
              status: 'TERSEDIA',
              size: 4,
            });
            if (!cancelled) {
              setRelatedItems(
                (related?.content || []).filter((i) => i.id !== data.id)
              );
            }
          } catch {
            // Ignore error
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Barang tidak ditemukan.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus barang ini?')) return;

    try {
      setDeleting(true);
      await itemsApi.deleteItem(id);
      toast.success('Barang berhasil dihapus.');
      navigate('/my-items');
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus barang.');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.namaBarang,
        text: `Lihat barang gratis ini di BagiPakai: ${item?.namaBarang}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan barang berhasil disalin ke clipboard! 📋');
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/items/${item.id}` } });
      return;
    }
    if (user?.username === item.ownerUsername) return;
    try {
      setChatting(true);
      const conv = await chatApi.startConversation(item.id);
      navigate(`/messages?id=${conv.id}`);
    } catch (err) {
      toast.error(err.message || 'Gagal memulai percakapan.');
      setChatting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner text="Memuat detail barang..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Barang Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">
          {error || 'Barang yang kamu cari mungkin sudah dihapus atau tidak tersedia.'}
        </p>
        <Button variant="sage" onClick={() => navigate('/items')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const isOwner = user?.username && user.username === item.ownerUsername;
  const isAvailable = item.status === 'TERSEDIA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-sage-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Main Grid: Photo & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Col: Photo Display (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-sage-50 to-petrol-50 border-2 border-sage-200 shadow-md">
            {item.fotoUrl && !imageError ? (
              <img
                src={item.fotoUrl}
                alt={item.namaBarang}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white text-sage-700 flex items-center justify-center shadow-md mb-3 border border-sage-200">
                  <Gift className="w-10 h-10" />
                </div>
                <p className="text-sm font-black text-slate-600">BagiPakai Indonesia</p>
                <p className="text-xs text-slate-400">Foto barang tidak tersedia</p>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge
                variant={
                  item.status === 'TERSEDIA'
                    ? 'sage'
                    : item.status === 'DIPILIH'
                    ? 'petrol'
                    : item.status === 'SELESAI'
                    ? 'neutral'
                    : 'amber'
                }
                size="lg"
                className="shadow-md backdrop-blur-md"
              >
                {item.status === 'TERSEDIA' ? '✨ Tersedia Gratis' : item.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Col: Info & Action Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-sage-100 shadow-sm space-y-6">
            {/* Category & Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-sage-100 text-sage-900 border border-sage-200">
                {item.kategori || 'Kategori Umum'}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-2xl text-slate-500 hover:text-sage-800 hover:bg-sage-50 transition-colors cursor-pointer border border-slate-200"
                title="Bagikan Tautan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Location */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {item.namaBarang}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-600 font-semibold">
                <MapPin className="w-4 h-4 text-sage-600 shrink-0" />
                <span>{item.lokasi || 'Lokasi belum ditentukan'}</span>
              </div>
            </div>

            {/* Owner Profile Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sage-50 to-petrol-50 border-2 border-sage-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sage-700 to-petrol-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {item.ownerUsername ? item.ownerUsername.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-bold">Pemilik Barang</div>
                  <div className="text-sm font-black text-slate-900">@{item.ownerUsername}</div>
                </div>
              </div>
              <Badge variant="sage" size="sm">
                🌱 Donatur
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isOwner ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-sage-50 border border-sage-200 text-sage-900 text-xs font-semibold">
                    Ini adalah barang yang kamu bagikan. Kamu bisa melihat calon pemohon atau mengubah informasi barang.
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-sage-300 text-sage-900 font-bold text-sm hover:bg-sage-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Barang</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>
                  <Link
                    to="/my-items"
                    className="block text-center w-full py-3 rounded-2xl bg-sage-700 text-white font-extrabold text-sm shadow-md hover:bg-sage-800 transition-colors"
                  >
                    Buka Calon Penerima di Dashboard
                  </Link>
                </div>
              ) : isAuthenticated ? (
                <>
                  {isAvailable ? (
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full shadow-lg shadow-sage-950/15 font-extrabold"
                      onClick={() => setClaimModalOpen(true)}
                      leftIcon={<Heart className="w-5 h-5" />}
                    >
                      Ajukan Klaim Barang Ini
                    </Button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-100 text-slate-700 text-center font-bold text-sm border border-slate-200">
                      Barang ini sedang dalam tahap serah terima atau telah selesai dibagikan.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartChat}
                    disabled={chatting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span>{chatting ? 'Membuka obrolan...' : 'Tanya Pemilik / Diskusi'}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full font-extrabold shadow-md shadow-sage-950/10"
                    onClick={() => navigate('/login', { state: { from: `/items/${item.id}` } })}
                    leftIcon={<Heart className="w-5 h-5" />}
                  >
                    Masuk untuk Mengajukan Klaim
                  </Button>
                  <p className="text-center text-xs text-slate-500 font-medium">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-sage-800 font-bold underline">
                      Daftar Gratis Sekarang
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Safety Reminder */}
            <div className="p-4 rounded-2xl bg-sage-50/80 border-2 border-sage-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-sage-900">
                <ShieldCheck className="w-4 h-4 text-sage-700 shrink-0" />
                <span>Komitmen Berbagi Aman & Gratis</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Seluruh barang di BagiPakai adalah 100% gratis tanpa komisi. Dilarang meminta uang selain ongkir resmi jika kirim via ekspedisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border-2 border-sage-100 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-sage-700" />
          <span>Deskripsi & Kondisi Barang</span>
        </h2>
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
          {item.deskripsi || 'Tidak ada deskripsi rinci untuk barang ini.'}
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">
              Barang Serupa di Kategori {item.kategori}
            </h3>
            <Link
              to={`/items?kategori=${encodeURIComponent(item.kategori)}`}
              className="text-xs sm:text-sm font-extrabold text-sage-800 hover:text-sage-900"
            >
              Lihat Kategori Ini →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedItems.map((rel) => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={item}
        onSuccess={() => {
          setItem((prev) => (prev ? { ...prev } : prev));
        }}
      />
    </div>
  );
};
