import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { itemsApi } from '../api/itemsApi';
import { ItemGrid } from '../components/items/ItemGrid';
import { CATEGORIES } from '../components/items/CategoryPills';
import { Button } from '../components/common/Button';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('kategori') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialPage = parseInt(searchParams.get('page') || '0', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(initialPage);
  const [size] = useState(12);

  const [itemsData, setItemsData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (category) params.kategori = category;
    if (status) params.status = status;
    if (page > 0) params.page = page.toString();
    setSearchParams(params, { replace: true });
  }, [searchQuery, category, status, page, setSearchParams]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await itemsApi.getItems({
          q: searchQuery || undefined,
          kategori: category || undefined,
          status: status || undefined,
          sort: 'id',
          direction: sortDirection,
          page,
          size,
        });
        setItemsData({
          content: res?.content || [],
          totalPages: res?.totalPages || 0,
          totalElements: res?.totalElements || 0,
        });
      } catch (err) {
        console.error('Failed to fetch catalog items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery, category, status, sortDirection, page, size]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('');
    setStatus('');
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#F0F5FD] via-white to-[#E8F2FE] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#CFE4FD] shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2FE] text-[#2B4E86] text-xs font-extrabold border border-[#CFE4FD]">
            <Sparkles className="w-3.5 h-3.5 text-[#E08500]" />
            <span>Katalog Komunitas Lengkap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Jelajah Barang Berbagi 🎁
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Temukan ribuan barang layak pakai gratis yang dibagikan oleh sesama warga. Semua siap diajukan klaim tanpa biaya.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-[#CFE4FD] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Cari nama barang atau deskripsi..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 text-sm text-slate-800 outline-none font-medium transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 text-sm text-slate-800 outline-none bg-white transition-all cursor-pointer font-bold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id || 'all'} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#2B4E86] focus:ring-2 focus:ring-[#A5CBFD]/40 text-sm text-slate-800 outline-none bg-white transition-all cursor-pointer font-bold"
            >
              <option value="">Semua Status</option>
              <option value="TERSEDIA">✨ Tersedia Gratis</option>
              <option value="DIPILIH">⏳ Penerima Terpilih</option>
              <option value="SELESAI">✅ Telah Dibagikan</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
          <div className="text-slate-700">
            Menampilkan <span className="text-[#2B4E86] font-extrabold text-sm">{itemsData.totalElements}</span> barang
            {(searchQuery || category || status) && ' dengan filter aktif'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
              className="px-3.5 py-1.5 rounded-xl border-2 border-slate-200 hover:border-[#2B4E86] text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Urutan: {sortDirection === 'desc' ? 'Terbaru' : 'Terlama'}</span>
            </button>

            {(searchQuery || category || status) && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Item Grid */}
      <ItemGrid
        items={itemsData.content}
        loading={loading}
        emptyTitle="Tidak Ada Barang Ditemukan"
        emptyDescription="Coba gunakan kata kunci lain atau ubah pilihan kategori & status."
        emptyActionText="Reset Semua Filter"
        onEmptyAction={handleResetFilters}
        skeletonCount={12}
      />

      {/* Pagination Controls */}
      {itemsData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Sebelumnya
          </Button>

          <span className="px-4 py-1.5 rounded-xl bg-white border-2 border-slate-200 text-xs font-extrabold text-slate-800">
            Halaman {page + 1} dari {itemsData.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= itemsData.totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
};
