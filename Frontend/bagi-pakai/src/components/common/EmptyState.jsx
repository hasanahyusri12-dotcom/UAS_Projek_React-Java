import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title = 'Belum Ada Barang',
  description = 'Saat ini belum ada data yang dapat ditampilkan.',
  actionText,
  onAction,
  actionLink,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-14 rounded-[2.5rem] bg-white border-2 border-dashed border-[#CFE4FD] ${className}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#E8F2FE] to-[#FEF0DA] flex items-center justify-center text-[#2B4E86] mb-4 shadow-xs border border-[#CFE4FD]">
        {icon || <PackageOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#2B4E86]" />}
      </div>
      <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 font-medium leading-relaxed">{description}</p>
      {actionText && (onAction || actionLink) && (
        <Button
          onClick={onAction}
          variant="primary"
          size="md"
          className="shadow-xs font-extrabold"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
