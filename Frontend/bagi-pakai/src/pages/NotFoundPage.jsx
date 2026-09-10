import { Link } from 'react-router-dom';
import { PackageX, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-[#E8F2FE] text-[#2B4E86] flex items-center justify-center mb-4 shadow-sm border border-[#CFE4FD]">
        <PackageX className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-[#2B4E86] tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-slate-500 max-w-md mb-8 font-medium">
        Halaman yang kamu tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang dimasukkan
        kurang tepat.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
};
