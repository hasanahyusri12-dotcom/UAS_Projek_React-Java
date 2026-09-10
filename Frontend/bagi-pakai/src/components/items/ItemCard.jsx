import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, User, Gift, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { getImageUrl } from '../../utils/imageUrl';

export const ItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const statusMap = {
    TERSEDIA: { label: 'Tersedia Gratis', variant: 'sage' },
    MENUNGGU_REVIEW: { label: 'Menunggu Review', variant: 'amber' },
    DIPILIH: { label: 'Penerima Terpilih', variant: 'petrol' },
    SELESAI: { label: 'Telah Dibagikan', variant: 'neutral' },
    DITOLAK: { label: 'Ditolak', variant: 'coral' },
  };

  const statusInfo = statusMap[item.status] || {
    label: item.status || 'Tersedia',
    variant: 'sage',
  };

  const isAvailable = item.status === 'TERSEDIA';
  const resolvedImageUrl = getImageUrl(item.fotoUrl);

  return (
    <div className="group bg-white rounded-3xl p-3.5 border-2 border-[#E1ECFC] hover:border-[#2B4E86] shadow-xs hover-lift flex flex-col justify-between h-full transition-all duration-300">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F0F5FD] to-[#E8F2FE] mb-3.5 border border-slate-100">
          {resolvedImageUrl && !imageError ? (
            <img
              src={resolvedImageUrl}
              alt={item.namaBarang}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#2B4E86] flex items-center justify-center shadow-xs mb-1.5 border border-[#CFE4FD]">
                <Gift className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400">BagiPakai</span>
            </div>
          )}

          {/* Status Badge overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <Badge variant={statusInfo.variant} size="sm" className="shadow-xs backdrop-blur-md">
              {item.status === 'TERSEDIA' && <Sparkles className="w-3 h-3 text-[#2B4E86]" />}
              {statusInfo.label}
            </Badge>
          </div>

          {/* Category Pill overlay */}
          {item.kategori && (
            <div className="absolute bottom-2.5 left-2.5">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-900/80 text-white backdrop-blur-md shadow-xs">
                {item.kategori}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-1 space-y-1.5">
          <Link to={`/items/${item.id}`} className="block group-hover:text-[#2B4E86] transition-colors">
            <h3 className="font-extrabold text-slate-900 text-base line-clamp-1 leading-snug">
              {item.namaBarang}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
            {item.deskripsi || 'Barang siap dibagikan untuk yang membutuhkan.'}
          </p>

          {/* Location & Owner info */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-700 font-medium truncate max-w-[140px]">
              <MapPin className="w-3.5 h-3.5 text-[#2B4E86] shrink-0" />
              <span className="truncate">{item.lokasi || 'Indonesia'}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-600">
              <User className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[90px]">@{item.ownerUsername}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-2">
        <Link
          to={`/items/${item.id}`}
          className={`w-full text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            isAvailable
              ? 'bg-[#2B4E86] text-white hover:bg-[#223F6E] shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
