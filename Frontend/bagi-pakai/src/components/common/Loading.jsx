import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', text = 'Memuat data...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-3 border-[#CFE4FD] border-t-[#2B4E86] animate-spin" />
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-3 border border-[#E1ECFC] shadow-sm animate-pulse flex flex-col">
      <div className="aspect-[4/3] bg-slate-100 rounded-2xl w-full mb-3" />
      <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2 mb-4" />
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-6 bg-slate-100 rounded-full w-16" />
      </div>
    </div>
  );
};
