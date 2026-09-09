import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, LayoutDashboard, ArrowRightLeft, LogIn } from 'lucide-react';
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
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-[#CFE4FD] px-3 py-2 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around relative">
        {/* If Guest: Show Beranda. If Authenticated: DO NOT show Beranda */}
        {!isAuthenticated ? (
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Beranda</span>
          </Link>
        ) : (
          <Link
            to="/items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/items') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${isActive('/items') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Jelajah</span>
          </Link>
        )}

        {/* Guest: Jelajah | Authenticated: Serah Terima */}
        {!isAuthenticated ? (
          <Link
            to="/items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/items') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className={`w-5 h-5 ${isActive('/items') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Jelajah</span>
          </Link>
        ) : (
          <Link
            to="/transactions"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/transactions') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ArrowRightLeft className={`w-5 h-5 ${isActive('/transactions') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Transaksi</span>
          </Link>
        )}

        {/* Center Floating CTA (+ Bagi) */}
        <div className="-mt-6">
          <Link
            to={isAuthenticated ? '/post-item' : '/login'}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2B4E86] to-[#E08500] text-white flex items-center justify-center shadow-lg shadow-[#2B4E86]/25 active:scale-95 transition-transform border-2 border-white"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </Link>
        </div>

        {/* Chat / Pesan */}
        <Link
          to={isAuthenticated ? '/messages' : '/login'}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl relative transition-all ${
            isActive('/messages') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare
            className={`w-5 h-5 ${isActive('/messages') ? 'stroke-[2.5]' : 'stroke-2'}`}
          />
          <span className="text-[10px]">Pesan</span>
        </Link>

        {/* Guest: Masuk | Authenticated: Dashboard */}
        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/login') ? 'text-[#2B4E86] font-extrabold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LogIn className={`w-5 h-5 ${isActive('/login') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px]">Masuk</span>
          </Link>
        ) : (
          <Link
            to="/my-items"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive('/my-items') || isActive('/profile')
                ? 'text-[#2B4E86] font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${
                isActive('/my-items') || isActive('/profile') ? 'stroke-[2.5]' : 'stroke-2'
              }`}
            />
            <span className="text-[10px]">Dashboard</span>
          </Link>
        )}
      </div>
    </div>
  );
};
