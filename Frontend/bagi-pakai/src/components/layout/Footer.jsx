import { Link } from 'react-router-dom';
import { HeartHandshake, Leaf, ShieldCheck, Heart} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-[#CFE4FD] pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E8F2FE]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FEF0DA]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#E08500] flex items-center justify-center text-white shadow-md shadow-[#2B4E86]/20">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Bagi<span className="text-[#E08500]">Pakai</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Platform komunitas berbagi barang layak pakai 100% gratis. Memperpanjang usia manfaat barang,
              mengurangi timbunan sampah, dan mempererat solidaritas sesama warga.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#E8F2FE] text-[#2B4E86] border border-[#A5CBFD]">
                <Leaf className="w-3.5 h-3.5 text-[#2B4E86]" /> Komunitas Berbagi Sirkular
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Jelajahi Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/items" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors flex items-center gap-1">
                  <span>Semua Barang Gratis</span>
                </Link>
              </li>
              <li>
                <Link to="/post-item" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors flex items-center gap-1">
                  <span>+ Bagi Barang Sekarang</span>
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors flex items-center gap-1">
                  <span>Lacak Serah Terima</span>
                </Link>
              </li>
              <li>
                <Link to="/items?status=TERSEDIA" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors flex items-center gap-1">
                  <span>Barang Siap Klaim</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori Populer */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Kategori Favorit
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/items?kategori=Fashion" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors">
                  👗 Pakaian & Fashion
                </Link>
              </li>
              <li>
                <Link to="/items?kategori=Elektronik" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors">
                  📱 Elektronik & Gadget
                </Link>
              </li>
              <li>
                <Link to="/items?kategori=Buku" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors">
                  📚 Buku & Edukasi
                </Link>
              </li>
              <li>
                <Link to="/items?kategori=Rumah%20Tangga" className="text-slate-600 hover:text-[#2B4E86] font-medium transition-colors">
                  🛋️ Perabot & Rumah Tangga
                </Link>
              </li>
            </ul>
          </div>

          {/* Keamanan & Panduan */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Keamanan & Privasi
            </h4>
            <div className="bg-[#F0F5FD] border-2 border-[#CFE4FD] rounded-2xl p-4 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-[#2B4E86]">
                <ShieldCheck className="w-4 h-4 text-[#2B4E86] shrink-0" />
                <span>Privasi Donatur Terjaga</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Alamat detail rumah donatur tidak pernah ditampilkan di katalog publik. Alamat hanya
                diberikan secara privat kepada 1 penerima yang disetujui.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BagiPakai. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1 font-semibold text-slate-600">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" /> untuk kelestarian bumi & kebaikan sesama.
          </div>
        </div>
      </div>
    </footer>
  );
};
