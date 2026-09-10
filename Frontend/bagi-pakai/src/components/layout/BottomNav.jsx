import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  LayoutDashboard,
  ArrowRightLeft,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-[#CFE4FD] px-2 py-2 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around relative max-w-lg mx-auto">
        {/* Item 1: Beranda (Guest) / Jelajah (Auth) */}
        {!isAuthenticated ? (
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Beranda</span>
            {isActive('/') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        ) : (
          <Link
            to="/items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/items')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${isActive('/items') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Jelajah</span>
            {isActive('/items') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        )}

        {/* Item 2: Jelajah (Guest) / Transaksi Serah Terima (Auth) */}
        {!isAuthenticated ? (
          <Link
            to="/items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/items')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${isActive('/items') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Jelajah</span>
            {isActive('/items') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        ) : (
          <Link
            to="/transactions"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/transactions')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ArrowRightLeft
              className={`w-5 h-5 ${isActive('/transactions') ? 'stroke-[2.5]' : 'stroke-2'}`}
            />
            <span className="text-[10px]">Transaksi</span>
            {isActive('/transactions') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        )}

        {/* Center Prominent CTA (+ Bagi Barang) */}
        <div className="-mt-6">
          <Link
            to={isAuthenticated ? '/post-item' : '/login'}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#2B4E86] to-[#E08500] hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-[#2B4E86]/35 active:scale-95 transition-all border-4 border-white"
            title="Bagi Barang Baru"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </Link>
        </div>

        {/* Item 3: Pesan / Chat */}
        <Link
          to={isAuthenticated ? '/messages' : '/login'}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
            isActive('/messages')
              ? 'text-[#2B4E86] font-black scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare
            className={`w-5 h-5 ${isActive('/messages') ? 'stroke-[2.5]' : 'stroke-2'}`}
          />
          <span className="text-[10px]">Pesan</span>
          {isActive('/messages') && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
          )}
        </Link>

        {/* Item 4: Masuk (Guest) / Dashboard (Auth) */}
        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/login')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LogIn className={`w-5 h-5 ${isActive('/login') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Masuk</span>
            {isActive('/login') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        ) : (
          <Link
            to="/my-items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
              isActive('/my-items') || isActive('/profile')
                ? 'text-[#2B4E86] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${
                isActive('/my-items') || isActive('/profile') ? 'stroke-[2.5]' : 'stroke-2'
              }`}
            />
            <span className="text-[10px]">Dashboard</span>
            {(isActive('/my-items') || isActive('/profile')) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B4E86] absolute -bottom-1" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
};
