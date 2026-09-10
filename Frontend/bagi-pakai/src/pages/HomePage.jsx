import { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Leaf,
  Gift,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Package,
  ChevronDown,
  Lock,
  Heart,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { ItemGrid } from '../components/items/ItemGrid';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const HomePage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ecoItemsCount, setEcoItemsCount] = useState(3);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [stats, setStats] = useState({
    totalAvailable: 0,
    totalShared: 0,
    totalAll: 0,
  });

  // Category list with real category query links
  const CATEGORY_ITEMS = [
    {
      id: 'Fashion',
      name: 'Fashion & Pakaian',
      icon: '👗',
      desc: 'Baju, celana, jaket & tas',
      badge: 'Banyak Dicari',
    },
    {
      id: 'Elektronik',
      name: 'Elektronik & Gadget',
      icon: '📱',
      desc: 'HP, kabel, peranti & gadget',
      badge: 'Populer',
    },
    {
      id: 'Buku',
      name: 'Buku & Edukasi',
      icon: '📚',
      desc: 'Novel, pelajaran, komik & ensiklopedia',
      badge: 'Bermanfaat',
    },
    {
      id: 'Rumah Tangga',
      name: 'Perabot & Rumah',
      icon: '🛋️',
      desc: 'Meja, rak, kursi & alat dapur',
      badge: 'Praktis',
    },
    {
      id: 'Bayi & Anak',
      name: 'Bayi & Mainan',
      icon: '🧸',
      desc: 'Stroller, pakaian bayi, boneka',
      badge: 'Penuh Kasih',
    },
    {
      id: 'Hobi & Olahraga',
      name: 'Hobi & Olahraga',
      icon: '🎨',
      desc: 'Alat musik, raket, kanvas & hobi',
      badge: 'Unik',
    },
  ];

  // FAQ List
  const FAQS = [
    {
      q: 'Apakah semua barang di BagiPakai benar-benar 100% gratis?',
      a: 'Ya, 100% GRATIS tanpa biaya tersembunyi, tanpa sistem barter wajib, dan tanpa komisi. Di BagiPakai, semua barang murni dibagikan oleh sesama warga yang ingin memberi manfaat kedua bagi barang yang sudah tidak mereka pakai.',
    },
    {
      q: 'Bagaimana keamanan alamat rumah donatur dijaga?',
      a: 'Pada katalog publik, BagiPakai HANYA menampilkan Area/Kota (contoh: "Kebayoran Baru, Jakarta Selatan") agar privasi Anda terlindungi. Alamat penjemputan privat hanya diberikan kepada 1 calon penerima yang SUDAH Anda setujui secara resmi melalui Dashboard & Chat.',
    },
    {
      q: 'Bagaimana penanganan ongkos kirim jika menggunakan ekspedisi?',
      a: 'Jika serah terima dilakukan lewat jasa kurir/ekspedisi (bukan COD), ongkos kirim resmi disepakati bersama dan ditanggung oleh penerima barang. Donatur tidak dibebani biaya pengiriman.',
    },
    {
      q: 'Bagaimana cara donatur memilih siapa penerima barangnya?',
      a: 'Setiap pemohon klaim akan menuliskan alasan/cerita mengapa mereka membutuhkan barang tersebut. Donatur dapat membaca seluruh pengajuan di "Dashboard Saya" dan memilih 1 penerima terbaik dengan satu klik konfirmasi.',
    },
    {
      q: 'Apakah saya bisa membagikan barang yang memiliki sedikit minus/kekurangan?',
      a: 'Tentu bisa! Yang terpenting adalah kejujuran kondisi. Donatur cukup mendeskripsikan secara transparan kondisi barang (misal: "kondisi 80%, ada sedikit goresan halus namun fungsi normal").',
    },
  ];

  // Load Real Data from Backend API
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);

        // 1. Fetch real available items for the showcase grid
        const itemsRes = await itemsApi.getItems({
          status: 'TERSEDIA',
          size: 8,
          sort: 'id',
          direction: 'desc',
        });
        setItems(itemsRes?.content || []);

        // 2. Fetch real counts for statistics
        const [availableRes, sharedRes, allRes] = await Promise.all([
          itemsApi.getItems({ status: 'TERSEDIA', size: 1 }).catch(() => null),
          itemsApi.getItems({ status: 'SELESAI', size: 1 }).catch(() => null),
          itemsApi.getItems({ size: 1 }).catch(() => null),
        ]);

        setStats({
          totalAvailable: availableRes?.totalElements || itemsRes?.totalElements || 0,
          totalShared: sharedRes?.totalElements || 0,
          totalAll: allRes?.totalElements || 0,
        });
      } catch (err) {
        console.error('Error fetching real landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (Deep Blue & Amber Theme matching mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="rounded-[3rem] bg-gradient-to-b from-white via-[#F0F5FD]/60 to-[#E8F2FE]/40 border-2 border-[#CFE4FD] p-8 sm:p-14 lg:p-16 shadow-xl shadow-[#2B4E86]/5 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          {/* Decorative badges */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#A5CBFD] text-[#2B4E86] text-xs sm:text-sm font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#E08500]" />
            <span>Platform Komunitas Berbagi Barang 100% Gratis</span>
          </div>

          {/* Slogan from Mockup */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Berbagi Barang, <span className="text-[#E08500]">Membantu Sesama</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Platform untuk berbagi barang yang masih layak pakai kepada yang membutuhkan. Bersama kita bisa
            mengurangi pemborosan dan menciptakan dampak baik untuk lingkungan.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-2 sm:p-2.5 rounded-3xl border-2 border-[#CFE4FD] focus-within:border-[#2B4E86] shadow-md shadow-[#2B4E86]/5 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto transition-colors"
          >
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Search className="w-5 h-5 text-[#2B4E86] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pakaian, buku, elektronik, perabot..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none font-semibold placeholder:text-slate-400 py-2.5"
              />
            </div>
            <Button
              type="submit"
              variant="action"
              size="md"
              className="w-full sm:w-auto rounded-2xl shrink-0 font-extrabold shadow-xs"
            >
              Cari Barang
            </Button>
          </form>

          {/* Quick Action Buttons (Mulai Sekarang & Pelajari Lebih Lanjut) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#E08500]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mulai Sekarang</span>
            </Link>
            <a
              href="#fitur-utama"
              className="px-7 py-3.5 rounded-2xl bg-white border-2 border-[#2B4E86]/30 hover:border-[#2B4E86] text-[#2B4E86] hover:bg-[#F0F5FD] font-extrabold text-xs sm:text-sm transition-all shadow-xs"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold border-t border-slate-200/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2B4E86]" /> 100% Gratis Tanpa Biaya
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#2B4E86]" /> Alamat Rumah Donatur Privat
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E08500]" /> Verifikasi Moderasi Admin
            </span>
          </div>
        </div>
      </section>

      {/* 4 FEATURE HIGHLIGHT CARDS (MATCHING MOCKUP UI) */}
      <section id="fitur-utama" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-2 hover-lift transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2FE] text-[#2B4E86] flex items-center justify-center mx-auto mb-3 border border-[#CFE4FD]">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Ramah Lingkungan</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Mengurangi timbunan barang layak pakai yang terbuang sia-sia ke tempat pembuangan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-2 hover-lift transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF0DA] text-[#E08500] flex items-center justify-center mx-auto mb-3 border border-[#FAC780]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Bantu Sesama</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Berbagi langsung kepada sesama warga dan keluarga yang benar-benar membutuhkan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-2 hover-lift transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2FE] text-[#2B4E86] flex items-center justify-center mx-auto mb-3 border border-[#CFE4FD]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Aman & Terpercaya</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Proses verifikasi anggota, moderasi data barang, dan privasi alamat rumah terlindungi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-2 hover-lift transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF0DA] text-[#E08500] flex items-center justify-center mx-auto mb-3 border border-[#FAC780]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Mudah Digunakan</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Cukup beberapa langkah praktis untuk mengunggah atau mengajukan klaim barang.
            </p>
          </div>
        </div>
      </section>

      {/* 2. REAL COMMUNITY IMPACT STATS (DATA RIIL DARI DATABASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-1 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF0DA] text-[#E08500] flex items-center justify-center mx-auto mb-3 font-black">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-slate-900">
              {stats.totalAvailable}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600">Barang Tersedia</div>
            <div className="text-[11px] text-[#E08500] font-semibold">Siap diajukan klaim</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-1 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2FE] text-[#2B4E86] flex items-center justify-center mx-auto mb-3 font-black">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-slate-900">
              {stats.totalShared}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600">Barang Tersalurkan</div>
            <div className="text-[11px] text-[#2B4E86] font-semibold">Transaksi serah terima selesai</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-1 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF0DA] text-[#E08500] flex items-center justify-center mx-auto mb-3 font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-slate-900">
              {stats.totalAll}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600">Total Kebaikan</div>
            <div className="text-[11px] text-[#E08500] font-semibold">Dari donatur seluruh wilayah</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E1ECFC] shadow-xs text-center space-y-1 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F8F0] text-[#16A34A] flex items-center justify-center mx-auto mb-3 font-black">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-slate-900">
              {Math.max(1, stats.totalAll * 2.5).toFixed(1)} Kg
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600">Potensi Sampah Dicegah</div>
            <div className="text-[11px] text-[#16A34A] font-semibold">Daur manfaat sirkular bumi</div>
          </div>
        </div>
      </section>

      {/* 3. REAL ITEMS SHOWCASE (BARANG TERBARU DARI DATABASE API) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2FE] text-[#2B4E86] text-xs font-extrabold mb-2 border border-[#A5CBFD]">
              <Gift className="w-3.5 h-3.5 text-[#2B4E86]" />
              <span>Katalog Data Riil</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Barang Tersedia Siap Diklaim 🎁
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Semua barang di bawah ini benar-benar diunggah oleh sesama warga dan siap diajukan klaim.
            </p>
          </div>
          <Link
            to="/items"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#2B4E86] hover:text-[#223F6E] transition-colors"
          >
            <span>Buka Semua Katalog ({stats.totalAvailable} Barang)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Item Grid */}
        <ItemGrid
          items={items}
          loading={loading}
          emptyTitle="Belum Ada Barang yang Tersedia"
          emptyDescription="Jadilah orang pertama yang membagikan barang bermanfaat untuk sesama warga!"
          emptyActionText="+ Mulai Bagi Barang Sekarang"
          onEmptyAction={() => navigate('/register')}
          skeletonCount={8}
        />
      </section>

      {/* 4. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" size="md">
            Pilihan Kategori
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Jelajahi Berdasarkan Kategori
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Temukan barang yang kamu butuhkan atau bagikan barang sesuai kategori yang tepat.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.id}
              to={`/items?kategori=${encodeURIComponent(cat.id)}`}
              className="bg-white border-2 border-[#E1ECFC] hover:border-[#2B4E86] rounded-3xl p-5 flex flex-col items-center text-center justify-between hover-lift transition-all group shadow-xs"
            >
              <div className="text-4xl mb-3 group-hover:scale-115 transition-transform duration-300">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
              <span className="mt-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F2FE] text-[#2B4E86] border border-[#A5CBFD]">
                {cat.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 LANGKAH MUDAH) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] p-8 sm:p-14 border-2 border-[#CFE4FD] shadow-sm space-y-10">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <Badge variant="amber" size="md">
              Alur Transparan & Adil
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              3 Langkah Berbagi di BagiPakai
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tanpa repot tawar-menawar harga, tanpa risiko spam alamat pribadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-[#F0F5FD] border-2 border-[#CFE4FD] text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2B4E86] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
                1
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Foto & Upload Barang</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unggah foto barang, jelaskan kondisi sejujurnya, dan pilih Area/Kota. Alamat rumah detail tetap privat.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF9F0] border-2 border-[#FAC780] text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E08500] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
                2
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Pilih Calon Penerima</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Baca cerita dan alasan dari pemohon di Dashboard Anda, lalu pilih 1 penerima yang paling membutuhkan dengan 1 klik.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F0F5FD] border-2 border-[#CFE4FD] text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2B4E86] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
                3
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Serah Terima & Konfirmasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Koordinasikan penjemputan COD di tempat umum atau kirim via ekspedisi dengan ongkir ditanggung penerima.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIVACY & SAFETY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#15253F] via-[#1B3156] to-[#0E182A] rounded-[3rem] p-8 sm:p-14 text-white shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Prinsip Keamanan & Privasi BagiPakai</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Kenapa Berbagi di BagiPakai Tenang & Aman?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kami merancang sistem dengan mengutamakan perlindungan data pribadi dan kenyamanan setiap warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#A5CBFD]/20 text-[#A5CBFD] flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Privasi Alamat Donatur</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Di katalog publik hanya tampil Kota/Kecamatan. Alamat patokan detail hanya terbuka untuk penerima yang disetujui.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Hak Penuh Memilih Penerima</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bukan sistem rebutan cepat. Donatur berhak membaca alasan pengajuan dan memilih penerima yang paling layak.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Pelacak Serah Terima Resmi</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Setiap persetujuan menghasilkan pelacak transaksi serah terima dan ruang obrolan langsung yang terenkripsi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE ECO-IMPACT CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1B3156] via-[#223F6E] to-[#15253F] rounded-[3rem] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Kalkulator Kebaikan & Dampak Bumi</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Seberapa Besar Dampak Kebaikanmu?
            </h2>

            <p className="text-xs sm:text-sm text-[#A5CBFD] max-w-xl mx-auto font-medium">
              Geser jumlah barang yang ingin kamu bagikan dan lihat dampak nyata terhadap lingkungan
              dan sesama warga!
            </p>

            {/* Slider */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 max-w-lg mx-auto space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-[#A5CBFD]">Jumlah Barang Dibagi:</span>
                <span className="text-2xl font-black text-amber-400">{ecoItemsCount} Barang</span>
              </div>

              <input
                type="range"
                min="1"
                max="25"
                value={ecoItemsCount}
                onChange={(e) => setEcoItemsCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-white/20 rounded-lg"
              />

              <div className="flex justify-between text-[11px] text-[#A5CBFD] font-bold">
                <span>1 Barang</span>
                <span>12 Barang</span>
                <span>25 Barang</span>
              </div>
            </div>

            {/* Impact Results Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {(ecoItemsCount * 2.4).toFixed(1)} Kg
                </div>
                <div className="text-xs text-[#A5CBFD] mt-1 font-bold">Sampah Dicegah</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                <div className="text-2xl sm:text-3xl font-black text-cyan-300">
                  {(ecoItemsCount * 5.8).toFixed(1)} Kg CO₂
                </div>
                <div className="text-xs text-[#A5CBFD] mt-1 font-bold">Jejak Karbon Ditekan</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {ecoItemsCount} Warga
                </div>
                <div className="text-xs text-[#A5CBFD] mt-1 font-bold">Tersenyum Terbantu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 border-2 border-[#CFE4FD] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <Badge variant="primary" size="sm">
              Tanya Jawab
            </Badge>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-slate-900 hover:text-[#2B4E86] transition-colors gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#2B4E86]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-gradient-to-r from-[#2B4E86] to-[#1B3156] p-8 sm:p-14 text-white text-center shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-xl mx-auto">
            Mulai Berbagi Kebaikan Hari Ini!
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto leading-relaxed font-medium">
            Satu barang dari lemarimu yang sudah tidak dipakai bisa menjadi kebahagiaan dan manfaat besar bagi sesama.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#E08500]/25 transition-all hover:scale-105 active:scale-95"
            >
              Daftar Akun Gratis Sekarang
            </Link>
            <Link
              to="/items"
              className="px-8 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs sm:text-sm backdrop-blur-md transition-all border border-white/20"
            >
              Jelajah Barang Gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
