import React from 'react';

export const CATEGORIES = [
  { id: '', name: 'Semua Kategori', icon: '✨' },
  { id: 'Fashion', name: 'Fashion & Pakaian', icon: '👕' },
  { id: 'Elektronik', name: 'Elektronik & Gadget', icon: '📱' },
  { id: 'Buku', name: 'Buku & Edukasi', icon: '📚' },
  { id: 'Rumah Tangga', name: 'Perabot & Rumah', icon: '🛋️' },
  { id: 'Bayi & Anak', name: 'Bayi & Anak', icon: '🧸' },
  { id: 'Hobi & Olahraga', name: 'Hobi & Olahraga', icon: '🎨' },
  { id: 'Lainnya', name: 'Lainnya', icon: '📦' },
];

export const CategoryPills = ({ selectedCategory = '', onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id || 'all'}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-[#2B4E86] text-white shadow-md shadow-[#2B4E86]/20 scale-[1.02] border border-[#2B4E86]'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#2B4E86] hover:bg-[#F0F5FD]'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
